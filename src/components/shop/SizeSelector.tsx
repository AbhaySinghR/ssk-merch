"use client";

import { useState } from "react";

export default function SizeSelector({ sizes }: { sizes: string[] }) {
  const [selected, setSelected] = useState(sizes[0]);

  if (sizes.length === 1) {
    return (
      <div>
        <p className="text-xs tracking-[0.2em] text-warm-grey">SIZE</p>
        <p className="mt-3 text-sm text-cream">{sizes[0]}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-warm-grey">
        SIZE — {selected}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelected(size)}
            aria-pressed={size === selected}
            className={`border px-4 py-2 text-xs tracking-[0.1em] transition-colors ${
              size === selected
                ? "border-gold bg-gold text-maroon-dark"
                : "border-gold/30 text-warm-grey hover:border-gold hover:text-cream"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
