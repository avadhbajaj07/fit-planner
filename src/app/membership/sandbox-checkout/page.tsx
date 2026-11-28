"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  Loader2,
  Lock
} from "lucide-react";
import { USER_STORAGE_KEY, UserProfile } from "@/lib/auth/authContext";
import { supabase } from "@/lib/supabase/client";

interface SessionData {
  sessionId: string;
  userEmail: string;
  planId: string;
  tierMonths: number;
  currency: string;
  amount: number;
  status: string;
}

function SandboxCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const actionMode = searchParams.get("action");
  const returnUrl = searchParams.get("return_url") || "/app/profile";

  const [loadingPage, setLoadingPage] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [manageEmail, setManageEmail] = useState<string | null>(null);
  const [manageTier, setManageTier] = useState<number>(3);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        headers["Authorization"] = `Bearer ${data.session.access_token}`;
      }
    }
    return headers;
  };

  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const headers = await getAuthHeaders();
        const url =
          actionMode === "manage"
            ? "/api/billing/sandbox-complete?action=manage"
            : `/api/billing/sandbox-complete?session_id=${encodeURIComponent(sessionId || "")}`;

        const res = await fetch(url, { headers });
        const data = await res.json();

        if (!active) return;

        if (!res.ok) {
          setAccessError(data.error || "Unauthorized sandbox access.");
        } else if (data.mode === "manage") {
          setManageEmail(data.userEmail);
          setManageTier(data.subscription?.tier_months || 3);
        } else if (data.session) {
          setSession(data.session);
        }
      } catch (e: any) {
        if (active) setAccessError(e.message || "Failed to load checkout session.");
      } finally {
        if (active) setLoadingPage(false);
      }
    }
    loadSession();
    return () => {
      active = false;
    };
  }, [sessionId, actionMode]);

  const getPlanTitle = (months: number) => {
    if (months === 1) return "Monthly Starter (1 Month)";
    if (months === 6) return "Semi-Annual Elite (6 Months)";
    return "Quarterly Focus (3 Months)";
  };

  const executeSandboxAction = async (action: "complete" | "cancel" | "refund") => {
    setLoadingAction(action);
    setFeedback(
      action === "complete"
        ? "Verifying signed sandbox payment and activating membership..."
        : action === "refund"
        ? "Processing cancellation & reverting membership..."
        : "Cancelling checkout session..."
    );

    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/billing/sandbox-complete", {
        method: "POST",
        headers,
        body: JSON.stringify({
          sessionId: session?.sessionId || undefined,
          action
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error || "Sandbox action rejected by server.");
        setLoadingAction(null);
        return;
      }

      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(USER_STORAGE_KEY);
          if (raw) {
            const user: UserProfile = JSON.parse(raw);
            if (action === "complete") user.membershipStatus = "active";
            if (action === "refund") user.membershipStatus = "free";
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          }
        } catch {}
      }

      if (action === "complete") {
        router.push("/membership/success");
      } else if (action === "cancel") {
        router.push("/membership?error=payment_cancelled");
      } else {
        router.push("/app/profile?notice=refund_simulated");
      }
    } catch (err: any) {
      setFeedback("Network error: " + err.message);
      setLoadingAction(null);
    }
  };

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-[#07151D] flex items-center justify-center text-[#28DACC]">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  if (accessError) {
    return (
      <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#0E242C] border border-[#FF5C5C]/40 text-center space-y-4">
          <Lock size={32} className="text-[#FF5C5C] mx-auto" />
          <h1 className="text-xl font-bold">Sandbox Access Restricted</h1>
          <p className="text-xs text-[#A8C5CA] leading-relaxed">{accessError}</p>
          <Link
            href="/membership"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold"
          >
            Return to Membership
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-8">
      <header className="pt-safe max-w-xl mx-auto w-full flex items-center justify-between pb-4 border-b border-[#28525B]/40">
        <Link
          href={actionMode === "manage" ? returnUrl : "/membership"}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#28DACC] active:opacity-70"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#FFB020] flex items-center gap-1.5 font-bold">
          <AlertTriangle size={13} />
          SANDBOX TEST GATEWAY
        </span>
        <div className="w-16" />
      </header>

      <main className="max-w-xl w-full mx-auto my-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30 text-xs font-semibold">
            <Sparkles size={14} />
            <span>Isolated Preview Sandbox — Zero Real Charges</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] tracking-tight">
            {actionMode === "manage" ? "Manage Sandbox Membership" : "Checkout Simulation"}
          </h1>
        </div>

        <div className="ios-inset-group">
          <div className="ios-inset-row">
            <span className="text-xs text-[#A8C5CA]">Selected Plan</span>
            <span className="text-xs font-semibold text-[#F4F9FA]">
              {getPlanTitle(session?.tierMonths || manageTier)}
            </span>
          </div>
          <div className="ios-inset-row">
            <span className="text-xs text-[#A8C5CA]">Verified Athlete</span>
            <span className="text-xs font-mono text-[#28DACC]">
              {session?.userEmail || manageEmail}
            </span>
          </div>
          {session && (
            <>
              <div className="ios-inset-row">
                <span className="text-xs text-[#A8C5CA]">Simulated Total</span>
                <span className="text-sm font-bold text-[#28DACC]">
                  {session.currency === "EUR" ? "€" : session.currency === "CHF" ? "CHF " : "$"}
                  {session.amount}
                </span>
              </div>
              <div className="ios-inset-row">
                <span className="text-xs text-[#A8C5CA]">Session Status</span>
                <span className="text-xs font-mono uppercase text-[#F4F9FA]">{session.status}</span>
              </div>
            </>
          )}
        </div>

        {feedback && (
          <div className="p-3.5 rounded-2xl bg-[#102831] border border-[#28DACC]/40 text-xs text-[#28DACC] flex items-center gap-2">
            <Loader2 size={16} className="animate-spin shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {actionMode !== "manage" && (
            <>
              <button
                type="button"
                onClick={() => executeSandboxAction("complete")}
                disabled={loadingAction !== null || session?.status !== "pending"}
                className="w-full h-13 py-3 rounded-2xl bg-gradient-to-r from-[#28DACC] to-[#1FB3A6] text-[#07151D] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-[#28DACC]/20 active:scale-[0.99] disabled:opacity-50"
              >
                {loadingAction === "complete" ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                <span>Simulate Successful Payment (Unlock PRO)</span>
              </button>

              <button
                type="button"
                onClick={() => executeSandboxAction("cancel")}
                disabled={loadingAction !== null}
                className="w-full h-12 py-2.5 rounded-2xl bg-[#102831] border border-[#28525B] text-[#A8C5CA] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#163844] hover:text-[#F4F9FA] transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <XCircle size={16} />
                <span>Simulate Declined / Cancelled Payment</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => executeSandboxAction("refund")}
            disabled={loadingAction !== null}
            className="w-full h-12 py-2.5 rounded-2xl bg-transparent border border-[#FF5C5C]/30 text-[#FF5C5C] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#FF5C5C]/10 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <RotateCcw size={15} />
            <span>Simulate Cancellation / 30-Day Refund (Revert to Free)</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#0B2028] border border-[#28525B]/50 text-[11px] text-[#A8C5CA] flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#28DACC] shrink-0" />
          <span>Server-verified HMAC signature &amp; idempotency active. Production users cannot access sandbox mode.</span>
        </div>
      </main>

      <footer className="pb-safe max-w-xl mx-auto w-full text-center pt-4 border-t border-[#28525B]/40 text-[11px] text-[#A8C5CA]">
        Shape Radar Quality Assurance Sandbox &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default function SandboxCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07151D] flex items-center justify-center text-[#28DACC]">
          <Loader2 size={32} className="animate-spin" />
        </div>
      }
    >
      <SandboxCheckoutContent />
    </Suspense>
  );
}
