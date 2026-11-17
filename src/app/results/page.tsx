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
  RotateCcw
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#28DACC", "#41E9DC", "#28525B"]
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!plan || !answers) {
    return (
      <div className="min-h-screen bg-[#07151D] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#28DACC] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#A8C5CA]">Calibrating your customized plan...</p>
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
      ? "Muscle Mass & Caloric Retention"
      : answers.goal === "improve_fitness"
      ? "Cardiorespiratory Stamina"
      : "Sustainable Functional Maintenance";

  return (
    <div className="min-h-[100dvh] bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between">
      {/* iOS App Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#07151D]/80 backdrop-blur-xl border-b border-[#28525B]/40 pt-safe px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/assessment"
            className="text-xs text-[#28DACC] font-medium flex items-center gap-1 active:opacity-70"
          >
            <span>← Edit Answers</span>
          </Link>
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#28DACC]">
              FIT PLANNER
            </span>
            <h1 className="text-sm font-bold text-[#F4F9FA]">Your Plan Blueprint</h1>
          </div>
          <Link
            href="/auth/signup"
            className="text-xs font-semibold text-[#28DACC] hover:underline"
          >
            Save
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 lg:py-8 space-y-6">
        {/* Hero Card */}
        <div className="ios-glass-card rounded-3xl p-6 md:p-8 border border-[#28525B] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#28DACC]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#28DACC]/15 text-[#28DACC] border border-[#28DACC]/30 text-xs font-semibold mb-2">
                <Sparkles size={13} />
                <span>Plan Calculated & Ready</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#F4F9FA] tracking-tight">
                {splitFormatted}
              </h2>
              <p className="text-sm text-[#A8C5CA] mt-1">
                Calibrated for {goalName} · {answers.fitnessLevel?.replace(/_/g, " ")} level
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#102831] px-4 py-3 rounded-2xl border border-[#28525B]">
                <div className="text-[10px] text-[#A8C5CA] uppercase font-mono">Frequency</div>
                <div className="text-xl font-bold num-mono text-[#28DACC]">
                  {plan.daysPerWeek} <span className="text-xs text-[#A8C5CA]">days/wk</span>
                </div>
              </div>
              <div className="bg-[#102831] px-4 py-3 rounded-2xl border border-[#28525B]">
                <div className="text-[10px] text-[#A8C5CA] uppercase font-mono">Session</div>
                <div className="text-xl font-bold num-mono text-[#28DACC]">
                  {plan.durationMinutes} <span className="text-xs text-[#A8C5CA]">min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Notice if Restricted Mode */}
          {plan.isRestrictedMode && plan.safetyNotice && (
            <div className="mt-6 p-4 rounded-2xl bg-[#FFB020]/15 border border-[#FFB020]/40 flex items-start gap-3">
              <ShieldAlert size={20} className="text-[#FFB020] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#FFB020]">Restricted Mode Active</h4>
                <p className="text-xs text-[#F4F9FA] mt-1 leading-relaxed">
                  {plan.safetyNotice}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bento Grid: Sample Week + Anatomy + Why This Plan */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Sample 7-Day Week Schedule (7 cols) */}
          <div className="md:col-span-7 ios-glass-card rounded-3xl p-5 border border-[#28525B]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#F4F9FA] flex items-center gap-2">
                <Calendar size={17} className="text-[#28DACC]" />
                <span>Your 7-Day Training Cadence</span>
              </h3>
              <span className="text-xs text-[#A8C5CA] num-mono">
                {plan.daysPerWeek} active / {7 - plan.daysPerWeek} rest
              </span>
            </div>

            <div className="space-y-2.5">
              {plan.weeklySessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                    session.isRestDay
                      ? "bg-[#07151D]/60 border-[#28525B]/40 text-[#A8C5CA]"
                      : "bg-[#102831] border-[#28525B] text-[#F4F9FA]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-xs font-mono font-semibold text-[#28DACC]">
                      {session.dayName.slice(0, 3)}
                    </span>
                    <div>
                      <div className="text-sm font-semibold leading-tight">
                        {session.title}
                      </div>
                      <div className="text-[11px] text-[#A8C5CA]">
                        {session.isRestDay
                          ? "Mobility & nervous system reset"
                          : `${session.exercises.length} Exercises · ${session.estimatedDuration} min`}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-mono ${
                      session.isRestDay
                        ? "bg-[#07151D] text-[#A8C5CA]/70 border border-[#28525B]/40"
                        : "bg-[#28DACC]/15 text-[#28DACC] font-semibold border border-[#28DACC]/30"
                    }`}
                  >
                    {session.isRestDay ? "Rest" : "Training"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Anatomy & Target Focus (5 cols) */}
          <div className="md:col-span-5 ios-glass-card rounded-3xl p-5 border border-[#28525B] flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F4F9FA] flex items-center gap-2 mb-2">
                <Dumbbell size={17} className="text-[#28DACC]" />
                <span>Muscular Distribution</span>
              </h3>
              <p className="text-xs text-[#A8C5CA] leading-snug">
                Based on your {answers.daysPerWeek}-day frequency and equipment setup:
              </p>

              <div className="mt-3 flex justify-center py-2 bg-[#102831]/60 rounded-2xl border border-[#28525B]/40">
                <BodyDiagram
                  activeMuscles={["chest", "back", "legs", "arms", "core", "shoulders"]}
                  size={105}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#28525B]/60 space-y-1.5 text-xs text-[#A8C5CA]">
              <div className="flex justify-between">
                <span>Equipment Used:</span>
                <span className="font-semibold text-[#F4F9FA] capitalize">
                  {answers.equipment?.join(", ").replace(/_/g, " ") || "Bodyweight"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Progression Protocol:</span>
                <span className="font-semibold text-[#28DACC]">Double Progression</span>
              </div>
            </div>
          </div>
        </div>

        {/* "Why This Plan" Panel (Transparent Recommendation Logic) */}
        <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-[#28DACC]" />
            <h3 className="text-base font-bold text-[#F4F9FA]">
              Why This Plan? (Transparent Engine Rationale)
            </h3>
          </div>
          <p className="text-xs text-[#A8C5CA] mb-4">
            Every parameter in your plan is deterministic and derived directly from your assessment answers:
          </p>

          <div className="space-y-2.5">
            {plan.rationale.map((point, index) => (
              <div
                key={index}
                className="p-3 rounded-2xl bg-[#102831] border border-[#28525B]/60 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#28DACC]/15 text-[#28DACC] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="text-xs text-[#F4F9FA] leading-relaxed">{point}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Setup Note */}
        <div className="p-4 rounded-3xl bg-[#102831] border border-[#28525B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#142D35] text-[#28DA8B] flex items-center justify-center">
              <Apple size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#F4F9FA]">
                Stage C: Nutrition Setup Pending
              </div>
              <div className="text-xs text-[#A8C5CA]">
                Allergies, preferences, and dietary macros calibrate inside your member app.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* iOS Sticky Thumb-Zone Save Plan Action */}
      <footer className="sticky bottom-0 z-40 bg-[#07151D]/90 backdrop-blur-xl border-t border-[#28525B]/50 px-4 py-3 pb-safe">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href="/auth/signup"
            className="w-full h-[50px] rounded-[14px] bg-[#28DACC] text-[#07151D] font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.35)] active:scale-[0.98] transition-all hover:bg-[#41E9DC]"
          >
            <span>Save My Plan & Create Account</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
