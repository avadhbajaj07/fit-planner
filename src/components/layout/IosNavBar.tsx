"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
  return (
    <div className="w-full pt-safe pb-3 px-4 md:px-6">
      {/* Small top row with back button & action */}
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
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#28DACC]">
            FIT PLANNER
          </div>
        )}

        {action && <div>{action}</div>}
      </div>

      {/* iOS Large Title (34px) */}
      <div className="mt-1">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#F4F9FA] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#A8C5CA] mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
