"use client";

import React from "react";
import { motion } from "framer-motion";
import { AgentStateStatus } from "@/types";

interface AgentStatusBadgeProps {
  agentName: string;
  status: AgentStateStatus;
  statusLabel?: string;
  pulseColor?: "cyan" | "emerald" | "amber" | "rose" | "violet";
  className?: string;
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({
  agentName,
  status,
  statusLabel,
  pulseColor,
  className = "",
}) => {
  // Determine color scheme based on status if not explicitly passed
  let theme = pulseColor || "cyan";
  let displayLabel = statusLabel;

  if (!displayLabel) {
    switch (status) {
      case "WORKING":
        displayLabel = "PROCESSANDO DADOS";
        theme = theme || "cyan";
        break;
      case "WAITING_APPROVAL":
        displayLabel = "AGUARDANDO APROVAÇÃO";
        theme = "amber";
        break;
      case "COMPLETED":
        displayLabel = "ETAPA VALIDADA";
        theme = "emerald";
        break;
      case "ERROR":
        displayLabel = "ANOMALIA / VIÉS";
        theme = "rose";
        break;
      default:
        displayLabel = "STANDBY";
        theme = "cyan";
    }
  }

  const colorStyles = {
    cyan: {
      border: "border-cyan-500/40",
      bg: "bg-slate-900/80",
      text: "text-cyan-400",
      dot: "bg-cyan-400",
      shadow: "shadow-[0_0_15px_rgba(34,211,238,0.35)]",
      pulse: "bg-cyan-400/30",
    },
    emerald: {
      border: "border-emerald-500/40",
      bg: "bg-slate-900/80",
      text: "text-emerald-400",
      dot: "bg-emerald-400",
      shadow: "shadow-[0_0_15px_rgba(52,211,153,0.35)]",
      pulse: "bg-emerald-400/30",
    },
    amber: {
      border: "border-amber-500/60",
      bg: "bg-amber-950/40",
      text: "text-amber-400",
      dot: "bg-amber-400",
      shadow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
      pulse: "bg-amber-400/40",
    },
    rose: {
      border: "border-rose-500/60",
      bg: "bg-rose-950/40",
      text: "text-rose-400",
      dot: "bg-rose-400",
      shadow: "shadow-[0_0_20px_rgba(244,63,94,0.5)]",
      pulse: "bg-rose-400/40",
    },
    violet: {
      border: "border-purple-500/40",
      bg: "bg-slate-900/80",
      text: "text-purple-400",
      dot: "bg-purple-400",
      shadow: "shadow-[0_0_15px_rgba(168,85,247,0.35)]",
      pulse: "bg-purple-400/30",
    },
  }[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md text-xs font-mono tracking-wider uppercase transition-all duration-300 ${colorStyles.border} ${colorStyles.bg} ${colorStyles.shadow} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {status === "WORKING" || status === "WAITING_APPROVAL" ? (
          <span
            className={`absolute w-3 h-3 rounded-full animate-ping ${colorStyles.pulse}`}
          />
        ) : null}
        <span className={`w-2 h-2 rounded-full ${colorStyles.dot}`} />
      </div>

      <span className="font-semibold text-slate-300">{agentName}:</span>
      <span className={`font-bold ${colorStyles.text}`}>{displayLabel}</span>
    </motion.div>
  );
};
