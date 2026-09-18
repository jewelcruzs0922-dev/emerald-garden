"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LeafGlyph } from "@/components/icons";
import type { Order } from "@/lib/commerce/orders";
import OrderDetail from "./OrderDetail";

export const ORDER_CACHE_PREFIX = "lr.order.";

/** Writes the receipt the checkout response handed us. */
export function cacheOrder(order: Order): void {
  try {
    window.sessionStorage.setItem(
      `${ORDER_CACHE_PREFIX}${order.id}`,
      JSON.stringify(order),
    );
  } catch {
    /* Storage blocked — the server lookup below is the only path then. */
  }
}

/**
 * The order store is per-process (see `json-store.ts`), and a serverless
 * deployment may serve this request from a different instance than the one
 * that took the payment. When the server cannot find the order, the receipt
 * the browser kept at checkout is shown instead.
 */
export default function OrderFallback({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  /* sessionStorage only exists in the browser, so this cannot be a lazy
     initialiser — it would run on the server and disagree with the client. */
  /* eslint-disable react-hooks/set-state-in-effect -- browser-only storage */
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(`${ORDER_CACHE_PREFIX}${id}`);
      setOrder(raw ? (JSON.parse(raw) as Order) : null);
    } catch {
      setOrder(null);
    }
  }, [id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* Undecided: the read is synchronous but happens after hydration. */
  if (order === undefined) {
    return (
      <section className="section page-head">
        <div className="wrap">
          <span className="eyebrow">Order {id}</span>
          <h1 style={{ marginTop: ".5rem" }}>Looking up your receipt…</h1>
        </div>
      </section>
    );
  }

  if (order) return <OrderDetail order={order} justPaid />;

  return (
    <section className="section page-head">
      <div className="wrap wrap--narrow">
        <span className="eyebrow">Order {id}</span>
        <h1 style={{ marginTop: ".5rem" }}>We can&apos;t show that receipt here.</h1>
        <p className="lede" style={{ marginTop: "1rem" }}>
          The order reference looks right, but this browser doesn&apos;t have a copy of it
          — most likely because the receipt was opened on a different device or after the
          preview reset. Your confirmation email has everything.
        </p>
        <p style={{ marginTop: "1.4rem" }}>
          <LeafGlyph width={26} height={26} style={{ color: "var(--sage)" }} />
        </p>
        <p
          style={{ marginTop: "1.4rem", display: "flex", gap: ".7rem", flexWrap: "wrap" }}
        >
          <Link className="btn" href="/contact">
            Ask us about this order <span className="arw">&rarr;</span>
          </Link>
          <Link className="btn btn--ghost" href="/shop">
            Back to the collection
          </Link>
        </p>
      </div>
    </section>
  );
}
