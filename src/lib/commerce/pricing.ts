import {
  CATALOG_BY_ID,
  FREE_SHIPPING_THRESHOLD,
  formatPeso,
  type Product,
} from "@/lib/catalog";

export const SHIPPING = {
  metro: {
    key: "metro",
    label: "Metro Manila",
    flat: 180,
    eta: "Next-day courier",
  },
  provincial: {
    key: "provincial",
    label: "Provincial",
    flat: 320,
    eta: "Two to four days",
  },
} as const;

export type ShippingRegion = keyof typeof SHIPPING;

export const SHIPPING_REGIONS = Object.values(SHIPPING);

export interface CartInput {
  id: string;
  qty: number;
}

export interface PricedLine {
  id: string;
  name: string;
  img: string;
  env: Product["env"];
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface PricingIssue {
  id: string;
  name: string;
  code: "unknown" | "sold-out" | "insufficient-stock";
  message: string;
}

export interface PricedCart {
  lines: PricedLine[];
  issues: PricingIssue[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  shippingRegion: ShippingRegion;
  freeShipping: boolean;
  total: number;
}

export function isShippingRegion(value: unknown): value is ShippingRegion {
  return value === "metro" || value === "provincial";
}

/**
 * Re-prices a cart from the catalogue. The client's prices are never trusted —
 * only the product ids and quantities are read back, and the numbers come from
 * `CATALOG`. Pass an availability map to validate against live stock.
 */
export function priceCart(
  input: CartInput[],
  region: ShippingRegion = "metro",
  availability?: Record<string, number>,
): PricedCart {
  const lines: PricedLine[] = [];
  const issues: PricingIssue[] = [];

  for (const raw of input) {
    const product = CATALOG_BY_ID[raw?.id];
    const requested = Math.floor(Number(raw?.qty));

    if (!product) {
      issues.push({
        id: String(raw?.id ?? "unknown"),
        name: "Unknown item",
        code: "unknown",
        message: "That tree is no longer in the catalogue and was removed.",
      });
      continue;
    }

    if (!Number.isFinite(requested) || requested < 1) {
      issues.push({
        id: product.id,
        name: product.name,
        code: "unknown",
        message: "Quantity must be at least one.",
      });
      continue;
    }

    const onHand = availability ? (availability[product.id] ?? 0) : product.stock;

    if (onHand <= 0) {
      issues.push({
        id: product.id,
        name: product.name,
        code: "sold-out",
        message: `${product.name} has sold out.`,
      });
      continue;
    }

    const qty = Math.min(requested, onHand);
    if (qty < requested) {
      issues.push({
        id: product.id,
        name: product.name,
        code: "insufficient-stock",
        message: `Only ${qty} of ${product.name} ${qty === 1 ? "is" : "are"} left, so we've adjusted the quantity.`,
      });
    }

    lines.push({
      id: product.id,
      name: product.name,
      img: product.img,
      env: product.env,
      unitPrice: product.price,
      qty,
      lineTotal: product.price * qty,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = lines.length === 0 || freeShipping ? 0 : SHIPPING[region].flat;

  return {
    lines,
    issues,
    itemCount,
    subtotal,
    shipping,
    shippingRegion: region,
    freeShipping,
    total: subtotal + shipping,
  };
}

export function describeShipping(
  cart: Pick<PricedCart, "freeShipping" | "shippingRegion" | "subtotal">,
): string {
  if (cart.freeShipping) return "Free";
  const shortfall = FREE_SHIPPING_THRESHOLD - cart.subtotal;
  return `${formatPeso(SHIPPING[cart.shippingRegion].flat)} · add ${formatPeso(shortfall)} for free shipping`;
}
