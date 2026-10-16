"use client";

import React, { useRef, useEffect, useState } from "react";
import { AgentStatusBadge } from "./AgentStatusBadge";
import { DataConduitLines } from "./DataConduitLines";
import { AgentBenchId, AgentStateStatus } from "@/types";
import { Search, ShieldCheck, Dna, UserCheck } from "lucide-react";

interface BenchDefinition {
  id: AgentBenchId;
  name: string;
  agentLabel: string;
  x: number; // percentage coordinates (0-100)
  y: number;
  status: AgentStateStatus;
  statusLabel?: string;
  themeColor: "cyan" | "emerald" | "amber" | "rose" | "violet";
  icon: any;
  description: string;
}

interface IsometricLabCanvasProps {
  currentStep: string;
  hitlPending: boolean;
  onSelectBench: (benchId: AgentBenchId) => void;
  selectedBenchId?: AgentBenchId | null;
}

export const IsometricLabCanvas: React.FC<IsometricLabCanvasProps> = ({
  currentStep,
  hitlPending,
  onSelectBench,
  selectedBenchId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [benchCoordinates, setBenchCoordinates] = useState<Record<string, { x: number; y: number }>>({});

  // Dynamic status assignment based on workflow currentStep
  const benches: BenchDefinition[] = [
    {
      id: "mining",
      name: "Bancada de Mineração",
      agentLabel: "MinerAgent",
      x: 22,
      y: 35,
      status: currentStep === "MINING" ? "WORKING" : "COMPLETED",
      statusLabel: currentStep === "MINING" ? "MINERANDO ARTIGOS" : "42 PAPERS MINERADOS",
      themeColor: "cyan",
      icon: Search,
      description: "Busca federada em OpenAlex, Europe PMC e validação Crossref DOI.",
    },
    {
      id: "hitl",
      name: "Estação do Pesquisador (HITL)",
      agentLabel: "Human Gate",
      x: 50,
      y: 22,
      status: hitlPending ? "WAITING_APPROVAL" : "COMPLETED",
      statusLabel: hitlPending ? "AGUARDANDO APROVAÇÃO" : "SUPERVISÃO ATIVA",
      themeColor: hitlPending ? "amber" : "emerald",
      icon: UserCheck,
      description: "Ponto de decisão soberana do pesquisador: triagem e arbitragem de viés.",
    },
    {
      id: "auditing",
      name: "Bancada de Auditoria",
      agentLabel: "AuditorAgent",
      x: 35,
      y: 65,
      status: currentStep === "AUDITING" ? "WORKING" : currentStep === "COMPLETED" ? "COMPLETED" : "IDLE",
      statusLabel: currentStep === "AUDITING" ? "AUDITANDO MÉTODOS" : "ROB 2 CONCLUÍDO",
      themeColor: "rose",
      icon: ShieldCheck,
      description: "Auditoria estatística, p-hacking, tamanho amostral N e risco de viés.",
    },
    {
      id: "synthesis",
      name: "Bancada de Síntese",
      agentLabel: "SynthesizerAgent",
      x: 75,
      y: 55,
      status: currentStep === "SYNTHESIS" ? "WORKING" : currentStep === "COMPLETED" ? "COMPLETED" : "IDLE",
      statusLabel: currentStep === "COMPLETED" ? "PRISMA CONCLUÍDO" : "SÍNTESE DE GAPS",
      themeColor: "emerald",
      icon: Dna,
      description: "Geração da matriz sistemática PRISMA e identificação de Knowledge Gaps.",
    },
  ];

  // Update screen coordinates for SVG conduits on resize
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

  // Compute active conduits
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
      color: "cyan" as const,
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
      className="relative w-full h-[620px] rounded-3xl overflow-hidden cyber-grid border border-slate-800 bg-slate-950/90 shadow-2xl select-none"
    >
      {/* Ambient Radial Lights (Simulating WebGL lighting from holographic monitors) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lab Header Overlay */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-glowCyan">
          <Dna className="text-cyan-400 animate-pulse" size={20} />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
            Virtual Bio-Laboratory (HD-2D Isometric Space)
          </h2>
          <p className="text-xs text-slate-400">
            Orquestração Multi-Agente em Tempo Real • LangGraph Checkpoints Ativos
          </p>
        </div>
      </div>

      {/* SVG Data Conduit Lines */}
      {benchCoordinates["mining"] && <DataConduitLines conduits={conduits} />}

      {/* Workbenches rendered in space */}
      {benches.map((bench) => {
        const IconComponent = bench.icon;
        const isSelected = selectedBenchId === bench.id;

        return (
          <div
            key={bench.id}
            onClick={() => onSelectBench(bench.id)}
            style={{
              left: `${bench.x}%`,
              top: `${bench.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute z-20 cursor-pointer group transition-all duration-300 ${
              isSelected ? "scale-105" : "hover:scale-102"
            }`}
          >
            {/* Floating Status Badge above bench */}
            <div className="mb-2 flex justify-center">
              <AgentStatusBadge
                agentName={bench.agentLabel}
                status={bench.status}
                statusLabel={bench.statusLabel}
                pulseColor={bench.themeColor}
              />
            </div>

            {/* Isometric Bench Platform */}
            <div
              className={`relative w-48 p-3.5 rounded-2xl glass-panel border transition-all duration-300 ${
                isSelected
                  ? "border-cyan-400 ring-2 ring-cyan-400/40 shadow-glowCyan"
                  : "border-slate-700/80 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={`p-2 rounded-xl border ${
                    bench.themeColor === "amber"
                      ? "bg-amber-950/60 border-amber-500/40 text-amber-400"
                      : bench.themeColor === "rose"
                      ? "bg-rose-950/60 border-rose-500/40 text-rose-400"
                      : bench.themeColor === "emerald"
                      ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                      : "bg-cyan-950/60 border-cyan-500/40 text-cyan-400"
                  }`}
                >
                  <IconComponent size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 leading-tight">
                    {bench.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {bench.agentLabel}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {bench.description}
              </p>

              {/* Holographic floor projection indicator */}
              <div
                className={`mt-2 h-1 w-full rounded-full ${
                  bench.status === "WORKING"
                    ? "bg-cyan-400 animate-pulse"
                    : bench.status === "WAITING_APPROVAL"
                    ? "bg-amber-400 animate-ping"
                    : bench.status === "COMPLETED"
                    ? "bg-emerald-400"
                    : "bg-slate-700"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
