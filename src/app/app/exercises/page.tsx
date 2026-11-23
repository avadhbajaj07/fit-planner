"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  SlidersHorizontal,
  Home,
  Building2,
  Layers
} from "lucide-react";
import { IosNavBar } from "@/components/layout/IosNavBar";
import { MASTER_EXERCISE_LIBRARY, REPDB_ATTRIBUTION, filterMasterExercises } from "@/lib/data/exerciseLibrary";
import { Exercise, MuscleGroup, EquipmentOption } from "@/lib/engine/types";

const MUSCLE_OPTIONS: { id: MuscleGroup | "all"; label: string }[] = [
  { id: "all", label: "All Muscles" },
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "shoulders", label: "Shoulders" },
  { id: "arms", label: "Arms" },
  { id: "legs", label: "Legs" },
  { id: "core", label: "Core" }
];

const EQUIPMENT_OPTIONS: { id: EquipmentOption | "all"; label: string }[] = [
  { id: "all", label: "All Equipment" },
  { id: "bodyweight", label: "Bodyweight Only" },
  { id: "dumbbells", label: "Dumbbells" },
  { id: "resistance_bands", label: "Bands" },
  { id: "basic_home_gym", label: "Home Gym" },
  { id: "fully_equipped_gym", label: "Full Gym / Machines" }
];

const CATEGORY_OPTIONS = [
  { id: "all", label: "All Types" },
  { id: "strength", label: "Strength" },
  { id: "stretching", label: "Stretching & Mobility" },
  { id: "cardio", label: "Cardio & Conditioning" },
  { id: "plyometrics", label: "Plyometrics" }
];

export default function ExerciseLibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">("all");
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOption | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [homeOnly, setHomeOnly] = useState(false);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<"start" | "peak" | "main">("start");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination for fast rendering of 708 exercises
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const filteredExercises = useMemo(() => {
    return filterMasterExercises({
      search,
      primaryMuscle: selectedMuscle,
      equipment: selectedEquipment,
      category: selectedCategory,
      isHomeOnly: homeOnly
    });
  }, [search, selectedMuscle, selectedEquipment, selectedCategory, homeOnly]);

  const totalPages = Math.ceil(filteredExercises.length / pageSize);
  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredExercises.slice(start, start + pageSize);
  }, [filteredExercises, page]);

  // Reset to page 1 whenever search or filters change
  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value);
    setPage(1);
  };

  const openExerciseDetail = (ex: Exercise) => {
    setActiveExercise(ex);
    if (ex.startImage) {
      setActiveImageTab("start");
    } else {
      setActiveImageTab("main");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bg)] pb-24 text-[var(--tx)]">
      {/* Top Navigation */}
      <IosNavBar title="Exercise Library" backHref="/app/today" />

      <main className="max-w-6xl w-full mx-auto px-4 pt-4 space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--bd)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--prx)]">
                Master Exercise System
              </span>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[var(--prt)] text-[var(--prx)]">
                {filteredExercises.length} Movements
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">
              Master Exercise Library
            </h1>
            <p className="text-xs text-[var(--mu)] mt-1">
              Browse 708 verified movement patterns with start and peak WebP illustrations.
            </p>
          </div>

          {/* RepDB Attribution Badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--bd)] text-xs text-[var(--mu)] self-start md:self-auto shadow-sm">
            <span>Data by</span>
            <a
              href="https://repdb.co"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[var(--prx)] hover:underline inline-flex items-center gap-1"
            >
              RepDB (repdb.co)
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--mu)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              placeholder="Search exercise, muscle (e.g. lats, quads), or equipment..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--card)] border border-[var(--bd)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pr)] text-[var(--tx)] placeholder:text-[var(--mu)] shadow-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleFilterChange(setSearch, "")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--mu)] hover:text-[var(--tx)]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Filters: Location Toggle + Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Home Only Toggle Pill */}
            <button
              type="button"
              onClick={() => handleFilterChange(setHomeOnly, !homeOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                homeOnly
                  ? "bg-[#008361] text-white border-[#008361]"
                  : "bg-[var(--card)] text-[var(--mu)] border-[var(--bd)] hover:text-[var(--tx)]"
              }`}
            >
              <Home size={14} />
              <span>Home-Friendly Only</span>
            </button>

            {/* Muscle Group Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {MUSCLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleFilterChange(setSelectedMuscle, opt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                    selectedMuscle === opt.id
                      ? "bg-[var(--pr)] text-white border-[var(--pr)]"
                      : "bg-[var(--card)] text-[var(--mu)] border-[var(--bd)] hover:text-[var(--tx)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters: Equipment & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--mu)] shrink-0 font-medium">Equipment:</span>
              <select
                value={selectedEquipment}
                onChange={(e) => handleFilterChange(setSelectedEquipment, e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl bg-[var(--card)] border border-[var(--bd)] text-[var(--tx)] focus:outline-none focus:ring-1 focus:ring-[var(--pr)]"
              >
                {EQUIPMENT_OPTIONS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--mu)] shrink-0 font-medium">Type:</span>
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl bg-[var(--card)] border border-[var(--bd)] text-[var(--tx)] focus:outline-none focus:ring-1 focus:ring-[var(--pr)]"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Current Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-[var(--mu)] pt-1">
          <span>
            Showing <strong className="text-[var(--tx)]">{paginatedExercises.length}</strong> of{" "}
            <strong className="text-[var(--tx)]">{filteredExercises.length}</strong> exercises
          </span>
          {(search || selectedMuscle !== "all" || selectedEquipment !== "all" || selectedCategory !== "all" || homeOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedMuscle("all");
                setSelectedEquipment("all");
                setSelectedCategory("all");
                setHomeOnly(false);
                setPage(1);
              }}
              className="text-[var(--prx)] hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Exercise Cards Grid */}
        {paginatedExercises.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--bd)] space-y-3">
            <Dumbbell size={36} className="mx-auto text-[var(--mu)] opacity-40" />
            <h3 className="text-base font-bold text-[var(--tx)]">No exercises match your filters</h3>
            <p className="text-xs text-[var(--mu)] max-w-sm mx-auto">
              Try clearing the search query or selecting a broader muscle group or equipment category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedExercises.map((ex) => {
              const displayImage = ex.startImage || ex.mainImage || ex.peakImage;
              const hasTwoImages = Boolean(ex.startImage && ex.peakImage);

              return (
                <div
                  key={ex.id}
                  onClick={() => openExerciseDetail(ex)}
                  className="group cursor-pointer rounded-2xl bg-[var(--card)] border border-[var(--bd)] overflow-hidden shadow-sm hover:shadow-md hover:border-[var(--pr)]/50 transition-all flex flex-col justify-between"
                >
                  {/* Card Image Thumbnail */}
                  <div className="relative w-full aspect-square bg-[#D8F1FD] flex items-center justify-center overflow-hidden border-b border-[var(--bd)]">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={ex.name}
                        loading="lazy"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Dumbbell size={36} className="text-[#07151D]/30" />
                    )}

                    {/* Image count pill */}
                    {hasTwoImages && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90">
                        2 frames
                      </span>
                    )}

                    {/* Difficulty Badge */}
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ex.difficulty === "beginner"
                          ? "bg-[#008361]/80 text-white"
                          : ex.difficulty === "intermediate"
                          ? "bg-[#673DE6]/80 text-white"
                          : "bg-[#D63163]/80 text-white"
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm tracking-tight text-[var(--tx)] group-hover:text-[var(--prx)] transition-colors line-clamp-1">
                        {ex.name}
                      </h3>
                      <p className="text-xs text-[var(--mu)] mt-0.5 line-clamp-2">
                        {ex.description || "Clinically vetted RepDB movement instruction."}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--bd)] flex items-center justify-between text-[11px]">
                      <span className="font-medium px-2 py-0.5 rounded-full bg-[var(--prt)] text-[var(--prx)] capitalize">
                        {ex.primaryMuscles.join(", ")}
                      </span>
                      <span className="text-[var(--mu)] capitalize font-mono text-[10px]">
                        {ex.rawEquipment || "Bodyweight"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="p-2 rounded-xl bg-[var(--card)] border border-[var(--bd)] text-[var(--tx)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--prt)]"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-xs font-semibold px-4 text-[var(--mu)]">
              Page <strong className="text-[var(--tx)]">{page}</strong> of{" "}
              <strong className="text-[var(--tx)]">{totalPages}</strong>
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="p-2 rounded-xl bg-[var(--card)] border border-[var(--bd)] text-[var(--tx)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--prt)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Footer Legal & RepDB Attribution Card */}
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--bd)] text-xs text-[var(--mu)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div>
            <span className="font-semibold text-[var(--tx)]">RepDB Dataset Integration</span>
            <p className="mt-0.5">
              Exercise illustrations, instructions, and mechanical classifications provided under the RepDB Free Tier license.
            </p>
          </div>
          <a
            href="https://repdb.co"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[var(--pr)] text-white font-medium hover:opacity-90 inline-flex items-center gap-1.5 shrink-0"
          >
            Visit RepDB.co
            <ExternalLink size={13} />
          </a>
        </div>
      </main>

      {/* Exercise Detail Modal / Slide-Up Sheet */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--card)] border border-[var(--bd)] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[var(--tx)] select-none animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--bd)] flex items-center justify-between shrink-0">
              <div className="pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--prx)]">
                    {activeExercise.category || "Strength"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      activeExercise.difficulty === "beginner"
                        ? "bg-[#008361]/20 text-[#008361]"
                        : activeExercise.difficulty === "intermediate"
                        ? "bg-[#673DE6]/20 text-[#673DE6]"
                        : "bg-[#D63163]/20 text-[#D63163]"
                    }`}
                  >
                    {activeExercise.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight mt-1 text-[var(--tx)]">
                  {activeExercise.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveExercise(null)}
                className="w-9 h-9 rounded-full bg-[var(--bg)] border border-[var(--bd)] flex items-center justify-center text-[var(--mu)] hover:text-[var(--tx)] transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-5 space-y-6 no-scrollbar">
              {/* Illustration Showcase */}
              <div className="space-y-3">
                {/* Frame Switcher for 2-image exercises */}
                {activeExercise.startImage && activeExercise.peakImage && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveImageTab("start")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        activeImageTab === "start"
                          ? "bg-[var(--pr)] text-white shadow-sm"
                          : "bg-[var(--bg)] text-[var(--mu)] border border-[var(--bd)]"
                      }`}
                    >
                      1. Start Position
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageTab("peak")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        activeImageTab === "peak"
                          ? "bg-[var(--pr)] text-white shadow-sm"
                          : "bg-[var(--bg)] text-[var(--mu)] border border-[var(--bd)]"
                      }`}
                    >
                      2. Peak Contraction
                    </button>
                  </div>
                )}

                {/* Illustration Frame */}
                <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-[#D8F1FD] rounded-2xl border border-[var(--bd)] flex items-center justify-center overflow-hidden shadow-inner">
                  {activeImageTab === "start" && activeExercise.startImage && (
                    <img
                      src={activeExercise.startImage}
                      alt={`${activeExercise.name} - Start Position`}
                      className="object-contain w-full h-full"
                    />
                  )}
                  {activeImageTab === "peak" && activeExercise.peakImage && (
                    <img
                      src={activeExercise.peakImage}
                      alt={`${activeExercise.name} - Peak Contraction`}
                      className="object-contain w-full h-full"
                    />
                  )}
                  {activeImageTab === "main" && activeExercise.mainImage && (
                    <img
                      src={activeExercise.mainImage}
                      alt={activeExercise.name}
                      className="object-contain w-full h-full"
                    />
                  )}
                </div>

                {/* Attribution link below image */}
                <div className="flex items-center justify-between text-[11px] text-[var(--mu)] px-1">
                  <span>RepDB Verified WebP Illustration</span>
                  <a
                    href="https://repdb.co"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--prx)] hover:underline inline-flex items-center gap-1"
                  >
                    RepDB (repdb.co)
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              {/* Badges / Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--mu)]">Primary Muscle</div>
                  <div className="text-xs font-bold text-[var(--tx)] mt-0.5 capitalize">
                    {activeExercise.primaryMuscles.join(", ")}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--mu)]">Equipment</div>
                  <div className="text-xs font-bold text-[var(--tx)] mt-0.5 capitalize">
                    {activeExercise.rawEquipment || "Bodyweight"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--mu)]">Mechanics</div>
                  <div className="text-xs font-bold text-[var(--tx)] mt-0.5 capitalize">
                    {activeExercise.mechanic || "Compound"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--bd)]">
                  <div className="text-[10px] uppercase font-bold text-[var(--mu)]">Force Type</div>
                  <div className="text-xs font-bold text-[var(--tx)] mt-0.5 capitalize">
                    {activeExercise.forceType || "Push"}
                  </div>
                </div>
              </div>

              {/* Description */}
              {activeExercise.description && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--mu)]">Overview</h4>
                  <p className="text-sm text-[var(--tx)] leading-relaxed">
                    {activeExercise.description}
                  </p>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              {activeExercise.instructions && activeExercise.instructions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--mu)]">
                    Step-by-Step Execution
                  </h4>
                  <ol className="space-y-2 text-sm text-[var(--tx)]">
                    {activeExercise.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[var(--prt)] text-[var(--prx)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Form Tips */}
              {activeExercise.tips && activeExercise.tips.length > 0 && (
                <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--bd)] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--prx)]">
                    <Sparkles size={14} />
                    <span>Coach Technique Tips</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--tx)]">
                    {activeExercise.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--prx)]">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Notes */}
              {activeExercise.safetyNotes && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Info size={14} />
                    <span>Safety Note</span>
                  </div>
                  <p>{activeExercise.safetyNotes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--bd)] bg-[var(--card)] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveExercise(null)}
                className="px-4 py-2.5 rounded-xl border border-[var(--bd)] text-xs font-bold text-[var(--mu)] hover:text-[var(--tx)]"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast(`"${activeExercise.name}" pinned to your active training notes!`);
                }}
                className="px-5 py-2.5 rounded-xl bg-[var(--pr)] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 size={15} />
                <span>Add to My Routine</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1D1E20] text-white text-xs font-semibold shadow-2xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-[#008361]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
