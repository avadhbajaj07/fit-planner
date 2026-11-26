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
    description: "High-protein Mediterranean probiotic morning bowl delivering 32g of slow-release casein and antioxidant-rich berries."
  },
  {
    id: "bf_swiss_birchermuesli",
    name: "Swiss Birchermüesli with Skyr & Forest Berries",
    category: "breakfast",
    prepTimeMinutes: 5,
    calories: 390,
    proteinG: 30,
    carbsG: 48,
    fatG: 8,
    dietaryTags: ["vegetarian", "flexible"],
    allergens: ["dairy", "gluten", "nuts"],
    ingredients: [
      { name: "Traditional Rolled Oats (soaked)", quantity: "60g" },
      { name: "Icelandic Skyr / Low-Fat Quark", quantity: "200g" },
      { name: "Grated Crisp Green Apple & Fresh Berries", quantity: "100g" },
      { name: "Crushed Roasted Hazelnuts", quantity: "15g" },
      { name: "Honey or Pure Maple Drizzle", quantity: "1 tsp" }
    ],
    instructions: [
      "Combine rolled oats with Icelandic skyr or quark and grated green apple.",
      "Top with fresh wild forest berries and crushed roasted hazelnuts.",
      "Serve chilled as an invigorating Swiss endurance breakfast."
    ],
    substitutions: [
      {
        originalIngredient: "Skyr/Quark",
        substituteIngredient: "Plant-based Oat/Soy Greek Yogurt",
        reason: "Dairy-free regression"
      },
      {
        originalIngredient: "Rolled Oats",
        substituteIngredient: "Certified Gluten-Free Rolled Oats",
        reason: "Gluten-free regression"
      },
      {
        originalIngredient: "Hazelnuts",
        substituteIngredient: "Pumpkin Seeds",
        reason: "Nut-free regression"
      }
    ],
    description: "The classic Alpine endurance athlete breakfast: slow-burning complex carbs, 30g protein from high-density skyr, and antioxidant mountain berries."
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
      { name: "Crumbled Greek Feta Cheese", quantity: "30g" },
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
    description: "Lean, high-volume Mediterranean egg white omelet providing maximum satiety with minimal carbohydrate load."
  },
  {
    id: "bf_smoked_salmon_avocado_toast",
    name: "Wild Smoked Salmon & Artisan Sourdough",
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
      { name: "Fresh Lemon Juice, Capers & Dill", quantity: "1 tsp" }
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
    description: "Nordic heart-healthy omega-3 powerhouse breakfast supporting neurological health and joint recovery."
  },
  {
    id: "bf_tofu_scramble",
    name: "Continental Herb Tofu & Garden Veggie Scramble",
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
      { name: "Herbs de Provence & Nutritional Yeast", quantity: "1 tbsp" },
      { name: "Extra Virgin Olive Oil", quantity: "1 tsp" }
    ],
    instructions: [
      "Heat olive oil in a skillet over medium heat.",
      "Sauté diced peppers and onions for 3 minutes until tender.",
      "Crumble firm tofu directly into the pan, season with Herbs de Provence, nutritional yeast, salt, and pepper.",
      "Fold in fresh baby spinach until wilted and serve warm."
    ],
    substitutions: [
      {
        originalIngredient: "Firm Tofu",
        substituteIngredient: "Scrambled Eggs or Chickpea Flour Batter",
        reason: "Soy-free regression"
      }
    ],
    description: "Plant-based continental scramble loaded with complete amino acids, B12, and leafy greens."
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
    description: "Gold standard European athletic staple meal offering 44g of pure complete protein and complex low-glycemic glycogen fuel."
  },
  {
    id: "lunch_norwegian_salmon_dill",
    name: "Norwegian Pan-Seared Salmon with Herb Potatoes & Green Beans",
    category: "lunch",
    prepTimeMinutes: 18,
    calories: 510,
    proteinG: 39,
    carbsG: 42,
    fatG: 20,
    dietaryTags: ["pescatarian", "flexible"],
    allergens: ["fish"],
    ingredients: [
      { name: "Fresh Norwegian Atlantic Salmon Fillet", quantity: "160g" },
      { name: "Steamed Herb Baby Potatoes", quantity: "150g" },
      { name: "Tender French Green Beans (Haricots Verts)", quantity: "100g" },
      { name: "Cold-Pressed Olive Oil, Fresh Dill & Lemon", quantity: "1 tbsp" }
    ],
    instructions: [
      "Sear salmon fillet in olive oil for 4 minutes skin-side down until crisp; gently flip and finish with sea salt, lemon juice, and fresh dill.",
      "Steam tender French green beans and baby potatoes until fork-tender.",
      "Plate together with a wedge of fresh lemon and cracked black pepper."
    ],
    substitutions: [
      {
        originalIngredient: "Atlantic Salmon",
        substituteIngredient: "Atlantic Cod or Sea Bass Fillet",
        reason: "Lighter white fish regression"
      }
    ],
    description: "Cardioprotective Nordic athletic lunch delivering 39g complete protein, essential marine EPA/DHA omega-3s, and sustained complex carbohydrates."
  },
  {
    id: "lunch_mediterranean_tuna_pasta",
    name: "Mediterranean Whole-Grain Penne with Tuna, Olives & Basil",
    category: "lunch",
    prepTimeMinutes: 15,
    calories: 490,
    proteinG: 41,
    carbsG: 52,
    fatG: 12,
    dietaryTags: ["pescatarian", "flexible"],
    allergens: ["fish", "gluten"],
    ingredients: [
      { name: "Skipjack Tuna in Spring Water (drained)", quantity: "150g" },
      { name: "Whole-Grain Italian Penne (cooked)", quantity: "150g" },
      { name: "Kalamata Olives & Cherry Tomatoes (halved)", quantity: "80g" },
      { name: "Capers & Fresh Basil Leaves", quantity: "1 tbsp" },
      { name: "Extra Virgin Olive Oil & Lemon", quantity: "1 tbsp" }
    ],
    instructions: [
      "Toss warm whole-grain penne with extra virgin olive oil, lemon juice, and minced garlic.",
      "Fold in drained skipjack tuna flakes, halved cherry tomatoes, Kalamata olives, and capers.",
      "Garnish generously with torn fresh basil and sea salt."
    ],
    substitutions: [
      {
        originalIngredient: "Whole-Grain Penne",
        substituteIngredient: "Gluten-Free Brown Rice Penne",
        reason: "Gluten-free regression"
      }
    ],
    description: "Italian athlete staple high in clean marine protein, complex slow-digesting starches, and anti-inflammatory polyphenols."
  },

  // --- DINNERS ---
  {
    id: "din_tuscan_white_bean_stew",
    name: "Tuscan Cannellini Bean & Cavolo Nero Stew",
    category: "dinner",
    prepTimeMinutes: 20,
    calories: 420,
    proteinG: 22,
    carbsG: 58,
    fatG: 11,
    dietaryTags: ["vegan", "vegetarian", "flexible"],
    allergens: [],
    ingredients: [
      { name: "Cooked Tuscan Cannellini Beans (rinsed)", quantity: "240g" },
      { name: "Crushed San Marzano Italian Tomatoes", quantity: "150g" },
      { name: "Tuscan Cavolo Nero / Dark Kale (chopped)", quantity: "80g" },
      { name: "Cold-Pressed Extra Virgin Olive Oil", quantity: "1 tbsp" },
      { name: "Fresh Rosemary & Thyme with Minced Garlic", quantity: "1 sprig" }
    ],
    instructions: [
      "Heat extra virgin olive oil in a deep skillet over medium heat and sauté garlic, rosemary, and thyme until fragrant.",
      "Add San Marzano crushed tomatoes and tender cannellini beans, simmering gently for 12 minutes to develop deep herbal flavors.",
      "Fold in shredded cavolo nero until tender and bright green. Season with sea salt and cracked black pepper."
    ],
    substitutions: [
      {
        originalIngredient: "Cannellini Beans",
        substituteIngredient: "French Puy Green Lentils",
        reason: "Legume variation"
      }
    ],
    description: "Classic Tuscan slow-cooked cannellini bean and cavolo nero stew delivering clean plant protein, dietary fiber, and cellular antioxidant polyphenols."
  },
  {
    id: "din_provencal_lentil_stew",
    name: "Provençal Puy Green Lentil & Vegetable Stew",
    category: "dinner",
    prepTimeMinutes: 25,
    calories: 410,
    proteinG: 24,
    carbsG: 56,
    fatG: 10,
    dietaryTags: ["vegan", "vegetarian", "flexible"],
    allergens: [],
    ingredients: [
      { name: "French Puy Green Lentils (rinsed)", quantity: "100g" },
      { name: "Diced Carrots, Leeks, & Celery", quantity: "120g" },
      { name: "Aromatic Vegetable Broth", quantity: "300ml" },
      { name: "Fresh Thyme, Bay Leaf & Flat-Leaf Parsley", quantity: "1 tbsp" },
      { name: "Cold-Pressed Extra Virgin Olive Oil", quantity: "1 tbsp" }
    ],
    instructions: [
      "Sauté diced leeks, carrots, and celery in olive oil until sweet and tender.",
      "Add Puy lentils, aromatic vegetable broth, fresh thyme, and bay leaf; simmer for 20 minutes until lentils are al dente.",
      "Finish with fresh chopped flat-leaf parsley and cracked black pepper."
    ],
    substitutions: [],
    description: "Traditional French Puy lentil dish providing deep mineral density, complete plant amino acids, and high prebiotic fiber for gut microbiome vitality."
  },
  {
    id: "din_turkey_ratatouille_quinoa",
    name: "Provençal Lean Turkey Ragù with Herbed Ratatouille & Quinoa",
    category: "dinner",
    prepTimeMinutes: 18,
    calories: 460,
    proteinG: 42,
    carbsG: 44,
    fatG: 12,
    dietaryTags: ["non_vegetarian", "flexible"],
    allergens: [],
    ingredients: [
      { name: "Lean Ground Turkey Fillet (93/7)", quantity: "160g" },
      { name: "Provençal Vegetable Medley (Zucchini, Bell Pepper, Eggplant)", quantity: "140g" },
      { name: "Steamed Organic Quinoa", quantity: "120g" },
      { name: "Crushed San Marzano Tomatoes & Herbs de Provence", quantity: "3 tbsp" },
      { name: "Cold-Pressed Extra Virgin Olive Oil", quantity: "1 tsp" }
    ],
    instructions: [
      "Brown lean turkey in a skillet with cold-pressed olive oil, garlic, and fragrant Herbs de Provence.",
      "Stir in diced Mediterranean zucchini, bell peppers, eggplant, and crushed tomatoes; simmer for 8 minutes until tender.",
      "Serve hot over fluffy warm quinoa."
    ],
    substitutions: [
      {
        originalIngredient: "Ground Turkey",
        substituteIngredient: "Puy Green Lentils or Sautéed Tempeh",
        reason: "Plant-based regression"
      }
    ],
    description: "Classic French Mediterranean high-protein dinner loaded with lean poultry protein, slow-burning complex carbs, and rich vegetable polyphenols."
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
    description: "Light, ultra-lean North Sea dinner with virtually zero saturated fat, facilitating restful sleep without digestive heaviness."
  },
  {
    id: "din_mediterranean_beef_tagliata",
    name: "Mediterranean Lean Beef Tagliata with Baby Potatoes & Arugula",
    category: "dinner",
    prepTimeMinutes: 15,
    calories: 450,
    proteinG: 44,
    carbsG: 32,
    fatG: 15,
    dietaryTags: ["non_vegetarian", "flexible"],
    allergens: ["dairy"],
    ingredients: [
      { name: "Grass-Fed Lean Beef Tenderloin / Sirloin", quantity: "170g" },
      { name: "Baby Rosemary Potatoes (roasted)", quantity: "140g" },
      { name: "Fresh Wild Baby Arugula (Rocket)", quantity: "50g" },
      { name: "Shaved Aged Parmigiano-Reggiano", quantity: "15g" },
      { name: "Aged Balsamic Glaze & Extra Virgin Olive Oil", quantity: "1 tsp" }
    ],
    instructions: [
      "Sear seasoned lean beef in a smoking-hot cast iron pan for 3 minutes per side to medium-rare.",
      "Rest for 5 minutes, then slice thinly against the grain (tagliata style).",
      "Plate atop crisp wild arugula, roasted baby rosemary potatoes, and garnish with Parmigiano-Reggiano shavings and balsamic drizzle."
    ],
    substitutions: [
      {
        originalIngredient: "Parmigiano-Reggiano",
        substituteIngredient: "Nutritional Yeast or omit",
        reason: "Dairy-free regression"
      }
    ],
    description: "Classic Italian athletic recovery meal providing 44g highly bioavailable heme iron and complete protein for muscle tissue repair."
  },

  // --- SNACKS ---
  {
    id: "snack_skyr_berries",
    name: "Icelandic Skyr with Roasted Hazelnuts & Lingonberries",
    category: "snack",
    prepTimeMinutes: 2,
    calories: 180,
    proteinG: 21,
    carbsG: 14,
    fatG: 4,
    dietaryTags: ["vegetarian", "flexible"],
    allergens: ["dairy", "nuts"],
    ingredients: [
      { name: "Icelandic Skyr (Plain 0% fat)", quantity: "180g" },
      { name: "Wild Lingonberries or Blackcurrants", quantity: "50g" },
      { name: "Crushed Roasted Hazelnuts", quantity: "10g" }
    ],
    instructions: [
      "Spoon cold Icelandic skyr into a bowl.",
      "Top with wild lingonberries (or blackcurrants) and toasted hazelnut crunch."
    ],
    substitutions: [
      {
        originalIngredient: "Hazelnuts",
        substituteIngredient: "Chia seeds",
        reason: "Nut-free regression"
      }
    ],
    description: "Ultra-dense Nordic dairy snack packing 21g pure casein and whey protein with wild Arctic berry flavonoids."
  },
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
      "Boil or steam edamame pods for 4-5 minutes.",
      "Drain well and toss vigorously with flaky sea salt."
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
    name: "Alpine Cottage Cheese with Berries & Golden Flax",
    category: "snack",
    prepTimeMinutes: 3,
    calories: 190,
    proteinG: 22,
    carbsG: 16,
    fatG: 4,
    dietaryTags: ["vegetarian", "flexible"],
    allergens: ["dairy"],
    ingredients: [
      { name: "Low-Fat Cottage Cheese (Hüttenkäse)", quantity: "180g" },
      { name: "Fresh European Strawberries or Blueberries", quantity: "60g" },
      { name: "Ground Golden Flaxseeds", quantity: "1 tsp" }
    ],
    instructions: [
      "Spoon cottage cheese into a small bowl.",
      "Top with juicy fresh berries and sprinkle ground flaxseed."
    ],
    substitutions: [
      {
        originalIngredient: "Cottage Cheese",
        substituteIngredient: "Silken Tofu or Pumpkin Seed Protein Pudding",
        reason: "Dairy-free regression"
      }
    ],
    description: "Casein-dense Central European athlete snack providing sustained amino acid delivery and healthy lignans for recovery."
  }
];

export function getMealById(id: string): MealRecipe | undefined {
  return MEAL_DATABASE.find((m) => m.id === id);
}
