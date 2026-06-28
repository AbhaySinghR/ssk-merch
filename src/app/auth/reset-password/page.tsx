"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "./actions";

const inputClass =
  "w-full border border-cream/20 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-warm-grey/60 outline-none transition-colors focus:border-gold";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // No token in URL — link is broken or already used
  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-maroon px-6 py-16">
        <div className="w-full max-w-md border border-gold/30 bg-maroon-mid p-10">
          <p className="text-xs font-medium tracking-[0.3em] text-gold">
            ACCOUNT RECOVERY
          </p>
          <h1 className="mt-4 font-display text-3xl text-cream">
            Invalid link.
          </h1>
          <p className="mt-4 text-sm text-warm-grey">
            This reset link is invalid or has already been used.
          </p>
          <Link
            href="/auth/forgot-password"
            className="mt-6 inline-block text-xs tracking-[0.2em] text-gold transition-colors hover:text-cream"
          >
            REQUEST A NEW LINK →
          </Link>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(token, password);
      if (result.success) {
        router.push("/auth/login?reset=1");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-maroon px-6 py-16">
      <div className="w-full max-w-md border border-gold/30 bg-maroon-mid p-10">
        <p className="text-xs font-medium tracking-[0.3em] text-gold">
          ACCOUNT RECOVERY
        </p>
        <h1 className="mt-4 font-display text-3xl text-cream">
          Set new password.
        </h1>
        <p className="mt-2 text-sm text-warm-grey">
          All existing sessions will be signed out.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="text-xs tracking-[0.2em] text-warm-grey"
            >
              NEW PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} mt-2`}
              required
              minLength={8}
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="text-xs tracking-[0.2em] text-warm-grey"
            >
              CONFIRM PASSWORD
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`${inputClass} mt-2`}
              required
            />
          </div>

          {error && (
            <div className="border border-red-400/30 bg-red-900/20 px-4 py-3">
              <p className="text-xs leading-relaxed text-red-300">{error}</p>
              {error.includes("expired") && (
                <Link
                  href="/auth/forgot-password"
                  className="mt-1 inline-block text-xs text-gold underline-offset-2 hover:underline"
                >
                  Request a new link →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gold px-8 py-4 text-xs font-semibold tracking-[0.2em] text-maroon-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
