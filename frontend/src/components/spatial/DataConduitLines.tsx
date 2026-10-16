"use client";

import React from "react";
import { motion } from "framer-motion";

interface ConduitConnection {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
  color?: "cyan" | "emerald" | "amber" | "rose";
}

interface DataConduitLinesProps {
  conduits: ConduitConnection[];
  className?: string;
}

export const DataConduitLines: React.FC<DataConduitLinesProps> = ({
  conduits,
  className = "",
}) => {
  const getColor = (color?: string) => {
    switch (color) {
      case "emerald":
        return {
          stroke: "#34d399",
          glow: "rgba(52, 211, 153, 0.6)",
          pulse: "#6ee7b7",
        };
      case "amber":
        return {
          stroke: "#f59e0b",
          glow: "rgba(245, 158, 11, 0.7)",
          pulse: "#fde68a",
        };
      case "rose":
        return {
          stroke: "#f43f5e",
          glow: "rgba(244, 63, 94, 0.7)",
          pulse: "#fda4af",
        };
      case "cyan":
      default:
        return {
          stroke: "#22d3ee",
          glow: "rgba(34, 211, 238, 0.6)",
          pulse: "#67e8f9",
        };
    }
  };

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="conduit-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {conduits.map((conduit) => {
        const theme = getColor(conduit.color);
        // Orthogonal/Isometric routing (Manhattan line)
        const midX = (conduit.from.x + conduit.to.x) / 2;
        const pathD = `M ${conduit.from.x} ${conduit.from.y} L ${midX} ${conduit.from.y} L ${midX} ${conduit.to.y} L ${conduit.to.x} ${conduit.to.y}`;

        return (
          <g key={conduit.id}>
            {/* Background passive conduit trench */}
            <path
              d={pathD}
              fill="none"
              stroke="#1e293b"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />

            {/* Active glowing data pulse line */}
            {conduit.active && (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke={theme.stroke}
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#conduit-glow)"
                  className="animate-conduit-flow"
                />

                {/* Flowing energy particle */}
                <motion.circle
                  r="3.5"
                  fill={theme.pulse}
                  filter="url(#conduit-glow)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "linear",
                  }}
                  style={{
                    offsetPath: `path("${pathD}")`,
                  }}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};
