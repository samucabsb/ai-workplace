"use client";

import React, { useState } from "react";
import {
  IsometricLabCanvas,
} from "@/components/spatial/IsometricLabCanvas";
import { ControlBoardHUD } from "@/components/spatial/ControlBoardHUD";
import { PrismaMatrixTable } from "@/components/dashboard/PrismaMatrixTable";
import { KnowledgeGapsCard } from "@/components/dashboard/KnowledgeGapsCard";
import { ExportToolbar } from "@/components/dashboard/ExportToolbar";
import { HumanApprovalModal } from "@/components/hitl/HumanApprovalModal";
import {
  MOCK_PAPERS,
  MOCK_PRISMA_ROWS,
  MOCK_GAPS,
  createReview,
} from "@/lib/api";
import { AgentBenchId, PaperItem, PrismaMatrixItem } from "@/types";
import {
  Sparkles,
  Search,
  FlaskConical,
  Layers,
  Github,
  Key,
  ShieldCheck,
  CheckCircle2,
  Terminal,
} from "lucide-react";

export default function CortexLabHomePage() {
  const [topic, setTopic] = useState("Human Augmentation with Multi-Agent Systems in Scientific Synthesis");
  const [currentStep, setCurrentStep] = useState<string>("SCREENING_CHECKPOINT");
  const [hitlPending, setHitlPending] = useState<boolean>(true);
  const [checkpointType, setCheckpointType] = useState<"screening" | "bias_arbitration">("screening");
  const [isHitlModalOpen, setIsHitlModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"spatial" | "dashboard">("spatial");
  const [selectedBenchId, setSelectedBenchId] = useState<AgentBenchId | null>("hitl");
  const [papers, setPapers] = useState<PaperItem[]>(MOCK_PAPERS);
  const [prismaRows, setPrismaRows] = useState<PrismaMatrixItem[]>(MOCK_PRISMA_ROWS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<string>("rev-01");

  const quickPills = [
    "CAR-T Cell Therapy in Solid Tumors",
    "Multi-Agent AI in Evidence Synthesis",
    "CRISPR-Cas9 Off-Target Detection",
    "P-Hacking in Oncology Preprints",
  ];

  const handleLaunchReview = async (customQuery?: string) => {
    const queryToUse = customQuery || topic;
    setIsLoading(true);
    setCurrentStep("MINING");
    setHitlPending(false);

    try {
      const res = await createReview(queryToUse);
      if (res) {
        setReviewId(res.review_id || "rev-01");
        setCurrentStep("SCREENING_CHECKPOINT");
        setHitlPending(true);
        setCheckpointType("screening");
        if (res.papers && res.papers.length > 0) {
          setPapers(res.papers);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmHitl = (approvedIds: string[], rejectedIds: string[]) => {
    // Human approval confirmed: transition from screening to parsed and audited
    setHitlPending(false);
    setCurrentStep("COMPLETED");

    // Filter approved
    const remaining = papers.filter((p) => approvedIds.includes(p.id));
    setPapers(remaining);

    // Switch view to dashboard to view the generated matrix
    setTimeout(() => {
      setActiveTab("dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 shadow-glowCyan">
              <FlaskConical size={20} className="font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 font-mono">
                  CORTEXLAB
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  v1.0 • RESIDÊNCIA IA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                Human Augmentation in Scientific Research
              </p>
            </div>
          </div>

          {/* Center Tabs Switcher */}
          <div className="hidden md:flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab("spatial")}
              className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "spatial"
                  ? "bg-slate-800 text-cyan-400 font-bold border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FlaskConical size={14} />
              <span>Laboratório Espacial (HD-2D)</span>
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? "bg-slate-800 text-emerald-400 font-bold border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers size={14} />
              <span>Matriz PRISMA 2020</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("BYOK: Suas chaves de API (Google Gemini e Groq) são mantidas estritamente no seu navegador.")}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Key size={13} className="text-amber-400" />
              <span className="hidden sm:inline">BYOK Ativo</span>
            </button>

            <a
              href="https://github.com/samucabsb/cortex-lab"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer"
              aria-label="GitHub Repository"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
        {/* Research Query & Trigger Box */}
        <section className="rounded-3xl glass-panel p-5 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Defina o tema da revisão científica (ex: Mecanismos moleculares de resistência a inibidores de KRAS)..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>

              <button
                onClick={() => handleLaunchReview()}
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-glowCyan hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={16} />
                <span>{isLoading ? "Minerando Bases..." : "Iniciar Pipeline de Agentes"}</span>
              </button>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
              <span className="text-slate-400 text-[11px]">Tópicos Sugeridos:</span>
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => {
                    setTopic(pill);
                    handleLaunchReview(pill);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[11px] transition-all cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic View: Spatial Virtual Lab OR PRISMA Matrix Dashboard */}
        {activeTab === "spatial" ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
                  <span>Espaço de Trabalho HD-2D</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-normal">
                    WebGL Lighting Active
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Clique nas bancadas para inspecionar os agentes e aprove os pontos de decisão humana (HITL).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ExportToolbar reviewId={reviewId} />
              </div>
            </div>

            {/* Isometric Virtual Laboratory */}
            <IsometricLabCanvas
              currentStep={currentStep}
              hitlPending={hitlPending}
              onSelectBench={(benchId) => {
                setSelectedBenchId(benchId);
                if (benchId === "hitl") {
                  setIsHitlModalOpen(true);
                }
              }}
              selectedBenchId={selectedBenchId}
            />
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-100 font-mono">
                  Matriz de Síntese Sistemática (Padrão PRISMA 2020)
                </h1>
                <p className="text-xs text-slate-400">
                  Rastreabilidade 100% comprovada: nenhum parágrafo ou p-valor sem link para a fonte original.
                </p>
              </div>

              <ExportToolbar reviewId={reviewId} />
            </div>

            {/* Systematic Review Matrix Table */}
            <PrismaMatrixTable rows={prismaRows} />

            {/* Knowledge Gaps Card */}
            <KnowledgeGapsCard gaps={MOCK_GAPS} />
          </section>
        )}
      </main>

      {/* Floating Control Board HUD */}
      <ControlBoardHUD
        currentStep={currentStep}
        papersProcessed={papers.length}
        papersTotal={papers.length}
        activeAgentsCount={hitlPending ? 3 : 4}
        hitlPending={hitlPending}
        onOpenHitlModal={() => setIsHitlModalOpen(true)}
        onOpenDashboard={() => setActiveTab(activeTab === "spatial" ? "dashboard" : "spatial")}
        highRiskCount={1}
      />

      {/* Human-in-the-Loop Gateway Modal */}
      <HumanApprovalModal
        isOpen={isHitlModalOpen}
        onClose={() => setIsHitlModalOpen(false)}
        checkpointType={checkpointType}
        papers={papers}
        onConfirmApproval={handleConfirmHitl}
      />
    </div>
  );
}
