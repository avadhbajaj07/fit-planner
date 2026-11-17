import { NextRequest, NextResponse } from "next/server";
import { getActiveBillingProvider } from "@/lib/billing/provider";

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

    // In production with Supabase connected, update subscriptions table:
    // await supabase.from('subscriptions').upsert({ user_id: verification.userId, status: verification.status, ... });

    return NextResponse.json({
      received: true,
      eventType: verification.eventType,
      userId: verification.userId
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Webhook processing error.", message: e.message },
      { status: 500 }
    );
  }
}
