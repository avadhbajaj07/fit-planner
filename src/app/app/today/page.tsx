"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Users,
  CheckCircle2,
  Circle,
  Dumbbell,
  Apple,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen
} from "lucide-react";
import { UserProfileMenu } from "@/components/navigation/UserProfileMenu";
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { MobileFloatingBar } from "@/components/navigation/MobileFloatingBar";
import { LanguageModal } from "@/components/navigation/LanguageModal";
import { useAuth } from "@/lib/auth/authContext";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPromoVisible, setIsPromoVisible] = useState(true);

  // Checklist state
  const [checklist, setChecklist] = useState({
    assessment: true,
    equipment: true,
    workout: false,
    email: false
  });

  const promoSlides = [
    {
      id: 1,
      icon: Shield,
      title: "Save and sync your workout progress history.",
      oldPrice: "₹ 4,598.00",
      newPrice: "₹ 1,069.00",
      period: "/1st yr",
      discount: "77% off",
      cta: "View plan"
    },
    {
      id: 2,
      icon: Bell,
      title: "Daily workout and macro habit reminders.",
      oldPrice: "₹ 3,999.00",
      newPrice: "₹ 899.00",
      period: "/1st yr",
      discount: "75% off",
      cta: "Set reminders"
    },
    {
      id: 3,
      icon: Users,
      title: "Invite a coach or workout partner.",
      oldPrice: "₹ 5,200.00",
      newPrice: "₹ 1,299.00",
      period: "/1st yr",
      discount: "75% off",
      cta: "Invite partner"
    }
  ];

  const currentSlide = promoSlides[activeSlide];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % promoSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  };

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between selection:bg-[#673DE6] selection:text-white pb-32 sm:pb-16"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--tx)"
      }}
    >
      {/* 1. STICKY HEADER (--grad background) */}
      <header
        className="sticky top-0 z-40 px-4 py-3 shadow-sm select-none"
        style={{
          background: "var(--grad)"
        }}
      >
        <div className="max-w-[760px] mx-auto flex items-center justify-between">
          {/* Left: SALE! pill (black 45%, white text, weight 700) */}
          <Link
            href="/membership"
            className="px-3.5 py-1.5 rounded-full text-white font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
          >
            <span>SALE!</span>
            <ArrowRight size={13} strokeWidth={3} />
          </Link>

          {/* Right Action Icons: Bell with red "2" badge, Avatar */}
          <div className="flex items-center gap-2">
            {/* Bell button with red "2" badge */}
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white relative shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                style={{ backgroundColor: "#D63163" }}
              >
                2
              </span>
            </button>

            {/* Avatar button (opens account dropdown) */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white/30 transition-transform active:scale-95"
              style={{ backgroundColor: "#673DE6" }}
              aria-label="My Account"
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
            </button>
          </div>
        </div>
      </header>

      {/* 2. CONTENT SHEET (--bg, radius 28px 28px 0 0, overlaps header by 18px, max-width 760px) */}
      <main className="w-full max-w-[760px] mx-auto px-4 -mt-[18px] relative z-20 space-y-6">
        <div
          className="rounded-t-[28px] p-5 sm:p-6 shadow-sm space-y-6 border-t"
          style={{
            backgroundColor: "var(--bg)",
            borderColor: "rgba(255, 255, 255, 0.05)"
          }}
        >
          {/* Title: "Ah, here we go again" */}
          <div className="pt-2">
            <h1
              className="text-2xl sm:text-3xl font-normal tracking-tight"
              style={{ color: "var(--tx)" }}
            >
              Ah, here we go again
            </h1>
          </div>

          {/* 3. PROMO CAROUSEL (3 slides, counter "1/3") */}
          {isPromoVisible && (
            <div
              className="relative rounded-[24px] p-6 text-white overflow-hidden shadow-xl"
              style={{
                backgroundColor: "#1D1E20",
                minHeight: 240,
                backgroundImage:
                  "radial-gradient(circle at 100% 100%, rgba(103, 61, 230, 0.45) 0%, transparent 60%)"
              }}
            >
              {/* Close X (38px, #333) */}
              <button
                type="button"
                onClick={() => setIsPromoVisible(false)}
                className="absolute top-4 right-4 w-[38px] h-[38px] rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                aria-label="Dismiss promo"
              >
                <X size={18} className="text-white" />
              </button>

              {/* Purple rounded icon at top-left */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md"
                style={{ backgroundColor: "#673DE6" }}
              >
                {React.createElement(currentSlide.icon, { size: 22 })}
              </div>

              {/* Body text 19px, max 30ch */}
              <p className="text-[19px] font-medium text-white max-w-[30ch] leading-snug">
                {currentSlide.title}
              </p>

              {/* Pricing row: Struck-through old price, red "77% off" chip, new price "/1st yr" */}
              <div className="flex flex-wrap items-center gap-2.5 mt-5">
                <span className="line-through text-xs text-[#8E8E93]">
                  {currentSlide.oldPrice}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-white text-[11px] font-bold"
                  style={{ backgroundColor: "#D63163" }}
                >
                  {currentSlide.discount}
                </span>
                <div className="text-base font-bold text-white">
                  {currentSlide.newPrice}{" "}
                  <span className="text-xs font-normal text-[#8E8E93]">
                    {currentSlide.period}
                  </span>
                </div>
              </div>

              {/* Full-width white button */}
              <div className="mt-5">
                <button
                  type="button"
                  className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-[#F2F3F6] transition-transform active:scale-[0.99] shadow-md"
                >
                  {currentSlide.cta}
                </button>
              </div>

              {/* Centered pager pill with < 1/3 > */}
              <div className="flex items-center justify-center gap-3 mt-4 text-xs font-mono text-[#8E8E93]">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="p-1 hover:text-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-white font-medium">
                  {activeSlide + 1} / {promoSlides.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="p-1 hover:text-white transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* 4. CHECKLIST "Get your plan up and running" */}
          <div className="space-y-3">
            <h2 className="text-base font-medium" style={{ color: "var(--tx)" }}>
              Get your plan up and running
            </h2>

            <div
              className="rounded-[24px] border divide-y overflow-hidden shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--bd)"
              }}
            >
              {/* Item 1: Finish the 1-minute assessment */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => toggleChecklistItem("assessment")}
              >
                <div className="flex items-center gap-3">
                  {checklist.assessment ? (
                    <CheckCircle2 size={20} style={{ color: "var(--ok)" }} />
                  ) : (
                    <Circle size={20} style={{ color: "var(--mu)" }} />
                  )}
                  <span
                    className={`text-sm ${
                      checklist.assessment ? "line-through opacity-70" : "font-medium"
                    }`}
                  >
                    Finish the 1-minute assessment
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: "var(--mu)" }} />
              </div>

              {/* Item 2: Set your gym or home equipment */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => toggleChecklistItem("equipment")}
              >
                <div className="flex items-center gap-3">
                  {checklist.equipment ? (
                    <CheckCircle2 size={20} style={{ color: "var(--ok)" }} />
                  ) : (
                    <Circle size={20} style={{ color: "var(--mu)" }} />
                  )}
                  <span
                    className={`text-sm ${
                      checklist.equipment ? "line-through opacity-70" : "font-medium"
                    }`}
                  >
                    Set your gym or home equipment
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: "var(--mu)" }} />
              </div>

              {/* Item 3: Log your first workout */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => toggleChecklistItem("workout")}
              >
                <div className="flex items-center gap-3">
                  {checklist.workout ? (
                    <CheckCircle2 size={20} style={{ color: "var(--ok)" }} />
                  ) : (
                    <Circle size={20} style={{ color: "var(--mu)" }} />
                  )}
                  <span
                    className={`text-sm ${
                      checklist.workout ? "line-through opacity-70" : "font-medium"
                    }`}
                  >
                    Log your first workout
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: "var(--mu)" }} />
              </div>

              {/* Item 4: Verify your email */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => toggleChecklistItem("email")}
              >
                <div className="flex items-center gap-3">
                  {checklist.email ? (
                    <CheckCircle2 size={20} style={{ color: "var(--ok)" }} />
                  ) : (
                    <Circle size={20} style={{ color: "var(--mu)" }} />
                  )}
                  <span
                    className={`text-sm ${
                      checklist.email ? "line-through opacity-70" : "font-medium"
                    }`}
                  >
                    Verify your email
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: "var(--mu)" }} />
              </div>
            </div>
          </div>

          {/* 5. "YOUR PLANS" CARDS (radius 24, card) */}
          <div className="space-y-3">
            <h2 className="text-base font-medium" style={{ color: "var(--tx)" }}>
              Your plans
            </h2>

            <div className="space-y-3.5">
              {/* Plan Card 1: Push/Pull/Legs 12-week block */}
              <div
                className="rounded-[24px] p-5 border shadow-sm space-y-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--bd)"
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: "#673DE6" }}
                    >
                      <Dumbbell size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: "var(--tx)" }}>
                        Push / Pull / Legs Block
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--mu)" }}>
                        12-week progressive overload split · Week 1 of 12
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/app/plan"
                    className="btn-hostinger-secondary text-xs shrink-0 py-2 px-3"
                  >
                    Manage plan
                  </Link>
                </div>

                {/* Optional Warning Strip */}
                <div
                  className="p-3 rounded-xl flex items-center gap-2 text-xs"
                  style={{
                    backgroundColor: "var(--prt)",
                    color: "var(--prx)"
                  }}
                >
                  <Sparkles size={14} className="shrink-0" />
                  <span>Double-progression will automatically increment weight after 2 successful sessions.</span>
                </div>

                {/* Chip Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t" style={{ borderColor: "var(--bd)" }}>
                  <button
                    type="button"
                    className="chip-purple text-xs cursor-pointer hover:opacity-90"
                  >
                    + Add reminder
                  </button>
                  <button
                    type="button"
                    className="chip-purple text-xs cursor-pointer hover:opacity-90"
                  >
                    + Share with coach
                  </button>
                </div>
              </div>

              {/* Plan Card 2: Nutrition and Macros */}
              <div
                className="rounded-[24px] p-5 border shadow-sm space-y-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--bd)"
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: "#008361" }}
                    >
                      <Apple size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: "var(--tx)" }}>
                        Nutrition &amp; Macro Targets
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--mu)" }}>
                        2,450 kcal / day · 165g Protein · High protein athletic split
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/app/nutrition"
                    className="btn-hostinger-secondary text-xs shrink-0 py-2 px-3"
                  >
                    Manage plan
                  </Link>
                </div>

                {/* Chip Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t" style={{ borderColor: "var(--bd)" }}>
                  <button
                    type="button"
                    className="chip-purple text-xs cursor-pointer hover:opacity-90"
                  >
                    + Log daily calories
                  </button>
                  <button
                    type="button"
                    className="chip-purple text-xs cursor-pointer hover:opacity-90"
                  >
                    + View 300+ recipes
                  </button>
                </div>
              </div>

              {/* Plan Card 3: Master Exercise Library (708 RepDB Movements) */}
              <div
                className="rounded-[24px] p-5 border shadow-sm space-y-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--bd)"
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-sm"
                      style={{ backgroundColor: "#28DACC", color: "#07151D" }}
                    >
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: "var(--tx)" }}>
                        Master Exercise Library
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--mu)" }}>
                        708 RepDB movements with start &amp; peak WebP illustrations
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/app/exercises"
                    className="btn-hostinger-secondary text-xs shrink-0 py-2 px-3"
                  >
                    Browse library
                  </Link>
                </div>

                {/* Chip Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t" style={{ borderColor: "var(--bd)" }}>
                  <Link
                    href="/app/exercises"
                    className="chip-purple text-xs cursor-pointer hover:opacity-90"
                  >
                    Bodyweight (217)
                  </Link>
                  <Link
                    href="/app/exercises"
                    className="chip-purple text-xs cursor-pointer hover:opacity-90"
                  >
                    Dumbbells &amp; Barbells
                  </Link>
                  <Link
                    href="/app/exercises"
                    className="chip-purple text-xs cursor-pointer hover:opacity-90"
                  >
                    Stretching &amp; Mobility
                  </Link>
                </div>
              </div>

              {/* Plan Card 4: Bodyweight & Progress Log */}
              <div
                className="rounded-[24px] p-5 border shadow-sm space-y-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--bd)"
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: "#2C2260" }}
                    >
                      <TrendingUp size={22} style={{ color: "#A592FF" }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: "var(--tx)" }}>
                        Strength &amp; Bodyweight Log
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--mu)" }}>
                        Weekly moving average: 78.4 kg (-0.4 kg this cycle)
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/app/progress"
                    className="btn-hostinger-secondary text-xs shrink-0 py-2 px-3"
                  >
                    Manage plan
                  </Link>
                </div>

                {/* Chip Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t" style={{ borderColor: "var(--bd)" }}>
                  <button
                    type="button"
                    className="chip-purple text-xs cursor-pointer hover:opacity-90"
                  >
                    + Log today's weight
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 6. FIXED FLOATING BOTTOM BAR (Hostinger inspiration Screenshots 4 & 5) */}
      <MobileFloatingBar
        onToggleDrawer={() => setIsDrawerOpen(true)}
        onToggleProfile={() => setIsProfileOpen(true)}
      />

      {/* 7. SIDE DRAWER */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 8. MY ACCOUNT DROPDOWN */}
      <UserProfileMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* 9. LANGUAGE MODAL */}
      <LanguageModal />
    </div>
  );
}
