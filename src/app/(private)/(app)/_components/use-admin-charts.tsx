"use client";

// ── Tipos ──────────────────────────────────────────────────────

export interface MesData {
  mes: string;        // "Jan", "Fev" etc
  coins: number;
  metas: number;
  resgates: number;
  pontos: number;
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

// ── Mock — 6 meses ────────────────────────────────────────────

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

export function getMockMesesData(): MesData[] {
  return [
    { mes: "Jan", coins: 320,  metas: 12, resgates: 4,  pontos: 960  },
    { mes: "Fev", coins: 480,  metas: 18, resgates: 7,  pontos: 1440 },
    { mes: "Mar", coins: 390,  metas: 14, resgates: 5,  pontos: 1170 },
    { mes: "Abr", coins: 620,  metas: 24, resgates: 11, pontos: 1860 },
    { mes: "Mai", coins: 740,  metas: 29, resgates: 15, pontos: 2220 },
    { mes: "Jun", coins: 890,  metas: 35, resgates: 18, pontos: 2670 },
  ];
}

export function getMockTopFuncionarios(): TopFuncionario[] {
  return [
    { nome: "Maria Jogadora",  pontos: 2670, metas: 12, equipe: "Suporte"  },
    { nome: "João Jogador",    pontos: 1860, metas: 9,  equipe: "Vendas"   },
    { nome: "Ana Lima",        pontos: 1440, metas: 7,  equipe: "Marketing"},
    { nome: "Pedro Souza",     pontos: 1170, metas: 6,  equipe: "TI"       },
    { nome: "Lucas Ferreira",  pontos: 960,  metas: 4,  equipe: "Vendas"   },
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