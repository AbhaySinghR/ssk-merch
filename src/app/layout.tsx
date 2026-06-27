import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";

// Pin all serverless functions to Singapore — same region as Neon (ap-southeast-1)
// so DB calls don't cross continents. Change to your nearest Vercel region if you
// ever move the database.
export const preferredRegion = "sin1";

export const metadata: Metadata = {
  title: "Sainik School Kapurthala Merch | Alumni Merchandise",
  description:
    "Premium alumni merchandise for Sainik School Kapurthala. Discipline. Honour. Service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body bg-maroon text-cream">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
