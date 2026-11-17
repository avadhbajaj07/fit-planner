"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  MoveUp,
  MoveDown,
  Layers,
  Sparkles,
  Edit2
} from "lucide-react";

interface QuestionDef {
  id: string;
  stage: "stage_a" | "stage_b" | "stage_c";
  stepNumber: number;
  title: string;
  description: string;
  type: "single_select" | "multi_select" | "numeric_stepper" | "toggle";
  exclusiveOptionKey?: string;
  options: { key: string; label: string; sub?: string }[];
}

const INITIAL_QUESTIONS: QuestionDef[] = [
  {
    id: "q_gender",
    stage: "stage_a",
    stepNumber: 1,
    title: "What is your gender?",
    description: "Used for baseline metabolic calibration and recovery formulas.",
    type: "single_select",
    options: [
      { key: "male", label: "Male", sub: "Standard masculine hormonal baseline" },
      { key: "female", label: "Female", sub: "Calibrated recovery & cycle-adaptive load" },
      { key: "prefer_not_to_say", label: "Prefer not to say", sub: "Standard balanced parameters" }
    ]
  },
  {
    id: "q_age",
    stage: "stage_a",
    stepNumber: 2,
    title: "How old are you?",
    description: "FIT Planner provides personalized programs strictly for adults 18+.",
    type: "numeric_stepper",
    options: []
  },
  {
    id: "q_goal",
    stage: "stage_a",
    stepNumber: 3,
    title: "What is your primary goal?",
    description: "Shapes the rep ranges, sets, rest intervals, and progression curve.",
    type: "single_select",
    options: [
      { key: "build_muscle", label: "Build Muscle & Strength" },
      { key: "lose_weight", label: "Lose Weight & Body Fat" },
      { key: "gain_weight", label: "Gain Weight & Mass" },
      { key: "improve_fitness", label: "Improve Fitness & Stamina" },
      { key: "maintain", label: "Maintain & Stay Healthy" }
    ]
  },
  {
    id: "q_restrictions",
    stage: "stage_a",
    stepNumber: 9,
    title: "Injuries or joint restrictions?",
    description: "Reported areas will automatically activate Restricted Mode and filter out contraindicated movements.",
    type: "multi_select",
    exclusiveOptionKey: "none",
    options: [
      { key: "none", label: "No Restrictions" },
      { key: "knee", label: "Knee Sensitivity" },
      { key: "back", label: "Lower Back / Spinal Issues" },
      { key: "shoulder", label: "Shoulder / Rotator Cuff" },
      { key: "other", label: "Other Physical Restriction" }
    ]
  }
];

export default function AdminQuestionnairePage() {
  const [questions, setQuestions] = useState<QuestionDef[]>(INITIAL_QUESTIONS);
  const [selectedQ, setSelectedQ] = useState<QuestionDef>(INITIAL_QUESTIONS[0]);
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdateSelected = (updated: Partial<QuestionDef>) => {
    const next = { ...selectedQ, ...updated };
    setSelectedQ(next);
    setQuestions((prev) => prev.map((q) => (q.id === next.id ? next : q)));
    setIsSaved(false);
  };

  const handleSaveAll = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/40">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            Questionnaire Engine
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-0.5">
            Questionnaire Builder &amp; Schema
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#102831] border border-[#28525B] text-[#A8C5CA]">
            Schema Version: 1.2
          </span>
          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold hover:bg-[#41E9DC] active:scale-95 transition-all shadow-[0_0_15px_rgba(40,218,204,0.3)]"
          >
            <Save size={14} />
            <span>{isSaved ? "Saved ✓" : "Publish Changes"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-[#A8C5CA] px-1">
            Configured Questions ({questions.length})
          </div>

          <div className="space-y-2">
            {questions.map((q, idx) => {
              const isSelected = selectedQ.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQ(q)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "card-selected-glow bg-[#142D35]"
                      : "bg-[#102831] border-[#28525B]/60 hover:border-[#28DACC]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#07151D] text-[#28DACC] text-xs font-mono font-bold flex items-center justify-center border border-[#28525B]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#F4F9FA]">{q.title}</div>
                      <div className="text-[10px] text-[#A8C5CA] font-mono capitalize">
                        {q.stage.replace("_", " ")} · {q.type.replace("_", " ")}
                      </div>
                    </div>
                  </div>

                  <Edit2 size={14} className="text-[#A8C5CA]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Question Editor (7 cols) */}
        <div className="lg:col-span-7 ios-glass-card rounded-3xl p-6 border border-[#28525B] space-y-5">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#28DACC]">
              Editing Question: {selectedQ.id}
            </span>
            <h3 className="text-lg font-bold text-[#F4F9FA] mt-0.5">
              Question Configuration
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-1">
                Question Title / Heading
              </label>
              <input
                type="text"
                value={selectedQ.title}
                onChange={(e) => handleUpdateSelected({ title: e.target.value })}
                className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none focus:border-[#28DACC]"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-1">
                Supporting Subtext / Explanation
              </label>
              <textarea
                rows={2}
                value={selectedQ.description}
                onChange={(e) => handleUpdateSelected({ description: e.target.value })}
                className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none focus:border-[#28DACC]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-1">
                  Stage
                </label>
                <select
                  value={selectedQ.stage}
                  onChange={(e) => handleUpdateSelected({ stage: e.target.value as any })}
                  className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none"
                >
                  <option value="stage_a">Stage A (Intake)</option>
                  <option value="stage_b">Stage B (Fine-Tuning)</option>
                  <option value="stage_c">Stage C (Nutrition)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-1">
                  Interaction Type
                </label>
                <select
                  value={selectedQ.type}
                  onChange={(e) => handleUpdateSelected({ type: e.target.value as any })}
                  className="w-full bg-[#102831] border border-[#28525B] p-2.5 rounded-xl text-xs text-[#F4F9FA] outline-none"
                >
                  <option value="single_select">Single Select (Option Cards)</option>
                  <option value="multi_select">Multi Select</option>
                  <option value="numeric_stepper">Numeric Stepper / Range</option>
                </select>
              </div>
            </div>

            {/* Options list for select types */}
            {selectedQ.options.length > 0 && (
              <div>
                <label className="text-xs font-mono uppercase text-[#A8C5CA] block mb-2">
                  Answer Options ({selectedQ.options.length})
                </label>
                <div className="space-y-2">
                  {selectedQ.options.map((opt, i) => (
                    <div
                      key={opt.key}
                      className="p-2.5 rounded-xl bg-[#07151D] border border-[#28525B]/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#F4F9FA]">{opt.label}</span>
                        <span className="text-[10px] text-[#A8C5CA] ml-2 font-mono">
                          key: {opt.key}
                        </span>
                      </div>
                      {selectedQ.exclusiveOptionKey === opt.key && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFB020]/20 text-[#FFB020]">
                          Exclusive
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
