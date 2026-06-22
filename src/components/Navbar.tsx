"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "GALLERY", href: "/gallery" },
  { label: "COMMUNITY", href: "/community" },
  { label: "TRACK ORDER", href: "/track-order" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-maroon-dark">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <span className="hidden h-10 w-px bg-gold/40 sm:block" aria-hidden="true" />
          <div className="leading-tight">
            <p className="font-display text-xl font-bold tracking-wide text-cream sm:text-2xl">
              Sainik School Kapurthala
            </p>
            <p className="text-[10px] tracking-[0.2em] text-warm-grey">
              ALUMNI MERCHANDISE
            </p>
          </div>
        </div>

        <ul className="hidden items-center gap-3 text-xs tracking-[0.2em] text-cream/90 lg:flex">
          {navLinks.map((link, i) => (
            <li key={link.label} className="flex items-center gap-3">
              <Link href={link.href} className="transition-colors hover:text-gold">
                {link.label}
              </Link>
              {i < navLinks.length - 1 && (
                <span className="text-gold/40">·</span>
              )}
            </li>
          ))}
        </ul>

        <Link
          href="/sign-in"
          className="hidden text-xs tracking-[0.2em] text-cream transition-colors hover:text-gold lg:inline"
        >
          SIGN IN
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-cream lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold/20 bg-maroon-dark px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-4 text-xs tracking-[0.2em] text-cream/90">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="text-gold transition-colors hover:text-cream"
              >
                SIGN IN
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
