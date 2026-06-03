"use client";

import { useState } from "react";
import { useTenant } from "@/contexts/tenant-context";
import { StatCard, SectionTitle } from "@/components";
import {
  Users, Coins, ShoppingBag, Target,
  TrendingUp, Dices, Star, BarChart3,
} from "lucide-react";
import { ChartEvolucaoMensal }  from "./chart-evolucao-mensal";
import { ChartTopFuncionarios } from "./chart-top-funcionarios";
import { ChartTopPorEquipe }    from "./chart-top-por-equipe";
import { ChartFunil }           from "./chart-funil";
import { ChartROI }             from "./chart-roi";
import { FiltroMes, MesSelecionado } from "./filtro-mes";
import {
  getMockMesesData,
  getMockTopFuncionarios,
  getMockTopPorEquipe,
  getMockFunilData,
  getMockRoiData,
} from "./use-admin-charts";

interface Metricas {
  totalMembros: number;
  totalResgates: number;
  totalMetasAprovadas: number;
  totalGirosUsados: number;
  totalCoinsDistribuidos: number;
  totalPontosDistribuidos: number;
  valorTotalGastoReais: number;
  gastoMedioPorMembro: number;
}
interface ProdutoResgatado {
  id: string;
  nome: string;
  emoji?: string;
  valorEstimado?: number;
  totalResgates: number;
}
interface DesempenhoEquipe {
  id: string;
  nome: string;
  totalMembros: number;
  mediaPontos: number;
  totalMetasBatidas: number;
  totalResgates: number;
}

interface DashboardAdminProps {
  dados: {
    metricas: Metricas;
    rankingGlobal: {
      posicao: number; nome: string; pontos: number;
      metasBatidas: number; resgates: number; equipe?: string;
    }[];
    produtosMaisResgatados: ProdutoResgatado[];
    desempenhoEquipes: DesempenhoEquipe[];
  };
}

const MESES_CURTOS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export function DashboardAdmin({ dados }: DashboardAdminProps) {
  const { tenant } = useTenant();
  const { metricas, produtosMaisResgatados, desempenhoEquipes } = dados;

  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState<MesSelecionado>({
    mes: hoje.getMonth(),
    ano: hoje.getFullYear(),
  });

  const nomePontos     = tenant?.nomePontos     ?? "Coins";
  const nomeMeta      = tenant?.nomeMeta      ?? "Meta";
  const nomeEquipe    = tenant?.nomeEquipe    ?? "Equipe";
  const corPrimaria   = tenant?.corPrimaria   ?? "#7C3AED";
  const corSecundaria = tenant?.corSecundaria ?? "#A78BFA";

  // TODO: quando tiver backend real, passar mesSelecionado como query param
  // ex: fetch(`/dashboard/admin?mes=${mesSelecionado.mes}&ano=${mesSelecionado.ano}`)
  const mesesData       = getMockMesesData();
  const topFuncionarios = getMockTopFuncionarios();
  const funilData       = getMockFunilData(metricas.totalMembros || 10);
  const roiData         = getMockRoiData();

  // Filtra os dados do mês selecionado para os charts de mês único
  // (quando vier do backend, isso não será necessário — virá já filtrado)
  const mesNome = MESES_CURTOS[mesSelecionado.mes];
  const dadosMesSelecionado = mesesData.find((m) => m.mes === mesNome) ?? mesesData[mesesData.length - 1];

  const topPorEquipe = desempenhoEquipes.length > 0
    ? desempenhoEquipes.map((eq, i) => ({
        equipe: eq.nome,
        mediapontos: eq.mediaPontos,
        totalMetas: eq.totalMetasBatidas,
        membros: eq.totalMembros,
        cor: [corPrimaria, corSecundaria, "#f59e0b", "#10b981", "#3b82f6"][i % 5],
      }))
    : getMockTopPorEquipe();

  const isAtual =
    mesSelecionado.mes === hoje.getMonth() &&
    mesSelecionado.ano === hoje.getFullYear();

  return (
    <div className="space-y-4">

      {/* ── Header com filtro ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SectionTitle
          titulo={isAtual ? "Visão geral — mês atual" : `Visão geral — ${MESES_CURTOS[mesSelecionado.mes]}/${mesSelecionado.ano}`}
          cor="#14b8a6"
        />
        <FiltroMes
          valor={mesSelecionado}
          onChange={setMesSelecionado}
          corPrimaria={corPrimaria}
          limitePassado={6}
        />
      </div>

      {/* ── Métricas macro ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Colaboradores"               valor={metricas.totalMembros}                                                                                     icon={Users}       cor={corPrimaria} />
        <StatCard label={`${nomePontos} distribuídos`} valor={metricas.totalCoinsDistribuidos.toLocaleString("pt-BR")}                                                   icon={Coins}       cor="#f59e0b"     />
        <StatCard label="Total investido (R$)"        valor={`R$ ${metricas.valorTotalGastoReais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}               icon={TrendingUp}  cor="#10b981"     />
        <StatCard label="Resgates realizados"         valor={metricas.totalResgates}                                                                                     icon={ShoppingBag} cor="#8b5cf6"     />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label={`${nomeMeta}s aprovadas`}    valor={metricas.totalMetasAprovadas}                                                                               icon={Target}      cor="#10b981"     />
        <StatCard label="Giros usados"                valor={metricas.totalGirosUsados}                                                                                  icon={Dices}       cor="#f59e0b"     />
        <StatCard label="Pontos distribuídos"         valor={metricas.totalPontosDistribuidos.toLocaleString("pt-BR")}                                                   icon={Star}        cor="#8b5cf6"     />
        <StatCard label={`${nomeEquipe}s ativas`}     valor={desempenhoEquipes.length}                                                                                   icon={BarChart3}   cor={corPrimaria} />
      </div>


      {/* ── Custo-benefício + Evolução mensal ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartROI dados={roiData} nomeMeta={nomeMeta} corPrimaria={corPrimaria} />
        <ChartEvolucaoMensal
          dados={mesesData}
          corPrimaria={corPrimaria}
          corSecundaria={corSecundaria}
          nomePontos={nomePontos}
          nomeMeta={nomeMeta}
        />
      </div>

      {/* ── Top funcionários + Desempenho por equipe ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartTopFuncionarios
          dados={topFuncionarios}
          corPrimaria={corPrimaria}
          corSecundaria={corSecundaria}
        />
        <ChartTopPorEquipe
          dados={topPorEquipe}
          nomeEquipe={nomeEquipe}
          nomeMeta={nomeMeta}
        />
      </div>

      {/* ── Funil de engajamento — full width ── */}
      <ChartFunil dados={funilData} corPrimaria={corPrimaria} />

      {/* ── Produtos mais resgatados ── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
          Produtos mais resgatados
        </h3>
        {produtosMaisResgatados.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-4">Nenhum resgate ainda.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {produtosMaisResgatados.map((p) => (
              <div
                key={p.id}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
              >
                <span className="text-3xl">{p.emoji ?? "🎁"}</span>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 text-center line-clamp-2">
                  {p.nome}
                </p>
                <p className="text-xs text-zinc-400">{p.totalResgates} resgates</p>
                {p.valorEstimado && (
                  <p className="text-xs font-semibold text-emerald-500">
                    R$ {p.valorEstimado.toFixed(0)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}