import type { MetadataRoute } from "next";
import { CATALOG } from "@/lib/catalog";
import { SITE } from "@/lib/seo";

const ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
  { path: "/care", priority: 0.8, changeFrequency: "monthly" },
  { path: "/journal", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = ROUTES.map((route) => ({
    url: new URL(route.path, `${SITE.url}/`).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  /* Every tree is a landing page in its own right. */
  const products: MetadataRoute.Sitemap = CATALOG.map((product) => ({
    url: new URL(`/shop/${product.id}`, `${SITE.url}/`).toString(),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...products];
}
