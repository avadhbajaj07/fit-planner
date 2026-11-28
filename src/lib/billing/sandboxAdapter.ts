import crypto from "crypto";
import {
  BillingProvider,
  CheckoutResult,
  CheckoutSessionParams,
  CustomerPortalParams,
  CustomerPortalResult,
  WebhookEventPayload,
  WebhookVerificationResult
} from "./types";
import { getSupabaseAdminClient, verifySandboxWebhookSignature } from "./sandboxSecurity";

export class SandboxBillingAdapter implements BillingProvider {
  name = "sandbox" as const;

  isConfigured(): boolean {
    return true;
  }

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutResult> {
    const supabaseAdmin = getSupabaseAdminClient();
    if (!supabaseAdmin) {
      return {
        status: "error",
        errorMessage: "Server billing database client is not configured."
      };
    }

    const sessionId = `sbx_sess_${crypto.randomBytes(12).toString("hex")}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin.from("sandbox_checkout_sessions").insert({
      session_id: sessionId,
      user_id: params.userId,
      user_email: params.userEmail,
      plan_id: params.planId,
      tier_months: params.tierMonths,
      currency: params.currency,
      amount: params.amount,
      status: "pending",
      expires_at: expiresAt
    });

    if (error) {
      return {
        status: "error",
        errorMessage: "Failed to initialize secure sandbox checkout session."
      };
    }

    return {
      status: "redirect",
      checkoutUrl: `/membership/sandbox-checkout?session_id=${encodeURIComponent(sessionId)}`
    };
  }

  async createCustomerPortal(params: CustomerPortalParams): Promise<CustomerPortalResult> {
    return {
      status: "redirect",
      portalUrl: `/membership/sandbox-checkout?action=manage&return_url=${encodeURIComponent(
        params.returnUrl
      )}`
    };
  }

  async verifyWebhook(payload: WebhookEventPayload): Promise<WebhookVerificationResult> {
    const sigCheck = verifySandboxWebhookSignature(payload.rawBody, payload.signature);
    if (!sigCheck.valid) {
      return {
        verified: false,
        eventType: "unauthorized",
        error: sigCheck.error || "Invalid sandbox webhook signature."
      };
    }

    try {
      const data = typeof payload.rawBody === "string" ? JSON.parse(payload.rawBody) : payload.rawBody;
      if (data.provider !== "sandbox" || !data.eventId || !data.userId) {
        return {
          verified: false,
          eventType: "invalid_payload",
          error: "Payload missing required sandbox fields (provider, eventId, userId)."
        };
      }

      return {
        verified: true,
        eventId: data.eventId,
        eventType: data.eventType || "checkout.session.completed",
        userId: data.userId,
        tierMonths: data.tierMonths || 3,
        status: data.status || "active"
      };
    } catch (e: any) {
      return {
        verified: false,
        eventType: "error",
        error: e.message || "Failed to parse sandbox webhook body."
      };
    }
  }
}
