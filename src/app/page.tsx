"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
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
  ChevronRight
} from "lucide-react";
import { LivePlanCard } from "@/components/assessment/LivePlanCard";
import { AssessmentAnswers } from "@/lib/engine/types";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live interactive demo state for hero plan preview
  const [demoAnswers, setDemoAnswers] = useState<AssessmentAnswers>({
    gender: "prefer_not_to_say",
    age: 29,
    goal: "build_muscle",
    fitnessLevel: "beginner",
    location: "home",
    equipment: ["dumbbells", "bodyweight"],
    daysPerWeek: 3,
    durationMinutes: 45,
    restrictions: ["none"]
  });

  const faqs = [
    {
      q: "How is my workout plan generated?",
      a: "FIT Planner uses a deterministic, rule-based recommendation engine. It takes your training goal, available equipment, schedule, and joint restrictions, then selects exercises and volume calibrated specifically to your constraints. Every rule is transparently displayed in your 'Why this plan' log."
    },
    {
      q: "What happens if I have an injury or joint issue?",
      a: "During the assessment, any reported knee, lower back, or shoulder restriction immediately triggers Restricted Mode. The engine filters out high-impact or axial-loading exercises (such as jumping or behind-the-neck presses) and substitutes joint-friendly alternatives."
    },
    {
      q: "Do I need a gym membership?",
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
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between selection:bg-[#28DACC] selection:text-[#07151D]">
      {/* PUBLIC SLIM HEADER */}
      <header className="sticky top-0 z-50 bg-[#07151D]/85 backdrop-blur-xl border-b border-[#28525B]/40 px-4 md:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#142D35] border border-[#28DACC]/50 flex items-center justify-center text-[#28DACC]">
              <Dumbbell size={18} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#F4F9FA]">
                FIT PLANNER
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#28DACC] ml-2 tracking-widest uppercase">
                Athlete Log
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs text-[#A8C5CA] font-medium">
            <a href="#how-it-works" className="hover:text-[#F4F9FA] transition-colors">
              How It Works
            </a>
            <a href="#architecture" className="hover:text-[#F4F9FA] transition-colors">
              Transparent Engine
            </a>
            <a href="#features" className="hover:text-[#F4F9FA] transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-[#F4F9FA] transition-colors">
              Membership
            </a>
            <a href="#faq" className="hover:text-[#F4F9FA] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-[#A8C5CA] hover:text-[#F4F9FA] px-3 py-1.5 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/assessment"
              className="h-9 px-4 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(40,218,204,0.3)] active:scale-95 transition-all hover:bg-[#41E9DC]"
            >
              <span>Build My Plan</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH LIVE CARD DEMO */}
      <section className="relative overflow-hidden pt-10 pb-16 md:py-20 px-4 md:px-8">
        {/* Teal glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#28DACC]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC]">
              <Sparkles size={14} />
              <span>Deterministic Training Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F4F9FA] tracking-tight leading-[1.08]">
              Your Goals. <br />
              Your Body. <br />
              <span className="text-[#28DACC] drop-shadow-[0_0_25px_rgba(40,218,204,0.35)]">
                Your Plan.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#A8C5CA] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Structured workout and nutrition planning designed inside an iOS athlete training log. Watch your plan form in real-time as you answer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/assessment"
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-[#28DACC] text-[#07151D] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(40,218,204,0.35)] active:scale-[0.98] transition-all hover:bg-[#41E9DC]"
              >
                <span>Create My Fitness Plan</span>
                <ArrowRight size={17} />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-[#102831] border border-[#28525B] text-[#A8C5CA] hover:text-[#F4F9FA] font-semibold text-sm flex items-center justify-center transition-colors"
              >
                See How It Works
              </a>
            </div>

            {/* Quick Proof Pillars */}
            <div className="pt-6 border-t border-[#28525B]/40 grid grid-cols-3 gap-2 text-left">
              <div>
                <div className="text-xs font-mono font-bold text-[#28DACC]">90 Seconds</div>
                <div className="text-[11px] text-[#A8C5CA] mt-0.5">Stage A Assessment</div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#28DACC]">100% Logic</div>
                <div className="text-[11px] text-[#A8C5CA] mt-0.5">Transparent Rationale</div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#28DACC]">Safe Mode</div>
                <div className="text-[11px] text-[#A8C5CA] mt-0.5">Injury-Aware Regressions</div>
              </div>
            </div>
          </div>

          {/* Right Column: Signature Live Plan Card Interactive Demo */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md">
              <div className="text-center mb-3">
                <span className="text-[11px] uppercase font-mono tracking-wider text-[#A8C5CA]">
                  Interactive Signature Feature Demo
                </span>
              </div>
              <LivePlanCard
                answers={demoAnswers}
                step={3}
                totalSteps={9}
              />

              {/* Interactive control buttons below demo card */}
              <div className="mt-4 p-3 rounded-2xl bg-[#102831]/80 border border-[#28525B]/60 flex items-center justify-between text-xs">
                <span className="text-[#A8C5CA]">Toggle demo goal:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setDemoAnswers((p) => ({ ...p, goal: "build_muscle", daysPerWeek: 4 }))}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                      demoAnswers.goal === "build_muscle"
                        ? "bg-[#28DACC] text-[#07151D] font-bold"
                        : "bg-[#07151D] text-[#A8C5CA]"
                    }`}
                  >
                    Hypertrophy
                  </button>
                  <button
                    onClick={() => setDemoAnswers((p) => ({ ...p, goal: "lose_weight", daysPerWeek: 3 }))}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                      demoAnswers.goal === "lose_weight"
                        ? "bg-[#28DACC] text-[#07151D] font-bold"
                        : "bg-[#07151D] text-[#A8C5CA]"
                    }`}
                  >
                    Fat Loss
                  </button>
                  <button
                    onClick={() =>
                      setDemoAnswers((p) => ({
                        ...p,
                        restrictions: p.restrictions?.includes("knee") ? ["none"] : ["knee"]
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                      demoAnswers.restrictions?.includes("knee")
                        ? "bg-[#FFB020] text-[#07151D] font-bold"
                        : "bg-[#07151D] text-[#A8C5CA]"
                    }`}
                  >
                    Knee Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 STEPS) */}
      <section id="how-it-works" className="py-16 px-4 md:px-8 border-t border-[#28525B]/40 bg-[#07151D]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-[#28DACC]">
              The Workflow
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#F4F9FA] mt-1.5">
              How FIT Planner Works
            </h2>
            <p className="text-sm text-[#A8C5CA] mt-2">
              Three clear stages designed to calibrate structured, injury-aware training without confusing fitness jargon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
              <div className="w-10 h-10 rounded-2xl bg-[#102831] border border-[#28DACC]/30 text-[#28DACC] font-mono font-bold flex items-center justify-center text-base mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-[#F4F9FA]">Stage A: 90-Sec Intake</h3>
              <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
                Answer 9 targeted questions about your goal, equipment, schedule, and joint restrictions while the live blueprint adapts before your eyes.
              </p>
            </div>

            <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
              <div className="w-10 h-10 rounded-2xl bg-[#102831] border border-[#28DACC]/30 text-[#28DACC] font-mono font-bold flex items-center justify-center text-base mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-[#F4F9FA]">Transparent Plan Generation</h3>
              <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
                Our pure deterministic engine calculates your split, sets, rep ranges, and rest periods with complete &quot;Why this plan&quot; rationale explanations.
              </p>
            </div>

            <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B]">
              <div className="w-10 h-10 rounded-2xl bg-[#102831] border border-[#28525B]/40 text-[#28DACC] font-mono font-bold flex items-center justify-center text-base mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-[#F4F9FA]">Track & Progress</h3>
              <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
                Log your sets in Focus Mode with automatic rest timers, close your daily concentric rings, and dynamically adjust when life demands a shorter session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BENTO GRID */}
      <section id="features" className="py-16 px-4 md:px-8 border-t border-[#28525B]/40 bg-[#102831]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-[#28DACC]">
              Engineered For Athletes
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#F4F9FA] mt-1.5">
              Athlete Notebook Architecture
            </h2>
            <p className="text-sm text-[#A8C5CA] mt-2">
              Every feature serves your consistency, safety, and progressive overload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bento Tile 1: Restricted Mode (6 cols) */}
            <div className="md:col-span-6 ios-glass-card rounded-3xl p-6 border border-[#28525B] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FFB020]/20 text-[#FFB020] flex items-center justify-center mb-3">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#F4F9FA]">Restricted Mode Safety</h3>
                <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
                  Never risk re-injury. Reporting a knee, shoulder, or spinal restriction automatically excludes contraindicated exercises and switches the program to therapeutic, joint-friendly regressions.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-2xl bg-[#102831] border border-[#28525B]/60 text-xs text-[#FFB020] font-mono flex items-center gap-2">
                <span>✓ Filtered against 40+ medical exercise contraindications</span>
              </div>
            </div>

            {/* Bento Tile 2: Double Progression Scheme (6 cols) */}
            <div className="md:col-span-6 ios-glass-card rounded-3xl p-6 border border-[#28525B] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#28DACC]/20 text-[#28DACC] flex items-center justify-center mb-3">
                  <Scale size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#F4F9FA]">Double Progression Protocol</h3>
                <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
                  Clear, measurable progress. Complete the top of your target rep range (e.g. 12 reps on all sets) before increasing weight, preventing plateauing and form breakdown.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-2xl bg-[#102831] border border-[#28525B]/60 text-xs text-[#28DACC] font-mono flex items-center gap-2">
                <span>✓ Add reps first, then add load</span>
              </div>
            </div>

            {/* Bento Tile 3: Focus Mode & Timer (4 cols) */}
            <div className="md:col-span-4 ios-glass-card rounded-3xl p-6 border border-[#28525B]">
              <div className="w-10 h-10 rounded-2xl bg-[#102831] text-[#28DACC] flex items-center justify-center mb-3">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#F4F9FA]">Focus Mode</h3>
              <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
                Full-screen distraction-free workout execution. Automatic rest countdown with haptic feedback vibration.
              </p>
            </div>

            {/* Bento Tile 4: Adjust My Week (4 cols) */}
            <div className="md:col-span-4 ios-glass-card rounded-3xl p-6 border border-[#28525B]">
              <div className="w-10 h-10 rounded-2xl bg-[#102831] text-[#28DACC] flex items-center justify-center mb-3">
                <Sliders size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#F4F9FA]">Adjust My Week</h3>
              <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
                One-tap adapts when time is tight: 20-minute express mode, low energy deload, or bodyweight substitute.
              </p>
            </div>

            {/* Bento Tile 5: Concentric Ring Strip (4 cols) */}
            <div className="md:col-span-4 ios-glass-card rounded-3xl p-6 border border-[#28525B]">
              <div className="w-10 h-10 rounded-2xl bg-[#102831] text-[#28DA8B] flex items-center justify-center mb-3">
                <Activity size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#F4F9FA]">Activity Rings</h3>
              <p className="text-xs text-[#A8C5CA] mt-2 leading-relaxed">
                7-day circular weekly strip that closes rings as sessions and minutes are completed throughout the week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & MEMBERSHIP TEASER */}
      <section id="pricing" className="py-16 px-4 md:px-8 border-t border-[#28525B]/40 bg-[#07151D]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-mono tracking-widest text-[#28DACC]">
              Membership
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#F4F9FA] mt-1.5">
              Transparent Membership Tiers
            </h2>
            <p className="text-sm text-[#A8C5CA] mt-2">
              All plans include complete workout generation, logging, and upcoming nutrition modules.
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-[#102831] border border-[#FFB020]/40 max-w-2xl mx-auto mb-8 text-center text-xs text-[#F4F9FA]">
            <span className="font-semibold text-[#FFB020]">Payment Gateway Configuration Note:</span>{" "}
            Prices are admin-configurable. Until live Stripe or Razorpay API keys are configured in <code className="text-[#28DACC]">.env.local</code>, checkout runs in development preview mode.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "1-Month Plan",
                desc: "Flexible monthly training progression",
                price: "Configurable in Admin",
                badge: "Monthly"
              },
              {
                title: "3-Month Plan",
                desc: "Most popular: 12-week complete phase",
                price: "Configurable in Admin",
                badge: "Recommended",
                featured: true
              },
              {
                title: "6-Month Plan",
                desc: "Long-term athletic transformation",
                price: "Configurable in Admin",
                badge: "Best Value"
              }
            ].map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 border flex flex-col justify-between ${
                  tier.featured
                    ? "card-selected-glow bg-[#142D35]"
                    : "bg-[#102831] border-[#28525B]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#28DACC]">
                      {tier.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F4F9FA]">{tier.title}</h3>
                  <p className="text-xs text-[#A8C5CA] mt-1">{tier.desc}</p>
                  <div className="mt-4 text-sm font-mono text-[#A8C5CA] bg-[#07151D] p-3 rounded-xl border border-[#28525B]/50 text-center">
                    {tier.price}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#28525B]/40">
                  <Link
                    href="/assessment"
                    className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      tier.featured
                        ? "bg-[#28DACC] text-[#07151D] shadow-[0_0_15px_rgba(40,218,204,0.3)] hover:bg-[#41E9DC]"
                        : "bg-[#07151D] text-[#F4F9FA] border border-[#28525B] hover:border-[#28DACC]"
                    }`}
                  >
                    <span>Start Free Assessment</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 px-4 md:px-8 border-t border-[#28525B]/40 bg-[#102831]/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-mono tracking-widest text-[#28DACC]">
              Questions & Answers
            </span>
            <h2 className="text-3xl font-extrabold text-[#F4F9FA] mt-1.5">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="ios-glass-card rounded-2xl border border-[#28525B] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#F4F9FA]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={17}
                    className={`text-[#28DACC] transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4.5 pb-4.5 text-xs text-[#A8C5CA] leading-relaxed border-t border-[#28525B]/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 px-4 md:px-8 border-t border-[#28525B]/40 bg-gradient-to-b from-[#07151D] to-[#102831] text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#F4F9FA] tracking-tight">
            Build Your Personalized Plan in 90 Seconds
          </h2>
          <p className="text-sm text-[#A8C5CA] max-w-lg mx-auto">
            No endless scrolling, no guessing sets or reps. Just clear, progressive, injury-aware programming.
          </p>
          <div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-[#28DACC] text-[#07151D] font-extrabold text-sm shadow-[0_0_25px_rgba(40,218,204,0.35)] active:scale-95 transition-all hover:bg-[#41E9DC]"
            >
              <span>Create My Fitness Plan</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#28525B]/40 py-8 px-4 md:px-8 bg-[#07151D] text-xs text-[#A8C5CA]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#142D35] text-[#28DACC] flex items-center justify-center font-bold text-xs">
              FP
            </div>
            <span className="font-bold text-[#F4F9FA]">FIT Planner</span>
            <span className="text-[11px] text-[#A8C5CA]">© 2026. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap gap-4 text-[11px]">
            <Link href="/privacy" className="hover:text-[#F4F9FA]">
              Privacy Policy (GDPR/Swiss FADP)
            </Link>
            <Link href="/terms" className="hover:text-[#F4F9FA]">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-[#F4F9FA]">
              Medical Disclaimer
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
