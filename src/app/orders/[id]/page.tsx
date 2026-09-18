import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetail from "@/components/orders/OrderDetail";
import OrderFallback from "@/components/orders/OrderFallback";
import { orders } from "@/lib/commerce/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Order references are `LR-` plus six characters from a reduced alphabet. */
const ORDER_ID = /^LR-[A-Z0-9]{6}$/;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id}`,
    robots: { index: false, follow: false },
  };
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  /* A malformed reference can never have been issued. A well-formed one we
     cannot read is a different matter — see the fallback below. */
  if (!ORDER_ID.test(id)) notFound();

  const order = await orders().get(id);

  /* Found in shared storage: render it on the server. Otherwise hand off to the
     browser's own copy, because on a serverless host this request may have
     landed on an instance that never saw the order. */
  if (!order) {
    return (
      <main id="main">
        <OrderFallback id={id} />
      </main>
    );
  }

  return (
    <main id="main">
      <OrderDetail order={order} justPaid={query.welcome === "1"} />
    </main>
  );
}
