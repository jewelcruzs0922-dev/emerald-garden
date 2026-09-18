import { formatPeso } from "@/lib/catalog";
import { deliver } from "@/lib/mailer";
import { orders, type Order } from "./orders";
import { SHIPPING } from "./pricing";

function receipt(order: Order): string {
  const lines = order.lines
    .map(
      (line) =>
        `  ${String(line.qty).padStart(2, " ")} x ${line.name} — ${formatPeso(line.lineTotal)}`,
    )
    .join("\n");

  return [
    `Order ${order.id}`,
    `Placed ${new Date(order.createdAt).toLocaleString("en-PH")}`,
    "",
    lines,
    "",
    `  Subtotal: ${formatPeso(order.subtotal)}`,
    `  Shipping (${SHIPPING[order.shippingRegion].label}): ${
      order.shipping === 0 ? "Free" : formatPeso(order.shipping)
    }`,
    `  Total:    ${formatPeso(order.total)}`,
    "",
    "Shipping to:",
    `  ${order.customer.name}`,
    `  ${order.customer.address}`,
    `  ${order.customer.city} ${order.customer.postalCode}`,
    `  ${order.customer.phone}`,
    order.customer.notes ? `\nNote from the customer:\n  ${order.customer.notes}` : "",
    "",
    "Live plants ship Monday to Wednesday so nothing sits in a depot over a weekend.",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Fires once per order, guarded by `confirmationEmailSentAt` so the return
 * endpoint and the Stripe webhook cannot both send it. Sends the customer
 * receipt and a copy to the shop inbox.
 */
export async function sendOrderConfirmation(order: Order): Promise<void> {
  if (order.confirmationEmailSentAt) return;

  const body = receipt(order);

  await deliver({
    to: order.customer.email,
    subject: `Your Leaf & Root order ${order.id}`,
    text: `Thank you — your trees are being prepared.\n\n${body}`,
  });

  await deliver({
    subject: `[order] ${order.id} — ${order.customer.name} — ${formatPeso(order.total)}`,
    replyTo: order.customer.email,
    text: body,
  });

  await orders().update(order.id, {
    confirmationEmailSentAt: new Date().toISOString(),
  });
}
