import { NextRequest, NextResponse } from "next/server";
import { getActiveBillingProvider } from "@/lib/billing/provider";
import { getSupabaseAdminClient } from "@/lib/billing/sandboxSecurity";
import { sendTransactionalEmail } from "@/lib/email/resendClient";
import { getSubscriptionReceiptEmailHtml } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-sandbox-signature") ||
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
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Server billing database client is not configured." },
        { status: 500 }
      );
    }

    // Idempotency & replay check via billing_events
    const eventId = verification.eventId || `evt_${Date.now()}`;
    const { data: existingEvent } = await supabase
      .from("billing_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({
        received: true,
        duplicate: true,
        eventId,
        eventType: verification.eventType
      });
    }

    let dbSynced = false;
    const isSandbox = provider.name === "sandbox";

    if (verification.userId) {
      const tierMonths = verification.tierMonths || 3;
      const now = new Date();
      const periodEnd = new Date(now.getTime() + tierMonths * 30 * 24 * 60 * 60 * 1000);
      const nextStatus = verification.status || "active";

      // 1. Record billing event first to enforce idempotency
      const { error: eventErr } = await supabase.from("billing_events").insert({
        event_id: eventId,
        provider: provider.name,
        event_type: verification.eventType,
        user_id: verification.userId,
        is_sandbox: isSandbox
      });

      if (eventErr) {
        if (eventErr.code === "23505") {
          return NextResponse.json({ received: true, duplicate: true, eventId });
        }
        console.error("Failed to record billing event:", eventErr.message);
        return NextResponse.json({ error: "Failed to record billing event." }, { status: 500 });
      }

      // 2. Upsert subscription record
      const { error: subError } = await supabase.from("subscriptions").upsert(
        {
          user_id: verification.userId,
          provider: provider.name,
          provider_subscription_id: isSandbox ? `sbx_sub_${eventId}` : `sub_${eventId}`,
          is_sandbox: isSandbox,
          status: nextStatus,
          tier_months: tierMonths,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          updated_at: now.toISOString()
        },
        { onConflict: "user_id" }
      );

      if (subError) {
        console.error("Supabase subscription upsert error:", subError.message);
      } else {
        dbSynced = true;
      }

      // 3. Update athlete profile membership status (service_role bypasses escalation trigger)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          membership_status: nextStatus === "active" ? "active" : "free"
        })
        .eq("id", verification.userId);

      if (profileError) {
        console.error("Supabase profile membership update error:", profileError.message);
      }

      // 4. Dispatch subscription confirmation receipt email on activation
      if (nextStatus === "active") {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", verification.userId)
            .single();

          if (profile?.email) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
            const receiptHtml = getSubscriptionReceiptEmailHtml({
              athleteEmail: profile.email,
              planTitle: `${tierMonths}-Month Athlete Plan${isSandbox ? " (Sandbox Test)" : ""}`,
              amountFormatted: isSandbox ? "Sandbox Test (€0.00)" : "Paid",
              currentPeriodEnd: periodEnd.toLocaleDateString(),
              dashboardUrl: `${appUrl}/app/today`
            });

            await sendTransactionalEmail({
              to: profile.email,
              subject: isSandbox
                ? "[SANDBOX] Shape Radar Membership Confirmation"
                : "Shape Radar Membership Confirmation & Guarantee Terms",
              html: receiptHtml
            });
          }
        } catch (emailErr) {
          console.warn("Transactional receipt email notice:", emailErr);
        }
      }
    }

    return NextResponse.json({
      received: true,
      eventId,
      eventType: verification.eventType,
      userId: verification.userId,
      status: verification.status,
      isSandbox,
      dbSynced
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Webhook processing error.", message: e.message },
      { status: 500 }
    );
  }
}
