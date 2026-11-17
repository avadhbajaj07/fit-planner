import {
  MealRecipe,
  NutritionProfile,
  PlannedDailyNutrition,
  AllergenType,
  DietType
} from "./types";
import { MEAL_DATABASE } from "./database";

/**
 * Pure, deterministic hard filtering of meals.
 * Enforces zero-tolerance allergen exclusion and diet compatibility.
 */
export function filterEligibleMeals(
  allMeals: MealRecipe[] = MEAL_DATABASE,
  profile: NutritionProfile
): MealRecipe[] {
  const activeAllergens = (profile.allergens || []).filter(
    (a) => a !== "none"
  ) as AllergenType[];

  const dislikedLower = (profile.dislikedFoods || []).map((d) =>
    d.toLowerCase().trim()
  );

  return allMeals.filter((meal) => {
    // 1. HARD ALLERGEN EXCLUSION RULE
    const hasViolatedAllergen = activeAllergens.some((userAllergen) =>
      meal.allergens.includes(userAllergen)
    );
    if (hasViolatedAllergen) {
      return false;
    }

    // 2. DIET TYPE FILTERING
    if (profile.dietType === "vegan") {
      if (!meal.dietaryTags.includes("vegan")) return false;
    } else if (profile.dietType === "vegetarian") {
      if (!meal.dietaryTags.includes("vegetarian") && !meal.dietaryTags.includes("vegan")) {
        return false;
      }
    } else if (profile.dietType === "pescatarian") {
      if (
        !meal.dietaryTags.includes("pescatarian") &&
        !meal.dietaryTags.includes("vegetarian") &&
        !meal.dietaryTags.includes("vegan")
      ) {
        return false;
      }
    }

    // 3. DISLIKED FOODS FILTERING
    if (dislikedLower.length > 0) {
      const mealText = (
        meal.name +
        " " +
        meal.description +
        " " +
        meal.ingredients.map((i) => i.name).join(" ")
      ).toLowerCase();

      const containsDisliked = dislikedLower.some(
        (disliked) => disliked.length > 2 && mealText.includes(disliked)
      );
      if (containsDisliked) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Builds a deterministic daily meal schedule matching user's requested frequency (2-5 meals/day)
 */
export function generateDailyMealPlan(
  profile: NutritionProfile,
  dateStr: string = new Date().toISOString().split("T")[0]
): PlannedDailyNutrition {
  const eligible = filterEligibleMeals(MEAL_DATABASE, profile);

  const breakfasts = eligible.filter((m) => m.category === "breakfast");
  const lunches = eligible.filter((m) => m.category === "lunch");
  const dinners = eligible.filter((m) => m.category === "dinner");
  const snacks = eligible.filter((m) => m.category === "snack");

  const selectedMeals: MealRecipe[] = [];

  const count = profile.mealsPerDay || 3;

  if (count === 2) {
    // 2 meals: Lunch + Dinner
    if (lunches.length > 0) selectedMeals.push(lunches[0]);
    if (dinners.length > 0) selectedMeals.push(dinners[0]);
  } else if (count === 3) {
    // 3 meals: Breakfast + Lunch + Dinner
    if (breakfasts.length > 0) selectedMeals.push(breakfasts[0]);
    if (lunches.length > 0) selectedMeals.push(lunches[0]);
    if (dinners.length > 0) selectedMeals.push(dinners[0]);
  } else if (count === 4) {
    // 4 meals: Breakfast + Lunch + Dinner + 1 Snack
    if (breakfasts.length > 0) selectedMeals.push(breakfasts[0]);
    if (lunches.length > 0) selectedMeals.push(lunches[0]);
    if (snacks.length > 0) selectedMeals.push(snacks[0]);
    if (dinners.length > 0) selectedMeals.push(dinners[0]);
  } else {
    // 5 meals: Breakfast + Snack + Lunch + Snack + Dinner
    if (breakfasts.length > 0) selectedMeals.push(breakfasts[0]);
    if (snacks.length > 0) selectedMeals.push(snacks[0]);
    if (lunches.length > 0) selectedMeals.push(lunches[0]);
    if (snacks.length > 1) selectedMeals.push(snacks[1]);
    else if (snacks.length === 1) selectedMeals.push(snacks[0]);
    if (dinners.length > 0) selectedMeals.push(dinners[0]);
  }

  // Aggregate totals
  const totalCalories = selectedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinG = selectedMeals.reduce((acc, m) => acc + m.proteinG, 0);
  const totalCarbsG = selectedMeals.reduce((acc, m) => acc + m.carbsG, 0);
  const totalFatG = selectedMeals.reduce((acc, m) => acc + m.fatG, 0);

  const reviewerNotice =
    "General Athletic Guidance Notice: Nutrition targets and meal templates are calculated as general health guidance and do not constitute certified medical dietetics. Consult a licensed registered dietitian for clinical prescription.";

  return {
    date: dateStr,
    meals: selectedMeals,
    totalCalories,
    totalProteinG,
    totalCarbsG,
    totalFatG,
    reviewerNotice
  };
}
