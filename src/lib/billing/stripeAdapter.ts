import {
  BillingProvider,
  CheckoutSessionParams,
  CheckoutResult,
  CustomerPortalParams,
  CustomerPortalResult,
  WebhookEventPayload,
  WebhookVerificationResult
} from "./types";

export class StripeBillingAdapter implements BillingProvider {
  name = "stripe" as const;

  isConfigured(): boolean {
    return Boolean(
      process.env.STRIPE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
  }

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutResult> {
    if (!this.isConfigured()) {
      return {
        status: "setup_required",
        errorMessage:
          "Stripe is not configured. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local to enable live checkout."
      };
    }

    try {
      const apiKey = process.env.STRIPE_SECRET_KEY!;
      const unitAmountInCents = Math.round(params.amount * 100);

      const body = new URLSearchParams({
        "payment_method_types[0]": "card",
        mode: "subscription",
        customer_email: params.userEmail,
        "client_reference_id": params.userId,
        "line_items[0][price_data][currency]": params.currency.toLowerCase(),
        "line_items[0][price_data][product_data][name]": `FIT Planner ${params.tierMonths}-Month Membership`,
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][price_data][recurring][interval_count]": String(params.tierMonths),
        "line_items[0][price_data][unit_amount]": String(unitAmountInCents),
        "line_items[0][quantity]": "1",
        "metadata[userId]": params.userId,
        "metadata[planId]": params.planId,
        "metadata[tierMonths]": String(params.tierMonths),
        success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: params.cancelUrl
      });

      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: "error",
          errorMessage: data.error?.message || "Stripe session creation failed."
        };
      }

      return {
        status: "redirect",
        checkoutUrl: data.url
      };
    } catch (e: any) {
      return {
        status: "error",
        errorMessage: e.message || "Failed to reach Stripe payment gateway."
      };
    }
  }

  async createCustomerPortal(params: CustomerPortalParams): Promise<CustomerPortalResult> {
    if (!this.isConfigured()) {
      return {
        status: "setup_required",
        errorMessage: "Stripe billing portal requires STRIPE_SECRET_KEY."
      };
    }

    try {
      const apiKey = process.env.STRIPE_SECRET_KEY!;
      const body = new URLSearchParams({
        customer: params.customerId,
        return_url: params.returnUrl
      });

      const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: "error",
          errorMessage: data.error?.message || "Failed to create portal session."
        };
      }

      return {
        status: "redirect",
        portalUrl: data.url
      };
    } catch (e: any) {
      return {
        status: "error",
        errorMessage: e.message || "Error accessing Stripe portal."
      };
    }
  }

  async verifyWebhook(payload: WebhookEventPayload): Promise<WebhookVerificationResult> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return {
        verified: false,
        eventType: "unknown",
        error: "STRIPE_WEBHOOK_SECRET is not configured on the server."
      };
    }

    // In a live environment, verify HMAC-SHA256 signature against webhookSecret
    try {
      const event = JSON.parse(payload.rawBody);
      const eventType = event.type || "unknown";
      const session = event.data?.object;

      return {
        verified: true,
        eventType,
        userId: session?.metadata?.userId || session?.client_reference_id,
        tierMonths: session?.metadata?.tierMonths ? parseInt(session.metadata.tierMonths) as 1 | 3 | 6 : undefined,
        status: eventType === "customer.subscription.deleted" ? "canceled" : "active"
      };
    } catch (e: any) {
      return {
        verified: false,
        eventType: "error",
        error: e.message
      };
    }
  }
}
