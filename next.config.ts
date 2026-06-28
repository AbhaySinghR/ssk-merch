import type { NextConfig } from "next";
import path from "path";

/**
 * Content Security Policy
 *
 * Running in report-only mode first (Content-Security-Policy-Report-Only)
 * so you can observe violations without breaking anything.
 *
 * Once you've verified no violations in production:
 *   → Change "Content-Security-Policy-Report-Only" to "Content-Security-Policy"
 *
 * Razorpay requirements:
 *   - script-src: https://checkout.razorpay.com
 *   - frame-src:  https://api.razorpay.com https://checkout.razorpay.com
 *   - connect-src: https://api.razorpay.com https://lumberjack.razorpay.com
 *   - img-src: https://cdn.razorpay.com
 */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://checkout.razorpay.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://cdn.razorpay.com;
  font-src 'self';
  connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com;
  frame-src https://api.razorpay.com https://checkout.razorpay.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent this page being framed (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Don't send full referrer to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Force HTTPS for 2 years — only add this once the site is fully on HTTPS
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Serve modern formats: AVIF first (smaller), WebP fallback
    formats: ["image/avif", "image/webp"],
    // Responsive breakpoints that match Tailwind's sm/md/lg/xl
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Product thumbnails, nav icons, etc.
    imageSizes: [64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
