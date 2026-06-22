import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-maroon px-6 py-32 text-center lg:px-10">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-medium tracking-[0.3em] text-gold">
            COMING SOON
          </p>
          <h1 className="mt-6 font-display text-5xl leading-tight text-cream sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-warm-grey">
            We&apos;re building this section with the same care and legacy
            you see across the rest of the site. Stay tuned.
          </p>
          <Link
            href="/"
            className="mt-10 inline-block border border-cream/40 px-8 py-4 text-xs font-semibold tracking-[0.2em] text-cream transition-colors hover:border-gold hover:text-gold"
          >
            BACK TO HOME
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
