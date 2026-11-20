/**
 * FIT Planner — Sports-Science e1RM Math, Gap-Safe SVG Path Generator & Metric Helpers
 * Strict TypeScript: no `any`
 */

import { StrengthPoint } from "./types";

export interface WorkoutSetLog {
  week: number; // 1–12
  exerciseId: string;
  weight: number; // in kg or lb
  reps: number;
  completed: boolean;
  isWorkingSet: boolean;
}

/**
 * Calculates Estimated 1-Rep Max using the Epley formula:
 * e1RM = Weight × (1 + Reps / 30)
 *
 * Sports-Science Qualification Rules:
 * - Only qualifying sets: reps <= 10, completed = true, weight > 0
 * - Reps = 1 returns weight directly (true 1RM)
 * - Reps > 10 returns null (high-rep fatigue skew prevents accurate 1RM estimation)
 */
export function calculateEpleyE1RM(weight: number, reps: number): number | null {
  if (weight <= 0 || reps < 1 || reps > 10 || !Number.isFinite(weight) || !Number.isFinite(reps)) {
    return null;
  }
  if (reps === 1) {
    return Math.round(weight * 10) / 10;
  }
  const raw = weight * (1 + reps / 30);
  return Math.round(raw * 10) / 10;
}

/**
 * Extracts weekly e1RM data from logged workout sets for a specific exercise.
 * Missing or unqualified weeks remain `null` to render gaps without silent interpolation.
 */
export function getWeeklyE1RMPoints(
  logs: WorkoutSetLog[],
  exerciseId: string,
  totalWeeks = 12
): StrengthPoint[] {
  const weeklyBest = new Map<number, number>();

  for (const log of logs) {
    if (log.exerciseId !== exerciseId || !log.completed || !log.isWorkingSet) {
      continue;
    }
    if (log.week < 1 || log.week > totalWeeks) {
      continue;
    }

    const e1rm = calculateEpleyE1RM(log.weight, log.reps);
    if (e1rm !== null) {
      const existing = weeklyBest.get(log.week);
      if (existing === undefined || e1rm > existing) {
        weeklyBest.set(log.week, e1rm);
      }
    }
  }

  const result: StrengthPoint[] = [];
  for (let w = 1; w <= totalWeeks; w++) {
    result.push({
      week: w,
      value: weeklyBest.has(w) ? (weeklyBest.get(w) ?? null) : null
    });
  }
  return result;
}

/**
 * Total Training Volume = Σ(sets × reps × load) over all completed sets
 */
export function calculateTrainingVolume(logs: WorkoutSetLog[]): number {
  let total = 0;
  for (const set of logs) {
    if (set.completed && set.weight > 0 && set.reps > 0) {
      total += set.weight * set.reps;
    }
  }
  return Math.round(total);
}

/**
 * Estimated strength change: (last week e1RM − first week e1RM)
 * Returns null if fewer than 2 qualifying data points exist.
 */
export function calculateStrengthChange(
  points: StrengthPoint[]
): { delta: number; percent: number; firstWeek: number; lastWeek: number } | null {
  const valid = points.filter((p) => p.value !== null && Number.isFinite(p.value));
  if (valid.length < 2) {
    return null;
  }

  const first = valid[0];
  const last = valid[valid.length - 1];

  if (first.value === null || last.value === null || first.value <= 0) {
    return null;
  }

  const delta = Math.round((last.value - first.value) * 10) / 10;
  const percent = Math.round(((last.value - first.value) / first.value) * 1000) / 10;

  return {
    delta,
    percent,
    firstWeek: first.week,
    lastWeek: last.week
  };
}

/**
 * Workout adherence = completed ÷ planned workouts, % (0–100)
 */
export function calculateAdherence(completedWorkouts: number, plannedWorkouts: number): number {
  if (plannedWorkouts <= 0 || completedWorkouts <= 0) return 0;
  const ratio = (completedWorkouts / plannedWorkouts) * 100;
  return Math.min(100, Math.round(ratio));
}

export interface ChartCoordinates {
  week: number;
  value: number | null;
  x: number;
  y: number | null;
}

export interface PathBuilderResult {
  coordinates: ChartCoordinates[];
  linePath: string; // SVG path string with disconnected M... commands across gaps
  areaPath: string; // SVG path string with closed polygons under each segment
  segments: { line: string; area: string }[];
  minY: number;
  maxY: number;
}

/**
 * Builds SVG path definitions preserving data gaps.
 * Null values never interpolate silently; they produce broken path segments.
 */
export function buildChartPaths(
  points: StrengthPoint[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  customMinY?: number,
  customMaxY?: number
): PathBuilderResult {
  const chartWidth = Math.max(10, width - padding.left - padding.right);
  const chartHeight = Math.max(10, height - padding.top - padding.bottom);
  const baselineY = height - padding.bottom;

  // Determine value bounds
  const validValues = points
    .map((p) => p.value)
    .filter((v): v is number => v !== null && Number.isFinite(v));

  let minY = customMinY ?? (validValues.length > 0 ? Math.min(...validValues) : 0);
  let maxY = customMaxY ?? (validValues.length > 0 ? Math.max(...validValues) : 100);

  if (minY === maxY) {
    minY = Math.max(0, minY - 10);
    maxY = maxY + 10;
  }
  const ySpan = Math.max(1, maxY - minY);

  const coordinates: ChartCoordinates[] = points.map((p) => {
    // 12 weeks mapped to 0..11 intervals
    const x = padding.left + ((p.week - 1) / 11) * chartWidth;
    let y: number | null = null;
    if (p.value !== null && Number.isFinite(p.value)) {
      y = baselineY - ((p.value - minY) / ySpan) * chartHeight;
    }
    return {
      week: p.week,
      value: p.value,
      x: Math.round(x * 10) / 10,
      y: y !== null ? Math.round(y * 10) / 10 : null
    };
  });

  // Group continuous non-null segments
  const segments: { line: string; area: string }[] = [];
  let currentSegment: { x: number; y: number }[] = [];

  const flushSegment = () => {
    if (currentSegment.length === 0) return;
    if (currentSegment.length === 1) {
      // Single isolated point: small line segment
      const pt = currentSegment[0];
      const line = `M ${pt.x - 0.5} ${pt.y} L ${pt.x + 0.5} ${pt.y}`;
      const area = `M ${pt.x - 1} ${baselineY} L ${pt.x - 1} ${pt.y} L ${pt.x + 1} ${pt.y} L ${pt.x + 1} ${baselineY} Z`;
      segments.push({ line, area });
    } else {
      const lineParts = currentSegment.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`);
      const line = lineParts.join(" ");

      const first = currentSegment[0];
      const last = currentSegment[currentSegment.length - 1];
      const area = `${line} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
      segments.push({ line, area });
    }
    currentSegment = [];
  };

  for (const coord of coordinates) {
    if (coord.y !== null) {
      currentSegment.push({ x: coord.x, y: coord.y });
    } else {
      flushSegment();
    }
  }
  flushSegment();

  const linePath = segments.map((s) => s.line).join(" ");
  const areaPath = segments.map((s) => s.area).join(" ");

  return {
    coordinates,
    linePath,
    areaPath,
    segments,
    minY,
    maxY
  };
}

/**
 * Generates dynamic screen-reader accessibility description for the SVG chart
 */
export function generateChartA11yDescription(
  metricLabel: string,
  points: StrengthPoint[],
  unit: string,
  mode: "demo" | "member"
): string {
  const valid = points.filter((p) => p.value !== null);
  if (valid.length === 0) {
    return `${metricLabel}: No data logged yet.`;
  }
  const first = valid[0];
  const last = valid[valid.length - 1];
  const modeContext = mode === "demo" ? "Illustrative demonstration chart." : "Personal member workout log.";
  return `${modeContext} ${metricLabel} over 12 weeks in ${unit}. Week ${first.week} started at ${first.value} ${unit}, progressing to ${last.value} ${unit} at Week ${last.week} across ${valid.length} logged weeks.`;
}

export function getModeBadgeText(mode: "demo" | "member"): string {
  return mode === "demo"
    ? "Illustrative example — not real member data"
    : "Estimated 1RM (Epley formula: w × (1 + r/30))";
}

export function getComparisonLabel(mode: "demo" | "member"): string {
  return mode === "demo" ? "Example baseline" : "Target reference";
}
