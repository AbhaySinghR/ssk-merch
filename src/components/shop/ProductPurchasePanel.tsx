"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import type { Product } from "@/lib/products";

function isLoggedIn() {
  // Reads the non-HTTP-only hint cookie set at login.
  // The real auth is always verified server-side — this is UI-only.
  return typeof document !== "undefined" &&
    document.cookie.split(";").some((c) => c.trim() === "ssk_auth=1");
}

export default function ProductPurchasePanel({
  product,
}: {
  product: Product;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAdd() {
    if (!selectedSize) return;
    if (!isLoggedIn()) {
      router.push("/auth/login");
      return;
    }
    addItem({
      slug: product.slug,
      name: product.name,
      color: product.color,
      image: product.images[0].src,
      size: selectedSize,
      price: product.price,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      {/* Size selector */}
      <div className="mt-8 border-t border-gold/20 pt-6">
        {product.sizes.length === 1 ? (
          <div>
            <p className="text-xs tracking-[0.2em] text-warm-grey">SIZE</p>
            <p className="mt-3 text-sm text-cream">{product.sizes[0]}</p>
          </div>
        ) : (
          <div>
            <p className="text-xs tracking-[0.2em] text-warm-grey">
              SIZE — {selectedSize}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={size === selectedSize}
                  className={`border px-4 py-2 text-xs tracking-[0.1em] transition-colors ${
                    size === selectedSize
                      ? "border-gold bg-gold text-maroon-dark"
                      : "border-gold/30 text-warm-grey hover:border-gold hover:text-cream"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add to cart */}
      <div className="mt-10">
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="w-full bg-gold px-8 py-4 text-xs font-semibold tracking-[0.2em] text-maroon-dark transition-opacity hover:opacity-90"
        >
          {added ? "ADDED TO CART ✓" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
