"use client";

import React from "react";
import { MuscleGroup } from "@/lib/engine/types";

interface BodyDiagramProps {
  activeMuscles: MuscleGroup[];
  className?: string;
  size?: number;
}

export const BodyDiagram: React.FC<BodyDiagramProps> = ({
  activeMuscles = [],
  className = "",
  size = 140
}) => {
  const isAll = activeMuscles.includes("full_body");
  const isChest = isAll || activeMuscles.includes("chest");
  const isBack = isAll || activeMuscles.includes("back");
  const isShoulders = isAll || activeMuscles.includes("shoulders");
  const isArms = isAll || activeMuscles.includes("arms");
  const isLegs = isAll || activeMuscles.includes("legs");
  const isCore = isAll || activeMuscles.includes("core");

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size * 1.5}
        viewBox="0 0 100 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 drop-shadow-[0_4px_12px_rgba(40,218,204,0.15)]"
      >
        {/* Head */}
        <circle
          cx="50"
          cy="14"
          r="9"
          stroke="#28525B"
          strokeWidth="2"
          fill="#102831"
        />

        {/* Neck */}
        <path d="M46 23 L46 27 M54 23 L54 27" stroke="#28525B" strokeWidth="2" />

        {/* Traps & Shoulders */}
        <path
          d="M32 36 C34 29 44 27 50 27 C56 27 66 29 68 36"
          stroke={isShoulders ? "#28DACC" : "#28525B"}
          strokeWidth="2.5"
          fill={isShoulders ? "rgba(40, 218, 204, 0.35)" : "#102831"}
        />

        {/* Shoulder Caps (Left & Right) */}
        <circle
          cx="28"
          cy="36"
          r="6"
          stroke={isShoulders ? "#28DACC" : "#28525B"}
          strokeWidth="2"
          fill={isShoulders ? "#28DACC" : "rgba(40, 82, 91, 0.4)"}
        />
        <circle
          cx="72"
          cy="36"
          r="6"
          stroke={isShoulders ? "#28DACC" : "#28525B"}
          strokeWidth="2"
          fill={isShoulders ? "#28DACC" : "rgba(40, 82, 91, 0.4)"}
        />

        {/* Chest Pectorals */}
        <path
          d="M34 37 Q50 42 66 37 L64 50 Q50 54 36 50 Z"
          stroke={isChest ? "#28DACC" : "#28525B"}
          strokeWidth="2"
          fill={isChest ? "rgba(40, 218, 204, 0.45)" : "#102831"}
        />

        {/* Mid-Back / Lats contour lines */}
        <path
          d="M34 40 L30 58 Q34 65 38 68 M66 40 L70 58 Q66 65 62 68"
          stroke={isBack ? "#28DACC" : "#28525B"}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Core / Abs */}
        <rect
          x="38"
          y="52"
          width="24"
          height="22"
          rx="4"
          stroke={isCore ? "#28DACC" : "#28525B"}
          strokeWidth="2"
          fill={isCore ? "rgba(40, 218, 204, 0.4)" : "#102831"}
        />
        {/* Ab grid definition lines */}
        <line x1="50" y1="53" x2="50" y2="73" stroke={isCore ? "#28DACC" : "#28525B"} strokeWidth="1" />
        <line x1="40" y1="62" x2="60" y2="62" stroke={isCore ? "#28DACC" : "#28525B"} strokeWidth="1" />

        {/* Arms - Biceps/Forearms */}
        <path
          d="M26 42 L22 62 C21 68 22 75 24 80"
          stroke={isArms ? "#28DACC" : "#28525B"}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M74 42 L78 62 C79 68 78 75 76 80"
          stroke={isArms ? "#28DACC" : "#28525B"}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Pelvis / Hips */}
        <path
          d="M36 74 L64 74 L58 84 L42 84 Z"
          stroke="#28525B"
          strokeWidth="2"
          fill="#102831"
        />

        {/* Legs / Quads & Calves */}
        {/* Left Leg */}
        <path
          d="M40 84 L36 112 L38 140"
          stroke={isLegs ? "#28DACC" : "#28525B"}
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Right Leg */}
        <path
          d="M60 84 L64 112 L62 140"
          stroke={isLegs ? "#28DACC" : "#28525B"}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Knee joint circles */}
        <circle
          cx="36"
          cy="112"
          r="3"
          fill={isLegs ? "#28DACC" : "#28525B"}
        />
        <circle
          cx="64"
          cy="112"
          r="3"
          fill={isLegs ? "#28DACC" : "#28525B"}
        />
      </svg>
    </div>
  );
};
