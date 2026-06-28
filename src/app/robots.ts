import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saikap.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/shop/", "/community"],
        disallow: [
          "/admin",
          "/admin/",
          "/account",
          "/account/",
          "/checkout",
          "/checkout/",
          "/cart",
          "/cart/",
          "/auth/",
          "/api/",
          "/sign-in",
          "/track-order",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
