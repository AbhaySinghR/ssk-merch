import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
