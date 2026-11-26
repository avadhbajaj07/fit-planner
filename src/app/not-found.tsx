import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#673DE6]/20 border border-[#673DE6]/40 flex items-center justify-center text-[#A592FF] mb-5 shadow-xl">
        <Compass size={32} />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#28DACC] font-bold">
        404 · Route Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">
        Off the Training Radar
      </h1>
      <p className="text-xs sm:text-sm text-[#A8C5CA] max-w-md leading-relaxed mb-8">
        The athletic blueprint or section you were navigating toward does not exist or has been relocated to another progression tier.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#673DE6] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#784BF0] transition-colors shadow-lg active:scale-95"
        >
          <Home size={15} />
          <span>Return Home</span>
        </Link>
        <Link
          href="/assessment"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC] flex items-center justify-center gap-2 hover:bg-[#153440] transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Start Assessment</span>
        </Link>
      </div>
    </div>
  );
}
