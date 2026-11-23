"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Dumbbell,
  Play,
  SlidersHorizontal,
  Zap,
  BatteryMedium,
  CheckCircle2,
  Share2,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  X
} from "lucide-react";
import { IosNavBar } from "@/components/layout/IosNavBar";
import { loadAssessmentProgress } from "@/lib/assessment/storage";
import { generateWorkoutPlan } from "@/lib/engine/recommendation";
import { adjustSession, AdjustmentType } from "@/lib/engine/adjustments";
import { GeneratedPlan, PlannedSession, Exercise } from "@/lib/engine/types";
import { ShareablePlanCard } from "@/components/workout/ShareablePlanCard";
import { getExerciseById } from "@/lib/data/exerciseLibrary";

export default function PlanPage() {
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [showAdjustSheet, setShowAdjustSheet] = useState(false);
  const [adjustmentNotice, setAdjustmentNotice] = useState<string | null>(null);
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<Exercise | null>(null);
  const [modalImageTab, setModalImageTab] = useState<"start" | "peak" | "main">("start");
  const daySliderRef = useRef<HTMLDivElement>(null);

  const handleOpenDetail = (exerciseId: string) => {
    const found = getExerciseById(exerciseId);
    if (found) {
      setSelectedExerciseModal(found);
      setModalImageTab(found.startImage ? "start" : "main");
    }
  };

  const scrollSlider = (direction: "left" | "right") => {
    if (daySliderRef.current) {
      const scrollAmount = direction === "left" ? -180 : 180;
      daySliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (daySliderRef.current) {
      const activeBtn = daySliderRef.current.children[selectedDayIdx] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [selectedDayIdx]);

  useEffect(() => {
    const answers = loadAssessmentProgress();
    const generated = generateWorkoutPlan(answers);
    setPlan(generated);
  }, []);

  if (!plan) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-sm text-[#A8C5CA]">
        Loading workout blueprint...
      </div>
    );
  }

  const activeSession: PlannedSession = plan.weeklySessions[selectedDayIdx];

  const handleApplyAdjustment = (type: AdjustmentType) => {
    if (!plan) return;
    const current = plan.weeklySessions[selectedDayIdx];
    const modified = adjustSession(current, type);

    const updatedSessions = [...plan.weeklySessions];
    updatedSessions[selectedDayIdx] = modified;

    setPlan({
      ...plan,
      weeklySessions: updatedSessions
    });

    const labels = {
      short_time: "Adjusted for 20-min express duration (2 sets, short rest).",
      low_energy: "Adjusted for low energy / deload (reduced volume & extra rest).",
      bodyweight_only: "Adjusted for bodyweight only (substituted all weights)."
    };
    setAdjustmentNotice(labels[type]);
    setShowAdjustSheet(false);
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-3 space-y-5 pb-32 sm:pb-16">
      <IosNavBar
        title="Training Plan"
        subtitle={`${plan.split.replace(/_/g, " ").toUpperCase()} · ${plan.daysPerWeek} Days / Week`}
        action={
          <button
            type="button"
            onClick={() => setShowAdjustSheet(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC] hover:border-[#28DACC]/50 active:scale-95 transition-all shadow-sm"
          >
            <SlidersHorizontal size={13} />
            <span>Adjust Week</span>
          </button>
        }
      />

      {/* Adjustment feedback toast */}
      {adjustmentNotice && (
        <div className="p-3.5 rounded-2xl bg-[#28DACC]/15 border border-[#28DACC]/40 flex items-center justify-between text-xs text-[#28DACC]">
          <span>{adjustmentNotice}</span>
          <button
            onClick={() => setAdjustmentNotice(null)}
            className="text-[#A8C5CA] hover:text-[#F4F9FA]"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* 7-DAY CALENDAR SLIDER (Mobile First Swipeable Track) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A8C5CA]">
            Schedule (Day 1 – 7)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              className="w-6 h-6 rounded-lg bg-[#102831] border border-[#28525B]/50 flex items-center justify-center text-[#A8C5CA] hover:text-[#28DACC] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("right")}
              className="w-6 h-6 rounded-lg bg-[#102831] border border-[#28525B]/50 flex items-center justify-center text-[#A8C5CA] hover:text-[#28DACC] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={daySliderRef}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-1 py-1 -mx-1"
          >
            {plan.weeklySessions.map((session, idx) => {
              const isSelected = selectedDayIdx === idx;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`w-[74px] sm:w-[86px] shrink-0 snap-start py-3 px-2 rounded-2xl flex flex-col items-center justify-between transition-all select-none ${
                    isSelected
                      ? "bg-gradient-to-b from-[#163842] to-[#102831] border-2 border-[#28DACC] shadow-[0_0_18px_rgba(40,218,204,0.35)] scale-[1.03] text-[#28DACC]"
                      : "bg-[#0B1E24]/80 border border-[#28525B]/50 hover:border-[#28DACC]/40 text-[#F4F9FA] active:scale-95"
                  }`}
                >
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${isSelected ? "text-[#28DACC] font-bold" : "text-[#A8C5CA]"}`}>
                    {session.dayName.slice(0, 3)}
                  </span>
                  <span
                    className={`text-base font-extrabold num-mono mt-0.5 ${
                      isSelected ? "text-white" : "text-[#F4F9FA]"
                    }`}
                  >
                    Day {session.dayNumber}
                  </span>
                  <span
                    className={`text-[9px] mt-2 px-2 py-0.5 rounded-full font-mono font-bold tracking-wide ${
                      session.isRestDay
                        ? isSelected
                          ? "bg-[#07151D] text-[#A8C5CA] border border-[#28525B]"
                          : "bg-[#07151D]/60 text-[#A8C5CA]/60 border border-[#28525B]/30"
                        : isSelected
                          ? "bg-[#28DACC] text-[#07151D] shadow-sm"
                          : "bg-[#28DACC]/15 text-[#28DACC] border border-[#28DACC]/30"
                    }`}
                  >
                    {session.isRestDay ? "Rest" : "Lift"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ACTIVE SESSION CARD DETAIL */}
      <div className="ios-glass-card rounded-3xl p-4 sm:p-6 border border-[#28525B] shadow-xl space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 pb-4 border-b border-[#28525B]/50">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#28DACC] font-bold">
                {activeSession.dayName}
              </span>
              {activeSession.isRestDay ? (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#102831] text-[#A8C5CA] border border-[#28525B]">
                  Rest Day
                </span>
              ) : (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#28DACC]/15 text-[#28DACC] border border-[#28DACC]/30 font-semibold">
                  Targeted Session
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F9FA] mt-1 tracking-tight">
              {activeSession.title}
            </h2>
            {!activeSession.isRestDay && (
              <div className="flex items-center gap-2 text-xs text-[#A8C5CA] mt-1 font-mono">
                <span>⏱ {activeSession.estimatedDuration || 45} min</span>
                <span>·</span>
                <span>{activeSession.exercises.length} Exercises</span>
              </div>
            )}
          </div>

          {!activeSession.isRestDay && (
            <Link
              href={`/app/workout/${activeSession.id}`}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-[#28DACC] text-[#07151D] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(40,218,204,0.35)] active:scale-95 transition-all hover:bg-[#41E9DC]"
            >
              <Play size={16} fill="currentColor" />
              <span>Launch Session</span>
            </Link>
          )}
        </div>

        {/* Exercises List */}
        {activeSession.isRestDay ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#102831] border border-[#28525B] flex items-center justify-center text-[#28DACC] mx-auto mb-3">
              <Calendar size={24} />
            </div>
            <h3 className="text-base font-bold text-[#F4F9FA]">Scheduled Active Recovery</h3>
            <p className="text-xs text-[#A8C5CA] mt-1.5 max-w-sm mx-auto leading-relaxed">
              Muscles repair and grow during recovery periods. Prioritize hydration, 8 hours of sleep, and light walking or mobility work.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs text-[#A8C5CA] font-mono uppercase tracking-wider mb-2">
              <span>Exercise Prescription ({activeSession.exercises.length} Movements)</span>
              <span className="text-[10px] text-[#28DACC] lowercase">tap card for form</span>
            </div>

            {activeSession.exercises.map((item, idx) => (
              <div
                key={`${item.exerciseId}_${idx}`}
                onClick={() => handleOpenDetail(item.exerciseId)}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#102831] border border-[#28525B]/70 hover:border-[#28DACC]/70 hover:bg-[#14303A] transition-all active:scale-[0.99] cursor-pointer group shadow-sm flex flex-col gap-3"
              >
                {/* Top Row: Thumbnail + Exercise Name + View Form Chevron */}
                <div className="flex items-start gap-3">
                  {/* Number Badge + Thumbnail */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#D8F1FD] border border-[#28525B]/40 overflow-hidden flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <img
                        src={item.image || "/images/flat/push-up-start.webp"}
                        alt={item.exerciseName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#07151D] border border-[#28DACC] text-[10px] font-mono font-bold text-[#28DACC] flex items-center justify-center shadow">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Title & Muscle/Equipment/Safety Badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#F4F9FA] group-hover:text-[#28DACC] transition-colors leading-snug">
                        {item.exerciseName}
                      </h3>
                      <ChevronRight size={18} className="text-[#A8C5CA]/60 group-hover:text-[#28DACC] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#142D35] text-[#28DACC] border border-[#28525B]/40 capitalize">
                        {item.primaryMuscle}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] text-[#A8C5CA] bg-[#07151D] border border-[#28525B]/30 capitalize">
                        {item.equipmentNeeded.replace(/_/g, " ")}
                      </span>
                      {item.safetyNote && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30">
                          <ShieldAlert size={10} className="shrink-0" />
                          <span>Safe Form</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Full-Width Clean Prescription Strip */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0B1E24]/90 border border-[#28525B]/50">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#28DACC]">
                    <span className="text-[10px] uppercase font-mono text-[#A8C5CA] tracking-wider">TARGET:</span>
                    <span className="font-bold whitespace-nowrap text-[#28DACC]">{item.sets} sets × {item.reps}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#A8C5CA] shrink-0">
                    <Clock size={12} className="text-[#28DACC]" />
                    <span className="whitespace-nowrap">{item.restSeconds}s rest</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHAREABLE PLAN CARD (Section 9) */}
      <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B] text-center space-y-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            Athlete Identity
          </span>
          <h3 className="text-base font-bold text-[#F4F9FA] mt-0.5">
            Your Shareable Training Card
          </h3>
          <p className="text-xs text-[#A8C5CA] mt-1">
            Branded card summary of your split and cadence with zero private health information.
          </p>
        </div>

        <ShareablePlanCard plan={plan} />
      </div>

      {/* iOS BOTTOM SHEET: ADJUST MY WEEK */}
      {showAdjustSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#102831] border border-[#28525B] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative">
            {/* iOS Grabber Handle */}
            <div className="w-10 h-1 bg-[#28525B] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[#F4F9FA]">
                Adjust Today&apos;s Workout
              </h3>
              <button
                type="button"
                onClick={() => setShowAdjustSheet(false)}
                className="text-[#A8C5CA] hover:text-[#F4F9FA] p-1"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#A8C5CA] mb-5">
              Life happens. Adapt today&apos;s routine while maintaining your training momentum:
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleApplyAdjustment("short_time")}
                className="w-full p-4 rounded-2xl bg-[#142D35] border border-[#28525B] hover:border-[#28DACC] text-left transition-colors flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#07151D] text-[#28DACC] flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F4F9FA]">
                    &quot;I only have 20 minutes&quot;
                  </div>
                  <div className="text-xs text-[#A8C5CA]">
                    Condenses session to 3 core compound movements with 45s rest.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyAdjustment("low_energy")}
                className="w-full p-4 rounded-2xl bg-[#142D35] border border-[#28525B] hover:border-[#28DACC] text-left transition-colors flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#07151D] text-[#FFB020] flex items-center justify-center shrink-0">
                  <BatteryMedium size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F4F9FA]">
                    &quot;I&apos;m tired / low energy&quot;
                  </div>
                  <div className="text-xs text-[#A8C5CA]">
                    Deload protocol: reduces sets to 2 and extends rest intervals by 30s.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyAdjustment("bodyweight_only")}
                className="w-full p-4 rounded-2xl bg-[#142D35] border border-[#28525B] hover:border-[#28DACC] text-left transition-colors flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#07151D] text-[#28DA8B] flex items-center justify-center shrink-0">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F4F9FA]">
                    &quot;No equipment today&quot;
                  </div>
                  <div className="text-xs text-[#A8C5CA]">
                    Swaps all weighted exercises for bodyweight calisthenic regressions.
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE EXERCISE DETAIL MODAL */}
      {selectedExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-xl max-h-[88vh] bg-[#102831] border border-[#28525B] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#F4F9FA] select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#28525B] flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-[#28DACC]">
                    {selectedExerciseModal.category || "Strength"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#28DACC]/15 text-[#28DACC]">
                    {selectedExerciseModal.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F4F9FA] mt-0.5">
                  {selectedExerciseModal.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExerciseModal(null)}
                className="w-8 h-8 rounded-full bg-[#07151D] border border-[#28525B] flex items-center justify-center text-[#A8C5CA] hover:text-[#F4F9FA]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-5 space-y-4 no-scrollbar">
              {/* Illustration Frame */}
              <div className="space-y-2">
                {selectedExerciseModal.startImage && selectedExerciseModal.peakImage && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalImageTab("start")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        modalImageTab === "start"
                          ? "bg-[#28DACC] text-[#07151D] shadow-sm font-bold"
                          : "bg-[#07151D] text-[#A8C5CA] border border-[#28525B]"
                      }`}
                    >
                      1. Start Position
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalImageTab("peak")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        modalImageTab === "peak"
                          ? "bg-[#28DACC] text-[#07151D] shadow-sm font-bold"
                          : "bg-[#07151D] text-[#A8C5CA] border border-[#28525B]"
                      }`}
                    >
                      2. Peak Contraction
                    </button>
                  </div>
                )}

                <div className="aspect-square max-w-[320px] mx-auto w-full bg-[#D8F1FD] rounded-2xl border border-[#28525B] flex items-center justify-center overflow-hidden shadow-inner">
                  {modalImageTab === "start" && selectedExerciseModal.startImage && (
                    <img
                      src={selectedExerciseModal.startImage}
                      alt="Start position"
                      className="w-full h-full object-contain"
                    />
                  )}
                  {modalImageTab === "peak" && selectedExerciseModal.peakImage && (
                    <img
                      src={selectedExerciseModal.peakImage}
                      alt="Peak contraction"
                      className="w-full h-full object-contain"
                    />
                  )}
                  {modalImageTab === "main" && selectedExerciseModal.mainImage && (
                    <img
                      src={selectedExerciseModal.mainImage}
                      alt={selectedExerciseModal.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="text-[10px] text-center text-[#A8C5CA]/80">
                  RepDB Clinical Illustration · repdb.co
                </div>
              </div>

              {/* Anatomy / Setup Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#07151D] border border-[#28525B]/70">
                  <div className="text-[10px] font-mono uppercase text-[#A8C5CA]">Muscle</div>
                  <div className="font-bold text-[#F4F9FA] capitalize mt-0.5 truncate">
                    {selectedExerciseModal.primaryMuscles.join(", ")}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#07151D] border border-[#28525B]/70">
                  <div className="text-[10px] font-mono uppercase text-[#A8C5CA]">Equipment</div>
                  <div className="font-bold text-[#F4F9FA] capitalize mt-0.5 truncate">
                    {selectedExerciseModal.rawEquipment || "Bodyweight"}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#07151D] border border-[#28525B]/70">
                  <div className="text-[10px] font-mono uppercase text-[#A8C5CA]">Mechanic</div>
                  <div className="font-bold text-[#F4F9FA] capitalize mt-0.5">
                    {selectedExerciseModal.mechanic || "Compound"}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#07151D] border border-[#28525B]/70">
                  <div className="text-[10px] font-mono uppercase text-[#A8C5CA]">Force</div>
                  <div className="font-bold text-[#F4F9FA] capitalize mt-0.5">
                    {selectedExerciseModal.forceType || "Push"}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              {selectedExerciseModal.instructions && selectedExerciseModal.instructions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-mono uppercase text-[#28DACC]">
                    Execution Guide
                  </h4>
                  <ol className="space-y-1.5 text-xs text-[#F4F9FA] leading-relaxed">
                    {selectedExerciseModal.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#28DACC]/20 text-[#28DACC] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Form Tips */}
              {selectedExerciseModal.tips && selectedExerciseModal.tips.length > 0 && (
                <div className="p-3 rounded-xl bg-[#07151D] border border-[#28525B]/70 space-y-1">
                  <div className="text-[11px] font-bold text-[#28DACC]">Coach Form Tips</div>
                  <ul className="space-y-1 text-xs text-[#A8C5CA]">
                    {selectedExerciseModal.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#28DACC]">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#28525B] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedExerciseModal(null)}
                className="px-5 py-2 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
