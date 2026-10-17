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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" /> Baixo Risco
          </span>
        );
      case "SOME_CONCERNS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle size={12} className="text-amber-600" /> Algumas Preocupações
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={12} className="text-rose-600" /> Alto Risco de Viés
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500 border border-slate-200">
            Não Avaliado
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm space-y-0">
      {/* Table Header Filter Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, autor ou chave..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64 shadow-2xl shadow-slate-100"
            />
          </div>

          <div className="flex items-center gap-1">
            {[
              { id: "ALL", label: "Todos os Estudos" },
              { id: "LOW", label: "Baixo Risco" },
              { id: "SOME_CONCERNS", label: "Preocupações" },
              { id: "HIGH", label: "Alto Risco" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedRiskFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedRiskFilter === f.id
                    ? "bg-white text-blue-700 border border-blue-200 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Mostrando <span className="text-slate-800 font-semibold">{filteredRows.length}</span> de{" "}
          <span>{rows.length}</span> estudos auditados
        </div>
      </div>

      {/* Table Scroll View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/60 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Chave & DOI</th>
              <th className="py-3 px-4">Estudo & Autores</th>
              <th className="py-3 px-4">Amostra (N)</th>
              <th className="py-3 px-4">Intervenção / Modelo</th>
              <th className="py-3 px-4">Risco de Viés (RoB 2)</th>
              <th className="py-3 px-4">Evidência Rastreável</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredRows.map((row) => (
              <tr
                key={row.paper_id}
                onClick={() => onSelectRow && onSelectRow(row)}
                className="hover:bg-slate-50/80 transition cursor-pointer group"
              >
                <td className="py-3.5 px-4 text-slate-700">
                  <div className="font-semibold text-blue-700">{row.citation_key}</div>
                  <a
                    href={`https://doi.org/${row.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-slate-400 hover:text-blue-600 inline-flex items-center gap-1 mt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{row.doi.length > 20 ? row.doi.slice(0, 20) + "..." : row.doi}</span>
                    <ExternalLink size={10} />
                  </a>
                </td>

                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-medium text-slate-900 line-clamp-2">
                    {row.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {row.authors.slice(0, 3).join(", ")} ({row.year})
                  </div>
                </td>

                <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                  {row.population_n || "N/A"}
                </td>

                <td className="py-3.5 px-4 text-slate-600 max-w-xs line-clamp-2">
                  {row.intervention || "—"}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getRiskBadge(row.risk_of_bias)}
                </td>

                <td className="py-3.5 px-4 max-w-sm">
                  <div className="flex items-start gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 italic">
                    <Quote size={12} className="text-blue-600 shrink-0 mt-0.5" />
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
