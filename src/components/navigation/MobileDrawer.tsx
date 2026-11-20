"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Home,
  Dumbbell,
  LineChart,
  Apple,
  Award,
  HelpCircle,
  ChevronRight,
  Globe,
  User,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/authContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

export function MobileDrawer({ isOpen, onClose, onOpenProfile }: MobileDrawerProps) {
  const { currentLanguage, setIsLanguageModalOpen } = useLanguage();
  const { user } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>("features");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer (Hostinger Mobile App Reference Screenshots 2 & 7) */}
      <div className="relative w-[320px] max-w-[85vw] bg-[#0E0E14] dark:bg-[#0E0E14] light:bg-[#FFFFFF] text-white light:text-[#0F172A] h-full flex flex-col justify-between border-r border-white/10 light:border-gray-200 shadow-2xl z-10 select-none animate-in slide-in-from-left duration-200">
        <div className="overflow-y-auto no-scrollbar p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 light:border-gray-100">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white light:text-gray-900">
                FIT<span className="text-[#28DACC]">PLANNER</span>
              </span>
              <span className="text-[10px] font-mono text-[#28DACC] px-2 py-0.5 rounded-full bg-[#28DACC]/10 border border-[#28DACC]/20 tracking-widest uppercase">
                OS
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 light:bg-gray-100 hover:bg-white/10 text-[#8E8E93] light:text-gray-500 hover:text-white light:hover:text-black transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Promo Action Banners (Screenshot 2: Sale of the Year / Free Products) */}
          <div className="space-y-2">
            <Link
              href="/assessment"
              onClick={onClose}
              className="block p-3 rounded-2xl bg-gradient-to-r from-[#28DACC]/20 to-[#6366F1]/20 border border-[#28DACC]/30 hover:border-[#28DACC] transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white light:text-gray-900">
                  <Flame size={14} className="text-[#28DACC]" />
                  <span>START 12-WEEK PLAN</span>
                </div>
                <ChevronRight size={14} className="text-[#28DACC] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-[#A8C5CA] light:text-gray-500 mt-1">
                Generate your personalized progressive overload plan
              </p>
            </Link>

            <Link
              href="/membership"
              onClick={onClose}
              className="block p-3 rounded-2xl bg-[#102831]/60 dark:bg-[#102831]/60 light:bg-gray-50 border border-white/5 light:border-gray-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white light:text-gray-900">
                  <Sparkles size={14} className="text-[#FFB020]" />
                  <span>ATHLETE PRO MEMBERSHIP</span>
                </div>
                <ChevronRight size={14} className="text-[#8E8E93] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-[#8E8E93] light:text-gray-500 mt-1">
                7-day trial · 100% money-back guarantee
              </p>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-gray-700 font-medium transition-colors"
            >
              <Home size={17} className="text-[#28DACC]" />
              <span>Home</span>
            </Link>

            <Link
              href="/#workout-plan"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-gray-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Dumbbell size={17} />
                <span>Workout Plan</span>
              </div>
              <ChevronRight size={14} className="text-[#8E8E93]" />
            </Link>

            <Link
              href="/#progressive-overload"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-gray-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <LineChart size={17} />
                <span>Progressive Overload Chart</span>
              </div>
              <ChevronRight size={14} className="text-[#8E8E93]" />
            </Link>

            <Link
              href="/#nutrition"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-gray-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Apple size={17} />
                <span>Nutrition & Recipes</span>
              </div>
              <ChevronRight size={14} className="text-[#8E8E93]" />
            </Link>

            <Link
              href="/#pros"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-gray-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award size={17} />
                <span>Experiences of Pros</span>
              </div>
              <ChevronRight size={14} className="text-[#8E8E93]" />
            </Link>

            <Link
              href="/#faq"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-gray-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={17} />
                <span>FAQ</span>
              </div>
              <ChevronRight size={14} className="text-[#8E8E93]" />
            </Link>
          </nav>
        </div>

        {/* Bottom Bar matching Screenshot 7: Language + My Account */}
        <div className="p-4 border-t border-white/10 light:border-gray-100 bg-[#0A0A0E] dark:bg-[#0A0A0E] light:bg-gray-50 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              setIsLanguageModalOpen(true);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 light:bg-gray-200 text-[#E0E0E0] light:text-gray-800 font-semibold hover:bg-white/10 transition-colors"
          >
            <span>{currentLanguage.flag}</span>
            <span>{currentLanguage.code.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#28DACC]/15 text-[#28DACC] font-bold hover:bg-[#28DACC]/25 transition-colors"
          >
            <User size={15} />
            <span>{user ? "My Account" : "Sign In / Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
