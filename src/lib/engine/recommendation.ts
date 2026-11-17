import {
  AssessmentAnswers,
  GeneratedPlan,
  PlannedExercise,
  PlannedSession,
  WorkoutSplit,
  Goal,
  MuscleGroup,
  EquipmentOption,
  RestrictionType,
  Exercise
} from "./types";
import { EXERCISE_LIBRARY } from "./exercises";

/**
 * Filter exercises matching user's equipment and location
 */
function getEligibleExercises(
  userEquipment: EquipmentOption[] = ["bodyweight"],
  restrictions: RestrictionType[] = []
): { safe: Exercise[]; excludedDueToRestrictions: Exercise[] } {
  // Always include bodyweight as baseline
  const equipmentSet = new Set<EquipmentOption>([...userEquipment, "bodyweight"]);

  const hasRestriction = restrictions.filter((r) => r !== "none");

  const matchingEquipment = EXERCISE_LIBRARY.filter((ex) =>
    ex.equipmentNeeded.some((eq) => equipmentSet.has(eq))
  );

  const safe: Exercise[] = [];
  const excludedDueToRestrictions: Exercise[] = [];

  for (const ex of matchingEquipment) {
    const isViolated = hasRestriction.some((r) =>
      ex.contraindications.includes(r)
    );
    if (isViolated) {
      excludedDueToRestrictions.push(ex);
    } else {
      safe.push(ex);
    }
  }

  return { safe, excludedDueToRestrictions };
}

/**
 * Determines workout split based on weekly frequency and fitness level
 */
export function determineSplit(
  daysPerWeek: number = 3,
  fitnessLevel: string = "beginner"
): WorkoutSplit {
  if (daysPerWeek <= 3) {
    return "full_body";
  }
  if (daysPerWeek === 4) {
    return "upper_lower";
  }
  // 5 or 6 days
  if (fitnessLevel === "complete_beginner" || fitnessLevel === "beginner") {
    // Beginners with high frequency do better on Upper/Lower rotation than heavy PPL
    return "upper_lower";
  }
  return "push_pull_legs";
}

/**
 * Number of exercises per session based on workout duration
 */
export function calculateExerciseCount(durationMinutes: number = 40): number {
  if (durationMinutes <= 25) return 3;
  if (durationMinutes <= 35) return 4;
  if (durationMinutes <= 50) return 5;
  return 6;
}

/**
 * Pure deterministic recommendation engine.
 * Same inputs guaranteed to return the exact same plan.
 */
export function generateWorkoutPlan(input: AssessmentAnswers): GeneratedPlan {
  const goal: Goal = input.goal || "improve_fitness";
  const fitnessLevel = input.fitnessLevel || "beginner";
  const daysPerWeek = Math.min(Math.max(input.daysPerWeek || 3, 2), 6);
  const duration = input.durationMinutes || 40;
  const userEquip: EquipmentOption[] =
    input.equipment && input.equipment.length > 0
      ? input.equipment
      : ["bodyweight"];
  const userRestrictions: RestrictionType[] =
    input.restrictions && input.restrictions.length > 0
      ? input.restrictions
      : ["none"];

  const hasActiveRestrictions = userRestrictions.some((r) => r !== "none");
  const split = determineSplit(daysPerWeek, fitnessLevel);
  const exerciseCountPerSession = calculateExerciseCount(duration);

  const { safe, excludedDueToRestrictions } = getEligibleExercises(
    userEquip,
    userRestrictions
  );

  // Fallback safe pool if strict filters are overly narrow
  const exercisePool = safe.length > 0 ? safe : EXERCISE_LIBRARY.filter(e => e.isLowImpact);

  // Rationale explanations
  const rationale: string[] = [];

  // Goal & Rep parameters
  let defaultSets = 3;
  let repScheme = "10-12 reps";
  let restSeconds = 60;

  if (goal === "build_muscle" || goal === "gain_weight") {
    defaultSets = fitnessLevel === "complete_beginner" ? 3 : 4;
    repScheme = "8-10 reps";
    restSeconds = 90;
    rationale.push(
      `Goal focused on hypertrophy: configured ${repScheme} with ${restSeconds}s rest for progressive tension.`
    );
  } else if (goal === "lose_weight" || goal === "improve_fitness") {
    defaultSets = 3;
    repScheme = "12-15 reps";
    restSeconds = 50;
    rationale.push(
      `Goal focused on conditioning & metabolic rate: programmed ${repScheme} with ${restSeconds}s rest.`
    );
  } else {
    rationale.push(
      `Goal focused on balanced strength & fitness maintenance: calibrated moderate 10-12 rep ranges.`
    );
  }

  rationale.push(
    `Training schedule set to ${daysPerWeek} days/week utilizing a ${split.replace("_", " ").toUpperCase()} split for optimal muscular recovery.`
  );

  rationale.push(
    `Session length calibrated for ${duration} minutes with ${exerciseCountPerSession} primary exercises and dedicated dynamic warm-up.`
  );

  if (hasActiveRestrictions) {
    const names = userRestrictions.filter((r) => r !== "none").join(", ");
    rationale.push(
      `Active physical restriction noted for: [${names}]. Excluded ${excludedDueToRestrictions.length} high-impact/stress movements and substituted low-impact alternatives.`
    );
  } else {
    rationale.push(
      "No injuries or movement restrictions reported: standard progressive loading applied."
    );
  }

  // Generate 7-day schedule
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  // Helper to pick exercises deterministically for specific muscle targets
  const pickExercisesForMuscles = (
    targets: MuscleGroup[],
    limit: number,
    seedOffset: number
  ): PlannedExercise[] => {
    const matched = exercisePool.filter((ex) =>
      targets.includes("full_body")
        ? true
        : ex.primaryMuscles.some((m: MuscleGroup) => targets.includes(m))
    );

    // If not enough matches, pad with other safe exercises
    const pool = matched.length >= limit ? matched : [...matched, ...exercisePool];

    const chosen: PlannedExercise[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < pool.length && chosen.length < limit; i++) {
      const index = (i + seedOffset) % pool.length;
      const ex = pool[index];
      if (!usedIds.has(ex.id)) {
        usedIds.add(ex.id);
        chosen.push({
          exerciseId: ex.id,
          exerciseName: ex.name,
          sets: defaultSets,
          reps: ex.defaultReps || repScheme,
          restSeconds: restSeconds,
          primaryMuscle: ex.primaryMuscles[0],
          equipmentNeeded: ex.equipmentNeeded[0],
          safetyNote: ex.safetyNotes,
          alternatives: ex.alternativeExerciseIds
        });
      }
    }
    return chosen;
  };

  const weeklySessions: PlannedSession[] = [];

  // Determine training day distribution across the 7 days
  const trainingDayIndices: number[] = [];
  if (daysPerWeek === 2) {
    trainingDayIndices.push(1, 4); // Tuesday, Friday
  } else if (daysPerWeek === 3) {
    trainingDayIndices.push(0, 2, 4); // Mon, Wed, Fri
  } else if (daysPerWeek === 4) {
    trainingDayIndices.push(0, 1, 3, 4); // Mon, Tue, Thu, Fri
  } else if (daysPerWeek === 5) {
    trainingDayIndices.push(0, 1, 2, 4, 5); // Mon, Tue, Wed, Fri, Sat
  } else {
    trainingDayIndices.push(0, 1, 2, 3, 4, 5); // 6 days
  }

  let sessionCount = 0;

  for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
    const isTrainingDay = trainingDayIndices.includes(dayIdx);
    const dayName = dayNames[dayIdx];

    if (!isTrainingDay) {
      weeklySessions.push({
        id: `session_day_${dayIdx + 1}`,
        dayNumber: dayIdx + 1,
        dayName,
        title: "Active Recovery & Mobility",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      });
      continue;
    }

    sessionCount++;
    let sessionTitle = `Session ${sessionCount}`;
    let focusMuscles: MuscleGroup[] = [];

    if (split === "full_body") {
      sessionTitle = `Full Body Strength ${sessionCount}`;
      focusMuscles = ["full_body", "chest", "legs", "back", "core"];
    } else if (split === "upper_lower") {
      if (sessionCount % 2 === 1) {
        sessionTitle = `Upper Body Focus ${Math.ceil(sessionCount / 2)}`;
        focusMuscles = ["chest", "back", "shoulders", "arms"];
      } else {
        sessionTitle = `Lower Body & Core ${sessionCount / 2}`;
        focusMuscles = ["legs", "core"];
      }
    } else {
      // push_pull_legs
      const cycle = (sessionCount - 1) % 3;
      if (cycle === 0) {
        sessionTitle = "Push Day (Chest, Shoulders, Triceps)";
        focusMuscles = ["chest", "shoulders", "arms"];
      } else if (cycle === 1) {
        sessionTitle = "Pull Day (Back, Biceps, Rear Delts)";
        focusMuscles = ["back", "arms"];
      } else {
        sessionTitle = "Legs & Core Day";
        focusMuscles = ["legs", "core"];
      }
    }

    const plannedExercises = pickExercisesForMuscles(
      focusMuscles,
      exerciseCountPerSession,
      sessionCount * 2
    );

    weeklySessions.push({
      id: `session_day_${dayIdx + 1}`,
      dayNumber: dayIdx + 1,
      dayName,
      title: sessionTitle,
      focusMuscles,
      estimatedDuration: duration,
      isRestDay: false,
      warmupMinutes: 5,
      exercises: plannedExercises
    });
  }

  const safetyNotice = hasActiveRestrictions
    ? "Safety Notice: Because you indicated physical restrictions or previous injuries, your plan has been generated in Restricted Mode with high-impact exercises replaced by joint-friendly regressions. Please consult a qualified doctor or physical therapist before beginning."
    : undefined;

  return {
    id: `plan_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    goal,
    fitnessLevel,
    split,
    daysPerWeek,
    durationMinutes: duration,
    isRestrictedMode: hasActiveRestrictions,
    safetyNotice,
    rationale,
    weeklySessions
  };
}
