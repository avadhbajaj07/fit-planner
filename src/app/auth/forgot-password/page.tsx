"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const { isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (supabase && isSupabaseConfigured) {
        const redirectUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/login`
            : undefined;

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: redirectUrl
        });

        if (error) {
          setErrorMessage(error.message);
          setIsSubmitting(false);
          return;
        }
      }

      // If live Supabase succeeded or running in local dev demo mode
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to initiate password reset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#07151D] text-[#F4F9FA] flex flex-col justify-between p-4 md:p-6">
      <header className="pt-safe flex items-center justify-between max-w-md mx-auto w-full">
        <Link href="/auth/login" className="text-xs text-[#28DACC] font-medium active:opacity-70">
          ← Back to Login
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#A8C5CA]">
          SHAPE RADAR
        </span>
      </header>

      <main className="max-w-md w-full mx-auto my-auto py-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#102831] border border-[#28DACC]/30 flex items-center justify-center text-[#28DACC] mx-auto mb-3">
            <KeyRound size={24} />
          </div>
          <h1 className="text-2xl font-bold text-[#F4F9FA]">Reset Password</h1>
          <p className="text-xs text-[#A8C5CA] mt-1.5">
            Enter your email to receive a secure recovery link.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 text-xs text-[#FF5C5C] flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="ios-glass-card rounded-3xl p-6 border border-[#28525B] text-center">
            <div className="w-10 h-10 rounded-full bg-[#28DA8B]/20 text-[#28DA8B] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-base font-bold text-[#F4F9FA]">Recovery Link Sent</h3>
            <p className="text-xs text-[#A8C5CA] mt-1.5 leading-relaxed">
              If an account matches <span className="text-[#F4F9FA] font-medium">{email}</span>, password reset instructions have been dispatched.
            </p>
            {!isSupabaseConfigured && (
              <p className="text-[11px] text-[#FFB020] mt-3">
                (Note: Live SMTP/Resend email service is currently in setup mode.)
              </p>
            )}
            <Link
              href="/auth/login"
              className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="ios-inset-group">
              <div className="ios-inset-row">
                <div className="flex items-center gap-3 w-full">
                  <Mail size={18} className="text-[#A8C5CA]" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-transparent text-sm text-[#F4F9FA] placeholder:text-[#A8C5CA]/50 outline-none"
                    style={{ fontSize: "16px" }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[50px] rounded-[14px] bg-[#28DACC] text-[#07151D] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(40,218,204,0.3)] active:scale-[0.98] transition-all hover:bg-[#41E9DC] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        )}
      </main>

      <footer className="text-center text-[11px] text-[#A8C5CA]/60 pb-safe">
        Shape Radar · Secure Encrypted Access
      </footer>
    </div>
  );
}
