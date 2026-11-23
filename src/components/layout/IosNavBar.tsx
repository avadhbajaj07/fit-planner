"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface IosNavBarProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
}

export const IosNavBar: React.FC<IosNavBarProps> = ({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  action
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { currentLanguage, setIsLanguageModalOpen } = useLanguage();

  return (
    <div className="w-full pt-safe pb-2">
      {/* Small top row with back button & action / theme toggles */}
      <div className="flex items-center justify-between min-h-[36px] mb-2">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#28DACC] active:opacity-70 transition-opacity"
          >
            <ChevronLeft size={20} />
            <span>{backLabel}</span>
          </Link>
        ) : (
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#28DACC] font-bold">
            FIT PLANNER
          </div>
        )}

        <div className="flex items-center gap-2">
          {action ? (
            action
          ) : (
            <>
              {/* Language Picker */}
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#E0E0E0] light:text-gray-700 border border-white/5 light:border-gray-200 transition-colors"
                title="Select Language"
              >
                <span>{currentLanguage.flag}</span>
                <span className="font-mono text-[10px] font-semibold">{currentLanguage.code.toUpperCase()}</span>
              </button>

              {/* Working Theme Switcher */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E93] hover:text-[#28DACC] transition-colors border border-white/5 light:border-gray-200"
                title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* iOS Large Title (34px) */}
      <div className="mt-1">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#F4F9FA] light:text-[#0F172A] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#A8C5CA] light:text-[#64748B] mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
