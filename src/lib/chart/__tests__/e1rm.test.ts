import { describe, it, expect } from "vitest";
import {
  calculateEpleyE1RM,
  getWeeklyE1RMPoints,
  calculateTrainingVolume,
  calculateStrengthChange,
  calculateAdherence,
  buildChartPaths,
  WorkoutSetLog
} from "../e1rm";
import { validateStrengthData, StrengthPoint } from "../types";
import { DEMO_PRIMARY_SERIES, DEMO_COMPARISON_SERIES } from "../demoData";

describe("Epley e1RM Sports-Science Math", () => {
  it("calculates accurate 1RM for 1 rep (true 1RM equals weight)", () => {
    expect(calculateEpleyE1RM(100, 1)).toBe(100);
    expect(calculateEpleyE1RM(82.5, 1)).toBe(82.5);
  });

  it("calculates e1RM accurately for working sets <= 10 reps", () => {
    // 100kg for 5 reps: 100 * (1 + 5/30) = 100 * (1.16666...) = 116.7 kg
    expect(calculateEpleyE1RM(100, 5)).toBe(116.7);

    // 80kg for 10 reps: 80 * (1 + 10/30) = 80 * (1.33333...) = 106.7 kg
    expect(calculateEpleyE1RM(80, 10)).toBe(106.7);
  });

  it("rejects sets > 10 reps to prevent high-rep fatigue bias", () => {
    expect(calculateEpleyE1RM(100, 11)).toBeNull();
    expect(calculateEpleyE1RM(60, 20)).toBeNull();
  });

  it("rejects invalid, negative, or zero inputs", () => {
    expect(calculateEpleyE1RM(0, 5)).toBeNull();
    expect(calculateEpleyE1RM(-50, 5)).toBeNull();
    expect(calculateEpleyE1RM(100, 0)).toBeNull();
    expect(calculateEpleyE1RM(NaN, 5)).toBeNull();
  });
});

describe("Weekly e1RM Point Extraction & Gap Preservation", () => {
  const sampleLogs: WorkoutSetLog[] = [
    // Week 1: 80kg x 5 reps -> e1RM = 93.3 kg
    { week: 1, exerciseId: "squat", weight: 80, reps: 5, completed: true, isWorkingSet: true },
    // Week 1 second set higher: 85kg x 5 reps -> e1RM = 99.2 kg (should pick best)
    { week: 1, exerciseId: "squat", weight: 85, reps: 5, completed: true, isWorkingSet: true },
    // Week 1 warmup (should ignore):
    { week: 1, exerciseId: "squat", weight: 50, reps: 10, completed: true, isWorkingSet: false },

    // Week 2: uncompleted set (should ignore):
    { week: 2, exerciseId: "squat", weight: 90, reps: 5, completed: false, isWorkingSet: true },

    // Week 3: high reps > 10 (should ignore):
    { week: 3, exerciseId: "squat", weight: 60, reps: 15, completed: true, isWorkingSet: true },

    // Week 4: 90kg x 3 reps -> e1RM = 90 * (1 + 0.1) = 99.0 kg
    { week: 4, exerciseId: "squat", weight: 90, reps: 3, completed: true, isWorkingSet: true },

    // Different exercise (bench): should ignore
    { week: 4, exerciseId: "bench", weight: 120, reps: 5, completed: true, isWorkingSet: true }
  ];

  it("extracts best qualifying e1RM and preserves gaps for unlogged weeks", () => {
    const points = getWeeklyE1RMPoints(sampleLogs, "squat", 6);
    expect(points.length).toBe(6);

    // Week 1 should be the best qualifying set (99.2 kg)
    expect(points[0].week).toBe(1);
    expect(points[0].value).toBe(99.2);

    // Week 2 has only incomplete sets -> null (gap)
    expect(points[1].week).toBe(2);
    expect(points[1].value).toBeNull();

    // Week 3 has only >10 reps -> null (gap)
    expect(points[2].week).toBe(3);
    expect(points[2].value).toBeNull();

    // Week 4 has qualifying set (99.0 kg)
    expect(points[3].week).toBe(4);
    expect(points[3].value).toBe(99.0);

    // Weeks 5 and 6 have no logs -> null (gap)
    expect(points[4].value).toBeNull();
    expect(points[5].value).toBeNull();
  });
});

describe("Metrics Calculation", () => {
  it("computes total training volume accurately", () => {
    const logs: WorkoutSetLog[] = [
      { week: 1, exerciseId: "squat", weight: 100, reps: 5, completed: true, isWorkingSet: true }, // 500
      { week: 1, exerciseId: "squat", weight: 100, reps: 5, completed: true, isWorkingSet: true }, // 500
      { week: 1, exerciseId: "squat", weight: 100, reps: 5, completed: false, isWorkingSet: true } // skipped
    ];
    expect(calculateTrainingVolume(logs)).toBe(1000);
  });

  it("calculates strength change between first and last logged weeks", () => {
    const points: StrengthPoint[] = [
      { week: 1, value: 80 },
      { week: 2, value: null },
      { week: 3, value: 85 },
      { week: 4, value: 100 }
    ];
    const change = calculateStrengthChange(points);
    expect(change).not.toBeNull();
    expect(change?.delta).toBe(20);
    expect(change?.percent).toBe(25);
    expect(change?.firstWeek).toBe(1);
    expect(change?.lastWeek).toBe(4);
  });

  it("returns null for strength change if fewer than 2 data points exist", () => {
    const emptyPoints: StrengthPoint[] = [
      { week: 1, value: null },
      { week: 2, value: 80 },
      { week: 3, value: null }
    ];
    expect(calculateStrengthChange(emptyPoints)).toBeNull();
  });

  it("calculates adherence clamped between 0 and 100%", () => {
    expect(calculateAdherence(10, 10)).toBe(100);
    expect(calculateAdherence(9, 10)).toBe(90);
    expect(calculateAdherence(12, 10)).toBe(100); // capped at 100%
    expect(calculateAdherence(0, 10)).toBe(0);
  });
});

describe("Gap-Safe SVG Path Generation", () => {
  it("creates disconnected path segments across data gaps and never interpolates", () => {
    const pointsWithGap: StrengthPoint[] = [
      { week: 1, value: 80 },
      { week: 2, value: 85 },
      { week: 3, value: null }, // GAP
      { week: 4, value: 90 },
      { week: 5, value: 95 }
    ];

    const result = buildChartPaths(
      pointsWithGap,
      600,
      300,
      { top: 20, right: 20, bottom: 40, left: 40 },
      70,
      100
    );

    // Must have 2 distinct segments
    expect(result.segments.length).toBe(2);
    // Line path should contain 2 "M" commands (one for each segment)
    const mCount = (result.linePath.match(/M/g) || []).length;
    expect(mCount).toBe(2);

    // Week 3 coordinate y must be null
    expect(result.coordinates[2].y).toBeNull();
  });

  it("builds a single continuous path when all weeks have data", () => {
    const result = buildChartPaths(
      DEMO_PRIMARY_SERIES,
      600,
      300,
      { top: 20, right: 20, bottom: 40, left: 40 },
      70,
      110
    );

    expect(result.segments.length).toBe(1);
    const mCount = (result.linePath.match(/M/g) || []).length;
    expect(mCount).toBe(1);
    expect(result.coordinates.length).toBe(12);
  });
});

describe("Data Validation", () => {
  it("validates demo datasets successfully", () => {
    const res = validateStrengthData(DEMO_PRIMARY_SERIES, DEMO_COMPARISON_SERIES, "kg");
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
    expect(res.sanitizedPrimary.length).toBe(12);
    expect(res.sanitizedComparison?.length).toBe(12);
  });

  it("catches invalid unit, non-finite values, and sanitizes output", () => {
    const invalidPoints: StrengthPoint[] = [
      { week: 1, value: 80 },
      { week: 15, value: 100 }, // out of range week
      { week: 2, value: -50 } // negative value
    ];

    const res = validateStrengthData(invalidPoints, undefined, "stones");
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("Invalid unit"))).toBe(true);
    expect(res.sanitizedPrimary.length).toBe(12); // Sanitized to 12 weeks
    expect(res.sanitizedPrimary[0].value).toBe(80);
    expect(res.sanitizedPrimary[1].value).toBeNull(); // Negative value converted to null
  });
});
