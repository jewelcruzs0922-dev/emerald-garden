import { randomBytes } from "node:crypto";
import { mutateJson, readJson } from "./json-store";
import type { PricedLine, ShippingRegion } from "./pricing";

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "fulfilled";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export interface OrderPayment {
  provider: string;
  reference?: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  customer: OrderCustomer;
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingRegion: ShippingRegion;
  payment: OrderPayment;
  confirmationEmailSentAt?: string;
}

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  get(id: string): Promise<Order | null>;
  update(id: string, patch: Partial<Order>): Promise<Order | null>;
  list(): Promise<Order[]>;
}

const FILE = "orders";

/* Ambiguous glyphs removed so an order number can be read aloud. */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function newOrderId(): string {
  const bytes = randomBytes(6);
  let out = "";
  for (const byte of bytes) out += ALPHABET[byte % ALPHABET.length];
  return `LR-${out}`;
}

const fileRepository: OrderRepository = {
  async create(order) {
    await mutateJson<Order[]>(FILE, [], (orders) => [order, ...orders]);
    return order;
  },

  async get(id) {
    const orders = await readJson<Order[]>(FILE, []);
    return orders.find((order) => order.id === id) ?? null;
  },

  async update(id, patch) {
    let updated: Order | null = null;
    await mutateJson<Order[]>(FILE, [], (orders) =>
      orders.map((order) => {
        if (order.id !== id) return order;
        updated = { ...order, ...patch, updatedAt: new Date().toISOString() };
        return updated;
      }),
    );
    return updated;
  },

  async list() {
    const orders = await readJson<Order[]>(FILE, []);
    return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};

/**
 * Swapping this for Postgres/Shopify means writing one more implementation of
 * `OrderRepository` — nothing else in the app needs to change.
 */
export function orders(): OrderRepository {
  return fileRepository;
}

export function isFinal(status: OrderStatus): boolean {
  return status === "paid" || status === "fulfilled" || status === "cancelled";
}
