"use client";

import { useState } from "react";

export default function AddToCartButton({ productName }: { productName: string }) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${productName} to cart`}
      className="w-full bg-gold px-8 py-4 text-xs font-semibold tracking-[0.2em] text-maroon-dark transition-opacity hover:opacity-90"
    >
      {added ? "ADDED TO CART ✓" : "ADD TO CART"}
    </button>
  );
}
