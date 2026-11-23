"use client";

import React, { useState, useMemo } from "react";
import {
  Dumbbell,
  Search,
  Plus,
  ShieldAlert,
  CheckCircle2,
  X,
  Edit2,
  Filter,
  ExternalLink,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye
} from "lucide-react";
import { MASTER_EXERCISE_LIBRARY, REPDB_ATTRIBUTION } from "@/lib/data/exerciseLibrary";
import { Exercise, MuscleGroup, EquipmentOption } from "@/lib/engine/types";
import { supabase } from "@/lib/supabase/client";

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(MASTER_EXERCISE_LIBRARY);
  const [search, setSearch] = useState("");
  const [filterMuscle, setFilterMuscle] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending_review" | "rejected">("all");
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);
  const [viewingEx, setViewingEx] = useState<Exercise | null>(null);

  // Pagination for administrative view
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Counts by review status
  const counts = useMemo(() => {
    let approved = 0;
    let pending = 0;
    let rejected = 0;
    for (const ex of exercises) {
      if (ex.reviewStatus === "approved") approved++;
      else if (ex.reviewStatus === "rejected") rejected++;
      else pending++;
    }
    return { all: exercises.length, approved, pending, rejected };
  }, [exercises]);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        (ex.rawEquipment || "").toLowerCase().includes(q) ||
        ex.equipmentNeeded.some((eq) => eq.toLowerCase().includes(q)) ||
        ex.contraindications.some((c) => c.toLowerCase().includes(q));

      const matchesMuscle =
        filterMuscle === "all" || ex.primaryMuscles.includes(filterMuscle as MuscleGroup);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending_review" && (ex.reviewStatus === "pending_review" || !ex.reviewStatus)) ||
        ex.reviewStatus === statusFilter;

      return matchesSearch && matchesMuscle && matchesStatus;
    });
  }, [exercises, search, filterMuscle, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const handleStatusChange = (id: string, status: "approved" | "pending_review" | "rejected") => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, reviewStatus: status } : e))
    );
    if (supabase) {
      Promise.resolve(
        supabase
          .from("exercises")
          .update({ review_status: status, updated_at: new Date().toISOString() })
          .eq("id", id)
      ).catch((err: unknown) => console.warn("Supabase exercise status update failed:", err));
    }
  };

  const handleSaveExercise = (updated: Exercise) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    if (supabase) {
      Promise.resolve(
        supabase
          .from("exercises")
          .update({
            name: updated.name,
            description: updated.description,
            safety_notes: updated.safetyNotes,
            review_status: updated.reviewStatus,
            updated_at: new Date().toISOString()
          })
          .eq("id", updated.id)
      ).catch((err: unknown) => console.warn("Supabase exercise update failed:", err));
    }
    setEditingEx(null);
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/40">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            Library Administration & Review Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-0.5">
            Master Exercise Library ({exercises.length} Total)
          </h1>
          <p className="text-xs text-[#A8C5CA] mt-1">
            RepDB clinical exercise library: approve vetted movements, inspect start/peak frames, and update coaching cues.
          </p>
        </div>

        {/* RepDB Attribution Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#102831] border border-[#28525B] text-xs text-[#A8C5CA]">
          <span>Data by</span>
          <a
            href={REPDB_ATTRIBUTION.url}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[#28DACC] hover:underline inline-flex items-center gap-1"
          >
            RepDB (repdb.co)
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Review Status Counters / Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition-all ${
            statusFilter === "all"
              ? "bg-[#142D35] border-[#28DACC] shadow-[0_0_15px_rgba(40,218,204,0.15)]"
              : "bg-[#102831] border-[#28525B]/60 hover:bg-[#142D35]/50"
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-[#A8C5CA]">All Records</div>
          <div className="text-xl font-bold num-mono text-[#F4F9FA] mt-0.5">{counts.all}</div>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter("approved");
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition-all ${
            statusFilter === "approved"
              ? "bg-[#008361]/20 border-[#008361] shadow-[0_0_15px_rgba(0,131,97,0.2)]"
              : "bg-[#102831] border-[#28525B]/60 hover:bg-[#142D35]/50"
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-[#008361]">Approved (Active)</div>
          <div className="text-xl font-bold num-mono text-[#008361] mt-0.5">{counts.approved}</div>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter("pending_review");
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition-all ${
            statusFilter === "pending_review"
              ? "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              : "bg-[#102831] border-[#28525B]/60 hover:bg-[#142D35]/50"
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-amber-400">Pending Review</div>
          <div className="text-xl font-bold num-mono text-amber-400 mt-0.5">{counts.pending}</div>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter("rejected");
            setPage(1);
          }}
          className={`p-3 rounded-2xl border text-left transition-all ${
            statusFilter === "rejected"
              ? "bg-rose-500/20 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              : "bg-[#102831] border-[#28525B]/60 hover:bg-[#142D35]/50"
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-rose-400">Rejected</div>
          <div className="text-xl font-bold num-mono text-rose-400 mt-0.5">{counts.rejected}</div>
        </button>
      </div>

      {/* Search & Muscle Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8C5CA]" />
          <input
            type="text"
            placeholder="Search exercises, equipment, muscles, tags..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#102831] border border-[#28525B] pl-10 pr-4 py-2.5 rounded-2xl text-xs text-[#F4F9FA] outline-none focus:border-[#28DACC]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {["all", "chest", "back", "shoulders", "arms", "legs", "core"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setFilterMuscle(m);
                setPage(1);
              }}
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

      {/* Results Count & Quick Actions */}
      <div className="flex items-center justify-between text-xs text-[#A8C5CA]">
        <span>
          Showing <strong className="text-[#F4F9FA]">{paginated.length}</strong> of{" "}
          <strong className="text-[#F4F9FA]">{filtered.length}</strong> matching records
        </span>
        <button
          type="button"
          onClick={() => {
            // Bulk approve currently filtered
            setExercises((prev) =>
              prev.map((e) =>
                filtered.some((f) => f.id === e.id)
                  ? { ...e, reviewStatus: "approved" }
                  : e
              )
            );
          }}
          className="text-xs text-[#28DACC] hover:underline font-mono"
        >
          Approve all {filtered.length} displayed
        </button>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((ex) => {
          const thumbnail = ex.mainImage || ex.startImage || ex.peakImage;
          const status = ex.reviewStatus || "pending_review";

          return (
            <div
              key={ex.id}
              className="ios-glass-card rounded-2xl p-4 border border-[#28525B] flex flex-col justify-between hover:border-[#28DACC]/50 transition-colors"
            >
              <div>
                {/* Thumbnail & Status Row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-xl bg-[#D8F1FD] border border-[#28525B] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={ex.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Dumbbell size={24} className="text-[#07151D]/30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono uppercase text-[#28DACC] px-1.5 py-0.5 rounded bg-[#102831] border border-[#28525B]">
                        {ex.primaryMuscles[0] || "General"}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          status === "approved"
                            ? "bg-[#008361]/20 text-[#008361] border border-[#008361]/40"
                            : status === "rejected"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        }`}
                      >
                        {status.replace("_", " ")}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F4F9FA] truncate">{ex.name}</h4>
                    <span className="text-[10px] text-[#A8C5CA] font-mono capitalize">
                      {ex.rawEquipment || "Bodyweight"} · {ex.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#A8C5CA] line-clamp-2 leading-relaxed">
                  {ex.description || "RepDB imported movement protocol."}
                </p>

                {/* Contraindications Warning */}
                {ex.contraindications.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-1 text-[10px] text-[#FFB020] font-mono">
                    <ShieldAlert size={11} />
                    <span>Avoid on: {ex.contraindications.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Review Action Controls */}
              <div className="mt-4 pt-3 border-t border-[#28525B]/40 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(ex.id, "approved")}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      status === "approved"
                        ? "bg-[#008361] text-white"
                        : "bg-[#102831] text-[#008361] border border-[#008361]/30 hover:bg-[#008361]/20"
                    }`}
                  >
                    <Check size={11} />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(ex.id, "rejected")}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      status === "rejected"
                        ? "bg-rose-500 text-white"
                        : "bg-[#102831] text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                    }`}
                  >
                    <X size={11} />
                    <span>Reject</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewingEx(ex)}
                    className="p-1.5 rounded-lg bg-[#102831] text-[#A8C5CA] hover:text-[#28DACC] hover:bg-[#142D35]"
                    title="Inspect illustrations & steps"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEx(ex)}
                    className="p-1.5 rounded-lg bg-[#102831] text-[#A8C5CA] hover:text-[#28DACC] hover:bg-[#142D35]"
                    title="Edit exercise metadata"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
            className="p-2 rounded-xl bg-[#102831] border border-[#28525B] text-[#F4F9FA] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#142D35]"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-xs font-semibold px-4 text-[#A8C5CA]">
            Page <strong className="text-[#F4F9FA]">{page}</strong> of{" "}
            <strong className="text-[#F4F9FA]">{totalPages}</strong>
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-2 rounded-xl bg-[#102831] border border-[#28525B] text-[#F4F9FA] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#142D35]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* INSPECT DETAIL MODAL */}
      {viewingEx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-[#102831] border border-[#28525B] rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#28525B]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#28DACC]">
                  RepDB Clinical Inspection
                </span>
                <h3 className="text-lg font-bold text-[#F4F9FA]">{viewingEx.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingEx(null)}
                className="text-[#A8C5CA] hover:text-[#F4F9FA]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Illustrations */}
            <div className="grid grid-cols-2 gap-3">
              {viewingEx.startImage && (
                <div className="space-y-1 text-center">
                  <div className="text-[10px] font-mono text-[#A8C5CA]">Frame 1: Start</div>
                  <div className="aspect-square bg-[#D8F1FD] rounded-xl border border-[#28525B] flex items-center justify-center overflow-hidden">
                    <img src={viewingEx.startImage} alt="Start" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
              {viewingEx.peakImage && (
                <div className="space-y-1 text-center">
                  <div className="text-[10px] font-mono text-[#A8C5CA]">Frame 2: Peak</div>
                  <div className="aspect-square bg-[#D8F1FD] rounded-xl border border-[#28525B] flex items-center justify-center overflow-hidden">
                    <img src={viewingEx.peakImage} alt="Peak" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
              {!viewingEx.startImage && viewingEx.mainImage && (
                <div className="col-span-2 space-y-1 text-center">
                  <div className="text-[10px] font-mono text-[#A8C5CA]">Main Illustration</div>
                  <div className="aspect-square max-w-[260px] mx-auto bg-[#D8F1FD] rounded-xl border border-[#28525B] flex items-center justify-center overflow-hidden">
                    <img src={viewingEx.mainImage} alt="Main" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            {viewingEx.instructions && viewingEx.instructions.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-mono uppercase text-[#A8C5CA]">Instructions</div>
                <ol className="space-y-1 text-xs text-[#F4F9FA] list-decimal list-inside leading-relaxed">
                  {viewingEx.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Tips */}
            {viewingEx.tips && viewingEx.tips.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-mono uppercase text-[#28DACC]">Form Tips</div>
                <ul className="space-y-1 text-xs text-[#A8C5CA] list-disc list-inside leading-relaxed">
                  {viewingEx.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-[#28525B] flex items-center justify-between">
              <span className="text-[10px] text-[#A8C5CA]">
                Attribution: Exercise data by RepDB (repdb.co)
              </span>
              <button
                type="button"
                onClick={() => setViewingEx(null)}
                className="px-4 py-2 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingEx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#102831] border border-[#28525B] rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#F4F9FA]">Edit Exercise Metadata</h3>
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

              <div>
                <label className="text-[10px] font-mono uppercase text-[#A8C5CA] block mb-1">
                  Review Status
                </label>
                <select
                  value={editingEx.reviewStatus || "pending_review"}
                  onChange={(e) =>
                    setEditingEx({
                      ...editingEx,
                      reviewStatus: e.target.value as "approved" | "pending_review" | "rejected"
                    })
                  }
                  className="w-full bg-[#07151D] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none"
                >
                  <option value="approved">Approved (Active for Plan Engine)</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="rejected">Rejected</option>
                </select>
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
