export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <div className="h-3 w-24 animate-pulse rounded bg-maroon-mid" />
      <div className="mt-3 h-10 w-48 animate-pulse rounded bg-maroon-mid" />
      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-3 w-32 animate-pulse rounded bg-maroon-mid" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between border-b border-gold/10 py-4">
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-maroon-mid" />
                <div className="h-3 w-20 animate-pulse rounded bg-maroon-mid" />
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-maroon-mid" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="mb-2 h-3 w-20 animate-pulse rounded bg-maroon-mid" />
              <div className="h-11 w-full animate-pulse rounded bg-maroon-mid" />
            </div>
          ))}
          <div className="h-12 w-full animate-pulse rounded bg-maroon-mid" />
        </div>
      </div>
    </div>
  );
}
