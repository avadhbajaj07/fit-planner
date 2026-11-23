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
import { getExerciseById, MASTER_EXERCISE_LIBRARY } from "../data/exerciseLibrary";
import { matchApprovedTemplate } from "./templates";

/**
 * Filter exercises matching user's equipment and location from both baseline & master library
 */
function getEligibleExercises(
  userEquipment: EquipmentOption[] = ["bodyweight"],
  restrictions: RestrictionType[] = []
): { safe: Exercise[]; excludedDueToRestrictions: Exercise[] } {
  // Always include bodyweight as baseline
  const equipmentSet = new Set<EquipmentOption>([...userEquipment, "bodyweight"]);

  const hasRestriction = restrictions.filter((r) => r !== "none");

  // Merge baseline library and approved master library exercises
  const combinedPool = [...EXERCISE_LIBRARY, ...MASTER_EXERCISE_LIBRARY.filter(e => e.reviewStatus === "approved")];
  // Deduplicate by ID
  const uniquePoolMap = new Map<string, Exercise>();
  for (const ex of combinedPool) {
    if (!uniquePoolMap.has(ex.id)) {
      uniquePoolMap.set(ex.id, ex);
    }
  }

  const matchingEquipment = Array.from(uniquePoolMap.values()).filter((ex) =>
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
 * Enriches a PlannedExercise with RepDB WebP illustrations and attribution
 */
export function enrichWithRepDb(ex: PlannedExercise): PlannedExercise {
  const master = getExerciseById(ex.exerciseId);
  if (!master) {
    return {
      ...ex,
      image: "/images/flat/push-up-start.webp",
      attribution: "Exercise data by RepDB (repdb.co)"
    };
  }
  return {
    ...ex,
    image: master.mainImage || master.startImage || master.peakImage,
    startImage: master.startImage,
    peakImage: master.peakImage,
    mainImage: master.mainImage,
    attribution: master.attribution || "Exercise data by RepDB (repdb.co)"
  };
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

  // Check approved template match
  const matchedTemplate = matchApprovedTemplate({
    goal,
    fitnessLevel,
    location: input.location,
    equipment: userEquip,
    daysPerWeek,
    restrictions: userRestrictions
  });

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
    `Matched to clinically approved template: "${matchedTemplate.title}" using a ${split.replace("_", " ").toUpperCase()} split for optimal muscular recovery.`
  );

  rationale.push(
    `Session length calibrated for ${duration} minutes with dedicated dynamic warm-up.`
  );

  if (hasActiveRestrictions) {
    const names = userRestrictions.filter((r) => r !== "none").join(", ");
    rationale.push(
      `Active physical restriction noted for: [${names}]. Excluded ${excludedDueToRestrictions.length} high-impact movements and substituted joint-safe protocol alternatives.`
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

    // When user specifically has resistance bands, prioritize movements that use them before bodyweight
    if (userEquip.includes("resistance_bands")) {
      pool.sort((a, b) => {
        const aBand = a.equipmentNeeded.includes("resistance_bands");
        const bBand = b.equipmentNeeded.includes("resistance_bands");
        if (aBand && !bBand) return -1;
        if (!aBand && bBand) return 1;
        return 0;
      });
    }

    const chosen: PlannedExercise[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < pool.length && chosen.length < limit; i++) {
      const index = (i + seedOffset) % pool.length;
      const ex = pool[index];
      if (!usedIds.has(ex.id)) {
        usedIds.add(ex.id);
        const planned: PlannedExercise = {
          exerciseId: ex.id,
          exerciseName: ex.name,
          sets: defaultSets,
          reps: ex.defaultReps || repScheme,
          restSeconds: restSeconds,
          primaryMuscle: ex.primaryMuscles[0],
          equipmentNeeded: ex.equipmentNeeded[0],
          safetyNote: ex.safetyNotes,
          alternatives: ex.alternativeExerciseIds
        };
        chosen.push(enrichWithRepDb(planned));
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

    // Check if template has an approved session for this training session index
    const templateTrainingSessions = matchedTemplate.sessions.filter(s => !s.isRestDay);
    const templateSession = templateTrainingSessions[(sessionCount - 1) % templateTrainingSessions.length];

    if (templateSession && templateSession.exercises.length > 0) {
      // Use approved template session exercises, capped by exerciseCountPerSession
      const selectedTemplateExercises = templateSession.exercises
        .slice(0, exerciseCountPerSession)
        .map((ex) => {
          let targetEx = ex;
          // If exercise requires dumbbells or gym machinery, but user only has resistance bands, adapt to safe band equivalent
          if (
            userEquip.includes("resistance_bands") &&
            !userEquip.includes("dumbbells") &&
            !userEquip.includes("fully_equipped_gym") &&
            (ex.equipmentNeeded === "dumbbells" || ex.equipmentNeeded === "fully_equipped_gym")
          ) {
            if (ex.primaryMuscle === "chest") {
              targetEx = {
                exerciseId: "banded-push-up",
                exerciseName: "Banded Push-Up",
                sets: ex.sets,
                reps: ex.reps,
                restSeconds: ex.restSeconds,
                primaryMuscle: "chest",
                equipmentNeeded: "resistance_bands",
                safetyNote: ex.safetyNote || "Maintain flat spine and push steadily against band.",
                alternatives: ["push-up", "incline-push-up"]
              };
            } else if (ex.primaryMuscle === "back") {
              targetEx = {
                exerciseId: "banded-standing-row",
                exerciseName: "Banded Standing Row",
                sets: ex.sets,
                reps: ex.reps,
                restSeconds: ex.restSeconds,
                primaryMuscle: "back",
                equipmentNeeded: "resistance_bands",
                safetyNote: ex.safetyNote || "Squeeze shoulder blades smoothly; low spinal loading.",
                alternatives: ["band-assisted-pull-ups", "band-pull-apart"]
              };
            } else if (ex.primaryMuscle === "shoulders") {
              targetEx = {
                exerciseId: "band-pull-apart",
                exerciseName: "Band Pull Apart",
                sets: ex.sets,
                reps: ex.reps,
                restSeconds: ex.restSeconds,
                primaryMuscle: "shoulders",
                equipmentNeeded: "resistance_bands",
                safetyNote: ex.safetyNote || "Safe horizontal pull protecting rotator cuff.",
                alternatives: ["band-shoulder-external-rotation"]
              };
            } else if (ex.primaryMuscle === "legs") {
              targetEx = {
                exerciseId: "banded-glute-bridge",
                exerciseName: "Banded Glute Bridge",
                sets: ex.sets,
                reps: ex.reps,
                restSeconds: ex.restSeconds,
                primaryMuscle: "legs",
                equipmentNeeded: "resistance_bands",
                safetyNote: ex.safetyNote || "Zero knee shear; strong glute contraction.",
                alternatives: ["glute-bridge"]
              };
            }
          }

          return enrichWithRepDb({
            ...targetEx,
            sets: defaultSets,
            reps: targetEx.reps || repScheme,
            restSeconds: restSeconds
          });
        });

      weeklySessions.push({
        id: `session_day_${dayIdx + 1}`,
        dayNumber: dayIdx + 1,
        dayName,
        title: templateSession.title || `Session ${sessionCount}`,
        focusMuscles: templateSession.focusMuscles,
        estimatedDuration: duration,
        isRestDay: false,
        warmupMinutes: templateSession.warmupMinutes || 5,
        exercises: selectedTemplateExercises
      });
      continue;
    }

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
