"use client";

import React, { useRef, useEffect, useState } from "react";
import { AgentStatusBadge } from "./AgentStatusBadge";
import { DataConduitLines } from "./DataConduitLines";
import { AgentBenchId, AgentStateStatus } from "@/types";
import { Search, ShieldCheck, BookOpen, UserCheck, Microscope, Sparkles } from "lucide-react";

interface BenchDefinition {
  id: AgentBenchId;
  name: string;
  agentLabel: string;
  avatar: string;
  x: number; // percentage (0-100)
  y: number;
  status: AgentStateStatus;
  statusLabel?: string;
  speechBubble: string;
  themeColor: "blue" | "emerald" | "amber" | "rose";
  icon: any;
  description: string;
}

interface IsometricLabCanvasProps {
  currentStep: string;
  hitlPending: boolean;
  onSelectBench: (benchId: AgentBenchId) => void;
  selectedBenchId?: AgentBenchId | null;
  onOpenHitl?: () => void;
}

export const IsometricLabCanvas: React.FC<IsometricLabCanvasProps> = ({
  currentStep,
  hitlPending,
  onSelectBench,
  selectedBenchId,
  onOpenHitl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [benchCoordinates, setBenchCoordinates] = useState<Record<string, { x: number; y: number }>>({});

  const benches: BenchDefinition[] = [
    {
      id: "mining",
      name: "Terminal de Mineração",
      agentLabel: "Minerador de Literatura",
      avatar: "🔬",
      x: 24,
      y: 28,
      status: currentStep === "MINING" ? "WORKING" : "COMPLETED",
      statusLabel: currentStep === "MINING" ? "Buscando Artigos" : "Artigos Localizados",
      speechBubble:
        currentStep === "MINING"
          ? "Consultando OpenAlex, PubMed e SciELO com termos MeSH..."
          : "Artigos recuperados com DOI validado. Prontos para sua triagem!",
      themeColor: "blue",
      icon: Search,
      description: "Recuperação aberta de publicações científicas e validação de DOI.",
    },
    {
      id: "hitl",
      name: "Mesa de Supervisão Científica",
      agentLabel: "Pesquisador Responsável",
      avatar: "👨‍🔬",
      x: 52,
      y: 18,
      status: hitlPending ? "WAITING_APPROVAL" : "COMPLETED",
      statusLabel: hitlPending ? "Aprovação Necessária" : "Supervisão Ativa",
      speechBubble: hitlPending
        ? "Triagem pronta! Revise os artigos antes de avançarmos para auditoria."
        : "Critérios de inclusão e integridade metodológica ratificados.",
      themeColor: hitlPending ? "amber" : "emerald",
      icon: UserCheck,
      description: "Ponto de decisão soberana do pesquisador (Human-in-the-Loop).",
    },
    {
      id: "auditing",
      name: "Bancada de Rigor Metodológico",
      agentLabel: "Auditor Metodológico",
      avatar: "📊",
      x: 30,
      y: 68,
      status: currentStep === "AUDITING" ? "WORKING" : currentStep === "COMPLETED" ? "COMPLETED" : "IDLE",
      statusLabel: currentStep === "AUDITING" ? "Analisando Métodos" : currentStep === "COMPLETED" ? "Viés Verificado" : "Aguardando Artigos",
      speechBubble:
        currentStep === "AUDITING"
          ? "Auditando tamanho amostral (N), grupo controle, p-hacking e risco de viés (RoB 2)..."
          : currentStep === "COMPLETED"
          ? "Rigor metodológico e limitações estatísticas extraídas com sucesso."
          : "Aguardando artigos aprovados na triagem para iniciar auditoria.",
      themeColor: "rose",
      icon: ShieldCheck,
      description: "Auditoria estatística, poder amostral N e detecção de viés de publicação.",
    },
    {
      id: "synthesis",
      name: "Mesa de Síntese PRISMA",
      agentLabel: "Sintetizador de Evidências",
      avatar: "📑",
      x: 74,
      y: 58,
      status: currentStep === "SYNTHESIS" ? "WORKING" : currentStep === "COMPLETED" ? "COMPLETED" : "IDLE",
      statusLabel: currentStep === "COMPLETED" ? "Matriz PRISMA Pronta" : currentStep === "SYNTHESIS" ? "Sintetizando Dados" : "Em Espera",
      speechBubble:
        currentStep === "COMPLETED"
          ? "Matriz sistemática PRISMA 2020 consolidada e Knowledge Gaps mapeados!"
          : currentStep === "SYNTHESIS"
          ? "Consolidando dados comparativos e lacunas metodológicas..."
          : "Aguardando relatórios de auditoria para montar a síntese final.",
      themeColor: "emerald",
      icon: BookOpen,
      description: "Consolidação da matriz de revisão sistemática e mapeamento de lacunas.",
    },
  ];

  useEffect(() => {
    const updateCoordinates = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const coords: Record<string, { x: number; y: number }> = {};

      benches.forEach((bench) => {
        coords[bench.id] = {
          x: (bench.x / 100) * rect.width,
          y: (bench.y / 100) * rect.height,
        };
      });

      setBenchCoordinates(coords);
    };

    updateCoordinates();
    window.addEventListener("resize", updateCoordinates);
    return () => window.removeEventListener("resize", updateCoordinates);
  }, []);

  const conduits = [
    {
      id: "c-mining-hitl",
      from: benchCoordinates["mining"] || { x: 0, y: 0 },
      to: benchCoordinates["hitl"] || { x: 0, y: 0 },
      active: currentStep === "SCREENING_CHECKPOINT" || hitlPending,
      color: "amber" as const,
    },
    {
      id: "c-hitl-auditing",
      from: benchCoordinates["hitl"] || { x: 0, y: 0 },
      to: benchCoordinates["auditing"] || { x: 0, y: 0 },
      active: currentStep === "AUDITING" || currentStep === "PARSING",
      color: "blue" as const,
    },
    {
      id: "c-auditing-synthesis",
      from: benchCoordinates["auditing"] || { x: 0, y: 0 },
      to: benchCoordinates["synthesis"] || { x: 0, y: 0 },
      active: currentStep === "SYNTHESIS" || currentStep === "COMPLETED",
      color: "emerald" as const,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] rounded-2xl overflow-hidden architectural-grid border border-slate-200 bg-slate-50 shadow-sm select-none"
    >
      {/* Header bar within Lab diorama */}
      <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm pointer-events-auto">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Microscope size={16} />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-800">
              Laboratório Virtual de Pesquisa
            </h2>
            <p className="text-[10px] text-slate-500">
              Bancadas especializadas de assistência científica
            </p>
          </div>
        </div>

        {hitlPending && (
          <button
            onClick={onOpenHitl}
            className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-sm transition active:scale-95 animate-pulse"
          >
            <Sparkles size={14} />
            <span>Aprovação Humana Pendente</span>
          </button>
        )}
      </div>

      {/* Floor Isometric Texture Overlay */}
      <div className="absolute inset-0 isometric-floor opacity-40 pointer-events-none" />

      {/* SVG Conduits connecting workstations */}
      {benchCoordinates["mining"] && <DataConduitLines conduits={conduits} />}

      {/* Workstations Rendered as Clean Architectural Stations */}
      {benches.map((bench) => {
        const IconComponent = bench.icon;
        const isSelected = selectedBenchId === bench.id;

        return (
          <div
            key={bench.id}
            onClick={() => {
              onSelectBench(bench.id);
              if (bench.id === "hitl" && onOpenHitl) {
                onOpenHitl();
              }
            }}
            style={{
              left: `${bench.x}%`,
              top: `${bench.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute z-20 cursor-pointer group transition-all duration-200 ${
              isSelected ? "scale-105" : "hover:scale-[1.02]"
            }`}
          >
            {/* Status Badge */}
            <div className="mb-2 flex justify-center">
              <AgentStatusBadge
                agentName={bench.agentLabel}
                status={bench.status}
                statusLabel={bench.statusLabel}
              />
            </div>

            {/* Speech Bubble (Comic / Editorial Callout) */}
            <div className="relative mb-2 max-w-[210px] bg-white border border-slate-200 text-slate-700 text-[11px] leading-relaxed rounded-xl p-2.5 shadow-md">
              <div className="flex items-start gap-1.5">
                <span className="text-sm shrink-0">{bench.avatar}</span>
                <p className="font-sans line-clamp-3">{bench.speechBubble}</p>
              </div>
              {/* Bubble pointer arrow */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45" />
            </div>

            {/* Architectural Workstation Table / Card */}
            <div
              className={`relative w-52 p-3.5 rounded-2xl bg-white border transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-md"
                  : "border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={`p-2 rounded-xl border ${
                    bench.themeColor === "amber"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : bench.themeColor === "rose"
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : bench.themeColor === "emerald"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }`}
                >
                  <IconComponent size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-800 leading-tight">
                    {bench.name}
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    {bench.agentLabel}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                {bench.description}
              </p>

              {/* Floor accent bar */}
              <div
                className={`mt-2.5 h-1 w-full rounded-full ${
                  bench.status === "WORKING"
                    ? "bg-blue-600 animate-pulse"
                    : bench.status === "WAITING_APPROVAL"
                    ? "bg-amber-500"
                    : bench.status === "COMPLETED"
                    ? "bg-emerald-600"
                    : "bg-slate-200"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
