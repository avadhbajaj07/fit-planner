import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedSupabaseUser,
  getSupabaseAdminClient,
  isSandboxAllowed,
  signSandboxWebhook
} from "@/lib/billing/sandboxSecurity";
import { POST as handleWebhookPost } from "@/app/api/billing/webhook/route";

const ActionSchema = z.object({
  sessionId: z.string().optional(),
  action: z.enum(["complete", "cancel", "refund"])
});

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedSupabaseUser(req);
  if (!user || !user.email) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const sandboxCheck = isSandboxAllowed(user.email);
  if (!sandboxCheck.allowed) {
    return NextResponse.json(
      { error: sandboxCheck.reason || "Sandbox checkout is disabled in this environment." },
      { status: 403 }
    );
  }

  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server billing client unconfigured." }, { status: 500 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  const action = req.nextUrl.searchParams.get("action");

  if (action === "manage") {
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("status, tier_months, current_period_end, is_sandbox, provider")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      mode: "manage",
      userEmail: user.email,
      subscription: sub || null
    });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  const { data: session, error } = await supabaseAdmin
    .from("sandbox_checkout_sessions")
    .select("session_id, user_id, user_email, plan_id, tier_months, currency, amount, status, expires_at")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error || !session) {
    return NextResponse.json({ error: "Checkout session not found." }, { status: 404 });
  }

  if (session.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden: session belongs to another user." }, { status: 403 });
  }

  return NextResponse.json({
    mode: "checkout",
    session: {
      sessionId: session.session_id,
      userEmail: session.user_email,
      planId: session.plan_id,
      tierMonths: session.tier_months,
      currency: session.currency,
      amount: session.amount,
      status: session.status,
      expiresAt: session.expires_at
    }
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedSupabaseUser(req);
  if (!user || !user.email) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const sandboxCheck = isSandboxAllowed(user.email);
  if (!sandboxCheck.allowed) {
    return NextResponse.json(
      { error: sandboxCheck.reason || "Sandbox billing is disabled in this environment." },
      { status: 403 }
    );
  }

  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server billing client unconfigured." }, { status: 500 });
  }

  const json = await req.json();
  const parsed = ActionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
  }

  const { sessionId, action } = parsed.data;
  let tierMonths: 1 | 3 | 6 = 3;

  if (sessionId) {
    const { data: session } = await supabaseAdmin
      .from("sandbox_checkout_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (!session) {
      return NextResponse.json({ error: "Sandbox session not found." }, { status: 404 });
    }
    if (session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: session belongs to another user." }, { status: 403 });
    }
    if (action === "complete") {
      if (session.status !== "pending") {
        return NextResponse.json(
          { error: `Session already processed (status: ${session.status}).` },
          { status: 409 }
        );
      }
      if (new Date(session.expires_at).getTime() < Date.now()) {
        await supabaseAdmin
          .from("sandbox_checkout_sessions")
          .update({ status: "expired" })
          .eq("session_id", sessionId);
        return NextResponse.json({ error: "Sandbox session expired." }, { status: 410 });
      }
      await supabaseAdmin
        .from("sandbox_checkout_sessions")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("session_id", sessionId);
    } else if (action === "cancel") {
      await supabaseAdmin
        .from("sandbox_checkout_sessions")
        .update({ status: "cancelled" })
        .eq("session_id", sessionId);
      return NextResponse.json({ ok: true, status: "cancelled" });
    } else if (action === "refund") {
      await supabaseAdmin
        .from("sandbox_checkout_sessions")
        .update({ status: "refunded" })
        .eq("session_id", sessionId);
    }
    tierMonths = session.tier_months as 1 | 3 | 6;
  } else if (action !== "refund") {
    return NextResponse.json({ error: "sessionId is required for checkout actions." }, { status: 400 });
  }

  const eventId = `sbx_evt_${sessionId || user.id}_${action}_${crypto.randomBytes(6).toString("hex")}`;
  const webhookBody = JSON.stringify({
    provider: "sandbox",
    eventId,
    eventType: action === "complete" ? "checkout.session.completed" : "customer.subscription.deleted",
    userId: user.id,
    tierMonths,
    status: action === "complete" ? "active" : "canceled"
  });

  const signature = signSandboxWebhook(webhookBody);
  if (!signature) {
    return NextResponse.json({ error: "Server sandbox webhook secret not configured." }, { status: 500 });
  }

  // Internally invoke the webhook handler with a valid HMAC signature
  const internalReq = new NextRequest(new URL("/api/billing/webhook", req.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-sandbox-signature": signature
    },
    body: webhookBody
  });

  return handleWebhookPost(internalReq);
}
