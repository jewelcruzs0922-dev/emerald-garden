import type { Order } from "../orders";
import type { PaymentProvider, PaymentSession, PaymentVerification } from "./types";

/**
 * Stripe Checkout, called over the REST API with `fetch` so the project keeps
 * its zero-dependency property.
 *
 * NOTE: this adapter is written but unexercised — it only activates when
 * STRIPE_SECRET_KEY is set, and there are no credentials in this repository.
 * Treat the first live run as the real test.
 */
const STRIPE_API = "https://api.stripe.com/v1";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Flattens nested objects into Stripe's `a[b][0][c]=v` form encoding. */
function encodeForm(data: unknown, prefix = ""): string[] {
  if (data === null || data === undefined) return [];
  if (Array.isArray(data)) {
    return data.flatMap((value, index) => encodeForm(value, `${prefix}[${index}]`));
  }
  if (typeof data === "object") {
    return Object.entries(data as Record<string, unknown>).flatMap(([key, value]) =>
      encodeForm(value, prefix ? `${prefix}[${key}]` : key),
    );
  }
  return [`${encodeURIComponent(prefix)}=${encodeURIComponent(String(data))}`];
}

async function stripeRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${STRIPE_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Stripe ${response.status}: ${detail.slice(0, 300)}`);
  }
  return (await response.json()) as T;
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createSession(order: Order, origin: string): Promise<PaymentSession> {
    const payload = encodeForm({
      mode: "payment",
      client_reference_id: order.id,
      customer_email: order.customer.email,
      metadata: { order_id: order.id },
      shipping_address_collection: { allowed_countries: ["PH"] },
      success_url: `${origin}/api/checkout/return?order=${order.id}&session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/orders/${order.id}?status=cancelled`,
      line_items: [
        ...order.lines.map((line) => ({
          quantity: line.qty,
          price_data: {
            currency: "php",
            unit_amount: line.unitPrice * 100,
            product_data: { name: line.name, metadata: { sku: line.id } },
          },
        })),
        ...(order.shipping > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "php",
                  unit_amount: order.shipping * 100,
                  product_data: { name: "Shipping" },
                },
              },
            ]
          : []),
      ],
    })
      .join("&")
      /* Stripe substitutes this placeholder literally, so it must stay unencoded. */
      .replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}");

    const session = await stripeRequest<{ id: string; url: string }>(
      "/checkout/sessions",
      { method: "POST", body: payload },
    );

    return {
      provider: "stripe",
      reference: session.id,
      redirectUrl: session.url,
    };
  },

  async verify(reference: string): Promise<PaymentVerification> {
    try {
      const session = await stripeRequest<{ payment_status?: string }>(
        `/checkout/sessions/${encodeURIComponent(reference)}`,
      );
      return { paid: session.payment_status === "paid", reference, raw: session };
    } catch (error) {
      console.error("[leaf-and-root] stripe verify failed:", error);
      return { paid: false, reference };
    }
  },
};
