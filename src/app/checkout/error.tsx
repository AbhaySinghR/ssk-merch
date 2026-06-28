"use client";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-medium tracking-[0.3em] text-gold">
        SOMETHING WENT WRONG
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
