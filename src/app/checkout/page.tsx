import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Leaf & Root order. Live plants ship Monday to Wednesday so nothing waits in a depot over a weekend.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main id="main">
      <PageHead
        crumb="Checkout"
        title="Almost yours."
        lede="Two things left: where it's going, and how you'd like to pay. Every tree is packed the morning it leaves us."
        anno="Packed with patience."
      />

      <section className="section section--flush-top">
        <div className="wrap">
          <CheckoutClient />
        </div>
      </section>
    </main>
  );
}
