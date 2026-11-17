import { AssessmentAnswers } from "../engine/types";

const STORAGE_KEY = "fit_planner_assessment_state";

export function loadAssessmentProgress(): AssessmentAnswers {
  if (typeof window === "undefined") {
    return {
      gender: "prefer_not_to_say",
      age: 28,
      goal: "build_muscle",
      fitnessLevel: "beginner",
      location: "home",
      equipment: ["dumbbells", "bodyweight"],
      daysPerWeek: 3,
      durationMinutes: 45,
      restrictions: ["none"]
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        gender: "prefer_not_to_say",
        age: 28,
        goal: "build_muscle",
        fitnessLevel: "beginner",
        location: "home",
        equipment: ["dumbbells", "bodyweight"],
        daysPerWeek: 3,
        durationMinutes: 45,
        restrictions: ["none"]
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load assessment progress", e);
    return {
      gender: "prefer_not_to_say",
      age: 28,
      goal: "build_muscle",
      fitnessLevel: "beginner",
      location: "home",
      equipment: ["dumbbells", "bodyweight"],
      daysPerWeek: 3,
      durationMinutes: 45,
      restrictions: ["none"]
    };
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
