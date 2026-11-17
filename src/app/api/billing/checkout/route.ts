import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActiveBillingProvider } from "@/lib/billing/provider";
import { DEFAULT_MEMBERSHIP_PLANS } from "@/lib/billing/plans";
import { CurrencyCode } from "@/lib/billing/types";

const CheckoutRequestSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  planId: z.string(),
  currency: z.enum(["CHF", "EUR", "USD", "INR"]),
  tierMonths: z.union([z.literal(1), z.literal(3), z.literal(6)])
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = CheckoutRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout request parameters.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { userId, userEmail, planId, currency, tierMonths } = parsed.data;

    // Find plan and price
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const provider = getActiveBillingProvider();

    const result = await provider.createCheckoutSession({
      userId,
      userEmail,
      planId,
      tierMonths,
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
