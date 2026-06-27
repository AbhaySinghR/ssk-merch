import { type NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { redis } from "@/lib/redis";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token");
  if (!token || !redis || !sql) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid", request.url));
  }

  let email: string | null;
  try {
    email = await redis.get<string>(`email_verify:${token}`);
  } catch (err) {
    console.error("[verify] Redis get failed:", err);
    return NextResponse.redirect(new URL("/sign-in?error=invalid", request.url));
  }

  if (!email) {
    return NextResponse.redirect(new URL("/sign-in?error=expired", request.url));
  }

  // Single-use token
  try {
    await redis.del(`email_verify:${token}`);
  } catch (err) {
    console.error("[verify] Redis del failed:", err);
    // Non-fatal — continue to create user
  }

  // Create user row — ON CONFLICT handles double-click on link
  try {
    await sql`
      INSERT INTO users (email, password_hash, email_verified)
      VALUES (${email}, '', true)
      ON CONFLICT (email) DO UPDATE SET email_verified = true
    `;
  } catch (err) {
    console.error("[verify] DB upsert failed:", err);
    return NextResponse.redirect(new URL("/sign-in?error=invalid", request.url));
  }

  // Issue a short-lived one-time token to bind the set-password page to this
  // specific verification. This prevents an attacker from crafting
  // /auth/set-password?email=victim@x.com to takeover a verified account.
  // The OTP is consumed on first use (single-use, 15-minute window).
  const otpToken = randomUUID();
  try {
    await redis.set(`set_password_otp:${otpToken}`, email, { ex: 900 });
  } catch (err) {
    console.error("[verify] Redis OTP set failed:", err);
    return NextResponse.redirect(new URL("/sign-in?error=invalid", request.url));
  }

  return NextResponse.redirect(
    new URL(`/auth/set-password?otp=${otpToken}`, request.url),
  );
}
