import type { Metadata } from "next";

const fallbackUrl = "http://localhost:3000";

export const SITE = {
  name: "Leaf & Root",
  tagline: "Bonsai for a Greener Tomorrow",
  legalName: "Leaf & Root Bonsai",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl).replace(/\/$/, ""),
  locale: "en_PH",
  email: "hello@leafandroot.ph",
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
    "https://instagram.com/leafandroot",
    "https://facebook.com/leafandroot",
    "https://pinterest.com/leafandroot",
  ],
} as const;

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Leaf & Root � Small Trees, Big Peace",
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
