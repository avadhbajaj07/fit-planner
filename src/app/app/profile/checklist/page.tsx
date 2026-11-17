"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Dumbbell,
  Scale,
  Moon,
  Zap,
  Activity,
  Flame,
  AlertCircle
} from "lucide-react";
import { BodyDiagram } from "@/components/assessment/BodyDiagram";
import { MuscleGroup } from "@/lib/engine/types";
import { loadAssessmentProgress, saveAssessmentProgress } from "@/lib/assessment/storage";

export default function ProfileChecklistPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalChecklistSteps = 8;

  // Form states
  const [muscleFocus, setMuscleFocus] = useState<MuscleGroup[]>(["full_body"]);

  // Height state
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [heightCm, setHeightCm] = useState(175);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);

  // Weight state
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [weightKg, setWeightKg] = useState(74);
  const [targetWeightKg, setTargetWeightKg] = useState(70);

  // Body shape
  const [bodyShape, setBodyShape] = useState<string>("average");

  // Activity & lifestyle
  const [dailyActivity, setDailyActivity] = useState("moderate");
  const [sleepHours, setSleepHours] = useState("7_8");
  const [biggestChallenge, setBiggestChallenge] = useState("consistency");
  const [currentFrequency, setCurrentFrequency] = useState("1_2");

  useEffect(() => {
    const saved = loadAssessmentProgress();
    if (saved.muscleFocus && saved.muscleFocus.length > 0) {
      setMuscleFocus(saved.muscleFocus);
    }
    if (saved.heightCm) setHeightCm(saved.heightCm);
    if (saved.weightKg) setWeightKg(saved.weightKg);
  }, []);

  const handleToggleMuscle = (m: MuscleGroup) => {
    if (m === "full_body") {
      setMuscleFocus(["full_body"]);
      return;
    }
    const withoutFull = muscleFocus.filter((x) => x !== "full_body");
    if (withoutFull.includes(m)) {
      const next = withoutFull.filter((x) => x !== m);
      setMuscleFocus(next.length === 0 ? ["full_body"] : next);
    } else {
      setMuscleFocus([...withoutFull, m]);
    }
  };

  const getNormalizedHeightCm = () => {
    if (heightUnit === "cm") return heightCm;
    return Math.round(heightFt * 30.48 + heightIn * 2.54);
  };

  const getNormalizedWeightKg = () => {
    if (weightUnit === "kg") return weightKg;
    return Math.round(weightKg * 0.453592);
  };

  const handleFinishChecklist = () => {
    const current = loadAssessmentProgress();
    const updated = {
      ...current,
      muscleFocus,
      heightCm: getNormalizedHeightCm(),
      weightKg: getNormalizedWeightKg(),
      targetWeightKg
    };
    saveAssessmentProgress(updated);
    router.push("/app/today");
  };

  const next = () => {
    if (step < totalChecklistSteps) {
      setStep((s) => s + 1);
    } else {
      handleFinishChecklist();
    }
  };

  const prev = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      router.push("/app/today");
    }
  };

  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-6">
      {/* iOS App Navigation Header */}
      <header className="pt-safe flex items-center justify-between max-w-xl mx-auto w-full pb-3 border-b border-[#28525B]/40">
        <button
          type="button"
          onClick={prev}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#28DACC] active:opacity-70"
        >
          <ChevronLeft size={20} />
          <span>{step === 1 ? "Dashboard" : "Back"}</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#A8C5CA]">
            STAGE B FINE-TUNING
          </span>
          <div className="text-xs font-bold text-[#F4F9FA]">
            Checklist Item {step} of {totalChecklistSteps}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          className="text-xs text-[#28DACC] font-semibold"
        >
          {step === totalChecklistSteps ? "Finish" : "Skip"}
        </button>
      </header>

      {/* Main Checklist Question View */}
      <main className="max-w-xl w-full mx-auto my-auto py-6">
        <div className="ios-glass-card rounded-3xl p-6 md:p-8 border border-[#28525B]">
          {/* STEP 1: MUSCLE FOCUS */}
          {step === 1 && (
            <div>
              <span className="text-xs font-mono uppercase text-[#28DACC]">
                Checklist 1/8 · Target Areas
              </span>
              <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
                Which muscles do you want to prioritize?
              </h2>
              <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                Highlights your target areas on the anatomical body diagram. Full Body distributes volume evenly.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-1/2 space-y-2">
                  {[
                    { key: "full_body", label: "Full Body (Balanced)" },
                    { key: "chest", label: "Chest (Pectorals)" },
                    { key: "back", label: "Back (Lats & Rhomboids)" },
                    { key: "shoulders", label: "Shoulders (Delts)" },
                    { key: "arms", label: "Arms (Biceps & Triceps)" },
                    { key: "legs", label: "Legs (Quads & Glutes)" },
                    { key: "core", label: "Abs & Core" }
                  ].map((item) => {
                    const isSelected = muscleFocus.includes(item.key as MuscleGroup);
                    return (
                      <div
                        key={item.key}
                        onClick={() => handleToggleMuscle(item.key as MuscleGroup)}
                        className={`p-2.5 rounded-xl border cursor-pointer text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? "card-selected-glow bg-[#102831] text-[#28DACC]"
                            : "bg-[#07151D]/60 border-[#28525B]/60 text-[#A8C5CA] hover:bg-[#102831]"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <CheckCircle2 size={14} className="text-[#28DACC]" />}
                      </div>
                    );
                  })}
                </div>

                <div className="w-full sm:w-1/2 flex justify-center p-3 bg-[#102831]/50 rounded-2xl border border-[#28525B]/40">
                  <BodyDiagram activeMuscles={muscleFocus} size={115} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HEIGHT & WEIGHT NORMALIZATION */}
          {step === 2 && (
            <div>
              <span className="text-xs font-mono uppercase text-[#28DACC]">
                Checklist 2/8 · Biometrics
              </span>
              <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
                Height &amp; Current Weight
              </h2>
              <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                Normalises automatically between metric (cm/kg) and imperial (ft-in/lb).
              </p>

              <div className="mt-6 space-y-6">
                {/* Height Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-[#A8C5CA]">Height</span>
                    <div className="inline-flex p-0.5 rounded-lg bg-[#07151D] border border-[#28525B]">
                      <button
                        type="button"
                        onClick={() => setHeightUnit("cm")}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                          heightUnit === "cm" ? "bg-[#28DACC] text-[#07151D] font-bold" : "text-[#A8C5CA]"
                        }`}
                      >
                        cm
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeightUnit("ft")}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                          heightUnit === "ft" ? "bg-[#28DACC] text-[#07151D] font-bold" : "text-[#A8C5CA]"
                        }`}
                      >
                        ft/in
                      </button>
                    </div>
                  </div>

                  {heightUnit === "cm" ? (
                    <div className="flex items-center gap-4 bg-[#102831] p-3.5 rounded-2xl border border-[#28525B]">
                      <input
                        type="range"
                        min="130"
                        max="220"
                        value={heightCm}
                        onChange={(e) => setHeightCm(parseInt(e.target.value))}
                        className="flex-1 accent-[#28DACC]"
                      />
                      <span className="w-16 text-right font-bold num-mono text-lg text-[#28DACC]">
                        {heightCm} cm
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-[#102831] p-3.5 rounded-2xl border border-[#28525B]">
                      <select
                        value={heightFt}
                        onChange={(e) => setHeightFt(parseInt(e.target.value))}
                        className="bg-[#07151D] p-2 rounded-xl text-sm font-mono text-[#F4F9FA] border border-[#28525B] flex-1"
                      >
                        {[4, 5, 6, 7].map((f) => (
                          <option key={f} value={f}>
                            {f} feet
                          </option>
                        ))}
                      </select>
                      <select
                        value={heightIn}
                        onChange={(e) => setHeightIn(parseInt(e.target.value))}
                        className="bg-[#07151D] p-2 rounded-xl text-sm font-mono text-[#F4F9FA] border border-[#28525B] flex-1"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((inch) => (
                          <option key={inch} value={inch}>
                            {inch} inches
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Weight Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-[#A8C5CA]">Current Weight</span>
                    <div className="inline-flex p-0.5 rounded-lg bg-[#07151D] border border-[#28525B]">
                      <button
                        type="button"
                        onClick={() => setWeightUnit("kg")}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                          weightUnit === "kg" ? "bg-[#28DACC] text-[#07151D] font-bold" : "text-[#A8C5CA]"
                        }`}
                      >
                        kg
                      </button>
                      <button
                        type="button"
                        onClick={() => setWeightUnit("lb")}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                          weightUnit === "lb" ? "bg-[#28DACC] text-[#07151D] font-bold" : "text-[#A8C5CA]"
                        }`}
                      >
                        lb
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-[#102831] p-3.5 rounded-2xl border border-[#28525B]">
                    <input
                      type="range"
                      min={weightUnit === "kg" ? "40" : "90"}
                      max={weightUnit === "kg" ? "160" : "350"}
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseInt(e.target.value))}
                      className="flex-1 accent-[#28DACC]"
                    />
                    <span className="w-20 text-right font-bold num-mono text-lg text-[#28DACC]">
                      {weightKg} {weightUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TARGET WEIGHT (OPTIONAL) */}
          {step === 3 && (
            <div>
              <span className="text-xs font-mono uppercase text-[#28DACC]">
                Checklist 3/8 · Target (Optional)
              </span>
              <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
                Do you have a target weight goal?
              </h2>
              <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                Completely optional and skippable. Used to calculate long-term progressive milestone checkpoints.
              </p>

              <div className="mt-8 flex flex-col items-center">
                <div className="text-5xl font-bold num-mono text-[#28DACC]">
                  {targetWeightKg} <span className="text-sm text-[#A8C5CA]">kg</span>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setTargetWeightKg((w) => Math.max(40, w - 1))}
                    className="w-12 h-12 rounded-2xl bg-[#102831] border border-[#28525B] text-xl font-bold flex items-center justify-center active:scale-95"
                  >
                    –
                  </button>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(parseInt(e.target.value))}
                    className="w-44 accent-[#28DACC]"
                  />
                  <button
                    type="button"
                    onClick={() => setTargetWeightKg((w) => Math.min(160, w + 1))}
                    className="w-12 h-12 rounded-2xl bg-[#102831] border border-[#28525B] text-xl font-bold flex items-center justify-center active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BODY SHAPE (ABSTRACT SILHOUETTES, NON-MEDICAL) */}
          {step === 4 && (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#28DACC]">
                  Checklist 4/8 · Optional Framework
                </span>
                <span className="text-[10px] text-[#A8C5CA] font-mono">Skippable</span>
              </div>
              <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
                Body Shape Frame
              </h2>
              <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                Simple abstract silhouettes. Not a clinical diagnosis and not used for medical conclusions.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                {[
                  { key: "slim", label: "Slim / Lean Frame", desc: "Narrow shoulders, naturally leaner" },
                  { key: "average", label: "Average / Athletic", desc: "Balanced proportions" },
                  { key: "heavy", label: "Heavier / Solid", desc: "Thicker joints, carries mass easily" },
                  { key: "very_heavy", label: "Higher Body Fat", desc: "Higher soft tissue density" },
                  { key: "not_sure", label: "Not Sure / Skip", desc: "Standard reference" }
                ].map((item) => {
                  const isSelected = bodyShape === item.key;
                  return (
                    <div
                      key={item.key}
                      onClick={() => setBodyShape(item.key)}
                      className={`p-3.5 rounded-2xl border cursor-pointer text-center transition-all ${
                        isSelected
                          ? "card-selected-glow bg-[#102831]"
                          : "bg-[#07151D]/60 border-[#28525B]/60 hover:bg-[#102831]"
                      }`}
                    >
                      <div className="text-xs font-bold text-[#F4F9FA]">{item.label}</div>
                      <div className="text-[10px] text-[#A8C5CA] mt-1">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: DAILY ACTIVITY LEVEL */}
          {step === 5 && (
            <div>
              <span className="text-xs font-mono uppercase text-[#28DACC]">
                Checklist 5/8 · NEAT &amp; Activity
              </span>
              <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
                Daily Non-Exercise Activity?
              </h2>
              <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                Accounts for your job and step count to prevent systemic recovery fatigue.
              </p>

              <div className="mt-5 space-y-2.5">
                {[
                  { key: "sitting", title: "Mostly Sitting", desc: "Desk job, computer work, driving, minimal daily steps" },
                  { key: "light", title: "Lightly Active", desc: "Occasional walking, light errands, 5,000-7,000 steps" },
                  { key: "moderate", title: "Moderately Active", desc: "On your feet frequently, retail/teaching, 8,000-11,000 steps" },
                  { key: "very_active", title: "Very Active / Physical Labor", desc: "Construction, nursing, heavy manual work" }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setDailyActivity(item.key)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      dailyActivity === item.key
                        ? "card-selected-glow bg-[#102831]"
                        : "bg-[#07151D]/60 border-[#28525B]/60 hover:bg-[#102831]"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#F4F9FA]">{item.title}</div>
                      <div className="text-xs text-[#A8C5CA] mt-0.5">{item.desc}</div>
                    </div>
                    {dailyActivity === item.key && (
                      <CheckCircle2 size={16} className="text-[#28DACC]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: SLEEP DURATION */}
          {step === 6 && (
            <div>
              <span className="text-xs font-mono uppercase text-[#28DACC]">
                Checklist 6/8 · Recovery
              </span>
              <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
                Average Sleep per Night?
              </h2>
              <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                Muscular protein synthesis and central nervous system recovery depend directly on sleep.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { key: "under_6", label: "Less than 6 hrs", desc: "High recovery risk" },
                  { key: "6_7", label: "6 to 7 hours", desc: "Moderate baseline" },
                  { key: "7_8", label: "7 to 8 hours", desc: "Optimal hypertrophy recovery" },
                  { key: "over_8", label: "More than 8 hrs", desc: "High recovery capacity" }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setSleepHours(item.key)}
                    className={`p-4 rounded-2xl border cursor-pointer text-center transition-all ${
                      sleepHours === item.key
                        ? "card-selected-glow bg-[#102831]"
                        : "bg-[#07151D]/60 border-[#28525B]/60 hover:bg-[#102831]"
                    }`}
                  >
                    <Moon size={18} className="mx-auto text-[#28DACC] mb-2" />
                    <div className="text-xs font-bold text-[#F4F9FA]">{item.label}</div>
                    <div className="text-[10px] text-[#A8C5CA] mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: BIGGEST CHALLENGE */}
          {step === 7 && (
            <div>
              <span className="text-xs font-mono uppercase text-[#28DACC]">
                Checklist 7/8 · Behavioral Obstacles
              </span>
              <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
                Your Biggest Fitness Challenge?
              </h2>
              <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                Helps tailor workout scheduling and deload frequencies.
              </p>

              <div className="mt-5 space-y-2.5">
                {[
                  { key: "time", title: "Lack of Time / Busy Schedule" },
                  { key: "motivation", title: "Lack of Motivation / Accountability" },
                  { key: "structure", title: "No Proper Workout Plan" },
                  { key: "knowledge", title: "Lack of Exercise Knowledge" },
                  { key: "consistency", title: "Difficulty Staying Consistent" }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setBiggestChallenge(item.key)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      biggestChallenge === item.key
                        ? "card-selected-glow bg-[#102831]"
                        : "bg-[#07151D]/60 border-[#28525B]/60 hover:bg-[#102831]"
                    }`}
                  >
                    <span className="text-xs font-semibold text-[#F4F9FA]">{item.title}</span>
                    {biggestChallenge === item.key && (
                      <CheckCircle2 size={16} className="text-[#28DACC]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: WORKOUT FREQUENCY */}
          {step === 8 && (
            <div>
              <span className="text-xs font-mono uppercase text-[#28DACC]">
                Checklist 8/8 · Habit Baseline
              </span>
              <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
                Current Exercise Frequency?
              </h2>
              <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
                How often have you worked out over the last 3 months?
              </p>

              <div className="mt-5 space-y-2.5">
                {[
                  { key: "never", title: "Never or inactive" },
                  { key: "occasionally", title: "Occasionally / sporadic" },
                  { key: "1_2", title: "1 to 2 days / week" },
                  { key: "3_4", title: "3 to 4 days / week" },
                  { key: "5_plus", title: "5+ days / week (Consistent athlete)" }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setCurrentFrequency(item.key)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      currentFrequency === item.key
                        ? "card-selected-glow bg-[#102831]"
                        : "bg-[#07151D]/60 border-[#28525B]/60 hover:bg-[#102831]"
                    }`}
                  >
                    <span className="text-xs font-semibold text-[#F4F9FA]">{item.title}</span>
                    {currentFrequency === item.key && (
                      <CheckCircle2 size={16} className="text-[#28DACC]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* iOS Bottom Sticky Button */}
      <footer className="max-w-xl w-full mx-auto pb-safe">
        <button
          type="button"
          onClick={next}
          className="w-full h-13 rounded-2xl bg-[#28DACC] text-[#07151D] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.3)] active:scale-98 transition-all hover:bg-[#41E9DC]"
        >
          <span>{step === totalChecklistSteps ? "Complete Profile & Update Plan" : "Continue"}</span>
          <ChevronRight size={17} />
        </button>
      </footer>
    </div>
  );
}
