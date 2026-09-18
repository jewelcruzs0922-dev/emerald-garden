import { NextResponse } from "next/server";
import { releaseStock } from "@/lib/commerce/inventory";
import { sendOrderConfirmation } from "@/lib/commerce/notify";
import {
  ORDER_COOKIE_MAX_AGE,
  orderCookieName,
  type OrderOutcome,
} from "@/lib/commerce/order-cookie";
import { orders } from "@/lib/commerce/orders";
import { paymentProvider } from "@/lib/commerce/payments";
import { resolveOrigin } from "@/lib/http";

/** Redirects, and leaves the outcome where the confirmation page can find it. */
function redirectWith(url: string, orderId: string, outcome: OrderOutcome): NextResponse {
  const response = NextResponse.redirect(url, { status: 303 });
  response.cookies.set(orderCookieName(orderId), JSON.stringify(outcome), {
    path: "/",
    maxAge: ORDER_COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Where the customer lands after paying. This is the single place an order is
 * marked paid, so the return trip and the webhook cannot both settle it.
 */
export async function GET(request: Request) {
  const origin = resolveOrigin(request);
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order") ?? "";
  const session =
    url.searchParams.get("session") ?? url.searchParams.get("session_id") ?? "";

  const order = await orders().get(orderId);
  if (!order) {
    return NextResponse.redirect(`${origin}/?checkout=unknown`, { status: 303 });
  }

  /* Already settled (webhook beat us here, or the customer refreshed). */
  if (order.status === "paid" || order.status === "fulfilled") {
    return NextResponse.redirect(`${origin}/orders/${order.id}`, { status: 303 });
  }

  const reference = session || order.payment.reference || "";
  const verification = reference
    ? await paymentProvider().verify(reference)
    : { paid: false, reference: "" };

  if (verification.paid) {
    const paidAt = new Date().toISOString();
    const paid = await orders().update(order.id, {
      status: "paid",
      payment: { provider: order.payment.provider, reference, paidAt },
    });
    if (paid) await sendOrderConfirmation(paid);
    return redirectWith(`${origin}/orders/${order.id}?welcome=1`, order.id, {
      status: "paid",
      reference,
      paidAt,
    });
  }

  /* Payment did not complete — put the stock back and show the order. */
  await orders().update(order.id, { status: "failed" });
  await releaseStock(order.lines.map((line) => ({ id: line.id, qty: line.qty })));
  return redirectWith(`${origin}/orders/${order.id}?status=failed`, order.id, {
    status: "failed",
    reference,
  });
}
