"use client";

import React, { Suspense, useEffect } from "react";
import { AuthProvider } from "@/lib/auth/authContext";
import { IosTabBar } from "@/components/layout/IosTabBar";
import { IosPwaInstallPrompt } from "@/components/layout/IosPwaInstallPrompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA service worker registered:", reg.scope))
        .catch((err) => console.warn("PWA registration:", err));
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-[#F4F9FA] flex flex-col lg:flex-row selection:bg-[#28DACC] selection:text-[#000000]">
      {/* Desktop Sidebar + Mobile Bottom Tab Bar */}
      <Suspense fallback={<div className="h-[49px] bg-[#000000]" />}>
        <IosTabBar />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-[100dvh] pb-safe lg:pb-8 overflow-y-auto">
        <Suspense fallback={<div className="p-6 text-xs text-[#A8C5CA]">Loading Athlete OS...</div>}>
          {children}
        </Suspense>
      </div>

      {/* iOS PWA Install Prompt Sheet for Safari Users */}
      <IosPwaInstallPrompt />
    </div>
  );
}
