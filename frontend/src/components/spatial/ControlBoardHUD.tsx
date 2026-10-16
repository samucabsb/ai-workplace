"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  FileCheck2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

interface ControlBoardHUDProps {
  currentStep: string;
  papersProcessed: number;
  papersTotal: number;
  activeAgentsCount: number;
  hitlPending: boolean;
  onOpenHitlModal: () => void;
  onOpenDashboard: () => void;
  highRiskCount?: number;
}

export const ControlBoardHUD: React.FC<ControlBoardHUDProps> = ({
  currentStep,
  papersProcessed,
  papersTotal,
  activeAgentsCount,
  hitlPending,
  onOpenHitlModal,
  onOpenDashboard,
  highRiskCount = 0,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-40 w-96 font-mono select-none"
    >
      <div className="relative rounded-2xl p-4 glass-panel border border-slate-700/60 shadow-2xl backdrop-blur-xl bg-slate-950/85">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                hitlPending ? "bg-amber-400" : "bg-emerald-400"
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                hitlPending ? "bg-amber-500" : "bg-emerald-500"
              }`} />
            </span>
            <span className="text-xs font-bold tracking-widest text-slate-200 uppercase">
              CortexLab Telemetry
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-800/80 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
              STEP: {currentStep}
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              aria-label="Toggle HUD"
            >
              {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-3"
            >
              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-3 gap-2">
                {/* Active Agents */}
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex flex-col">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Cpu size={12} className="text-cyan-400" />
                    <span>Bancadas</span>
                  </div>
                  <span className="text-lg font-bold text-slate-100 mt-1">
                    {activeAgentsCount}/4
                  </span>
                  <span className="text-[9px] text-cyan-400">LangGraph Active</span>
                </div>

                {/* Papers Processed */}
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex flex-col">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <FileCheck2 size={12} className="text-emerald-400" />
                    <span>Artigos</span>
                  </div>
                  <span className="text-lg font-bold text-slate-100 mt-1">
                    {papersProcessed}
                  </span>
                  <span className="text-[9px] text-emerald-400">DOIs Validados</span>
                </div>

                {/* Risk of Bias Alerts */}
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex flex-col">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <AlertTriangle size={12} className={highRiskCount > 0 ? "text-amber-400" : "text-slate-400"} />
                    <span>Viés Alto</span>
                  </div>
                  <span className={`text-lg font-bold mt-1 ${highRiskCount > 0 ? "text-amber-400" : "text-slate-100"}`}>
                    {highRiskCount}
                  </span>
                  <span className="text-[9px] text-slate-400">RoB 2 Alerts</span>
                </div>
              </div>

              {/* Action Buttons & HITL Alarm */}
              {hitlPending ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenHitlModal}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
                >
                  <AlertTriangle size={14} className="animate-bounce" />
                  <span>Aprovar Checkpoint Humano (HITL)</span>
                </motion.button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenDashboard}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/30 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-glowCyan"
                  >
                    <Layers size={14} />
                    <span>Matriz PRISMA</span>
                  </button>
                  <button
                    onClick={onOpenHitlModal}
                    className="py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Activity size={14} />
                    <span>Inspecionar</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
