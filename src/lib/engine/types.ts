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

export type BodyShape =
  | "slim"
  | "lean"
  | "athletic"
  | "average"
  | "heavy"
  | "very_heavy"
  | "petite"
  | "curvy"
  | "plus_size"
  | "very_plus_size"
  | "slender"
  | "not_sure";

export type DailyActivity =
  | "mostly_sitting"
  | "lightly_active"
  | "moderately_active"
  | "very_active";

export type SleepRange =
  | "less_than_6"
  | "6_to_7"
  | "7_to_8"
  | "more_than_8";

export type DietType =
  | "vegetarian"
  | "vegan"
  | "non_vegetarian"
  | "pescatarian"
  | "flexible";

export type FitnessChallenge =
  | "lack_of_time"
  | "lack_of_motivation"
  | "no_plan"
  | "lack_of_knowledge"
  | "staying_consistent";

export type CurrentFrequency =
  | "never"
  | "occasionally"
  | "1_2_days"
  | "3_4_days"
  | "5_plus_days";

export type FoodIntolerance =
  | "none"
  | "lactose"
  | "gluten"
  | "nuts"
  | "other"
  | "not_sure";

export type MealsPerDay = "2" | "3" | "4" | "5_plus" | "not_sure";

export interface AssessmentAnswers {
  // Section 1: Personal Details & Goals
  gender?: Gender;
  age?: number;
  ageBracket?: "18_29" | "30_39" | "40_49" | "50_plus";
  goal?: Goal;
  fitnessLevel?: FitnessLevel;

  // Section 2: Body Measurements
  heightCm?: number;
  heightFeet?: number;
  heightInches?: number;
  isHeightImperial?: boolean;
  weightKg?: number;
  isWeightImperial?: boolean;
  targetWeightKg?: number;
  bodyShape?: BodyShape;
  estimatedBodyFat?: number;

  // Section 3: Workout Preferences
  location?: WorkoutLocation;
  equipment?: EquipmentOption[];
  daysPerWeek?: number;
  durationMinutes?: number;

  // Section 4: Lifestyle & Health
  dailyActivity?: DailyActivity;
  sleepHours?: SleepRange;
  restrictions?: RestrictionType[];
  restrictionNotes?: string;
  dietType?: DietType;

  // Section 5: Training Focus & Motivation
  muscleFocus?: MuscleGroup[];
  fitnessChallenge?: FitnessChallenge;
  currentFrequency?: CurrentFrequency;

  // Section 6: Nutrition Preferences
  foodIntolerances?: FoodIntolerance[];
  intoleranceNotes?: string;
  hasDislikedFoods?: boolean;
  dislikedFoodsText?: string;
  mealsPerDay?: MealsPerDay;

  // Safety & Consent
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

  // RepDB & Master Library Integration fields
  startImage?: string;
  peakImage?: string;
  mainImage?: string;
  rawEquipment?: string;
  rawPrimaryMuscles?: string[];
  rawSecondaryMuscles?: string[];
  category?: "strength" | "stretching" | "cardio" | "plyometrics" | "olympic";
  mechanic?: "compound" | "isolation";
  forceType?: "push" | "pull" | "static" | "hinge";
  bodyPart?: string;
  tips?: string[];
  goals?: string[];
  tags?: string[];
  isBodyweight?: boolean;
  isUnilateral?: boolean;
  reviewStatus?: "approved" | "pending_review" | "rejected";
  sourceProvider?: string;
  sourceVersion?: string;
  attribution?: string;
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
  image?: string;
  startImage?: string;
  peakImage?: string;
  mainImage?: string;
  attribution?: string;
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

export interface WorkoutTemplateExercise {
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

export interface WorkoutTemplateSession {
  dayNumber: number;
  dayName: string;
  title: string;
  focusMuscles: MuscleGroup[];
  estimatedDuration: number;
  isRestDay: boolean;
  warmupMinutes: number;
  exercises: WorkoutTemplateExercise[];
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  description: string;
  goals: Goal[];
  fitnessLevels: FitnessLevel[];
  requiredEquipment: EquipmentOption[];
  location: WorkoutLocation;
  daysPerWeek: number[];
  split: WorkoutSplit;
  durationMinutes: number;
  safeForRestrictions: RestrictionType[];
  warmupRoutine: string[];
  recoveryRules: string[];
  reviewStatus: "approved" | "pending_review" | "rejected";
  reviewer: string;
  approvedAt: string;
  sessions: WorkoutTemplateSession[];
}

