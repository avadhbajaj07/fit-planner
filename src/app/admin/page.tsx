"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Activity,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const MONTHLY_ANALYTICS = [
  { month: "Jun", assessments: 410, completions: 350, revenue: 3200 },
  { month: "Jul", assessments: 580, completions: 490, revenue: 4800 },
  { month: "Aug", assessments: 720, completions: 610, revenue: 6400 },
  { month: "Sep", assessments: 890, completions: 760, revenue: 8100 },
  { month: "Oct", assessments: 1120, completions: 950, revenue: 10400 },
  { month: "Nov", assessments: 1280, completions: 1084, revenue: 12200 }
];

export default function AdminOverviewPage() {
  const [restrictedQueue, setRestrictedQueue] = useState([
    {
      id: "ath_01",
      name: "Marcus Vance",
      email: "m.vance@example.com",
      restriction: "Lower Back (L4-L5 disc)",
      split: "Upper / Lower (Restricted)",
      date: "Today, 10:45 AM",
      status: "pending"
    },
    {
      id: "ath_02",
      name: "Elena Rostova",
      email: "e.rostova@example.ch",
      restriction: "Knee (Patellar Tendonitis)",
      split: "Full Body (Low-Impact)",
      date: "Today, 08:30 AM",
      status: "pending"
    }
  ]);

  const handleApprove = (id: string) => {
    setRestrictedQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
    );
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/40">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            System Telemetry
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-0.5">
            Operations &amp; Aggregated Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#102831] text-[#A8C5CA] border border-[#28525B]">
            Demo data (Aggregated)
          </span>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ios-glass-card rounded-2xl p-4 md:p-5 border border-[#28525B]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A8C5CA]">Total Athletes</span>
            <Users size={16} className="text-[#28DACC]" />
          </div>
          <div className="text-3xl font-bold num-mono text-[#F4F9FA] mt-2">
            1,280
          </div>
          <div className="text-[11px] text-[#28DA8B] mt-1 font-mono flex items-center gap-1">
            <ArrowUpRight size={13} /> +14.2% this month
          </div>
        </div>

        <div className="ios-glass-card rounded-2xl p-4 md:p-5 border border-[#28525B]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A8C5CA]">Completion Rate</span>
            <Sparkles size={16} className="text-[#28DACC]" />
          </div>
          <div className="text-3xl font-bold num-mono text-[#28DACC] mt-2">
            84.7%
          </div>
          <div className="text-[11px] text-[#28DA8B] mt-1 font-mono">
            Stage A 90-sec funnel
          </div>
        </div>

        <div className="ios-glass-card rounded-2xl p-4 md:p-5 border border-[#28525B]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A8C5CA]">Active Subscribers</span>
            <CreditCard size={16} className="text-[#28DACC]" />
          </div>
          <div className="text-3xl font-bold num-mono text-[#F4F9FA] mt-2">
            412
          </div>
          <div className="text-[11px] text-[#A8C5CA] mt-1 font-mono">
            32.1% paid conversion
          </div>
        </div>

        <div className="ios-glass-card rounded-2xl p-4 md:p-5 border border-[#28525B]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A8C5CA]">Monthly Revenue</span>
            <TrendingUp size={16} className="text-[#28DA8B]" />
          </div>
          <div className="text-3xl font-bold num-mono text-[#28DA8B] mt-2">
            €12,200
          </div>
          <div className="text-[11px] text-[#A8C5CA] mt-1 font-mono">
            Stripe &amp; Razorpay combined
          </div>
        </div>
      </div>

      {/* RESTRICTED MODE SAFETY APPROVAL QUEUE (Section 7 & 13) */}
      <div className="ios-glass-card rounded-3xl p-6 border border-[#FFB020]/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-[#FFB020]" />
            <h3 className="text-base font-bold text-[#F4F9FA]">
              Coach Review Queue: Restricted Mode Plans
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40">
            {restrictedQueue.filter((q) => q.status === "pending").length} Pending Review
          </span>
        </div>
        <p className="text-xs text-[#A8C5CA] mb-4">
          Per Section 7, generated plans with reported physical restrictions or injuries are flagged for review by a certified coach or admin before final program assignment.
        </p>

        <div className="space-y-3">
          {restrictedQueue.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#102831] border border-[#28525B]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#F4F9FA]">{item.name}</span>
                  <span className="text-xs text-[#A8C5CA]">({item.email})</span>
                </div>
                <div className="text-xs mt-1 text-[#A8C5CA] flex items-center gap-2">
                  <span className="text-[#FFB020] font-medium">Issue: {item.restriction}</span>
                  <span>·</span>
                  <span className="text-[#28DACC]">{item.split}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {item.status === "approved" ? (
                  <span className="text-xs text-[#28DA8B] font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Approved by Coach
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApprove(item.id)}
                    className="px-4 py-2 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold hover:bg-[#41E9DC] active:scale-95 transition-all shadow-[0_0_12px_rgba(40,218,204,0.3)]"
                  >
                    Approve Program
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECHARTS MONTHLY COMPLETIONS GRAPH */}
      <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#A8C5CA]">
              Assessment Funnel Volume
            </span>
            <h3 className="text-base font-bold text-[#F4F9FA]">
              Monthly Completed Onboarding Blueprints
            </h3>
          </div>
          <span className="text-xs font-mono text-[#28DACC]">
            Last 6 Months
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28525B" opacity={0.3} />
              <XAxis dataKey="month" stroke="#A8C5CA" fontSize={11} tickLine={false} />
              <YAxis stroke="#A8C5CA" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#102831",
                  borderColor: "#28525B",
                  borderRadius: "12px",
                  color: "#F4F9FA",
                  fontSize: "12px"
                }}
              />
              <Bar dataKey="completions" fill="#28DACC" radius={[6, 6, 0, 0]} name="Completed Plans" />
              <Bar dataKey="assessments" fill="#28525B" radius={[6, 6, 0, 0]} name="Total Starts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
