/**
 * FIT Planner — Animated Strength Progress Chart Types & Validation
 * Strict TypeScript: no `any`
 */

export type ChartMode = "demo" | "member";

export interface StrengthPoint {
  week: number; // 1–12
  value: number | null; // null = no data logged that week (render a gap, never interpolate silently)
}

export interface MetricValue {
  value: string | number;
  label: string;
  unit?: string;
  changePct?: number;
  isExample?: boolean;
}

export interface StrengthChartMetrics {
  volume?: MetricValue;
  strengthChange?: MetricValue;
  adherence?: MetricValue;
}

export interface StrengthChartProps {
  mode: ChartMode;
  primary: StrengthPoint[]; // turquoise series (#22D3C5)
  comparison?: StrengthPoint[]; // grey series (#AAB4B8)
  unit: "kg" | "lb"; // single unit for the whole chart
  metricLabel: string; // e.g. "Estimated 1RM — Back Squat"
  metrics?: StrengthChartMetrics;
  className?: string;
  loop?: boolean; // Continuous loop playback
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedPrimary: StrengthPoint[];
  sanitizedComparison?: StrengthPoint[];
}

/**
 * Validates inputs according to sports-science strict requirements:
 * - Exactly weeks 1–12, sorted, finite non-negative numbers, or null for gaps.
 * - Consistent unit ("kg" | "lb").
 * - Fails gracefully with sanitized data or fallback empty state.
 */
export function validateStrengthData(
  primary: StrengthPoint[],
  comparison?: StrengthPoint[],
  unit?: string
): ValidationResult {
  const errors: string[] = [];

  if (unit !== "kg" && unit !== "lb") {
    errors.push(`Invalid unit "${unit}". Unit must be "kg" or "lb".`);
  }

  const sanitizeSeries = (series: StrengthPoint[], seriesName: string): StrengthPoint[] => {
    if (!Array.isArray(series) || series.length === 0) {
      errors.push(`${seriesName} series must be a non-empty array.`);
      return [];
    }

    const seenWeeks = new Set<number>();
    const map = new Map<number, number | null>();

    for (const pt of series) {
      if (typeof pt !== "object" || pt === null) {
        errors.push(`${seriesName} contains an invalid point entry.`);
        continue;
      }

      if (typeof pt.week !== "number" || !Number.isInteger(pt.week) || pt.week < 1 || pt.week > 12) {
        errors.push(`${seriesName} has invalid week "${pt.week}". Week must be an integer between 1 and 12.`);
        continue;
      }

      if (seenWeeks.has(pt.week)) {
        errors.push(`${seriesName} has duplicate data for week ${pt.week}.`);
      }
      seenWeeks.add(pt.week);

      if (pt.value !== null) {
        if (typeof pt.value !== "number" || !Number.isFinite(pt.value) || pt.value < 0) {
          errors.push(`${seriesName} week ${pt.week} has invalid value "${pt.value}". Must be a non-negative finite number or null.`);
          map.set(pt.week, null);
          continue;
        }
      }

      map.set(pt.week, pt.value);
    }

    // Build complete weeks 1–12, filling any unmentioned weeks with null
    const result: StrengthPoint[] = [];
    for (let w = 1; w <= 12; w++) {
      result.push({
        week: w,
        value: map.has(w) ? (map.get(w) ?? null) : null
      });
    }

    return result;
  };

  const sanitizedPrimary = sanitizeSeries(primary, "Primary");
  const sanitizedComparison = comparison ? sanitizeSeries(comparison, "Comparison") : undefined;

  return {
    valid: errors.length === 0,
    errors,
    sanitizedPrimary,
    sanitizedComparison
  };
}
