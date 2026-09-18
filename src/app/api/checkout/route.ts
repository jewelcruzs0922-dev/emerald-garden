import { NextResponse } from "next/server";
import {
  availableMap,
  releaseStock,
  reserveStock,
  StockError,
} from "@/lib/commerce/inventory";
import {
  newOrderId,
  orders,
  type Order,
  type OrderCustomer,
} from "@/lib/commerce/orders";
import { paymentProvider } from "@/lib/commerce/payments";
import {
  isShippingRegion,
  priceCart,
  type CartInput,
  type PricingIssue,
} from "@/lib/commerce/pricing";
import { resolveOrigin } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { asString, clean, isEmail, type FieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUIRED: (keyof OrderCustomer)[] = [
  "name",
  "email",
  "phone",
  "address",
  "city",
  "postalCode",
];

const LABELS: Record<string, string> = {
  name: "your name",
  email: "an email address",
  phone: "a contact number",
  address: "a delivery address",
  city: "a city or municipality",
  postalCode: "a postal code",
};

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "We couldn't read that request." },
      { status: 400 },
    );
  }

  const limit = rateLimit(clientKey(request, "checkout"), 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: "Too many checkout attempts — please wait a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(body.items) ? (body.items as CartInput[]) : [];

  /* ---- customer ---- */
  const customer: OrderCustomer = {
    name: clean(asString(body.name, 120)),
    email: clean(asString(body.email, 254)),
    phone: clean(asString(body.phone, 40)),
    address: clean(asString(body.address, 240)),
    city: clean(asString(body.city, 120)),
    postalCode: clean(asString(body.postalCode, 20)),
    notes: clean(asString(body.notes, 1000)),
  };

  const errors: FieldErrors = {};
  for (const field of REQUIRED) {
    if (!customer[field]) errors[field] = `We need ${LABELS[field]}.`;
  }
  if (customer.email && !isEmail(customer.email)) {
    errors.email = "That email address looks incomplete.";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors },
      { status: 422 },
    );
  }

  const region = isShippingRegion(body.shippingRegion) ? body.shippingRegion : "metro";

  /* ---- price against live availability ---- */
  const availability = await availableMap();
  const cart = priceCart(rawItems, region, availability);

  if (cart.lines.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "There is nothing available to check out in your basket.",
        issues: cart.issues,
      },
      { status: 409 },
    );
  }

  const blocking = cart.issues.filter((issue) => issue.code === "sold-out");
  if (blocking.length > 0) {
    return NextResponse.json(
      { ok: false, message: blocking[0].message, issues: cart.issues },
      { status: 409 },
    );
  }

  /* ---- claim stock, then record the order ---- */
  const claim = cart.lines.map((line) => ({ id: line.id, qty: line.qty }));
  try {
    await reserveStock(claim);
  } catch (error) {
    if (error instanceof StockError) {
      return NextResponse.json(
        {
          ok: false,
          message: "Someone bought that tree while you were checking out.",
          issues: [
            {
              id: error.productId,
              code: "sold-out",
              name: error.productId,
              message: `Only ${error.remaining} left.`,
            } satisfies PricingIssue,
          ],
        },
        { status: 409 },
      );
    }
    throw error;
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: newOrderId(),
    createdAt: now,
    updatedAt: now,
    status: "pending",
    customer,
    lines: cart.lines,
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
    shippingRegion: cart.shippingRegion,
    payment: { provider: paymentProvider().name },
  };

  await orders().create(order);

  /* ---- hand off to the payment provider ---- */
  try {
    const session = await paymentProvider().createSession(order, resolveOrigin(request));
    await orders().update(order.id, {
      payment: { provider: session.provider, reference: session.reference },
    });
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      redirectUrl: session.redirectUrl,
      issues: cart.issues,
      /* The receipt goes back to the browser so the confirmation page still
         works on a host where each request may hit a different instance. */
      order: { ...order, payment: { ...order.payment, reference: session.reference } },
    });
  } catch (error) {
    console.error("[leaf-and-root] checkout session failed:", error);
    await orders().update(order.id, { status: "failed" });
    await releaseStock(claim);
    return NextResponse.json(
      {
        ok: false,
        message: "We couldn't start the payment. Nothing has been charged.",
      },
      { status: 502 },
    );
  }
}
