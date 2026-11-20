"use client";

import React from "react";
import { Menu, Sparkles, Mic, ArrowUp, User } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";
import { useTheme } from "@/lib/theme/ThemeContext";

interface MobileFloatingBarProps {
  onToggleDrawer: () => void;
  onToggleProfile: () => void;
}

export function MobileFloatingBar({
  onToggleDrawer,
  onToggleProfile
}: MobileFloatingBarProps) {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto select-none pointer-events-auto">
      <div className="h-14 px-2.5 rounded-full bg-[#121218]/90 dark:bg-[#121218]/90 light:bg-white/95 backdrop-blur-xl border border-white/10 light:border-gray-300 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex items-center justify-between gap-2">
        {/* Left: Hamburger Menu Button (opens Hostinger-style Drawer) */}
        <button
          type="button"
          onClick={onToggleDrawer}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#E0E0E0] light:text-gray-700 hover:text-white light:hover:text-black hover:bg-white/10 light:hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Center: Interactive Assistant Search Pill (Hostinger reference Screenshots 4 & 5) */}
        <div className="flex-1 h-10 px-3 rounded-full bg-[#1A1A24] dark:bg-[#1A1A24] light:bg-gray-100 border border-white/5 light:border-gray-200 flex items-center justify-between text-xs cursor-pointer hover:border-[#28DACC]/40 transition-colors">
          <div className="flex items-center gap-2 truncate">
            <Sparkles size={14} className="text-[#28DACC] shrink-0" />
            <span className="text-[#8E8E93] light:text-gray-500 truncate text-[11px]">
              Ask FIT AI or search workouts...
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            <Mic size={14} className="text-[#8E8E93] light:text-gray-400" />
            <div className="w-5 h-5 rounded-full bg-[#28DACC] text-black flex items-center justify-center">
              <ArrowUp size={11} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Right: User Avatar / Profile Menu Button (opens Hostinger-style Profile Popup with Theme Toggle) */}
        <button
          type="button"
          onClick={onToggleProfile}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 light:hover:bg-gray-100 transition-colors shrink-0 relative"
          aria-label="User Profile and Theme Settings"
        >
          {user ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#28DACC] to-[#6366F1] flex items-center justify-center text-black font-bold text-xs shadow-sm">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 light:bg-gray-200 flex items-center justify-center text-[#28DACC]">
              <User size={16} />
            </div>
          )}
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#28DACC] border-2 border-[#121218] light:border-white" />
        </button>
      </div>
    </div>
  );
}
