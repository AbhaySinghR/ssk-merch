"use server";

import { hash } from "argon2";
import { sql } from "@/lib/db";
import { redis } from "@/lib/redis";
import { bumpTokenVersion } from "@/lib/auth";
import { captureException } from "@/lib/monitoring";

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!token) return { success: false, error: "Invalid reset link." };
  if (!password || password.length < 8)
    return { success: false, error: "Password must be at least 8 characters." };
  if (!sql) return { success: false, error: "Service unavailable." };
  if (!redis) return { success: false, error: "Service unavailable." };

  // Look up the token — single use, 1h TTL
  let email: string | null;
  try {
    email = await redis.get<string>(`password_reset:${token}`);
  } catch (err) {
    captureException(err, { action: "reset_password_redis_get" });
    return { success: false, error: "Service unavailable. Please try again." };
  }

  if (!email) {
    return {
      success: false,
      error: "This reset link has expired or already been used. Please request a new one.",
    };
  }

  // Delete token immediately — single use, prevents replay
  try {
    await redis.del(`password_reset:${token}`);
  } catch (err) {
    captureException(err, { action: "reset_password_redis_del" });
    // Non-fatal — continue, the update will still work
  }

  // Hash new password
  let passwordHash: string;
  try {
    passwordHash = await hash(password);
  } catch (err) {
    captureException(err, { action: "reset_password_hash" });
    return { success: false, error: "Failed to set password. Please try again." };
  }

  // Update the password
  let result;
  try {
    result = await sql`
      UPDATE users
      SET password_hash = ${passwordHash}
      WHERE email = ${email} AND email_verified = true
      RETURNING id
    `;
  } catch (err) {
    captureException(err, { action: "reset_password_db", email });
    return { success: false, error: "Failed to update password. Please try again." };
  }

  if (result.length === 0) {
    return { success: false, error: "Account not found." };
  }

  // Bump token version — invalidates ALL existing sessions for this user
  // so a stolen account can't stay logged in after a password reset
  const userId = result[0].id as string;
  await bumpTokenVersion(userId);

  return { success: true };
}
