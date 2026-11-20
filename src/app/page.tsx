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
  Search,
  Menu,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Dumbbell,
  Check,
  ChevronDown,
  Layers,
  Calendar,
  Lock,
  ChevronRight,
  Apple,
  TrendingUp,
  Heart,
  Award,
  Zap,
  Flame
} from "lucide-react";

const DynamicStrengthChart = dynamic(
  () =>
    import("@/components/charts/StrengthProgressChart").then((mod) => mod.StrengthProgressChart),
  {
    ssr: false,
    loading: () => <StrengthChartSkeleton />
  }
);

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentLanguage, setIsLanguageModalOpen } = useLanguage();
  const { user } = useAuth();

  const faqs = [
    {
      q: "How does Shape Radar work?",
      a: "Shape Radar delivers evidence-based progressive overload algorithms wrapped in a clean, high-performance interface. It features a complete 22-question assessment, pure deterministic workout generation, hard allergen nutrition filtering, and native Focus Mode rest timers."
    },
    {
      q: "How is my workout plan generated?",
      a: "Shape Radar uses a deterministic, rule-based recommendation engine. It analyzes your training goal, available equipment, schedule, and joint restrictions, then selects exercises and volume calibrated specifically to your constraints."
    },
    {
      q: "What happens if I have an injury or joint issue?",
      a: "During the assessment, any reported knee, lower back, or shoulder restriction immediately triggers Restricted Mode. The engine filters out high-impact or axial-loading exercises and substitutes joint-friendly alternatives."
    },
    {
      q: "Do I need a commercial gym membership?",
      a: "No. Shape Radar supports home setups (bodyweight only, resistance bands, dumbbells) as well as commercial gym equipment. Your exercises are filtered strictly to the gear you have."
    },
    {
      q: "Is nutrition guidance medically certified?",
      a: "No. Shape Radar provides general lifestyle and athletic nutrition guidance. We do not provide clinical medical nutrition therapy. We advise consulting a licensed physician before starting any diet or exercise program."
    },
    {
      q: "How does billing and subscription work?",
      a: "Shape Radar offers 1-month, 3-month, and 6-month memberships. Billing uses industry-standard PCI-compliant providers with a 30-day money-back guarantee."
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-[#673DE6] selection:text-white relative">
      {/* 1. TOP OFFER STRIP (#FF4F4F) */}
      <div
        className="w-full py-2 px-4 text-center text-xs font-semibold tracking-wide text-white flex items-center justify-center gap-2 select-none z-50"
        style={{ backgroundColor: "#FF4F4F" }}
      >
        <span>Black Friday: up to 85% off · 30-day money-back guarantee</span>
        <ArrowRight size={13} strokeWidth={2.5} className="hidden sm:inline-block" />
      </div>

      {/* 2. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo Square (Purple with SR) + Brand Name */}
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0"
                style={{ backgroundColor: "#673DE6" }}
              >
                SR
              </div>
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-white">
                Shape Radar
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs text-[#A8A5B5] font-medium">
            <a href="#workout-plan" className="hover:text-white transition-colors">
              Workouts
            </a>
            <a href="#progressive-overload" className="hover:text-white transition-colors">
              Progressive Overload
            </a>
            <a href="#nutrition" className="hover:text-white transition-colors">
              Nutrition
            </a>
            <a href="#pros" className="hover:text-white transition-colors">
              Experiences of Pros
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Search Pill: "Type the workout or goal you want", white circle search button */}
            <div className="hidden md:flex items-center pl-4 pr-1.5 py-1.5 rounded-full bg-[#1F1A2B] border border-white/10 text-xs w-64 lg:w-72 justify-between">
              <span className="text-[#A8A5B5] text-[11px] truncate">
                Type the workout or goal you want
              </span>
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                <Search size={12} strokeWidth={2.5} />
              </div>
            </div>

            {/* My Account / Avatar Button */}
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="p-1 rounded-full hover:ring-2 hover:ring-[#673DE6]/60 transition-all relative shrink-0"
              aria-label="User account and theme settings"
            >
              {user ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm"
                  style={{ backgroundColor: "#673DE6" }}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  SR
                </div>
              )}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#673DE6] border border-black" />
            </button>

            {/* Hamburger button (opens drawer) */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO (Always black with radial purple glow) */}
      <section
        className="relative pt-12 md:pt-20 pb-20 px-4 md:px-8 overflow-hidden text-center"
        style={{
          backgroundColor: "#000000",
          backgroundImage: "radial-gradient(120% 60% at 50% 100%, #6C4DFF 0%, #000000 70%)"
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Badge: Red rotated "85% OFF" tag */}
          <div className="inline-flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-white text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1 shadow-md"
              style={{
                backgroundColor: "#FF4F4F",
                transform: "rotate(-2deg)"
              }}
            >
              <Sparkles size={13} />
              <span>UP TO 85% OFF</span>
            </span>
          </div>

          {/* Headline: "Black Friday" */}
          <h1 className="hero-headline text-white">
            Black Friday
          </h1>

          {/* One-line subtext */}
          <p className="text-base sm:text-lg text-[#A8A5B5] max-w-xl mx-auto font-normal leading-relaxed">
            Build strength and transform your physique with one personalized plan, from $1.99/mo.
          </p>

          {/* White "Claim deal" button & guarantee */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white text-black font-bold text-sm hover:bg-[#F2F3F6] transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
            >
              <span>Claim deal</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#A8A5B5] pt-1">
            <ShieldCheck size={16} className="text-[#00A862]" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </section>

      {/* 4. THREE FEATURE CARDS (dark #15131C, 1px #2c2740 border, 16px radius) */}
      <section className="py-8 px-4 md:px-8 max-w-6xl mx-auto w-full -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Plan every workout */}
          <div
            className="p-6 rounded-[16px] border space-y-2 transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: "#15131C",
              borderColor: "#2c2740"
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3"
              style={{ backgroundColor: "#673DE6" }}
            >
              <Dumbbell size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Plan every workout</h3>
            <p className="text-xs text-[#A8A5B5] leading-relaxed">
              Automated double-progression with split recommendations calibrated specifically to your schedule and available equipment.
            </p>
          </div>

          {/* Card 2: Track every lift */}
          <div
            className="p-6 rounded-[16px] border space-y-2 transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: "#15131C",
              borderColor: "#2c2740"
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3"
              style={{ backgroundColor: "#673DE6" }}
            >
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Track every lift</h3>
            <p className="text-xs text-[#A8A5B5] leading-relaxed">
              RPE, target reps, and scientific Epley 1RM curve logging that feeds next week's weights with zero guessing.
            </p>
          </div>

          {/* Card 3: Eat to your macros */}
          <div
            className="p-6 rounded-[16px] border space-y-2 transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: "#15131C",
              borderColor: "#2c2740"
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3"
              style={{ backgroundColor: "#673DE6" }}
            >
              <Apple size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Eat to your macros</h3>
            <p className="text-xs text-[#A8A5B5] leading-relaxed">
              Filter through our 300+ recipe database with automated protein targets tailored directly to your goal and dietary preferences.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FEATURE SECTION 2: STRONGER WITH EVERY WORKOUT */}
      <section id="progressive-overload" className="py-16 md:py-24 px-4 md:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-5 text-center lg:text-left">
            <span
              className="chip-purple text-xs"
              style={{ backgroundColor: "#2C2260", color: "#A592FF" }}
            >
              Feature Pillar 2
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              STRONGER WITH EVERY WORKOUT
            </h2>
            <p className="text-sm sm:text-base text-[#A8A5B5] leading-relaxed">
              Shape Radar increases your reps and weights weekly in achievable, science-backed steps. This automated double-progression allows you to make consistent progress without plateauing.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-white/90 text-left pt-2">
              <li className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white"
                  style={{ backgroundColor: "#673DE6" }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Focus mode with screen wake lock and automated rest timers</span>
              </li>
              <li className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white"
                  style={{ backgroundColor: "#673DE6" }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>RPE and target rep logging that feeds next week's weights</span>
              </li>
              <li className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white"
                  style={{ backgroundColor: "#673DE6" }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>Auto-deload weeks to recover your central nervous system</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
            <div
              className="w-full max-w-md rounded-[24px] border p-5 shadow-2xl"
              style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase block" style={{ color: "#A592FF" }}>
                    Focus Mode Live
                  </span>
                  <span className="text-sm font-bold text-white">Barbell Bench Press</span>
                </div>
                <span
                  className="px-3 py-1 rounded-full font-mono text-xs font-bold"
                  style={{ backgroundColor: "#2C2260", color: "#A592FF" }}
                >
                  Rest: 01:28
                </span>
              </div>

              {/* Set logging table */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-4 text-[#A8A5B5] font-mono text-[10px] uppercase pb-1">
                  <span>Set</span>
                  <span>Target</span>
                  <span>Reps</span>
                  <span className="text-right">Status</span>
                </div>
                <div
                  className="grid grid-cols-4 items-center p-2 rounded-xl border text-white font-mono"
                  style={{ backgroundColor: "#1F1A2B", borderColor: "#673DE6" }}
                >
                  <span className="font-bold" style={{ color: "#A592FF" }}>Set 1</span>
                  <span>80 kg</span>
                  <span>10 reps</span>
                  <span className="text-right font-bold" style={{ color: "#00A862" }}>✓ Done</span>
                </div>
                <div
                  className="grid grid-cols-4 items-center p-2 rounded-xl border text-white font-mono"
                  style={{ backgroundColor: "#1F1A2B", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <span className="font-bold text-white">Set 2</span>
                  <span>80 kg</span>
                  <span>10 reps</span>
                  <span className="text-right font-bold" style={{ color: "#00A862" }}>✓ Done</span>
                </div>
                <div
                  className="grid grid-cols-4 items-center p-2 rounded-xl border text-white font-mono shadow-md"
                  style={{ backgroundColor: "#2C2260", borderColor: "#A592FF" }}
                >
                  <span className="font-bold" style={{ color: "#A592FF" }}>Set 3</span>
                  <span>82.5 kg</span>
                  <span>8-10</span>
                  <span className="text-right animate-pulse font-bold" style={{ color: "#A592FF" }}>Logging...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURE SECTION 3: ANIMATED STRENGTH PROGRESS CHART */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-y border-white/5" style={{ backgroundColor: "#0C0912" }}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span
              className="chip-purple text-xs"
              style={{ backgroundColor: "#2C2260", color: "#A592FF" }}
            >
              Feature Pillar 3 · Progressive Overload Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              SEE YOUR STRENGTH PROGRESSION
            </h2>
            <p className="text-sm sm:text-base text-[#A8A5B5] leading-relaxed">
              Track your estimated 1RM, workload capacity, and recovery readiness across every 12-week block with continuous interactive scrubbing.
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
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-white font-semibold text-xs tracking-wide active:scale-95 transition-all shadow-lg"
              style={{ backgroundColor: "#673DE6" }}
            >
              <span>Calculate your target growth</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. NUTRITION & RECIPES SECTION */}
      <section id="nutrition" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span
              className="chip-purple text-xs"
              style={{ backgroundColor: "#2C2260", color: "#A592FF" }}
            >
              Holistic Athlete Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              EVERYTHING YOU NEED TO TRANSFORM
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A5B5]">
              Workouts, nutrition, bodyweight, and recovery work synchronously under a single unified OS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="p-5 rounded-[20px] border space-y-2"
              style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#673DE6" }}>
                <Dumbbell size={16} />
              </div>
              <h4 className="font-bold text-sm text-white">Workouts &amp; Exercises</h4>
              <p className="text-xs text-[#A8A5B5]">
                Customized splits with auto rep/weight progression each week.
              </p>
            </div>

            <div
              className="p-5 rounded-[20px] border space-y-2"
              style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#673DE6" }}>
                <Apple size={16} />
              </div>
              <h4 className="font-bold text-sm text-white">Macro Calibrated Meals</h4>
              <p className="text-xs text-[#A8A5B5]">
                Over 300+ balanced meals filtered by your dietary restrictions.
              </p>
            </div>

            <div
              className="p-5 rounded-[20px] border space-y-2"
              style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#673DE6" }}>
                <TrendingUp size={16} />
              </div>
              <h4 className="font-bold text-sm text-white">Bodyweight &amp; Fat Tracking</h4>
              <p className="text-xs text-[#A8A5B5]">
                Automated surplus or deficit calories based on moving weight averages.
              </p>
            </div>

            <div
              className="p-5 rounded-[20px] border space-y-2"
              style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#673DE6" }}>
                <Heart size={16} />
              </div>
              <h4 className="font-bold text-sm text-white">Regeneration &amp; Deload</h4>
              <p className="text-xs text-[#A8A5B5]">
                Scheduled deload cycles that prevent central nervous system fatigue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ATHLETE EXPERIENCES */}
      <section id="pros" className="py-16 md:py-24 px-4 md:px-8 border-t border-white/5" style={{ backgroundColor: "#0C0912" }}>
        <div className="max-w-6xl mx-auto space-y-10 text-center">
          <div className="space-y-3">
            <span
              className="chip-purple text-xs"
              style={{ backgroundColor: "#2C2260", color: "#A592FF" }}
            >
              Community Proof
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              EXPERIENCES OF PROS
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A5B5]">
              Real lifters and athletes training with structured progressive overload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div
              className="p-6 rounded-[24px] border space-y-4"
              style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#673DE6] flex items-center justify-center font-bold text-white text-sm">
                  AR
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Alex Rivera</div>
                  <div className="text-xs text-[#A8A5B5]">Intermediate Lifter · 4 days/wk</div>
                </div>
              </div>
              <p className="text-xs text-[#A8A5B5] leading-relaxed">
                "The automated double progression took all guessing out of my bench and squat. I added 15kg to my working sets over 12 weeks without plateauing."
              </p>
            </div>

            <div
              className="p-6 rounded-[24px] border space-y-4"
              style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#673DE6] flex items-center justify-center font-bold text-white text-sm">
                  SK
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Sarah Kline</div>
                  <div className="text-xs text-[#A8A5B5]">Cross-training · Home Dumbbells</div>
                </div>
              </div>
              <p className="text-xs text-[#A8A5B5] leading-relaxed">
                "I train exclusively at home with adjustable dumbbells. The exercise substitutes for my lower back issues were an absolute game changer."
              </p>
            </div>

            <div
              className="p-6 rounded-[24px] border space-y-4"
              style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#673DE6] flex items-center justify-center font-bold text-white text-sm">
                  MD
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Marcus Davies</div>
                  <div className="text-xs text-[#A8A5B5]">Hypertrophy Focus · 5 days/wk</div>
                </div>
              </div>
              <p className="text-xs text-[#A8A5B5] leading-relaxed">
                "Clean interface, no bloated social feeds, just pure workout logging, rest timers, and macro targets that actually work."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section id="faq" className="py-16 md:py-24 px-4 md:px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span
              className="chip-purple text-xs"
              style={{ backgroundColor: "#2C2260", color: "#A592FF" }}
            >
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-[16px] border overflow-hidden transition-all"
                style={{ backgroundColor: "#15131C", borderColor: "#2c2740" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#A8A5B5] transition-transform duration-200 shrink-0 ml-2 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#A8A5B5] leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-20 px-4 md:px-8 text-center border-t border-white/5 relative" style={{ backgroundColor: "#0C0912" }}>
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            YOUR TRANSFORMATION STARTS TODAY
          </h2>
          <p className="text-sm text-[#A8A5B5] leading-relaxed">
            Answer the 22-question assessment to generate your personalized 12-week blueprint in under two minutes.
          </p>
          <div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-lg text-white font-bold text-sm tracking-wide shadow-2xl active:scale-95 transition-all"
              style={{ backgroundColor: "#673DE6" }}
            >
              <span>Start now</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER (FIXED OVERLAPPING BUG: AMPLE BOTTOM PADDING) */}
      <footer
        className="w-full border-t px-4 md:px-8 pt-8 pb-36 lg:pb-12 text-xs text-[#6D7081] relative z-10"
        style={{
          backgroundColor: "#0C0912",
          borderColor: "#2c2740"
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-white text-xs"
              style={{ backgroundColor: "#673DE6" }}
            >
              SR
            </div>
            <span className="font-bold text-white tracking-tight">Shape Radar</span>
            <span>· All rights reserved © 2026</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#A8A5B5]">
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
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* 12. MOBILE APP BOTTOM FLOATING BAR */}
      <MobileFloatingBar
        onToggleDrawer={() => setIsDrawerOpen(true)}
        onToggleProfile={() => setIsProfileMenuOpen(true)}
      />

      {/* 13. SIDE DRAWER */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenProfile={() => setIsProfileMenuOpen(true)}
      />

      {/* 14. MY ACCOUNT DROPDOWN */}
      <UserProfileMenu
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
      />

      {/* 15. LANGUAGE MODAL */}
      <LanguageModal />
    </div>
  );
}
