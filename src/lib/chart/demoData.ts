/**
 * FIT Planner — Illustrative Demo Dataset
 *
 * NOTE: This dataset is purely illustrative for product demonstration purposes.
 * It does NOT represent real member data or guaranteed individual outcomes.
 * In compliance with sports-science communication standards:
 * - Label: "Illustrative example — not real member data"
 * - Comparison: "Example baseline" (neutral reference point)
 * - Metric cards are marked as example data.
 */

import { StrengthPoint, StrengthChartMetrics } from "./types";

export const DEMO_PRIMARY_SERIES: StrengthPoint[] = [
  { week: 1, value: 80.0 },
  { week: 2, value: 82.5 },
  { week: 3, value: 85.0 },
  { week: 4, value: 85.0 }, // Mid-block adaptation / deload week
  { week: 5, value: 87.5 },
  { week: 6, value: 90.0 },
  { week: 7, value: 92.5 },
  { week: 8, value: 92.5 }, // Scheduled consolidation
  { week: 9, value: 95.0 },
  { week: 10, value: 97.5 },
  { week: 11, value: 100.0 },
  { week: 12, value: 102.5 }
];

export const DEMO_COMPARISON_SERIES: StrengthPoint[] = [
  { week: 1, value: 80.0 },
  { week: 2, value: 80.0 },
  { week: 3, value: 82.5 },
  { week: 4, value: 82.5 },
  { week: 5, value: 82.5 },
  { week: 6, value: 85.0 },
  { week: 7, value: 85.0 },
  { week: 8, value: 85.0 },
  { week: 9, value: 85.0 },
  { week: 10, value: 87.5 },
  { week: 11, value: 87.5 },
  { week: 12, value: 87.5 }
];

export const DEMO_METRICS: StrengthChartMetrics = {
  volume: {
    value: "48,250",
    unit: "kg",
    label: "Training Volume",
    isExample: true
  },
  strengthChange: {
    value: "+22.5 kg",
    unit: "+28.1%",
    label: "Estimated Strength Change",
    changePct: 28.1,
    isExample: true
  },
  adherence: {
    value: "95%",
    label: "Workout Adherence",
    isExample: true
  }
};

export const DEMO_CHART_CONFIG = {
  metricLabel: "Estimated 1RM — Back Squat",
  unit: "kg" as const,
  disclaimer: "Illustrative example — not real member data",
  comparisonLabel: "Example baseline"
};
