"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldAlert,
  Flame,
  Dumbbell,
  Scale,
  Zap,
  Activity,
  Heart,
  User,
  Home,
  Building,
  Layers,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Check,
  Moon,
  Sun,
  Coffee,
  X,
  Plus,
  Minus
} from "lucide-react";
import {
  AssessmentAnswers,
  Goal,
  FitnessLevel,
  WorkoutLocation,
  EquipmentOption,
  RestrictionType,
  BodyShape,
  DailyActivity,
  SleepRange,
  DietType,
  FitnessChallenge,
  CurrentFrequency,
  FoodIntolerance,
  MealsPerDay,
  MuscleGroup
} from "@/lib/engine/types";
import {
  loadAssessmentProgress,
  saveAssessmentProgress
} from "@/lib/assessment/storage";
import { ConsentModal } from "@/components/assessment/ConsentModal";
import { useTheme } from "@/lib/theme/ThemeContext";

// 22 main questions + 2 interstitial motivation slides + 1 analysis sequence
// Steps:
// 1: Q1 Gender (Section 1)
// 2: Q2 Age (Section 1)
// 3: Q3 Main Goal (Section 1)
// 4: Q4 Fitness Level (Section 1)
// 5: [Interstitial 1: Over 430,000 members]
// 6: Q5 Height (Section 2)
// 7: Q6 Current Weight (Section 2)
// 8: Q7 Target Weight (Section 2)
// 9: Q8 Body Shape & Estimated Body Fat (Section 2)
// 10: [Interstitial 2: A little stronger with every workout curve]
// 11: Q9 Workout Location (Section 3)
// 12: Q10 Equipment (Section 3)
// 13: Q11 Days per week (Section 3)
// 14: Q12 Workout duration (Section 3)
// 15: Q13 Daily activity (Section 4)
// 16: Q14 Sleep hours (Section 4)
// 17: Q15 Joint restrictions & injuries (Section 4)
// 18: Q16 Diet type (Section 4)
// 19: Q17 Muscle focus areas (Section 5)
// 20: Q18 Fitness challenge (Section 5)
// 21: Q19 Current exercise frequency (Section 5)
// 22: Q20 Food intolerances (Section 6)
// 23: Q21 Disliked foods (Section 6)
// 24: Q22 Ideal meals per day (Section 6)
// 25: [Step 1: Analyzing Answers Sequence] -> Leads to /results (Step 2)

const TOTAL_STEPS = 24;


const STEPS_WITH_CONTINUE_BUTTON = new Set([
  2,  // Q2 Age (Allows adjusting exact age stepper)
  5,  // Interstitial 1 (Over 430,000 members)
  6,  // Q5 Height (Number input)
  7,  // Q6 Current weight (Number input)
  8,  // Q7 Target weight (Number input)
  11, // Q10 Equipment (Multi-select)
  16, // Q15 Injuries & joint restrictions (Multi-select)
  18, // Q17 Muscle focus areas (Multi-select)
  21, // Q20 Food intolerances (Multi-select)
  22  // Q21 Disliked foods (Text input & Yes/No)
]);

export interface AgeBracketConfig {
  bracket: "18_29" | "30_39" | "40_49" | "50_plus";
  label: string;
  minAge: number;
  maxAge: number;
  defaultAge: number;
  maleImg: string;
  femaleImg: string;
}

export const AGE_BRACKETS: AgeBracketConfig[] = [
  {
    bracket: "18_29",
    label: "Age: 18-29",
    minAge: 18,
    maxAge: 29,
    defaultAge: 24,
    maleImg: "/images/fit-planner/age/age_18_29.png",
    femaleImg: "/images/fit-planner/age/female/18_29.png",
  },
  {
    bracket: "30_39",
    label: "Age: 30-39",
    minAge: 30,
    maxAge: 39,
    defaultAge: 34,
    maleImg: "/images/fit-planner/age/age_30_39.png",
    femaleImg: "/images/fit-planner/age/female/30_39.png",
  },
  {
    bracket: "40_49",
    label: "Age: 40-49",
    minAge: 40,
    maxAge: 49,
    defaultAge: 44,
    maleImg: "/images/fit-planner/age/age_40_49.png",
    femaleImg: "/images/fit-planner/age/female/40_49.png",
  },
  {
    bracket: "50_plus",
    label: "Age: 50+",
    minAge: 50,
    maxAge: 85,
    defaultAge: 54,
    maleImg: "/images/fit-planner/age/age_50_plus.png",
    femaleImg: "/images/fit-planner/age/female/50_plus.png",
  },
];

export const MALE_BODY_SHAPES: {
  id: BodyShape;
  label: string;
  img: string;
  fat: number;
}[] = [
  { id: "slim", label: "Slim", img: "/images/fit-planner/shapes/male/slim.png", fat: 12 },
  { id: "lean", label: "Lean", img: "/images/fit-planner/shapes/male/lean.png", fat: 15 },
  { id: "athletic", label: "Athletic", img: "/images/fit-planner/shapes/male/athletic.png", fat: 18 },
  { id: "average", label: "Average", img: "/images/fit-planner/shapes/male/average.png", fat: 21 },
  { id: "heavy", label: "Heavy", img: "/images/fit-planner/shapes/male/heavy.png", fat: 26 },
  { id: "very_heavy", label: "Very Heavy", img: "/images/fit-planner/shapes/male/very_heavy.png", fat: 32 },
];

export const FEMALE_BODY_SHAPES: {
  id: BodyShape;
  label: string;
  img: string;
  fat: number;
}[] = [
  { id: "petite", label: "Petite", img: "/images/fit-planner/shapes/female/petite.png", fat: 19 },
  { id: "slim", label: "Slim", img: "/images/fit-planner/shapes/female/slim.png", fat: 22 },
  { id: "average", label: "Average", img: "/images/fit-planner/shapes/female/average.png", fat: 25 },
  { id: "curvy", label: "Curvy", img: "/images/fit-planner/shapes/female/curvy.png", fat: 29 },
  { id: "plus_size", label: "Plus Size", img: "/images/fit-planner/shapes/female/plus_size.png", fat: 34 },
  { id: "very_plus_size", label: "Very Plus Size", img: "/images/fit-planner/shapes/female/very_plus_size.png", fat: 40 },
];

export default function AssessmentPage() {
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [step, setStep] = useState(1);
  const [isExpressMode, setIsExpressMode] = useState(false);
  const EXPRESS_STEP_CHAIN = [1, 3, 10, 11, 12, 24];

  const [answers, setAnswers] = useState<AssessmentAnswers>({
    gender: "male",
    age: 28,
    ageBracket: "18_29",
    goal: "build_muscle",
    fitnessLevel: "beginner",
    heightCm: 178,
    isHeightImperial: false,
    weightKg: 78,
    isWeightImperial: false,
    targetWeightKg: 82,
    bodyShape: "average",
    estimatedBodyFat: 20,
    location: "home",
    equipment: ["bodyweight"],
    daysPerWeek: 4,
    durationMinutes: 45,
    dailyActivity: "moderately_active",
    sleepHours: "7_to_8",
    restrictions: ["none"],
    dietType: "flexible",
    muscleFocus: ["chest", "arms", "core"],
    fitnessChallenge: "staying_consistent",
    currentFrequency: "1_2_days",
    foodIntolerances: ["none"],
    hasDislikedFoods: false,
    dislikedFoodsText: "",
    mealsPerDay: "3",
    healthConsentGiven: true
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "express") {
        setIsExpressMode(true);
      }
      const goalParam = params.get("goal");
      if (goalParam) {
        let mappedGoal: Goal = "build_muscle";
        if (goalParam === "fat_loss" || goalParam === "lose_weight") mappedGoal = "lose_weight";
        else if (goalParam === "longevity" || goalParam === "improve_fitness") mappedGoal = "improve_fitness";
        else if (goalParam === "hypertrophy" || goalParam === "strength" || goalParam === "build_muscle") mappedGoal = "build_muscle";
        setAnswers((prev) => ({ ...prev, goal: mappedGoal }));
      }
    }
  }, []);

  const isAdvancingRef = useRef(false);

  useEffect(() => {
    isAdvancingRef.current = false;
  }, [step]);

  const selectAndAutoAdvance = (partial: Partial<AssessmentAnswers>) => {
    updateAnswers(partial);
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    setTimeout(() => {
      setStep((s) => {
        if (isExpressMode) {
          const currentIdx = EXPRESS_STEP_CHAIN.indexOf(s);
          if (currentIdx !== -1 && currentIdx < EXPRESS_STEP_CHAIN.length - 1) {
            return EXPRESS_STEP_CHAIN[currentIdx + 1];
          }
          router.push("/results");
          return s;
        }

        const next = s + 1;
        if (next > TOTAL_STEPS) {
          router.push("/results");
          return s;
        }
        return next;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 280);
  };

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isUnderage, setIsUnderage] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);

  useEffect(() => {
    const saved = loadAssessmentProgress();
    if (Object.keys(saved).length > 0) {
      setAnswers((prev) => ({ ...prev, ...saved }));
    }
  }, []);

  const updateAnswers = (partial: Partial<AssessmentAnswers>) => {
    const next = { ...answers, ...partial };
    setAnswers(next);
    saveAssessmentProgress(next);
  };

  // Automated progress bar ticker for Step 25 (Analysis)
  useEffect(() => {
    if (step === 24) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              router.push("/results");
            }, 600);
            return 100;
          }
          const next = prev + 3;
          if (next > 25 && next <= 50) setAnalysisStepIndex(1);
          else if (next > 50 && next <= 75) setAnalysisStepIndex(2);
          else if (next > 75 && next <= 90) setAnalysisStepIndex(3);
          else if (next > 90) setAnalysisStepIndex(4);
          return next;
        });
      }, 70);

      return () => clearInterval(interval);
    }
  }, [step, router]);

  const nextStep = () => {
    if (step === 2 && answers.age && answers.age < 18) {
      setIsUnderage(true);
      return;
    }
    if (step === 16 && (!answers.restrictions || answers.restrictions.length === 0)) {
      updateAnswers({ restrictions: ["none"] });
    }
    if (step === 16 && answers.restrictions && answers.restrictions.some(r => r !== "none") && !answers.healthConsentGiven) {
      setShowConsentModal(true);
      return;
    }

    if (isExpressMode) {
      const currentIdx = EXPRESS_STEP_CHAIN.indexOf(step);
      if (currentIdx !== -1 && currentIdx < EXPRESS_STEP_CHAIN.length - 1) {
        setStep(EXPRESS_STEP_CHAIN[currentIdx + 1]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push("/results");
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/results");
    }
  };

  const prevStep = () => {
    if (isExpressMode) {
      const currentIdx = EXPRESS_STEP_CHAIN.indexOf(step);
      if (currentIdx > 0) {
        setStep(EXPRESS_STEP_CHAIN[currentIdx - 1]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push("/");
      return;
    }

    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  // Calculate current display question number
  const getQuestionNumberDisplay = () => {
    if (step === 24) return null;
    if (isExpressMode) {
      const idx = EXPRESS_STEP_CHAIN.indexOf(step);
      if (idx === -1 || idx >= 5) return null;
      return `${idx + 1}/5 · Express`;
    }
    if (step === 5 || step === 10) return null;
    let qNum = step;
    if (step > 5) qNum -= 1;
    return `${qNum}/22`;
  };

  const questionProgressPct = isExpressMode
    ? Math.min(100, Math.round(((Math.max(0, EXPRESS_STEP_CHAIN.indexOf(step)) + 1) / 5) * 100))
    : Math.min(100, Math.round((step / TOTAL_STEPS) * 100));

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-[#F4F9FA] flex flex-col justify-between selection:bg-[#28DACC] selection:text-[#000000]">
      {/* iOS MyFitCoach Clean Header */}
      <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-xl border-b border-[#1A1A1A] px-4 pt-3 pb-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            className="w-9 h-9 rounded-full bg-[#121212] border border-[#222222] flex items-center justify-center text-[#A8C5CA] hover:text-[#28DACC] active:scale-95 transition-all"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex-1 mx-4">
            <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#28DACC] h-full rounded-full shadow-[0_0_8px_#28DACC]"
                animate={{ width: `${questionProgressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E93] hover:text-[#28DACC] transition-colors border border-white/5"
              title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <div className="w-16 text-right">
              {getQuestionNumberDisplay() ? (
                <span className="text-[11px] font-mono font-semibold text-[#A8C5CA]">
                  {getQuestionNumberDisplay()}
                </span>
              ) : (
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#28DACC]">
                  FIT
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mode Switcher Pill */}
      {step !== 24 && (
        <div className="bg-[#0A0A0A] border-b border-[#1A1A1A] py-1.5 px-4">
          <div className="max-w-md mx-auto flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsExpressMode(true);
                if (!EXPRESS_STEP_CHAIN.includes(step)) {
                  setStep(1);
                }
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                isExpressMode
                  ? "bg-[#28DACC] text-[#000000] shadow-[0_0_12px_rgba(40,218,204,0.35)]"
                  : "bg-[#141414] text-[#8E8E93] hover:text-[#FFFFFF]"
              }`}
            >
              <Zap size={11} className={isExpressMode ? "fill-black" : ""} />
              <span>1-Min Express (5 Qs)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpressMode(false)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                !isExpressMode
                  ? "bg-[#28DACC] text-[#000000] shadow-[0_0_12px_rgba(40,218,204,0.35)]"
                  : "bg-[#141414] text-[#8E8E93] hover:text-[#FFFFFF]"
              }`}
            >
              <span>Full Precision (22 Qs)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {/* STEP 1: Q1 Gender */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Section 1 · Personal Details & Goals
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What is your gender?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  We use biological markers to calibrate lean muscle calculations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 my-auto">
                {/* Male Card */}
                <button
                  type="button"
                  onClick={() => selectAndAutoAdvance({ gender: "male" })}
                  className={`group relative overflow-hidden rounded-2xl border transition-all text-left flex flex-col items-center justify-end p-4 h-64 ${
                    answers.gender === "male"
                      ? "border-[#28DACC] bg-[#121212] shadow-[0_0_20px_rgba(40,218,204,0.25)] ring-1 ring-[#28DACC]"
                      : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                  }`}
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src="/images/fit-planner/gender_male.png"
                      alt="Male physique"
                      className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                  </div>
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <span className="font-bold text-lg text-white">Male</span>
                    {answers.gender === "male" && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>

                {/* Female Card */}
                <button
                  type="button"
                  onClick={() => selectAndAutoAdvance({ gender: "female" })}
                  className={`group relative overflow-hidden rounded-2xl border transition-all text-left flex flex-col items-center justify-end p-4 h-64 ${
                    answers.gender === "female"
                      ? "border-[#28DACC] bg-[#121212] shadow-[0_0_20px_rgba(40,218,204,0.25)] ring-1 ring-[#28DACC]"
                      : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                  }`}
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src="/images/fit-planner/gender_female.png"
                      alt="Female physique"
                      className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                  </div>
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <span className="font-bold text-lg text-white">Female</span>
                    {answers.gender === "female" && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Prefer not to say option */}
              <button
                type="button"
                onClick={() => selectAndAutoAdvance({ gender: "prefer_not_to_say" })}
                className={`mt-3 p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  answers.gender === "prefer_not_to_say"
                    ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] text-[#28DACC]"
                    : "border-[#1F1F1F] bg-[#0A0A0A] text-[#8E8E93] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#222222] shrink-0">
                    <img
                      src="/images/fit-planner/gender_prefer_not_to_say.png"
                      alt="Prefer not to say"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-white">Prefer not to say</span>
                </div>
                {answers.gender === "prefer_not_to_say" && (
                  <div className="w-5 h-5 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 2: Q2 Age */}
          {step === 2 && (() => {
            const isFemale = answers.gender === "female";
            const currentBracket =
              AGE_BRACKETS.find((b) => b.bracket === answers.ageBracket) || AGE_BRACKETS[0];
            const currentAge =
              answers.age && answers.age >= currentBracket.minAge && answers.age <= currentBracket.maxAge
                ? answers.age
                : currentBracket.defaultAge;

            return (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="text-center mb-6">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                    Question 2 · Section 1
                  </span>
                  <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                    Choose your age
                  </h1>
                  <p className="text-xs text-[#8E8E93] mt-1">
                    Age determines baseline recovery rate and volume tolerance.
                  </p>
                </div>

                {/* Visual Age Cards matching Gender */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {AGE_BRACKETS.map((item) => {
                    const isSelected = answers.ageBracket === item.bracket;
                    const imageSrc = isFemale ? item.femaleImg : item.maleImg;

                    return (
                      <button
                        key={item.bracket}
                        type="button"
                        onClick={() => {
                          let newAge = answers.age;
                          if (!newAge || newAge < item.minAge || newAge > item.maxAge) {
                            newAge = item.defaultAge;
                          }
                          updateAnswers({
                            ageBracket: item.bracket,
                            age: newAge
                          });
                        }}
                        className={`group relative overflow-hidden rounded-2xl border transition-all text-left flex flex-col justify-end p-3 h-40 ${
                          isSelected
                            ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                            : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                        }`}
                      >
                        <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
                          <img
                            src={imageSrc}
                            alt={item.label}
                            className="w-full h-full object-cover object-top opacity-75 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <span className="font-bold text-sm text-white">
                            {item.label}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Exact Age Stepper - Dynamically bound to Selected Age Bracket */}
                <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8E8E93] font-medium block">
                        Exact Age
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#28DACC] border border-[#28DACC]/30">
                        {currentBracket.bracket === "50_plus"
                          ? "50+ years"
                          : `${currentBracket.minAge}–${currentBracket.maxAge} years`}
                      </span>
                    </div>
                    <span className="text-2xl font-mono font-bold text-white mt-1 block">
                      {currentAge}{" "}
                      <span className="text-sm font-normal text-[#8E8E93]">years</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentAge <= currentBracket.minAge}
                      onClick={() =>
                        updateAnswers({
                          age: Math.max(currentBracket.minAge, currentAge - 1)
                        })
                      }
                      className="w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white active:scale-95 transition-all hover:border-[#28DACC]"
                      aria-label="Decrease age"
                    >
                      <Minus size={18} />
                    </button>
                    <button
                      type="button"
                      disabled={currentAge >= currentBracket.maxAge}
                      onClick={() =>
                        updateAnswers({
                          age: Math.min(currentBracket.maxAge, currentAge + 1)
                        })
                      }
                      className="w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white active:scale-95 transition-all hover:border-[#28DACC]"
                      aria-label="Increase age"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Quick Continue button */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#28DACC]/30 text-xs font-bold text-[#28DACC] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Continue with age {currentAge}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {isUnderage && (
                  <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-center gap-2.5">
                    <AlertTriangle size={18} className="text-red-400 shrink-0" />
                    <span>
                      FIT Planner is calibrated for adults 18 and older. Please verify your age.
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })()}

          {/* STEP 3: Q3 Main Goal */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 3 · Section 1
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What is your main goal?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Select your primary outcome to calibrate rep targets and volume.
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  {
                    id: "build_muscle" as Goal,
                    title: "Build muscle",
                    subtitle: "Hypertrophy focus, progressive overload & lean mass",
                    img: "/images/fit-planner/build_muscle.png"
                  },
                  {
                    id: "lose_weight" as Goal,
                    title: "Lose weight & body fat",
                    subtitle: "High caloric expenditure, deficit support & definition",
                    img: "/images/fit-planner/lose_weight_body_fat.png"
                  },
                  {
                    id: "gain_weight" as Goal,
                    title: "Gain weight & mass",
                    subtitle: "Caloric surplus, compound strength & size foundation",
                    img: "/images/fit-planner/gain_weight.png"
                  },
                  {
                    id: "improve_fitness" as Goal,
                    title: "Improve fitness & stamina",
                    subtitle: "Athletic conditioning, work capacity & functional health",
                    img: "/images/fit-planner/improve_fitness_stamina.png"
                  },
                  {
                    id: "maintain" as Goal,
                    title: "Maintain fitness",
                    subtitle: "Sustain strength, joint mobility & long-term health",
                    img: "/images/fit-planner/maintain_fitness.png"
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ goal: item.id })}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.goal === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#262626] shrink-0">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {item.title}
                        </span>
                        <p className="text-[11px] text-[#8E8E93] mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    {answers.goal === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold shrink-0 ml-3">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Q4 Fitness Level */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 4 · Section 1
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What is your current fitness level?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Sets appropriate starting volume to prevent overtraining.
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  {
                    id: "complete_beginner" as FitnessLevel,
                    title: "Complete Beginner",
                    desc: "Never trained consistently, learning basic movement patterns",
                    img: "/images/fit-planner/complete_beginner_fitness_level.png"
                  },
                  {
                    id: "beginner" as FitnessLevel,
                    title: "Beginner",
                    desc: "Working out for a few months, building consistency",
                    img: "/images/fit-planner/beginner_fitness_level.png"
                  },
                  {
                    id: "intermediate" as FitnessLevel,
                    title: "Intermediate",
                    desc: "1–2 years of consistent strength training with good form",
                    img: "/images/fit-planner/intermediate_fitness_level.png"
                  },
                  {
                    id: "advanced" as FitnessLevel,
                    title: "Advanced",
                    desc: "3+ years of progressive overload training and periodization",
                    img: "/images/fit-planner/advanced_fitness_level.png"
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ fitnessLevel: item.id })}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.fitnessLevel === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#262626] shrink-0">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-[#8E8E93] mt-0.5 block">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    {answers.fitnessLevel === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold shrink-0 ml-3">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Motivational Interstitial 1 (Over 430,000 members) */}
          {step === 5 && (
            <motion.div
              key="step-5-interstitial"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex-1 flex flex-col justify-between py-2 text-center"
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  FIT PLANNER · Community
                </span>
                <h1 className="text-3xl font-extrabold text-[#FFFFFF] mt-2 tracking-tight">
                  Over 430,000 members
                </h1>
                <p className="text-lg text-[#28DACC] font-semibold mt-0.5">
                  have chosen FIT Planner
                </p>
                <p className="text-xs text-[#8E8E93] mt-2 max-w-xs mx-auto">
                  Our evidence-based algorithms tailor each workout to your exact physiology.
                </p>
              </div>

              {/* Athletes Image from MyFitCoach */}
              <div className="my-6 relative rounded-2xl overflow-hidden border border-[#1A1A1A] bg-[#0A0A0A] p-2">
                <img
                  src="/images/assets/social_proof_men.jpg"
                  alt="Fit athletes"
                  className="w-full h-56 object-contain mx-auto"
                />
              </div>

              {/* Press Logos as seen in screenshot */}
              <div className="mb-4">
                <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block mb-2">
                  As seen in
                </span>
                <div className="flex items-center justify-center gap-6 text-xs font-semibold text-[#8E8E93] tracking-wide">
                  <span>Men's Fitness</span>
                  <span className="text-[#333333]">|</span>
                  <span>Health &amp; Wellbeing</span>
                  <span className="text-[#333333]">|</span>
                  <span>Women's Fitness</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Q5 Height */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 5 · Section 2
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What is your height?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Required for BMI and metabolic rate calculation.
                </p>
              </div>

              {/* Unit Toggle */}
              <div className="flex justify-center mb-8">
                <div className="p-1 rounded-xl bg-[#121212] border border-[#222222] flex gap-1">
                  <button
                    type="button"
                    onClick={() => updateAnswers({ isHeightImperial: false })}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                      !answers.isHeightImperial
                        ? "bg-[#28DACC] text-[#000000]"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAnswers({ isHeightImperial: true })}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                      answers.isHeightImperial
                        ? "bg-[#28DACC] text-[#000000]"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    Feet &amp; Inches (ft/in)
                  </button>
                </div>
              </div>

              {/* Input Display */}
              <div className="p-8 rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] text-center my-auto">
                {!answers.isHeightImperial ? (
                  <>
                    <span className="text-6xl font-mono font-extrabold text-white tracking-tight">
                      {answers.heightCm || 178}
                    </span>
                    <span className="text-lg font-bold text-[#28DACC] ml-2">cm</span>
                    <div className="flex justify-center gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          updateAnswers({
                            heightCm: Math.max(120, (answers.heightCm || 178) - 1)
                          })
                        }
                        className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95"
                      >
                        <Minus size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateAnswers({
                            heightCm: Math.min(230, (answers.heightCm || 178) + 1)
                          })
                        }
                        className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center items-baseline gap-4">
                      <div>
                        <span className="text-5xl font-mono font-extrabold text-white">
                          {Math.floor((answers.heightCm || 178) / 30.48)}
                        </span>
                        <span className="text-sm font-bold text-[#28DACC] ml-1">ft</span>
                      </div>
                      <div>
                        <span className="text-5xl font-mono font-extrabold text-white">
                          {Math.round(((answers.heightCm || 178) % 30.48) / 2.54)}
                        </span>
                        <span className="text-sm font-bold text-[#28DACC] ml-1">in</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          updateAnswers({
                            heightCm: Math.max(120, (answers.heightCm || 178) - 2.54)
                          })
                        }
                        className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95"
                      >
                        <Minus size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateAnswers({
                            heightCm: Math.min(230, (answers.heightCm || 178) + 2.54)
                          })
                        }
                        className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 7: Q6 Current Weight */}
          {step === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 6 · Section 2
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What is your current weight?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  We use this for precise daily caloric &amp; macronutrient guidance.
                </p>
              </div>

              {/* Unit Toggle */}
              <div className="flex justify-center mb-8">
                <div className="p-1 rounded-xl bg-[#121212] border border-[#222222] flex gap-1">
                  <button
                    type="button"
                    onClick={() => updateAnswers({ isWeightImperial: false })}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                      !answers.isWeightImperial
                        ? "bg-[#28DACC] text-[#000000]"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    Kilograms (kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAnswers({ isWeightImperial: true })}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                      answers.isWeightImperial
                        ? "bg-[#28DACC] text-[#000000]"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    Pounds (lbs)
                  </button>
                </div>
              </div>

              {/* Weight Display */}
              <div className="p-8 rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] text-center my-auto">
                <span className="text-6xl font-mono font-extrabold text-white tracking-tight">
                  {!answers.isWeightImperial
                    ? answers.weightKg || 78
                    : Math.round((answers.weightKg || 78) * 2.20462)}
                </span>
                <span className="text-lg font-bold text-[#28DACC] ml-2">
                  {!answers.isWeightImperial ? "kg" : "lbs"}
                </span>

                <div className="flex justify-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      updateAnswers({
                        weightKg: Math.max(35, (answers.weightKg || 78) - 1)
                      })
                    }
                    className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95"
                  >
                    <Minus size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateAnswers({
                        weightKg: Math.min(250, (answers.weightKg || 78) + 1)
                      })
                    }
                    className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: Q7 Target Weight (Optional) */}
          {step === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 7 · Section 2
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What is your target weight?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Optional goal weight to plan your caloric pacing.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] text-center my-auto">
                <span className="text-6xl font-mono font-extrabold text-white tracking-tight">
                  {!answers.isWeightImperial
                    ? answers.targetWeightKg || 80
                    : Math.round((answers.targetWeightKg || 80) * 2.20462)}
                </span>
                <span className="text-lg font-bold text-[#28DACC] ml-2">
                  {!answers.isWeightImperial ? "kg" : "lbs"}
                </span>

                <div className="mt-2 text-xs text-[#8E8E93]">
                  {answers.weightKg && answers.targetWeightKg ? (
                    <span>
                      {answers.targetWeightKg > answers.weightKg
                        ? `Target: +${answers.targetWeightKg - answers.weightKg} kg (Lean Surplus)`
                        : answers.targetWeightKg < answers.weightKg
                        ? `Target: -${answers.weightKg - answers.targetWeightKg} kg (Fat Loss Deficit)`
                        : "Target: Maintenance & Recomposition"}
                    </span>
                  ) : null}
                </div>

                <div className="flex justify-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      updateAnswers({
                        targetWeightKg: Math.max(35, (answers.targetWeightKg || 80) - 1)
                      })
                    }
                    className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95"
                  >
                    <Minus size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateAnswers({
                        targetWeightKg: Math.min(250, (answers.targetWeightKg || 80) + 1)
                      })
                    }
                    className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 9: Q8 Body Shape (Visual Cards Only, Strictly Gender-Adaptive) */}
          {step === 9 && (() => {
            const isFemale = answers.gender === "female";
            const shapeList = isFemale ? FEMALE_BODY_SHAPES : MALE_BODY_SHAPES;
            return (
              <motion.div
                key="step-9"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="text-center mb-6">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                    Question 8 · Section 2
                  </span>
                  <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                    Choose your current body shape
                  </h1>
                  <p className="text-xs text-[#8E8E93] mt-1">
                    Select the visual profile that best represents your build.
                  </p>
                </div>

                {/* 6 Visual Body Shape Cards - Filtered Strictly by Gender */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {shapeList.map((item) => {
                    const isSelected = answers.bodyShape === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          selectAndAutoAdvance({
                            bodyShape: item.id,
                            estimatedBodyFat: item.fat
                          })
                        }
                        className={`group relative overflow-hidden rounded-2xl border transition-all text-left flex flex-col justify-end p-3 h-52 sm:h-56 ${
                          isSelected
                            ? "border-[#28DACC] bg-[#121212] shadow-[0_0_18px_rgba(40,218,204,0.25)] ring-1 ring-[#28DACC]"
                            : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                        }`}
                      >
                        <div className="absolute inset-0 z-0 bg-[#0B0B0B]">
                          <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/30 to-transparent" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <span className="font-bold text-sm text-white block leading-tight">
                            {item.label}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}

          {/* STEP 10: Q9 Workout Location */}
          {step === 10 && (
            <motion.div
              key="step-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 9 · Section 3
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  Where do you want to work out?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  We customize exercise selection according to your training environment.
                </p>
              </div>

              <div className="space-y-3.5 my-auto">
                {[
                  {
                    id: "home" as WorkoutLocation,
                    title: "At Home",
                    desc: "Training with minimal or no equipment",
                    img: "/images/fit-planner/at_home_workout.png"
                  },
                  {
                    id: "gym" as WorkoutLocation,
                    title: "Gym",
                    desc: "Training with machines, cable pulleys, and free weights",
                    img: "/images/fit-planner/at_the_gym_workout.png"
                  },
                  {
                    id: "both" as WorkoutLocation,
                    title: "Hybrid (Home & Gym)",
                    desc: "Combination of gym and home workouts based on schedule",
                    img: "/images/fit-planner/both_home_and_gym_workout.png"
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ location: item.id })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.location === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div className="flex-1 pr-3">
                      <span className="font-bold text-base text-white block">
                        {item.title}
                      </span>
                      <span className="text-xs text-[#8E8E93] mt-1 block">
                        {item.desc}
                      </span>
                    </div>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1A1A1A] shrink-0 border border-[#222222]">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 11: Q10 Equipment */}
          {step === 11 && (
            <motion.div
              key="step-11"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 10 · Section 3
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What equipment do you have?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Choose all gear available to you (multi-select).
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                {[
                  { id: "bodyweight" as EquipmentOption, label: "Bodyweight Only", img: "/images/fit-planner/equipment_bodyweight_only.png" },
                  { id: "dumbbells" as EquipmentOption, label: "Dumbbells", img: "/images/fit-planner/equipment_dumbbells.png" },
                  { id: "resistance_bands" as EquipmentOption, label: "Resistance Bands", img: "/images/fit-planner/equipment_resistance_bands.png" },
                  { id: "basic_home_gym" as EquipmentOption, label: "Basic Home Gym (Bench, Bar)", img: "/images/fit-planner/equipment_basic_home_gym.png" },
                  { id: "fully_equipped_gym" as EquipmentOption, label: "Fully Equipped Gym", img: "/images/fit-planner/equipment_fully_equipped_gym.png" }
                ].map((item) => {
                  const isSelected = answers.equipment?.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const current = answers.equipment || [];
                        let next: EquipmentOption[];
                        if (item.id === "bodyweight") {
                          next = isSelected ? [] : ["bodyweight"];
                        } else {
                          const withoutBw = current.filter((x) => x !== "bodyweight");
                          if (isSelected) {
                            next = withoutBw.filter((x) => x !== item.id);
                          } else {
                            next = [...withoutBw, item.id];
                          }
                        }
                        if (next.length === 0) next = ["bodyweight"];
                        updateAnswers({ equipment: next });
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.15)] ring-1 ring-[#28DACC]"
                          : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#262626] shrink-0">
                          <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-sm text-white">
                          {item.label}
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#28DACC] border-[#28DACC] text-[#000000]"
                            : "border-[#333333] bg-[#1A1A1A]"
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 12: Q11 Days per week */}
          {step === 12 && (
            <motion.div
              key="step-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 11 · Section 3
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  How many days per week can you train?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Determines your training split (Full Body, Upper/Lower, or PPL).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 my-auto">
                {[
                  { days: 2, label: "2 Days / Week", split: "Full Body A & B" },
                  { days: 3, label: "3 Days / Week", split: "Full Body Rotation (Optimal for busy schedules)" },
                  { days: 4, label: "4 Days / Week", split: "Upper / Lower Split (Maximum balance)" },
                  { days: 5, label: "5 Days / Week", split: "Upper / Lower + Weak-point focus" },
                  { days: 6, label: "6 Days / Week", split: "Push / Pull / Legs (High athletic volume)" }
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ daysPerWeek: item.days })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.daysPerWeek === item.days
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-base text-white block">
                        {item.label}
                      </span>
                      <span className="text-xs text-[#8E8E93] mt-0.5 block">
                        {item.split}
                      </span>
                    </div>
                    {answers.daysPerWeek === item.days && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 13: Q12 Workout duration */}
          {step === 13 && (
            <motion.div
              key="step-13"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 12 · Section 3
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  How long can each workout be?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Determines exercise density, set count, and rest periods.
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  { min: 25, label: "20–30 minutes", desc: "High efficiency, supersets, 3 exercises" },
                  { min: 40, label: "30–45 minutes", desc: "Standard hypertrophy, 4 exercises" },
                  { min: 50, label: "45–60 minutes", desc: "Comprehensive compound & isolation, 5 exercises" },
                  { min: 70, label: "60+ minutes", desc: "High volume power & hypertrophy, 6 exercises" }
                ].map((item) => (
                  <button
                    key={item.min}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ durationMinutes: item.min })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.durationMinutes === item.min
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-base text-white block">
                        {item.label}
                      </span>
                      <span className="text-xs text-[#8E8E93] mt-0.5 block">
                        {item.desc}
                      </span>
                    </div>
                    {answers.durationMinutes === item.min && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 14: Q13 Daily Activity Level */}
          {step === 14 && (
            <motion.div
              key="step-14"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 13 · Section 4 · Lifestyle
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  How active are you during a typical day?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Calculates Non-Exercise Activity Thermogenesis (NEAT).
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  {
                    id: "mostly_sitting" as DailyActivity,
                    title: "Mostly Sitting",
                    desc: "Desk or remote office job, mostly sedentary throughout the day",
                    icon: "🪑"
                  },
                  {
                    id: "lightly_active" as DailyActivity,
                    title: "Lightly Active",
                    desc: "Desk job with frequent breaks, light daily walking (5k-7k steps)",
                    icon: "🚶"
                  },
                  {
                    id: "moderately_active" as DailyActivity,
                    title: "Moderately Active",
                    desc: "On your feet much of the day (teaching, retail, hospitality)",
                    icon: "🏃"
                  },
                  {
                    id: "very_active" as DailyActivity,
                    title: "Very Active",
                    desc: "Heavy physical labor, construction, high-intensity daily movement",
                    icon: "⚡"
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ dailyActivity: item.id })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.dailyActivity === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-bold text-base text-white">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8E93] mt-1 ml-7">
                        {item.desc}
                      </p>
                    </div>
                    {answers.dailyActivity === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold shrink-0 ml-3">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 15: Q14 Sleep Hours */}
          {step === 15 && (
            <motion.div
              key="step-15"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 14 · Section 4
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  How much do you usually sleep?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Sleep directly influences muscular protein synthesis and CNS recovery.
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  { id: "less_than_6" as SleepRange, label: "Less than 6 hours", icon: "😴", desc: "Lower recovery reserve" },
                  { id: "6_to_7" as SleepRange, label: "6–7 hours", icon: "🛏️", desc: "Moderate recovery" },
                  { id: "7_to_8" as SleepRange, label: "7–8 hours", icon: "⚡", desc: "Optimal athlete recovery" },
                  { id: "more_than_8" as SleepRange, label: "More than 8 hours", icon: "🌙", desc: "High recovery capacity" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ sleepHours: item.id })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.sleepHours === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {item.label}
                        </span>
                        <span className="text-xs text-[#8E8E93] block">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    {answers.sleepHours === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 16: Q15 Exercise Injuries / Restrictions (with red glowing spots) */}
          {step === 16 && (
            <motion.div
              key="step-16"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 15 · Section 4
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  Do you have issues with one of the following areas?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Choose all that apply. Activates Restricted Mode for joint protection.
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                {/* No issues option */}
                <button
                  type="button"
                  onClick={() => updateAnswers({ restrictions: ["none"] })}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    answers.restrictions?.includes("none")
                      ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.15)] ring-1 ring-[#28DACC]"
                      : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
                      <X size={16} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-sm text-white">No issues</span>
                  </div>
                  {answers.restrictions?.includes("none") && (
                    <div className="w-5 h-5 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>

                {/* Specific Restrictions with real cropped photo thumbnails */}
                {[
                  {
                    id: "back" as RestrictionType,
                    label: "Sensitive back",
                    img: "/images/assets/injury_back.png",
                    note: "Filters deadlifts & heavy axial spinal loading"
                  },
                  {
                    id: "knee" as RestrictionType,
                    label: "Sensitive knees",
                    img: "/images/assets/injury_knees.png",
                    note: "Filters deep jumping squats & patella strain"
                  },
                  {
                    id: "shoulder" as RestrictionType,
                    label: "Sensitive shoulders",
                    img: "/images/assets/injury_shoulders.png",
                    note: "Filters behind-the-neck presses & impingements"
                  },
                  {
                    id: "other" as RestrictionType,
                    label: "Sensitive elbows / other",
                    img: "/images/assets/injury_elbows.png",
                    note: "Substitutes neutral grip variations"
                  }
                ].map((item) => {
                  const isSelected =
                    answers.restrictions?.includes(item.id) &&
                    !answers.restrictions?.includes("none");
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const current = answers.restrictions || [];
                        let next: RestrictionType[];
                        if (isSelected) {
                          next = current.filter((x) => x !== item.id);
                          if (next.length === 0) next = ["none"];
                        } else {
                          next = [...current.filter((x) => x !== "none"), item.id];
                        }
                        updateAnswers({ restrictions: next });
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.15)] ring-1 ring-[#28DACC]"
                          : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] shrink-0">
                          <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-white block">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-[#8E8E93] block">
                            {item.note}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold shrink-0 ml-2">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 17: Q16 Diet Type */}
          {step === 17 && (
            <motion.div
              key="step-17"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 16 · Section 4
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What type of diet do you follow?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Filters our 300+ recipe database and macro protein source recommendations.
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  {
                    id: "flexible" as DietType,
                    title: "Flexible / Mixed Diet",
                    desc: "No specific restrictions, all whole foods",
                    img: "/images/fit-planner/diet/diet_flexible_mixed_diet.png"
                  },
                  {
                    id: "non_vegetarian" as DietType,
                    title: "Non-Vegetarian",
                    desc: "Chicken, beef, fish, eggs, and dairy",
                    img: "/images/fit-planner/diet/diet_non_vegetarian.png"
                  },
                  {
                    id: "pescatarian" as DietType,
                    title: "Pescatarian",
                    desc: "Plant-based plus fish and seafood",
                    img: "/images/fit-planner/diet/diet_pescatarian.png"
                  },
                  {
                    id: "vegetarian" as DietType,
                    title: "Vegetarian",
                    desc: "Plant-based with dairy and eggs",
                    img: "/images/fit-planner/diet/diet_vegetarian.png"
                  },
                  {
                    id: "vegan" as DietType,
                    title: "Vegan",
                    desc: "100% plant-based, no animal products",
                    img: "/images/fit-planner/diet/diet_vegan.png"
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ dietType: item.id })}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.dietType === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] shrink-0">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {item.title}
                        </span>
                        <p className="text-xs text-[#8E8E93] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    {answers.dietType === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold shrink-0 ml-2">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 18: Q17 Muscle Focus Areas */}
          {step === 18 && (
            <motion.div
              key="step-18"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 17 · Section 5 · Focus
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  Which muscles are most important to you?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Choose all that apply. Extra sets are prioritized for these muscle groups.
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                {[
                  { id: "chest" as MuscleGroup, label: "Chest", img: "/images/fit-planner/muscles/chest.jpeg" },
                  { id: "shoulders" as MuscleGroup, label: "Shoulders", img: "/images/fit-planner/muscles/shoulders.jpeg" },
                  { id: "arms" as MuscleGroup, label: "Arms (Biceps & Triceps)", img: "/images/fit-planner/muscles/arm.jpeg" },
                  { id: "core" as MuscleGroup, label: "Abs & Core", img: "/images/fit-planner/muscles/abs.jpeg" },
                  { id: "back" as MuscleGroup, label: "Back (Lats & Rhomboids)", img: "/images/fit-planner/muscles/back.jpeg" },
                  { id: "legs" as MuscleGroup, label: "Legs (Quads & Hamstrings)", img: "/images/fit-planner/muscles/legs.jpeg" },
                  { id: "full_body" as MuscleGroup, label: "All equally important", img: "/images/fit-planner/muscles/all.jpeg" }
                ].map((item) => {
                  const isSelected = answers.muscleFocus?.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.id === "full_body") {
                          updateAnswers({ muscleFocus: ["full_body"] });
                        } else {
                          const current = (answers.muscleFocus || []).filter((m) => m !== "full_body");
                          const isAlreadySelected = current.includes(item.id);
                          let next: MuscleGroup[];
                          if (isAlreadySelected) {
                            next = current.filter((m) => m !== item.id);
                            if (next.length === 0) next = ["full_body"];
                          } else {
                            next = [...current, item.id];
                          }
                          updateAnswers({ muscleFocus: next });
                        }
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.18)] ring-1 ring-[#28DACC]"
                          : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] shrink-0">
                          <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-sm text-white">
                          {item.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 19: Q18 Fitness Challenge */}
          {step === 19 && (
            <motion.div
              key="step-19"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 18 · Section 5
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  What is your biggest fitness challenge?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  We customize app reminders and progression pace around your obstacle.
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  { id: "lack_of_time" as FitnessChallenge, label: "Lack of Time", desc: "Short, ultra-effective workouts with zero wasted minutes" },
                  { id: "staying_consistent" as FitnessChallenge, label: "Difficulty Staying Consistent", desc: "Habit streaks, calendar sync & intelligent recovery pacing" },
                  { id: "no_plan" as FitnessChallenge, label: "No Proper Workout Plan", desc: "Automated progression, daily guidance & exercise video form tips" },
                  { id: "lack_of_knowledge" as FitnessChallenge, label: "Lack of Knowledge", desc: "Science explanations, RPE guidance & transparent exercise rationales" },
                  { id: "lack_of_motivation" as FitnessChallenge, label: "Lack of Motivation", desc: "Milestone badges, visual progression curves & personal records" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ fitnessChallenge: item.id })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.fitnessChallenge === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm text-white block">
                        {item.label}
                      </span>
                      <span className="text-xs text-[#8E8E93] mt-0.5 block">
                        {item.desc}
                      </span>
                    </div>
                    {answers.fitnessChallenge === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold shrink-0 ml-3">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 20: Q19 Current Exercise Frequency */}
          {step === 20 && (
            <motion.div
              key="step-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 19 · Section 5
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  How often do you currently exercise?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Helps adjust the initial deload and ramp-up cycle.
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  { id: "never" as CurrentFrequency, label: "Never" },
                  { id: "occasionally" as CurrentFrequency, label: "Occasionally (Once every few weeks)" },
                  { id: "1_2_days" as CurrentFrequency, label: "1–2 Days per Week" },
                  { id: "3_4_days" as CurrentFrequency, label: "3–4 Days per Week" },
                  { id: "5_plus_days" as CurrentFrequency, label: "5+ Days per Week" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ currentFrequency: item.id })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.currentFrequency === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <span className="font-bold text-sm text-white">
                      {item.label}
                    </span>
                    {answers.currentFrequency === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 21: Q20 Food Intolerances */}
          {step === 21 && (
            <motion.div
              key="step-21"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 20 · Section 6 · Nutrition
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  Do you have any food intolerances?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Enforces strict safety allergen filtering across all recipes.
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                {[
                  { id: "none" as FoodIntolerance, label: "No / None" },
                  { id: "lactose" as FoodIntolerance, label: "Lactose / Dairy Intolerance" },
                  { id: "gluten" as FoodIntolerance, label: "Gluten / Celiac" },
                  { id: "nuts" as FoodIntolerance, label: "Tree Nuts & Peanuts" },
                  { id: "other" as FoodIntolerance, label: "Other" },
                  { id: "not_sure" as FoodIntolerance, label: "Not Sure" }
                ].map((item) => {
                  const isSelected = answers.foodIntolerances?.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const current = answers.foodIntolerances || [];
                        let next: FoodIntolerance[];
                        if (item.id === "none") {
                          next = ["none"];
                        } else {
                          if (isSelected) {
                            next = current.filter((x) => x !== item.id);
                            if (next.length === 0) next = ["none"];
                          } else {
                            next = current.filter((x) => x !== "none").concat(item.id);
                          }
                        }
                        updateAnswers({ foodIntolerances: next });
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.15)] ring-1 ring-[#28DACC]"
                          : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                      }`}
                    >
                      <span className="font-semibold text-sm text-white">
                        {item.label}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#28DACC] border-[#28DACC] text-[#000000]"
                            : "border-[#333333] bg-[#1A1A1A]"
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 22: Q21 Disliked Foods */}
          {step === 22 && (
            <motion.div
              key="step-22"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 21 · Section 6
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  Are there any foods you don't like?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  We will exclude or substitute these ingredients from your meal plan.
                </p>
              </div>

              <div className="space-y-4 my-auto">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      selectAndAutoAdvance({ hasDislikedFoods: false, dislikedFoodsText: "" })
                    }
                    className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                      !answers.hasDislikedFoods
                        ? "border-[#28DACC] bg-[#121212] text-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] text-[#8E8E93]"
                    }`}
                  >
                    No, I eat everything
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAnswers({ hasDislikedFoods: true })}
                    className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                      answers.hasDislikedFoods
                        ? "border-[#28DACC] bg-[#121212] text-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] text-[#8E8E93]"
                    }`}
                  >
                    Yes, exclude some
                  </button>
                </div>

                {answers.hasDislikedFoods && (
                  <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F]">
                    <label className="text-xs text-[#8E8E93] font-semibold block mb-2">
                      Foods to exclude (e.g. mushrooms, shellfish, cilantro, olives):
                    </label>
                    <input
                      type="text"
                      placeholder="Type foods here..."
                      value={answers.dislikedFoodsText || ""}
                      onChange={(e) =>
                        updateAnswers({ dislikedFoodsText: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#262626] text-white text-sm focus:outline-none focus:border-[#28DACC]"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 23: Q22 Ideal Meals Per Day */}
          {step === 23 && (
            <motion.div
              key="step-23"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  Question 22 · Section 6 · Final Question
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-1 tracking-tight">
                  How many meals per day would be ideal for you?
                </h1>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Distributes your caloric and protein targets across your preferred schedule.
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {[
                  { id: "2" as MealsPerDay, label: "2 Meals", desc: "Intermittent fasting friendly (Lunch & Dinner)" },
                  { id: "3" as MealsPerDay, label: "3 Meals (Recommended)", desc: "Standard breakfast, lunch, and dinner" },
                  { id: "4" as MealsPerDay, label: "4 Meals", desc: "3 main meals plus an afternoon high-protein snack" },
                  { id: "5_plus" as MealsPerDay, label: "5+ Meals", desc: "Frequent smaller meals for high-metabolism bodybuilding" },
                  { id: "not_sure" as MealsPerDay, label: "Not Sure", desc: "Start with 3 balanced meals" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectAndAutoAdvance({ mealsPerDay: item.id })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.mealsPerDay === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm text-white block">
                        {item.label}
                      </span>
                      <span className="text-xs text-[#8E8E93] mt-0.5 block">
                        {item.desc}
                      </span>
                    </div>
                    {answers.mealsPerDay === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 24: Step 1 After Q22 - Analyze Answers Sequence */}
          {step === 24 && (
            <motion.div
              key="step-24-analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col justify-center items-center text-center py-6"
            >
              <div className="relative w-32 h-32 mb-8">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 rounded-full border-4 border-[#1A1A1A]" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-[#28DACC] border-t-transparent animate-spin"
                  style={{ animationDuration: "1.2s" }}
                />
                {/* Center Percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-extrabold text-white">
                    {analysisProgress}%
                  </span>
                  <span className="text-[10px] font-mono text-[#28DACC] tracking-widest uppercase">
                    Analyzing
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
                Calibrating Your Personalized Plan
              </h2>
              <p className="text-xs text-[#8E8E93] max-w-xs mb-8">
                Evaluating your 22 assessment data points against exercise science libraries.
              </p>

              {/* Step Checklist */}
              <div className="w-full max-w-sm space-y-3 text-left">
                {[
                  { title: "Validating body metrics & body fat ratio", isDone: analysisStepIndex >= 0 },
                  { title: "Checking joint contraindications & safe substitutions", isDone: analysisStepIndex >= 1 },
                  { title: "Calculating optimal weekly volume per muscle group", isDone: analysisStepIndex >= 2 },
                  { title: "Structuring 4-week progressive overload split", isDone: analysisStepIndex >= 3 },
                  { title: "Calibrating daily calories & allergen-filtered nutrition", isDone: analysisStepIndex >= 4 }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      item.isDone
                        ? "bg-[#0E0E0E] border-[#28DACC]/40 text-white"
                        : "bg-[#0A0A0A] border-[#1A1A1A] text-[#555555]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        item.isDone
                          ? "bg-[#28DACC] text-[#000000]"
                          : "bg-[#1A1A1A] text-[#444444]"
                      }`}
                    >
                      {item.isDone ? <Check size={12} strokeWidth={3} /> : idx + 1}
                    </div>
                    <span className="text-xs font-medium">{item.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky iOS Bottom Action Bar - Only shown for multi-select, number inputs, text, interstitials */}
        {STEPS_WITH_CONTINUE_BUTTON.has(step) && (
          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-4 rounded-2xl bg-[#28DACC] hover:bg-[#38D8CE] active:scale-[0.98] text-[#000000] font-extrabold text-base tracking-wide shadow-[0_0_24px_rgba(40,218,204,0.35)] transition-all flex items-center justify-center gap-2"
            >
              <span>
                {step === 5
                  ? "Continue"
                  : step === 23
                  ? "Generate My Plan"
                  : "Continue"}
              </span>
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        )}
      </main>

      {/* GDPR / Health Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onConsent={() => {
          updateAnswers({ healthConsentGiven: true });
          setShowConsentModal(false);
          setStep((s) => s + 1);
        }}
        onCancel={() => setShowConsentModal(false)}
      />
    </div>
  );
}
