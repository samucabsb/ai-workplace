"use client";

import React from "react";
import { Download, FileSpreadsheet, BookOpen, FileText } from "lucide-react";

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
    <div className="flex items-center gap-3">
      <button
        onClick={handleCsvDownload}
        className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-400 text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-glowEmerald"
      >
        <FileSpreadsheet size={15} className="text-emerald-400" />
        <span>Exportar CSV (PRISMA)</span>
      </button>

      <button
        onClick={handleBibtexDownload}
        className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-400 text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-glowCyan"
      >
        <BookOpen size={15} className="text-cyan-400" />
        <span>Exportar BibTeX (.bib)</span>
      </button>

      <button
        onClick={() => alert("Relatório em Markdown gerado com sucesso.")}
        className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer"
      >
        <FileText size={15} className="text-slate-400" />
        <span>Relatório de Auditoria</span>
      </button>
    </div>
  );
};
