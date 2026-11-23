"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Check,
  Sparkles,
  CreditCard,
  AlertTriangle,
  ChevronLeft,
  ArrowRight,
  Lock,
  Globe
} from "lucide-react";
import { DEFAULT_MEMBERSHIP_PLANS, formatPrice } from "@/lib/billing/plans";
import { CurrencyCode, MembershipPlan } from "@/lib/billing/types";
import { useAuth } from "@/lib/auth/authContext";

export default function MembershipPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("EUR");
  const [selectedPlanId, setSelectedPlanId] = useState("plan_3_month");
  const [isProcessing, setIsProcessing] = useState(false);
  const [setupNotice, setSetupNotice] = useState<string | null>(null);

  const paymentProvider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "none";

  const handleCheckout = async (plan: MembershipPlan) => {
    setIsProcessing(true);
    setSetupNotice(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "guest_athlete",
          userEmail: user?.email || "athlete@fitplanner.app",
          planId: plan.id,
          currency: selectedCurrency,
          tierMonths: plan.tierMonths
        })
      });

      const data = await res.json();

      if (data.status === "redirect" && data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
      } else if (data.status === "setup_required") {
        setSetupNotice(data.errorMessage);
      } else {
        setSetupNotice(
          data.errorMessage ||
            `Payment setup required: Provider "${paymentProvider}" is in development mode. No live payment gateway credentials found.`
        );
      }
    } catch (e: any) {
      setSetupNotice("Network error initiating checkout: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-8">
      {/* Top iOS Header */}
      <header className="pt-safe max-w-4xl mx-auto w-full flex items-center justify-between pb-4 border-b border-[#28525B]/40">
        <Link
          href="/app/profile"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#28DACC] active:opacity-70"
        >
          <ChevronLeft size={20} />
          <span>Profile</span>
        </Link>
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#A8C5CA]">
          MEMBERSHIP SELECTION
        </span>
        <div className="w-16" />
      </header>

      {/* Main Body */}
      <main className="max-w-4xl w-full mx-auto my-auto py-6 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#28DACC]/15 text-[#28DACC] border border-[#28DACC]/30 text-xs font-semibold mb-3">
            <Sparkles size={14} />
            <span>Select Your Training Horizon</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F4F9FA] tracking-tight">
            Unlock Complete Progression
          </h1>
          <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
            Personalized periodized workouts, Focus Mode rest timers, double-progression tracking, and injury-aware regressions.
          </p>

          {/* iOS Segmented Currency Control */}
          <div className="mt-5 inline-flex p-1 rounded-2xl bg-[#102831] border border-[#28525B]">
            {(["EUR", "CHF", "USD", "INR"] as CurrencyCode[]).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setSelectedCurrency(cur)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  selectedCurrency === cur
                    ? "bg-[#28DACC] text-[#07151D] shadow-[0_0_10px_rgba(40,218,204,0.3)]"
                    : "text-[#A8C5CA] hover:text-[#F4F9FA]"
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        {/* Setup Notice Banner */}
        {setupNotice && (
          <div className="p-4 rounded-3xl bg-[#141414] border border-[#FFB020]/50 max-w-2xl mx-auto space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#FFB020] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#FFB020]">Payment Gateway in Development Mode</div>
                <p className="text-xs text-[#F4F9FA] mt-1 leading-relaxed">
                  {setupNotice}
                </p>
                <p className="text-[11px] text-[#8E8E93] mt-1.5">
                  Live payment credentials can be configured in <code className="text-[#28DACC]">.env.local</code>. For local testing, you can proceed directly to Plan Preparation.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262626] flex justify-end">
              <Link
                href="/membership/success"
                className="px-4 py-2 rounded-xl bg-[#28DACC] text-[#000000] font-bold text-xs flex items-center gap-1.5 hover:bg-[#38D8CE] transition-all"
              >
                <span>Continue to Step 6: Prepare Plans</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* 3 Membership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEFAULT_MEMBERSHIP_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const priceFormatted = formatPrice(plan.prices[selectedCurrency], selectedCurrency);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`rounded-3xl p-6 border cursor-pointer flex flex-col justify-between transition-all ${
                  isSelected
                    ? "card-selected-glow bg-[#142D35]"
                    : "bg-[#102831]/80 border-[#28525B]/70 hover:border-[#28DACC]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#28DACC]">
                      {plan.badge}
                    </span>
                    {plan.featured && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#28DACC]/20 text-[#28DACC] font-semibold">
                        Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#F4F9FA]">{plan.name}</h3>
                  <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mt-5 p-3 rounded-2xl bg-[#07151D] border border-[#28525B]/50 text-center">
                    <div className="text-2xl font-bold num-mono text-[#F4F9FA]">
                      {priceFormatted}
                    </div>
                    <div className="text-[10px] text-[#A8C5CA] uppercase font-mono mt-0.5">
                      Billed every {plan.tierMonths} {plan.tierMonths === 1 ? "month" : "months"}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-xs text-[#F4F9FA]">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-[#28DACC]" />
                      <span>Customized deterministic split</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-[#28DACC]" />
                      <span>Restricted mode injury filtering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-[#28DACC]" />
                      <span>Focus Mode &amp; timer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-[#28DACC]" />
                      <span>Offline session support</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#28525B]/50">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckout(plan);
                    }}
                    className={`w-full h-12 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-[#28DACC] text-[#07151D] shadow-[0_0_20px_rgba(40,218,204,0.3)] hover:bg-[#41E9DC]"
                        : "bg-[#07151D] text-[#F4F9FA] border border-[#28525B] hover:border-[#28DACC]"
                    }`}
                  >
                    <span>{isProcessing && isSelected ? "Connecting Gateway..." : "Select & Checkout"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Note */}
        <div className="text-center text-xs text-[#A8C5CA] flex items-center justify-center gap-4 pt-4">
          <span className="flex items-center gap-1.5">
            <Lock size={13} className="text-[#28DACC]" /> 256-bit Encrypted Checkout
          </span>
          <span>·</span>
          <span>Cancel anytime in Profile</span>
          <span>·</span>
          <span>No hidden fees</span>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#A8C5CA]/60 pb-safe">
        FIT Planner · Payment Abstraction Layer (Stripe &amp; Razorpay)
      </footer>
    </div>
  );
}
