"use client";

import React, { useState, useEffect } from "react";
import {
  Apple,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Info,
  Layers,
  UtensilsCrossed,
  RotateCcw
} from "lucide-react";
import { IosNavBar } from "@/components/layout/IosNavBar";
import {
  DietType,
  AllergenType,
  NutritionProfile,
  MealRecipe,
  PlannedDailyNutrition
} from "@/lib/nutrition/types";
import { MEAL_DATABASE } from "@/lib/nutrition/database";
import { filterEligibleMeals, generateDailyMealPlan } from "@/lib/nutrition/filterEngine";

const NUTRITION_STORAGE_KEY = "fit_planner_nutrition_profile";

export default function NutritionPage() {
  const [profile, setProfile] = useState<NutritionProfile>({
    dietType: "flexible",
    allergens: ["none"],
    otherAllergenText: "",
    dislikedFoods: [],
    mealsPerDay: 3,
    reviewerStatus: "general_guidance"
  });

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [dislikedInput, setDislikedInput] = useState("");
  const [dailyPlan, setDailyPlan] = useState<PlannedDailyNutrition | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealRecipe | null>(null);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NUTRITION_STORAGE_KEY);
      if (stored) {
        const parsed: NutritionProfile = JSON.parse(stored);
        setProfile(parsed);
        const plan = generateDailyMealPlan(parsed);
        setDailyPlan(plan);
      } else {
        const defaultProfile: NutritionProfile = {
          dietType: "flexible",
          allergens: ["none"],
          dislikedFoods: [],
          mealsPerDay: 3,
          reviewerStatus: "general_guidance"
        };
        setProfile(defaultProfile);
        const plan = generateDailyMealPlan(defaultProfile);
        setDailyPlan(plan);
      }
    } catch (e) {
      console.error("Failed to load nutrition profile", e);
    }
  }, []);

  const saveProfile = (updated: NutritionProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    const plan = generateDailyMealPlan(updated);
    setDailyPlan(plan);
    setIsConfiguring(false);
  };

  const handleToggleAllergen = (a: AllergenType) => {
    if (a === "none") {
      setProfile({ ...profile, allergens: ["none"] });
      return;
    }
    const withoutNone = (profile.allergens || []).filter((x) => x !== "none");
    if (withoutNone.includes(a)) {
      const next = withoutNone.filter((x) => x !== a);
      setProfile({
        ...profile,
        allergens: next.length === 0 ? ["none"] : next
      });
    } else {
      setProfile({
        ...profile,
        allergens: [...withoutNone, a]
      });
    }
  };

  const handleAddDisliked = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const item = dislikedInput.trim();
    if (!item) return;
    if (!profile.dislikedFoods.includes(item)) {
      setProfile({
        ...profile,
        dislikedFoods: [...profile.dislikedFoods, item]
      });
    }
    setDislikedInput("");
  };

  const handleRemoveDisliked = (item: string) => {
    setProfile({
      ...profile,
      dislikedFoods: profile.dislikedFoods.filter((f) => f !== item)
    });
  };

  const toggleMealComplete = (mealId: string) => {
    setCompletedMeals((prev) => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
      {/* iOS Header */}
      <IosNavBar
        title="Nutrition OS"
        subtitle="Allergen-filtered meal templates and athletic macronutrient tracking"
        action={
          <button
            type="button"
            onClick={() => setIsConfiguring(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC] hover:border-[#28DACC]/50 active:scale-95 transition-all"
          >
            <SlidersHorizontal size={13} />
            <span>Preferences</span>
          </button>
        }
      />

      {/* Mandatory General Guidance & Reviewer Notice (Section 10) */}
      <div className="p-4 rounded-3xl bg-[#102831] border border-[#FFB020]/40 flex items-start gap-3">
        <Info size={20} className="text-[#FFB020] shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#FFB020]">
              Nutrition Reviewer Status: General Athletic Guidance
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFB020]/20 text-[#FFB020]">
              Uncertified
            </span>
          </div>
          <p className="text-xs text-[#A8C5CA] mt-1 leading-relaxed">
            Until a qualified nutritionist reviewer is assigned in Platform Settings, meal recipes and caloric suggestions are presented as general lifestyle guidance. Allergen filtering is strictly enforced.
          </p>
        </div>
      </div>

      {/* Visual Kitchen Feast Banner */}
      <div className="rounded-3xl overflow-hidden border border-[#1F1F1F] relative h-40 group shadow-lg">
        <img
          src="/images/fit-planner/wholesome_kitchen_feast_with_fitness_focus.png"
          alt="Wholesome athlete meal feast"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#28DACC] block">
              Curated Athlete Nutrition
            </span>
            <h3 className="text-lg font-bold text-white">Whole Foods &amp; Allergen Purity</h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#28DACC]/40 text-[#28DACC] font-semibold">
            {profile.dietType.replace(/_/g, " ").toUpperCase()}
          </span>
        </div>
      </div>

      {/* MACRO BREAKDOWN SUMMARY TILE */}
      {dailyPlan && (
        <div className="ios-glass-card rounded-3xl p-5 md:p-6 border border-[#28525B]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] uppercase font-mono tracking-wider text-[#A8C5CA]">
                Daily Macro Blueprint
              </span>
              <h3 className="text-base font-bold text-[#F4F9FA]">
                Estimated Daily Intake ({profile.mealsPerDay} Meals)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#A8C5CA] uppercase font-mono">Total Energy</span>
              <div className="text-xl font-bold num-mono text-[#28DACC]">
                {dailyPlan.totalCalories} <span className="text-xs text-[#A8C5CA]">kcal</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#102831] p-3 rounded-2xl border border-[#28525B]">
              <div className="text-[10px] uppercase font-mono text-[#A8C5CA]">Protein</div>
              <div className="text-xl font-bold num-mono text-[#28DACC] mt-0.5">
                {dailyPlan.totalProteinG}g
              </div>
              <div className="text-[10px] text-[#A8C5CA] mt-0.5 font-mono">
                {Math.round((dailyPlan.totalProteinG * 4 * 100) / (dailyPlan.totalCalories || 1))}% cal
              </div>
            </div>

            <div className="bg-[#102831] p-3 rounded-2xl border border-[#28525B]">
              <div className="text-[10px] uppercase font-mono text-[#A8C5CA]">Carbohydrates</div>
              <div className="text-xl font-bold num-mono text-[#F4F9FA] mt-0.5">
                {dailyPlan.totalCarbsG}g
              </div>
              <div className="text-[10px] text-[#A8C5CA] mt-0.5 font-mono">
                {Math.round((dailyPlan.totalCarbsG * 4 * 100) / (dailyPlan.totalCalories || 1))}% cal
              </div>
            </div>

            <div className="bg-[#102831] p-3 rounded-2xl border border-[#28525B]">
              <div className="text-[10px] uppercase font-mono text-[#A8C5CA]">Healthy Fats</div>
              <div className="text-xl font-bold num-mono text-[#FFB020] mt-0.5">
                {dailyPlan.totalFatG}g
              </div>
              <div className="text-[10px] text-[#A8C5CA] mt-0.5 font-mono">
                {Math.round((dailyPlan.totalFatG * 9 * 100) / (dailyPlan.totalCalories || 1))}% cal
              </div>
            </div>
          </div>

          {/* Active Profile Filter Pills */}
          <div className="mt-4 pt-3 border-t border-[#28525B]/40 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#A8C5CA]">Filters Active:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#102831] text-[#28DACC] font-mono capitalize border border-[#28525B]">
              {profile.dietType.replace(/_/g, " ")}
            </span>
            {profile.allergens.filter((a) => a !== "none").length > 0 ? (
              profile.allergens
                .filter((a) => a !== "none")
                .map((a) => (
                  <span
                    key={a}
                    className="px-2 py-0.5 rounded-lg bg-[#FF5C5C]/15 text-[#FF5C5C] font-mono border border-[#FF5C5C]/30 text-[11px]"
                  >
                    No {a}
                  </span>
                ))
            ) : (
              <span className="text-[#A8C5CA] font-mono text-[11px]">No allergen exclusions</span>
            )}
            {profile.dislikedFoods.length > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-[#FFB020]/15 text-[#FFB020] font-mono border border-[#FFB020]/30 text-[11px]">
                {profile.dislikedFoods.length} Disliked Excluded
              </span>
            )}
          </div>
        </div>
      )}

      {/* TODAY'S MEAL SCHEDULE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A8C5CA] font-mono uppercase tracking-wider">
            Today&apos;s Nutrition Schedule ({dailyPlan?.meals.length || 0} Meals)
          </div>
          <span className="text-xs text-[#28DACC] font-mono">
            {Object.values(completedMeals).filter(Boolean).length} / {dailyPlan?.meals.length || 0} Logged
          </span>
        </div>

        {dailyPlan?.meals.map((meal, idx) => {
          const isDone = completedMeals[meal.id];
          return (
            <div
              key={meal.id}
              className={`ios-glass-card rounded-2xl p-4 md:p-5 border transition-all ${
                isDone
                  ? "bg-[#102831]/50 border-[#28525B]/40 opacity-75"
                  : "border-[#28525B] hover:border-[#28DACC]/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleMealComplete(meal.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isDone
                        ? "bg-[#28DACC] border-[#28DACC] text-[#07151D]"
                        : "border-[#28525B] bg-[#07151D] text-transparent hover:border-[#28DACC]"
                    }`}
                  >
                    <CheckCircle2 size={16} className={isDone ? "stroke-[2.5]" : ""} />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-[#28DACC] font-bold">
                        {meal.category}
                      </span>
                      <span className="text-[10px] text-[#A8C5CA] flex items-center gap-1">
                        <Clock size={11} /> {meal.prepTimeMinutes} min
                      </span>
                    </div>

                    <h4
                      onClick={() => setSelectedMeal(meal)}
                      className={`text-base font-bold mt-0.5 cursor-pointer hover:text-[#28DACC] transition-colors ${
                        isDone ? "line-through text-[#A8C5CA]" : "text-[#F4F9FA]"
                      }`}
                    >
                      {meal.name}
                    </h4>

                    <p className="text-xs text-[#A8C5CA] mt-1 leading-snug line-clamp-1">
                      {meal.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold num-mono text-[#F4F9FA]">
                    {meal.calories} <span className="text-[10px] text-[#A8C5CA]">kcal</span>
                  </div>
                  <div className="text-xs font-mono text-[#28DACC] font-semibold">
                    {meal.proteinG}g P
                  </div>
                </div>
              </div>

              {/* Quick Actions & Macro Tag Bar */}
              <div className="mt-3.5 pt-3 border-t border-[#28525B]/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#A8C5CA]">
                  <span>P: {meal.proteinG}g</span>
                  <span>·</span>
                  <span>C: {meal.carbsG}g</span>
                  <span>·</span>
                  <span>F: {meal.fatG}g</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMeal(meal)}
                  className="text-xs text-[#28DACC] font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Recipe &amp; Subs</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MEAL DETAILS BOTTOM SHEET */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
          <div className="w-full max-w-lg bg-[#102831] border border-[#28525B] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative">
            <div className="w-10 h-1 bg-[#28525B] rounded-full mx-auto mb-4" />

            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#28DACC] font-bold">
                  {selectedMeal.category} Recipe
                </span>
                <h3 className="text-xl font-bold text-[#F4F9FA] mt-0.5">
                  {selectedMeal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMeal(null)}
                className="p-1 rounded-full bg-[#07151D] text-[#A8C5CA] hover:text-[#F4F9FA]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Macros Tile */}
            <div className="grid grid-cols-4 gap-2 bg-[#07151D] p-3 rounded-2xl border border-[#28525B]/60 text-center my-4">
              <div>
                <div className="text-[10px] text-[#A8C5CA]">Calories</div>
                <div className="text-base font-bold num-mono text-[#F4F9FA]">{selectedMeal.calories}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A8C5CA]">Protein</div>
                <div className="text-base font-bold num-mono text-[#28DACC]">{selectedMeal.proteinG}g</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A8C5CA]">Carbs</div>
                <div className="text-base font-bold num-mono text-[#F4F9FA]">{selectedMeal.carbsG}g</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A8C5CA]">Fat</div>
                <div className="text-base font-bold num-mono text-[#FFB020]">{selectedMeal.fatG}g</div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-4">
              <h4 className="text-xs font-mono uppercase text-[#A8C5CA] tracking-wider mb-2">
                Ingredients
              </h4>
              <div className="space-y-1.5">
                {selectedMeal.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#142D35] border border-[#28525B]/50 flex items-center justify-between text-xs"
                  >
                    <span className="text-[#F4F9FA] font-medium">{ing.name}</span>
                    <span className="text-[#28DACC] font-mono">{ing.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Steps */}
            <div className="mt-5">
              <h4 className="text-xs font-mono uppercase text-[#A8C5CA] tracking-wider mb-2">
                Preparation Method ({selectedMeal.prepTimeMinutes} min)
              </h4>
              <div className="space-y-2">
                {selectedMeal.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#F4F9FA]">
                    <span className="w-5 h-5 rounded-full bg-[#07151D] text-[#28DACC] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Substitutions */}
            {selectedMeal.substitutions.length > 0 && (
              <div className="mt-5 p-3.5 rounded-2xl bg-[#07151D]/60 border border-[#28525B]/60">
                <h4 className="text-xs font-mono uppercase text-[#28DACC] tracking-wider mb-1.5 flex items-center gap-1.5">
                  <UtensilsCrossed size={13} />
                  <span>Approved Substitutions</span>
                </h4>
                {selectedMeal.substitutions.map((sub, i) => (
                  <div key={i} className="text-xs text-[#A8C5CA] leading-snug">
                    <span className="text-[#F4F9FA] font-medium">{sub.originalIngredient}</span> &rarr;{" "}
                    <span className="text-[#28DACC]">{sub.substituteIngredient}</span> ({sub.reason})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE C PREFERENCES CONFIGURATION MODAL */}
      {isConfiguring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#102831] border border-[#28525B] rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#F4F9FA]">
                Stage C: Nutrition Setup
              </h3>
              <button
                type="button"
                onClick={() => setIsConfiguring(false)}
                className="text-[#A8C5CA] hover:text-[#F4F9FA]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Diet Type */}
              <div>
                <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-2">
                  Dietary Baseline
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "flexible", label: "Flexible / Omnivore" },
                    { key: "vegetarian", label: "Vegetarian" },
                    { key: "vegan", label: "Strict Vegan" },
                    { key: "pescatarian", label: "Pescatarian" },
                    { key: "non_vegetarian", label: "High Protein Non-Veg" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setProfile({ ...profile, dietType: item.key as DietType })}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        profile.dietType === item.key
                          ? "card-selected-glow bg-[#142D35] text-[#28DACC]"
                          : "bg-[#07151D] border-[#28525B] text-[#A8C5CA]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergens Hard Filtering */}
              <div>
                <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-2">
                  Allergies (Hard Exclusions)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "none", label: "None Known" },
                    { key: "dairy", label: "Dairy / Milk" },
                    { key: "gluten", label: "Gluten / Wheat" },
                    { key: "nuts", label: "Nuts" },
                    { key: "eggs", label: "Eggs" },
                    { key: "soy", label: "Soy" },
                    { key: "fish", label: "Fish" },
                    { key: "other", label: "Other" }
                  ].map((item) => {
                    const isSelected = profile.allergens.includes(item.key as AllergenType);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleToggleAllergen(item.key as AllergenType)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? item.key === "none"
                              ? "bg-[#28DACC] text-[#07151D] border-[#28DACC] font-bold"
                              : "bg-[#FF5C5C]/20 text-[#FF5C5C] border-[#FF5C5C]/40 font-bold"
                            : "bg-[#07151D] border-[#28525B] text-[#A8C5CA]"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {profile.allergens.includes("other") && (
                  <input
                    type="text"
                    placeholder="Specify other allergies..."
                    value={profile.otherAllergenText || ""}
                    onChange={(e) => setProfile({ ...profile, otherAllergenText: e.target.value })}
                    className="mt-2.5 w-full bg-[#07151D] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none"
                    style={{ fontSize: "16px" }}
                  />
                )}
              </div>

              {/* Disliked Foods Searchable Input */}
              <div>
                <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-1">
                  Disliked Ingredients (Excluded)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. onions, mushrooms, cilantro..."
                    value={dislikedInput}
                    onChange={(e) => setDislikedInput(e.target.value)}
                    onKeyDown={handleAddDisliked}
                    className="flex-1 bg-[#07151D] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none"
                    style={{ fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDisliked}
                    className="px-4 rounded-xl bg-[#142D35] border border-[#28525B] text-xs font-bold text-[#28DACC]"
                  >
                    Add
                  </button>
                </div>

                {profile.dislikedFoods.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.dislikedFoods.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#142D35] border border-[#28525B] text-xs text-[#F4F9FA]"
                      >
                        <span>{d}</span>
                        <X
                          size={12}
                          className="cursor-pointer text-[#A8C5CA] hover:text-[#FF5C5C]"
                          onClick={() => handleRemoveDisliked(d)}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Meals Per Day */}
              <div>
                <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-2">
                  Meals Per Day
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() =>
                        setProfile({ ...profile, mealsPerDay: cnt as 2 | 3 | 4 | 5 })
                      }
                      className={`py-3 rounded-xl border text-xs font-bold num-mono ${
                        profile.mealsPerDay === cnt
                          ? "card-selected-glow bg-[#142D35] text-[#28DACC]"
                          : "bg-[#07151D] border-[#28525B] text-[#A8C5CA]"
                      }`}
                    >
                      {cnt} Meals
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => saveProfile(profile)}
                className="w-full h-12 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold shadow-[0_0_15px_rgba(40,218,204,0.3)] active:scale-95 transition-all hover:bg-[#41E9DC]"
              >
                Save &amp; Generate Meal Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
