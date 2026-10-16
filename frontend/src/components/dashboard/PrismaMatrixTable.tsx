"use client";

import React, { useState } from "react";
import { PrismaMatrixItem, RiskOfBiasLevel } from "@/types";
import { ExternalLink, CheckCircle2, AlertCircle, Quote, Search } from "lucide-react";

interface PrismaMatrixTableProps {
  rows: PrismaMatrixItem[];
  onSelectRow?: (row: PrismaMatrixItem) => void;
}

export const PrismaMatrixTable: React.FC<PrismaMatrixTableProps> = ({
  rows,
  onSelectRow,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>("ALL");

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.citation_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.authors.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      selectedRiskFilter === "ALL" || r.risk_of_bias === selectedRiskFilter;

    return matchesSearch && matchesFilter;
  });

  const getRiskBadge = (risk: RiskOfBiasLevel) => {
    switch (risk) {
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 size={11} /> Baixo Risco
          </span>
        );
      case "SOME_CONCERNS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/40 text-amber-400">
            <AlertCircle size={11} /> Algumas Preocupações
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <AlertCircle size={11} /> Alto Risco de Viés
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
            Não Avaliado
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
      {/* Table Header Filter Controls */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por título, autor, chave..."
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {["ALL", "LOW", "SOME_CONCERNS", "HIGH"].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setSelectedRiskFilter(filterKey)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedRiskFilter === filterKey
                    ? "bg-slate-800 text-cyan-400 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {filterKey === "ALL" ? "Todos os Riscos" : filterKey.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Mostrando <span className="text-cyan-400 font-bold">{filteredRows.length}</span> de{" "}
          <span className="text-slate-200">{rows.length}</span> estudos auditados
        </div>
      </div>

      {/* Table Scroll View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Chave & DOI</th>
              <th className="py-3 px-4">Estudo & Autores</th>
              <th className="py-3 px-4">Amostra (N)</th>
              <th className="py-3 px-4">Intervenção / Modelo</th>
              <th className="py-3 px-4">Risco de Viés (RoB 2)</th>
              <th className="py-3 px-4">Evidência Rastreada (Quote)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-sans">
            {filteredRows.map((row) => (
              <tr
                key={row.paper_id}
                onClick={() => onSelectRow && onSelectRow(row)}
                className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  <div className="font-bold text-cyan-400">{row.citation_key}</div>
                  <a
                    href={`https://doi.org/${row.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-slate-500 hover:text-cyan-300 inline-flex items-center gap-1 mt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{row.doi.length > 18 ? row.doi.slice(0, 18) + "..." : row.doi}</span>
                    <ExternalLink size={10} />
                  </a>
                </td>

                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-medium text-slate-200 line-clamp-2">
                    {row.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {row.authors.slice(0, 3).join(", ")} ({row.year})
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                  {row.population_n || "N/A"}
                </td>

                <td className="py-3.5 px-4 text-slate-300 max-w-xs line-clamp-2">
                  {row.intervention || "—"}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getRiskBadge(row.risk_of_bias)}
                </td>

                <td className="py-3.5 px-4 max-w-sm">
                  <div className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 italic">
                    <Quote size={12} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{row.traceable_quote}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
