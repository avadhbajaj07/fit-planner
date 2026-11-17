import { BillingProvider, PaymentProviderType } from "./types";
import { StripeBillingAdapter } from "./stripeAdapter";
import { RazorpayBillingAdapter } from "./razorpayAdapter";

class NullBillingAdapter implements BillingProvider {
  name = "none" as const;

  isConfigured(): boolean {
    return false;
  }

  async createCheckoutSession() {
    return {
      status: "setup_required" as const,
      errorMessage:
        "No payment provider is currently configured. Select Stripe or Razorpay in platform settings and add API keys to .env.local."
    };
  }

  async verifyWebhook() {
    return {
      verified: false,
      eventType: "none",
      error: "No active payment provider configured."
    };
  }
}

export function getActiveBillingProvider(
  preferredProvider?: PaymentProviderType
): BillingProvider {
  const chosen =
    preferredProvider ||
    (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as PaymentProviderType) ||
    "none";

  if (chosen === "stripe") {
    return new StripeBillingAdapter();
  }

  if (chosen === "razorpay") {
    return new RazorpayBillingAdapter();
  }

  return new NullBillingAdapter();
}
