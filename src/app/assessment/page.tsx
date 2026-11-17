"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
  Dumbbell,
  Scale,
  Zap,
  Activity,
  User,
  Home,
  Building,
  Layers,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import {
  AssessmentAnswers,
  Goal,
  FitnessLevel,
  WorkoutLocation,
  EquipmentOption,
  RestrictionType
} from "@/lib/engine/types";
import {
  loadAssessmentProgress,
  saveAssessmentProgress,
  clearAssessmentProgress
} from "@/lib/assessment/storage";
import { LivePlanCard } from "@/components/assessment/LivePlanCard";
import { ConsentModal } from "@/components/assessment/ConsentModal";

const TOTAL_STEPS = 9;

export default function AssessmentPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    gender: "prefer_not_to_say",
    age: 28,
    goal: "build_muscle",
    fitnessLevel: "beginner",
    location: "home",
    equipment: ["dumbbells", "bodyweight"],
    daysPerWeek: 3,
    durationMinutes: 45,
    restrictions: ["none"]
  });

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isUnderage, setIsUnderage] = useState(false);

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

  const nextStep = () => {
    if (step === 2 && answers.age && answers.age < 18) {
      setIsUnderage(true);
      return;
    }
    if (step === 8 && !answers.healthConsentGiven) {
      setShowConsentModal(true);
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      // Completed Stage A
      saveAssessmentProgress(answers);
      router.push("/results");
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      router.push("/");
    }
  };

  const handleConsentGranted = () => {
    updateAnswers({
      healthConsentGiven: true,
      healthConsentTimestamp: new Date().toISOString()
    });
    setShowConsentModal(false);
    setStep(9);
  };

  return (
    <div className="min-h-[100dvh] bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between">
      {/* Top iOS App Header */}
      <header className="sticky top-0 z-40 bg-[#07151D]/80 backdrop-blur-xl border-b border-[#28525B]/40 pt-safe px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-1 text-sm font-medium text-[#28DACC] active:opacity-70 transition-opacity"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#A8C5CA]">
              FIT PLANNER
            </span>
            <span className="text-xs font-semibold text-[#F4F9FA]">
              Stage A · Question {step} of {TOTAL_STEPS}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              clearAssessmentProgress();
              window.location.reload();
            }}
            title="Reset answers"
            className="text-xs text-[#A8C5CA] hover:text-[#F4F9FA] p-1.5 rounded-lg active:bg-[#102831]"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Hairline progress line */}
        <div className="w-full bg-[#102831] h-[2px] mt-2">
          <div
            className="bg-[#28DACC] h-full transition-all duration-300 shadow-[0_0_8px_rgba(40,218,204,0.6)]"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Container: Mobile Single Column / Desktop 2-Column Split */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Live Plan Card (Left/Top) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <LivePlanCard
              answers={answers}
              step={step}
              totalSteps={TOTAL_STEPS}
            />
          </div>

          {/* Interactive Question Card (Right/Bottom) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="ios-glass-card rounded-3xl p-5 md:p-7 border border-[#28525B]"
              >
                {/* QUESTION 1: GENDER */}
                {step === 1 && (
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                      Question 1 of 9
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      What is your gender?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      Used for baseline metabolic calibration and muscular recovery formulas.
                    </p>

                    <div className="mt-6 space-y-3">
                      {[
                        { key: "male", label: "Male", sub: "Standard masculine hormonal baseline" },
                        { key: "female", label: "Female", sub: "Calibrated recovery & cycle-adaptive load" },
                        { key: "prefer_not_to_say", label: "Prefer not to say", sub: "Standard balanced parameters" }
                      ].map((item) => {
                        const isSelected = answers.gender === item.key;
                        return (
                          <div
                            key={item.key}
                            onClick={() => updateAnswers({ gender: item.key as any })}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? "card-selected-glow bg-[#102831]"
                                : "bg-[#102831]/60 border-[#28525B]/70 hover:border-[#28DACC]/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                                  isSelected
                                    ? "bg-[#28DACC] text-[#07151D]"
                                    : "bg-[#07151D] text-[#A8C5CA] border border-[#28525B]"
                                }`}
                              >
                                <User size={18} />
                              </div>
                              <div>
                                <div className="font-semibold text-base text-[#F4F9FA]">
                                  {item.label}
                                </div>
                                <div className="text-xs text-[#A8C5CA]">{item.sub}</div>
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-[#28DACC] bg-[#28DACC] text-[#07151D]"
                                  : "border-[#28525B]"
                              }`}
                            >
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* QUESTION 2: AGE */}
                {step === 2 && (
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                      Question 2 of 9
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      How old are you?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      FIT Planner provides personalized programs strictly for adults 18+.
                    </p>

                    {isUnderage ? (
                      <div className="mt-6 p-4 rounded-2xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 text-left">
                        <div className="flex items-center gap-2 text-[#FF5C5C] font-semibold text-base mb-1">
                          <AlertTriangle size={20} />
                          <span>Age Requirement Notice</span>
                        </div>
                        <p className="text-sm text-[#F4F9FA] leading-relaxed">
                          FIT Planner is engineered exclusively for adults aged 18 and older. We cannot safely generate a training plan for minors.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUnderage(false);
                            updateAnswers({ age: 18 });
                          }}
                          className="mt-4 px-4 py-2 bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC] rounded-xl"
                        >
                          I am 18 or older
                        </button>
                      </div>
                    ) : (
                      <div className="mt-8 flex flex-col items-center">
                        <div className="text-6xl font-bold num-mono text-[#28DACC] tracking-tight">
                          {answers.age || 28}
                        </div>
                        <span className="text-sm text-[#A8C5CA] mt-1">years old</span>

                        <div className="flex items-center gap-4 mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              const newAge = Math.max(16, (answers.age || 28) - 1);
                              updateAnswers({ age: newAge });
                              if (newAge < 18) setIsUnderage(true);
                            }}
                            className="w-12 h-12 rounded-2xl bg-[#102831] border border-[#28525B] text-xl font-bold text-[#F4F9FA] flex items-center justify-center active:scale-95 transition-transform"
                          >
                            –
                          </button>
                          <input
                            type="range"
                            min="18"
                            max="75"
                            value={answers.age || 28}
                            onChange={(e) => updateAnswers({ age: parseInt(e.target.value) })}
                            className="w-48 accent-[#28DACC] cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateAnswers({ age: Math.min(85, (answers.age || 28) + 1) });
                            }}
                            className="w-12 h-12 rounded-2xl bg-[#102831] border border-[#28525B] text-xl font-bold text-[#F4F9FA] flex items-center justify-center active:scale-95 transition-transform"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* QUESTION 3: MAIN GOAL */}
                {step === 3 && (
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                      Question 3 of 9
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      What is your primary goal?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      Shapes the rep ranges, sets, rest intervals, and progression curve.
                    </p>

                    <div className="mt-5 space-y-2.5">
                      {[
                        {
                          key: "build_muscle",
                          title: "Build Muscle & Strength",
                          desc: "Progressive overload, 8-12 reps, hypertrophy focused",
                          icon: Dumbbell
                        },
                        {
                          key: "lose_weight",
                          title: "Lose Weight & Body Fat",
                          desc: "Higher training density, metabolic conditioning & preservation",
                          icon: Flame
                        },
                        {
                          key: "gain_weight",
                          title: "Gain Weight & Mass",
                          desc: "Strength compounds with controlled volume for surplus growth",
                          icon: Scale
                        },
                        {
                          key: "improve_fitness",
                          title: "Improve Fitness & Stamina",
                          desc: "Cardiorespiratory endurance, athletic work capacity",
                          icon: Zap
                        },
                        {
                          key: "maintain",
                          title: "Maintain & Stay Healthy",
                          desc: "Balanced sustainable longevity, posture, and joints",
                          icon: Activity
                        }
                      ].map((item) => {
                        const isSelected = answers.goal === item.key;
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.key}
                            onClick={() => updateAnswers({ goal: item.key as Goal })}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? "card-selected-glow bg-[#102831]"
                                : "bg-[#102831]/60 border-[#28525B]/70 hover:border-[#28DACC]/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isSelected
                                    ? "bg-[#28DACC] text-[#07151D]"
                                    : "bg-[#07151D] text-[#28DACC] border border-[#28525B]"
                                }`}
                              >
                                <Icon size={20} />
                              </div>
                              <div>
                                <div className="font-semibold text-sm text-[#F4F9FA]">
                                  {item.title}
                                </div>
                                <div className="text-xs text-[#A8C5CA]">{item.desc}</div>
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-[#28DACC] bg-[#28DACC] text-[#07151D]"
                                  : "border-[#28525B]"
                              }`}
                            >
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* QUESTION 4: FITNESS LEVEL */}
                {step === 4 && (
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                      Question 4 of 9
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      Current fitness experience?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      Self-reported experience determines exercise complexity and recovery spacing.
                    </p>

                    <div className="mt-5 space-y-3">
                      {[
                        {
                          key: "complete_beginner",
                          title: "Complete Beginner",
                          desc: "Brand new to structured exercise. Needs foundational form instructions."
                        },
                        {
                          key: "beginner",
                          title: "Beginner (Under 6 months)",
                          desc: "Familiar with basic exercises but haven't followed a structured progression."
                        },
                        {
                          key: "intermediate",
                          title: "Intermediate (6-24 months)",
                          desc: "Consistent lifter; understands compound movements and effort regulation."
                        },
                        {
                          key: "advanced",
                          title: "Advanced (2+ years)",
                          desc: "Solid technical proficiency; ready for periodized splits and higher volume."
                        }
                      ].map((item) => {
                        const isSelected = answers.fitnessLevel === item.key;
                        return (
                          <div
                            key={item.key}
                            onClick={() =>
                              updateAnswers({ fitnessLevel: item.key as FitnessLevel })
                            }
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? "card-selected-glow bg-[#102831]"
                                : "bg-[#102831]/60 border-[#28525B]/70 hover:border-[#28DACC]/40"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-base text-[#F4F9FA]">
                                {item.title}
                              </span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? "border-[#28DACC] bg-[#28DACC] text-[#07151D]"
                                    : "border-[#28525B]"
                                }`}
                              >
                                {isSelected && <CheckCircle2 size={14} />}
                              </div>
                            </div>
                            <p className="text-xs text-[#A8C5CA] mt-1">{item.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* QUESTION 5: WORKOUT LOCATION */}
                {step === 5 && (
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                      Question 5 of 9
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      Where will you train?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      Filters available exercise selection and setup constraints.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                      {[
                        { key: "home", label: "At Home", icon: Home, desc: "Living room or home gym setup" },
                        { key: "gym", label: "At the Gym", icon: Building, desc: "Commercial facility access" },
                        { key: "both", label: "Both / Flexible", icon: Layers, desc: "Switch between home & gym" }
                      ].map((item) => {
                        const isSelected = answers.location === item.key;
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.key}
                            onClick={() =>
                              updateAnswers({ location: item.key as WorkoutLocation })
                            }
                            className={`p-4 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center ${
                              isSelected
                                ? "card-selected-glow bg-[#102831]"
                                : "bg-[#102831]/60 border-[#28525B]/70 hover:border-[#28DACC]/40"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                                isSelected
                                  ? "bg-[#28DACC] text-[#07151D]"
                                  : "bg-[#07151D] text-[#28DACC] border border-[#28525B]"
                              }`}
                            >
                              <Icon size={24} />
                            </div>
                            <div className="font-semibold text-sm text-[#F4F9FA]">
                              {item.label}
                            </div>
                            <div className="text-xs text-[#A8C5CA] mt-1">{item.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* QUESTION 6: EQUIPMENT */}
                {step === 6 && (
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                      Question 6 of 9
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      Available equipment?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      Select all that apply. Exercises are 100% matched to your tools.
                    </p>

                    <div className="mt-5 space-y-2.5">
                      {[
                        { key: "bodyweight", label: "Bodyweight Only", desc: "No weights required" },
                        { key: "dumbbells", label: "Dumbbells", desc: "Adjustable or fixed pairs" },
                        { key: "resistance_bands", label: "Resistance Bands", desc: "Loop or handle bands" },
                        { key: "basic_home_gym", label: "Basic Home Gym", desc: "Bench, pull-up bar, free weights" },
                        { key: "fully_equipped_gym", label: "Fully Equipped Gym", desc: "Cables, barbells, machines" }
                      ].map((item) => {
                        const current = answers.equipment || ["bodyweight"];
                        const isSelected = current.includes(item.key as EquipmentOption);

                        const toggle = () => {
                          let next: EquipmentOption[];
                          if (item.key === "bodyweight") {
                            // If user clicks bodyweight while others are selected, keep or toggle
                            next = isSelected ? ["bodyweight"] : [...current, "bodyweight"];
                          } else {
                            if (isSelected) {
                              next = current.filter((k) => k !== item.key);
                              if (next.length === 0) next = ["bodyweight"];
                            } else {
                              next = [...current, item.key as EquipmentOption];
                            }
                          }
                          updateAnswers({ equipment: next });
                        };

                        return (
                          <div
                            key={item.key}
                            onClick={toggle}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? "card-selected-glow bg-[#102831]"
                                : "bg-[#102831]/60 border-[#28525B]/70 hover:border-[#28DACC]/40"
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-sm text-[#F4F9FA]">
                                {item.label}
                              </div>
                              <div className="text-xs text-[#A8C5CA]">{item.desc}</div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                                isSelected
                                  ? "border-[#28DACC] bg-[#28DACC] text-[#07151D]"
                                  : "border-[#28525B]"
                              }`}
                            >
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* QUESTION 7: TRAINING DAYS */}
                {step === 7 && (
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                      Question 7 of 9
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      Training days per week?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      Consistency beats intensity. Choose a realistic sustainable schedule.
                    </p>

                    <div className="mt-8 flex justify-center gap-3">
                      {[2, 3, 4, 5, 6].map((dayCount) => {
                        const isSelected = (answers.daysPerWeek || 3) === dayCount;
                        return (
                          <button
                            key={dayCount}
                            type="button"
                            onClick={() => updateAnswers({ daysPerWeek: dayCount })}
                            className={`w-14 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                              isSelected
                                ? "card-selected-glow bg-[#102831] scale-105"
                                : "bg-[#102831]/60 border-[#28525B]/70 hover:border-[#28DACC]/40"
                            }`}
                          >
                            <span className="text-2xl font-bold num-mono text-[#F4F9FA]">
                              {dayCount}
                            </span>
                            <span className="text-[10px] text-[#A8C5CA] uppercase mt-1">
                              Days
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/60 text-center text-xs text-[#A8C5CA]">
                      {(answers.daysPerWeek || 3) <= 3 &&
                        "Recommended: 3 days is optimal for full recovery and total-body compound stimulus."}
                      {(answers.daysPerWeek || 3) === 4 &&
                        "Upper / Lower Split: 2 upper body days and 2 lower body days with midweek rest."}
                      {(answers.daysPerWeek || 3) >= 5 &&
                        "High Frequency: Programmed as Push / Pull / Legs for experienced recovery management."}
                    </div>
                  </div>
                )}

                {/* QUESTION 8: DURATION */}
                {step === 8 && (
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                      Question 8 of 9
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      Workout session length?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      Calibrates the total number of working sets and rest density.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {[
                        { min: 25, label: "20 - 30 min", desc: "Express high-density session" },
                        { min: 40, label: "30 - 45 min", desc: "Balanced standard workout" },
                        { min: 55, label: "45 - 60 min", desc: "Full volume with warm-up" },
                        { min: 70, label: "60+ min", desc: "Extensive strength & accessories" }
                      ].map((item) => {
                        const isSelected = (answers.durationMinutes || 40) === item.min;
                        return (
                          <div
                            key={item.min}
                            onClick={() => updateAnswers({ durationMinutes: item.min })}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? "card-selected-glow bg-[#102831]"
                                : "bg-[#102831]/60 border-[#28525B]/70 hover:border-[#28DACC]/40"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-[#28DACC] mb-1">
                              <Clock size={16} />
                              <span className="text-base font-bold num-mono text-[#F4F9FA]">
                                {item.label}
                              </span>
                            </div>
                            <div className="text-xs text-[#A8C5CA]">{item.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* QUESTION 9: INJURIES & RESTRICTIONS */}
                {step === 9 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono tracking-wider text-[#28DACC]">
                        Question 9 of 9 · Safety Check
                      </span>
                      {answers.healthConsentGiven && (
                        <span className="text-[11px] text-[#28DA8B] flex items-center gap-1 font-mono">
                          <CheckCircle2 size={12} /> Consent Logged
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F4F9FA] mt-1">
                      Injuries or joint restrictions?
                    </h2>
                    <p className="text-sm text-[#A8C5CA] mt-2">
                      Reported areas will automatically activate Restricted Mode and filter out contraindicated movements.
                    </p>

                    <div className="mt-5 space-y-2.5">
                      {[
                        { key: "none", label: "No Restrictions", desc: "No current pain or joint issues" },
                        { key: "knee", label: "Knee Sensitivity", desc: "Excludes jumping & deep high-impact squats" },
                        { key: "back", label: "Lower Back / Spinal Issues", desc: "Excludes heavy axial loading & unbraced hinges" },
                        { key: "shoulder", label: "Shoulder / Rotator Cuff", desc: "Excludes behind-neck presses & excessive dips" },
                        { key: "other", label: "Other Physical Restriction", desc: "Triggers personalized low-impact mode" }
                      ].map((item) => {
                        const current = answers.restrictions || ["none"];
                        const isSelected = current.includes(item.key as RestrictionType);

                        const toggle = () => {
                          let next: RestrictionType[];
                          if (item.key === "none") {
                            // "none" is mutually exclusive
                            next = ["none"];
                          } else {
                            // Deselect "none"
                            const withoutNone = current.filter((k) => k !== "none");
                            if (isSelected) {
                              next = withoutNone.filter((k) => k !== item.key);
                              if (next.length === 0) next = ["none"];
                            } else {
                              next = [...withoutNone, item.key as RestrictionType];
                            }
                          }
                          updateAnswers({ restrictions: next });
                        };

                        return (
                          <div
                            key={item.key}
                            onClick={toggle}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? item.key === "none"
                                  ? "card-selected-glow bg-[#102831]"
                                  : "border-[#FFB020] bg-[#102831] shadow-[0_0_12px_rgba(255,176,32,0.2)]"
                                : "bg-[#102831]/60 border-[#28525B]/70 hover:border-[#28DACC]/40"
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-sm text-[#F4F9FA] flex items-center gap-1.5">
                                {item.label}
                                {item.key !== "none" && isSelected && (
                                  <ShieldAlert size={14} className="text-[#FFB020]" />
                                )}
                              </div>
                              <div className="text-xs text-[#A8C5CA]">{item.desc}</div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                                isSelected
                                  ? item.key === "none"
                                    ? "border-[#28DACC] bg-[#28DACC] text-[#07151D]"
                                    : "border-[#FFB020] bg-[#FFB020] text-[#07151D]"
                                  : "border-[#28525B]"
                              }`}
                            >
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notice if restriction is chosen */}
                    {answers.restrictions &&
                      answers.restrictions.some((r) => r !== "none") && (
                        <div className="mt-4 p-3.5 rounded-2xl bg-[#FFB020]/15 border border-[#FFB020]/40 flex items-start gap-2.5">
                          <ShieldAlert size={18} className="text-[#FFB020] shrink-0 mt-0.5" />
                          <div className="text-xs text-[#F4F9FA] leading-relaxed">
                            <span className="font-semibold text-[#FFB020]">Restricted Mode Activated:</span> Exercise library will automatically substitute high-impact movements with joint-friendly regressions.
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* iOS Sticky Thumb-Zone Bottom Action Bar */}
      <footer className="sticky bottom-0 z-40 bg-[#07151D]/90 backdrop-blur-xl border-t border-[#28525B]/50 px-4 py-3 pb-safe">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={nextStep}
            className="w-full h-[50px] rounded-[14px] bg-[#28DACC] text-[#07151D] font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.35)] active:scale-[0.98] transition-all hover:bg-[#41E9DC]"
          >
            <span>{step === TOTAL_STEPS ? "View My Plan" : "Continue"}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>

      {/* Sensitive Health Data Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onConsent={handleConsentGranted}
        onCancel={() => setShowConsentModal(false)}
      />
    </div>
  );
}
