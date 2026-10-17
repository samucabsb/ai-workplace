"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperItem } from "@/types";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ExternalLink,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden font-sans text-slate-800"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    Validação do Pesquisador (Human-in-the-Loop)
                  </h3>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Decisão Soberana
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {checkpointType === "screening"
                    ? "Selecione os artigos que cumprem seus critérios de inclusão antes de prosseguir para a auditoria."
                    : "Arbitragem de risco de viés: ratifique a permanência ou exclusão de artigos com fragilidades."}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Paper List Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600 pb-1 border-b border-slate-100">
              <span className="font-medium">
                {selectedIds.size} de {papers.length} artigos selecionados para inclusão
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set(papers.map((p) => p.id)))}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Selecionar Todos
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium hover:underline"
                >
                  Limpar Seleção
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {papers.map((paper) => {
                const isChecked = selectedIds.has(paper.id);

                return (
                  <div
                    key={paper.id}
                    onClick={() => togglePaper(paper.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? "bg-blue-50/40 border-blue-200"
                        : "bg-slate-50/60 border-slate-200 opacity-60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                          {paper.title}
                        </h4>
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-mono text-blue-600 hover:underline flex items-center gap-1 shrink-0"
                          >
                            <span>DOI</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>{paper.authors.slice(0, 3).join(", ")}</span>
                        <span>•</span>
                        <span>{paper.year || 2024}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600">{paper.journal || "Periódico Acadêmico"}</span>
                      </div>

                      {paper.abstract && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {paper.abstract}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Justification note */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Observações Metodológicas (Opcional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Insira critérios específicos de triagem ou justificativa de exclusão para o log de auditoria..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                rows={2}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/90">
            <div className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">{selectedIds.size}</span> estudos serão enviados para a bancada de auditoria.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Ratificar Seleção e Continuar</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
