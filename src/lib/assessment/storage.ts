import { AssessmentAnswers } from "../engine/types";
import { supabase } from "../supabase/client";

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
  location: "home",
  equipment: ["bodyweight"],
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

    // Optional background sync to Supabase if authenticated
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          syncAssessmentToSupabase(answers, user.id);
        }
      }).catch(() => {});
    }
  } catch (e) {
    console.error("Failed to save assessment progress", e);
  }
}

export async function syncAssessmentToSupabase(answers: AssessmentAnswers, userId: string): Promise<void> {
  if (!supabase || !userId) return;
  try {
    await supabase.from("member_assessments").upsert(
      {
        user_id: userId,
        version: "2.0",
        is_completed: true,
        gender: answers.gender || "male",
        age: answers.age || 28,
        age_bracket: answers.ageBracket || "18_29",
        goal: answers.goal || "improve_fitness",
        fitness_level: answers.fitnessLevel || "beginner",
        height_cm: answers.heightCm,
        weight_kg: answers.weightKg,
        target_weight_kg: answers.targetWeightKg,
        body_shape: answers.bodyShape,
        location: answers.location || "home",
        equipment: answers.equipment || ["bodyweight"],
        days_per_week: answers.daysPerWeek || 3,
        duration_minutes: answers.durationMinutes || 40,
        restrictions: answers.restrictions || ["none"],
        diet_type: answers.dietType || "flexible",
        muscle_focus: answers.muscleFocus || [],
        raw_answers_json: answers,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );
  } catch (err) {
    console.warn("Background sync of assessment to Supabase failed:", err);
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
