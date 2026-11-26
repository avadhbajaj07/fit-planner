import { NextRequest, NextResponse } from "next/server";
import { getActiveBillingProvider } from "@/lib/billing/provider";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("stripe-signature") ||
      req.headers.get("x-razorpay-signature") ||
      "";

    const headersRecord: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headersRecord[key] = value;
    });

    const provider = getActiveBillingProvider();
    const verification = await provider.verifyWebhook({
      rawBody,
      signature,
      headers: headersRecord
    });

    if (!verification.verified) {
      return NextResponse.json(
        { error: "Webhook signature verification failed or provider unconfigured.", details: verification.error },
        { status: 400 }
      );
    }

    // Persist verified subscription to Supabase
    const supabase = getSupabaseAdmin();
    let dbSynced = false;

    if (supabase && verification.userId) {
      try {
        const tierMonths = verification.tierMonths || 3;
        const now = new Date();
        const periodEnd = new Date(now.getTime() + tierMonths * 30 * 24 * 60 * 60 * 1000);

        // 1. Upsert subscription record
        await supabase.from("subscriptions").upsert(
          {
            user_id: verification.userId,
            provider: provider.name,
            provider_subscription_id: `sub_${Date.now()}`,
            status: verification.status || "active",
            tier_months: tierMonths,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString()
          },
          { onConflict: "user_id" }
        );

        // 2. Update athlete profile membership status
        await supabase
          .from("profiles")
          .update({
            membership_status: verification.status === "active" ? "active" : "free"
          })
          .eq("id", verification.userId);

        dbSynced = true;
      } catch (dbErr: any) {
        console.error("Supabase subscription synchronization failed:", dbErr);
      }
    }

    return NextResponse.json({
      received: true,
      eventType: verification.eventType,
      userId: verification.userId,
      status: verification.status,
      dbSynced
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Webhook processing error.", message: e.message },
      { status: 500 }
    );
  }
}
