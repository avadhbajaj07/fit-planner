"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Shield,
  CreditCard,
  Building,
  Mail,
  AlertTriangle
} from "lucide-react";

export default function AdminSettingsPage() {
  const [brandName, setBrandName] = useState("FIT Planner");
  const [tagline, setTagline] = useState("Your Goals. Your Body. Your Plan.");
  const [activeProvider, setActiveProvider] = useState("none");
  const [nutritionReviewerEnabled, setNutritionReviewerEnabled] = useState(false);
  const [reviewerName, setReviewerName] = useState("Dr. Julian Rossi, RD, CSCS");
  const [companyEntity, setCompanyEntity] = useState("[FIT Planner AG / Ltd]");
  const [jurisdiction, setJurisdiction] = useState("Zurich, Switzerland");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/40">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            Platform Governance
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-0.5">
            Platform Settings &amp; Compliance
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold hover:bg-[#41E9DC] active:scale-95 transition-all shadow-[0_0_15px_rgba(40,218,204,0.3)]"
        >
          <Save size={14} />
          <span>{isSaved ? "Settings Saved ✓" : "Save Settings"}</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* BRANDING */}
        <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B] space-y-4">
          <h3 className="text-base font-bold text-[#F4F9FA]">Brand Identity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-[#F4F9FA] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-[#F4F9FA] outline-none"
              />
            </div>
          </div>
        </div>

        {/* PAYMENT GATEWAY SELECTION */}
        <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F4F9FA] flex items-center gap-2">
              <CreditCard size={17} className="text-[#28DACC]" />
              <span>Active Billing Provider</span>
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#102831] text-[#A8C5CA] border border-[#28525B]">
              Section 11
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { key: "none", label: "None / Development", desc: "Shows clear setup-required status" },
              { key: "stripe", label: "Stripe", desc: "Europe, Switzerland & International" },
              { key: "razorpay", label: "Razorpay", desc: "India (UPI & Cards)" }
            ].map((p) => (
              <div
                key={p.key}
                onClick={() => setActiveProvider(p.key)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeProvider === p.key
                    ? "card-selected-glow bg-[#102831] text-[#28DACC]"
                    : "bg-[#07151D] border-[#28525B]/70 text-[#A8C5CA]"
                }`}
              >
                <div className="font-bold text-xs">{p.label}</div>
                <div className="text-[10px] text-[#A8C5CA] mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* NUTRITION REVIEWER STATUS (Section 10) */}
        <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F4F9FA]">
                Certified Nutrition Reviewer Assignment
              </h3>
              <p className="text-xs text-[#A8C5CA] mt-0.5">
                Per Section 10: Until enabled, all meal plans show the mandatory General Guidance disclaimer.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNutritionReviewerEnabled(!nutritionReviewerEnabled)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                nutritionReviewerEnabled
                  ? "bg-[#28DA8B]/20 text-[#28DA8B] border border-[#28DA8B]/40"
                  : "bg-[#07151D] text-[#A8C5CA] border border-[#28525B]"
              }`}
            >
              {nutritionReviewerEnabled ? "Assigned" : "Unassigned"}
            </button>
          </div>

          {nutritionReviewerEnabled && (
            <div className="text-xs">
              <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                Certifying Clinician / Dietitian Name
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-[#F4F9FA] outline-none"
              />
            </div>
          )}
        </div>

        {/* LEGAL ENTITY PLACEHOLDERS */}
        <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B] space-y-4">
          <h3 className="text-base font-bold text-[#F4F9FA] flex items-center gap-2">
            <Building size={17} className="text-[#28DACC]" />
            <span>Legal Entity &amp; Jurisdiction Placeholders</span>
          </h3>
          <p className="text-xs text-[#A8C5CA]">
            Injected into Privacy Policy and Terms templates:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                Corporate Entity
              </label>
              <input
                type="text"
                value={companyEntity}
                onChange={(e) => setCompanyEntity(e.target.value)}
                className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-[#F4F9FA] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                Governing Jurisdiction
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-[#F4F9FA] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
