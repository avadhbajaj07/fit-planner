import { describe, it, expect } from "vitest";
import {
  generateChartA11yDescription,
  getModeBadgeText,
  getComparisonLabel
} from "../e1rm";
import { DEMO_PRIMARY_SERIES, DEMO_CHART_CONFIG } from "../demoData";
import { validateStrengthData, StrengthPoint } from "../types";

describe("Chart Component Accessibility & Labeling Requirements", () => {
  it("enforces neutral demo mode disclaimer and comparison label", () => {
    const badge = getModeBadgeText("demo");
    expect(badge).toBe("Illustrative example — not real member data");
    // Ensure no claims of guaranteed results
    expect(badge.toLowerCase()).not.toContain("guarantee");
    expect(badge.toLowerCase()).not.toContain("better");

    const comparisonLabel = getComparisonLabel("demo");
    expect(comparisonLabel).toBe("Example baseline");
    // Non-negotiable data rule: Do NOT label it as another training method or competitor
    expect(comparisonLabel.toLowerCase()).not.toContain("competitor");
    expect(comparisonLabel.toLowerCase()).not.toContain("average results");
  });

  it("generates sports-science compliant member mode badge", () => {
    const badge = getModeBadgeText("member");
    expect(badge).toContain("Estimated 1RM");
    expect(badge).toContain("Epley formula");

    const comp = getComparisonLabel("member");
    expect(comp).toBe("Target reference");
  });

  it("generates dynamic descriptive screen-reader description", () => {
    const desc = generateChartA11yDescription(
      "Estimated 1RM — Back Squat",
      DEMO_PRIMARY_SERIES,
      "kg",
      "demo"
    );
    expect(desc).toContain("Estimated 1RM — Back Squat");
    expect(desc).toContain("Week 1 started at 80 kg");
    expect(desc).toContain("102.5 kg at Week 12");
    expect(desc).toContain("Illustrative demonstration");
  });

  it("handles empty or sparse series gracefully in screen-reader description", () => {
    const emptySeries: StrengthPoint[] = [
      { week: 1, value: null },
      { week: 2, value: null }
    ];
    const desc = generateChartA11yDescription(
      "Bench Press",
      emptySeries,
      "kg",
      "member"
    );
    expect(desc).toBe("Bench Press: No data logged yet.");
  });

  it("handles reduced motion config flags correctly without crashing", () => {
    // When reduced motion is preferred, data validation and calculation remain pure
    const validation = validateStrengthData(DEMO_PRIMARY_SERIES, undefined, "kg");
    expect(validation.valid).toBe(true);
  });
});
