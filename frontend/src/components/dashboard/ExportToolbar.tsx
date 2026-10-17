"use client";

import React from "react";
import { FileSpreadsheet, BookOpen, FileText } from "lucide-react";

interface ExportToolbarProps {
  reviewId?: string;
  onExportCsv?: () => void;
  onExportBibtex?: () => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  reviewId,
  onExportCsv,
  onExportBibtex,
}) => {
  const handleCsvDownload = () => {
    if (onExportCsv) return onExportCsv();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7860/api";
    window.open(`${apiUrl}/v1/reviews/${reviewId || "current"}/export/csv`, "_blank");
  };

  const handleBibtexDownload = () => {
    if (onExportBibtex) return onExportBibtex();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7860/api";
    window.open(`${apiUrl}/v1/reviews/${reviewId || "current"}/export/bibtex`, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleCsvDownload}
        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-sm transition active:scale-95"
      >
        <FileSpreadsheet size={14} className="text-emerald-600" />
        <span>Exportar Planilha CSV (PRISMA)</span>
      </button>

      <button
        onClick={handleBibtexDownload}
        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-sm transition active:scale-95"
      >
        <BookOpen size={14} className="text-blue-600" />
        <span>Exportar BibTeX (.bib)</span>
      </button>

      <button
        onClick={() => alert("Relatório de síntese pronto para cópia.")}
        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-sm transition active:scale-95"
      >
        <FileText size={14} className="text-slate-500" />
        <span>Relatório Textual</span>
      </button>
    </div>
  );
};
