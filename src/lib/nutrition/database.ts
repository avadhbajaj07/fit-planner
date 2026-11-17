import { MealRecipe } from "./types";

export const MEAL_DATABASE: MealRecipe[] = [
  // --- BREAKFASTS ---
  {
    id: "bf_greek_yogurt_bowl",
    name: "Berry & Greek Yogurt Crunch Bowl",
    category: "breakfast",
    prepTimeMinutes: 5,
    calories: 380,
    proteinG: 32,
    carbsG: 42,
    fatG: 9,
    dietaryTags: ["vegetarian", "flexible"],
    allergens: ["dairy", "nuts"],
    ingredients: [
      { name: "0% Fat Plain Greek Yogurt", quantity: "250g" },
      { name: "Fresh Blueberries and Raspberries", quantity: "100g" },
      { name: "Crushed Walnuts", quantity: "20g" },
      { name: "Chia Seeds", quantity: "10g" },
      { name: "Honey / Stevia", quantity: "1 tsp" }
    ],
    instructions: [
      "Scoop Greek yogurt into a chilled bowl.",
      "Top with washed fresh berries, crushed walnuts, and chia seeds.",
      "Drizzle lightly with honey and serve immediately."
    ],
    substitutions: [
      {
        originalIngredient: "Greek Yogurt",
        substituteIngredient: "High-protein Soy or Coconut Yogurt",
        reason: "Dairy-free regression"
      },
      {
        originalIngredient: "Walnuts",
        substituteIngredient: "Pumpkin or Sunflower seeds",
        reason: "Nut-free regression"
      }
    ],
    description: "High-protein probiotic morning bowl delivering 32g of slow-release casein and antioxidant-rich berries."
  },
  {
    id: "bf_tofu_scramble",
    name: "Golden Turmeric Tofu & Veggie Scramble",
    category: "breakfast",
    prepTimeMinutes: 12,
    calories: 340,
    proteinG: 26,
    carbsG: 22,
    fatG: 16,
    dietaryTags: ["vegan", "vegetarian", "flexible"],
    allergens: ["soy"],
    ingredients: [
      { name: "Firm Organic Tofu (crumbled)", quantity: "200g" },
      { name: "Baby Spinach", quantity: "50g" },
      { name: "Diced Bell Pepper & Red Onion", quantity: "60g" },
      { name: "Ground Turmeric & Nutritional Yeast", quantity: "1 tbsp" },
      { name: "Olive Oil", quantity: "1 tsp" }
    ],
    instructions: [
      "Heat olive oil in a skillet over medium heat.",
      "Sauté diced peppers and onions for 3 minutes until tender.",
      "Crumble firm tofu directly into the pan, season with turmeric, nutritional yeast, salt, and pepper.",
      "Fold in fresh baby spinach until wilted and serve warm."
    ],
    substitutions: [
      {
        originalIngredient: "Firm Tofu",
        substituteIngredient: "Scrambled Eggs or Chickpea Flour Batter",
        reason: "Soy-free regression"
      }
    ],
    description: "Anti-inflammatory, 100% plant-based scramble loaded with bioavailable turmeric, B12, and leafy greens."
  },
  {
    id: "bf_spinach_egg_white_omelet",
    name: "Mediterranean Spinach & Egg White Omelet",
    category: "breakfast",
    prepTimeMinutes: 10,
    calories: 290,
    proteinG: 34,
    carbsG: 12,
    fatG: 11,
    dietaryTags: ["vegetarian", "flexible"],
    allergens: ["eggs", "dairy"],
    ingredients: [
      { name: "Liquid Egg Whites + 1 Whole Egg", quantity: "200ml" },
      { name: "Baby Spinach", quantity: "40g" },
      { name: "Crumbled Feta Cheese", quantity: "30g" },
      { name: "Cherry Tomatoes (halved)", quantity: "50g" }
    ],
    instructions: [
      "Whisk egg whites with one whole egg and a pinch of black pepper.",
      "Pour into a warm non-stick skillet over medium-low heat.",
      "Scatter spinach, tomatoes, and feta over one half.",
      "Gently fold over when set and cook for an additional 60 seconds."
    ],
    substitutions: [
      {
        originalIngredient: "Feta Cheese",
        substituteIngredient: "Sliced Avocado or Nutritional Yeast",
        reason: "Dairy-free option"
      }
    ],
    description: "Lean, high-volume egg white omelet providing maximum satiety with minimal carbohydrate load."
  },
  {
    id: "bf_smoked_salmon_avocado_toast",
    name: "Wild Smoked Salmon & Sourdough Toast",
    category: "breakfast",
    prepTimeMinutes: 6,
    calories: 420,
    proteinG: 28,
    carbsG: 36,
    fatG: 18,
    dietaryTags: ["pescatarian", "flexible"],
    allergens: ["fish", "gluten"],
    ingredients: [
      { name: "Wild Caught Smoked Salmon", quantity: "80g" },
      { name: "Artisan Sourdough Slice (toasted)", quantity: "1 large (60g)" },
      { name: "Hass Avocado (mashed)", quantity: "50g" },
      { name: "Fresh Lemon Juice & Capers", quantity: "1 tsp" }
    ],
    instructions: [
      "Toast sourdough until golden and crisp.",
      "Spread mashed avocado evenly over toast with lemon juice, salt, and pepper.",
      "Layer smoked salmon ribbons on top, garnished with capers and fresh dill."
    ],
    substitutions: [
      {
        originalIngredient: "Sourdough Slice",
        substituteIngredient: "Gluten-Free Seed Bread",
        reason: "Gluten-free regression"
      }
    ],
    description: "Heart-healthy omega-3 powerhouse breakfast supporting neurological health and joint recovery."
  },

  // --- LUNCHES ---
  {
    id: "lunch_mediterranean_quinoa_bowl",
    name: "Mediterranean Roasted Chickpea & Quinoa Bowl",
    category: "lunch",
    prepTimeMinutes: 15,
    calories: 460,
    proteinG: 22,
    carbsG: 64,
    fatG: 14,
    dietaryTags: ["vegan", "vegetarian", "flexible"],
    allergens: [],
    ingredients: [
      { name: "Cooked Tricolor Quinoa", quantity: "150g" },
      { name: "Oven-Roasted Spiced Chickpeas", quantity: "120g" },
      { name: "Cucumber, Cherry Tomatoes, & Kalamata Olives", quantity: "100g" },
      { name: "Tahini & Lemon Dressing", quantity: "2 tbsp" }
    ],
    instructions: [
      "Base the bowl with warm cooked quinoa.",
      "Arrange spiced roasted chickpeas, sliced cucumber, tomatoes, and olives.",
      "Drizzle with cold-pressed tahini and fresh lemon juice dressing."
    ],
    substitutions: [
      {
        originalIngredient: "Tahini Dressing",
        substituteIngredient: "Olive Oil & Balsamic Glaze",
        reason: "Sesame sensitivity"
      }
    ],
    description: "Naturally gluten-free, allergen-free complete protein bowl packed with fiber and micronutrients."
  },
  {
    id: "lunch_herb_grilled_chicken",
    name: "Lemon Herb Grilled Chicken & Sweet Potato",
    category: "lunch",
    prepTimeMinutes: 20,
    calories: 480,
    proteinG: 44,
    carbsG: 46,
    fatG: 12,
    dietaryTags: ["non_vegetarian", "flexible"],
    allergens: [],
    ingredients: [
      { name: "Skinless Chicken Breast Fillet", quantity: "180g" },
      { name: "Baked Sweet Potato (cubed)", quantity: "180g" },
      { name: "Steamed Broccoli Florets", quantity: "120g" },
      { name: "Extra Virgin Olive Oil & Rosemary", quantity: "1 tsp" }
    ],
    instructions: [
      "Season chicken breast with garlic powder, dried rosemary, oregano, and salt.",
      "Grill on a ridged pan for 6-7 minutes per side until internal temperature reaches 75°C.",
      "Serve alongside roasted sweet potato cubes and steamed broccoli."
    ],
    substitutions: [
      {
        originalIngredient: "Chicken Breast",
        substituteIngredient: "Grilled Extra-Firm Tofu or Tempeh",
        reason: "Vegetarian/vegan regression"
      }
    ],
    description: "Gold standard bodybuilding staple meal offering 44g of pure complete protein and complex low-glycemic glycogen fuel."
  },
  {
    id: "lunch_teriyaki_salmon",
    name: "Wild Teriyaki Salmon with Jasmine Rice & Greens",
    category: "lunch",
    prepTimeMinutes: 18,
    calories: 520,
    proteinG: 38,
    carbsG: 48,
    fatG: 19,
    dietaryTags: ["pescatarian", "flexible"],
    allergens: ["fish", "soy"],
    ingredients: [
      { name: "Fresh Atlantic Salmon Fillet", quantity: "160g" },
      { name: "Steamed Jasmine Rice", quantity: "140g" },
      { name: "Baby Bok Choy & Snap Peas", quantity: "100g" },
      { name: "Low-Sodium Tamari / Teriyaki Glaze", quantity: "1.5 tbsp" }
    ],
    instructions: [
      "Sear salmon fillet skin-side down in a hot pan for 4 minutes, flip and glaze with teriyaki.",
      "Quickly steam baby bok choy and snap peas for 3 minutes.",
      "Plate over warm jasmine rice and sprinkle with toasted sesame seeds."
    ],
    substitutions: [
      {
        originalIngredient: "Tamari/Teriyaki Glaze",
        substituteIngredient: "Coconut Aminos Glaze",
        reason: "Soy-free regression"
      }
    ],
    description: "High-satiety lunch rich in EPA/DHA omega-3 fatty acids, promoting cardiovascular elasticity and recovery."
  },

  // --- DINNERS ---
  {
    id: "din_red_lentil_curry",
    name: "Hearty Red Lentil, Spinach & Coconut Dahl",
    category: "dinner",
    prepTimeMinutes: 25,
    calories: 430,
    proteinG: 22,
    carbsG: 58,
    fatG: 12,
    dietaryTags: ["vegan", "vegetarian", "flexible"],
    allergens: [],
    ingredients: [
      { name: "Split Red Lentils (rinsed)", quantity: "100g" },
      { name: "Light Coconut Milk", quantity: "100ml" },
      { name: "Baby Spinach & Chopped Tomatoes", quantity: "100g" },
      { name: "Garam Masala, Ginger, & Garlic", quantity: "1 tbsp" }
    ],
    instructions: [
      "Simmer red lentils with water, ginger, garlic, and turmeric for 15 minutes until soft.",
      "Stir in light coconut milk, diced tomatoes, and garam masala.",
      "Fold in fresh spinach in the final 2 minutes until wilted. Serve in a deep bowl."
    ],
    substitutions: [],
    description: "Comforting Indian dahl providing warm digestion, bioavailable plant iron, and sustained overnight recovery amino acids."
  },
  {
    id: "din_turkey_black_bean_bowl",
    name: "Fiesta Lean Turkey & Black Bean Power Bowl",
    category: "dinner",
    prepTimeMinutes: 15,
    calories: 470,
    proteinG: 42,
    carbsG: 45,
    fatG: 13,
    dietaryTags: ["non_vegetarian", "flexible"],
    allergens: [],
    ingredients: [
      { name: "Lean Ground Turkey Breast (93/7)", quantity: "160g" },
      { name: "Black Beans (rinsed)", quantity: "100g" },
      { name: "Brown Rice", quantity: "120g" },
      { name: "Fire-Roasted Tomato Salsa", quantity: "3 tbsp" },
      { name: "Cumin & Chili Seasoning", quantity: "1 tsp" }
    ],
    instructions: [
      "Brown ground turkey in a non-stick pan with cumin, paprika, and sea salt.",
      "Add black beans to warm through.",
      "Assemble over brown rice and top with fresh cilantro and roasted tomato salsa."
    ],
    substitutions: [
      {
        originalIngredient: "Ground Turkey",
        substituteIngredient: "Crumbled Tempeh or Plant-Based Grounds",
        reason: "Vegetarian/vegan regression"
      }
    ],
    description: "High-protein, zero-dairy, zero-gluten Mexican bowl ideal for post-training glycogen reloading."
  },
  {
    id: "din_baked_cod_asparagus",
    name: "Baked Lemon Parsley Atlantic Cod",
    category: "dinner",
    prepTimeMinutes: 20,
    calories: 360,
    proteinG: 38,
    carbsG: 18,
    fatG: 14,
    dietaryTags: ["pescatarian", "flexible"],
    allergens: ["fish"],
    ingredients: [
      { name: "Atlantic White Cod Fillet", quantity: "200g" },
      { name: "Fresh Asparagus Spears (trimmed)", quantity: "150g" },
      { name: "Baby Red Potatoes (halved & steamed)", quantity: "120g" },
      { name: "Olive Oil & Fresh Lemon Slices", quantity: "1 tbsp" }
    ],
    instructions: [
      "Preheat oven to 200°C (400°F).",
      "Place cod fillet and trimmed asparagus spears on a parchment-lined baking sheet.",
      "Brush lightly with olive oil, minced garlic, lemon juice, salt, and cracked pepper.",
      "Bake for 12-14 minutes until cod flakes easily with a fork."
    ],
    substitutions: [],
    description: "Light, ultra-lean dinner with virtually zero saturated fat, facilitating restful sleep without digestive heaviness."
  },

  // --- SNACKS ---
  {
    id: "snack_edamame_salt",
    name: "Steamed Edamame with Flaky Sea Salt",
    category: "snack",
    prepTimeMinutes: 5,
    calories: 160,
    proteinG: 14,
    carbsG: 11,
    fatG: 6,
    dietaryTags: ["vegan", "vegetarian", "pescatarian", "flexible"],
    allergens: ["soy"],
    ingredients: [
      { name: "Young Green Soybeans in Pod", quantity: "150g" },
      { name: "Flaky Sea Salt & Chili Flakes", quantity: "1 tsp" }
    ],
    instructions: [
      "Boil or steam frozen edamame pods for 4-5 minutes.",
      "Drain well and toss vigorously with flaky sea salt and optional chili flakes."
    ],
    substitutions: [],
    description: "Quick whole-food complete protein snack packed with folate and dietary fiber."
  },
  {
    id: "snack_apple_almond_butter",
    name: "Crisp Green Apple with Creamy Almond Butter",
    category: "snack",
    prepTimeMinutes: 3,
    calories: 210,
    proteinG: 5,
    carbsG: 26,
    fatG: 11,
    dietaryTags: ["vegan", "vegetarian", "pescatarian", "flexible"],
    allergens: ["nuts"],
    ingredients: [
      { name: "Granny Smith Apple (sliced)", quantity: "1 medium (150g)" },
      { name: "Natural Roasted Almond Butter", quantity: "1.5 tbsp (24g)" }
    ],
    instructions: [
      "Slice cold crisp apple into wedges.",
      "Serve alongside measured almond butter for dipping."
    ],
    substitutions: [
      {
        originalIngredient: "Almond Butter",
        substituteIngredient: "Sunflower Seed Butter (SunButter)",
        reason: "Nut-free regression"
      }
    ],
    description: "Fiber and monounsaturated healthy fat pairing to stabilize blood sugar between training windows."
  },
  {
    id: "snack_cottage_cheese_flax",
    name: "Cottage Cheese with Pineapple & Golden Flax",
    category: "snack",
    prepTimeMinutes: 3,
    calories: 190,
    proteinG: 22,
    carbsG: 16,
    fatG: 4,
    dietaryTags: ["vegetarian", "flexible"],
    allergens: ["dairy"],
    ingredients: [
      { name: "Low-Fat Cottage Cheese", quantity: "180g" },
      { name: "Fresh Pineapple Chunks", quantity: "60g" },
      { name: "Ground Golden Flaxseeds", quantity: "1 tsp" }
    ],
    instructions: [
      "Spoon cottage cheese into a small bowl.",
      "Top with juicy pineapple chunks and sprinkle ground flaxseed."
    ],
    substitutions: [
      {
        originalIngredient: "Cottage Cheese",
        substituteIngredient: "Silken Tofu or Pumpkin Seed Protein Pudding",
        reason: "Dairy-free regression"
      }
    ],
    description: "Casein-dense afternoon snack providing sustained amino acid delivery and bromelain enzyme for digestion."
  }
];

export function getMealById(id: string): MealRecipe | undefined {
  return MEAL_DATABASE.find((m) => m.id === id);
}
