"use client";

import { useTenant } from "@/contexts/tenant-context";
import { StatCard, SectionTitle } from "@/components";
import { CardRanking } from "./card-ranking";
import { Users, Coins, ShoppingBag, Target, TrendingUp, Dices, Star, BarChart3 } from "lucide-react";

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
interface RankingGlobal {
  posicao: number;
  nome: string;
  pontos: number;
  metasBatidas: number;
  resgates: number;
  equipe?: string;
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
    rankingGlobal: RankingGlobal[];
    produtosMaisResgatados: ProdutoResgatado[];
    desempenhoEquipes: DesempenhoEquipe[];
  };
}

export function DashboardAdmin({ dados }: DashboardAdminProps) {
  const { tenant } = useTenant();
  const { metricas, rankingGlobal, produtosMaisResgatados, desempenhoEquipes } = dados;

  const nomeMoeda     = tenant?.nomeMoeda     ?? "Coins";
  const nomeMeta      = tenant?.nomeMeta      ?? "Meta";
  const nomeEquipe    = tenant?.nomeEquipe    ?? "Equipe";
  const corPrimaria   = tenant?.corPrimaria   ?? "#7C3AED";
  const corSecundaria = tenant?.corSecundaria ?? "#A78BFA";

  const rankingItems = rankingGlobal.map((r) => ({
    posicao: r.posicao,
    nome: r.nome,
    pontos: r.pontos,
    sub: r.equipe ?? undefined,
  }));

  return (
    <div className="space-y-4">

      <SectionTitle titulo="Visão geral" cor="#14b8a6" />

      {/* Métricas macro — linha 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Colaboradores"          valor={metricas.totalMembros}                                                       icon={Users}       cor={corPrimaria} />
        <StatCard label={`${nomeMoeda} distribuídos`} valor={metricas.totalCoinsDistribuidos.toLocaleString("pt-BR")}                icon={Coins}       cor="#f59e0b" />
        <StatCard label="Valor gasto (R$)"        valor={`R$ ${metricas.valorTotalGastoReais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} icon={TrendingUp}  cor="#10b981" />
        <StatCard label="Resgates realizados"     valor={metricas.totalResgates}                                                      icon={ShoppingBag} cor="#8b5cf6" />
      </div>

      {/* Métricas macro — linha 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label={`${nomeMeta}s aprovadas`}    valor={metricas.totalMetasAprovadas}                                               icon={Target}      cor="#10b981" />
        <StatCard label="Giros usados"                valor={metricas.totalGirosUsados}                                                  icon={Dices}       cor="#f59e0b" />
        <StatCard label="Pontos distribuídos"         valor={metricas.totalPontosDistribuidos.toLocaleString("pt-BR")}                   icon={Star}        cor="#8b5cf6" />
        <StatCard label={`${nomeEquipe}s ativas`}     valor={desempenhoEquipes.length}                                                   icon={BarChart3}   cor={corPrimaria} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Ranking global */}
        <div className="lg:col-span-2">
          <CardRanking
            titulo="Ranking global"
            items={rankingItems}
            corPrimaria={corPrimaria}
            corSecundaria={corSecundaria}
            limit={10}
          />
        </div>

        {/* Produtos mais resgatados */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Mais resgatados</h3>
          {produtosMaisResgatados.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-6">Nenhum resgate ainda.</p>
          ) : (
            <div className="space-y-3">
              {produtosMaisResgatados.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{p.emoji ?? "🎁"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{p.nome}</p>
                    <p className="text-xs text-zinc-400">{p.totalResgates} resgates</p>
                  </div>
                  {p.valorEstimado && (
                    <span className="text-xs font-semibold text-emerald-500 shrink-0">
                      R$ {p.valorEstimado.toFixed(0)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desempenho por equipe */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
          Desempenho por {nomeEquipe.toLowerCase()}
        </h3>
        {desempenhoEquipes.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-4">Nenhuma equipe cadastrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {desempenhoEquipes.map((eq) => (
              <div
                key={eq.id}
                className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: corPrimaria }} />
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">{eq.nome}</p>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "Membros",         valor: eq.totalMembros,                                color: undefined },
                    { label: "Média pts",        valor: eq.mediaPontos.toLocaleString("pt-BR"),         color: "#f59e0b" },
                    { label: `${nomeMeta}s`,     valor: eq.totalMetasBatidas,                           color: undefined },
                    { label: "Resgates",         valor: eq.totalResgates,                               color: undefined },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-xs">
                      <span className="text-zinc-400">{row.label}</span>
                      <span
                        className="font-medium text-zinc-700 dark:text-zinc-300"
                        style={row.color ? { color: row.color } : undefined}
                      >
                        {row.valor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}