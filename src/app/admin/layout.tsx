"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth/authContext";
import { ShieldAlert, Lock, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, loginAsAdminDemo } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07151D] flex items-center justify-center text-xs text-[#A8C5CA] gap-2">
        <Loader2 size={16} className="animate-spin text-[#28DACC]" />
        <span>Authenticating administrative credentials...</span>
      </div>
    );
  }

  // Enforce server & client-side admin role check
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 flex items-center justify-center text-[#FF5C5C] mb-5 shadow-xl">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Administrator Access Required
        </h1>
        <p className="text-xs sm:text-sm text-[#A8C5CA] max-w-md leading-relaxed mb-6">
          This portal contains restricted athlete records, billing rules, and exercise configuration. Your current account ({user ? user.email : "Unauthenticated Visitor"}) does not have an active <code className="text-[#28DACC]">admin</code> role.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/app/today"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#F4F9FA] flex items-center justify-center gap-2 hover:bg-[#153440] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Athlete App</span>
          </Link>

          <button
            type="button"
            onClick={loginAsAdminDemo}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#41E9DC] transition-colors shadow-lg active:scale-95"
          >
            <Lock size={14} />
            <span>Switch to Admin Demo Role</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col lg:flex-row">
      <Suspense fallback={<div className="w-64 bg-[#102831]" />}>
        <AdminSidebar />
      </Suspense>

      <div className="flex-1 min-h-screen overflow-y-auto p-4 md:p-8">
        <Suspense fallback={<div className="p-8 text-xs text-[#A8C5CA]">Loading Admin Console...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
