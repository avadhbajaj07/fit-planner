"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Flame,
  Award,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Clock,
  Sparkles,
  TrendingDown,
  Info
} from "lucide-react";
import { IosNavBar } from "@/components/layout/IosNavBar";
import { WeeklyRingStrip } from "@/components/workout/WeeklyRingStrip";
import { loadAssessmentProgress } from "@/lib/assessment/storage";
import { generateWorkoutPlan } from "@/lib/engine/recommendation";
import { GeneratedPlan, PlannedSession } from "@/lib/engine/types";
import { useAuth } from "@/lib/auth/authContext";

export default function TodayPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0); // 0 = Mon
  const [checklist, setChecklist] = useState({
    answeredStageA: true,
    savedPlan: true,
    loggedWeight: true,
    addedFocusMuscles: false,
    completedFirstSession: false
  });

  const [hasStageBCompleted, setHasStageBCompleted] = useState(false);

  useEffect(() => {
    const answers = loadAssessmentProgress();
    const generated = generateWorkoutPlan(answers);
    setPlan(generated);

    if (answers.heightCm || (answers.muscleFocus && answers.muscleFocus.length > 0)) {
      setHasStageBCompleted(true);
    }

    // Default to today's day of week (0=Mon ... 6=Sun)
    const dayOfWeek = (new Date().getDay() + 6) % 7;
    setActiveDayIdx(dayOfWeek);
  }, []);

  const todaySession: PlannedSession =
    plan?.weeklySessions[activeDayIdx] || {
      id: "session_today",
      dayNumber: 1,
      dayName: "Today",
      title: "Full Body Strength",
      focusMuscles: ["chest", "legs", "core"],
      estimatedDuration: 40,
      isRestDay: false,
      warmupMinutes: 5,
      exercises: []
    };

  // Ring strip data (Demo athlete ring state)
  const ringDays = [
    { dayName: "Monday", shortName: "Mon", isToday: activeDayIdx === 0, isScheduled: true, isCompleted: true, completionPercent: 100 },
    { dayName: "Tuesday", shortName: "Tue", isToday: activeDayIdx === 1, isScheduled: false, isCompleted: false, completionPercent: 0 },
    { dayName: "Wednesday", shortName: "Wed", isToday: activeDayIdx === 2, isScheduled: true, isCompleted: activeDayIdx > 2, completionPercent: activeDayIdx > 2 ? 100 : 0 },
    { dayName: "Thursday", shortName: "Thu", isToday: activeDayIdx === 3, isScheduled: false, isCompleted: false, completionPercent: 0 },
    { dayName: "Friday", shortName: "Fri", isToday: activeDayIdx === 4, isScheduled: true, isCompleted: false, completionPercent: 0 },
    { dayName: "Saturday", shortName: "Sat", isToday: activeDayIdx === 5, isScheduled: true, isCompleted: false, completionPercent: 0 },
    { dayName: "Sunday", shortName: "Sun", isToday: activeDayIdx === 6, isScheduled: false, isCompleted: false, completionPercent: 0 }
  ];

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-5">
      {/* iOS Large-Title Header */}
      <IosNavBar
        title="Today"
        subtitle={`Welcome back, ${user?.fullName || "Athlete"}`}
        action={
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#102831] text-[#A8C5CA] border border-[#28525B]">
              Demo data
            </span>
          </div>
        }
      />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* HERO TILE: Today's Scheduled Session (8 cols) */}
        <div className="md:col-span-8 ios-glass-card rounded-3xl p-6 border border-[#28525B] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#28DACC]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#28DACC]/15 text-[#28DACC] border border-[#28DACC]/30">
                <Dumbbell size={13} />
                <span>{todaySession.isRestDay ? "Rest & Recovery" : "Today's Workout"}</span>
              </span>
              <span className="text-xs text-[#A8C5CA] font-mono">
                {todaySession.dayName}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-[#F4F9FA] tracking-tight">
              {todaySession.title}
            </h3>

            <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
              {todaySession.isRestDay
                ? "Active recovery day. Take a light 20-minute walk, hydrate, and allow muscular tissues to rebuild."
                : `Targeting ${todaySession.focusMuscles.join(", ") || "full body"}. Designed for progressive overload with 5-minute dynamic warmup.`}
            </p>

            {!todaySession.isRestDay && (
              <div className="flex items-center gap-4 mt-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#28DACC]">
                  <Clock size={14} />
                  <span>{todaySession.estimatedDuration} min</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#F4F9FA]">
                  <Dumbbell size={14} className="text-[#28DACC]" />
                  <span>{todaySession.exercises.length || 4} Exercises</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#28525B]/40 flex items-center justify-between">
            {todaySession.isRestDay ? (
              <span className="text-xs text-[#A8C5CA]">Next training session tomorrow</span>
            ) : (
              <Link
                href={`/app/workout/${todaySession.id}`}
                className="w-full sm:w-auto px-6 h-12 rounded-[14px] bg-[#28DACC] text-[#07151D] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(40,218,204,0.3)] active:scale-[0.98] transition-all hover:bg-[#41E9DC]"
              >
                <Play size={16} fill="currentColor" />
                <span>Start Workout Session</span>
              </Link>
            )}
          </div>
        </div>

        {/* METRICS TILE: Streak & Consistency (4 cols) */}
        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4">
          <div className="ios-glass-card rounded-3xl p-5 border border-[#28525B] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A8C5CA] font-medium">Training Streak</span>
              <div className="w-8 h-8 rounded-xl bg-[#FFB020]/20 text-[#FFB020] flex items-center justify-center">
                <Flame size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold num-mono text-[#F4F9FA]">
                3 <span className="text-sm font-normal text-[#A8C5CA]">days</span>
              </div>
              <div className="text-[11px] text-[#28DA8B] mt-1 font-mono">
                +1 from last week
              </div>
            </div>
          </div>

          <div className="ios-glass-card rounded-3xl p-5 border border-[#28525B] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A8C5CA] font-medium">Weight Trend</span>
              <div className="w-8 h-8 rounded-xl bg-[#28DACC]/20 text-[#28DACC] flex items-center justify-center">
                <TrendingDown size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold num-mono text-[#28DACC]">
                74.2 <span className="text-sm font-normal text-[#A8C5CA]">kg</span>
              </div>
              <div className="text-[11px] text-[#A8C5CA] mt-1 font-mono">
                -0.6 kg this month (Demo)
              </div>
            </div>
          </div>
        </div>

        {/* FULL WIDTH TILE: Weekly Ring Strip */}
        <div className="md:col-span-12">
          <WeeklyRingStrip
            days={ringDays}
            selectedIndex={activeDayIdx}
            onSelectDay={(idx) => setActiveDayIdx(idx)}
          />
        </div>

        {/* PROFILE COMPLETION CHECKLIST TILE (12 cols) */}
        <div className="md:col-span-12 ios-glass-card rounded-3xl p-5 md:p-6 border border-[#28525B]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] uppercase font-mono tracking-wider text-[#28DACC]">
                Onboarding Progress
              </span>
              <h4 className="text-base font-bold text-[#F4F9FA]">
                Complete Your Fitness Profile
              </h4>
            </div>
            <span className="text-xs font-mono num-mono text-[#28DACC] font-semibold">
              {hasStageBCompleted ? "4 of 5 Done (80%)" : "3 of 5 Done (60%)"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            <div className="p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/50 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#28DA8B] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#F4F9FA]">Stage A Completed</div>
                <div className="text-[10px] text-[#A8C5CA]">Primary training split built</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/50 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#28DA8B] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#F4F9FA]">Health Consent Logged</div>
                <div className="text-[10px] text-[#A8C5CA]">Protocol v1.2 recorded</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/50 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#28DA8B] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#F4F9FA]">Baseline Weight Saved</div>
                <div className="text-[10px] text-[#A8C5CA]">Tracked in progress logs</div>
              </div>
            </div>

            {hasStageBCompleted ? (
              <div className="p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#28DA8B] shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#F4F9FA]">Stage B Completed</div>
                    <div className="text-[10px] text-[#A8C5CA]">Biometrics & muscles calibrated</div>
                  </div>
                </div>
                <Link
                  href="/app/profile/checklist"
                  className="text-[11px] font-semibold text-[#28DACC] hover:underline"
                >
                  Edit
                </Link>
              </div>
            ) : (
              <Link
                href="/app/profile/checklist"
                className="p-3.5 rounded-2xl bg-[#102831] border border-[#28DACC]/40 hover:border-[#28DACC] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-[#28DACC] flex items-center justify-center text-[9px] text-[#28DACC]">
                    4
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#28DACC]">Stage B Fine-Tuning</div>
                    <div className="text-[10px] text-[#A8C5CA]">Muscle focus & sleep target</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#28DACC]" />
              </Link>
            )}

            <Link
              href="/app/nutrition"
              className="p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/50 hover:border-[#28DACC]/40 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border border-[#28525B] flex items-center justify-center text-[9px] text-[#A8C5CA]">
                  5
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#F4F9FA]">Stage C Nutrition Setup</div>
                  <div className="text-[10px] text-[#A8C5CA]">Allergen & macro filter</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#A8C5CA]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
