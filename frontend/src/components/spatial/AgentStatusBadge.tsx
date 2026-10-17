"use client";

import React from "react";
import { motion } from "framer-motion";
import { AgentStateStatus } from "@/types";

interface AgentStatusBadgeProps {
  agentName: string;
  status: AgentStateStatus;
  statusLabel?: string;
  pulseColor?: "cyan" | "emerald" | "amber" | "rose" | "violet" | "blue";
  className?: string;
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({
  agentName,
  status,
  statusLabel,
  className = "",
}) => {
  let displayLabel = statusLabel;
  let statusTheme = "blue";

  if (!displayLabel) {
    switch (status) {
      case "WORKING":
        displayLabel = "Em atividade...";
        statusTheme = "blue";
        break;
      case "WAITING_APPROVAL":
        displayLabel = "Aguardando validação";
        statusTheme = "amber";
        break;
      case "COMPLETED":
        displayLabel = "Etapa concluída";
        statusTheme = "emerald";
        break;
      case "ERROR":
        displayLabel = "Atenção requerida";
        statusTheme = "rose";
        break;
      default:
        displayLabel = "Pronto";
        statusTheme = "slate";
    }
  }

  const styles = {
    blue: {
      dot: "bg-blue-600",
      ping: "bg-blue-400",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
    },
    emerald: {
      dot: "bg-emerald-600",
      ping: "bg-emerald-400",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    amber: {
      dot: "bg-amber-600",
      ping: "bg-amber-400",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
    },
    rose: {
      dot: "bg-rose-600",
      ping: "bg-rose-400",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
    },
    slate: {
      dot: "bg-slate-400",
      ping: "bg-slate-300",
      badge: "bg-slate-100 text-slate-600 border-slate-200",
    },
  }[statusTheme as "blue" | "emerald" | "amber" | "rose" | "slate"] || {
    dot: "bg-blue-600",
    ping: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -2, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white shadow-sm text-xs font-sans transition-all ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {(status === "WORKING" || status === "WAITING_APPROVAL") && (
          <span className={`absolute w-2.5 h-2.5 rounded-full animate-ping opacity-75 ${styles.ping}`} />
        )}
        <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
      </div>

      <span className="font-semibold text-slate-800">{agentName}</span>
      <span className="text-slate-400">•</span>
      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${styles.badge}`}>
        {displayLabel}
      </span>
    </motion.div>
  );
};
