"use client";

import React, { useState, useEffect } from "react";
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
  ShieldAlert,
  X
} from "lucide-react";
import { IosNavBar } from "@/components/layout/IosNavBar";
import { loadAssessmentProgress } from "@/lib/assessment/storage";
import { generateWorkoutPlan } from "@/lib/engine/recommendation";
import { adjustSession, AdjustmentType } from "@/lib/engine/adjustments";
import { GeneratedPlan, PlannedSession } from "@/lib/engine/types";
import { ShareablePlanCard } from "@/components/workout/ShareablePlanCard";

export default function PlanPage() {
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [showAdjustSheet, setShowAdjustSheet] = useState(false);
  const [adjustmentNotice, setAdjustmentNotice] = useState<string | null>(null);

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
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
      <IosNavBar
        title="Training Plan"
        subtitle={`${plan.split.replace(/_/g, " ").toUpperCase()} · ${plan.daysPerWeek} Days / Week`}
        action={
          <button
            type="button"
            onClick={() => setShowAdjustSheet(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC] hover:border-[#28DACC]/50 active:scale-95 transition-all"
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

      {/* 7-DAY CALENDAR SELECTOR */}
      <div className="ios-glass-card rounded-3xl p-3 border border-[#28525B]/70 overflow-x-auto no-scrollbar">
        <div className="grid grid-cols-7 gap-2 min-w-[320px]">
          {plan.weeklySessions.map((session, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? "card-selected-glow bg-[#102831]"
                    : "bg-[#07151D]/60 border border-[#28525B]/40 hover:bg-[#102831]"
                }`}
              >
                <span className="text-[10px] uppercase font-mono text-[#A8C5CA]">
                  {session.dayName.slice(0, 3)}
                </span>
                <span
                  className={`text-sm font-bold num-mono mt-0.5 ${
                    isSelected ? "text-[#28DACC]" : "text-[#F4F9FA]"
                  }`}
                >
                  Day {session.dayNumber}
                </span>
                <span
                  className={`text-[9px] mt-1 px-1.5 py-0.5 rounded-md font-mono ${
                    session.isRestDay
                      ? "bg-[#07151D] text-[#A8C5CA]/60"
                      : "bg-[#28DACC]/15 text-[#28DACC]"
                  }`}
                >
                  {session.isRestDay ? "Rest" : "Lift"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SESSION CARD DETAIL */}
      <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#28DACC]">
                {activeSession.dayName}
              </span>
              {activeSession.isRestDay ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#102831] text-[#A8C5CA] border border-[#28525B]">
                  Rest Day
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#28DACC]/15 text-[#28DACC] border border-[#28DACC]/30">
                  Targeted Session
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-[#F4F9FA] mt-1">
              {activeSession.title}
            </h2>
          </div>

          {!activeSession.isRestDay && (
            <Link
              href={`/app/workout/${activeSession.id}`}
              className="px-5 h-11 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(40,218,204,0.3)] active:scale-95 transition-all hover:bg-[#41E9DC]"
            >
              <Play size={14} fill="currentColor" />
              <span>Launch Session</span>
            </Link>
          )}
        </div>

        {/* Exercises List */}
        {activeSession.isRestDay ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#102831] border border-[#28525B] flex items-center justify-center text-[#28DACC] mx-auto mb-3">
              <Calendar size={22} />
            </div>
            <h3 className="text-base font-bold text-[#F4F9FA]">Scheduled Active Recovery</h3>
            <p className="text-xs text-[#A8C5CA] mt-1 max-w-sm mx-auto leading-relaxed">
              Muscles grow and repair during recovery. Stay hydrated, prioritize sleep, and perform light mobility or a 30-minute walk.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="text-xs text-[#A8C5CA] font-mono uppercase tracking-wider mb-2">
              Exercise Prescription ({activeSession.exercises.length} Movements)
            </div>

            {activeSession.exercises.map((item, idx) => (
              <div
                key={`${item.exerciseId}_${idx}`}
                className="p-4 rounded-2xl bg-[#102831] border border-[#28525B]/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 h-6 rounded-lg bg-[#07151D] border border-[#28525B] text-xs font-mono font-bold text-[#28DACC] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[#F4F9FA]">
                      {item.exerciseName}
                    </div>
                    <div className="text-xs text-[#A8C5CA] flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{item.primaryMuscle}</span>
                      <span>·</span>
                      <span className="capitalize">{item.equipmentNeeded.replace(/_/g, " ")}</span>
                      {item.safetyNote && (
                        <>
                          <span>·</span>
                          <span className="text-[#FFB020] flex items-center gap-0.5">
                            <ShieldAlert size={11} /> Safe Form
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold num-mono text-[#28DACC]">
                    {item.sets} sets × {item.reps}
                  </div>
                  <div className="text-[10px] text-[#A8C5CA] font-mono">
                    {item.restSeconds}s rest
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
    </div>
  );
}
