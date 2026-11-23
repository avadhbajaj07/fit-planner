"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Dumbbell,
  LineChart,
  Apple,
  User,
  BookOpen
} from "lucide-react";

export const IosTabBar: React.FC = () => {
  const pathname = usePathname();
  const isDashboard = pathname === "/app/today";

  const tabs = [
    {
      name: "Today",
      href: "/app/today",
      icon: Dumbbell
    },
    {
      name: "Plan",
      href: "/app/plan",
      icon: CalendarDays
    },
    {
      name: "Library",
      href: "/app/exercises",
      icon: BookOpen
    },
    {
      name: "Progress",
      href: "/app/progress",
      icon: LineChart
    },
    {
      name: "Nutrition",
      href: "/app/nutrition",
      icon: Apple
    },
    {
      name: "Profile",
      href: "/app/profile",
      icon: User
    }
  ];

  return (
    <>
      {/* MOBILE BOTTOM TAB BAR (Fixed directly to bottom of viewport) */}
      {!isDashboard && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07151D]/95 backdrop-blur-2xl border-t border-[#28525B]/50 pb-[max(env(safe-area-inset-bottom,0px),6px)] pt-1 shadow-[0_-8px_24px_rgba(0,0,0,0.6)]"
        >
          <div className="h-[50px] flex items-center justify-around px-2 max-w-md mx-auto">
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors select-none ${
                    isActive ? "text-[#28DACC]" : "text-[#8E8E93] hover:text-white"
                  }`}
                >
                  <Icon
                    size={22}
                    className={`transition-transform duration-200 ${
                      isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-0.5 tracking-tight ${
                      isActive ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {tab.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* DESKTOP SIDEBAR (Large Screens) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0A0A0A] backdrop-blur-xl border-r border-[#1F1F1F] p-6 min-h-screen shrink-0">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#121212] border border-[#28DACC]/40 flex items-center justify-center text-[#28DACC] font-bold">
            <Dumbbell size={20} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">
              FIT PLANNER
            </div>
            <div className="text-[10px] font-mono text-[#28DACC] tracking-widest uppercase">
              Athlete OS
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#142D35] text-[#28DACC] border border-[#28DACC]/30 shadow-[0_0_15px_rgba(40,218,204,0.12)] font-semibold"
                    : "text-[#A8C5CA] hover:text-[#F4F9FA] hover:bg-[#142D35]/50"
                }`}
              >
                <Icon size={19} className={isActive ? "text-[#28DACC]" : ""} />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-[#28525B]/40">
          <div className="p-3 rounded-2xl bg-[#142D35] border border-[#28525B]/50">
            <div className="text-[10px] font-mono uppercase text-[#A8C5CA]">Status</div>
            <div className="text-xs font-semibold text-[#28DA8B] mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#28DA8B] animate-pulse" />
              Active Training Phase
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
