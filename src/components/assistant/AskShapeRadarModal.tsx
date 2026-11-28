"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  X,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Flame,
  Apple
} from "lucide-react";

interface AskResult {
  headline: string;
  answer: string;
  pillars: { title: string; detail: string }[];
  suggestedAction: { label: string; href: string };
}

interface AskShapeRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function AskShapeRadarModal({
  isOpen,
  onClose,
  initialQuery = ""
}: AskShapeRadarModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AskResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAsk = useCallback(async (queryText?: string) => {
    const q = (queryText ?? query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to query assistant.");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err?.message || "Failed to reach sports-science assistant.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
        handleAsk(initialQuery);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setError(null);
    }
  }, [isOpen, initialQuery, handleAsk]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAsk();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl border border-[#2c2740] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: "#15131C" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#673DE6]/20 border border-[#673DE6]/40 flex items-center justify-center text-[#A592FF]">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Ask Shape Radar
              </h2>
              <p className="text-[11px] text-[#A8A5B5]">
                Evidence-based training &amp; nutrition answers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#A8A5B5] hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-5 border-b border-white/5 bg-[#0C0912]">
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-4 text-[#A8A5B5] pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type the workout or goal you want..."
              className="w-full h-12 pl-11 pr-24 rounded-2xl bg-[#1F1A2B] border border-white/10 text-sm text-white placeholder:text-[#A8A5B5]/60 outline-none focus:border-[#673DE6] transition-colors"
            />
            <button
              type="button"
              onClick={() => handleAsk()}
              disabled={loading || !query.trim()}
              className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-[#673DE6] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-[#784BF0] disabled:opacity-40 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <>
                  <span>Ask</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>

          {/* Prompt Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "Add 10kg to bench", icon: Dumbbell, q: "How to add 10kg to bench press" },
              { label: "Fat loss protocol", icon: Flame, q: "Evidence based fat loss calories" },
              { label: "Daily protein target", icon: Apple, q: "How much protein for muscle growth" }
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(item.q);
                  handleAsk(item.q);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-[#A8A5B5] hover:text-white transition-colors"
              >
                <item.icon size={11} className="text-[#A592FF]" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 size={28} className="animate-spin text-[#673DE6]" />
              <p className="text-xs text-[#A8A5B5]">
                Synthesizing evidence-based athletic recommendations...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 text-xs text-[#FF5C5C] flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A592FF] font-bold">
                  Sports-Science Recommendation
                </span>
                <h3 className="text-base font-bold text-white">
                  {result.headline}
                </h3>
                <p className="text-xs text-[#A8A5B5] leading-relaxed">
                  {result.answer}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {result.pillars.map((pillar, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#0C0912] border border-white/5 space-y-1"
                  >
                    <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-[#28DACC]" />
                      <span>{pillar.title}</span>
                    </div>
                    <p className="text-[10px] text-[#A8A5B5] leading-tight">
                      {pillar.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href={result.suggestedAction.href}
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-[#673DE6] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#784BF0] transition-colors shadow-lg active:scale-98"
                >
                  <span>{result.suggestedAction.label}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="py-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#A8A5B5] mx-auto">
                <Sparkles size={18} />
              </div>
              <h4 className="text-sm font-bold text-white">Ready for your query</h4>
              <p className="text-xs text-[#A8A5B5] max-w-sm mx-auto">
                Ask about specific rep ranges, deload timing, macro breakdowns, or tailored exercise substitutions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
