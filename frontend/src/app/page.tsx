"use client";

import React, { useState } from "react";
import { IsometricLabCanvas } from "@/components/spatial/IsometricLabCanvas";
import { PrismaMatrixTable } from "@/components/dashboard/PrismaMatrixTable";
import { KnowledgeGapsCard } from "@/components/dashboard/KnowledgeGapsCard";
import { ExportToolbar } from "@/components/dashboard/ExportToolbar";
import { HumanApprovalModal } from "@/components/hitl/HumanApprovalModal";
import { ByokConfigModal } from "@/components/settings/ByokConfigModal";
import {
  MOCK_PAPERS,
  MOCK_PRISMA_ROWS,
  MOCK_GAPS,
  createReview,
} from "@/lib/api";
import { AgentBenchId, PaperItem, PrismaMatrixItem } from "@/types";
import { useLabStore } from "@/store/useLabStore";
import { useAgentStream } from "@/hooks/useAgentStream";
import {
  Search,
  BookOpen,
  Github,
  Key,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  FileCheck2,
} from "lucide-react";

export default function CortexLabHomePage() {
  const [topic, setTopic] = useState("Eficácia e toxicidade de CAR-T Cells em tumores sólidos");
  const [currentStep, setCurrentStep] = useState<string>("SCREENING_CHECKPOINT");
  const [hitlPending, setHitlPending] = useState<boolean>(true);
  const [checkpointType, setCheckpointType] = useState<"screening" | "bias_arbitration">("screening");
  const [isHitlModalOpen, setIsHitlModalOpen] = useState<boolean>(false);
  const [selectedBenchId, setSelectedBenchId] = useState<AgentBenchId | null>("hitl");
  const [papers, setPapers] = useState<PaperItem[]>(MOCK_PAPERS);
  const [prismaRows, setPrismaRows] = useState<PrismaMatrixItem[]>(MOCK_PRISMA_ROWS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<string>("rev-01");

  // Zustand Store & Real-time SSE Stream
  const { byok, setByokModalOpen, setReviewSession } = useLabStore();
  useAgentStream(reviewId);

  const quickPills = [
    "CAR-T Cell Therapy em Tumores Sólidos",
    "CRISPR-Cas9 em Distrofia Muscular",
    "Inteligência Artificial na Triagem de Oncologia",
    "P-Hacking e Subamostragem em Preprints",
  ];

  const handleLaunchReview = async (customQuery?: string) => {
    const queryToUse = customQuery || topic;
    setIsLoading(true);
    setCurrentStep("MINING");
    setHitlPending(false);

    try {
      const res = await createReview(queryToUse);
      if (res) {
        const newRevId = res.review_id || "rev-01";
        setReviewId(newRevId);
        setCurrentStep("SCREENING_CHECKPOINT");
        setHitlPending(true);
        setCheckpointType("screening");
        if (res.papers && res.papers.length > 0) {
          setPapers(res.papers);
        }
        setReviewSession({
          review_id: newRevId,
          query: queryToUse,
          current_step: "SCREENING_CHECKPOINT",
          hitl_pending: true,
          raw_papers: res.papers || [],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmHitl = (approvedIds: string[], rejectedIds: string[]) => {
    setHitlPending(false);
    setCurrentStep("COMPLETED");

    const remaining = papers.filter((p) => approvedIds.includes(p.id));
    setPapers(remaining);
  };

  const hasByokKeys = Boolean(byok.geminiApiKey || byok.groqApiKey);

  // Stepper logic
  const getStepNumber = () => {
    if (currentStep === "PLANNING") return 1;
    if (currentStep === "MINING" || currentStep === "SCREENING_CHECKPOINT") return 2;
    if (currentStep === "AUDITING" || currentStep === "BIAS_ARBITRATION_CHECKPOINT") return 3;
    if (currentStep === "SYNTHESIS" || currentStep === "COMPLETED") return 4;
    return 2;
  };
  const activeStepNum = getStepNumber();

  const steps = [
    { num: 1, title: "Estruturação PICO" },
    { num: 2, title: "Mineração de Artigos" },
    { num: 3, title: "Auditoria Metodológica" },
    { num: 4, title: "Síntese PRISMA" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Clean Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="max-w-[1720px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  CortexLab
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Revisão Científica
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Assistência Multi-Agente & Human Augmentation
              </p>
            </div>
          </div>

          {/* Stepper Horizontal Limpo */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
            {steps.map((st, idx) => {
              const isPast = activeStepNum > st.num;
              const isCurrent = activeStepNum === st.num;

              return (
                <React.Fragment key={st.num}>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                      isCurrent
                        ? "bg-white text-blue-700 shadow-sm font-semibold"
                        : isPast
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 size={13} className="text-emerald-600" />
                    ) : (
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {st.num}
                      </span>
                    )}
                    <span>{st.title}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <ChevronRight size={12} className="text-slate-400" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setByokModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                hasByokKeys
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              }`}
            >
              <Key size={13} className={hasByokKeys ? "text-emerald-600" : "text-slate-500"} />
              <span>
                {hasByokKeys ? "Chaves de IA Ativas" : "Chaves de IA (Grátis)"}
              </span>
            </button>

            <a
              href="https://github.com/samucabsb/cortex-lab"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition shadow-sm"
              title="Código Fonte no GitHub"
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-[1720px] mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lado Esquerdo (Fixo / Sticky no Desktop): Diorama do Laboratório */}
          <section className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span>Maquete do Laboratório de Pesquisa</span>
                  <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Bancadas Ativas
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Clique nas estações de trabalho para inspecionar os agentes
                </p>
              </div>

              {hitlPending && (
                <button
                  onClick={() => setIsHitlModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-sm transition active:scale-95 flex items-center gap-1.5"
                >
                  <FileCheck2 size={13} />
                  <span>Validar Triagem</span>
                </button>
              )}
            </div>

            {/* Canvas Isométrico em Estilo Maquete Arquitetônica Iluminada */}
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
              onOpenHitl={() => setIsHitlModalOpen(true)}
            />

            {/* Card com Resumo do Protocolo Ativo */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  Bases Integradas: <strong>OpenAlex</strong>, <strong>PubMed</strong>, <strong>SciELO</strong> e <strong>Europe PMC</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Sessão #{reviewId}
              </span>
            </div>
          </section>

          {/* Lado Direito (Scroll Suave): O Caderno de Pesquisa Científico */}
          <section className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* Caixa de Pergunta de Pesquisa & Acionamento */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Qual é a sua pergunta de pesquisa ou tema de revisão? (ex: Eficácia da terapia celular CAR-T)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>

                <button
                  onClick={() => handleLaunchReview()}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>{isLoading ? "Consultando Bases..." : "Iniciar Revisão Científica"}</span>
                </button>
              </div>

              {/* Sugestões Rápidas de Temas */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-slate-400 text-[11px] font-medium">Sugestões:</span>
                {quickPills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => {
                      setTopic(pill);
                      handleLaunchReview(pill);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 text-[11px] transition cursor-pointer"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Barra de Exportação e Metadados da Matriz */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-xs font-semibold text-slate-800">
                  Caderno de Extração & Síntese Sistemática
                </h3>
                <p className="text-[11px] text-slate-500">
                  Metodologia compatível com PRISMA 2020 e citação auditada
                </p>
              </div>

              <ExportToolbar reviewId={reviewId} />
            </div>

            {/* Lacunas de Conhecimento Científico */}
            <KnowledgeGapsCard gaps={MOCK_GAPS} />

            {/* Tabela Comparativa de Artigos (PRISMA) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Matriz Comparativa de Artigos Incluídos
                </h3>
                <span className="text-[11px] text-slate-500">
                  {prismaRows.length} estudos sintetizados com citação rastreável
                </span>
              </div>
              <PrismaMatrixTable rows={prismaRows} />
            </div>
          </section>
        </div>
      </main>

      {/* Modal de Validação Soberana Humana (Human-in-the-Loop) */}
      <HumanApprovalModal
        isOpen={isHitlModalOpen}
        onClose={() => setIsHitlModalOpen(false)}
        checkpointType={checkpointType}
        papers={papers}
        onConfirmApproval={handleConfirmHitl}
      />

      {/* Modal de Configuração de Chaves Próprias (BYOK) */}
      <ByokConfigModal />
    </div>
  );
}
