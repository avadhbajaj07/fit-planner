import { BillingProvider, PaymentProviderType } from "./types";
import { StripeBillingAdapter } from "./stripeAdapter";
import { RazorpayBillingAdapter } from "./razorpayAdapter";
import { SandboxBillingAdapter } from "./sandboxAdapter";

class NullBillingAdapter implements BillingProvider {
  name = "none" as const;

  isConfigured(): boolean {
    return false;
  }

  async createCheckoutSession() {
    return {
      status: "setup_required" as const,
      errorMessage:
        "No payment provider is currently configured. Select Stripe, Razorpay, or Sandbox in platform settings and add API keys to .env.local."
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
  const isProd = process.env.VERCEL_ENV === "production";
  const defaultProvider: PaymentProviderType =
    isProd && process.env.ENABLE_SANDBOX_BILLING !== "true" ? "none" : "sandbox";

  const chosen =
    preferredProvider ||
    (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as PaymentProviderType) ||
    defaultProvider;

  if (chosen === "stripe") {
    return new StripeBillingAdapter();
  }

  if (chosen === "razorpay") {
    return new RazorpayBillingAdapter();
  }

  if (chosen === "sandbox") {
    if (isProd && process.env.ENABLE_SANDBOX_BILLING !== "true") {
      return new NullBillingAdapter();
    }
    return new SandboxBillingAdapter();
  }

  return new NullBillingAdapter();
}
