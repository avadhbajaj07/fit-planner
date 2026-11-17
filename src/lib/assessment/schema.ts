import { z } from "zod";
import { AssessmentAnswers } from "../engine/types";

export const AssessmentSchema = z.object({
  // Section 1
  gender: z.enum(["male", "female", "prefer_not_to_say"]).optional(),
  age: z
    .number()
    .min(18, { message: "FIT Planner is designed for adults 18 and older." })
    .max(100, { message: "Please enter a valid age." })
    .optional(),
  ageBracket: z.enum(["18_29", "30_39", "40_49", "50_plus"]).optional(),
  goal: z
    .enum([
      "lose_weight",
      "build_muscle",
      "gain_weight",
      "improve_fitness",
      "maintain"
    ])
    .optional(),
  fitnessLevel: z
    .enum(["complete_beginner", "beginner", "intermediate", "advanced"])
    .optional(),

  // Section 2
  heightCm: z.number().min(100).max(250).optional(),
  heightFeet: z.number().min(3).max(8).optional(),
  heightInches: z.number().min(0).max(11).optional(),
  isHeightImperial: z.boolean().optional(),
  weightKg: z.number().min(30).max(300).optional(),
  isWeightImperial: z.boolean().optional(),
  targetWeightKg: z.number().min(30).max(300).optional(),
  bodyShape: z
    .enum(["slender", "average", "heavy", "very_heavy", "not_sure"])
    .optional(),
  estimatedBodyFat: z.number().min(5).max(50).optional(),

  // Section 3
  location: z.enum(["home", "gym", "both"]).optional(),
  equipment: z
    .array(
      z.enum([
        "bodyweight",
        "dumbbells",
        "resistance_bands",
        "basic_home_gym",
        "fully_equipped_gym"
      ])
    )
    .optional(),
  daysPerWeek: z.number().min(2).max(6).optional(),
  durationMinutes: z.number().min(20).max(90).optional(),

  // Section 4
  dailyActivity: z
    .enum(["mostly_sitting", "lightly_active", "moderately_active", "very_active"])
    .optional(),
  sleepHours: z
    .enum(["less_than_6", "6_to_7", "7_to_8", "more_than_8"])
    .optional(),
  restrictions: z
    .array(z.enum(["none", "back", "knee", "shoulder", "other"]))
    .optional(),
  restrictionNotes: z.string().max(300).optional(),
  dietType: z
    .enum(["vegetarian", "vegan", "non_vegetarian", "pescatarian", "flexible"])
    .optional(),

  // Section 5
  muscleFocus: z
    .array(
      z.enum(["chest", "back", "shoulders", "arms", "legs", "core", "full_body"])
    )
    .optional(),
  fitnessChallenge: z
    .enum([
      "lack_of_time",
      "lack_of_motivation",
      "no_plan",
      "lack_of_knowledge",
      "staying_consistent"
    ])
    .optional(),
  currentFrequency: z
    .enum(["never", "occasionally", "1_2_days", "3_4_days", "5_plus_days"])
    .optional(),

  // Section 6
  foodIntolerances: z
    .array(z.enum(["none", "lactose", "gluten", "nuts", "other", "not_sure"]))
    .optional(),
  intoleranceNotes: z.string().max(300).optional(),
  hasDislikedFoods: z.boolean().optional(),
  dislikedFoodsText: z.string().max(300).optional(),
  mealsPerDay: z.enum(["2", "3", "4", "5_plus", "not_sure"]).optional(),

  // Consent
  healthConsentGiven: z.boolean().optional(),
  healthConsentTimestamp: z.string().optional()
});

const STORAGE_KEY = "fit_planner_assessment_state";

export function loadAssessmentProgress(): AssessmentAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load assessment progress", e);
    return {};
  }
}

export function saveAssessmentProgress(answers: AssessmentAnswers): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch (e) {
    console.error("Failed to save assessment progress", e);
  }
}

export function clearAssessmentProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
