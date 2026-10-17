"use client";

import React from "react";
import { KnowledgeGapItem } from "@/types";
import { Sparkles, HelpCircle, Compass } from "lucide-react";

interface KnowledgeGapsCardProps {
  gaps: KnowledgeGapItem[];
}

export const KnowledgeGapsCard: React.FC<KnowledgeGapsCardProps> = ({ gaps }) => {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Lacunas de Conhecimento Científico (Knowledge Gaps)
          </h3>
          <p className="text-xs text-slate-500">
            Perguntas não respondidas e hipóteses testáveis sintetizadas a partir das limitações dos estudos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {gaps.map((gap) => (
          <div
            key={gap.gap_id}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 transition hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {gap.gap_id} • {gap.domain}
              </span>
            </div>

            <h4 className="text-xs font-semibold text-slate-900">
              {gap.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {gap.description}
            </p>

            {/* Unanswered Research Question */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
              <div className="flex items-start gap-2 text-xs">
                <HelpCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide block">
                    Pergunta Aberta na Literatura:
                  </span>
                  <span className="text-amber-900 font-medium italic">
                    &ldquo;{gap.unanswered_question}&rdquo;
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Hypothesis */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-start gap-2 text-xs">
              <Compass size={15} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wide block">
                  Hipótese Proposta para Futura Investigação:
                </span>
                <span className="text-blue-900">
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
