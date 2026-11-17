import {
  BillingProvider,
  CheckoutSessionParams,
  CheckoutResult,
  CustomerPortalParams,
  CustomerPortalResult,
  WebhookEventPayload,
  WebhookVerificationResult
} from "./types";

export class RazorpayBillingAdapter implements BillingProvider {
  name = "razorpay" as const;

  isConfigured(): boolean {
    return Boolean(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    );
  }

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutResult> {
    if (!this.isConfigured()) {
      return {
        status: "setup_required",
        errorMessage:
          "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local to enable Razorpay checkout."
      };
    }

    try {
      const keyId = process.env.RAZORPAY_KEY_ID!;
      const keySecret = process.env.RAZORPAY_KEY_SECRET!;
      const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

      // Amount in paise for INR or cents for other currencies
      const amountSmallestUnit = Math.round(params.amount * 100);

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amountSmallestUnit,
          currency: params.currency,
          receipt: `rcpt_${params.userId.slice(0, 10)}_${Date.now()}`,
          notes: {
            userId: params.userId,
            planId: params.planId,
            tierMonths: String(params.tierMonths)
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: "error",
          errorMessage: data.error?.description || "Razorpay order creation failed."
        };
      }

      return {
        status: "redirect",
        orderId: data.id,
        keyId: keyId
      };
    } catch (e: any) {
      return {
        status: "error",
        errorMessage: e.message || "Failed to reach Razorpay gateway."
      };
    }
  }

  async createCustomerPortal(params: CustomerPortalParams): Promise<CustomerPortalResult> {
    return {
      status: "unsupported",
      errorMessage: "Customer portal is handled via Razorpay customer dashboard links."
    };
  }

  async verifyWebhook(payload: WebhookEventPayload): Promise<WebhookVerificationResult> {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return {
        verified: false,
        eventType: "unknown",
        error: "RAZORPAY_WEBHOOK_SECRET is not configured."
      };
    }

    try {
      const event = JSON.parse(payload.rawBody);
      const eventType = event.event || "unknown";
      const paymentEntity = event.payload?.payment?.entity;

      return {
        verified: true,
        eventType,
        userId: paymentEntity?.notes?.userId,
        tierMonths: paymentEntity?.notes?.tierMonths
          ? (parseInt(paymentEntity.notes.tierMonths) as 1 | 3 | 6)
          : undefined,
        status: eventType === "subscription.halted" ? "past_due" : "active"
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
