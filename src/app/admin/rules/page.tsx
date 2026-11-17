"use client";

import React, { useState } from "react";
import {
  Sliders,
  CheckCircle2,
  Save,
  ShieldCheck,
  Sparkles,
  Layers,
  Clock
} from "lucide-react";

export default function AdminRulesPage() {
  const [splitRules, setSplitRules] = useState([
    { days: "2 to 3 Days / Week", split: "Full Body Strength", rationale: "Maximizes compound stimulus & recovery spacing." },
    { days: "4 Days / Week", split: "Upper / Lower Rotation", rationale: "2 Upper Body and 2 Lower Body sessions with midweek rest." },
    { days: "5 to 6 Days / Week", split: "Push / Pull / Legs (PPL)", rationale: "High frequency isolated stimulus for experienced athletes." }
  ]);

  const [repRules, setRepRules] = useState([
    { goal: "Build Muscle & Strength", repRange: "8-10 reps", sets: "3-4 sets", rest: "90s", tempo: "Hypertrophy progressive tension" },
    { goal: "Lose Weight & Body Fat", repRange: "12-15 reps", sets: "3 sets", rest: "50s", tempo: "High metabolic density & pacing" },
    { goal: "Maintain & Longevity", repRange: "10-12 reps", sets: "3 sets", rest: "60s", tempo: "Balanced posture and joint integrity" }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/40">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            Engine Calibration
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-0.5">
            Recommendation Rules &amp; Templates
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold hover:bg-[#41E9DC] active:scale-95 transition-all shadow-[0_0_15px_rgba(40,218,204,0.3)]"
        >
          <Save size={14} />
          <span>{isSaved ? "Rules Published ✓" : "Save Rule Weights"}</span>
        </button>
      </div>

      {/* RULE SECTION 1: FREQUENCY TO SPLIT MAPPING */}
      <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B] space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#28DACC]" />
          <h3 className="text-base font-bold text-[#F4F9FA]">
            Rule Set 1: Weekly Frequency &rarr; Split Allocation
          </h3>
        </div>
        <p className="text-xs text-[#A8C5CA]">
          Deterministic mapping governing which training split is prescribed from reported frequency:
        </p>

        <div className="space-y-2.5">
          {splitRules.map((r, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div>
                <span className="text-xs font-mono font-bold text-[#28DACC]">{r.days}</span>
                <span className="text-sm font-semibold text-[#F4F9FA] ml-3">&rarr; {r.split}</span>
              </div>
              <span className="text-xs text-[#A8C5CA] font-mono">{r.rationale}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RULE SECTION 2: GOAL TO REPS & REST */}
      <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B] space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-[#28DACC]" />
          <h3 className="text-base font-bold text-[#F4F9FA]">
            Rule Set 2: Goal &rarr; Volume, Rep Ranges &amp; Rest Density
          </h3>
        </div>
        <p className="text-xs text-[#A8C5CA]">
          Calibrates the physiological stimulus matching primary training objectives:
        </p>

        <div className="space-y-2.5">
          {repRules.map((r, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-[#F4F9FA] text-sm">{r.goal}</div>
                <div className="text-[11px] text-[#A8C5CA] mt-0.5">{r.tempo}</div>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-[#28DACC] font-semibold">{r.repRange}</span>
                <span className="text-[#A8C5CA]">·</span>
                <span className="text-[#F4F9FA]">{r.sets}</span>
                <span className="text-[#A8C5CA]">·</span>
                <span className="text-[#28DACC]">{r.rest} rest</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
