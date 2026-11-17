"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Database
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginAsDemo, isSupabaseConfigured } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const res = await signup(email, password, name);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/app/today");
    } else {
      setError(res.error || "Signup failed.");
    }
  };

  const handleDemo = () => {
    loginAsDemo();
    router.push("/app/today");
  };

  return (
    <div className="min-h-[100dvh] bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-6">
      <header className="pt-safe flex items-center justify-between max-w-md mx-auto w-full">
        <Link
          href="/results"
          className="text-xs text-[#28DACC] font-medium active:opacity-70"
        >
          ← Back to Blueprint
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#A8C5CA]">
          FIT PLANNER
        </span>
      </header>

      <main className="max-w-md w-full mx-auto my-auto py-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#102831] border border-[#28DACC]/30 flex items-center justify-center text-[#28DACC] mx-auto mb-3">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-bold text-[#F4F9FA]">Save Your Training Plan</h1>
          <p className="text-xs text-[#A8C5CA] mt-1.5">
            Create your account to sync your generated split, exercises, and progression logs.
          </p>
        </div>

        {/* External service notice if Supabase is unconfigured */}
        {!isSupabaseConfigured && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#102831] border border-[#FFB020]/40 flex items-start gap-2.5">
            <Database size={18} className="text-[#FFB020] shrink-0 mt-0.5" />
            <div className="text-xs text-[#F4F9FA] leading-relaxed">
              <span className="font-semibold text-[#FFB020]">External Service Note:</span>{" "}
              Supabase Auth is currently in development mode. You can test the complete app flow using a Local Demo Athlete account below.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 text-xs text-[#FF5C5C] flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="ios-inset-group">
            <div className="ios-inset-row">
              <div className="flex items-center gap-3 w-full">
                <User size={18} className="text-[#A8C5CA]" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F4F9FA] placeholder:text-[#A8C5CA]/50 outline-none"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>

            <div className="ios-inset-row">
              <div className="flex items-center gap-3 w-full">
                <Mail size={18} className="text-[#A8C5CA]" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F4F9FA] placeholder:text-[#A8C5CA]/50 outline-none"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>

            <div className="ios-inset-row">
              <div className="flex items-center gap-3 w-full">
                <Lock size={18} className="text-[#A8C5CA]" />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F4F9FA] placeholder:text-[#A8C5CA]/50 outline-none"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[50px] rounded-[14px] bg-[#28DACC] text-[#07151D] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(40,218,204,0.3)] active:scale-[0.98] transition-all hover:bg-[#41E9DC]"
          >
            <span>{isSubmitting ? "Creating Profile..." : "Create Account & Save Plan"}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* 1-Click Demo Login option */}
        <div className="mt-4 pt-4 border-t border-[#28525B]/40 text-center">
          <p className="text-xs text-[#A8C5CA] mb-2.5">Reviewing as Evaluator or Developer?</p>
          <button
            type="button"
            onClick={handleDemo}
            className="w-full py-3 rounded-2xl bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC] hover:border-[#28DACC]/50 transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue as Demo Athlete (Demo Data)</span>
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-[#A8C5CA]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#28DACC] font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#A8C5CA]/60 pb-safe">
        By creating an account you agree to our Terms of Service & Privacy Policy.
      </footer>
    </div>
  );
}
