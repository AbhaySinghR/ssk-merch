"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/products";
import ShopFilters, { type FilterState } from "@/components/shop/ShopFilters";
import ProductCard from "@/components/shop/ProductCard";

type Props = {
  products: Product[];
  categories: { value: ProductCategory; label: string }[];
  sizes: string[];
  priceBounds: { min: number; max: number };
};

export default function ShopBrowser({
  products,
  categories,
  sizes,
  priceBounds,
}: Props) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    maxPrice: priceBounds.max,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }
      if (
        filters.sizes.length > 0 &&
        !product.sizes.some((size) => filters.sizes.includes(size))
      ) {
        return false;
      }
      if (product.price > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }, [products, filters]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <p className="text-sm text-warm-grey">
          {filteredProducts.length} product
          {filteredProducts.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 border border-gold/30 px-4 py-2 text-xs tracking-[0.2em] text-cream"
        >
          <SlidersHorizontal size={14} />
          FILTERS
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-0 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ShopFilters
            categories={categories}
            sizes={sizes}
            priceBounds={priceBounds}
            value={filters}
            onChange={setFilters}
          />
        </aside>

        <div>
          <p className="hidden text-sm text-warm-grey lg:block">
            {filteredProducts.length} product
            {filteredProducts.length === 1 ? "" : "s"}
          </p>

          {filteredProducts.length === 0 ? (
            <p className="mt-12 text-center text-sm text-warm-grey">
              No products match these filters.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-maroon px-6 py-6">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
              className="self-end text-cream"
            >
              <X size={22} />
            </button>
            <div className="mt-4">
              <ShopFilters
                categories={categories}
                sizes={sizes}
                priceBounds={priceBounds}
                value={filters}
                onChange={setFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
