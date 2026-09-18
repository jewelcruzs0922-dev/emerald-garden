import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, productListSchema } from "@/lib/structured-data";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import PageHead from "@/components/PageHead";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = pageMetadata({
  title: "Shop the Collection",
  description:
    "Browse the Emerald Garden collection of carefully grown bonsai trees for indoor and outdoor spaces, from beginner-friendly ficus to collector pines.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <main id="main">
      <JsonLd
        data={[
          productListSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
        ]}
      />
      <PageHead
        crumb="Shop"
        title="The Collection"
        lede="Ten trees, each grown by hand and living with us for at least three seasons before they travel. Choose by light, by patience, or simply by whichever one you keep looking back at."
        anno="Every tree leaves with a care card."
      >
        <svg
          className="page-head__sketch"
          viewBox="0 0 150 90"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 82h134"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M42 82V46M42 60c-12 0-22-10-22-22 12 0 22 10 22 22zM42 60c12 0 22-10 22-22-12 0-22 10-22 22z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M96 82V58M96 68c-8 0-14-6-14-14 8 0 14 6 14 14zM96 68c8 0 14-6 14-14-8 0-14 6-14 14z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </PageHead>

      <section className="section section--flush-top">
        <div className="wrap">
          <ShopClient />
        </div>
      </section>

      <CtaBand
        heading="Every tree travels with a care card, a wire, and our phone number."
        note="Because the first month matters most."
        primary={{ href: "/care", label: "Read the Care Guide" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </main>
  );
}
