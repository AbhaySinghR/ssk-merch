"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { requestPasswordReset } from "./actions";

const inputClass =
  "w-full border border-cream/20 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-warm-grey/60 outline-none transition-colors focus:border-gold";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (result.success) {
        setSubmitted(true);
        toast.success("Reset link sent! Check your inbox.");
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-maroon px-6 py-16">
      <div className="w-full max-w-md border border-gold/30 bg-maroon-mid p-10">
        <p className="text-xs font-medium tracking-[0.3em] text-gold">
          ACCOUNT RECOVERY
        </p>

        {submitted ? (
          <>
            <h1 className="mt-4 font-display text-3xl text-cream">
              Check your inbox.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-warm-grey">
              If an account exists for{" "}
              <span className="text-cream">{email}</span>, we&apos;ve sent a
              password reset link. It expires in 1 hour.
            </p>
            <p className="mt-4 text-xs text-warm-grey">
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-gold transition-colors hover:text-cream"
              >
                try again
              </button>
              .
            </p>
            <div className="mt-8 border-t border-gold/20 pt-6">
              <Link
                href="/auth/login"
                className="text-xs tracking-[0.2em] text-warm-grey transition-colors hover:text-gold"
              >
                ← BACK TO LOGIN
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-4 font-display text-3xl text-cream">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-warm-grey">
              Enter your registered email and we&apos;ll send a reset link.
            </p>

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

              {error && (
                <p className="text-xs text-red-300">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gold px-8 py-4 text-xs font-semibold tracking-[0.2em] text-maroon-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "SENDING..." : "SEND RESET LINK"}
              </button>
            </form>

            <div className="mt-6 border-t border-gold/20 pt-6">
              <Link
                href="/auth/login"
                className="text-xs tracking-[0.2em] text-warm-grey transition-colors hover:text-gold"
              >
                ← BACK TO LOGIN
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
