"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Calendar,
  Clock,
  Dumbbell,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Apple,
  RotateCcw,
  Scale,
  Flame,
  Activity,
  User,
  Heart,
  Zap,
  Check
} from "lucide-react";
import { loadAssessmentProgress } from "@/lib/assessment/storage";
import { generateWorkoutPlan } from "@/lib/engine/recommendation";
import { GeneratedPlan, AssessmentAnswers } from "@/lib/engine/types";
import { BodyDiagram } from "@/components/assessment/BodyDiagram";

export default function ResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  useEffect(() => {
    const data = loadAssessmentProgress();
    setAnswers(data);
    const generated = generateWorkoutPlan(data);
    setPlan(generated);

    // Fire celebratory confetti on arrival
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.65 },
        colors: ["#28DACC", "#38D8CE", "#FFFFFF"]
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!plan || !answers) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#28DACC] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#8E8E93]">Calibrating your customized plan...</p>
        </div>
      </div>
    );
  }

  const splitFormatted =
    plan.split === "full_body"
      ? "Full Body Strength"
      : plan.split === "upper_lower"
      ? "Upper / Lower Split"
      : "Push / Pull / Legs Split";

  const goalName =
    answers.goal === "build_muscle"
      ? "Muscle Hypertrophy & Strength"
      : answers.goal === "lose_weight"
      ? "Fat Loss & Metabolic Conditioning"
      : answers.goal === "gain_weight"
      ? "Muscle Mass & Caloric Surplus"
      : answers.goal === "improve_fitness"
      ? "Cardiorespiratory Stamina"
      : "Sustainable Functional Health";

  // Calorie & Macro calculations
  const weight = answers.weightKg || 78;
  const isLoss = answers.goal === "lose_weight";
  const isGain = answers.goal === "gain_weight" || answers.goal === "build_muscle";
  const baseCalories = Math.round(weight * 24 * 1.35);
  const targetCalories = isLoss ? baseCalories - 450 : isGain ? baseCalories + 300 : baseCalories;
  const targetProteinGrams = Math.round(weight * 2.0);
  const targetFatsGrams = Math.round((targetCalories * 0.25) / 9);
  const targetCarbsGrams = Math.round((targetCalories - targetProteinGrams * 4 - targetFatsGrams * 9) / 4);

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-[#F4F9FA] flex flex-col justify-between selection:bg-[#28DACC] selection:text-[#000000]">
      {/* iOS Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-xl border-b border-[#1A1A1A] px-4 py-3">
        <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/assessment"
            className="text-xs text-[#28DACC] font-semibold flex items-center gap-1 active:opacity-70"
          >
            <span>← Edit Answers</span>
          </Link>
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#28DACC]">
              FIT PLANNER
            </span>
            <h1 className="text-sm font-extrabold text-[#FFFFFF]">Your Blueprint</h1>
          </div>
          <Link
            href="/auth/signup"
            className="text-xs font-bold text-[#28DACC] hover:underline"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md md:max-w-2xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Step 2 Header Banner */}
        <div className="rounded-3xl p-6 bg-[#0E0E0E] border border-[#1F1F1F] relative overflow-hidden shadow-[0_0_30px_rgba(40,218,204,0.08)]">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#28DACC]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#28DACC]/15 text-[#28DACC] border border-[#28DACC]/30 text-xs font-semibold mb-2">
                <Sparkles size={13} />
                <span>22-Point Assessment Complete</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {splitFormatted}
              </h2>
              <p className="text-xs text-[#8E8E93] mt-1">
                Calibrated for {goalName} · {answers.fitnessLevel?.replace(/_/g, " ")} level
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#141414] px-3.5 py-2.5 rounded-2xl border border-[#242424] text-center">
                <div className="text-[10px] text-[#8E8E93] uppercase font-mono">Frequency</div>
                <div className="text-lg font-bold font-mono text-[#28DACC]">
                  {plan.daysPerWeek} <span className="text-xs text-[#8E8E93]">days</span>
                </div>
              </div>
              <div className="bg-[#141414] px-3.5 py-2.5 rounded-2xl border border-[#242424] text-center">
                <div className="text-[10px] text-[#8E8E93] uppercase font-mono">Duration</div>
                <div className="text-lg font-bold font-mono text-[#28DACC]">
                  {plan.durationMinutes} <span className="text-xs text-[#8E8E93]">min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Notice if Restricted Mode */}
          {plan.isRestrictedMode && plan.safetyNotice && (
            <div className="mt-5 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
              <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-400">Restricted Mode Active</h4>
                <p className="text-xs text-[#F4F9FA] mt-0.5 leading-relaxed">
                  {plan.safetyNotice}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Biometrics & Body Composition Card */}
        <div className="rounded-3xl p-5 bg-[#0E0E0E] border border-[#1F1F1F]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Scale size={16} className="text-[#28DACC]" />
            <span>Biometric Profile &amp; Body Composition</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#141414] border border-[#222222]">
              <span className="text-[10px] text-[#8E8E93] uppercase font-mono block">Height</span>
              <span className="text-base font-bold font-mono text-white">
                {answers.heightCm || 178} cm
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141414] border border-[#222222]">
              <span className="text-[10px] text-[#8E8E93] uppercase font-mono block">Weight</span>
              <span className="text-base font-bold font-mono text-white">
                {answers.weightKg || 78} kg
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141414] border border-[#222222]">
              <span className="text-[10px] text-[#8E8E93] uppercase font-mono block">Target</span>
              <span className="text-base font-bold font-mono text-[#28DACC]">
                {answers.targetWeightKg ? `${answers.targetWeightKg} kg` : "Maintenance"}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141414] border border-[#222222]">
              <span className="text-[10px] text-[#8E8E93] uppercase font-mono block">Body Fat</span>
              <span className="text-base font-bold font-mono text-white">
                ~{answers.estimatedBodyFat || 20}%
              </span>
            </div>
          </div>
        </div>

        {/* Nutrition Guidance Card */}
        <div className="rounded-3xl p-5 bg-[#0E0E0E] border border-[#1F1F1F]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Apple size={16} className="text-[#28DACC]" />
              <span>Calibrated Daily Nutrition &amp; Macros</span>
            </h3>
            <span className="text-[11px] font-mono text-[#8E8E93] capitalize">
              {answers.dietType?.replace(/_/g, " ") || "Flexible Diet"} · {answers.mealsPerDay || 3} Meals/Day
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-[#141414] border border-[#242424]">
              <div className="text-[10px] text-[#8E8E93] uppercase font-mono">Calories</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {targetCalories}
              </div>
              <div className="text-[10px] text-[#8E8E93]">kcal/day</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#141414] border border-[#242424]">
              <div className="text-[10px] text-[#8E8E93] uppercase font-mono">Protein</div>
              <div className="text-lg font-bold font-mono text-[#28DACC] mt-0.5">
                {targetProteinGrams}g
              </div>
              <div className="text-[10px] text-[#8E8E93]">2.0g/kg</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#141414] border border-[#242424]">
              <div className="text-[10px] text-[#8E8E93] uppercase font-mono">Carbs</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {targetCarbsGrams}g
              </div>
              <div className="text-[10px] text-[#8E8E93]">energy</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#141414] border border-[#242424]">
              <div className="text-[10px] text-[#8E8E93] uppercase font-mono">Fats</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {targetFatsGrams}g
              </div>
              <div className="text-[10px] text-[#8E8E93]">hormones</div>
            </div>
          </div>
        </div>

        {/* 7-Day Training Cadence */}
        <div className="rounded-3xl p-5 bg-[#0E0E0E] border border-[#1F1F1F]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar size={16} className="text-[#28DACC]" />
              <span>Proposed 7-Day Workout Cadence</span>
            </h3>
            <span className="text-xs text-[#8E8E93] font-mono">
              {plan.daysPerWeek} active / {7 - plan.daysPerWeek} rest
            </span>
          </div>

          <div className="space-y-2">
            {plan.weeklySessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                  session.isRestDay
                    ? "bg-[#0A0A0A] border-[#1C1C1C] text-[#666666]"
                    : "bg-[#141414] border-[#262626] text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-xs font-mono font-bold text-[#28DACC]">
                    {session.dayName.slice(0, 3)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold leading-tight">
                      {session.title}
                    </div>
                    <div className="text-[11px] text-[#8E8E93]">
                      {session.isRestDay
                        ? "Active mobility & muscle recovery"
                        : `${session.exercises.length} Exercises · ${session.estimatedDuration} min`}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-mono ${
                    session.isRestDay
                      ? "bg-[#101010] text-[#666666] border border-[#1F1F1F]"
                      : "bg-[#28DACC]/15 text-[#28DACC] font-bold border border-[#28DACC]/30"
                  }`}
                >
                  {session.isRestDay ? "Rest" : "Training"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* "Why This Plan" (Transparent Recommendation Engine) */}
        <div className="rounded-3xl p-5 bg-[#0E0E0E] border border-[#1F1F1F]">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={16} className="text-[#28DACC]" />
            <h3 className="text-sm font-bold text-white">
              Why This Plan? (Transparent Engine Rationale)
            </h3>
          </div>
          <p className="text-xs text-[#8E8E93] mb-3 leading-relaxed">
            Every parameter is calculated deterministically from your 22 assessment answers:
          </p>

          <div className="space-y-2">
            {plan.rationale.map((point, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-[#141414] border border-[#222222] flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-[#28DACC]/15 text-[#28DACC] text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="text-xs text-[#F4F9FA] leading-relaxed">{point}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* iOS Sticky Thumb Action (Step 3: Create Account) */}
      <footer className="sticky bottom-0 z-40 bg-[#000000]/90 backdrop-blur-xl border-t border-[#1F1F1F] px-4 py-3 pb-safe">
        <div className="max-w-md md:max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/auth/signup"
            className="w-full h-[52px] rounded-2xl bg-[#28DACC] text-[#000000] font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.35)] active:scale-[0.98] transition-all hover:bg-[#38D8CE]"
          >
            <span>Save My Plan &amp; Create Account</span>
            <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
