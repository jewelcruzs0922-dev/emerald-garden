import { CATALOG, formatPeso } from "@/lib/catalog";
import { SITE } from "@/lib/seo";

export function organisationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "Store"],
    "@id": `${SITE.url}/#organisation`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description:
      "A small bonsai shop growing and shipping carefully tended bonsai trees, with a care guide and journal.",
    email: SITE.email,
    telephone: SITE.phone,
    foundingDate: String(SITE.foundingYear),
    image: `${SITE.url}/og.png`,
    logo: `${SITE.url}/icon.svg`,
    sameAs: [...SITE.sameAs],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00",
      },
    ],
    priceRange: "\u20B1\u20B1",
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.tagline,
    publisher: { "@id": `${SITE.url}/#organisation` },
    inLanguage: "en-PH",
  };
}

export function productListSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Leaf & Root Collection",
    numberOfItems: CATALOG.length,
    itemListElement: CATALOG.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.note,
        sku: product.id,
        image: `${SITE.url}/img/${product.img}`,
        category: product.env,
        brand: { "@type": "Brand", name: SITE.name },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "PHP",
          availability: "https://schema.org/InStock",
          url: `${SITE.url}/shop/${product.id}`,
          priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
        },
      },
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, SITE.url).toString(),
    })),
  };
}

export { formatPeso };
