import type { Metadata } from "next";

const fallbackUrl = "http://localhost:3000";

/**
 * The public origin, used for canonical URLs, the sitemap and social cards.
 *
 * Only ever read on the server, so the `NEXT_PUBLIC_` prefix is not required —
 * `SITE_URL` is preferred, and the public name is still honoured so an existing
 * deployment does not silently fall back to localhost. Either way the value is
 * a public web address, not a secret.
 */
const configuredUrl =
  process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl;

export const SITE = {
  name: "Emerald Garden",
  tagline: "Bonsai for a Greener Tomorrow",
  legalName: "Emerald Garden Bonsai",
  url: configuredUrl.replace(/\/$/, ""),
  locale: "en_PH",
  email: "hello@emeraldgarden.ph",
  phone: "+63-2-8123-4567",
  foundingYear: 2018,
  address: {
    street: "14 Saging Street, Barangay Kalusugan",
    city: "Quezon City",
    region: "Metro Manila",
    postalCode: "1102",
    country: "PH",
  },
  sameAs: [
    "https://instagram.com/emeraldgarden",
    "https://facebook.com/emeraldgarden",
    "https://pinterest.com/emeraldgarden",
  ],
} as const;

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Emerald Garden — Small Trees, Big Peace",
} as const;
export function absolute(path: string): string {
  return new URL(path, `${SITE.url}/`).toString();
}

/**
 * Per-page metadata in one place so canonical URLs and social cards can never
 * drift out of sync with the page itself.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
