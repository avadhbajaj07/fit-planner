"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  goal: string;
  split: string;
  isRestricted: boolean;
  restrictionTag?: string;
  subscription: "active" | "free" | "expired";
  joinedDate: string;
}

const SAMPLE_CUSTOMERS: CustomerRecord[] = [
  {
    id: "ath_01",
    name: "Alex Rivera",
    email: "athlete@demo.fitplanner.app",
    goal: "Build Muscle",
    split: "Full Body (3-Day)",
    isRestricted: false,
    subscription: "active",
    joinedDate: "Nov 17, 2026"
  },
  {
    id: "ath_02",
    name: "Marcus Vance",
    email: "m.vance@example.com",
    goal: "Improve Fitness",
    split: "Upper / Lower (4-Day)",
    isRestricted: true,
    restrictionTag: "Back (L4-L5)",
    subscription: "active",
    joinedDate: "Nov 15, 2026"
  },
  {
    id: "ath_03",
    name: "Elena Rostova",
    email: "e.rostova@example.ch",
    goal: "Lose Weight",
    split: "Full Body (3-Day)",
    isRestricted: true,
    restrictionTag: "Knee (Patellar)",
    subscription: "free",
    joinedDate: "Nov 12, 2026"
  },
  {
    id: "ath_04",
    name: "Sarah Jenkins",
    email: "sarah.j@example.co.uk",
    goal: "Build Muscle",
    split: "Push / Pull / Legs (5-Day)",
    isRestricted: false,
    subscription: "active",
    joinedDate: "Nov 08, 2026"
  },
  {
    id: "ath_05",
    name: "Rajesh Kumar",
    email: "rajesh.k@example.in",
    goal: "Gain Weight",
    split: "Upper / Lower (4-Day)",
    isRestricted: false,
    subscription: "expired",
    joinedDate: "Oct 24, 2026"
  }
];

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSub, setFilterSub] = useState<string>("all");
  const [selectedAthlete, setSelectedAthlete] = useState<CustomerRecord | null>(null);

  const filtered = SAMPLE_CUSTOMERS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.split.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterSub === "all" ||
      (filterSub === "restricted" && c.isRestricted) ||
      c.subscription === filterSub;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#28525B]/40">
        <div>
          <span className="text-xs font-mono uppercase text-[#28DACC]">
            Customer Management
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-0.5">
            Registered Athletes &amp; Plans
          </h1>
        </div>

        <span className="text-xs text-[#A8C5CA] font-mono">
          Showing {filtered.length} of {SAMPLE_CUSTOMERS.length} athletes
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8C5CA]" />
          <input
            type="text"
            placeholder="Search by name, email, or split..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#102831] border border-[#28525B] pl-10 pr-4 py-2.5 rounded-2xl text-xs text-[#F4F9FA] placeholder:text-[#A8C5CA]/50 outline-none focus:border-[#28DACC]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {[
            { key: "all", label: "All Athletes" },
            { key: "active", label: "Subscribers" },
            { key: "free", label: "Free Registered" },
            { key: "restricted", label: "Restricted Mode" }
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilterSub(item.key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterSub === item.key
                  ? "bg-[#28DACC] text-[#07151D] font-bold"
                  : "bg-[#102831] border border-[#28525B] text-[#A8C5CA] hover:text-[#F4F9FA]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Athletes Table */}
      <div className="ios-glass-card rounded-3xl border border-[#28525B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07151D]/80 border-b border-[#28525B]/60 text-[#A8C5CA] font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Goal &amp; Split</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Subscription</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#28525B]/40">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#102831]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-sm text-[#F4F9FA]">{c.name}</div>
                    <div className="text-[11px] text-[#A8C5CA]">{c.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[#F4F9FA] font-medium">{c.goal}</div>
                    <div className="text-[11px] text-[#28DACC] font-mono">{c.split}</div>
                  </td>
                  <td className="py-3 px-4">
                    {c.isRestricted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30 font-medium">
                        <ShieldAlert size={12} /> {c.restrictionTag || "Restricted"}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#28DA8B] font-mono">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                        c.subscription === "active"
                          ? "bg-[#28DA8B]/15 text-[#28DA8B] border border-[#28DA8B]/30"
                          : c.subscription === "free"
                          ? "bg-[#102831] text-[#A8C5CA] border border-[#28525B]"
                          : "bg-[#FF5C5C]/15 text-[#FF5C5C] border border-[#FF5C5C]/30"
                      }`}
                    >
                      {c.subscription}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#A8C5CA] text-[11px]">
                    {c.joinedDate}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAthlete(c)}
                      className="px-2.5 py-1 rounded-lg bg-[#142D35] text-[#28DACC] hover:bg-[#28DACC] hover:text-[#07151D] text-xs font-semibold transition-all"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT ATHLETE MODAL */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#102831] border border-[#28525B] rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#F4F9FA] mb-1">
              Athlete Profile: {selectedAthlete.name}
            </h3>
            <p className="text-xs text-[#A8C5CA] mb-4 font-mono">
              ID: {selectedAthlete.id} · {selectedAthlete.email}
            </p>

            <div className="space-y-3 bg-[#07151D] p-4 rounded-2xl border border-[#28525B]/60 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A8C5CA]">Primary Goal:</span>
                <span className="font-semibold text-[#F4F9FA]">{selectedAthlete.goal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8C5CA]">Programmed Split:</span>
                <span className="font-semibold text-[#28DACC]">{selectedAthlete.split}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8C5CA]">Restricted Mode:</span>
                <span className={selectedAthlete.isRestricted ? "text-[#FFB020] font-bold" : "text-[#28DA8B]"}>
                  {selectedAthlete.isRestricted ? selectedAthlete.restrictionTag : "None (Full Loading)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8C5CA]">Subscription Status:</span>
                <span className="capitalize font-bold text-[#F4F9FA]">{selectedAthlete.subscription}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedAthlete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#142D35] border border-[#28525B] text-xs text-[#A8C5CA]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Audit log dispatched for ${selectedAthlete.name}`);
                  setSelectedAthlete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold"
              >
                Export Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
