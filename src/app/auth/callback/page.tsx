"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { syncAuthCookies, USER_STORAGE_KEY, UserProfile } from "@/lib/auth/authContext";
import { loadAssessmentProgress, syncAssessmentToSupabase } from "@/lib/assessment/storage";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    async function handleAuthCallback() {
      if (!supabase) {
        setStatus("error");
        setErrorMessage("Supabase client is not configured.");
        return;
      }

      // 1. Check for OAuth errors in search params (e.g., cancelled login or access_denied)
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      if (errorParam) {
        setStatus("error");
        const msg =
          errorParam === "access_denied"
            ? "Google sign-in was cancelled."
            : errorDescription || errorParam;
        setErrorMessage(msg);
        // Automatically redirect back to login after a brief pause
        setTimeout(() => {
          router.replace(`/auth/login?error=${encodeURIComponent(msg)}`);
        }, 1500);
        return;
      }

      const code = searchParams.get("code");
      const nextParam = searchParams.get("next");

      try {
        // 2. Exchange authorization code for Supabase session
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            // Check if session was already established (e.g. React StrictMode duplicate invoke)
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (!existingSession) {
              setStatus("error");
              setErrorMessage(exchangeError.message || "Failed to exchange authorization code.");
              return;
            }
          }
        }

        // 3. Verify active session (handles both PKCE code exchange and implicit hash tokens)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setStatus("error");
          setErrorMessage("No authenticated user session found.");
          return;
        }

        const user = session.user;
        const fallbackName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Athlete";

        // 4. Check existing profile in Supabase to avoid overwriting member roles or status
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!existingProfile) {
          // Create initial profile record if not already created by DB trigger
          try {
            await supabase.from("profiles").upsert(
              {
                id: user.id,
                email: user.email || "",
                full_name: fallbackName,
                avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                role: "customer",
                membership_status: "free",
                created_at: new Date().toISOString()
              },
              { onConflict: "id" }
            );
          } catch (profileErr) {
            console.warn("Profile creation sync notice:", profileErr);
          }
        }

        // 5. Construct user profile & sync session cookies for middleware
        const activeProfile: UserProfile = {
          id: user.id,
          email: user.email || "",
          fullName: existingProfile?.full_name || fallbackName,
          role: existingProfile?.role || "customer",
          isDemoAccount: false,
          membershipStatus: existingProfile?.membership_status || "free",
          createdAt: existingProfile?.created_at || user.created_at
        };

        syncAuthCookies(activeProfile);
        if (typeof window !== "undefined") {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(activeProfile));
        }

        // 6. Check assessment status to route returning vs new users
        let hasCompletedAssessment = false;
        try {
          const { data: assessmentRecord } = await supabase
            .from("member_assessments")
            .select("id, is_completed")
            .eq("user_id", user.id)
            .maybeSingle();

          const hasLocalAssessment = Boolean(
            typeof window !== "undefined" && localStorage.getItem("fit_planner_assessment_state")
          );

          if (assessmentRecord?.is_completed) {
            hasCompletedAssessment = true;
          } else if (hasLocalAssessment) {
            // User completed quiz as a guest before logging in with Google
            const localAnswers = loadAssessmentProgress();
            await syncAssessmentToSupabase(localAnswers, user.id);
            hasCompletedAssessment = true;
          }
        } catch (e) {
          console.warn("Assessment check failed, defaulting to dashboard", e);
          hasCompletedAssessment = true;
        }

        // 7. Route based on member state
        let destination = "/app/today";

        if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") && !nextParam.startsWith("/auth")) {
          // If a valid safe destination was explicitly requested
          if (hasCompletedAssessment) {
            destination = nextParam;
          } else {
            // New user without assessment must complete onboarding first
            destination = nextParam === "/membership" ? "/membership" : "/assessment";
          }
        } else {
          // Default routing: returning users -> dashboard, new users -> onboarding
          destination = hasCompletedAssessment ? "/app/today" : "/assessment";
        }

        setStatus("success");
        router.replace(destination);
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err?.message || "An unexpected error occurred during Google authentication.");
      }
    }

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-[100dvh] bg-[#07151D] text-[#F4F9FA] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#102831]/80 border border-[#28525B]/40 shadow-2xl text-center">
        {status === "processing" && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#28DACC]/10 border border-[#28DACC]/30 flex items-center justify-center text-[#28DACC] mx-auto animate-pulse">
              <div className="w-6 h-6 border-2 border-[#28DACC]/30 border-t-[#28DACC] rounded-full animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-[#F4F9FA]">Securing Your Session</h1>
            <p className="text-xs text-[#A8C5CA] leading-relaxed">
              Verifying your Google credentials and preparing your ShapeRadar dashboard...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#28DACC]/20 border border-[#28DACC]/50 flex items-center justify-center text-[#28DACC] mx-auto">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-xl font-bold text-[#F4F9FA]">Authenticated Successfully</h1>
            <p className="text-xs text-[#A8C5CA]">
              Redirecting you to your training program...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 flex items-center justify-center text-[#FF5C5C] mx-auto">
              <AlertCircle size={28} />
            </div>
            <h1 className="text-xl font-bold text-[#F4F9FA]">Authentication Failed</h1>
            <p className="text-xs text-[#FF5C5C] leading-relaxed">
              {errorMessage || "Unable to complete Google sign-in."}
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="w-full h-11 rounded-xl bg-[#28DACC] text-[#07151D] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#41E9DC] transition-all"
              >
                <span>Return to Login</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] bg-[#07151D] text-[#F4F9FA] flex items-center justify-center p-4">
          <div className="w-8 h-8 border-2 border-[#28DACC]/30 border-t-[#28DACC] rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
