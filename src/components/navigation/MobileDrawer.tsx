"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Home,
  Bot,
  Dumbbell,
  Apple,
  LineChart,
  Heart,
  Grid,
  ChevronRight,
  ChevronDown,
  Wand2,
  Mail,
  MessageSquare,
  Globe,
  User,
  Sparkles,
  Award
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
  const [plannerOpen, setPlannerOpen] = useState(true);
  const [marketingOpen, setMarketingOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dark scrim 40% behind it */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Side Drawer (slides from left, 320px) */}
      <div
        className="relative w-[320px] max-w-[85vw] h-full flex flex-col justify-between border-r shadow-2xl z-10 select-none animate-in slide-in-from-left duration-200"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--bd)",
          color: "var(--tx)"
        }}
      >
        <div className="overflow-y-auto no-scrollbar p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--bd)" }}>
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: "var(--pr)" }}
              >
                SR
              </div>
              <span className="font-bold text-base tracking-tight" style={{ color: "var(--tx)" }}>
                Shape Radar
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ color: "var(--mu)" }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Banners */}
          <div className="space-y-2">
            {/* Gradient SALE OF THE YEAR Banner */}
            <div
              className="p-3.5 rounded-[16px] text-white cursor-pointer transition-transform active:scale-[0.99] relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1D1536 0%, #2E1B58 50%, #4D2678 100%)",
                border: "1px solid rgba(165, 146, 255, 0.3)"
              }}
              onClick={onClose}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 text-white/90">
                    <Sparkles size={12} className="text-[#A592FF]" />
                    <span>SALE OF THE YEAR</span>
                  </div>
                  <div className="text-sm font-medium text-white/90 mt-0.5">Grab your deals</div>
                </div>
                <ChevronRight size={16} className="text-white/80" />
              </div>
            </div>

            {/* Green FREE PLANS / PRODUCTS Banner */}
            <div
              className="p-3.5 rounded-[16px] text-white cursor-pointer transition-transform active:scale-[0.99]"
              style={{
                backgroundColor: "#008361",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
              onClick={onClose}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold tracking-wider uppercase text-white/90">
                    FREE PLANS
                  </div>
                  <div className="text-sm font-medium text-white/90 mt-0.5">Grab your 2 free plans</div>
                </div>
                <ChevronRight size={16} className="text-white/80" />
              </div>
            </div>
          </div>

          {/* Navigation Items (Home, Agent, Workouts, Nutrition, Progress, Recovery, More services) */}
          <nav className="space-y-1 text-sm font-medium">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-bold transition-colors"
              style={{
                backgroundColor: "var(--bg)",
                color: "var(--pr)"
              }}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              href="/app/today"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bot size={18} style={{ color: "var(--prx)" }} />
                <span>Agent</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--prt)", color: "var(--prx)" }}>
                Beta
              </span>
            </Link>

            <Link
              href="/#workout-plan"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Dumbbell size={18} />
                <span>Workouts</span>
              </div>
              <ChevronRight size={15} style={{ color: "var(--mu)" }} />
            </Link>

            <Link
              href="/#nutrition"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Apple size={18} />
                <span>Nutrition</span>
              </div>
              <ChevronRight size={15} style={{ color: "var(--mu)" }} />
            </Link>

            <Link
              href="/#progressive-overload"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LineChart size={18} />
                <span>Progress</span>
              </div>
              <ChevronRight size={15} style={{ color: "var(--mu)" }} />
            </Link>

            <Link
              href="/#pros"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart size={18} />
                <span>Recovery</span>
              </div>
              <ChevronRight size={15} style={{ color: "var(--mu)" }} />
            </Link>

            <div className="flex items-center justify-between px-3 py-2.5 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Grid size={18} />
                <span>More services</span>
              </div>
              <ChevronRight size={15} style={{ color: "var(--mu)" }} />
            </div>
          </nav>

          {/* Group: Planner tools (AI Builder) */}
          <div className="pt-2 border-t" style={{ borderColor: "var(--bd)" }}>
            <button
              type="button"
              onClick={() => setPlannerOpen(!plannerOpen)}
              className="w-full flex items-center justify-between py-1.5 px-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--mu)" }}
            >
              <span>Planner tools</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${plannerOpen ? "" : "-rotate-90"}`}
              />
            </button>
            {plannerOpen && (
              <div className="space-y-1 mt-1 pl-1">
                <div className="flex items-center justify-between px-3 py-2 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 text-sm cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Wand2 size={16} style={{ color: "var(--pr)" }} />
                    <span>AI Builder</span>
                  </div>
                  <ChevronRight size={14} style={{ color: "var(--mu)" }} />
                </div>
              </div>
            )}
          </div>

          {/* Group: Marketing (Email and WhatsApp) */}
          <div className="pt-2 border-t" style={{ borderColor: "var(--bd)" }}>
            <button
              type="button"
              onClick={() => setMarketingOpen(!marketingOpen)}
              className="w-full flex items-center justify-between py-1.5 px-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--mu)" }}
            >
              <span>Marketing</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${marketingOpen ? "" : "-rotate-90"}`}
              />
            </button>
            {marketingOpen && (
              <div className="space-y-1 mt-1 pl-1 text-sm">
                <div className="flex items-center justify-between px-3 py-2 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} />
                    <span>Email &amp; WhatsApp</span>
                  </div>
                  <ChevronRight size={14} style={{ color: "var(--mu)" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Language + My account */}
        <div
          className="p-4 border-t flex items-center justify-between text-xs"
          style={{
            borderColor: "var(--bd)",
            backgroundColor: "var(--pill)"
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsLanguageModalOpen(true);
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium border"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--bd)"
            }}
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--pr)" }}
          >
            <User size={15} />
            <span>{user ? "My account" : "Sign in"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
