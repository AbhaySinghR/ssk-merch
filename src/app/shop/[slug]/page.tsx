import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductPurchasePanel from "@/components/shop/ProductPurchasePanel";
import { getAllProducts, getProductBySlug } from "@/lib/products";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Sainik School Kapurthala Merch`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1 bg-maroon">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
          <Link
            href="/shop"
            className="text-xs tracking-[0.2em] text-warm-grey hover:text-gold"
          >
            ← BACK TO SHOP
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <ProductGallery images={product.images} productName={product.name} />

            <div>
              <p className="text-xs font-medium tracking-[0.3em] text-gold">
                {product.categoryLabel.toUpperCase()}
              </p>
              <h1 className="mt-4 font-display text-4xl leading-tight text-cream sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 font-display text-2xl text-gold">
                ₹{product.price}
              </p>

              <p className="mt-6 text-sm leading-relaxed text-warm-grey">
                {product.description}
              </p>

              <div className="mt-8 border-t border-gold/20 pt-6">
                <p className="text-xs tracking-[0.2em] text-warm-grey">
                  FABRIC & CARE
                </p>
                <p className="mt-3 text-sm leading-relaxed text-warm-grey">
                  {product.fabric}
                </p>
              </div>

              <ProductPurchasePanel product={product} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
