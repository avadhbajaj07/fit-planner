import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  MASTER_EXERCISE_LIBRARY,
  REPDB_ATTRIBUTION,
  getExerciseById,
  filterMasterExercises
} from "../../data/exerciseLibrary";
import {
  APPROVED_WORKOUT_TEMPLATES,
  matchApprovedTemplate
} from "../templates";
import { generateWorkoutPlan } from "../recommendation";
import { AssessmentAnswers } from "../types";

describe("Master Exercise Library & RepDB Integration", () => {
  it("contains 708 exercises imported from RepDB", () => {
    expect(MASTER_EXERCISE_LIBRARY.length).toBe(708);
  });

  it("contains proper RepDB attribution compliant with Free Tier license", () => {
    expect(REPDB_ATTRIBUTION.label).toBe("Exercise data by RepDB (repdb.co)");
    expect(REPDB_ATTRIBUTION.url).toBe("https://repdb.co");
    expect(REPDB_ATTRIBUTION.totalCount).toBe(708);
  });

  it("verifies that all referenced WebP illustrations exist on disk in public/images/flat", () => {
    const publicDir = path.resolve(process.cwd(), "public");

    let verifiedCount = 0;
    for (const ex of MASTER_EXERCISE_LIBRARY) {
      if (ex.startImage) {
        const fullPath = path.join(publicDir, ex.startImage);
        expect(fs.existsSync(fullPath)).toBe(true);
        verifiedCount++;
      }
      if (ex.peakImage) {
        const fullPath = path.join(publicDir, ex.peakImage);
        expect(fs.existsSync(fullPath)).toBe(true);
        verifiedCount++;
      }
      if (ex.mainImage && !ex.startImage && !ex.peakImage) {
        const fullPath = path.join(publicDir, ex.mainImage);
        expect(fs.existsSync(fullPath)).toBe(true);
        verifiedCount++;
      }
    }

    expect(verifiedCount).toBeGreaterThanOrEqual(708);
  });

  it("supports exercises with two illustrations (start + peak) and single illustration (main)", () => {
    const twoImageEx = MASTER_EXERCISE_LIBRARY.filter(
      (e) => e.startImage && e.peakImage
    );
    const singleImageEx = MASTER_EXERCISE_LIBRARY.filter(
      (e) => e.mainImage && !e.startImage && !e.peakImage
    );

    expect(twoImageEx.length).toBe(523);
    expect(singleImageEx.length).toBe(185);
  });

  it("filters master exercises by primary muscle, equipment, difficulty, and home-only flag", () => {
    const chestExercises = filterMasterExercises({ primaryMuscle: "chest" });
    expect(chestExercises.length).toBeGreaterThan(20);
    expect(chestExercises.every((e) => e.primaryMuscles.includes("chest"))).toBe(true);

    const bodyweightOnly = filterMasterExercises({ isBodyweightOnly: true });
    expect(bodyweightOnly.length).toBeGreaterThan(100);
    expect(
      bodyweightOnly.every(
        (e) => e.isBodyweight || e.equipmentNeeded.includes("bodyweight")
      )
    ).toBe(true);

    const homeOnly = filterMasterExercises({ isHomeOnly: true });
    // Home-only must never include gym machines or barbell-exclusive items
    const hasGymExclusives = homeOnly.some(
      (e) => e.equipmentNeeded.length === 1 && e.equipmentNeeded[0] === "fully_equipped_gym"
    );
    expect(hasGymExclusives).toBe(false);
  });

  it("finds exercise by id with case and hyphen/underscore insensitivity", () => {
    const pushUp = getExerciseById("push-up");
    expect(pushUp).toBeDefined();
    expect(pushUp?.name.toLowerCase()).toContain("push");

    const pushUpUnderscore = getExerciseById("push_up");
    expect(pushUpUnderscore).toBeDefined();

    const arnold = getExerciseById("arnold-press");
    expect(arnold).toBeDefined();
    expect(arnold?.equipmentNeeded).toContain("dumbbells");
  });
});

describe("Approved Workout Templates & Personalization Matching", () => {
  it("has clinically vetted approved templates for home and gym splits", () => {
    expect(APPROVED_WORKOUT_TEMPLATES.length).toBeGreaterThanOrEqual(6);
    expect(
      APPROVED_WORKOUT_TEMPLATES.every((t) => t.reviewStatus === "approved")
    ).toBe(true);
  });

  it("matches home bodyweight profile to beginner calisthenics template", () => {
    const template = matchApprovedTemplate({
      goal: "improve_fitness",
      fitnessLevel: "beginner",
      location: "home",
      equipment: ["bodyweight"],
      daysPerWeek: 3,
      restrictions: ["none"]
    });

    expect(template.id).toBe("template_beginner_home_bodyweight");
    expect(template.requiredEquipment).toContain("bodyweight");
    // Verify no gym machinery in template exercises
    const allEx = template.sessions.flatMap((s) => s.exercises);
    expect(allEx.every((e) => e.equipmentNeeded === "bodyweight")).toBe(true);
  });

  it("matches home dumbbells profile to dumbbell full-body template", () => {
    const template = matchApprovedTemplate({
      goal: "build_muscle",
      fitnessLevel: "intermediate",
      location: "home",
      equipment: ["dumbbells"],
      daysPerWeek: 3,
      restrictions: ["none"]
    });

    expect(template.id).toBe("template_beginner_home_dumbbells");
    expect(template.requiredEquipment).toContain("dumbbells");
  });

  it("matches commercial gym profile to gym full-body or PPL template", () => {
    const templatePpl = matchApprovedTemplate({
      goal: "build_muscle",
      fitnessLevel: "intermediate",
      location: "gym",
      equipment: ["fully_equipped_gym"],
      daysPerWeek: 5,
      restrictions: ["none"]
    });

    expect(templatePpl.id).toBe("template_intermediate_gym_ppl");
    expect(templatePpl.split).toBe("push_pull_legs");
  });

  it("prioritizes knee-safe protocol when knee restriction is reported", () => {
    const template = matchApprovedTemplate({
      goal: "improve_fitness",
      fitnessLevel: "beginner",
      location: "home",
      equipment: ["dumbbells"],
      daysPerWeek: 3,
      restrictions: ["knee"]
    });

    expect(template.id).toBe("template_knee_safe_protocol");
    expect(template.safeForRestrictions).toContain("knee");
  });

  it("prioritizes back-safe protocol when lower back restriction is reported", () => {
    const template = matchApprovedTemplate({
      goal: "build_muscle",
      fitnessLevel: "beginner",
      location: "home",
      equipment: ["dumbbells"],
      daysPerWeek: 3,
      restrictions: ["back"]
    });

    expect(template.id).toBe("template_back_safe_protocol");
    expect(template.safeForRestrictions).toContain("back");
  });

  it("prioritizes shoulder-safe protocol when shoulder restriction is reported", () => {
    const template = matchApprovedTemplate({
      goal: "build_muscle",
      fitnessLevel: "intermediate",
      location: "home",
      equipment: ["dumbbells"],
      daysPerWeek: 3,
      restrictions: ["shoulder"]
    });

    expect(template.id).toBe("template_shoulder_safe_protocol");
    expect(template.safeForRestrictions).toContain("shoulder");
  });

  it("enriches generated plan exercises with RepDB WebP illustration paths", () => {
    const answers: AssessmentAnswers = {
      goal: "build_muscle",
      fitnessLevel: "beginner",
      location: "home",
      equipment: ["dumbbells", "bodyweight"],
      daysPerWeek: 3,
      durationMinutes: 40,
      restrictions: ["none"]
    };

    const plan = generateWorkoutPlan(answers);
    const activeSessions = plan.weeklySessions.filter((s) => !s.isRestDay);
    expect(activeSessions.length).toBe(3);

    for (const session of activeSessions) {
      expect(session.exercises.length).toBeGreaterThanOrEqual(3);
      for (const ex of session.exercises) {
        expect(ex.image).toBeDefined();
        expect(ex.image?.endsWith(".webp")).toBe(true);
        expect(ex.attribution).toBe("Exercise data by RepDB (repdb.co)");
      }
    }
  });
});
