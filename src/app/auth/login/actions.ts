"use server";

import { verify } from "argon2";
import { SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { randomUUID } from "crypto";
import { sql } from "@/lib/db";
import { redis } from "@/lib/redis";
import { getTokenVersion } from "@/lib/auth";
import { Ratelimit } from "@upstash/ratelimit";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? "",
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? "",
);

export async function login(
  email: string,
  password: string,
): Promise<{ success: true; role: string } | { success: false; error: string }> {
  if (!sql) return { success: false, error: "Service unavailable." };

  // Rate limit by IP
  if (redis) {
    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerStore.get("x-real-ip") ??
      "unknown";

    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: "ratelimit:login",
    });
    const { success: allowed } = await limiter.limit(ip);
    if (!allowed) {
      return {
        success: false,
        error: "Too many attempts. Please wait 15 minutes.",
      };
    }
  }

  let users;
  try {
    users = await sql`
      SELECT id, password_hash, email_verified, role
      FROM users
      WHERE email = ${email}
    `;
  } catch (err) {
    console.error("[login] DB query failed:", err);
    return { success: false, error: "Service unavailable. Please try again." };
  }

  const user = users[0];
  if (!user) {
    return {
      success: false,
      error: "No account found with this email. Please register first.",
    };
  }
  if (!user.email_verified) {
    return {
      success: false,
      error: "Email not verified. Check your inbox for the verification link.",
    };
  }
  // Account exists and is verified but password was never set
  if (!user.password_hash) {
    return {
      success: false,
      error: "Please complete your account setup — check your inbox for the verification link.",
    };
  }

  const valid = await verify(user.password_hash as string, password);
  if (!valid) {
    return { success: false, error: "Invalid email or password." };
  }

  const userId = user.id as string;
  const role = (user.role as string) ?? "user";
  const tv = await getTokenVersion(userId); // token version for force-logout-all
  const jti = randomUUID();
  const now = Math.floor(Date.now() / 1000);

  const accessToken = await new SignJWT({ sub: userId, email, role, tv })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);

  // tv is embedded in the refresh token so /auth/refresh can enforce it.
  // On bumpTokenVersion (password change/reset), the next refresh attempt
  // comparing tokenTv < currentTv will reject the token and force re-login.
  const refreshToken = await new SignJWT({ sub: userId, jti, tv })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);

  if (redis) {
    await redis.sadd(`refresh_family:${userId}`, jti);
    await redis.expire(`refresh_family:${userId}`, 7 * 24 * 60 * 60);
  }

  const isSecure = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https") ?? false;

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  cookieStore.set("ssk_auth", "1", {
    httpOnly: false,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return { success: true, role };
}
