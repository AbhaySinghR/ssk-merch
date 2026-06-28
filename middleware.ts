import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? "",
);

const PROTECTED_ROUTES = ["/checkout", "/account"];
const ADMIN_ROUTES = ["/admin"];

/** Extract the access_token value from Set-Cookie headers after a refresh. */
function extractAccessToken(setCookies: string[]): string | null {
  for (const cookie of setCookies) {
    const match = cookie.match(/^access_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin routes — JWT + role check ───────────────────────────────────────
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    const accessToken = request.cookies.get("access_token")?.value;

    // Try verifying the current access token
    if (accessToken) {
      try {
        const { payload } = await jwtVerify(accessToken, ACCESS_SECRET);
        if (payload.role === "admin") return NextResponse.next();
        // Valid JWT but not admin — redirect to home, not login
        return NextResponse.redirect(new URL("/", request.url));
      } catch {
        // Token expired — fall through to refresh
      }
    }

    // Try refreshing
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (refreshToken) {
      const refreshUrl = new URL("/auth/refresh", request.url);
      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: { cookie: request.headers.get("cookie") ?? "" },
      });
      if (refreshResponse.ok) {
        const setCookies = refreshResponse.headers.getSetCookie();
        const newAccessToken = extractAccessToken(setCookies);
        if (newAccessToken) {
          try {
            const { payload } = await jwtVerify(newAccessToken, ACCESS_SECRET);
            if (payload.role === "admin") {
              const response = NextResponse.next();
              setCookies.forEach((c) => response.headers.append("set-cookie", c));
              return response;
            }
          } catch {
            // New token invalid — fall through
          }
        }
      }
    }

    // Not authenticated or not admin → send to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Protected user routes ──────────────────────────────────────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const accessToken = request.cookies.get("access_token")?.value;

    if (accessToken) {
      try {
        await jwtVerify(accessToken, ACCESS_SECRET);
        return NextResponse.next();
      } catch {
        // Access token expired — try refresh
      }
    }

    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (refreshToken) {
      const refreshUrl = new URL("/auth/refresh", request.url);
      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: { cookie: request.headers.get("cookie") ?? "" },
      });
      if (refreshResponse.ok) {
        const response = NextResponse.next();
        refreshResponse.headers
          .getSetCookie()
          .forEach((cookie) => response.headers.append("set-cookie", cookie));
        return response;
      }
    }

    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/account/:path*",
    "/admin/:path*",
  ],
};
