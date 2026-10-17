/**
 * Spatial Layout Configuration for CortexLab Workstations
 * Defines isometric coordinates, labels, colors, and conduits for all agent benches.
 */

export interface WorkstationConfig {
  id: string;
  name: string;
  agentRole: string;
  gridX: number;
  gridY: number;
  elevation: number;
  color: {
    primary: string;
    glow: string;
    border: string;
    badge: string;
  };
  iconName: 'coordinator' | 'miner' | 'methodologist' | 'synthesizer' | 'hitl';
  description: string;
}

export interface ConduitConnection {
  fromBenchId: string;
  toBenchId: string;
  color: string;
  label: string;
}

export const LAB_WORKSTATIONS: Record<string, WorkstationConfig> = {
  coordinator: {
    id: 'coordinator',
    name: 'Bancada PI Coordenador',
    agentRole: 'Investigador Principal',
    gridX: 1,
    gridY: 3,
    elevation: 2,
    color: {
      primary: '#38bdf8', // Sky blue
      glow: 'rgba(56, 189, 248, 0.35)',
      border: 'border-sky-500/50',
      badge: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    },
    iconName: 'coordinator',
    description: 'Enquadramento PICO, vocabulário controlado e queries booleanas federadas.',
  },
  mining: {
    id: 'mining',
    name: 'Terminal de Mineração',
    agentRole: 'Miner Agent',
    gridX: 2,
    gridY: 6,
    elevation: 2,
    color: {
      primary: '#3b82f6', // Blue
      glow: 'rgba(59, 130, 246, 0.35)',
      border: 'border-blue-500/50',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    },
    iconName: 'miner',
    description: 'Recuperação federada em OpenAlex, PubMed, Europe PMC e SciELO com validação de DOI.',
  },
  auditing: {
    id: 'auditing',
    name: 'Bancada de Auditoria & Viés',
    agentRole: 'Methodologist Auditor',
    gridX: 6,
    gridY: 6,
    elevation: 3,
    color: {
      primary: '#ec4899', // Pink / Rose
      glow: 'rgba(236, 72, 153, 0.35)',
      border: 'border-pink-500/50',
      badge: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
    },
    iconName: 'methodologist',
    description: 'Auditoria estatística de N amostral, grupos controle, p-hacking e matriz RoB 2 / STROBE.',
  },
  synthesis: {
    id: 'synthesis',
    name: 'Terminal de Síntese PRISMA',
    agentRole: 'Synthesizer Agent',
    gridX: 6,
    gridY: 2,
    elevation: 2,
    color: {
      primary: '#10b981', // Emerald
      glow: 'rgba(16, 185, 129, 0.35)',
      border: 'border-emerald-500/50',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    },
    iconName: 'synthesizer',
    description: 'Consolidação da matriz sistemática PRISMA 2020 e formulação de Knowledge Gaps testáveis.',
  },
  hitl: {
    id: 'hitl',
    name: 'Terminal de Governança Humana',
    agentRole: 'Human Researcher',
    gridX: 4,
    gridY: 4,
    elevation: 5,
    color: {
      primary: '#f59e0b', // Amber
      glow: 'rgba(245, 158, 11, 0.45)',
      border: 'border-amber-500/60',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    },
    iconName: 'hitl',
    description: 'Portão de validação soberana e arbitragem ética de viés pelo pesquisador humano.',
  },
};

export const DATA_CONDUITS: ConduitConnection[] = [
  {
    fromBenchId: 'coordinator',
    toBenchId: 'mining',
    color: '#38bdf8',
    label: 'Queries PICO & Booleanas',
  },
  {
    fromBenchId: 'mining',
    toBenchId: 'hitl',
    color: '#3b82f6',
    label: 'Triagem de Elegibilidade (HITL 1)',
  },
  {
    fromBenchId: 'hitl',
    toBenchId: 'auditing',
    color: '#f59e0b',
    label: 'Artigos Incluídos',
  },
  {
    fromBenchId: 'auditing',
    toBenchId: 'hitl',
    color: '#ec4899',
    label: 'Arbitragem de Alto Viés (HITL 2)',
  },
  {
    fromBenchId: 'auditing',
    toBenchId: 'synthesis',
    color: '#a855f7',
    label: 'Evidências Auditadas',
  },
  {
    fromBenchId: 'hitl',
    toBenchId: 'synthesis',
    color: '#10b981',
    label: 'Aprovação Final da Síntese',
  },
];
