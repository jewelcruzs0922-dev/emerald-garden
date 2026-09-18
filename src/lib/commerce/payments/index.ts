import { mockProvider } from "./mock";
import { stripeConfigured, stripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

export type { PaymentProvider, PaymentSession, PaymentVerification } from "./types";
export { isMockReference } from "./mock";

/**
 * Stripe when credentials exist, otherwise the mock. The rest of the app only
 * ever talks to the `PaymentProvider` interface.
 */
export function paymentProvider(): PaymentProvider {
  return stripeConfigured() ? stripeProvider : mockProvider;
}

export function paymentProviderName(): string {
  return paymentProvider().name;
}
