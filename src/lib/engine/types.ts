export type Gender = "male" | "female" | "prefer_not_to_say";

export type Goal =
  | "lose_weight"
  | "build_muscle"
  | "gain_weight"
  | "improve_fitness"
  | "maintain";

export type FitnessLevel =
  | "complete_beginner"
  | "beginner"
  | "intermediate"
  | "advanced";

export type WorkoutLocation = "home" | "gym" | "both";

export type EquipmentOption =
  | "bodyweight"
  | "dumbbells"
  | "resistance_bands"
  | "basic_home_gym"
  | "fully_equipped_gym";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "core"
  | "full_body";

export type RestrictionType =
  | "none"
  | "back"
  | "knee"
  | "shoulder"
  | "other";

export type WorkoutSplit =
  | "full_body"
  | "upper_lower"
  | "push_pull_legs"
  | "body_part";

export interface AssessmentAnswers {
  gender?: Gender;
  age?: number;
  goal?: Goal;
  fitnessLevel?: FitnessLevel;
  location?: WorkoutLocation;
  equipment?: EquipmentOption[];
  daysPerWeek?: number;
  durationMinutes?: number;
  restrictions?: RestrictionType[];
  restrictionNotes?: string;
  muscleFocus?: MuscleGroup[];
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  healthConsentGiven?: boolean;
  healthConsentTimestamp?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipmentNeeded: EquipmentOption[];
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string[];
  commonMistakes: string[];
  safetyNotes?: string;
  contraindications: RestrictionType[];
  isLowImpact: boolean;
  alternativeExerciseIds: string[];
  defaultSets: number;
  defaultReps: string;
  defaultRestSeconds: number;
}

export interface PlannedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  restSeconds: number;
  primaryMuscle: MuscleGroup;
  equipmentNeeded: EquipmentOption;
  safetyNote?: string;
  alternatives: string[];
}

export interface PlannedSession {
  id: string;
  dayNumber: number;
  dayName: string;
  title: string;
  focusMuscles: MuscleGroup[];
  estimatedDuration: number;
  isRestDay: boolean;
  warmupMinutes: number;
  exercises: PlannedExercise[];
}

export interface GeneratedPlan {
  id: string;
  createdAt: string;
  goal: Goal;
  fitnessLevel: FitnessLevel;
  split: WorkoutSplit;
  daysPerWeek: number;
  durationMinutes: number;
  isRestrictedMode: boolean;
  safetyNotice?: string;
  rationale: string[];
  weeklySessions: PlannedSession[];
}

export interface ExerciseSetLog {
  setNumber: number;
  targetReps: string;
  completedReps: number;
  weightKg: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSetLog[];
  notes?: string;
}

export interface CompletedWorkoutSession {
  id: string;
  planId: string;
  sessionId: string;
  sessionTitle: string;
  completedAt: string;
  durationMinutes: number;
  exerciseLogs: ExerciseLog[];
}
