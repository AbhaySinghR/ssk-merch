import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { randomUUID } from "crypto";
import { redis } from "@/lib/redis";
import { sql } from "@/lib/db";
import { getTokenVersion } from "@/lib/auth";
import { Ratelimit } from "@upstash/ratelimit";

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? "",
);
const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? "",
);

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken || !redis) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit refresh attempts per IP — prevents family-probing attacks
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "5 m"),
    prefix: "ratelimit:refresh",
  });
  const { success: allowed } = await limiter.limit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let payload: { sub?: string; jti?: string; tv?: number };
  try {
    const { payload: p } = await jwtVerify(refreshToken, REFRESH_SECRET);
    payload = p as { sub?: string; jti?: string; tv?: number };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { sub: userId, jti, tv: tokenTv } = payload;
  if (!userId || !jti) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const isMember = await redis.sismember(`refresh_family:${userId}`, jti);
  if (!isMember) {
    // Reuse detected — nuke entire family to force re-login
    await redis.del(`refresh_family:${userId}`);
    return NextResponse.json({ error: "Token reuse detected" }, { status: 401 });
  }

  // ── Token version check (force-logout-all / password change) ──────────────
  // The refresh token carries the `tv` (token version) at the time of login.
  // bumpTokenVersion increments the Redis counter (e.g. on password change).
  // Any refresh token whose tv is less than the current version is rejected,
  // forcing re-login. This is the actual enforcement of force-logout-all.
  const currentTv = await getTokenVersion(userId);
  if ((tokenTv ?? 0) < currentTv) {
    // Invalidate the whole family so all devices are forced to re-login
    await redis.del(`refresh_family:${userId}`);
    return NextResponse.json(
      { error: "Session invalidated. Please log in again." },
      { status: 401 },
    );
  }

  const newJti = randomUUID();
  await redis.srem(`refresh_family:${userId}`, jti);
  await redis.sadd(`refresh_family:${userId}`, newJti);
  await redis.expire(`refresh_family:${userId}`, 7 * 24 * 60 * 60);

  // Query current role from DB so role changes take effect within 15 min
  let role = "user";
  if (sql) {
    try {
      const rows = await sql`SELECT role FROM users WHERE id = ${userId}`;
      if (rows[0]?.role) role = rows[0].role as string;
    } catch {
      // Non-fatal — default to 'user' keeps the session alive safely
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const isSecure = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https") ?? false;

  const newAccessToken = await new SignJWT({ sub: userId, role, tv: currentTv })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);

  // Re-embed currentTv in the new refresh token so future refreshes continue
  // to compare against the up-to-date version
  const newRefreshToken = await new SignJWT({ sub: userId, jti: newJti, tv: currentTv })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);

  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  response.cookies.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  response.cookies.set("ssk_auth", "1", {
    httpOnly: false,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
