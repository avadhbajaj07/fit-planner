"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  ArrowRight,
  Dumbbell,
  Sparkles,
  Apple,
  ShieldCheck,
  Check,
  Activity,
  Layers
} from "lucide-react";
import { loadAssessmentProgress } from "@/lib/assessment/storage";
import { generateWorkoutPlan } from "@/lib/engine/recommendation";

export default function MembershipSuccessPage() {
  const [prepProgress, setPrepProgress] = useState(0);
  const [prepStepIndex, setPrepStepIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#28DACC", "#38D8CE", "#FFFFFF"]
      });
    } catch (e) {
      // ignore
    }

    // Step 6: Simulate plan generation animation (0% -> 100%)
    const interval = setInterval(() => {
      setPrepProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const next = prev + 5;
        if (next > 30 && next <= 60) setPrepStepIndex(1);
        else if (next > 60 && next <= 85) setPrepStepIndex(2);
        else if (next > 85) setPrepStepIndex(3);
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-8 selection:bg-[#28DACC] selection:text-[#000000]">
      <div className="max-w-md w-full mx-auto my-auto text-center space-y-6">
        {/* Status Header */}
        <div className="w-16 h-16 rounded-3xl bg-[#28DACC]/15 text-[#28DACC] flex items-center justify-center mx-auto border border-[#28DACC]/30 shadow-[0_0_24px_rgba(40,218,204,0.25)]">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
            STEP 5 &amp; 6 · ACCESS ACTIVATED
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
            Personalized Plans Prepared
          </h1>
          <p className="text-xs text-[#8E8E93] mt-2 leading-relaxed">
            Your payment is verified and your customized training macrocycle and nutrition guidance are fully synthesized.
          </p>
        </div>

        {/* Step 6 Animated Generation Card */}
        <div className="p-5 rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] text-left space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#28DACC]" />
              <span>Step 6: Plan Preparation Engine</span>
            </span>
            <span className="font-mono text-[#28DACC]">{prepProgress}%</span>
          </div>

          <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#28DACC] h-full rounded-full transition-all duration-150 shadow-[0_0_8px_#28DACC]"
              style={{ width: `${prepProgress}%` }}
            />
          </div>

          <div className="space-y-2 pt-2 text-xs">
            {[
              { label: "Deterministic progressive overload rules loaded", done: prepStepIndex >= 0 },
              { label: "Curated 40-exercise library filtered for restrictions", done: prepStepIndex >= 1 },
              { label: "Allergen-free macronutrient targets calculated", done: prepStepIndex >= 2 },
              { label: "Customer Dashboard & Focus Mode unlocked", done: prepStepIndex >= 3 }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 transition-colors ${
                  item.done ? "text-[#F4F9FA]" : "text-[#555555]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    item.done
                      ? "bg-[#28DACC] text-[#000000]"
                      : "bg-[#1A1A1A] text-[#444444]"
                  }`}
                >
                  {item.done ? <Check size={10} strokeWidth={3} /> : idx + 1}
                </div>
                <span className="text-[11px]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 7 Action Button */}
        <div className="pt-2">
          <Link
            href="/app/today"
            className="w-full h-14 rounded-2xl bg-[#28DACC] text-[#000000] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.35)] active:scale-95 transition-all hover:bg-[#38D8CE]"
          >
            <span>Step 7: Open Customer Dashboard</span>
            <ArrowRight size={18} strokeWidth={3} />
          </Link>
          <p className="text-[11px] text-[#666666] mt-2">
            Workouts · Nutrition Guidance · Focus Mode · Progress Tracking
          </p>
        </div>
      </div>

      <footer className="text-center text-[11px] text-[#666666] pb-safe">
        FIT Planner OS · Customer Portal
      </footer>
    </div>
  );
}
