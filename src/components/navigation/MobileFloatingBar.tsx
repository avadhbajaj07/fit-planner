"use client";

import React from "react";
import { Menu, Sparkles, Mic, ArrowUp } from "lucide-react";

interface MobileFloatingBarProps {
  onToggleDrawer: () => void;
  onToggleProfile: () => void;
  onOpenAskRadar?: () => void;
}

export function MobileFloatingBar({
  onToggleDrawer,
  onToggleProfile,
  onOpenAskRadar
}: MobileFloatingBarProps) {
  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto select-none pointer-events-auto">
      <div className="flex items-center gap-2.5">
        {/* Round Menu Button (56px) */}
        <button
          type="button"
          onClick={onToggleDrawer}
          className="w-14 h-14 rounded-full flex items-center justify-center border shadow-lg shrink-0 transition-transform active:scale-95 cursor-pointer"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--bd)",
            color: "var(--tx)",
            boxShadow: "var(--shadow)"
          }}
          aria-label="Open main menu"
        >
          <Menu size={22} />
        </button>

        {/* Pill Input: "Ask Shape Radar" with sparkle icon, mic icon and purple send circle */}
        <div
          role="button"
          tabIndex={0}
          className="flex-1 h-14 px-4 rounded-full border shadow-lg flex items-center justify-between text-sm cursor-pointer transition-colors active:scale-[0.99]"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--bd)",
            boxShadow: "var(--shadow)"
          }}
          onClick={onOpenAskRadar || onToggleProfile}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              (onOpenAskRadar || onToggleProfile)();
            }
          }}
          aria-label="Ask Shape Radar Assistant"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Sparkles size={18} style={{ color: "var(--pr)" }} className="shrink-0" />
            <span className="truncate text-xs sm:text-sm font-medium" style={{ color: "var(--mu)" }}>
              Ask Shape Radar
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <Mic size={18} style={{ color: "var(--mu)" }} />
            {/* Purple send circle */}
            <div
              className="w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: "var(--pr)" }}
            >
              <ArrowUp size={15} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
