"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock, ArrowRight, AlertCircle, Database } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo, loginWithGoogle, loginWithFacebook, isSupabaseConfigured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setError(decodeURIComponent(urlError));
      }
    }
  }, []);

  const getNextTarget = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || params.get("redirect");
      if (next && next.startsWith("/") && !next.startsWith("//")) return next;
    }
    return "/app/today";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push(getNextTarget());
    } else {
      setError(res.error || "Login failed.");
    }
  };

  const handleDemo = () => {
    loginAsDemo();
    router.push(getNextTarget());
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleSubmitting(true);
      setError(null);
      const res = await loginWithGoogle(getNextTarget());
      if (!res.success) {
        setError(res.error || "Google sign-in could not be initiated.");
        setIsGoogleSubmitting(false);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during Google sign in.");
      setIsGoogleSubmitting(false);
    }
  };

  const handleFacebookLogin = async () => {
    await loginWithFacebook();
    router.push(getNextTarget());
  };

  return (
    <div className="min-h-[100dvh] bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-6">
      <header className="pt-safe flex items-center justify-between max-w-md mx-auto w-full">
        <Link href="/" className="text-xs text-[#28DACC] font-medium active:opacity-70">
          ← Home
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#A8C5CA]">
          FIT PLANNER
        </span>
      </header>

      <main className="max-w-md w-full mx-auto my-auto py-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#102831] border border-[#28DACC]/30 flex items-center justify-center text-[#28DACC] mx-auto mb-3">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-bold text-[#F4F9FA]">Welcome Back</h1>
          <p className="text-xs text-[#A8C5CA] mt-1.5">
            Log in to view your workout schedule and track your training log.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#102831] border border-[#FFB020]/40 flex items-start gap-2.5">
            <Database size={18} className="text-[#FFB020] shrink-0 mt-0.5" />
            <div className="text-xs text-[#F4F9FA] leading-relaxed">
              <span className="font-semibold text-[#FFB020]">Local Demo Mode:</span>{" "}
              Enter any credentials to sign in locally, or click Demo Athlete below.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 text-xs text-[#FF5C5C] flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Social Logins (Google & Facebook dummy) */}
        <div className="space-y-2.5 mb-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full h-12 rounded-2xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2.5 hover:bg-gray-100 transition-colors shadow-sm active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isGoogleSubmitting ? (
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            className="w-full h-12 rounded-2xl bg-[#1877F2] text-white font-semibold text-xs flex items-center justify-center gap-2.5 hover:bg-[#166FE5] transition-colors shadow-sm active:scale-[0.99]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] font-mono uppercase text-[#A8C5CA] tracking-wider">
            or with email
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="ios-inset-group">
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
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F4F9FA] placeholder:text-[#A8C5CA]/50 outline-none"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[#28DACC] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[50px] rounded-[14px] bg-[#28DACC] text-[#07151D] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(40,218,204,0.3)] active:scale-[0.98] transition-all hover:bg-[#41E9DC]"
          >
            <span>{isSubmitting ? "Logging In..." : "Log In"}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#28525B]/40 text-center">
          <p className="text-xs text-[#A8C5CA] mb-2.5">Testing or exploring?</p>
          <button
            type="button"
            onClick={handleDemo}
            className="w-full py-3 rounded-2xl bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC] hover:border-[#28DACC]/50 transition-colors"
          >
            Log in as Demo Athlete (Demo Data)
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-[#A8C5CA]">
          Don&apos;t have a plan yet?{" "}
          <Link href="/assessment" className="text-[#28DACC] font-semibold hover:underline">
            Take Assessment
          </Link>
        </div>
      </main>

      <footer className="text-center text-[11px] text-[#A8C5CA]/60 pb-safe">
        FIT Planner · Secure Encrypted Access
      </footer>
    </div>
  );
}
