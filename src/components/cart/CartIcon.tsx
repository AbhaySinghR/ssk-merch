"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-cream transition-colors hover:text-gold"
      aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
    >
      <ShoppingBag size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-gold text-[9px] font-semibold text-maroon-dark">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
