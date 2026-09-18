import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/commerce/notify";
import { orders } from "@/lib/commerce/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook. Signature verification uses node:crypto rather than the SDK.
 * Without STRIPE_WEBHOOK_SECRET the endpoint refuses to act, so a forged
 * request can never mark an order paid.
 */
const TOLERANCE_SECONDS = 300;

function verifySignature(
  rawBody: string,
  header: string | null,
  secret: string,
): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header
      .split(",")
      .map((piece) => piece.split("=").map((s) => s.trim()) as [string, string]),
  );
  const timestamp = Number(parts.t);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const received = parts.v1 ?? "";
  if (received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, message: "Webhooks are not configured." },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get("stripe-signature"), secret)) {
    return NextResponse.json(
      { ok: false, message: "Invalid signature." },
      { status: 400 },
    );
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid payload." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object ?? {};
    const orderId =
      (session.client_reference_id as string | undefined) ??
      (session.metadata as Record<string, string> | undefined)?.order_id ??
      "";

    const order = orderId ? await orders().get(orderId) : null;
    if (order && order.status !== "paid" && order.status !== "fulfilled") {
      const paid = await orders().update(order.id, {
        status: "paid",
        payment: {
          provider: "stripe",
          reference: String(session.id ?? order.payment.reference ?? ""),
          paidAt: new Date().toISOString(),
        },
      });
      if (paid) await sendOrderConfirmation(paid);
    }
  }

  /* Always 2xx so Stripe stops retrying once we have handled the event. */
  return NextResponse.json({ received: true });
}
