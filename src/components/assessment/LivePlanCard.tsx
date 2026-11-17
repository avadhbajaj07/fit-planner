"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Dumbbell,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Home,
  Building,
  Activity
} from "lucide-react";
import { AssessmentAnswers, MuscleGroup } from "@/lib/engine/types";
import { BodyDiagram } from "./BodyDiagram";
import { determineSplit, calculateExerciseCount } from "@/lib/engine/recommendation";

interface LivePlanCardProps {
  answers: AssessmentAnswers;
  step: number;
  totalSteps: number;
}

export const LivePlanCard: React.FC<LivePlanCardProps> = ({
  answers,
  step,
  totalSteps
}) => {
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);

  const days = answers.daysPerWeek || 3;
  const duration = answers.durationMinutes || 40;
  const split = determineSplit(days, answers.fitnessLevel || "beginner");
  const exerciseCount = calculateExerciseCount(duration);

  // Active muscle groups derived from answers or split
  let activeMuscles: MuscleGroup[] = ["full_body"];
  if (answers.muscleFocus && answers.muscleFocus.length > 0) {
    activeMuscles = answers.muscleFocus;
  } else if (split === "upper_lower") {
    activeMuscles = ["chest", "back", "shoulders", "legs", "arms"];
  } else if (split === "push_pull_legs") {
    activeMuscles = ["chest", "shoulders", "arms", "back", "legs"];
  }

  const hasRestrictions =
    answers.restrictions &&
    answers.restrictions.some((r) => r !== "none");

  const splitFormatted =
    split === "full_body"
      ? "Full Body Strength"
      : split === "upper_lower"
      ? "Upper / Lower Split"
      : "Push / Pull / Legs";

  const goalName =
    answers.goal === "build_muscle"
      ? "Hypertrophy & Muscle Gain"
      : answers.goal === "lose_weight"
      ? "Fat Loss & Conditioning"
      : answers.goal === "gain_weight"
      ? "Weight & Strength Gain"
      : answers.goal === "improve_fitness"
      ? "Stamina & Athleticism"
      : "Balanced Functional Fitness";

  return (
    <div className="w-full">
      {/* MOBILE PEEK CARD (Compact Header with Tap to Expand) */}
      <div className="lg:hidden mb-4">
        <div
          onClick={() => setIsExpandedMobile(!isExpandedMobile)}
          className="ios-glass-card rounded-2xl p-3.5 border border-[#28525B]/70 shadow-lg cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#102831] border border-[#28DACC]/40 flex items-center justify-center text-[#28DACC]">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#28DACC] font-semibold">
                    Live Plan Card
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#28DACC]/10 text-[#28DACC] border border-[#28DACC]/20">
                    Step {step}/{totalSteps}
                  </span>
                </div>
                <h4 className="text-[14px] font-semibold text-[#F4F9FA] leading-tight flex items-center gap-1">
                  {splitFormatted}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-[#A8C5CA]">Schedule</div>
                <div className="text-[13px] font-bold num-mono text-[#28DACC]">
                  {days}d · {duration}m
                </div>
              </div>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-[#102831] flex items-center justify-center text-[#A8C5CA]"
                aria-label={isExpandedMobile ? "Collapse plan summary" : "Expand plan summary"}
              >
                {isExpandedMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Quick 7-Day Dots Bar on Mobile Peek */}
          <div className="mt-2.5 pt-2.5 border-t border-[#28525B]/40 flex items-center justify-between px-1">
            <span className="text-[11px] text-[#A8C5CA]">Week schedule:</span>
            <div className="flex items-center gap-1.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
                const isActive =
                  (days === 2 && (i === 1 || i === 4)) ||
                  (days === 3 && (i === 0 || i === 2 || i === 4)) ||
                  (days === 4 && (i === 0 || i === 1 || i === 3 || i === 4)) ||
                  (days === 5 && (i === 0 || i === 1 || i === 2 || i === 4 || i === 5)) ||
                  (days >= 6 && i < 6);
                return (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                      isActive
                        ? "bg-[#28DACC] text-[#07151D] font-bold shadow-[0_0_8px_rgba(40,218,204,0.4)]"
                        : "bg-[#102831] text-[#A8C5CA]/50 border border-[#28525B]/40"
                    }`}
                  >
                    {d}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Expanded Bottom Sheet / Drawer View */}
        <AnimatePresence>
          {isExpandedMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden ios-glass-card rounded-2xl p-4 border border-[#28DACC]/30"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono text-[#A8C5CA]">Plan Architecture</span>
                {hasRestrictions && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40">
                    <ShieldAlert size={12} /> Restricted Mode
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-[#102831] p-2.5 rounded-xl border border-[#28525B]/40">
                  <div className="text-[10px] text-[#A8C5CA]">Primary Focus</div>
                  <div className="text-xs font-semibold text-[#F4F9FA] mt-0.5">{goalName}</div>
                </div>
                <div className="bg-[#102831] p-2.5 rounded-xl border border-[#28525B]/40">
                  <div className="text-[10px] text-[#A8C5CA]">Exercises / Session</div>
                  <div className="text-xs font-semibold num-mono text-[#28DACC] mt-0.5">
                    {exerciseCount} Movements
                  </div>
                </div>
              </div>

              <div className="flex justify-center bg-[#102831]/60 rounded-xl p-3 border border-[#28525B]/40">
                <BodyDiagram activeMuscles={activeMuscles} size={110} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP SIDE PANEL (Persistent Athlete Training Log Card) */}
      <div className="hidden lg:block w-full sticky top-8">
        <motion.div
          layout
          className="ios-glass-card rounded-3xl p-6 border border-[#28525B] shadow-2xl relative overflow-hidden"
        >
          {/* Subtle teal background accent */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#28DACC]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#28525B]/60">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#28DACC] animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider text-[#28DACC] font-semibold">
                  Live Plan Construction
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#F4F9FA] mt-1">{splitFormatted}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#102831] border border-[#28525B] flex items-center justify-center text-[#28DACC]">
              <Activity size={20} />
            </div>
          </div>

          {/* Goal & Mode Badge */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#102831] text-[#A8C5CA] border border-[#28525B]">
              {goalName}
            </span>
            {hasRestrictions ? (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40 flex items-center gap-1">
                <ShieldAlert size={12} /> Restricted Mode
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-[#28DA8B]/20 text-[#28DA8B] border border-[#28DA8B]/30 flex items-center gap-1">
                Full Progressive Mode
              </span>
            )}
          </div>

          {/* Real-time Metric Tiles (Monospace numbers) */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-[#102831] p-3 rounded-2xl border border-[#28525B]/60">
              <div className="flex items-center gap-1.5 text-[11px] text-[#A8C5CA]">
                <Calendar size={13} className="text-[#28DACC]" /> Days / Week
              </div>
              <div className="text-2xl font-bold num-mono text-[#F4F9FA] mt-1">
                {days} <span className="text-xs text-[#A8C5CA] font-normal">days</span>
              </div>
            </div>

            <div className="bg-[#102831] p-3 rounded-2xl border border-[#28525B]/60">
              <div className="flex items-center gap-1.5 text-[11px] text-[#A8C5CA]">
                <Clock size={13} className="text-[#28DACC]" /> Duration
              </div>
              <div className="text-2xl font-bold num-mono text-[#F4F9FA] mt-1">
                {duration} <span className="text-xs text-[#A8C5CA] font-normal">min</span>
              </div>
            </div>
          </div>

          {/* 7-Day Ring Strip */}
          <div className="mt-4 p-3.5 bg-[#102831] rounded-2xl border border-[#28525B]/60">
            <div className="text-[11px] text-[#A8C5CA] mb-2 flex justify-between">
              <span>Weekly Cadence</span>
              <span className="num-mono text-[#28DACC] font-semibold">{days} Active Sessions</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
                const isActive =
                  (days === 2 && (i === 1 || i === 4)) ||
                  (days === 3 && (i === 0 || i === 2 || i === 4)) ||
                  (days === 4 && (i === 0 || i === 1 || i === 3 || i === 4)) ||
                  (days === 5 && (i === 0 || i === 1 || i === 2 || i === 4 || i === 5)) ||
                  (days >= 6 && i < 6);

                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-[#A8C5CA]">{d}</span>
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isActive
                          ? "bg-[#28DACC] text-[#07151D] shadow-[0_0_12px_rgba(40,218,204,0.35)] scale-105"
                          : "bg-[#07151D] text-[#A8C5CA]/40 border border-[#28525B]/40"
                      }`}
                    >
                      {isActive ? "✓" : "–"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anatomy & Equipment Preview */}
          <div className="mt-4 p-4 bg-[#102831] rounded-2xl border border-[#28525B]/60 flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider text-[#A8C5CA] mb-1 font-mono">
                Anatomy Engagement
              </div>
              <div className="text-sm font-semibold text-[#F4F9FA] leading-snug">
                {activeMuscles.join(", ").toUpperCase()}
              </div>
              <div className="mt-2 text-xs text-[#A8C5CA]">
                Exercises: <span className="num-mono font-bold text-[#28DACC]">{exerciseCount} per session</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#A8C5CA]">
                <Dumbbell size={13} className="text-[#28DACC]" />
                <span className="capitalize">
                  {answers.equipment && answers.equipment.length > 0
                    ? answers.equipment.join(", ").replace(/_/g, " ")
                    : "Bodyweight Only"}
                </span>
              </div>
            </div>
            <div className="w-28 flex justify-center">
              <BodyDiagram activeMuscles={activeMuscles} size={90} />
            </div>
          </div>

          {/* Progress bar in Assessment */}
          <div className="mt-5 pt-3 border-t border-[#28525B]/60">
            <div className="flex justify-between text-xs text-[#A8C5CA] mb-1.5">
              <span>Assessment Stage A</span>
              <span className="num-mono font-semibold text-[#28DACC]">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#102831] rounded-full overflow-hidden border border-[#28525B]/50">
              <div
                className="h-full bg-gradient-to-r from-[#28DACC] to-[#41E9DC] transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
