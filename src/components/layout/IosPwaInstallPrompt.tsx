"use client";

import React, { useState, useEffect } from "react";
import { Share, PlusSquare, X } from "lucide-react";

export const IosPwaInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if dismissed previously
    const dismissed = localStorage.getItem("fit_planner_pwa_prompt_dismissed");
    if (dismissed) return;

    // Check if iOS
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isIos && !isStandalone) {
      // Show prompt after a short delay
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("fit_planner_pwa_prompt_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto animate-fade-in">
      <div className="ios-glass-card rounded-3xl p-4 border border-[#28DACC]/50 shadow-2xl relative">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-[#A8C5CA] hover:text-[#F4F9FA] p-1"
          aria-label="Dismiss install guide"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#28DACC] text-[#07151D] flex items-center justify-center font-bold text-xs shrink-0">
            FP
          </div>
          <div className="pr-4">
            <h4 className="text-xs font-bold text-[#F4F9FA]">
              Install FIT Planner on iPhone
            </h4>
            <p className="text-[11px] text-[#A8C5CA] mt-0.5 leading-tight">
              Enjoy full-screen iOS mode without browser address bars:
            </p>

            <div className="mt-2.5 space-y-1.5 text-[11px] text-[#F4F9FA]">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#102831] border border-[#28525B] flex items-center justify-center text-[9px] text-[#28DACC] font-mono">
                  1
                </span>
                <span>Tap the</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#28DACC]">
                  <Share size={12} /> Share
                </span>
                <span>button in Safari</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#102831] border border-[#28525B] flex items-center justify-center text-[9px] text-[#28DACC] font-mono">
                  2
                </span>
                <span>Scroll down &amp; tap</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#28DACC]">
                  <PlusSquare size={12} /> Add to Home Screen
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
