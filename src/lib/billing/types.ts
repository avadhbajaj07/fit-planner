export type PaymentProviderType = "stripe" | "razorpay" | "none";

export type CurrencyCode = "CHF" | "EUR" | "USD" | "INR";

export interface MembershipPlan {
  id: string;
  tierMonths: 1 | 3 | 6;
  name: string;
  badge?: string;
  description: string;
  prices: Record<CurrencyCode, number | null>; // null if unconfigured
  featured?: boolean;
}

export interface CheckoutSessionParams {
  userId: string;
  userEmail: string;
  planId: string;
  tierMonths: 1 | 3 | 6;
  currency: CurrencyCode;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  status: "redirect" | "setup_required" | "error";
  checkoutUrl?: string;
  orderId?: string; // Razorpay order/subscription id
  keyId?: string;   // Razorpay publishable key
  errorMessage?: string;
}

export interface CustomerPortalParams {
  userId: string;
  customerId: string;
  returnUrl: string;
}

export interface CustomerPortalResult {
  status: "redirect" | "setup_required" | "unsupported" | "error";
  portalUrl?: string;
  errorMessage?: string;
}

export interface WebhookEventPayload {
  rawBody: string;
  signature: string;
  headers: Record<string, string | string[] | undefined>;
}

export interface WebhookVerificationResult {
  verified: boolean;
  eventType: string;
  userId?: string;
  tierMonths?: 1 | 3 | 6;
  status?: "active" | "past_due" | "canceled";
  error?: string;
}

export interface BillingProvider {
  name: PaymentProviderType;
  isConfigured(): boolean;
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutResult>;
  createCustomerPortal?(params: CustomerPortalParams): Promise<CustomerPortalResult>;
  verifyWebhook(payload: WebhookEventPayload): Promise<WebhookVerificationResult>;
}
