/**
 * Workout Sports-Science Math Utilities
 * Covers plate loading calculations, double progression algorithms, and deload adjustments.
 */

export interface PlateLoadResult {
  platesPerSide: number[];
  totalAchieved: number;
  remainder: number;
  isExact: boolean;
}

export const STANDARD_OLYMPIC_PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];

/**
 * Calculates symmetric plates required per side of an Olympic barbell.
 */
export function calculatePlateLoad(
  targetWeight: number,
  barWeight: number = 20,
  availablePlates: number[] = STANDARD_OLYMPIC_PLATES_KG
): PlateLoadResult {
  if (targetWeight <= 0 || isNaN(targetWeight)) {
    return { platesPerSide: [], totalAchieved: 0, remainder: 0, isExact: false };
  }

  if (targetWeight <= barWeight) {
    return { platesPerSide: [], totalAchieved: barWeight, remainder: 0, isExact: targetWeight === barWeight };
  }

  let weightToDistributePerSide = (targetWeight - barWeight) / 2;
  const sortedPlates = [...availablePlates].sort((a, b) => b - a);
  const platesPerSide: number[] = [];

  for (const plate of sortedPlates) {
    while (weightToDistributePerSide >= plate - 0.001) {
      platesPerSide.push(plate);
      weightToDistributePerSide -= plate;
    }
  }

  const distributedPerSide = platesPerSide.reduce((sum, p) => sum + p, 0);
  const totalAchieved = barWeight + distributedPerSide * 2;
  const remainder = Math.round((targetWeight - totalAchieved) * 100) / 100;

  return {
    platesPerSide,
    totalAchieved: Math.round(totalAchieved * 100) / 100,
    remainder,
    isExact: Math.abs(remainder) < 0.01
  };
}

export interface DoubleProgressionEvaluation {
  shouldIncrease: boolean;
  nextWeight: number;
  reason: string;
}

/**
 * Evaluates whether an athlete should progress load, maintain, or deload based on double progression.
 */
export function evaluateDoubleProgression(
  currentWeight: number,
  repBracket: [number, number], // e.g. [8, 12]
  loggedReps: number[],
  increment: number = 2.5
): DoubleProgressionEvaluation {
  const [minReps, maxReps] = repBracket;

  if (!loggedReps || loggedReps.length === 0) {
    return {
      shouldIncrease: false,
      nextWeight: currentWeight,
      reason: "No working sets logged."
    };
  }

  // All sets hit or exceeded top of bracket -> step up weight
  const allHitTop = loggedReps.every((r) => r >= maxReps);
  if (allHitTop) {
    return {
      shouldIncrease: true,
      nextWeight: Math.round((currentWeight + increment) * 10) / 10,
      reason: `All sets reached or exceeded top of target rep bracket (${maxReps} reps). Increased load by +${increment}kg.`
    };
  }

  // Any set fell below floor of bracket -> hold current weight to solidify base
  const anyBelowFloor = loggedReps.some((r) => r < minReps);
  if (anyBelowFloor) {
    return {
      shouldIncrease: false,
      nextWeight: currentWeight,
      reason: `At least one set fell below minimum rep target (${minReps} reps). Maintain load until all sets meet baseline.`
    };
  }

  // In the bracket but haven't capped all sets yet -> accumulate reps
  return {
    shouldIncrease: false,
    nextWeight: currentWeight,
    reason: `Reps are within target bracket (${minReps}–${maxReps}). Strive to add reps on remaining sets before increasing weight.`
  };
}

export interface DeloadRecommendation {
  deloadSets: number;
  deloadWeight: number;
  intensityFactor: number;
  volumeReductionPercent: number;
}

/**
 * Calculates active recovery deload volume and intensity.
 * Sports-science standard: 40-50% volume reduction, 10-15% intensity reduction.
 */
export function calculateDeloadProtocol(
  workingSets: number,
  workingWeight: number,
  consecutiveRPEHigh: boolean = false
): DeloadRecommendation {
  const intensityReduction = consecutiveRPEHigh ? 0.15 : 0.10;
  const deloadWeight = Math.round(workingWeight * (1 - intensityReduction) * 2) / 2; // round to 0.5kg
  const deloadSets = Math.max(1, Math.round(workingSets * 0.55)); // 45% volume reduction

  return {
    deloadSets,
    deloadWeight,
    intensityFactor: 1 - intensityReduction,
    volumeReductionPercent: 45
  };
}
