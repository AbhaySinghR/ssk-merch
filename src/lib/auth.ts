/**
 * Shared server-side auth helpers.
 *
 * Token versioning (force-logout-all):
 *   - `tv` (token version) is embedded in every access token.
 *   - On password change, `bumpTokenVersion` increments the Redis counter.
 *   - On token refresh, the stored version is compared against the JWT `tv`.
 *   - Mismatch → refresh rejected → user must re-login within 15 min max.
 *
 * requireAdmin:
 *   - Re-verifies the access-token JWT server-side inside Server Actions.
 *   - Middleware is the first gate; this is the second, defence-in-depth gate.
 *   - Without this, a direct POST to a Server Action URL bypasses middleware.
 */

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? "",
);

const TOKEN_VERSION_PREFIX = "token_version:";

// ─── Token version ────────────────────────────────────────────────────────────

/** Returns the current token version for a user (defaults to 0). */
export async function getTokenVersion(userId: string): Promise<number> {
  if (!redis) return 0;
  try {
    const v = await redis.get<number>(`${TOKEN_VERSION_PREFIX}${userId}`);
    return v ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Increments the token version, invalidating all existing access tokens
 * on their next refresh attempt. Call this on password change or forced logout.
 * The version key has no TTL — it persists until explicitly bumped again.
 */
export async function bumpTokenVersion(userId: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.incr(`${TOKEN_VERSION_PREFIX}${userId}`);
  } catch (err) {
    console.error("[bumpTokenVersion] Redis incr failed:", err);
  }
}

// ─── Admin verification ───────────────────────────────────────────────────────

export type AdminPayload = {
  userId: string;
  email: string;
  role: string;
};

/**
 * Reads and verifies the access token from cookies server-side.
 * Checks role === 'admin'. Returns the payload or null.
 *
 * Use this at the top of every admin Server Action — middleware can be
 * bypassed by direct POST requests, so we re-verify here.
 */
export async function requireAdmin(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    if (payload.role !== "admin") return null;

    return {
      userId: payload.sub ?? "",
      email: (payload.email as string) ?? "",
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * Same as requireAdmin but for regular users.
 * Returns userId from the verified JWT, or null if not authenticated.
 */
export async function requireUser(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
