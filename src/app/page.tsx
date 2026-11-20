"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { StrengthChartSkeleton } from "@/components/charts/StrengthProgressChart";
import {
  DEMO_PRIMARY_SERIES,
  DEMO_COMPARISON_SERIES,
  DEMO_METRICS,
  DEMO_CHART_CONFIG
} from "@/lib/chart/demoData";
import { UserProfileMenu } from "@/components/navigation/UserProfileMenu";
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { MobileFloatingBar } from "@/components/navigation/MobileFloatingBar";
import { LanguageModal } from "@/components/navigation/LanguageModal";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/authContext";
import {
  Sun,
  Moon,
  Globe,
  Menu,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Dumbbell,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Layers,
  Scale,
  Calendar,
  Lock,
  ChevronRight,
  Apple,
  TrendingUp,
  Heart,
  Award,
  Check
} from "lucide-react";

const DynamicStrengthChart = dynamic(
  () =>
    import("@/components/charts/StrengthProgressChart").then((mod) => mod.StrengthProgressChart),
  {
    ssr: false,
    loading: () => <StrengthChartSkeleton />
  }
);

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const { currentLanguage, setIsLanguageModalOpen } = useLanguage();
  const { user } = useAuth();

  const faqs = [
    {
      q: "How does FIT Planner compare to MyFitCoach?",
      a: "FIT Planner delivers the same high-performance, dark iOS-inspired design and evidence-based progressive overload algorithms. It features a complete 22-question assessment, pure deterministic workout generation, hard allergen nutrition filtering, and native Focus Mode rest timers."
    },
    {
      q: "How is my workout plan generated?",
      a: "FIT Planner uses a deterministic, rule-based recommendation engine. It analyzes your training goal, available equipment, schedule, and joint restrictions, then selects exercises and volume calibrated specifically to your constraints. Every rule is transparently displayed in your 'Why this plan' log."
    },
    {
      q: "What happens if I have an injury or joint issue?",
      a: "During the 22-question assessment, any reported knee, lower back, or shoulder restriction immediately triggers Restricted Mode. The engine filters out high-impact or axial-loading exercises (such as jumping or behind-the-neck presses) and substitutes joint-friendly alternatives."
    },
    {
      q: "Do I need a commercial gym membership?",
      a: "No. FIT Planner supports home setups (bodyweight only, resistance bands, dumbbells) as well as commercial gym equipment. Your exercises are filtered strictly to the gear you have."
    },
    {
      q: "Is nutrition guidance medically certified?",
      a: "No. FIT Planner provides general lifestyle and athletic nutrition guidance. We do not provide clinical medical nutrition therapy. As part of our safety-first policy, we advise consulting a licensed physician before starting any diet or exercise program."
    },
    {
      q: "How does billing and subscription work?",
      a: "FIT Planner offers 1-month, 3-month, and 6-month memberships. Billing uses industry-standard PCI-compliant providers (Stripe and Razorpay). In this development environment, payment keys are clearly labelled as 'Setup Required' until live credentials are configured."
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F9FA] flex flex-col justify-between selection:bg-[#28DACC] selection:text-[#000000]">
      {/* 1. PUBLIC HEADER (MyFitCoach Style) */}
      <header className="sticky top-0 z-50 bg-[#000000]/85 backdrop-blur-xl border-b border-[#1A1A1A] px-4 md:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Mobile Hamburger Menu Button (Drawer) */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl text-[#8E8E93] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-white">
                FIT<span className="text-[#28DACC]">PLANNER</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#28DACC] px-2 py-0.5 rounded-full bg-[#28DACC]/10 border border-[#28DACC]/20 tracking-widest uppercase">
                Pro OS
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs text-[#8E8E93] font-medium">
            <a href="#workout-plan" className="hover:text-white transition-colors">
              Workout Plan
            </a>
            <a href="#progressive-overload" className="hover:text-white transition-colors">
              Progressive Overload
            </a>
            <a href="#nutrition" className="hover:text-white transition-colors">
              Nutrition &amp; Recipes
            </a>
            <a href="#pros" className="hover:text-white transition-colors">
              Experiences of Pros
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Button */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#E0E0E0] border border-white/5 transition-colors"
              title="Select Language"
            >
              <span>{currentLanguage.flag}</span>
              <span className="font-mono text-[11px] font-semibold">{currentLanguage.code.toUpperCase()}</span>
            </button>

            {/* Working Theme Toggle Button (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E93] hover:text-[#28DACC] transition-colors border border-white/5"
              title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* User Profile / Account Menu Button (Hostinger Reference) */}
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="p-1 rounded-full hover:ring-2 hover:ring-[#28DACC]/50 transition-all relative"
              aria-label="User account and theme settings"
            >
              {user ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#28DACC] to-[#6366F1] flex items-center justify-center font-bold text-black text-xs shadow-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#28DACC]">
                  <UserIcon size={16} />
                </div>
              )}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#28DACC] border-2 border-black" />
            </button>

            <Link
              href="/assessment"
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#28DACC] hover:bg-[#38D8CE] text-[#000000] font-extrabold text-xs tracking-wide shadow-[0_0_16px_rgba(40,218,204,0.3)] active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <span>Start</span>
              <ArrowRight size={13} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 px-4 md:px-8 overflow-hidden">
        {/* Subtle cyan glow behind hero */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#28DACC]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#222222] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#28DACC] animate-pulse" />
              <span className="text-[#8E8E93]">Evidence-Based Athletic Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              GET STRONGER WITH YOUR PLAN
            </h1>

            <p className="text-base sm:text-lg text-[#8E8E93] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Personalized workout and nutrition plans backed by sports science. Tailored to your body, goals, equipment, and injury history.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/assessment"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#28DACC] hover:bg-[#38D8CE] text-[#000000] font-extrabold text-base tracking-wide shadow-[0_0_30px_rgba(40,218,204,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Start now</span>
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <div className="text-xs text-[#8E8E93] flex items-center gap-2">
                <span>⏱️ Takes only 1 minute</span>
                <span>·</span>
                <span>22 Quick Questions</span>
              </div>
            </div>

            {/* Social Proof Stars */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-[#8E8E93]">
              <div className="flex text-[#28DACC]">
                {"★".repeat(5)}
              </div>
              <span className="font-semibold text-white">4.9 / 5 Rating</span>
              <span className="text-[#333333]">|</span>
              <span>Over 430,000 Athletes Chosen</span>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-[#222222] bg-[#0A0A0A] shadow-2xl p-3">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-black">
                <img
                  src="/images/fit-planner/athletic_man_in_black_studio_wear.png"
                  alt="Athletic training physique"
                  className="w-full h-full object-cover object-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#121212]/90 backdrop-blur-md border border-[#262626]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">Daily Workout Ready</span>
                    <span className="text-[10px] font-mono text-[#28DACC] font-bold">45 MIN</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
                    <span className="w-2 h-2 rounded-full bg-[#28DACC]" />
                    <span>Upper Body Hypertrophy · 4 Exercises</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DARK WAVE DIVIDER */}
      <div className="w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-12 md:h-16 text-[#080808]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* 3. FEATURE SECTION 1: PERSONALIZED WORKOUT PLAN */}
      <section id="workout-plan" className="bg-[#080808] py-16 md:py-24 px-4 md:px-8 border-y border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Dual Phone Mockups */}
          <div className="lg:col-span-6 flex items-center justify-center gap-4">
            <div className="w-48 sm:w-56 rounded-3xl bg-[#0E0E0E] border border-[#222222] p-3 shadow-2xl">
              <div className="rounded-2xl bg-[#141414] p-3 border border-[#1F1F1F] space-y-2">
                <span className="text-[9px] font-mono text-[#28DACC] uppercase">Assessment</span>
                <div className="text-xs font-bold text-white">Where do you work out?</div>
                <div className="space-y-1.5 pt-1">
                  <div className="p-2 rounded-lg bg-[#1F1F1F] text-[10px] text-white flex justify-between items-center border border-[#28DACC]">
                    <span>Gym</span>
                    <span className="w-3 h-3 rounded-full bg-[#28DACC] text-black text-[8px] flex items-center justify-center font-bold">✓</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#141414] text-[10px] text-[#888888]">At Home</div>
                  <div className="p-2 rounded-lg bg-[#141414] text-[10px] text-[#888888]">Hybrid</div>
                </div>
              </div>
            </div>

            <div className="w-48 sm:w-56 rounded-3xl bg-[#0E0E0E] border border-[#222222] p-3 shadow-2xl -mt-6">
              <div className="rounded-2xl bg-[#141414] p-3 border border-[#1F1F1F] space-y-2">
                <span className="text-[9px] font-mono text-[#28DACC] uppercase">Today's Split</span>
                <div className="text-xs font-bold text-white">Chest &amp; Triceps Hypertrophy</div>
                <div className="space-y-1.5 pt-1 text-[10px]">
                  <div className="p-2 rounded-lg bg-[#1A1A1A] text-white flex justify-between">
                    <span>Barbell Bench Press</span>
                    <span className="font-mono text-[#28DACC]">3 × 8-10</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1A1A1A] text-white flex justify-between">
                    <span>Incline DB Press</span>
                    <span className="font-mono text-[#28DACC]">3 × 10-12</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1A1A1A] text-white flex justify-between">
                    <span>Dips (Chest Focus)</span>
                    <span className="font-mono text-[#28DACC]">3 × 10-12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
              Feature Pillar 1
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              PERSONALIZED WORKOUT PLAN
            </h2>
            <p className="text-sm sm:text-base text-[#8E8E93] leading-relaxed">
              Every exercise, set, and rep is calculated precisely for your strength level, available equipment, and injury history. No generic, one-size-fits-all PDF templates.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-[#F4F9FA] text-left pt-2">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#28DACC]/20 text-[#28DACC] flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Full Body, Upper/Lower, or Push/Pull/Legs periodization</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#28DACC]/20 text-[#28DACC] flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Restricted Mode protects sensitive knees, back, and shoulders</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#28DACC]/20 text-[#28DACC] flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Instant on-the-fly 'Adjust My Week' when life happens</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. FEATURE SECTION 2: STRONGER WITH EVERY WORKOUT */}
      <section id="progressive-overload" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-5 text-center lg:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
              Feature Pillar 2
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              STRONGER WITH EVERY WORKOUT
            </h2>
            <p className="text-sm sm:text-base text-[#8E8E93] leading-relaxed">
              FIT Planner increases your reps and weights weekly in achievable, science-backed steps. This automated double-progression allows you to make consistent progress without plateauing.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-[#F4F9FA] text-left pt-2">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#28DACC]/20 text-[#28DACC] flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Focus Mode with screen wake lock and automated rest timers</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#28DACC]/20 text-[#28DACC] flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>RPE and target rep logging that feeds next week's weights</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#28DACC]/20 text-[#28DACC] flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Auto-deload weeks to recover your central nervous system</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
            <div className="w-full max-w-md rounded-3xl bg-[#0E0E0E] border border-[#222222] p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1F1F1F]">
                <div>
                  <span className="text-[10px] font-mono text-[#28DACC] uppercase block">Focus Mode Live</span>
                  <span className="text-sm font-bold text-white">Barbell Bench Press</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#28DACC]/15 text-[#28DACC] font-mono text-xs font-bold">
                  Rest: 01:28
                </span>
              </div>

              {/* Set logging table */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-4 text-[#8E8E93] font-mono text-[10px] uppercase pb-1">
                  <span>Set</span>
                  <span>Target</span>
                  <span>Reps</span>
                  <span className="text-right">Status</span>
                </div>
                <div className="grid grid-cols-4 items-center p-2 rounded-xl bg-[#141414] border border-[#28DACC]/30 text-white font-mono">
                  <span className="font-bold text-[#28DACC]">Set 1</span>
                  <span>80 kg</span>
                  <span>10 reps</span>
                  <span className="text-right text-[#28DACC] font-bold">✓ Done</span>
                </div>
                <div className="grid grid-cols-4 items-center p-2 rounded-xl bg-[#141414] border border-[#222222] text-white font-mono">
                  <span className="font-bold text-white">Set 2</span>
                  <span>80 kg</span>
                  <span>10 reps</span>
                  <span className="text-right text-[#28DACC] font-bold">✓ Done</span>
                </div>
                <div className="grid grid-cols-4 items-center p-2 rounded-xl bg-[#181818] border border-[#28DACC] text-white font-mono shadow-[0_0_12px_rgba(40,218,204,0.15)]">
                  <span className="font-bold text-[#28DACC]">Set 3</span>
                  <span>82.5 kg</span>
                  <span>8-10</span>
                  <span className="text-right text-[#28DACC] animate-pulse">Logging...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE SECTION 3: SEE YOUR PROGRESS */}
      <section className="bg-[#080808] py-16 md:py-24 px-4 md:px-8 border-y border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
              Feature Pillar 3 · Scientific Progressive Overload
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              SEE YOUR STRENGTH PROGRESSION
            </h2>
            <p className="text-sm sm:text-base text-[#8E8E93] leading-relaxed">
              Track your estimated 1RM, workload capacity, and recovery readiness across every 12-week block. Real sports-science metrics with zero guessing.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <DynamicStrengthChart
              mode="demo"
              primary={DEMO_PRIMARY_SERIES}
              comparison={DEMO_COMPARISON_SERIES}
              unit="kg"
              metricLabel={DEMO_CHART_CONFIG.metricLabel}
              metrics={DEMO_METRICS}
              loop={true}
            />
          </div>

          <div className="text-center pt-2">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#28DACC] hover:bg-[#38D8CE] text-black font-extrabold text-xs tracking-wide active:scale-95 transition-all shadow-[0_0_24px_rgba(40,218,204,0.3)]"
            >
              <span>Calculate Your Target Growth</span>
              <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FEATURE SECTION 4: 4-CARD PILLAR SHOWCASE */}
      <section id="nutrition" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
              Holistic Athlete Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              EVERYTHING YOU NEED TO TRANSFORM
            </h2>
            <p className="text-xs sm:text-sm text-[#8E8E93]">
              Workouts, nutrition, bodyweight, and recovery work synchronously under a single unified OS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Nutrition */}
            <div className="group rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] overflow-hidden flex flex-col justify-between hover:border-[#28DACC]/50 transition-all">
              <div className="h-36 overflow-hidden relative">
                <img
                  src="/images/fit-planner/wholesome_kitchen_feast_with_fitness_focus.png"
                  alt="Nutrition"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
              </div>
              <div className="p-5 pt-0">
                <h3 className="text-base font-bold text-white">NUTRITION</h3>
                <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
                  Dynamic macronutrient and caloric targets tailored to your metabolic rate, body fat, and diet type.
                </p>
                <div className="mt-4 pt-3 border-t border-[#1C1C1C] text-[11px] font-mono text-[#28DACC]">
                  Protein · Carbs · Fats
                </div>
              </div>
            </div>

            {/* Card 2: Recipes */}
            <div className="group rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] overflow-hidden flex flex-col justify-between hover:border-[#28DACC]/50 transition-all">
              <div className="h-36 overflow-hidden relative">
                <img
                  src="/images/fit-planner/wholesome_kitchen_feast_with_fitness_focus.png"
                  alt="Recipes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
              </div>
              <div className="p-5 pt-0">
                <h3 className="text-base font-bold text-white">RECIPES</h3>
                <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
                  Over 300 macro-balanced meals with hard allergen filters for dairy, gluten, and nut intolerances.
                </p>
                <div className="mt-4 pt-3 border-t border-[#1C1C1C] text-[11px] font-mono text-[#28DACC]">
                  Strict Allergen Safety
                </div>
              </div>
            </div>

            {/* Card 3: Bodyweight */}
            <div className="group rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] overflow-hidden flex flex-col justify-between hover:border-[#28DACC]/50 transition-all">
              <div className="h-36 overflow-hidden relative">
                <img
                  src="/images/fit-planner/confident_fitness_waist_measurement_portrait.png"
                  alt="Bodyweight"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
              </div>
              <div className="p-5 pt-0">
                <h3 className="text-base font-bold text-white">BODYWEIGHT</h3>
                <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
                  Daily weight logs, moving averages, target weight pacing, and body fat estimation models.
                </p>
                <div className="mt-4 pt-3 border-t border-[#1C1C1C] text-[11px] font-mono text-[#28DACC]">
                  Trend Smoothing Pacing
                </div>
              </div>
            </div>

            {/* Card 4: Recovery */}
            <div className="group rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] overflow-hidden flex flex-col justify-between hover:border-[#28DACC]/50 transition-all">
              <div className="h-36 overflow-hidden relative">
                <img
                  src="/images/fit-planner/focused_gym_stretch_portrait.png"
                  alt="Recovery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
              </div>
              <div className="p-5 pt-0">
                <h3 className="text-base font-bold text-white">RECOVERY</h3>
                <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
                  Sleep tracking, daily activity NEAT adjustments, and fatigue management protecting against burnout.
                </p>
                <div className="mt-4 pt-3 border-t border-[#1C1C1C] text-[11px] font-mono text-[#28DACC]">
                  CNS Readiness Reserve
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#28DACC] hover:bg-[#38D8CE] text-black font-extrabold text-sm tracking-wide shadow-[0_0_24px_rgba(40,218,204,0.35)] active:scale-95 transition-all"
            >
              <span>Start now</span>
              <ArrowRight size={16} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. EXPERIENCES OF PROS (Direct from MyFitCoach screenshot) */}
      <section id="pros" className="bg-[#080808] py-16 md:py-24 px-4 md:px-8 border-y border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
              Athlete Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              EXPERIENCES OF PROS
            </h2>
            <p className="text-xs text-[#8E8E93]">
              What competitive athletes and trainers say about our deterministic periodization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: "Guy Amon",
                title: "Pro Natural Bodybuilder",
                img: "/images/fit-planner/full_length_portrait_of_a_bearded_athlete.png",
                quote: "The scientific periodization and progressive overload recommendations took my strength to another level without burning out."
              },
              {
                name: "John Laurent",
                title: "Fitness Coach & Strength Athlete",
                img: "/images/fit-planner/athletic_studio_portrait_in_black.png",
                quote: "Best app for progressive overload. The way it automatically adapts when you have back or knee restrictions is game-changing."
              },
              {
                name: "Florian Weber",
                title: "Competitive Powerlifter",
                img: "/images/fit-planner/studio_portrait_of_a_man_in_black_athleticwear.png",
                quote: "Having my workout volume and nutrition calibrated down to the exact rep and gram saved me hours of guesswork every week."
              },
              {
                name: "Luisa Eckhard",
                title: "Bikini Fitness Athlete",
                img: "/images/fit-planner/athletic_woman_in_black_sportswear.png",
                quote: "Finally an app that understands meal distribution and adjusts when I'm busy. The iOS app experience is lightning fast."
              },
              {
                name: "Patrick Reiser",
                title: "World Champion Bodybuilder",
                img: "/images/fit-planner/minimalist_studio_athlete_portrait.png",
                quote: "Pure evidence-based sports science. No marketing fluff, just consistent results and measurable progression every single workout."
              },
              {
                name: "Pierre Cohen",
                title: "Strength & Conditioning Specialist",
                img: "/images/fit-planner/full_body_portrait_in_black_athleticwear.png",
                quote: "Replaced an expensive personal trainer. The transparent 'Why this plan' explanations give you 100% confidence in the training."
              }
            ].map((pro, index) => (
              <div
                key={index}
                className="p-5 rounded-3xl bg-[#0E0E0E] border border-[#1F1F1F] flex flex-col justify-between hover:border-[#333333] transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#28DACC]/30 shrink-0">
                      <img
                        src={pro.img}
                        alt={pro.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{pro.name}</h4>
                      <span className="text-[11px] text-[#28DACC] block font-mono">{pro.title}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#A8C5CA] italic leading-relaxed">
                    "{pro.quote}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1A1A1A] flex items-center justify-between text-[10px] text-[#666666]">
                  <span>Verified Athlete</span>
                  <span className="text-[#28DACC]">★★★★★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC]">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-[#28DACC] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#8E8E93] transition-transform ${
                        isOpen ? "rotate-180 text-[#28DACC]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#8E8E93] leading-relaxed border-t border-[#1A1A1A] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL BOTTOM CTA BANNER (Matching MyFitCoach) */}
      <section className="bg-[#080808] border-t border-[#1A1A1A] py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            GET STRONGER WITH YOUR PLAN
          </h2>
          <p className="text-sm text-[#8E8E93] max-w-md mx-auto">
            Take the 1-minute fitness assessment and unlock your fully tailored training and nutrition program.
          </p>
          <div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-[#28DACC] hover:bg-[#38D8CE] text-black font-extrabold text-base tracking-wide shadow-[0_0_30px_rgba(40,218,204,0.4)] active:scale-95 transition-all"
            >
              <span>Start now</span>
              <ArrowRight size={18} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. CLEAN MINIMAL FOOTER */}
      <footer className="bg-black border-t border-[#1A1A1A] px-4 md:px-8 py-8 pb-24 lg:pb-8 text-xs text-[#666666]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-tight">FIT<span className="text-[#28DACC]">PLANNER</span></span>
            <span>· All rights reserved © 2026</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#8E8E93]">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              Medical Disclaimer
            </Link>
            <Link href="/membership" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/admin" className="hover:text-[#28DACC] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* 11. MOBILE APP BOTTOM FLOATING BAR (Hostinger Mobile Inspiration Screenshots 4 & 5) */}
      <MobileFloatingBar
        onToggleDrawer={() => setIsDrawerOpen(true)}
        onToggleProfile={() => setIsProfileMenuOpen(true)}
      />

      {/* 12. MOBILE SIDEBAR DRAWER (Hostinger Mobile Inspiration Screenshots 2 & 7) */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenProfile={() => setIsProfileMenuOpen(true)}
      />

      {/* 13. USER PROFILE POPUP MENU WITH WORKING THEME TOGGLE (Hostinger Mobile Inspiration Screenshots 1 & 3) */}
      <UserProfileMenu
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
      />

      {/* 14. LANGUAGE MODAL (Dummy Languages) */}
      <LanguageModal />
    </div>
  );
}
