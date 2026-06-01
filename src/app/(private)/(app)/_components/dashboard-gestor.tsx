"use client";

import { useTenant } from "@/contexts/tenant-context";
import { StatCard } from "@/components";
import { SectionTitle } from "@/components";
import { Avatar } from "@/components";
import { CardRanking } from "./card-ranking";
import { Users, Target, CheckCircle2, TrendingUp } from "lucide-react";

interface Equipe { id: string; nome: string }
interface Metricas {
  totalMembros: number;
  mediaPontos: number;
  totalMetasPendentes: number;
  totalMetasAtivas: number;
}
interface TopMembro {
  posicao: number;
  nome: string;
  imagem?: string;
  pontos: number;
  metasBatidas: number;
}
interface MetaPendente {
  id: string;
  membro: string;
  imagem?: string;
  meta: string;
  progresso: number;
  valorAlvo: number;
  unidade?: string;
}

interface DashboardGestorProps {
  dados: {
    equipes: Equipe[];
    metricas: Metricas;
    topMembros: TopMembro[];
    metasPendentes: MetaPendente[];
    metasAtivas: { id: string; titulo: string }[];
  };
}

export function DashboardGestor({ dados }: DashboardGestorProps) {
  const { tenant } = useTenant();
  const { equipes, metricas, topMembros, metasPendentes } = dados;

  const nomeMeta     = tenant?.nomeMeta     ?? "Meta";
  const nomeEquipe   = tenant?.nomeEquipe   ?? "Equipe";
  const corPrimaria  = tenant?.corPrimaria  ?? "#7C3AED";
  const corSecundaria = tenant?.corSecundaria ?? "#A78BFA";

  const rankingItems = topMembros.map((m) => ({
    posicao: m.posicao,
    nome: m.nome,
    imagem: m.imagem,
    pontos: m.pontos,
    sub: `${m.metasBatidas} ${nomeMeta.toLowerCase()}s batidas`,
  }));

  return (
    <div className="space-y-4">

      <SectionTitle
        titulo={`Gestão — ${equipes.map((e) => e.nome).join(", ")}`}
        cor={corPrimaria}
      />

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={`Membros na ${nomeEquipe}`}
          valor={metricas.totalMembros}
          icon={Users}
          cor={corPrimaria}
        />
        <StatCard
          label="Média de pontos"
          valor={metricas.mediaPontos.toLocaleString("pt-BR")}
          icon={TrendingUp}
          cor="#f59e0b"
        />
        <StatCard
          label={`${nomeMeta}s pendentes`}
          valor={metricas.totalMetasPendentes}
          icon={Target}
          cor="#ef4444"
        />
        <StatCard
          label={`${nomeMeta}s ativas`}
          valor={metricas.totalMetasAtivas}
          icon={CheckCircle2}
          cor="#10b981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top membros */}
        <CardRanking
          titulo="Top colaboradores"
          items={rankingItems}
          corPrimaria={corPrimaria}
          corSecundaria={corSecundaria}
        />

        {/* Metas pendentes */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
            {nomeMeta}s para aprovar
          </h3>

          {metasPendentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <span className="text-3xl">🎉</span>
              <p className="text-sm text-zinc-400">Nenhuma pendente!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {metasPendentes.map((mp) => (
                <div
                  key={mp.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10"
                >
                  <Avatar
                    nome={mp.membro}
                    cor={corPrimaria}
                    corSecundaria={corSecundaria}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {mp.membro.split(" ")[0]}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">{mp.meta}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors">
                      Aprovar
                    </button>
                    <button className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}