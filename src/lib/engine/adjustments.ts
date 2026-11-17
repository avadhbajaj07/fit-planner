import { PlannedSession, PlannedExercise } from "./types";
import { EXERCISE_LIBRARY } from "./exercises";

export type AdjustmentType = "short_time" | "low_energy" | "bodyweight_only";

/**
 * Dynamically modifies a planned workout session according to on-the-fly user constraints
 */
export function adjustSession(
  session: PlannedSession,
  type: AdjustmentType
): PlannedSession {
  if (session.isRestDay) return session;

  const adjusted: PlannedSession = JSON.parse(JSON.stringify(session));

  switch (type) {
    case "short_time": {
      // 20 minute condensed version: keep 3 most compound exercises, reduce sets to 2-3
      adjusted.estimatedDuration = 20;
      adjusted.title = `${session.title} (20-Min Express)`;
      adjusted.exercises = adjusted.exercises.slice(0, 3).map((ex) => ({
        ...ex,
        sets: 2,
        restSeconds: 45
      }));
      break;
    }

    case "low_energy": {
      // Light recovery session: keep exercises but drop sets and lengthen rest
      adjusted.title = `${session.title} (Deload / Low Energy)`;
      adjusted.exercises = adjusted.exercises.map((ex) => ({
        ...ex,
        sets: Math.max(2, ex.sets - 1),
        restSeconds: ex.restSeconds + 30
      }));
      break;
    }

    case "bodyweight_only": {
      // Substitute non-bodyweight movements with bodyweight alternatives
      adjusted.title = `${session.title} (Bodyweight Anywhere)`;
      const bodyweightPool = EXERCISE_LIBRARY.filter((e) =>
        e.equipmentNeeded.includes("bodyweight")
      );

      adjusted.exercises = adjusted.exercises.map((ex, idx) => {
        if (ex.equipmentNeeded === "bodyweight") return ex;

        // Find bodyweight alternative matching primary muscle
        const alt =
          bodyweightPool.find((b) => b.primaryMuscles.includes(ex.primaryMuscle)) ||
          bodyweightPool[idx % bodyweightPool.length];

        const plannedAlt: PlannedExercise = {
          exerciseId: alt.id,
          exerciseName: alt.name,
          sets: ex.sets,
          reps: alt.defaultReps || "12-15",
          restSeconds: alt.defaultRestSeconds || 60,
          primaryMuscle: alt.primaryMuscles[0],
          equipmentNeeded: "bodyweight",
          safetyNote: alt.safetyNotes,
          alternatives: alt.alternativeExerciseIds
        };
        return plannedAlt;
      });
      break;
    }
  }

  return adjusted;
}
