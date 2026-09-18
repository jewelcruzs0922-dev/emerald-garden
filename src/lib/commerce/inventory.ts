import { CATALOG, CATALOG_BY_ID } from "@/lib/catalog";
import { mutateJson, readJson } from "./json-store";

/**
 * The catalogue declares how many of each tree exist; this file records how
 * many have been sold. Availability is the difference, so the catalogue stays
 * the single place a grower edits stock levels.
 */
type Sold = Record<string, number>;

const FILE = "inventory";

export class StockError extends Error {
  constructor(
    readonly productId: string,
    readonly remaining: number,
  ) {
    super(`Insufficient stock for ${productId} (${remaining} remaining)`);
    this.name = "StockError";
  }
}

export async function soldMap(): Promise<Sold> {
  return readJson<Sold>(FILE, {});
}

export async function availableMap(): Promise<Record<string, number>> {
  const sold = await soldMap();
  const availability: Record<string, number> = {};
  for (const product of CATALOG) {
    availability[product.id] = Math.max(0, product.stock - (sold[product.id] ?? 0));
  }
  return availability;
}

export async function availableFor(id: string): Promise<number> {
  const product = CATALOG_BY_ID[id];
  if (!product) return 0;
  const sold = await soldMap();
  return Math.max(0, product.stock - (sold[id] ?? 0));
}

/** Atomically claims stock. Throws `StockError` rather than overselling. */
export async function reserveStock(
  lines: { id: string; qty: number }[],
): Promise<void> {
  await mutateJson<Sold>(FILE, {}, (sold) => {
    const next = { ...sold };
    for (const line of lines) {
      const product = CATALOG_BY_ID[line.id];
      if (!product) continue;
      const remaining = Math.max(0, product.stock - (next[line.id] ?? 0));
      if (line.qty > remaining) throw new StockError(line.id, remaining);
      next[line.id] = (next[line.id] ?? 0) + line.qty;
    }
    return next;
  });
}

/** Returns stock to the pool — used when an order is cancelled or fails. */
export async function releaseStock(
  lines: { id: string; qty: number }[],
): Promise<void> {
  await mutateJson<Sold>(FILE, {}, (sold) => {
    const next = { ...sold };
    for (const line of lines) {
      const product = CATALOG_BY_ID[line.id];
      if (!product) continue;
      next[line.id] = Math.max(0, (next[line.id] ?? 0) - line.qty);
    }
    return next;
  });
}
