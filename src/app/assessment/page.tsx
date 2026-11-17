"use client";

import React, { useState, useEffect } from "react";
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

const TOTAL_STEPS = 25;

export default function AssessmentPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
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
    location: "gym",
    equipment: ["dumbbells", "bodyweight"],
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
    if (step === 25) {
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
    if (step === 17 && (!answers.restrictions || answers.restrictions.length === 0)) {
      updateAnswers({ restrictions: ["none"] });
    }
    if (step === 17 && answers.restrictions && answers.restrictions.some(r => r !== "none") && !answers.healthConsentGiven) {
      setShowConsentModal(true);
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
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  // Calculate current display question number out of 22
  const getQuestionNumberDisplay = () => {
    if (step === 5 || step === 10 || step === 25) return null;
    let qNum = step;
    if (step > 5) qNum -= 1;
    if (step > 10) qNum -= 1;
    return `${qNum}/22`;
  };

  const questionProgressPct = Math.min(100, Math.round((step / TOTAL_STEPS) * 100));

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

          <div className="w-12 text-right">
            {getQuestionNumberDisplay() ? (
              <span className="text-xs font-mono font-semibold text-[#A8C5CA]">
                {getQuestionNumberDisplay()}
              </span>
            ) : (
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#28DACC]">
                FIT
              </span>
            )}
          </div>
        </div>
      </header>

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
                  onClick={() => updateAnswers({ gender: "male" })}
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
                  onClick={() => updateAnswers({ gender: "female" })}
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
                onClick={() => updateAnswers({ gender: "prefer_not_to_say" })}
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
          {step === 2 && (
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

              {/* Visual Age Cards matching MyFitCoach */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  {
                    bracket: "18_29" as const,
                    label: "Age: 18-29",
                    typicalAge: 25,
                    img: "/images/assets/age_18_29.jpg"
                  },
                  {
                    bracket: "30_39" as const,
                    label: "Age: 30-39",
                    typicalAge: 34,
                    img: "/images/assets/age_30_39.jpg"
                  },
                  {
                    bracket: "40_49" as const,
                    label: "Age: 40-49",
                    typicalAge: 45,
                    img: "/images/assets/age_40_49.jpg"
                  },
                  {
                    bracket: "50_plus" as const,
                    label: "Age: 50+",
                    typicalAge: 55,
                    img: "/images/assets/age_50_plus.jpg"
                  }
                ].map((item) => (
                  <button
                    key={item.bracket}
                    type="button"
                    onClick={() =>
                      updateAnswers({
                        ageBracket: item.bracket,
                        age: answers.age || item.typicalAge
                      })
                    }
                    className={`group relative overflow-hidden rounded-2xl border transition-all text-left flex flex-col justify-end p-3 h-40 ${
                      answers.ageBracket === item.bracket
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-full h-full object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent" />
                    </div>
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <span className="font-bold text-sm text-white">
                        {item.label}
                      </span>
                      {answers.ageBracket === item.bracket && (
                        <div className="w-5 h-5 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Exact Age Stepper */}
              <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8E8E93] font-medium block">
                    Exact Age
                  </span>
                  <span className="text-2xl font-mono font-bold text-white">
                    {answers.age || 28}{" "}
                    <span className="text-sm font-normal text-[#8E8E93]">years</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateAnswers({ age: Math.max(18, (answers.age || 28) - 1) })
                    }
                    className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95 transition-transform"
                  >
                    <Minus size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateAnswers({ age: Math.min(95, (answers.age || 28) + 1) })
                    }
                    className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white active:scale-95 transition-transform"
                  >
                    <Plus size={18} />
                  </button>
                </div>
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
          )}

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
                    onClick={() => updateAnswers({ goal: item.id })}
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
                    onClick={() => updateAnswers({ fitnessLevel: item.id })}
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

          {/* STEP 9: Q8 Body Shape & Estimated Body Fat Slider */}
          {step === 9 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-5">
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

              {/* 4 Visual Body Shape Cards matching screenshot */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  {
                    id: "slender" as BodyShape,
                    label: "Slender",
                    img: "/images/assets/shape_slender.jpg",
                    fat: 14
                  },
                  {
                    id: "average" as BodyShape,
                    label: "Average",
                    img: "/images/assets/shape_average.jpg",
                    fat: 20
                  },
                  {
                    id: "heavy" as BodyShape,
                    label: "Heavy",
                    img: "/images/assets/shape_heavy.jpg",
                    fat: 26
                  },
                  {
                    id: "very_heavy" as BodyShape,
                    label: "Very heavy",
                    img: "/images/assets/shape_very_heavy.jpg",
                    fat: 32
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      updateAnswers({
                        bodyShape: item.id,
                        estimatedBodyFat: item.fat
                      })
                    }
                    className={`group relative overflow-hidden rounded-2xl border transition-all text-left flex flex-col justify-end p-3 h-40 ${
                      answers.bodyShape === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-full h-full object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent" />
                    </div>
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <span className="font-bold text-sm text-white">
                        {item.label}
                      </span>
                      {answers.bodyShape === item.id && (
                        <div className="w-5 h-5 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Estimated Body Fat Slider (matching MyFitCoach screenshot 24/33) */}
              <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#8E8E93]">
                    Estimated Body Fat %
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#28DACC]/40 text-xs font-mono font-bold text-[#28DACC]">
                    {answers.estimatedBodyFat || 20}%
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="45"
                  value={answers.estimatedBodyFat || 20}
                  onChange={(e) =>
                    updateAnswers({ estimatedBodyFat: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#28DACC]"
                />
                <div className="flex justify-between text-[10px] text-[#666666] mt-1 font-mono">
                  <span>Lean (&lt;15%)</span>
                  <span>Fit (15–22%)</span>
                  <span>Higher (&gt;25%)</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 10: Motivational Interstitial 2 (A little stronger with every workout!) */}
          {step === 10 && (
            <motion.div
              key="step-10-interstitial"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex-1 flex flex-col justify-between py-2 text-center"
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#28DACC]">
                  FIT PLANNER · Science
                </span>
                <h1 className="text-2xl font-extrabold text-[#FFFFFF] mt-2 tracking-tight">
                  A little stronger with every workout!
                </h1>
              </div>

              {/* Growth Curve Chart Graphic matching screenshot */}
              <div className="my-6 relative rounded-2xl overflow-hidden border border-[#1A1A1A] bg-[#0A0A0A] p-3">
                <img
                  src="/images/assets/curve_chart.png"
                  alt="Progress curve comparison"
                  className="w-full h-44 object-contain mx-auto"
                />
                <div className="flex items-center justify-center gap-6 text-[11px] font-medium mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#555555]" />
                    <span className="text-[#8E8E93]">Without FIT Planner</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#28DACC] shadow-[0_0_6px_#28DACC]" />
                    <span className="text-white font-semibold">With FIT Planner</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-left bg-[#0E0E0E] p-4 rounded-2xl border border-[#1A1A1A]">
                <p className="text-xs text-[#F4F9FA] leading-relaxed">
                  FIT Planner increases your reps and weights weekly in achievable, science-backed steps.
                </p>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  This automated progressive overload allows you to make much faster progress than with a static, generic workout plan.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 11: Q9 Workout Location */}
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
                    onClick={() => updateAnswers({ location: item.id })}
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

          {/* STEP 12: Q10 Equipment */}
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
                        if (isSelected) {
                          next = current.filter((x) => x !== item.id);
                          if (next.length === 0) next = ["bodyweight"];
                        } else {
                          next = [...current, item.id];
                        }
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

          {/* STEP 13: Q11 Days per week */}
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
                    onClick={() => updateAnswers({ daysPerWeek: item.days })}
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

          {/* STEP 14: Q12 Workout duration */}
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
                    onClick={() => updateAnswers({ durationMinutes: item.min })}
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

          {/* STEP 15: Q13 Daily Activity Level */}
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
                    onClick={() => updateAnswers({ dailyActivity: item.id })}
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

          {/* STEP 16: Q14 Sleep Hours */}
          {step === 16 && (
            <motion.div
              key="step-16"
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
                    onClick={() => updateAnswers({ sleepHours: item.id })}
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

          {/* STEP 17: Q15 Exercise Injuries / Restrictions (with red glowing spots) */}
          {step === 17 && (
            <motion.div
              key="step-17"
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

          {/* STEP 18: Q16 Diet Type */}
          {step === 18 && (
            <motion.div
              key="step-18"
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
                  { id: "flexible" as DietType, title: "Flexible / Mixed Diet", desc: "No specific restrictions, all whole foods", icon: "🍽️" },
                  { id: "non_vegetarian" as DietType, title: "Non-Vegetarian", desc: "Chicken, beef, fish, eggs, and dairy", icon: "🥩" },
                  { id: "pescatarian" as DietType, title: "Pescatarian", desc: "Plant-based plus fish and seafood", icon: "🐟" },
                  { id: "vegetarian" as DietType, title: "Vegetarian", desc: "Plant-based with dairy and eggs", icon: "🥗" },
                  { id: "vegan" as DietType, title: "Vegan", desc: "100% plant-based, no animal products", icon: "🌱" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateAnswers({ dietType: item.id })}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      answers.dietType === item.id
                        ? "border-[#28DACC] bg-[#121212] shadow-[0_0_16px_rgba(40,218,204,0.2)] ring-1 ring-[#28DACC]"
                        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#333333]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-bold text-sm text-white">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8E93] mt-0.5 ml-7">
                        {item.desc}
                      </p>
                    </div>
                    {answers.dietType === item.id && (
                      <div className="w-6 h-6 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 19: Q17 Muscle Focus Areas */}
          {step === 19 && (
            <motion.div
              key="step-19"
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
                  { id: "chest" as MuscleGroup, label: "Chest", img: "/images/assets/muscle_chest.png" },
                  { id: "shoulders" as MuscleGroup, label: "Shoulders", img: "/images/assets/muscle_shoulders.png" },
                  { id: "arms" as MuscleGroup, label: "Arms (Biceps & Triceps)", img: "/images/assets/muscle_arms.png" },
                  { id: "core" as MuscleGroup, label: "Abs & Core", img: "/images/assets/muscle_abs.png" },
                  { id: "back" as MuscleGroup, label: "Back (Lats & Rhomboids)", img: "/images/assets/muscle_back.png" },
                  { id: "legs" as MuscleGroup, label: "Legs (Quads & Hamstrings)", img: "/images/assets/muscle_legs.png" }
                ].map((item) => {
                  const isSelected = answers.muscleFocus?.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const current = answers.muscleFocus || [];
                        let next: MuscleGroup[];
                        if (isSelected) {
                          next = current.filter((m) => m !== item.id);
                          if (next.length === 0) next = ["full_body"];
                        } else {
                          next = [...current.filter((m) => m !== "full_body"), item.id];
                        }
                        updateAnswers({ muscleFocus: next });
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
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
                        <span className="font-bold text-sm text-white">
                          {item.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#28DACC] text-[#000000] flex items-center justify-center font-bold">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* All equally important button */}
                <button
                  type="button"
                  onClick={() => updateAnswers({ muscleFocus: ["full_body"] })}
                  className={`w-full p-3 rounded-2xl border text-center transition-all ${
                    answers.muscleFocus?.includes("full_body")
                      ? "border-[#28DACC] bg-[#121212] text-[#28DACC]"
                      : "border-[#1F1F1F] bg-[#0A0A0A] text-[#8E8E93] hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold">All equally important ⚖️</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 20: Q18 Fitness Challenge */}
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
                    onClick={() => updateAnswers({ fitnessChallenge: item.id })}
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

          {/* STEP 21: Q19 Current Exercise Frequency */}
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
                    onClick={() => updateAnswers({ currentFrequency: item.id })}
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

          {/* STEP 22: Q20 Food Intolerances */}
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

          {/* STEP 23: Q21 Disliked Foods */}
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
                      updateAnswers({ hasDislikedFoods: false, dislikedFoodsText: "" })
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

          {/* STEP 24: Q22 Ideal Meals Per Day */}
          {step === 24 && (
            <motion.div
              key="step-24"
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
                    onClick={() => updateAnswers({ mealsPerDay: item.id })}
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

          {/* STEP 25: Step 1 After Q22 - Analyze Answers Sequence */}
          {step === 25 && (
            <motion.div
              key="step-25-analysis"
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

        {/* Sticky iOS Bottom Action Bar */}
        {step < 25 && (
          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-4 rounded-2xl bg-[#28DACC] hover:bg-[#38D8CE] active:scale-[0.98] text-[#000000] font-extrabold text-base tracking-wide shadow-[0_0_24px_rgba(40,218,204,0.35)] transition-all flex items-center justify-center gap-2"
            >
              <span>
                {step === 5
                  ? "Continue"
                  : step === 10
                  ? "Got it"
                  : step === 24
                  ? "Generate My Plan"
                  : "Continue"}
              </span>
              <ChevronRight size={18} strokeWidth={3} />
            </button>

            {step === 1 && (
              <p className="text-[11px] text-[#666666] text-center mt-3">
                By continuing, you agree to our Privacy Policy, Terms of Service and Disclaimer.
              </p>
            )}
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
