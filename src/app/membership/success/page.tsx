"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight, Dumbbell } from "lucide-react";

export default function MembershipSuccessPage() {
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#28DACC", "#41E9DC", "#28DA8B"]
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-8">
      <div className="max-w-md w-full mx-auto my-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#28DA8B]/20 text-[#28DA8B] flex items-center justify-center mx-auto border border-[#28DA8B]/40">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
            MEMBERSHIP ACTIVATED
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA] mt-1">
            Welcome to FIT Planner OS
          </h1>
          <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
            Your subscription has been confirmed by the billing gateway. Your periodized workout plan and progressive overload logs are fully unlocked.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#102831] border border-[#28525B]/60 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#A8C5CA]">Status:</span>
            <span className="font-semibold text-[#28DA8B] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#28DA8B] animate-pulse" /> Active Subscriber
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A8C5CA]">Focus Mode &amp; Offline Sync:</span>
            <span className="font-semibold text-[#F4F9FA]">Enabled</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A8C5CA]">Billing History:</span>
            <span className="font-semibold text-[#F4F9FA]">Available in Profile</span>
          </div>
        </div>

        <Link
          href="/app/today"
          className="w-full h-13 rounded-2xl bg-[#28DACC] text-[#07151D] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.35)] active:scale-95 transition-all hover:bg-[#41E9DC]"
        >
          <span>Open Today&apos;s Training Log</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <footer className="text-center text-[11px] text-[#A8C5CA]/60 pb-safe">
        FIT Planner · Subscription Management
      </footer>
    </div>
  );
}
