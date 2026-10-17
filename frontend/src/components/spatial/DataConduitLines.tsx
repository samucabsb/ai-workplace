"use client";

import React from "react";
import { motion } from "framer-motion";

interface ConduitConnection {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
  color?: "cyan" | "emerald" | "amber" | "rose" | "blue";
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
        return { stroke: "#10b981", pulse: "#059669" };
      case "amber":
        return { stroke: "#f59e0b", pulse: "#d97706" };
      case "rose":
        return { stroke: "#f43f5e", pulse: "#e11d48" };
      case "blue":
      case "cyan":
      default:
        return { stroke: "#2563eb", pulse: "#1d4ed8" };
    }
  };

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {conduits.map((conduit) => {
        const theme = getColor(conduit.color);
        // Orthogonal/Isometric routing (Manhattan line)
        const midX = (conduit.from.x + conduit.to.x) / 2;
        const pathD = `M ${conduit.from.x} ${conduit.from.y} L ${midX} ${conduit.from.y} L ${midX} ${conduit.to.y} L ${conduit.to.x} ${conduit.to.y}`;

        return (
          <g key={conduit.id}>
            {/* Background passive architectural conduit track */}
            <path
              d={pathD}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active flow pulse line */}
            {conduit.active && (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke={theme.stroke}
                  strokeWidth="2"
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-conduit-flow"
                  opacity={0.85}
                />

                {/* Flowing particle */}
                <motion.circle
                  r="3.5"
                  fill={theme.pulse}
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
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
