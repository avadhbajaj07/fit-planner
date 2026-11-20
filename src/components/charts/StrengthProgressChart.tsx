"use client";

import React, { useState, useEffect, useRef, useMemo, useId, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  StrengthChartProps,
  StrengthPoint,
  validateStrengthData
} from "@/lib/chart/types";
import {
  buildChartPaths,
  generateChartA11yDescription,
  getModeBadgeText,
  getComparisonLabel
} from "@/lib/chart/e1rm";
import { Info, HelpCircle } from "lucide-react";

export function StrengthProgressChart({
  mode,
  primary,
  comparison,
  unit,
  metricLabel,
  metrics,
  className = "",
  loop = false
}: StrengthChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
  const [showFormulaPopover, setShowFormulaPopover] = useState(false);

  const titleId = useId();
  const descId = useId();
  const prefersReducedMotion = useReducedMotion();

  // Validate and sanitize inputs strictly
  const validation = useMemo(
    () => validateStrengthData(primary, comparison, unit),
    [primary, comparison, unit]
  );

  const cleanPrimary = validation.sanitizedPrimary;
  const cleanComparison = validation.sanitizedComparison;

  // Chart coordinate calculation (fixed aspect coordinate space: 600 x 300)
  const chartWidth = 600;
  const chartHeight = 280;
  const padding = { top: 30, right: 28, bottom: 42, left: 44 };

  // Calculate shared bounds across primary and comparison
  const allValues = useMemo(() => {
    const list: number[] = [];
    cleanPrimary.forEach((p) => {
      if (p.value !== null && Number.isFinite(p.value)) list.push(p.value);
    });
    if (cleanComparison) {
      cleanComparison.forEach((p) => {
        if (p.value !== null && Number.isFinite(p.value)) list.push(p.value);
      });
    }
    return list;
  }, [cleanPrimary, cleanComparison]);

  const { minY, maxY } = useMemo(() => {
    if (allValues.length === 0) return { minY: 0, maxY: 100 };
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const span = max - min;
    const pad = Math.max(5, span * 0.15);
    return {
      minY: Math.max(0, Math.floor(min - pad)),
      maxY: Math.ceil(max + pad)
    };
  }, [allValues]);

  // Path building with gap preservation
  const primaryPaths = useMemo(
    () => buildChartPaths(cleanPrimary, chartWidth, chartHeight, padding, minY, maxY),
    [cleanPrimary, minY, maxY]
  );

  const comparisonPaths = useMemo(() => {
    if (!cleanComparison) return null;
    return buildChartPaths(cleanComparison, chartWidth, chartHeight, padding, minY, maxY);
  }, [cleanComparison, minY, maxY]);

  // Screen reader description
  const a11yDescription = useMemo(
    () => generateChartA11yDescription(metricLabel, cleanPrimary, unit, mode),
    [metricLabel, cleanPrimary, unit, mode]
  );

  // IntersectionObserver: trigger when >= 40% visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.4) {
            setIsVisible(true);
          }
        });
      },
      { threshold: [0.4] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous loop handler when loop={true}
  useEffect(() => {
    if (!loop || !isVisible || prefersReducedMotion) return;

    // 2.5s draw animation + 3.5s display pause = 6.0s total cycle
    const interval = setInterval(() => {
      setAnimationCycle((prev) => prev + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [loop, isVisible, prefersReducedMotion]);

  // Find the final resting point coordinates for the primary series glowing dot
  const lastValidPrimary = useMemo(() => {
    const valid = primaryPaths.coordinates.filter((c) => c.y !== null);
    return valid.length > 0 ? valid[valid.length - 1] : null;
  }, [primaryPaths]);

  // Pointer scrubber handlers
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const clientX = e.clientX;
      const relX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, (relX - (padding.left / chartWidth) * rect.width) /
        (((chartWidth - padding.left - padding.right) / chartWidth) * rect.width)));
      
      const nearestWeek = Math.max(1, Math.min(12, Math.round(ratio * 11) + 1));
      setActiveIndex(nearestWeek);
    },
    [padding.left, padding.right, chartWidth]
  );

  const handlePointerLeave = useCallback(() => {
    if (!isKeyboardFocused) {
      setActiveIndex(null);
    }
  }, [isKeyboardFocused]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((prev) => (prev === null ? 12 : Math.max(1, prev - 1)));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((prev) => (prev === null ? 1 : Math.min(12, prev + 1)));
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(1);
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(12);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setActiveIndex(null);
        chartCardRef.current?.blur();
      }
    },
    []
  );

  // Active hover/focus point details
  const activeCoord = activeIndex !== null ? primaryPaths.coordinates[activeIndex - 1] : null;
  const activeCompCoord =
    activeIndex !== null && comparisonPaths ? comparisonPaths.coordinates[activeIndex - 1] : null;

  // Gridlines & Y-ticks
  const yTicks = useMemo(() => {
    const ticks = [];
    const count = 4;
    for (let i = 0; i <= count; i++) {
      const val = Math.round(minY + (i / count) * (maxY - minY));
      const y = chartHeight - padding.bottom - (i / count) * (chartHeight - padding.top - padding.bottom);
      ticks.push({ val, y });
    }
    return ticks;
  }, [minY, maxY, chartHeight, padding.top, padding.bottom]);

  // Weeks for X-axis
  const xWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Tooltip live announcement text
  const liveAnnouncement = useMemo(() => {
    if (!activeCoord) return "";
    const pVal = activeCoord.value !== null ? `${activeCoord.value} ${unit}` : "No data";
    const cVal =
      activeCompCoord && activeCompCoord.value !== null
        ? `, Baseline: ${activeCompCoord.value} ${unit}`
        : "";
    return `Week ${activeCoord.week}: ${metricLabel} ${pVal}${cVal}`;
  }, [activeCoord, activeCompCoord, unit, metricLabel]);

  // Member mode data existence check (<2 points -> show empty state)
  const validPointsCount = cleanPrimary.filter((p) => p.value !== null).length;
  const hasSufficientMemberData = mode === "demo" || validPointsCount >= 2;

  const modeBadge = getModeBadgeText(mode);
  const comparisonLegend = getComparisonLabel(mode);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-4xl mx-auto space-y-5 ${className}`}
      style={{ backgroundColor: "#080808" }}
    >
      {/* 1. CHART CARD CONTAINER */}
      <motion.div
        ref={chartCardRef}
        tabIndex={0}
        role="region"
        aria-label={`${metricLabel} Strength Progress Chart. Use arrow keys to explore weeks.`}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsKeyboardFocused(true);
          if (activeIndex === null) setActiveIndex(12);
        }}
        onBlur={() => {
          setIsKeyboardFocused(false);
          setActiveIndex(null);
        }}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={
          isVisible
            ? { opacity: 1, y: 0 }
            : prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 12 }
        }
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative rounded-[22px] p-4 sm:p-6 md:p-8 bg-[#101010] border border-white/8 shadow-2xl focus:outline-none focus:ring-1 focus:ring-[#22D3C5]/50 select-none"
        style={{ touchAction: "pan-y" }}
      >
        {/* Header & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-[#22D3C5] uppercase font-semibold">
                Sports-Science Metric
              </span>
              {mode === "member" && (
                <button
                  type="button"
                  onClick={() => setShowFormulaPopover(!showFormulaPopover)}
                  className="text-[#8E8E93] hover:text-[#22D3C5] transition-colors p-0.5 rounded focus:outline-none"
                  aria-label="Toggle Epley formula details"
                >
                  <Info size={13} />
                </button>
              )}
            </div>
            <h3 id={titleId} className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {metricLabel}
            </h3>
            {mode === "demo" ? (
              <p className="text-xs text-[#8E8E93] mt-0.5">
                {modeBadge}
              </p>
            ) : (
              <p className="text-xs text-[#8E8E93] mt-0.5">
                Computed from qualified working sets (&le;10 reps) via Epley formula
              </p>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-mono self-start sm:self-auto shrink-0 bg-[#0A0A0A] px-3.5 py-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-[2.5px] rounded-full bg-[#22D3C5]" />
              <span className="text-white font-medium">
                {mode === "demo" ? "FIT Planner" : "Personal PB"}
              </span>
            </div>
            {cleanComparison && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-[2px] border-b border-dashed border-[#AAB4B8]" />
                <span className="text-[#AAB4B8] font-medium">{comparisonLegend}</span>
              </div>
            )}
          </div>
        </div>

        {/* Formula Popover (Member mode) */}
        {showFormulaPopover && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#141414] border border-[#22D3C5]/30 text-xs text-[#E0E0E0] space-y-1.5 animate-in fade-in duration-200">
            <div className="font-bold text-[#22D3C5] flex items-center gap-1.5">
              <HelpCircle size={14} /> Epley Formula Reference
            </div>
            <p>
              Estimated 1RM is calculated as: <code className="text-white font-mono bg-black/40 px-1 py-0.5 rounded">Weight &times; (1 + Reps / 30)</code>
            </p>
            <p className="text-[#8E8E93]">
              To guarantee sports-science accuracy, sets with &gt;10 reps or incomplete reps are excluded from 1RM estimation. Weeks without qualifying data render as honest gaps.
            </p>
          </div>
        )}

        {/* 2. CUSTOM SVG CHART */}
        <div className="relative w-full overflow-hidden">
          <svg
            key={`chart-svg-${animationCycle}`}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="w-full h-auto cursor-crosshair overflow-visible"
          >
            <title id={titleId}>{metricLabel}</title>
            <desc id={descId}>{a11yDescription}</desc>

            <defs>
              {/* Turquoise Glow Filter */}
              <filter id="turquoiseGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Area Gradient (25% -> 0%) */}
              <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3C5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22D3C5" stopOpacity="0.00" />
              </linearGradient>

              {/* Wipe-in clip path for the area fill */}
              <clipPath id="drawClip">
                <motion.rect
                  x="0"
                  y="0"
                  width={chartWidth}
                  height={chartHeight}
                  initial={prefersReducedMotion ? { width: chartWidth } : { width: 0 }}
                  animate={isVisible ? { width: chartWidth } : { width: 0 }}
                  transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
                />
              </clipPath>
            </defs>

            {/* Subtle horizontal gridlines & Y-axis labels */}
            {yTicks.map((tick, i) => (
              <g key={`ytick-${i}`}>
                <line
                  x1={padding.left}
                  y1={tick.y}
                  x2={chartWidth - padding.right}
                  y2={tick.y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={tick.y + 3.5}
                  textAnchor="end"
                  fill="#8E8E93"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {tick.val}
                </text>
              </g>
            ))}

            {/* X-axis baseline */}
            <line
              x1={padding.left}
              y1={chartHeight - padding.bottom}
              x2={chartWidth - padding.right}
              y2={chartHeight - padding.bottom}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />

            {/* X-axis week labels */}
            {xWeeks.map((week) => {
              const x = padding.left + ((week - 1) / 11) * (chartWidth - padding.left - padding.right);
              return (
                <text
                  key={`week-${week}`}
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  fill={activeIndex === week ? "#22D3C5" : "#8E8E93"}
                  fontSize="11"
                  fontWeight={activeIndex === week ? "700" : "500"}
                  fontFamily="monospace"
                >
                  W{week}
                </text>
              );
            })}

            {/* 3. COMPARISON SERIES (Grey Dashed Line) */}
            {comparisonPaths && comparisonPaths.linePath && (
              <motion.path
                d={comparisonPaths.linePath}
                fill="none"
                stroke="#AAB4B8"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={
                  prefersReducedMotion ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }
                }
                animate={
                  isVisible
                    ? { pathLength: 1, opacity: 0.85 }
                    : prefersReducedMotion
                    ? { pathLength: 1, opacity: 0.8 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
              />
            )}

            {/* 4. PRIMARY SERIES AREA GRADIENT (Clipped follow) */}
            {primaryPaths.areaPath && (
              <path
                d={primaryPaths.areaPath}
                fill="url(#primaryAreaGrad)"
                clipPath="url(#drawClip)"
              />
            )}

            {/* 5. PRIMARY SERIES (Turquoise Solid Line) */}
            {primaryPaths.linePath && (
              <motion.path
                d={primaryPaths.linePath}
                fill="none"
                stroke="#22D3C5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={
                  prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.3 }
                }
                animate={
                  isVisible
                    ? { pathLength: 1, opacity: 1 }
                    : prefersReducedMotion
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0.3 }
                }
                transition={{ duration: 1.7, delay: 0.3, ease: "easeOut" }}
              />
            )}

            {/* 6. GLOWING DOT ON LINE END (Week 12 resting) */}
            {lastValidPrimary && lastValidPrimary.y !== null && (
              <motion.circle
                cx={lastValidPrimary.x}
                cy={lastValidPrimary.y}
                r={5.5}
                fill="#22D3C5"
                filter="url(#turquoiseGlow)"
                initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                animate={
                  isVisible
                    ? { scale: [0, 1.3, 1], opacity: 1 }
                    : prefersReducedMotion
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 0.6, delay: 1.9, ease: "easeOut" }}
              />
            )}

            {/* 7. INTERACTIVE SCRUBBER GUIDE LINE & DOTS */}
            {activeCoord && (
              <g pointerEvents="none">
                {/* Vertical guide line */}
                <line
                  x1={activeCoord.x}
                  y1={padding.top}
                  x2={activeCoord.x}
                  y2={chartHeight - padding.bottom}
                  stroke="#22D3C5"
                  strokeWidth="1.2"
                  strokeDasharray="2 3"
                  opacity={0.7}
                />

                {/* Primary point indicator */}
                {activeCoord.y !== null && (
                  <circle
                    cx={activeCoord.x}
                    cy={activeCoord.y}
                    r={6}
                    fill="#22D3C5"
                    stroke="#101010"
                    strokeWidth="2"
                    filter="url(#turquoiseGlow)"
                  />
                )}

                {/* Comparison point indicator */}
                {activeCompCoord && activeCompCoord.y !== null && (
                  <circle
                    cx={activeCompCoord.x}
                    cy={activeCompCoord.y}
                    r={4.5}
                    fill="#AAB4B8"
                    stroke="#101010"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            )}
          </svg>

          {/* Interactive Floating Tooltip */}
          {activeCoord && (
            <div
              className="absolute pointer-events-none transition-all duration-75 z-20"
              style={{
                left: `${Math.max(8, Math.min(activeCoord.x - 65, chartWidth - 140)) * (100 / chartWidth)}%`,
                top: "10px"
              }}
            >
              <div className="bg-[#141414] border border-[#22D3C5]/40 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md">
                <span className="text-[10px] font-mono text-[#8E8E93] uppercase block font-semibold">
                  Week {activeCoord.week}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#22D3C5]" />
                  <span className="text-xs font-bold text-white font-mono">
                    {activeCoord.value !== null ? `${activeCoord.value} ${unit}` : "No data logged"}
                  </span>
                </div>
                {activeCompCoord && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#AAB4B8]" />
                    <span className="text-xs font-medium text-[#AAB4B8] font-mono">
                      {activeCompCoord.value !== null
                        ? `${activeCompCoord.value} ${unit}`
                        : "No data"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden Accessible Table for Screen Readers */}
        <div className="sr-only">
          <table>
            <caption>{metricLabel} 12-Week Progression Data Table</caption>
            <thead>
              <tr>
                <th scope="col">Week</th>
                <th scope="col">Primary ({unit})</th>
                <th scope="col">Comparison ({unit})</th>
              </tr>
            </thead>
            <tbody>
              {cleanPrimary.map((p, idx) => {
                const comp = cleanComparison ? cleanComparison[idx] : undefined;
                return (
                  <tr key={`sr-row-${p.week}`}>
                    <td>Week {p.week}</td>
                    <td>{p.value !== null ? `${p.value} ${unit}` : "No data"}</td>
                    <td>{comp && comp.value !== null ? `${comp.value} ${unit}` : "No data"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ARIA Live Region for Tooltip announcements */}
        <div aria-live="polite" className="sr-only">
          {liveAnnouncement}
        </div>
      </motion.div>

      {/* 8. THREE METRIC CARDS BELOW */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={
          isVisible
            ? { opacity: 1, y: 0 }
            : prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 12 }
        }
        transition={{ duration: 0.5, delay: 1.8, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        {/* Metric 1: Training Volume */}
        <div className="rounded-2xl p-4 sm:p-5 bg-[#101010] border border-white/8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8E8E93] text-[11px] font-mono uppercase">
              <span>Training Volume</span>
              {mode === "demo" && (
                <span className="text-[10px] text-[#8E8E93]/70 font-semibold">Example</span>
              )}
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono tracking-tight">
              {hasSufficientMemberData && metrics?.volume ? (
                <>
                  {metrics.volume.value}{" "}
                  <span className="text-xs font-normal text-[#8E8E93]">
                    {metrics.volume.unit || unit}
                  </span>
                </>
              ) : (
                <span className="text-xs font-normal text-[#8E8E93]">Log 2+ weeks to see this</span>
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#8E8E93] mt-2 block">
            &Sigma;(Sets &times; Reps &times; Load)
          </span>
        </div>

        {/* Metric 2: Estimated Strength Change */}
        <div className="rounded-2xl p-4 sm:p-5 bg-[#101010] border border-[#22D3C5]/20 shadow-[0_0_20px_rgba(34,211,197,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#22D3C5] text-[11px] font-mono uppercase font-semibold">
              <span>Strength Change</span>
              {mode === "demo" && (
                <span className="text-[10px] text-[#8E8E93] font-normal">Example</span>
              )}
            </div>
            <div className="mt-2 text-2xl font-black text-[#22D3C5] font-mono tracking-tight">
              {hasSufficientMemberData && metrics?.strengthChange ? (
                <>
                  {metrics.strengthChange.value}{" "}
                  {metrics.strengthChange.unit && (
                    <span className="text-xs font-normal text-white/90">
                      ({metrics.strengthChange.unit})
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs font-normal text-[#8E8E93]">Log 2+ weeks to see this</span>
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#8E8E93] mt-2 block">
            Week 12 e1RM &minus; Week 1 e1RM
          </span>
        </div>

        {/* Metric 3: Workout Adherence */}
        <div className="rounded-2xl p-4 sm:p-5 bg-[#101010] border border-white/8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8E8E93] text-[11px] font-mono uppercase">
              <span>Adherence</span>
              {mode === "demo" && (
                <span className="text-[10px] text-[#8E8E93]/70 font-semibold">Example</span>
              )}
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono tracking-tight">
              {hasSufficientMemberData && metrics?.adherence ? (
                metrics.adherence.value
              ) : (
                <span className="text-xs font-normal text-[#8E8E93]">Log 2+ weeks to see this</span>
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#8E8E93] mt-2 block">
            Completed &divide; Planned Workouts
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function StrengthChartSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-pulse" aria-hidden="true">
      <div className="rounded-[22px] p-6 md:p-8 bg-[#101010] border border-white/8 h-[380px]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl p-5 bg-[#101010] border border-white/8 h-[96px]" />
        <div className="rounded-2xl p-5 bg-[#101010] border border-white/8 h-[96px]" />
        <div className="rounded-2xl p-5 bg-[#101010] border border-white/8 h-[96px]" />
      </div>
    </div>
  );
}
