"use client";

import { useTenant } from "@/contexts/tenant-context";
import { Avatar } from "@/components";
import { CardMeta } from "./card-meta";
import { CardRanking } from "./card-ranking";
import { CardHistorico } from "./card-historico";

interface MetaAtual {
  titulo: string;
  descricao?: string;
  valorAlvo: number;
  progresso: number;
  unidade?: string;
  status: "EM_ANDAMENTO" | "CONCLUIDA";
  dataFim?: string;
  percentual: number;
}

interface Historico {
  id: string;
  tipo: string;
  descricao: string;
  valor?: number;
  criadoEm: string;
}

interface RankingItem {
  posicao: number;
  nome: string;
  imagem?: string;
  pontos: number;
  destaque: boolean;
}

interface Produto {
  id: string;
  nome: string;
  valorPontos: number;
  emoji?: string;
}

interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  fixado: boolean;
}

interface Saldo {
  coins: number;
  pontos: number;
  girosDisponiveis: number;
  totalMetasBatidas: number;
  totalResgates: number;
}

interface DashboardJogadorProps {
  dados: {
    saldo: Saldo;
    metaAtual: MetaAtual | null;
    sorteiosPendentes: { id: string }[];
    historico: Historico[];
    ranking: RankingItem[];
    posicaoRanking: number;
    produtosPopulares: Produto[];
    avisos: Aviso[];
  };
  userName: string;
}

function hexToRgba(hex: string, alpha: number) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const int = parseInt(hex, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

export function DashboardJogador({ dados }: DashboardJogadorProps) {
  const { tenant } = useTenant();
  const {
    saldo, metaAtual, sorteiosPendentes,
    historico, ranking, produtosPopulares, avisos,
  } = dados;

  const nomeMoeda    = tenant?.nomeMoeda    ?? "Coins";
  const nomeMeta     = tenant?.nomeMeta     ?? "Meta";
  const nomeLoja     = tenant?.nomeLoja     ?? "Loja";
  const corPrimaria  = tenant?.corPrimaria  ?? "#7C3AED";
  const corSecundaria = tenant?.corSecundaria ?? "#A78BFA";

  return (
    <div className="space-y-4">

      {/* ── Card principal: Meta + Roleta ── */}
      <CardMeta
        metaAtual={metaAtual}
        sorteiosPendentes={sorteiosPendentes}
        saldoGiros={saldo.girosDisponiveis}
        nomeMoeda={nomeMoeda}
        nomeMeta={nomeMeta}
        corPrimaria={corPrimaria}
        corSecundaria={corSecundaria}
      />

      {/* ── Avisos ── */}
      {avisos.length > 0 && (
        <div className="space-y-2">
          {avisos.map((aviso) => (
            <div
              key={aviso.id}
              className="flex gap-4 p-4 rounded-xl border-l-4"
              style={{
                borderLeftColor: corPrimaria,
                background: hexToRgba(corPrimaria, 0.05),
              }}
            >
              <div>
                {aviso.fixado && (
                  <span className="text-[10px] uppercase tracking-widest font-semibold mb-1 block"
                    style={{ color: corPrimaria }}>
                    📌 Fixado
                  </span>
                )}
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-0.5">
                  {aviso.titulo}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{aviso.conteudo}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Grid: Histórico + Ranking + Resgates ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Histórico — ocupa 2 colunas */}
        <div className="lg:col-span-2">
          <CardHistorico items={historico} limit={6} />
        </div>

        {/* Coluna direita */}
        <div className="space-y-4">

          {/* Ranking */}
          <CardRanking
            titulo="Ranking atual"
            items={ranking}
            corPrimaria={corPrimaria}
            corSecundaria={corSecundaria}
            limit={5}
          />

          {/* Resgates populares */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
              Resgates Populares
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {produtosPopulares.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600"
                  style={{
                    background: hexToRgba(corPrimaria, 0.03),
                    borderColor: hexToRgba(corPrimaria, 0.1),
                  }}
                >
                  <span className="text-2xl">{p.emoji ?? "🎁"}</span>
                  <span className="text-[10px] font-bold text-amber-500">
                    {p.valorPontos.toLocaleString("pt-BR")} Pts
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center line-clamp-1">
                    {p.nome}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})`,
              }}
            >
              Ver {nomeLoja}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}