export type DietType =
  | "flexible"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "non_vegetarian";

export type AllergenType =
  | "none"
  | "dairy"
  | "gluten"
  | "nuts"
  | "eggs"
  | "soy"
  | "fish"
  | "shellfish"
  | "other";

export interface FoodItem {
  id: string;
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  allergens: AllergenType[];
  dietaryTags: DietType[];
  ingredients?: string[];
}

export interface MealSubstitution {
  originalIngredient: string;
  substituteIngredient: string;
  reason: string;
  notes?: string;
}

export interface MealRecipe {
  id: string;
  name: string;
  category: "breakfast" | "lunch" | "dinner" | "snack";
  prepTimeMinutes: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  dietaryTags: DietType[];
  allergens: AllergenType[];
  ingredients: { name: string; quantity: string }[];
  instructions: string[];
  substitutions: MealSubstitution[];
  description: string;
}

export interface NutritionProfile {
  dietType: DietType;
  allergens: AllergenType[];
  otherAllergenText?: string;
  dislikedFoods: string[];
  mealsPerDay: 2 | 3 | 4 | 5;
  reviewerStatus: "general_guidance" | "pending_review" | "approved";
  reviewerName?: string;
}

export interface PlannedDailyNutrition {
  date: string;
  meals: MealRecipe[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  reviewerNotice: string;
}
