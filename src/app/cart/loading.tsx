export default function CartLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
      <div className="h-3 w-24 animate-pulse rounded bg-maroon-mid" />
      <div className="mt-3 h-10 w-48 animate-pulse rounded bg-maroon-mid" />
      <div className="mt-10 divide-y divide-gold/20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-5 py-6">
            <div className="h-20 w-20 flex-shrink-0 animate-pulse rounded bg-maroon-mid" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-40 animate-pulse rounded bg-maroon-mid" />
              <div className="h-3 w-24 animate-pulse rounded bg-maroon-mid" />
              <div className="h-3 w-16 animate-pulse rounded bg-maroon-mid" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-gold/20 pt-8">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 animate-pulse rounded bg-maroon-mid" />
          <div className="h-8 w-32 animate-pulse rounded bg-maroon-mid" />
        </div>
        <div className="mt-8 h-12 w-full animate-pulse rounded bg-maroon-mid" />
      </div>
    </div>
  );
}
