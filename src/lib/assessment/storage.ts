import { AssessmentAnswers } from "../engine/types";

const STORAGE_KEY = "fit_planner_assessment_state";

const DEFAULT_ANSWERS: AssessmentAnswers = {
  gender: "male",
  age: 28,
  ageBracket: "18_29",
  goal: "build_muscle",
  fitnessLevel: "beginner",
  heightCm: 178,
  weightKg: 78,
  targetWeightKg: 82,
  bodyShape: "average",
  estimatedBodyFat: 18,
  location: "gym",
  equipment: ["dumbbells", "bodyweight", "basic_home_gym"],
  daysPerWeek: 4,
  durationMinutes: 45,
  dailyActivity: "moderately_active",
  sleepHours: "7_to_8",
  restrictions: ["none"],
  dietType: "flexible",
  muscleFocus: ["chest", "arms", "core"],
  fitnessChallenge: "staying_consistent",
  currentFrequency: "1_2_days",
  foodIntolerances: ["none"],
  hasDislikedFoods: false,
  mealsPerDay: "3",
  healthConsentGiven: true
};

export function loadAssessmentProgress(): AssessmentAnswers {
  if (typeof window === "undefined") {
    return DEFAULT_ANSWERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_ANSWERS;
    }
    return { ...DEFAULT_ANSWERS, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Failed to load assessment progress", e);
    return DEFAULT_ANSWERS;
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
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear assessment progress", e);
  }
}
