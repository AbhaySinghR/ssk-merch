"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-maroon text-center">
      <p className="text-xs font-medium tracking-[0.3em] text-gold">
        DASHBOARD ERROR
      </p>
      <p className="mt-4 text-sm text-warm-grey">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 bg-gold px-8 py-4 text-xs font-semibold tracking-[0.2em] text-maroon-dark transition-opacity hover:opacity-90"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
