export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-maroon px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-48 animate-pulse rounded bg-maroon-mid" />
            <div className="h-10 w-64 animate-pulse rounded bg-maroon-mid" />
          </div>
          <div className="h-9 w-24 animate-pulse rounded bg-maroon-mid" />
        </div>

        <div className="mt-12">
          <div className="h-8 w-32 animate-pulse rounded bg-maroon-mid" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                  <div
                    key={j}
                    className="h-8 flex-1 animate-pulse rounded bg-maroon-mid"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="h-8 w-40 animate-pulse rounded bg-maroon-mid" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <div
                    key={j}
                    className="h-8 flex-1 animate-pulse rounded bg-maroon-mid"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
