"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
  Dumbbell,
  Clock,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { PlannedExercise } from "@/lib/engine/types";
import { getExerciseById } from "@/lib/engine/exercises";

interface FocusModeModalProps {
  exercises: PlannedExercise[];
  initialExerciseIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onCompleteSession: () => void;
}

export const FocusModeModal: React.FC<FocusModeModalProps> = ({
  exercises,
  initialExerciseIndex = 0,
  isOpen,
  onClose,
  onCompleteSession
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialExerciseIndex);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [loggedWeight, setLoggedWeight] = useState("20");

  const ex = exercises[currentIdx];
  const fullDetails = ex ? getExerciseById(ex.exerciseId) : null;

  // Screen Wake Lock API to prevent phone sleeping during workout
  useEffect(() => {
    let wakeLockSentinel: any = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockSentinel = await (navigator as any).wakeLock.request("screen");
        }
      } catch (err) {
        // Wake lock can fail if low battery or user denied
      }
    };

    if (isOpen) {
      requestWakeLock();
    }

    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, [isOpen]);

  // Countdown timer for rest interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && restSecondsLeft > 0) {
      timer = setInterval(() => {
        setRestSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (restSecondsLeft === 0) {
      setIsResting(false);
      // Trigger browser vibration if supported
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft]);

  if (!isOpen || !ex) return null;

  const handleCompleteSet = () => {
    // Vibrate haptic
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50);
    }

    if (currentSet < ex.sets) {
      setCurrentSet((s) => s + 1);
      setRestSecondsLeft(ex.restSeconds || 60);
      setIsResting(true);
    } else {
      // Completed all sets for this exercise
      if (currentIdx < exercises.length - 1) {
        setCurrentIdx((i) => i + 1);
        setCurrentSet(1);
        setRestSecondsLeft(ex.restSeconds || 60);
        setIsResting(true);
      } else {
        onCompleteSession();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* Top Bar with Close & Progress */}
      <div className="pt-safe flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-[#102831] border border-[#28525B] text-[#A8C5CA] hover:text-[#F4F9FA]"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#28DACC]">
            FOCUS MODE
          </span>
          <div className="text-xs font-bold num-mono text-[#F4F9FA]">
            Movement {currentIdx + 1} of {exercises.length}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentIdx < exercises.length - 1) {
              setCurrentIdx((i) => i + 1);
              setCurrentSet(1);
              setIsResting(false);
            }
          }}
          disabled={currentIdx >= exercises.length - 1}
          className="text-xs text-[#28DACC] disabled:opacity-30 font-semibold"
        >
          Skip
        </button>
      </div>

      {/* Main Focus Card */}
      <div className="my-auto max-w-lg w-full mx-auto text-center py-4">
        {/* Rest Timer Overlay State */}
        {isResting ? (
          <div className="space-y-4 animate-fade-in">
            <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
              REST INTERVAL
            </span>
            <div className="text-7xl font-extrabold num-mono text-[#28DACC] drop-shadow-[0_0_24px_rgba(40,218,204,0.4)]">
              {restSecondsLeft}s
            </div>
            <p className="text-xs text-[#A8C5CA]">
              Next up: Set {currentSet} of {ex.sets} on {ex.exerciseName}
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setRestSecondsLeft((s) => s + 30)}
                className="px-4 py-2 rounded-xl bg-[#102831] border border-[#28525B] text-xs font-mono text-[#A8C5CA]"
              >
                +30s
              </button>
              <button
                type="button"
                onClick={() => setIsResting(false)}
                className="px-6 py-2.5 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold"
              >
                Skip Rest & Lift
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            {/* Exercise Name & Target */}
            <div>
              {ex.image && (
                <div className="w-28 h-28 mx-auto mb-3 rounded-2xl bg-[#D8F1FD] border border-[#28525B] overflow-hidden flex items-center justify-center shadow-lg">
                  <img
                    src={ex.image}
                    alt={ex.exerciseName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102831] border border-[#28525B] text-xs font-mono text-[#28DACC] mb-3">
                <Dumbbell size={13} />
                <span className="capitalize">{ex.primaryMuscle} Target</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] leading-tight">
                {ex.exerciseName}
              </h2>
              {ex.safetyNote && (
                <div className="mt-2 text-xs text-[#FFB020] flex items-center justify-center gap-1.5">
                  <ShieldAlert size={14} />
                  <span>{ex.safetyNote}</span>
                </div>
              )}
            </div>

            {/* Set & Rep Counter Displays */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="bg-[#102831] p-4 rounded-2xl border border-[#28525B]">
                <div className="text-[11px] uppercase font-mono text-[#A8C5CA]">Current Set</div>
                <div className="text-3xl font-bold num-mono text-[#28DACC] mt-1">
                  {currentSet} <span className="text-xs text-[#A8C5CA] font-normal">/ {ex.sets}</span>
                </div>
              </div>

              <div className="bg-[#102831] p-4 rounded-2xl border border-[#28525B]">
                <div className="text-[11px] uppercase font-mono text-[#A8C5CA]">Target Reps</div>
                <div className="text-3xl font-bold num-mono text-[#F4F9FA] mt-1">
                  {ex.reps}
                </div>
              </div>
            </div>

            {/* Quick Weight Input Field */}
            {ex.equipmentNeeded !== "bodyweight" && (
              <div className="max-w-xs mx-auto p-3 rounded-2xl bg-[#102831] border border-[#28525B]/70 flex items-center justify-between">
                <span className="text-xs text-[#A8C5CA] font-medium">Load (kg):</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLoggedWeight((w) => String(Math.max(2, parseFloat(w) - 2.5)))}
                    className="w-8 h-8 rounded-lg bg-[#07151D] text-sm font-bold text-[#F4F9FA]"
                  >
                    –
                  </button>
                  <span className="w-12 text-center font-bold num-mono text-[#28DACC]">
                    {loggedWeight}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLoggedWeight((w) => String(parseFloat(w) + 2.5))}
                    className="w-8 h-8 rounded-lg bg-[#07151D] text-sm font-bold text-[#F4F9FA]"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Form Cue */}
            {fullDetails?.instructions && (
              <p className="text-xs text-[#A8C5CA] italic max-w-sm mx-auto">
                &quot;{fullDetails.instructions[0]}&quot;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Big Full-Width Bottom Action Button */}
      <div className="max-w-lg w-full mx-auto pb-safe">
        {!isResting && (
          <button
            type="button"
            onClick={handleCompleteSet}
            className="w-full h-14 rounded-2xl bg-[#28DACC] text-[#07151D] font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.4)] active:scale-[0.98] transition-all hover:bg-[#41E9DC]"
          >
            <Check size={20} className="stroke-[3]" />
            <span>
              {currentSet === ex.sets && currentIdx === exercises.length - 1
                ? "Finish Workout"
                : `Complete Set ${currentSet}`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
