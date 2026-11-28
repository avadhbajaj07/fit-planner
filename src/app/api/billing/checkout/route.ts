import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActiveBillingProvider } from "@/lib/billing/provider";
import { DEFAULT_MEMBERSHIP_PLANS } from "@/lib/billing/plans";
import { CurrencyCode } from "@/lib/billing/types";
import {
  getAuthenticatedSupabaseUser,
  getSupabaseAdminClient,
  isSandboxAllowed
} from "@/lib/billing/sandboxSecurity";

const CheckoutRequestSchema = z.object({
  planId: z.string(),
  currency: z.enum(["CHF", "EUR", "USD", "INR"]),
  tierMonths: z.union([z.literal(1), z.literal(3), z.literal(6)]).optional()
});

export async function POST(req: NextRequest) {
  try {
    // 1. Require authenticated Supabase user — never trust client-supplied userId
    const user = await getAuthenticatedSupabaseUser(req);
    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Authentication required to activate a membership plan." },
        { status: 401 }
      );
    }

    const json = await req.json();
    const parsed = CheckoutRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout request parameters.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { planId, currency } = parsed.data;

    // 2. Server-side plan, tierMonths, and price lookup (never trust client amounts/tiers)
    const plan = DEFAULT_MEMBERSHIP_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Selected plan not found." }, { status: 404 });
    }

    const amount = plan.prices[currency as CurrencyCode];
    if (amount === null || isNaN(amount)) {
      return NextResponse.json(
        { error: `Pricing for ${currency} is not configured.` },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const provider = getActiveBillingProvider();

    // 3. Instant Preview Activation when no real payment gateway (Stripe/Razorpay) is configured
    if (provider.name === "none" && process.env.INSTANT_PREVIEW_ACCESS !== "false") {
      const supabaseAdmin = getSupabaseAdminClient();
      if (!supabaseAdmin) {
        return NextResponse.json(
          { error: "Server database client is not configured." },
          { status: 500 }
        );
      }

      const now = new Date();
      const periodEnd = new Date(now.getTime() + plan.tierMonths * 30 * 24 * 60 * 60 * 1000);

      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: user.id,
          provider: "preview_free",
          provider_subscription_id: `preview_${user.id.slice(0, 8)}_${Date.now()}`,
          is_sandbox: true,
          status: "active",
          tier_months: plan.tierMonths,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          updated_at: now.toISOString()
        },
        { onConflict: "user_id" }
      );

      await supabaseAdmin
        .from("profiles")
        .update({ membership_status: "active" })
        .eq("id", user.id);

      return NextResponse.json({
        status: "redirect",
        instantActivated: true,
        checkoutUrl: `${appUrl}/membership/success`
      });
    }

    if (provider.name === "sandbox") {
      const sandboxCheck = isSandboxAllowed(user.email);
      if (!sandboxCheck.allowed) {
        return NextResponse.json(
          { error: sandboxCheck.reason || "Sandbox billing is restricted." },
          { status: 403 }
        );
      }
    }

    const result = await provider.createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      planId: plan.id,
      tierMonths: plan.tierMonths,
      currency: currency as CurrencyCode,
      amount,
      successUrl: `${appUrl}/membership/success`,
      cancelUrl: `${appUrl}/membership`
    });

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Internal server error during checkout initiation.", message: e.message },
      { status: 500 }
    );
  }
}
