"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "./actions";

const inputClass =
  "w-full border border-cream/20 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-warm-grey/60 outline-none transition-colors focus:border-gold";

/** Ensure the redirect target is a relative path on this origin — prevents open redirect. */
function sanitizeRedirect(raw: string | null): string {
  if (!raw) return "/cart";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/cart";
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirect(searchParams.get("redirect"));
  const didReset = searchParams.get("reset") === "1";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await login(email, password);
      if (result.success) {
        router.push(result.role === "admin" ? "/admin" : redirect);
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-maroon px-6 py-16">
      <div className="w-full max-w-md border border-gold/30 bg-maroon-mid p-10">
        <p className="text-xs font-medium tracking-[0.3em] text-gold">
          ALUMNI LOGIN
        </p>
        <h1 className="mt-4 font-display text-3xl text-cream">
          Welcome back.
        </h1>

        {didReset && (
          <div className="mt-4 border border-green-400/30 bg-green-900/20 px-4 py-3">
            <p className="text-xs text-green-300">
              Password updated. Please sign in with your new password.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-xs tracking-[0.2em] text-warm-grey"
            >
              EMAIL ID
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} mt-2`}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs tracking-[0.2em] text-warm-grey"
              >
                PASSWORD
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-warm-grey transition-colors hover:text-gold"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} mt-2`}
              required
            />
          </div>

          {error && (
            <div className="border border-red-400/30 bg-red-900/20 px-4 py-3">
              <p className="text-xs leading-relaxed text-red-300">{error}</p>
              {error.includes("register") && (
                <Link
                  href="/sign-in"
                  className="mt-1 inline-block text-xs text-gold underline-offset-2 hover:underline"
                >
                  Register here →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gold px-8 py-4 text-xs font-semibold tracking-[0.2em] text-maroon-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-warm-grey">
          Not registered yet?{" "}
          <Link
            href="/sign-in"
            className="text-gold transition-colors hover:text-cream"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
