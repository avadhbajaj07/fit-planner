"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import {
  TrendingDown,
  Calendar,
  CheckCircle,
  Plus,
  Scale,
  Award,
  Flame,
  Info
} from "lucide-react";
import { IosNavBar } from "@/components/layout/IosNavBar";

interface WeightEntry {
  date: string;
  weight: number;
}

const INITIAL_WEIGHT_LOG: WeightEntry[] = [
  { date: "Oct 20", weight: 75.8 },
  { date: "Oct 27", weight: 75.4 },
  { date: "Nov 03", weight: 74.9 },
  { date: "Nov 10", weight: 74.5 },
  { date: "Nov 17", weight: 74.2 }
];

export default function ProgressPage() {
  const [weightLogs, setWeightLogs] = useState<WeightEntry[]>(INITIAL_WEIGHT_LOG);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState("74.0");

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (!val || isNaN(val)) return;

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
    setWeightLogs([...weightLogs, { date: todayStr, weight: val }]);
    setShowAddModal(false);
  };

  const currentWeight = weightLogs[weightLogs.length - 1].weight;
  const startWeight = weightLogs[0].weight;
  const weightChange = (currentWeight - startWeight).toFixed(1);

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
      <IosNavBar
        title="Progress Tracker"
        subtitle="Consistency, weight trend, and workout volume"
        action={
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#28DACC] text-[#07151D] text-xs font-bold active:scale-95 transition-all shadow-[0_0_12px_rgba(40,218,204,0.3)]"
          >
            <Plus size={14} />
            <span>Log Weight</span>
          </button>
        }
      />

      {/* Demo data badge */}
      <div className="p-3 rounded-2xl bg-[#102831] border border-[#28525B]/60 flex items-center gap-2.5 text-xs text-[#A8C5CA]">
        <Info size={16} className="text-[#28DACC] shrink-0" />
        <span>
          <span className="font-semibold text-[#F4F9FA]">Demo Data:</span> Sample training trajectory shown. Real log updates persist in your browser session.
        </span>
      </div>

      {/* Visual Metric Banner */}
      <div className="rounded-3xl overflow-hidden border border-[#222222] relative h-36 bg-[#0E0E0E]">
        <img
          src="/images/fit-planner/confident_fitness_waist_measurement_portrait.png"
          alt="Body tracking"
          className="w-full h-full object-cover object-top opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#28DACC]">
            Weekly Metric Analytics
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">Consistent Measurement Pacing</h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">We track rolling 7-day averages to filter out daily water retention fluctuations.</p>
          </div>
        </div>
      </div>

      {/* High-level KPI Bento Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="ios-glass-card rounded-2xl p-4 border border-[#28525B]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8C5CA]">
            <Scale size={13} className="text-[#28DACC]" /> Current Weight
          </div>
          <div className="text-2xl font-bold num-mono text-[#F4F9FA] mt-1.5">
            {currentWeight} <span className="text-xs font-normal text-[#A8C5CA]">kg</span>
          </div>
          <div className="text-[11px] text-[#28DA8B] mt-1 font-mono">
            {weightChange} kg total
          </div>
        </div>

        <div className="ios-glass-card rounded-2xl p-4 border border-[#28525B]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8C5CA]">
            <CheckCircle size={13} className="text-[#28DACC]" /> Sessions Done
          </div>
          <div className="text-2xl font-bold num-mono text-[#F4F9FA] mt-1.5">
            14 <span className="text-xs font-normal text-[#A8C5CA]">total</span>
          </div>
          <div className="text-[11px] text-[#28DA8B] mt-1 font-mono">
            100% adherence
          </div>
        </div>

        <div className="ios-glass-card rounded-2xl p-4 border border-[#28525B]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8C5CA]">
            <Flame size={13} className="text-[#FFB020]" /> Active Streak
          </div>
          <div className="text-2xl font-bold num-mono text-[#F4F9FA] mt-1.5">
            3 <span className="text-xs font-normal text-[#A8C5CA]">weeks</span>
          </div>
          <div className="text-[11px] text-[#A8C5CA] mt-1 font-mono">
            Unbroken
          </div>
        </div>

        <div className="ios-glass-card rounded-2xl p-4 border border-[#28525B]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8C5CA]">
            <Award size={13} className="text-[#28DACC]" /> Total Sets Logged
          </div>
          <div className="text-2xl font-bold num-mono text-[#28DACC] mt-1.5">
            168
          </div>
          <div className="text-[11px] text-[#A8C5CA] mt-1 font-mono">
            Double progression
          </div>
        </div>
      </div>

      {/* WEIGHT TRACKING RECHARTS GRAPH */}
      <div className="ios-glass-card rounded-3xl p-5 md:p-6 border border-[#28525B]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] uppercase font-mono tracking-wider text-[#A8C5CA]">
              Bodyweight Trend
            </span>
            <h3 className="text-base font-bold text-[#F4F9FA]">
              Weekly Weigh-In History
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#28DACC] font-mono font-bold">
              Target: 72.0 kg
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28525B" opacity={0.35} />
              <XAxis
                dataKey="date"
                stroke="#A8C5CA"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#28525B" }}
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                stroke="#A8C5CA"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#28525B" }}
                unit="kg"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#102831",
                  borderColor: "#28525B",
                  borderRadius: "12px",
                  color: "#F4F9FA",
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#28DACC"
                strokeWidth={3}
                dot={{ fill: "#28DACC", r: 4 }}
                activeDot={{ r: 6, fill: "#41E9DC" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WORKOUT LOG HISTORY TABLE */}
      <div className="ios-glass-card rounded-3xl p-5 md:p-6 border border-[#28525B]">
        <h3 className="text-base font-bold text-[#F4F9FA] mb-4">
          Recent Completed Sessions (Training Log)
        </h3>

        <div className="space-y-3">
          {[
            { date: "Yesterday, 07:30 AM", title: "Upper Body Focus 1", sets: 14, duration: "42 min", rpe: "RPE 8" },
            { date: "3 days ago, 06:45 PM", title: "Lower Body & Core 1", sets: 12, duration: "38 min", rpe: "RPE 7.5" },
            { date: "5 days ago, 08:00 AM", title: "Push Day Foundations", sets: 15, duration: "45 min", rpe: "RPE 8" }
          ].map((log, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-[#102831] border border-[#28525B]/50 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-[#F4F9FA]">{log.title}</div>
                <div className="text-xs text-[#A8C5CA] mt-0.5">{log.date}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-[#28DACC]">
                  {log.sets} sets · {log.duration}
                </div>
                <div className="text-[10px] text-[#A8C5CA] font-mono">{log.rpe}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOG WEIGHT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#102831] border border-[#28525B] rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#F4F9FA] mb-1">Log Today&apos;s Weight</h3>
            <p className="text-xs text-[#A8C5CA] mb-4">
              Weigh in morning before breakfast for consistent tracking.
            </p>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="ios-inset-group">
                <div className="ios-inset-row">
                  <span className="text-xs text-[#A8C5CA]">Weight (kg)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-24 bg-transparent text-right font-bold num-mono text-lg text-[#28DACC] outline-none"
                    style={{ fontSize: "18px" }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#07151D] border border-[#28525B] text-xs text-[#A8C5CA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold shadow-[0_0_12px_rgba(40,218,204,0.3)]"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
