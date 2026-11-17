"use client";

import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Dumbbell,
  Calendar,
  Clock,
  Sparkles,
  Award
} from "lucide-react";
import { GeneratedPlan } from "@/lib/engine/types";

interface ShareablePlanCardProps {
  plan: GeneratedPlan;
}

export const ShareablePlanCard: React.FC<ShareablePlanCardProps> = ({ plan }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const summaryText = `🔥 My FIT Planner Blueprint:\n• Split: ${plan.split.replace(/_/g, " ").toUpperCase()}\n• Schedule: ${plan.daysPerWeek} Days / Week\n• Session Length: ${plan.durationMinutes} min\n• Program: Double Progression Strength\n\nBuilt on FIT Planner — Your Goals. Your Body. Your Plan.`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const splitFormatted =
    plan.split === "full_body"
      ? "Full Body Strength"
      : plan.split === "upper_lower"
      ? "Upper / Lower Split"
      : "Push / Pull / Legs";

  return (
    <div className="w-full max-w-md mx-auto">
      {/* High-Resolution Branded Athlete Card (No Private Health Data) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#102831] via-[#142D35] to-[#07151D] border-2 border-[#28DACC]/50 p-6 shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#28DACC]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#28525B]/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#07151D] border border-[#28DACC] flex items-center justify-center text-[#28DACC] font-bold text-xs">
              FP
            </div>
            <div>
              <div className="text-xs font-bold text-[#F4F9FA] tracking-tight">
                FIT PLANNER
              </div>
              <div className="text-[9px] font-mono text-[#28DACC] tracking-widest uppercase">
                Athlete OS
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#102831] text-[#A8C5CA] border border-[#28525B]">
            Verified Blueprint
          </span>
        </div>

        {/* Plan Core Title */}
        <div className="my-5">
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#28DACC]">
            Training Structure
          </div>
          <h3 className="text-2xl font-extrabold text-[#F4F9FA] tracking-tight mt-0.5">
            {splitFormatted}
          </h3>
          <p className="text-xs text-[#A8C5CA] mt-1 capitalize font-medium">
            Goal: {plan.goal.replace(/_/g, " ")} · {plan.fitnessLevel.replace(/_/g, " ")}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-[#07151D]/80 p-3 rounded-2xl border border-[#28525B]/50">
            <div className="flex items-center gap-1.5 text-[10px] text-[#A8C5CA]">
              <Calendar size={12} className="text-[#28DACC]" /> Cadence
            </div>
            <div className="text-xl font-bold num-mono text-[#F4F9FA] mt-1">
              {plan.daysPerWeek} <span className="text-xs text-[#A8C5CA]">days/wk</span>
            </div>
          </div>

          <div className="bg-[#07151D]/80 p-3 rounded-2xl border border-[#28525B]/50">
            <div className="flex items-center gap-1.5 text-[10px] text-[#A8C5CA]">
              <Clock size={12} className="text-[#28DACC]" /> Session
            </div>
            <div className="text-xl font-bold num-mono text-[#28DACC] mt-1">
              {plan.durationMinutes} <span className="text-xs text-[#A8C5CA]">min</span>
            </div>
          </div>
        </div>

        {/* 7-Day Dots Strip */}
        <div className="p-3 bg-[#07151D]/60 rounded-2xl border border-[#28525B]/40 flex items-center justify-between">
          <span className="text-[10px] text-[#A8C5CA] font-mono">Week Layout:</span>
          <div className="flex items-center gap-1.5">
            {plan.weeklySessions.map((s, idx) => (
              <span
                key={idx}
                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                  s.isRestDay
                    ? "bg-[#102831] text-[#A8C5CA]/40"
                    : "bg-[#28DACC] text-[#07151D]"
                }`}
              >
                {s.dayName.slice(0, 1)}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="mt-4 pt-3 border-t border-[#28525B]/40 flex items-center justify-between text-[10px] text-[#A8C5CA] font-mono">
          <span>Your Goals. Your Body. Your Plan.</span>
          <span className="text-[#28DACC]">fitplanner.app</span>
        </div>
      </div>

      {/* Share / Copy Button */}
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={handleShare}
          className="w-full h-11 rounded-xl bg-[#102831] border border-[#28525B] hover:border-[#28DACC] text-xs font-semibold text-[#F4F9FA] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <Check size={14} className="text-[#28DA8B]" />
              <span className="text-[#28DA8B]">Summary Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 size={14} className="text-[#28DACC]" />
              <span>Share Plan Card Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
