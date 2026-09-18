import type { PaymentProvider, PaymentSession, PaymentVerification } from "./types";
import type { Order } from "../orders";

/**
 * Default provider. It performs the same shape of work as a real processor —
 * a session is created, the customer is redirected through a return endpoint,
 * the payment is verified, and only then is the order marked paid — but no
 * money moves. That keeps the whole flow demonstrable without credentials.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",

  async createSession(order: Order, origin: string): Promise<PaymentSession> {
    const reference = `mock_${order.id}`;
    return {
      provider: "mock",
      reference,
      redirectUrl: `${origin}/api/checkout/return?order=${encodeURIComponent(
        order.id,
      )}&session=${encodeURIComponent(reference)}`,
    };
  },

  async verify(reference: string): Promise<PaymentVerification> {
    /* A real provider would call out here. The mock accepts any session it
       could have issued. */
    const paid = reference.startsWith("mock_");
    return { paid, reference };
  },
};

/** Session ids the mock will accept, so the return endpoint can sanity-check. */
export function isMockReference(reference: string): boolean {
  return /^mock_LR-[A-Z0-9]{6}$/.test(reference);
}
