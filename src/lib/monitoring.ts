/**
 * Error monitoring wrapper.
 *
 * Currently logs structured JSON to stdout (Vercel captures this).
 * To upgrade to Sentry:
 *   1. Run: npm install @sentry/nextjs
 *   2. Run: npx @sentry/wizard@latest -i nextjs
 *   3. Set SENTRY_DSN in Vercel environment variables
 *   4. Uncomment the Sentry lines below and remove the console.error fallback.
 */

// import * as Sentry from "@sentry/nextjs";

export function captureException(
  err: unknown,
  context?: Record<string, unknown>,
): void {
  // Structured log — Vercel ingests stdout JSON automatically
  console.error(
    JSON.stringify({
      level: "error",
      ts: new Date().toISOString(),
      ...(context ?? {}),
      err:
        err instanceof Error
          ? { message: err.message, stack: err.stack, name: err.name }
          : String(err),
    }),
  );

  // Sentry (uncomment after installation):
  // Sentry.captureException(err, { extra: context });
}

export function captureMessage(
  msg: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>,
): void {
  console.log(
    JSON.stringify({
      level,
      ts: new Date().toISOString(),
      msg,
      ...(context ?? {}),
    }),
  );

  // Sentry (uncomment after installation):
  // Sentry.captureMessage(msg, { level, extra: context });
}
