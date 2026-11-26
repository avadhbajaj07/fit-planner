import { describe, it, expect } from "vitest";
import {
  calculatePlateLoad,
  evaluateDoubleProgression,
  calculateDeloadProtocol
} from "../workoutMath";

describe("Plate Math Calculator", () => {
  it("returns empty plates if target weight is less than or equal to bar weight", () => {
    const res = calculatePlateLoad(20, 20);
    expect(res.platesPerSide).toEqual([]);
    expect(res.totalAchieved).toBe(20);
    expect(res.isExact).toBe(true);

    const under = calculatePlateLoad(15, 20);
    expect(under.platesPerSide).toEqual([]);
    expect(under.totalAchieved).toBe(20);
    expect(under.isExact).toBe(false);
  });

  it("calculates exact plates for standard 100kg barbell squat", () => {
    // 100kg total with 20kg bar = 80kg plates = 40kg per side (25 + 15 or 20 + 20)
    const res = calculatePlateLoad(100, 20);
    expect(res.totalAchieved).toBe(100);
    expect(res.isExact).toBe(true);
    expect(res.platesPerSide).toEqual([25, 15]);
  });

  it("calculates accurate fractional plate breakdown for 82.5kg bench press", () => {
    // 82.5kg with 20kg bar = 62.5kg plates = 31.25kg per side (25 + 5 + 1.25)
    const res = calculatePlateLoad(82.5, 20);
    expect(res.totalAchieved).toBe(82.5);
    expect(res.isExact).toBe(true);
    expect(res.platesPerSide).toEqual([25, 5, 1.25]);
  });

  it("handles non-exact weights gracefully with remainder reporting", () => {
    // 73.3kg cannot be exactly made with 1.25kg smallest plates
    const res = calculatePlateLoad(73.3, 20);
    expect(res.isExact).toBe(false);
    expect(res.totalAchieved).toBe(72.5);
    expect(res.remainder).toBeCloseTo(0.8, 1);
  });
});

describe("Double Progression Algorithm", () => {
  it("recommends weight increase when all sets hit or exceed the top of rep bracket", () => {
    const res = evaluateDoubleProgression(80, [8, 12], [12, 12, 12], 2.5);
    expect(res.shouldIncrease).toBe(true);
    expect(res.nextWeight).toBe(82.5);
    expect(res.reason).toContain("All sets reached or exceeded");
  });

  it("recommends maintaining load when sets are within bracket but not all at top", () => {
    const res = evaluateDoubleProgression(80, [8, 12], [12, 11, 10], 2.5);
    expect(res.shouldIncrease).toBe(false);
    expect(res.nextWeight).toBe(80);
    expect(res.reason).toContain("Strive to add reps");
  });

  it("flags failure to hit baseline floor when reps fall below bracket", () => {
    const res = evaluateDoubleProgression(80, [8, 12], [10, 8, 6], 2.5);
    expect(res.shouldIncrease).toBe(false);
    expect(res.nextWeight).toBe(80);
    expect(res.reason).toContain("fell below minimum rep target");
  });
});

describe("Deload Protocol Math", () => {
  it("calculates ~45% volume reduction and 10% intensity reduction for standard deload", () => {
    const res = calculateDeloadProtocol(4, 100, false);
    expect(res.deloadSets).toBe(2); // 4 * 0.55 = 2.2 -> 2
    expect(res.deloadWeight).toBe(90); // 100 * 0.9 = 90
    expect(res.volumeReductionPercent).toBe(45);
  });

  it("calculates 15% intensity reduction when consecutive high RPE is flagged", () => {
    const res = calculateDeloadProtocol(4, 100, true);
    expect(res.deloadSets).toBe(2);
    expect(res.deloadWeight).toBe(85); // 100 * 0.85 = 85
    expect(res.intensityFactor).toBe(0.85);
  });
});
