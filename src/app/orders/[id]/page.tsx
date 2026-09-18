import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeafGlyph } from "@/components/icons";
import { formatPeso } from "@/lib/catalog";
import { orders } from "@/lib/commerce/orders";
import { SHIPPING } from "@/lib/commerce/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id}`,
    robots: { index: false, follow: false },
  };
}

const STATUS_COPY: Record<
  string,
  { eyebrow: string; title: string; body: string; tone: "good" | "wait" | "bad" }
> = {
  paid: {
    eyebrow: "Payment received",
    title: "Thank you — your trees are being prepared.",
    body: "We've emailed your receipt. Your tree is watered, wrapped and will leave us on the next shipping day (Monday to Wednesday).",
    tone: "good",
  },
  fulfilled: {
    eyebrow: "On its way",
    title: "Your order has shipped.",
    body: "Check your email for the courier tracking number. Message us any time if you'd like a hand settling it in.",
    tone: "good",
  },
  pending: {
    eyebrow: "Awaiting payment",
    title: "We haven't received the payment yet.",
    body: "If you closed the payment page, you can start again from your basket. Nothing has been charged.",
    tone: "wait",
  },
  failed: {
    eyebrow: "Payment didn't complete",
    title: "That payment didn't go through.",
    body: "Nothing has been charged and the trees have gone back into stock. You're welcome to try again.",
    tone: "bad",
  },
  cancelled: {
    eyebrow: "Cancelled",
    title: "This order was cancelled.",
    body: "Nothing has been charged. The trees are back in the collection if you'd like another look.",
    tone: "bad",
  },
};

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const order = await orders().get(id);

  if (!order) notFound();

  const status = STATUS_COPY[order.status] ?? STATUS_COPY.pending;
  const justPaid = query.welcome === "1";

  return (
    <main id="main">
      <section className="section page-head">
        <div className="wrap">
          <div className={`order-banner order-banner--${status.tone}`} data-order-status={order.status}>
            <span className="eyebrow">{status.eyebrow}</span>
            <h1 style={{ marginTop: ".5rem" }}>
              {justPaid ? "Thank you — your order is confirmed." : status.title}
            </h1>
            <p className="lede">{status.body}</p>
            <p className="order-banner__ref">
              Order <b data-order-id>{order.id}</b> &middot;{" "}
              {new Date(order.createdAt).toLocaleString("en-PH", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="wrap">
          <div className="order-grid">
            <div className="order-main">
              <h2>What&apos;s coming</h2>
              <ul className="order-lines">
                {order.lines.map((line) => (
                  <li key={line.id}>
                    <Image
                      src={`/img/${line.img}`}
                      alt=""
                      width={72}
                      height={72}
                      className="summary__img"
                    />
                    <div className="summary__meta">
                      <span className="summary__name">{line.name}</span>
                      <span className="summary__qty">
                        {line.env} &middot; {line.qty} &times;{" "}
                        {formatPeso(line.unitPrice)}
                      </span>
                    </div>
                    <span className="summary__total">{formatPeso(line.lineTotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="order-totals">
                <div className="sum-line">
                  <span>Subtotal</span>
                  <span>{formatPeso(order.subtotal)}</span>
                </div>
                <div className="sum-line">
                  <span>Shipping · {SHIPPING[order.shippingRegion].label}</span>
                  <span>{order.shipping === 0 ? "Free" : formatPeso(order.shipping)}</span>
                </div>
                <div className="sum-line sum-line--total">
                  <span>Total</span>
                  <span>{formatPeso(order.total)}</span>
                </div>
              </div>

              <div className="order-next">
                <LeafGlyph width={26} height={26} />
                <div>
                  <h3>What happens next</h3>
                  <p>
                    We water and inspect your tree the day before it travels, then
                    wrap the pot in damp moss and brace it inside a rigid box. You
                    will get a message the morning it leaves.
                  </p>
                  <p>
                    Questions in the meantime? Reply to your receipt, or{" "}
                    <Link href="/contact">message us</Link> — a person answers.
                  </p>
                </div>
              </div>
            </div>

            <aside className="order-side">
              <h3>Delivery</h3>
              <address>
                {order.customer.name}
                <br />
                {order.customer.address}
                <br />
                {order.customer.city} {order.customer.postalCode}
                <br />
                {order.customer.phone}
              </address>

              <h3 style={{ marginTop: "1.6rem" }}>Payment</h3>
              <ul className="order-meta">
                <li>
                  <span>Method</span>
                  <span>{order.payment.provider}</span>
                </li>
                <li>
                  <span>Reference</span>
                  <span className="order-meta__ref">
                    {order.payment.reference ?? "—"}
                  </span>
                </li>
                <li>
                  <span>Paid</span>
                  <span>
                    {order.payment.paidAt
                      ? new Date(order.payment.paidAt).toLocaleDateString("en-PH")
                      : "—"}
                  </span>
                </li>
              </ul>

              {order.customer.notes ? (
                <>
                  <h3 style={{ marginTop: "1.6rem" }}>Your note</h3>
                  <p className="order-note">{order.customer.notes}</p>
                </>
              ) : null}

              <p style={{ marginTop: "1.8rem" }}>
                <Link className="btn btn--ghost btn--sm" href="/shop">
                  Keep browsing <span className="arw">&rarr;</span>
                </Link>
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
