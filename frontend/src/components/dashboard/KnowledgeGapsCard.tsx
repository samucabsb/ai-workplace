"use client";

import React from "react";
import { KnowledgeGapItem } from "@/types";
import { Sparkles, HelpCircle, Compass, ArrowRight } from "lucide-react";

interface KnowledgeGapsCardProps {
  gaps: KnowledgeGapItem[];
}

export const KnowledgeGapsCard: React.FC<KnowledgeGapsCardProps> = ({ gaps }) => {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="rounded-2xl glass-panel border border-purple-500/30 p-5 shadow-2xl bg-gradient-to-br from-slate-950/90 via-purple-950/20 to-slate-950/90">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Lacunas de Conhecimento Científico (Knowledge Gaps)
          </h3>
          <p className="text-xs text-slate-400">
            Sintetizadas a partir das limitações metodológicas dos artigos incluídos
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {gaps.map((gap) => (
          <div
            key={gap.gap_id}
            className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/20 hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 font-bold">
                {gap.gap_id} • {gap.domain}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-100 mb-1.5">
              {gap.title}
            </h4>
            <p className="text-xs text-slate-300 mb-3">{gap.description}</p>

            {/* Unanswered Research Question */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <HelpCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-amber-200/90 font-medium italic">
                  &ldquo;{gap.unanswered_question}&rdquo;
                </span>
              </div>

              {/* Generated Hypothesis */}
              <div className="flex items-start gap-2 text-xs pt-1 border-t border-slate-800/80">
                <Compass size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  <strong className="text-cyan-400 font-mono text-[11px]">Hipótese para Nova Pesquisa: </strong>
                  {gap.suggested_hypothesis}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
