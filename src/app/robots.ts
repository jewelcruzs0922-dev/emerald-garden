import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/static/chunks/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", `${SITE.url}/`).toString(),
    host: SITE.url,
  };
}
