"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Search,
  Plus,
  ShieldAlert,
  CheckCircle2,
  X,
  Edit2,
  Filter
} from "lucide-react";
import { EXERCISE_LIBRARY } from "@/lib/engine/exercises";
import { Exercise, MuscleGroup, EquipmentOption, RestrictionType } from "@/lib/engine/types";

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(EXERCISE_LIBRARY);
  const [search, setSearch] = useState("");
  const [filterMuscle, setFilterMuscle] = useState<string>("all");
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);

  const filtered = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.equipmentNeeded.some((eq) => eq.toLowerCase().includes(search.toLowerCase())) ||
      ex.contraindications.some((c) => c.toLowerCase().includes(search.toLowerCase()));

    const matchesMuscle =
      filterMuscle === "all" || ex.primaryMuscles.includes(filterMuscle as MuscleGroup);

    return matchesSearch && matchesMuscle;
  });

  const handleSaveExercise = (updated: Exercise) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    setEditingEx(null);
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/40">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            Library Administration
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-0.5">
            Exercise Library ({exercises.length} Approved)
          </h1>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingEx({
              id: `ex_${Date.now()}`,
              name: "New Movement",
              description: "Custom exercise description.",
              primaryMuscles: ["chest"],
              secondaryMuscles: [],
              equipmentNeeded: ["bodyweight"],
              difficulty: "beginner",
              instructions: ["Instruction 1"],
              commonMistakes: [],
              contraindications: [],
              isLowImpact: true,
              alternativeExerciseIds: [],
              defaultSets: 3,
              defaultReps: "10-12",
              defaultRestSeconds: 60
            })
          }
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold shadow-[0_0_15px_rgba(40,218,204,0.3)] active:scale-95 transition-all"
        >
          <Plus size={15} />
          <span>Add Exercise</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8C5CA]" />
          <input
            type="text"
            placeholder="Search exercises, equipment, contraindications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#102831] border border-[#28525B] pl-10 pr-4 py-2.5 rounded-2xl text-xs text-[#F4F9FA] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {["all", "chest", "back", "shoulders", "arms", "legs", "core"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setFilterMuscle(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filterMuscle === m
                  ? "bg-[#28DACC] text-[#07151D] font-bold"
                  : "bg-[#102831] border border-[#28525B] text-[#A8C5CA]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="ios-glass-card rounded-2xl p-4 border border-[#28525B] flex flex-col justify-between hover:border-[#28DACC]/50 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase text-[#28DACC] px-2 py-0.5 rounded-md bg-[#102831] border border-[#28525B]">
                  {ex.primaryMuscles.join(", ")}
                </span>
                <span className="text-[10px] text-[#A8C5CA] font-mono capitalize">
                  {ex.difficulty}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#F4F9FA]">{ex.name}</h4>
              <p className="text-xs text-[#A8C5CA] mt-1 line-clamp-2 leading-relaxed">
                {ex.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-[#07151D] text-[#A8C5CA]">
                  {ex.equipmentNeeded.join(", ").replace(/_/g, " ")}
                </span>
                {ex.contraindications.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30 flex items-center gap-1">
                    <ShieldAlert size={10} />
                    <span>Avoid: {ex.contraindications.join(", ")}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#28525B]/40 flex items-center justify-between text-xs">
              <span className="text-xs font-mono num-mono text-[#28DACC]">
                {ex.defaultSets} sets × {ex.defaultReps}
              </span>
              <button
                type="button"
                onClick={() => setEditingEx(ex)}
                className="px-2.5 py-1 rounded-lg bg-[#102831] hover:bg-[#28DACC] hover:text-[#07151D] text-xs font-semibold text-[#A8C5CA] transition-all flex items-center gap-1"
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingEx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#102831] border border-[#28525B] rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#F4F9FA]">Edit Exercise</h3>
              <button
                type="button"
                onClick={() => setEditingEx(null)}
                className="text-[#A8C5CA] hover:text-[#F4F9FA]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingEx.name}
                  onChange={(e) => setEditingEx({ ...editingEx, name: e.target.value })}
                  className="w-full bg-[#07151D] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingEx.description}
                  onChange={(e) => setEditingEx({ ...editingEx, description: e.target.value })}
                  className="w-full bg-[#07151D] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                  Safety Notes (Contraindications)
                </label>
                <input
                  type="text"
                  value={editingEx.safetyNotes || ""}
                  onChange={(e) => setEditingEx({ ...editingEx, safetyNotes: e.target.value })}
                  placeholder="e.g. Keep wrists neutral..."
                  className="w-full bg-[#07151D] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEx(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#07151D] border border-[#28525B] text-xs font-semibold text-[#A8C5CA]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveExercise(editingEx)}
                  className="flex-1 py-2.5 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold shadow-[0_0_12px_rgba(40,218,204,0.3)]"
                >
                  Save Movement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
