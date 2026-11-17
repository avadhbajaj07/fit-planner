"use client";

import React from "react";

interface DayRingData {
  dayName: string;
  shortName: string;
  isToday: boolean;
  isScheduled: boolean;
  isCompleted: boolean;
  completionPercent: number; // 0 to 100
}

interface WeeklyRingStripProps {
  days: DayRingData[];
  onSelectDay?: (index: number) => void;
  selectedIndex?: number;
}

export const WeeklyRingStrip: React.FC<WeeklyRingStripProps> = ({
  days,
  onSelectDay,
  selectedIndex = 0
}) => {
  return (
    <div className="w-full bg-[#102831] border border-[#28525B]/70 rounded-3xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#A8C5CA]">
            Activity Rings
          </span>
          <h4 className="text-sm font-bold text-[#F4F9FA]">This Week&apos;s Rings</h4>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#A8C5CA]">Completed</span>
          <div className="text-xs font-bold num-mono text-[#28DACC]">
            {days.filter((d) => d.isCompleted).length} / {days.filter((d) => d.isScheduled).length} Sessions
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-3 text-center">
        {days.map((day, idx) => {
          const isSelected = selectedIndex === idx;
          const radius = 17;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset =
            circumference - (day.completionPercent / 100) * circumference;

          return (
            <div
              key={day.shortName}
              onClick={() => onSelectDay && onSelectDay(idx)}
              className={`flex flex-col items-center p-1.5 md:p-2 rounded-2xl cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#142D35] border border-[#28DACC]/50 shadow-[0_0_12px_rgba(40,218,204,0.15)]"
                  : "hover:bg-[#142D35]/50 border border-transparent"
              }`}
            >
              <span
                className={`text-[10px] uppercase font-mono mb-1.5 ${
                  day.isToday
                    ? "text-[#28DACC] font-bold"
                    : "text-[#A8C5CA]"
                }`}
              >
                {day.shortName}
              </span>

              {/* Concentric iOS Ring Graphic */}
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                  {/* Background Track */}
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    stroke="#07151D"
                    strokeWidth="4"
                    fill="none"
                  />
                  {/* Scheduled Subtle Indicator */}
                  {day.isScheduled && !day.isCompleted && (
                    <circle
                      cx="22"
                      cy="22"
                      r={radius}
                      stroke="rgba(40, 82, 91, 0.6)"
                      strokeWidth="4"
                      fill="none"
                    />
                  )}
                  {/* Progress Ring */}
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    stroke={day.isCompleted ? "#28DACC" : "#41E9DC"}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                {/* Inner status icon or dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {day.isCompleted ? (
                    <span className="text-xs text-[#28DACC] font-bold">✓</span>
                  ) : day.isScheduled ? (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        day.isToday ? "bg-[#28DACC] animate-ping" : "bg-[#28525B]"
                      }`}
                    />
                  ) : (
                    <span className="text-[10px] text-[#A8C5CA]/40 font-mono">–</span>
                  )}
                </div>
              </div>

              <span
                className={`text-[10px] mt-1.5 num-mono font-medium ${
                  day.isCompleted
                    ? "text-[#28DACC]"
                    : day.isScheduled
                    ? "text-[#F4F9FA]"
                    : "text-[#A8C5CA]/40"
                }`}
              >
                {day.isCompleted ? "Done" : day.isScheduled ? "Plan" : "Rest"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
