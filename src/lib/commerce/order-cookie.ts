import type { Order } from "./orders";

/**
 * A tiny, server-issued note about how an order ended up.
 *
 * The browser caches the receipt at checkout time, when the order is still
 * `pending`. The payment is settled a moment later by the return endpoint, on
 * a different request that may even run on a different instance — so the two
 * cannot be reconciled server-side. The return endpoint therefore drops the
 * outcome into a short-lived cookie the confirmation page can read.
 *
 * It carries no personal data and no line items, so it stays far inside the
 * 4KB cookie limit no matter how large the order was.
 */
export const ORDER_COOKIE_PREFIX = "lr.order.";

export const ORDER_COOKIE_MAX_AGE = 60 * 15;

export interface OrderOutcome {
  status: Order["status"];
  reference?: string;
  paidAt?: string;
}

export function orderCookieName(id: string): string {
  return `${ORDER_COOKIE_PREFIX}${id}`;
}

/** Applied on top of the cached receipt so the header tells the truth. */
export function applyOutcome(order: Order, outcome: OrderOutcome | null): Order {
  if (!outcome) return order;
  return {
    ...order,
    status: outcome.status,
    payment: {
      provider: order.payment.provider,
      reference: outcome.reference ?? order.payment.reference,
      paidAt: outcome.paidAt ?? order.payment.paidAt,
    },
  };
}
