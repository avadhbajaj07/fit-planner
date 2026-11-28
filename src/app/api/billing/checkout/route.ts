import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActiveBillingProvider } from "@/lib/billing/provider";
import { DEFAULT_MEMBERSHIP_PLANS } from "@/lib/billing/plans";
import { CurrencyCode } from "@/lib/billing/types";
import { getAuthenticatedSupabaseUser, isSandboxAllowed } from "@/lib/billing/sandboxSecurity";

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
        { error: "Authentication required to initiate checkout." },
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

    const provider = getActiveBillingProvider();
    if (provider.name === "sandbox") {
      const sandboxCheck = isSandboxAllowed(user.email);
      if (!sandboxCheck.allowed) {
        return NextResponse.json(
          { error: sandboxCheck.reason || "Sandbox billing is restricted." },
          { status: 403 }
        );
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

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
