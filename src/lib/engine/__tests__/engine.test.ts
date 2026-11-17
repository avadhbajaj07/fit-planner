import { describe, it, expect } from "vitest";
import {
  generateWorkoutPlan,
  determineSplit,
  calculateExerciseCount
} from "../recommendation";
import { adjustSession } from "../adjustments";
import { AssessmentAnswers } from "../types";

describe("Fit Planner Recommendation Engine", () => {
  it("determines correct split based on training days and experience", () => {
    expect(determineSplit(2, "beginner")).toBe("full_body");
    expect(determineSplit(3, "beginner")).toBe("full_body");
    expect(determineSplit(4, "intermediate")).toBe("upper_lower");
    expect(determineSplit(5, "advanced")).toBe("push_pull_legs");
    expect(determineSplit(5, "complete_beginner")).toBe("upper_lower");
  });

  it("calculates appropriate exercise count based on session duration", () => {
    expect(calculateExerciseCount(20)).toBe(3);
    expect(calculateExerciseCount(30)).toBe(4);
    expect(calculateExerciseCount(45)).toBe(5);
    expect(calculateExerciseCount(60)).toBe(6);
  });

  it("is pure and deterministic: identical inputs yield identical plan structure", () => {
    const input: AssessmentAnswers = {
      gender: "male",
      age: 28,
      goal: "build_muscle",
      fitnessLevel: "intermediate",
      location: "home",
      equipment: ["dumbbells", "bodyweight"],
      daysPerWeek: 3,
      durationMinutes: 45,
      restrictions: ["none"]
    };

    const plan1 = generateWorkoutPlan(input);
    const plan2 = generateWorkoutPlan(input);

    expect(plan1.split).toBe(plan2.split);
    expect(plan1.daysPerWeek).toBe(plan2.daysPerWeek);
    expect(plan1.weeklySessions.length).toBe(7);
    expect(plan1.isRestrictedMode).toBe(false);

    // Verify session titles and exercise counts match exactly
    for (let i = 0; i < 7; i++) {
      expect(plan1.weeklySessions[i].title).toBe(plan2.weeklySessions[i].title);
      expect(plan1.weeklySessions[i].exercises.length).toBe(
        plan2.weeklySessions[i].exercises.length
      );
    }
  });

  it("activates restricted mode and excludes contraindicated exercises on knee restriction", () => {
    const inputWithKneeIssue: AssessmentAnswers = {
      goal: "lose_weight",
      fitnessLevel: "beginner",
      location: "home",
      equipment: ["bodyweight"],
      daysPerWeek: 3,
      durationMinutes: 30,
      restrictions: ["knee"]
    };

    const plan = generateWorkoutPlan(inputWithKneeIssue);

    expect(plan.isRestrictedMode).toBe(true);
    expect(plan.safetyNotice).toBeDefined();

    // Verify no exercises in any session have "knee" as contraindication
    const allExercises = plan.weeklySessions.flatMap((s) => s.exercises);
    const hasJumpingJacksOrSquats = allExercises.some(
      (e) => e.exerciseId === "jumping_jacks" || e.exerciseId === "bodyweight_squat"
    );
    expect(hasJumpingJacksOrSquats).toBe(false);
  });

  it("correctly applies 'Adjust my week' on-the-fly modifications", () => {
    const input: AssessmentAnswers = {
      goal: "build_muscle",
      fitnessLevel: "intermediate",
      daysPerWeek: 3,
      durationMinutes: 45,
      equipment: ["dumbbells"],
      restrictions: ["none"]
    };

    const plan = generateWorkoutPlan(input);
    const trainingSession = plan.weeklySessions.find((s) => !s.isRestDay)!;

    // 1. Short time (20 min)
    const shortSession = adjustSession(trainingSession, "short_time");
    expect(shortSession.estimatedDuration).toBe(20);
    expect(shortSession.exercises.length).toBeLessThanOrEqual(3);

    // 2. Low energy
    const lowEnergySession = adjustSession(trainingSession, "low_energy");
    expect(lowEnergySession.title).toContain("Deload");
    expect(lowEnergySession.exercises[0].restSeconds).toBeGreaterThan(
      trainingSession.exercises[0].restSeconds
    );

    // 3. Bodyweight only
    const bwSession = adjustSession(trainingSession, "bodyweight_only");
    expect(bwSession.title).toContain("Bodyweight");
    const nonBw = bwSession.exercises.filter(
      (e) => e.equipmentNeeded !== "bodyweight"
    );
    expect(nonBw.length).toBe(0);
  });
});
