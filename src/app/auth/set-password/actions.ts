"use server";

import { hash } from "argon2";
import { sql } from "@/lib/db";
import { redis } from "@/lib/redis";
import { bumpTokenVersion } from "@/lib/auth";

export async function setPassword(
  otp: string,
  password: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!sql) return { success: false, error: "Database not configured." };
  if (!redis) return { success: false, error: "Service unavailable." };
  if (!otp) return { success: false, error: "Invalid request — missing token." };
  if (password.length < 8)
    return { success: false, error: "Password must be at least 8 characters." };

  // Look up the one-time token issued by /auth/verify
  let email: string | null;
  try {
    email = await redis.get<string>(`set_password_otp:${otp}`);
  } catch (err) {
    console.error("[setPassword] Redis OTP get failed:", err);
    return { success: false, error: "Service unavailable. Please try again." };
  }

  if (!email) {
    return {
      success: false,
      error: "This link has expired or already been used. Please re-verify your email.",
    };
  }

  // Consume immediately — single use
  try {
    await redis.del(`set_password_otp:${otp}`);
  } catch (err) {
    console.error("[setPassword] Redis OTP del failed:", err);
    // Non-fatal — proceed; worst case is the token expires naturally in 15 min
  }

  let passwordHash: string;
  try {
    passwordHash = await hash(password);
  } catch (err) {
    console.error("[setPassword] Hash failed:", err);
    return { success: false, error: "Failed to set password. Please try again." };
  }

  // Belt-and-suspenders: only update a verified account
  let result;
  try {
    result = await sql`
      UPDATE users
      SET password_hash = ${passwordHash}
      WHERE email = ${email} AND email_verified = true
      RETURNING id
    `;
  } catch (err) {
    console.error("[setPassword] DB update failed:", err);
    return { success: false, error: "Failed to set password. Please try again." };
  }

  if (result.length === 0) {
    return { success: false, error: "Account not found or not verified." };
  }

  // Bump token version so any existing sessions are invalidated on next refresh
  const newUserId = result[0].id as string;
  await bumpTokenVersion(newUserId);

  return { success: true };
}
