"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperItem } from "@/types";
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  Lock,
} from "lucide-react";

interface HumanApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkpointType: "screening" | "bias_arbitration";
  papers: PaperItem[];
  onConfirmApproval: (
    approvedIds: string[],
    rejectedIds: string[],
    notes: string
  ) => void;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  isOpen,
  onClose,
  checkpointType,
  papers,
  onConfirmApproval,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(papers.map((p) => p.id))
  );
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const togglePaper = (id: string) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  const handleConfirm = () => {
    const approved = Array.from(selectedIds);
    const rejected = papers.map((p) => p.id).filter((id) => !selectedIds.has(id));
    onConfirmApproval(approved, rejected, notes);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl glass-panel-amber border border-amber-500/50 shadow-2xl bg-slate-950 overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="p-5 border-b border-amber-500/30 flex items-center justify-between bg-amber-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <ShieldAlert size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold uppercase">
                    LangGraph HITL Checkpoint
                  </span>
                  <span className="text-xs text-amber-300 font-mono">
                    Interrupção Crítica
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-100 mt-0.5">
                  {checkpointType === "screening"
                    ? "Aprovação de Triagem de Literatura (Screening Gate)"
                    : "Arbitragem de Alto Risco de Viés Metodológico"}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Description Callout */}
          <div className="p-4 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Lock size={15} className="text-amber-400 shrink-0" />
            <span>
              <strong>Princípio de Soberania do Pesquisador:</strong> O motor multi-agente está pausado.
              Selecione os artigos que atendem aos seus critérios de inclusão antes de prosseguir com a extração e auditoria profunda.
            </span>
          </div>

          {/* Paper List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {papers.map((paper) => {
              const isIncluded = selectedIds.has(paper.id);

              return (
                <div
                  key={paper.id}
                  onClick={() => togglePaper(paper.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isIncluded
                      ? "bg-slate-900/80 border-slate-700 hover:border-amber-500/40"
                      : "bg-slate-950/60 border-rose-900/40 opacity-60 line-through"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isIncluded}
                    onChange={() => togglePaper(paper.id)}
                    className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-600"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold">
                        {paper.source_api}
                      </span>
                      {paper.doi && (
                        <span className="text-[10px] font-mono text-slate-400">
                          DOI: {paper.doi}
                        </span>
                      )}
                      {paper.doi_verified && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 size={11} /> Crossref OK
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-slate-100 mt-1">
                      {paper.title}
                    </h4>

                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {paper.authors.slice(0, 3).join(", ")} {paper.year ? `(${paper.year})` : ""}
                    </div>

                    {paper.abstract && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 italic">
                        {paper.abstract}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-bold">{selectedIds.size}</span> aprovados de{" "}
              <span>{papers.length}</span> artigos minerados
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 size={14} />
                <span>Aprovar & Retomar LangGraph</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
