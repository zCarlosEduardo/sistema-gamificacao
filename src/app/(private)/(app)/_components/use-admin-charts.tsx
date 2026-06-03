"use client";

// ── Tipos ──────────────────────────────────────────────────────

export interface MesData {
  mes: string;
  coins: number;
  metas: number;
  resgates: number;
  pontos: number;
  gastoReais: number; // valor real gasto em produtos
}

export interface TopFuncionario {
  nome: string;
  pontos: number;
  metas: number;
  equipe: string;
  imagem?: string;
}

export interface TopPorEquipe {
  equipe: string;
  mediapontos: number;
  totalMetas: number;
  membros: number;
  cor: string;
}

export interface FunilData {
  etapa: string;
  valor: number;
  descricao: string;
  cor: string;
}

export interface RoiMesData {
  mes: string;
  metasBatidas: number;
  gastoReais: number;
  custoPorMeta: number; // gastoReais / metasBatidas
}

// ── Mock — 6 meses ────────────────────────────────────────────

export function getMockMesesData(): MesData[] {
  return [
    { mes: "Jan", coins: 320,  metas: 12, resgates: 4,  pontos: 960,  gastoReais: 180  },
    { mes: "Fev", coins: 480,  metas: 18, resgates: 7,  pontos: 1440, gastoReais: 310  },
    { mes: "Mar", coins: 390,  metas: 14, resgates: 5,  pontos: 1170, gastoReais: 225  },
    { mes: "Abr", coins: 620,  metas: 24, resgates: 11, pontos: 1860, gastoReais: 495  },
    { mes: "Mai", coins: 740,  metas: 29, resgates: 15, pontos: 2220, gastoReais: 675  },
    { mes: "Jun", coins: 890,  metas: 35, resgates: 18, pontos: 2670, gastoReais: 810  },
  ];
}

export function getMockTopFuncionarios(): TopFuncionario[] {
  return [
    { nome: "Maria Jogadora",  pontos: 2670, metas: 12, equipe: "Suporte"   },
    { nome: "João Jogador",    pontos: 1860, metas: 9,  equipe: "Vendas"    },
    { nome: "Ana Lima",        pontos: 1440, metas: 7,  equipe: "Marketing" },
    { nome: "Pedro Souza",     pontos: 1170, metas: 6,  equipe: "TI"        },
    { nome: "Lucas Ferreira",  pontos: 960,  metas: 4,  equipe: "Vendas"    },
  ];
}

export function getMockTopPorEquipe(): TopPorEquipe[] {
  return [
    { equipe: "Suporte",   mediapontos: 1820, totalMetas: 28, membros: 3, cor: "#8b5cf6" },
    { equipe: "Vendas",    mediapontos: 1415, totalMetas: 22, membros: 4, cor: "#f59e0b" },
    { equipe: "Marketing", mediapontos: 980,  totalMetas: 14, membros: 2, cor: "#10b981" },
    { equipe: "TI",        mediapontos: 760,  totalMetas: 10, membros: 2, cor: "#3b82f6" },
  ];
}

// Funil: mostra onde os colaboradores estão "vazando"
export function getMockFunilData(totalMembros: number): FunilData[] {
  const ativos     = Math.round(totalMembros * 0.85);
  const bateram    = Math.round(ativos * 0.70);
  const giraram    = Math.round(bateram * 0.90);
  const resgataram = Math.round(giraram * 0.55);

  return [
    { etapa: "Colaboradores ativos", valor: ativos,     descricao: `${ativos} de ${totalMembros} estão participando`,          cor: "#8b5cf6" },
    { etapa: "Bateram uma meta",      valor: bateram,    descricao: `${bateram} concluíram pelo menos 1 meta`,                  cor: "#6366f1" },
    { etapa: "Usaram a roleta",       valor: giraram,    descricao: `${giraram} giraram e ganharam Coins`,                      cor: "#3b82f6" },
    { etapa: "Fizeram resgate",       valor: resgataram, descricao: `${resgataram} trocaram pontos por produtos`,               cor: "#10b981" },
  ];
}

// ROI: custo por meta batida mês a mês
export function getMockRoiData(): RoiMesData[] {
  return getMockMesesData().map((m) => ({
    mes: m.mes,
    metasBatidas: m.metas,
    gastoReais: m.gastoReais,
    custoPorMeta: m.metas > 0 ? Math.round((m.gastoReais / m.metas) * 10) / 10 : 0,
  }));
}