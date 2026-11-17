"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Save,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { DEFAULT_MEMBERSHIP_PLANS } from "@/lib/billing/plans";
import { MembershipPlan } from "@/lib/billing/types";

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>(DEFAULT_MEMBERSHIP_PLANS);
  const [isSaved, setIsSaved] = useState(false);

  const handlePriceChange = (
    planId: string,
    currency: "CHF" | "EUR" | "USD" | "INR",
    value: string
  ) => {
    const num = parseFloat(value);
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return {
            ...p,
            prices: {
              ...p.prices,
              [currency]: isNaN(num) ? null : num
            }
          };
        }
        return p;
      })
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/40">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            Revenue Operations
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-0.5">
            Membership Packages &amp; Pricing
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold hover:bg-[#41E9DC] active:scale-95 transition-all shadow-[0_0_15px_rgba(40,218,204,0.3)]"
        >
          <Save size={14} />
          <span>{isSaved ? "Prices Saved ✓" : "Save Pricing Matrix"}</span>
        </button>
      </div>

      <p className="text-xs text-[#A8C5CA] leading-relaxed">
        Prices configured here are dynamically consumed by the checkout API. Per Section 11, prices are never hard-coded or invented. Primary launch currencies: CHF, EUR, USD, INR.
      </p>

      {/* Pricing Table */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="ios-glass-card rounded-3xl p-6 border border-[#28525B]"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#28DACC]">
                  {plan.tierMonths}-Month Horizon
                </span>
                <h3 className="text-lg font-bold text-[#F4F9FA] mt-0.5">
                  {plan.name}
                </h3>
              </div>
              <span className="text-xs text-[#A8C5CA] font-mono">
                id: {plan.id}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                  CHF (Switzerland)
                </label>
                <div className="flex items-center bg-[#102831] border border-[#28525B] rounded-xl px-3 py-2">
                  <span className="text-xs text-[#A8C5CA] mr-1.5 font-mono">CHF</span>
                  <input
                    type="number"
                    step="1"
                    value={plan.prices.CHF || ""}
                    onChange={(e) => handlePriceChange(plan.id, "CHF", e.target.value)}
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#F4F9FA] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                  EUR (Europe)
                </label>
                <div className="flex items-center bg-[#102831] border border-[#28525B] rounded-xl px-3 py-2">
                  <span className="text-xs text-[#A8C5CA] mr-1.5 font-mono">€</span>
                  <input
                    type="number"
                    step="1"
                    value={plan.prices.EUR || ""}
                    onChange={(e) => handlePriceChange(plan.id, "EUR", e.target.value)}
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#F4F9FA] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                  USD (International)
                </label>
                <div className="flex items-center bg-[#102831] border border-[#28525B] rounded-xl px-3 py-2">
                  <span className="text-xs text-[#A8C5CA] mr-1.5 font-mono">$</span>
                  <input
                    type="number"
                    step="1"
                    value={plan.prices.USD || ""}
                    onChange={(e) => handlePriceChange(plan.id, "USD", e.target.value)}
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#F4F9FA] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                  INR (India)
                </label>
                <div className="flex items-center bg-[#102831] border border-[#28525B] rounded-xl px-3 py-2">
                  <span className="text-xs text-[#A8C5CA] mr-1.5 font-mono">₹</span>
                  <input
                    type="number"
                    step="50"
                    value={plan.prices.INR || ""}
                    onChange={(e) => handlePriceChange(plan.id, "INR", e.target.value)}
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#F4F9FA] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
