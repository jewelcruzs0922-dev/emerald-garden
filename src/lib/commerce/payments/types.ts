import type { Order } from "../orders";

export interface PaymentSession {
  provider: string;
  reference: string;
  /** Where the customer is sent to complete payment. */
  redirectUrl: string;
}

export interface PaymentVerification {
  paid: boolean;
  reference: string;
  raw?: unknown;
}

export interface PaymentProvider {
  readonly name: string;
  createSession(order: Order, origin: string): Promise<PaymentSession>;
  verify(reference: string): Promise<PaymentVerification>;
}
