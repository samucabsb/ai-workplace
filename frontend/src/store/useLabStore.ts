import { create } from 'zustand';
import {
  AgentBenchId,
  AgentStateStatus,
  PaperItem,
  PrismaMatrixItem,
  KnowledgeGapItem,
  ReviewSession,
} from '@/types';

export interface AgentVisualInfo {
  id: string;
  benchId: AgentBenchId;
  name: string;
  role: string;
  status: AgentStateStatus;
  currentTask: string;
  progress: number;
}

export interface ByokSettings {
  geminiApiKey: string;
  groqApiKey: string;
  preferredProvider: 'gemini' | 'groq' | 'backend';
}

interface LabState {
  // Session Identifiers & Context
  reviewId: string | null;
  topic: string;
  currentStep: string;
  statusMessage: string;
  activeBench: AgentBenchId;

  // Agent Multi-Bench Telemetry
  agents: Record<string, AgentVisualInfo>;

  // Scientific Paper Flow
  rawPapers: PaperItem[];
  screenedPapers: PaperItem[];
  auditedPapers: any[];
  prismaMatrix: PrismaMatrixItem[];
  knowledgeGaps: KnowledgeGapItem[];

  // Human-in-the-Loop (HITL) Gate
  hitlPending: boolean;
  hitlCheckpoint: 'screening' | 'bias_arbitration' | null;
  hitlModalOpen: boolean;

  // BYOK Settings (Bring Your Own Key)
  byok: ByokSettings;
  byokModalOpen: boolean;

  // Actions
  setReviewSession: (session: Partial<ReviewSession>) => void;
  updateAgentStatus: (agentId: string, status: AgentStateStatus, message?: string, progress?: number) => void;
  setActiveBench: (bench: AgentBenchId) => void;
  setHitlModalOpen: (open: boolean) => void;
  setByokModalOpen: (open: boolean) => void;
  saveByokSettings: (settings: Partial<ByokSettings>) => void;
  resolveHitl: (rejectedIds?: string[]) => void;
  resetLab: () => void;
}

const DEFAULT_AGENTS: Record<string, AgentVisualInfo> = {
  coordinator: {
    id: 'coordinator',
    benchId: 'mining',
    name: 'Dr. Turing (PI)',
    role: 'Investigador Principal',
    status: 'IDLE',
    currentTask: 'Aguardando formulação do problema de pesquisa',
    progress: 0,
  },
  miner: {
    id: 'miner',
    benchId: 'mining',
    name: 'Miner Agent',
    role: 'Mineração Federada & DOI',
    status: 'IDLE',
    currentTask: 'Pronto para busca federada em bases abertas',
    progress: 0,
  },
  methodologist: {
    id: 'methodologist',
    benchId: 'auditing',
    name: 'Auditor Agent',
    role: 'Auditoria de Viés & Métodos',
    status: 'IDLE',
    currentTask: 'Aguardando artigos selecionados para auditoria',
    progress: 0,
  },
  synthesizer: {
    id: 'synthesizer',
    benchId: 'synthesis',
    name: 'Synthesizer Agent',
    role: 'Matriz PRISMA & Gaps',
    status: 'IDLE',
    currentTask: 'Aguardando validações metodológicas',
    progress: 0,
  },
};

const getInitialByokSettings = (): ByokSettings => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cortex_byok_keys');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to empty
      }
    }
  }
  return {
    geminiApiKey: '',
    groqApiKey: '',
    preferredProvider: 'backend',
  };
};

export const useLabStore = create<LabState>((set, get) => ({
  reviewId: null,
  topic: '',
  currentStep: 'IDLE',
  statusMessage: 'Laboratório autônomo pronto. Inicie uma nova revisão ou configure suas chaves BYOK.',
  activeBench: 'mining',

  agents: DEFAULT_AGENTS,

  rawPapers: [],
  screenedPapers: [],
  auditedPapers: [],
  prismaMatrix: [],
  knowledgeGaps: [],

  hitlPending: false,
  hitlCheckpoint: null,
  hitlModalOpen: false,

  byok: getInitialByokSettings(),
  byokModalOpen: false,

  setReviewSession: (session) => {
    set((state) => ({
      reviewId: session.review_id ?? state.reviewId,
      topic: session.query ?? state.topic,
      currentStep: session.current_step ?? state.currentStep,
      statusMessage: session.status_message ?? state.statusMessage,
      rawPapers: session.raw_papers ?? state.rawPapers,
      screenedPapers: session.screened_papers ?? state.screenedPapers,
      auditedPapers: session.audited_papers ?? state.auditedPapers,
      prismaMatrix: session.prisma_matrix ?? state.prismaMatrix,
      knowledgeGaps: session.knowledge_gaps ?? state.knowledgeGaps,
      hitlPending: session.hitl_pending ?? state.hitlPending,
      hitlCheckpoint: session.hitl_checkpoint !== undefined ? session.hitl_checkpoint : state.hitlCheckpoint,
      hitlModalOpen: session.hitl_pending ? true : state.hitlModalOpen,
    }));
  },

  updateAgentStatus: (agentId, status, message, progress) => {
    set((state) => {
      const agent = state.agents[agentId];
      if (!agent) return state;

      return {
        agents: {
          ...state.agents,
          [agentId]: {
            ...agent,
            status,
            currentTask: message ?? agent.currentTask,
            progress: progress !== undefined ? progress : agent.progress,
          },
        },
      };
    });
  },

  setActiveBench: (bench) => set({ activeBench: bench }),

  setHitlModalOpen: (open) => set({ hitlModalOpen: open }),

  setByokModalOpen: (open) => set({ byokModalOpen: open }),

  saveByokSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.byok, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('cortex_byok_keys', JSON.stringify(updated));
      }
      return { byok: updated };
    });
  },

  resolveHitl: (rejectedIds = []) => {
    set((state) => {
      const updatedRaw = state.rawPapers.map((p) =>
        rejectedIds.includes(p.id) ? { ...p, is_screened_in: false } : p
      );
      return {
        rawPapers: updatedRaw,
        hitlPending: false,
        hitlCheckpoint: null,
        hitlModalOpen: false,
      };
    });
  },

  resetLab: () => {
    set({
      reviewId: null,
      topic: '',
      currentStep: 'IDLE',
      statusMessage: 'Laboratório reiniciado. Pronto para nova pesquisa.',
      activeBench: 'mining',
      agents: DEFAULT_AGENTS,
      rawPapers: [],
      screenedPapers: [],
      auditedPapers: [],
      prismaMatrix: [],
      knowledgeGaps: [],
      hitlPending: false,
      hitlCheckpoint: null,
      hitlModalOpen: false,
    });
  },
}));
