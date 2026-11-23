"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Clock,
  Dumbbell,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { loadAssessmentProgress } from "@/lib/assessment/storage";
import { generateWorkoutPlan } from "@/lib/engine/recommendation";
import { PlannedSession } from "@/lib/engine/types";
import { FocusModeModal } from "@/components/workout/FocusModeModal";
import { useAuth } from "@/lib/auth/authContext";
import { supabase } from "@/lib/supabase/client";

function WorkoutSessionContent() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params ? (params.id as string) : "";
  const { user } = useAuth();

  const [session, setSession] = useState<PlannedSession | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    const answers = loadAssessmentProgress();
    const plan = generateWorkoutPlan(answers);
    const found =
      plan.weeklySessions.find((s) => s.id === sessionId) ||
      plan.weeklySessions.find((s) => !s.isRestDay) ||
      plan.weeklySessions[0];
    setSession(found);
  }, [sessionId]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-sm text-[#A8C5CA]">
        Loading session routine...
      </div>
    );
  }

  const toggleSet = (exerciseId: string, setIndex: number) => {
    const key = `${exerciseId}_${setIndex}`;
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFinishWorkout = () => {
    setSessionCompleted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#28DACC", "#41E9DC", "#28DA8B"]
      });
    } catch (e) {
      // ignore
    }

    // Persist workout log locally and sync to Supabase
    try {
      const logEntry = {
        sessionId,
        sessionTitle: session?.title || "Workout Session",
        durationMinutes: session?.estimatedDuration || 40,
        completedAt: new Date().toISOString(),
        exercises: session?.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: Array.from({ length: ex.sets }).map((_, idx) => ({
            setNumber: idx + 1,
            completed: Boolean(completedSets[`${ex.exerciseId}_${idx}`]),
            reps: ex.reps
          }))
        }))
      };

      const existingLogs = JSON.parse(localStorage.getItem("fit_planner_workout_logs") || "[]");
      existingLogs.unshift(logEntry);
      localStorage.setItem("fit_planner_workout_logs", JSON.stringify(existingLogs.slice(0, 50)));

      if (supabase && user && !user.isDemoAccount) {
        Promise.resolve(
          supabase.from("workout_logs").insert({
            user_id: user.id,
            session_id: sessionId,
            session_title: session?.title || "Workout Session",
            duration_minutes: session?.estimatedDuration || 40,
            exercise_logs_json: logEntry.exercises,
            completed_at: new Date().toISOString()
          })
        ).catch((err: unknown) => console.warn("Sync to Supabase logs failed:", err));
      }
    } catch (err) {
      console.warn("Saving workout log failed", err);
    }
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
      {/* iOS App Navigation Header */}
      <div className="pt-safe flex items-center justify-between pb-2 border-b border-[#28525B]/40">
        <Link
          href="/app/today"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#28DACC] active:opacity-70"
        >
          <ChevronLeft size={20} />
          <span>Today</span>
        </Link>
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#A8C5CA]">
          TRAINING LOG
        </span>
        <button
          type="button"
          onClick={() => setIsFocusModeOpen(true)}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#28DACC]/15 text-[#28DACC] border border-[#28DACC]/30 text-xs font-semibold hover:bg-[#28DACC]/25"
        >
          <Sparkles size={12} />
          <span>Focus Mode</span>
        </button>
      </div>

      {sessionCompleted ? (
        <div className="ios-glass-card rounded-3xl p-8 border border-[#28525B] text-center max-w-md mx-auto my-12 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-[#28DA8B]/20 text-[#28DA8B] flex items-center justify-center mx-auto mb-4 border border-[#28DA8B]/40">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F4F9FA]">
            Workout Completed!
          </h2>
          <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
            Great session! All completed sets have been saved to your local training log and your weekly activity ring has filled.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
            <div className="bg-[#102831] p-3 rounded-2xl border border-[#28525B]">
              <div className="text-[10px] text-[#A8C5CA] uppercase font-mono">Duration</div>
              <div className="text-lg font-bold num-mono text-[#28DACC]">
                {session.estimatedDuration} min
              </div>
            </div>
            <div className="bg-[#102831] p-3 rounded-2xl border border-[#28525B]">
              <div className="text-[10px] text-[#A8C5CA] uppercase font-mono">Exercises</div>
              <div className="text-lg font-bold num-mono text-[#F4F9FA]">
                {session.exercises.length} Logged
              </div>
            </div>
          </div>

          <Link
            href="/app/today"
            className="w-full h-12 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(40,218,204,0.3)]"
          >
            <span>Return to Dashboard</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <>
          {/* SESSION HERO */}
          <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#28DACC]">
                  {session.dayName} · Session Protocol
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-1">
                  {session.title}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-xs font-mono text-[#A8C5CA]">
                  <span className="flex items-center gap-1 text-[#28DACC]">
                    <Clock size={13} /> {session.estimatedDuration} min
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[#F4F9FA]">
                    <Dumbbell size={13} className="text-[#28DACC]" /> {session.exercises.length} Exercises
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFocusModeOpen(true)}
                className="w-full sm:w-auto px-6 h-12 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(40,218,204,0.3)] active:scale-95 transition-all"
              >
                <Play size={16} fill="currentColor" />
                <span>Enter Focus Mode (Timer)</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC WARM-UP SECTION */}
          <div className="p-4 rounded-2xl bg-[#102831] border border-[#28525B]/60">
            <div className="text-xs font-mono uppercase tracking-wider text-[#A8C5CA] mb-1">
              Phase 1: Dynamic Warm-Up (5 min)
            </div>
            <p className="text-xs text-[#F4F9FA]">
              Arm circles, hip rotations, cat-cow stretches, and light bodyweight activation to elevate heart rate and lubricate joint capsules.
            </p>
          </div>

          {/* EXERCISE LOGGING LIST */}
          <div className="space-y-4">
            <div className="text-xs text-[#A8C5CA] font-mono uppercase tracking-wider">
              Phase 2: Working Sets & Progression Log
            </div>

            {session.exercises.map((item, exIdx) => (
              <div
                key={item.exerciseId}
                className="ios-glass-card rounded-2xl p-4 md:p-5 border border-[#28525B]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {item.image && (
                      <div className="w-14 h-14 rounded-xl bg-[#D8F1FD] border border-[#28525B] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.exerciseName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#102831] text-[10px] font-mono font-bold text-[#28DACC] flex items-center justify-center border border-[#28525B]">
                          {exIdx + 1}
                        </span>
                        <h3 className="text-base font-bold text-[#F4F9FA]">
                          {item.exerciseName}
                        </h3>
                      </div>
                      <div className="text-xs text-[#A8C5CA] mt-0.5">
                        <span className="capitalize">{item.primaryMuscle}</span> ·{" "}
                        <span className="capitalize">{item.equipmentNeeded.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-[#28DACC]">
                    {item.restSeconds}s rest
                  </span>
                </div>

                {/* Sets Table */}
                <div className="space-y-2 mt-3 pt-3 border-t border-[#28525B]/40">
                  {Array.from({ length: item.sets }).map((_, setIdx) => {
                    const isDone = completedSets[`${item.exerciseId}_${setIdx}`];
                    return (
                      <div
                        key={setIdx}
                        onClick={() => toggleSet(item.exerciseId, setIdx)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isDone
                            ? "bg-[#28DACC]/10 border-[#28DACC]/50 text-[#28DACC]"
                            : "bg-[#102831] border-[#28525B]/50 hover:bg-[#142D35]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isDone
                                ? "bg-[#28DACC] border-[#28DACC] text-[#07151D]"
                                : "border-[#28525B] bg-[#07151D]"
                            }`}
                          >
                            {isDone && <CheckCircle2 size={13} className="stroke-[3]" />}
                          </div>
                          <span className="text-xs font-mono font-semibold">
                            Set {setIdx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-[#A8C5CA]">{item.reps} target</span>
                          <span className="font-bold text-[#F4F9FA]">
                            {isDone ? "Completed ✓" : "Tap to complete"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM FINISH BUTTON */}
          <div className="pt-4 pb-safe">
            <button
              type="button"
              onClick={handleFinishWorkout}
              className="w-full h-14 rounded-2xl bg-[#28DACC] text-[#07151D] font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.35)] active:scale-[0.98] transition-all hover:bg-[#41E9DC]"
            >
              <CheckCircle2 size={20} className="stroke-[2.5]" />
              <span>Complete & Log Workout Session</span>
            </button>
          </div>
        </>
      )}

      {/* FOCUS MODE MODAL */}
      <FocusModeModal
        exercises={session.exercises}
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        onCompleteSession={() => {
          setIsFocusModeOpen(false);
          handleFinishWorkout();
        }}
      />
    </div>
  );
}

export default function WorkoutSessionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#A8C5CA]">Loading Workout Session...</div>}>
      <WorkoutSessionContent />
    </Suspense>
  );
}
