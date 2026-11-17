import { z } from "zod";
import { AssessmentAnswers } from "../engine/types";

export const AssessmentSchema = z.object({
  gender: z.enum(["male", "female", "prefer_not_to_say"]).optional(),
  age: z
    .number()
    .min(18, { message: "FIT Planner is designed for adults 18 and older." })
    .max(100, { message: "Please enter a valid age." })
    .optional(),
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
  restrictions: z
    .array(z.enum(["none", "back", "knee", "shoulder", "other"]))
    .optional(),
  restrictionNotes: z.string().max(300).optional(),
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
