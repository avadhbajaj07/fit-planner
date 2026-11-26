"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 flex items-center justify-center text-[#FF5C5C] mb-5 shadow-xl">
        <AlertTriangle size={32} />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#FF5C5C] font-bold">
        Application Runtime Exception
      </span>
      <h1 className="text-3xl font-extrabold text-white mt-2 mb-3">
        Something Interrupted Your Session
      </h1>
      <p className="text-xs sm:text-sm text-[#A8C5CA] max-w-md leading-relaxed mb-8">
        We encountered an unexpected state. Your local progression and exercise logs remain securely saved on this device.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#28DACC] text-[#07151D] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#41E9DC] transition-colors shadow-lg active:scale-95"
        >
          <RefreshCw size={15} />
          <span>Retry Operation</span>
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#F4F9FA] flex items-center justify-center gap-2 hover:bg-[#153440] transition-colors"
        >
          <Home size={15} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
