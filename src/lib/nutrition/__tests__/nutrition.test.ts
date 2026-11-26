import { describe, it, expect } from "vitest";
import { filterEligibleMeals, generateDailyMealPlan } from "../filterEngine";
import { NutritionProfile } from "../types";
import { MEAL_DATABASE } from "../database";

describe("FIT Planner Nutrition & Allergen Filter Engine", () => {
  it("enforces strict hard allergen exclusion for dairy", () => {
    const profile: NutritionProfile = {
      dietType: "flexible",
      allergens: ["dairy"],
      dislikedFoods: [],
      mealsPerDay: 3,
      reviewerStatus: "general_guidance"
    };

    const eligible = filterEligibleMeals(MEAL_DATABASE, profile);

    // Verify none of the returned meals contain dairy in allergens
    expect(eligible.length).toBeGreaterThan(0);
    for (const meal of eligible) {
      expect(meal.allergens).not.toContain("dairy");
    }

    // Verify specifically that Greek Yogurt Bowl is excluded
    expect(eligible.some((m) => m.id === "bf_greek_yogurt_bowl")).toBe(false);
  });

  it("enforces strict hard allergen exclusion for nuts and gluten", () => {
    const profile: NutritionProfile = {
      dietType: "flexible",
      allergens: ["nuts", "gluten"],
      dislikedFoods: [],
      mealsPerDay: 3,
      reviewerStatus: "general_guidance"
    };

    const eligible = filterEligibleMeals(MEAL_DATABASE, profile);

    for (const meal of eligible) {
      expect(meal.allergens).not.toContain("nuts");
      expect(meal.allergens).not.toContain("gluten");
    }

    // Apple with almond butter should be excluded
    expect(eligible.some((m) => m.id === "snack_apple_almond_butter")).toBe(false);
    // Sourdough toast with smoked salmon should be excluded
    expect(eligible.some((m) => m.id === "bf_smoked_salmon_avocado_toast")).toBe(false);
  });

  it("strictly filters vegan diet ensuring no animal products or dairy/eggs/fish", () => {
    const profile: NutritionProfile = {
      dietType: "vegan",
      allergens: ["none"],
      dislikedFoods: [],
      mealsPerDay: 3,
      reviewerStatus: "general_guidance"
    };

    const eligible = filterEligibleMeals(MEAL_DATABASE, profile);

    expect(eligible.length).toBeGreaterThan(0);
    for (const meal of eligible) {
      expect(meal.dietaryTags).toContain("vegan");
    }

    // Chicken, Cod, Salmon, and Egg White omelet must NOT be present
    expect(eligible.some((m) => m.id === "lunch_herb_grilled_chicken")).toBe(false);
    expect(eligible.some((m) => m.id === "din_baked_cod_asparagus")).toBe(false);
    expect(eligible.some((m) => m.id === "bf_spinach_egg_white_omelet")).toBe(false);
  });

  it("filters out meals containing disliked ingredients", () => {
    const profile: NutritionProfile = {
      dietType: "flexible",
      allergens: ["none"],
      dislikedFoods: ["onion"],
      mealsPerDay: 3,
      reviewerStatus: "general_guidance"
    };

    const eligible = filterEligibleMeals(MEAL_DATABASE, profile);

    // Tofu scramble contains red onion, should be excluded
    expect(eligible.some((m) => m.id === "bf_tofu_scramble")).toBe(false);
  });

  it("generates daily meal plan with accurate macro sums and mandatory disclaimer", () => {
    const profile: NutritionProfile = {
      dietType: "flexible",
      allergens: ["none"],
      dislikedFoods: [],
      mealsPerDay: 3,
      reviewerStatus: "general_guidance"
    };

    const plan = generateDailyMealPlan(profile, "2026-11-17");

    expect(plan.meals.length).toBe(3);
    expect(plan.totalCalories).toBeGreaterThan(1000);
    expect(plan.totalProteinG).toBeGreaterThan(60);
    expect(plan.reviewerNotice).toContain("General Athletic Guidance Notice");
  });

  it("verifies entire database conforms to European athletic nutrition standard with zero Indian recipes", () => {
    // Assert zero Indian culinary keywords exist in names or descriptions
    const forbiddenKeywords = ["curry", "dahl", "garam masala", "paneer", "biryani", "masala"];

    for (const meal of MEAL_DATABASE) {
      const fullText = (meal.name + " " + meal.description + " " + meal.instructions.join(" ")).toLowerCase();
      for (const kw of forbiddenKeywords) {
        expect(fullText.includes(kw), `Meal "${meal.name}" should not contain Indian keyword "${kw}"`).toBe(false);
      }
    }

    // Assert European Mediterranean, Nordic, and Alpine staples are present
    const mealIds = MEAL_DATABASE.map((m) => m.id);
    expect(mealIds).toContain("din_tuscan_white_bean_stew");
    expect(mealIds).toContain("din_provencal_lentil_stew");
    expect(mealIds).toContain("bf_swiss_birchermuesli");
    expect(mealIds).toContain("lunch_norwegian_salmon_dill");
    expect(mealIds).toContain("din_mediterranean_beef_tagliata");
    expect(mealIds).toContain("snack_skyr_berries");
  });

  it("allocates European vegan dinner (Tuscan White Bean & Cavolo Nero Stew) for plant-based athletes", () => {
    const profile: NutritionProfile = {
      dietType: "vegan",
      allergens: ["none"],
      dislikedFoods: [],
      mealsPerDay: 3,
      reviewerStatus: "general_guidance"
    };

    const plan = generateDailyMealPlan(profile, "2026-11-26");
    const dinner = plan.meals.find((m) => m.category === "dinner");
    expect(dinner).toBeDefined();
    expect(dinner?.id).toBe("din_tuscan_white_bean_stew");
    expect(dinner?.name).toBe("Tuscan Cannellini Bean & Cavolo Nero Stew");
    expect(dinner?.dietaryTags).toContain("vegan");
  });
});
