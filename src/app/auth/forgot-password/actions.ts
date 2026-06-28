"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { sql } from "@/lib/db";
import { redis } from "@/lib/redis";
import { resend, RESEND_FROM_EMAIL } from "@/lib/resend";
import { Ratelimit } from "@upstash/ratelimit";
import { captureException } from "@/lib/monitoring";

export async function requestPasswordReset(
  email: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!email?.trim()) return { success: false, error: "Email is required." };
  if (!sql) return { success: false, error: "Service unavailable." };

  // Rate limit: 3 attempts per IP per hour + 1 per email per hour
  if (redis) {
    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerStore.get("x-real-ip") ??
      "unknown";

    const ipLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "ratelimit:forgot_ip",
    });
    const emailLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1, "1 h"),
      prefix: "ratelimit:forgot_email",
    });

    const [ipResult, emailResult] = await Promise.all([
      ipLimiter.limit(ip),
      emailLimiter.limit(email.toLowerCase()),
    ]);

    if (!ipResult.success || !emailResult.success) {
      return {
        success: false,
        error: "Too many attempts. Please wait an hour before trying again.",
      };
    }
  }

  // Always return success to the client regardless of whether the email
  // exists — prevents user enumeration (attacker can't tell valid emails)
  let userEmail: string | null = null;
  try {
    const rows = await sql`
      SELECT email FROM users
      WHERE email = ${email.toLowerCase()} AND email_verified = true
    `;
    if (rows[0]) userEmail = rows[0].email as string;
  } catch (err) {
    captureException(err, { action: "forgot_password_db", email });
    // Still return success to not leak info
    return { success: true };
  }

  // If user exists and redis + resend are configured, send the reset email
  if (userEmail && redis && resend) {
    try {
      const token = randomUUID();
      // 1 hour TTL — short window for a password reset link
      await redis.set(`password_reset:${token}`, userEmail, { ex: 3600 });

      const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${token}`;

      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: userEmail,
        subject: "Reset your password — Sainik School Kapurthala Merch",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; background:#2c0a0a; padding:32px; color:#f5f0e8;">
            <h1 style="font-family: Georgia, serif; color:#c9a84c; font-size:24px; margin-bottom:16px;">
              Password Reset
            </h1>
            <p style="margin-bottom:16px;">
              We received a request to reset the password for your Sainik School Kapurthala Merch account.
            </p>
            <p style="margin-bottom:24px;">
              Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
            </p>
            <p style="margin:24px 0;">
              <a href="${resetUrl}"
                 style="background:#c9a84c; color:#1a0606; padding:12px 24px; text-decoration:none; font-weight:600; font-size:13px; letter-spacing:0.1em; display:inline-block;">
                RESET PASSWORD
              </a>
            </p>
            <p style="font-size:12px; color:#a89080; margin-top:16px;">
              If you did not request this, ignore this email — your password will not change.
            </p>
            <p style="margin-top:24px; letter-spacing:0.2em; font-size:11px; color:#a89080;">
              DISCIPLINE · HONOUR · SERVICE
            </p>
          </div>
        `,
      });
    } catch (err) {
      captureException(err, { action: "forgot_password_send", email });
      // Silent — don't leak whether email exists
    }
  }

  // Always return success regardless — prevents email enumeration
  return { success: true };
}
