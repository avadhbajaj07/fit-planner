"use client";

import React, { useState } from "react";
import {
  Apple,
  ShieldAlert,
  Info,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";
import { IosNavBar } from "@/components/layout/IosNavBar";

export default function NutritionPage() {
  const [dietType, setDietType] = useState("flexible");
  const [allergies, setAllergies] = useState<string[]>(["none"]);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [isSaved, setIsSaved] = useState(false);

  const toggleAllergy = (key: string) => {
    if (key === "none") {
      setAllergies(["none"]);
    } else {
      const withoutNone = allergies.filter((a) => a !== "none");
      if (allergies.includes(key)) {
        const next = withoutNone.filter((a) => a !== key);
        setAllergies(next.length === 0 ? ["none"] : next);
      } else {
        setAllergies([...withoutNone, key]);
      }
    }
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
      <IosNavBar
        title="Nutrition Plan"
        subtitle="Dietary preferences, allergen safety, and general meal guidance"
      />

      {/* Setup Required State / Phase 3 Milestone Notice */}
      <div className="p-4 rounded-3xl bg-[#102831] border border-[#FFB020]/40 flex items-start gap-3">
        <ShieldAlert size={20} className="text-[#FFB020] shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-bold text-[#FFB020]">
            Setup Required: Nutrition Engine Reviewer (Phase 3)
          </div>
          <p className="text-xs text-[#F4F9FA] mt-1 leading-relaxed">
            As required by safety regulations, FIT Planner does not claim medical or clinical nutrition certification. Until an approved certified nutritionist or coach review is activated in Admin Settings, all nutrition recommendations are provided as general lifestyle guidance.
          </p>
        </div>
      </div>

      {/* Stage C Nutrition Setup Questionnaire Card */}
      <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-[#28DACC]" />
          <h3 className="text-base font-bold text-[#F4F9FA]">
            Stage C: Calibrate Nutrition Preferences
          </h3>
        </div>
        <p className="text-xs text-[#A8C5CA] mb-6">
          Set your dietary baseline to filter recipes and allergen alerts.
        </p>

        <div className="space-y-5">
          {/* Diet Type */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#A8C5CA] block mb-2">
              Dietary Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: "flexible", label: "Flexible / Mixed" },
                { key: "vegetarian", label: "Vegetarian" },
                { key: "vegan", label: "Vegan" },
                { key: "pescatarian", label: "Pescatarian" },
                { key: "non_veg", label: "High Protein Non-Veg" }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setDietType(item.key)}
                  className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${
                    dietType === item.key
                      ? "card-selected-glow bg-[#102831] text-[#28DACC]"
                      : "bg-[#07151D]/60 border-[#28525B]/60 text-[#A8C5CA] hover:bg-[#102831]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies & Intolerances */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#A8C5CA] block mb-2">
              Allergens (Hard Exclusions)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "none", label: "None Known" },
                { key: "dairy", label: "Dairy / Lactose" },
                { key: "gluten", label: "Gluten / Wheat" },
                { key: "nuts", label: "Tree Nuts & Peanuts" },
                { key: "eggs", label: "Eggs" },
                { key: "soy", label: "Soy" }
              ].map((item) => {
                const isSelected = allergies.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleAllergy(item.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? item.key === "none"
                          ? "bg-[#28DACC] text-[#07151D] border-[#28DACC] font-bold"
                          : "bg-[#FF5C5C]/20 text-[#FF5C5C] border-[#FF5C5C]/40 font-bold"
                        : "bg-[#07151D]/60 border-[#28525B]/60 text-[#A8C5CA]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meals Per Day */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#A8C5CA] block mb-2">
              Daily Meal Frequency
            </label>
            <div className="flex items-center gap-3">
              {[2, 3, 4, 5].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setMealsPerDay(cnt)}
                  className={`w-12 h-12 rounded-2xl border text-sm font-bold num-mono transition-all ${
                    mealsPerDay === cnt
                      ? "card-selected-glow bg-[#102831] text-[#28DACC]"
                      : "bg-[#07151D]/60 border-[#28525B]/60 text-[#A8C5CA]"
                  }`}
                >
                  {cnt}
                </button>
              ))}
              <span className="text-xs text-[#A8C5CA] ml-2">meals / day</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSaved(true)}
            className="w-full h-12 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold shadow-[0_0_15px_rgba(40,218,204,0.3)] active:scale-95 transition-all hover:bg-[#41E9DC]"
          >
            {isSaved ? "✓ Preferences Stored" : "Save Nutrition Settings"}
          </button>
        </div>
      </div>

      {/* SAMPLE DAILY SCHEDULE (GENERAL GUIDANCE) */}
      <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#F4F9FA] flex items-center gap-2">
            <Clock size={16} className="text-[#28DACC]" />
            <span>Sample Meal Timing (General Guidance)</span>
          </h3>
          <span className="text-[10px] font-mono text-[#A8C5CA] px-2 py-0.5 rounded-md bg-[#102831]">
            General Guidance Only
          </span>
        </div>

        <div className="space-y-3">
          {[
            {
              time: "08:00 AM",
              name: "Meal 1: High Protein Breakfast",
              example: "Greek yogurt bowl with berries, chia seeds, and rolled oats (or egg scramble).",
              macros: "Est. 30g Protein · 45g Carbs · 12g Fat"
            },
            {
              time: "01:00 PM",
              name: "Meal 2: Post-Training Fuel",
              example: "Grilled chicken or tofu bowl with brown rice, steamed broccoli, and avocado.",
              macros: "Est. 38g Protein · 55g Carbs · 14g Fat"
            },
            {
              time: "07:30 PM",
              name: "Meal 3: Recovery Dinner",
              example: "Salmon fillet or lentil curry with sweet potato and mixed greens.",
              macros: "Est. 32g Protein · 40g Carbs · 16g Fat"
            }
          ].map((meal, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#102831] border border-[#28525B]/50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold text-[#28DACC]">
                  {meal.time}
                </span>
                <span className="text-[10px] font-mono text-[#A8C5CA]">
                  {meal.macros}
                </span>
              </div>
              <div className="text-sm font-semibold text-[#F4F9FA]">{meal.name}</div>
              <div className="text-xs text-[#A8C5CA] mt-1">{meal.example}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
