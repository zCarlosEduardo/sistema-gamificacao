"use client";

import { motion } from "framer-motion";
import { useTenant } from "@/contexts/tenant-context";
import { Avatar } from "@/components";
import { CardMeta } from "./card-meta";
import { CardHistorico } from "./card-historico";
import Image from "next/image";

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
  imagem?: string;
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
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  const int = parseInt(hex, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

const medalhas = ["🥇", "🥈", "🥉"];

export function DashboardJogador({ dados }: DashboardJogadorProps) {
  const { tenant } = useTenant();
  const {
    saldo,
    metaAtual,
    sorteiosPendentes,
    historico,
    ranking,
    produtosPopulares,
    avisos,
  } = dados;

  const nomeMoeda = tenant?.nomeMoeda ?? "Coins";
  const nomePontos = tenant?.nomePontos ?? "Pontos";
  const nomeMeta = tenant?.nomeMeta ?? "Meta";
  const nomeLoja = tenant?.nomeLoja ?? "Loja";
  const corPrimaria = tenant?.corPrimaria ?? "#7C3AED";
  const corSecundaria = tenant?.corSecundaria ?? "#A78BFA";

  return (
    <div className="space-y-4">
      {/* ── 1. Notificações / Avisos — full width ── */}
      {avisos.length > 0 && (
        <div className="space-y-2">
          {avisos.map((aviso, i) => (
            <motion.div
              key={aviso.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-xl border-l-4"
              style={{
                borderLeftColor: corPrimaria,
                background: hexToRgba(corPrimaria, 0.05),
              }}
            >
              <div className="min-w-0">
                {aviso.fixado && (
                  <span
                    className="text-[10px] uppercase tracking-widest font-semibold mb-1 block"
                    style={{ color: corPrimaria }}
                  >
                    📌 Fixado
                  </span>
                )}
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-0.5">
                  {aviso.titulo}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {aviso.conteudo}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* ── 2. Resgates de Metas + Ranking Top 3 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-2 space-y-4">
          <CardMeta
            metaAtual={metaAtual}
            sorteiosPendentes={sorteiosPendentes}
            saldoGiros={saldo.girosDisponiveis}
            totalMetasBatidas={saldo.totalMetasBatidas}
            nomeMoeda={nomeMoeda}
            nomeMeta={nomeMeta}
            corPrimaria={corPrimaria}
            corSecundaria={corSecundaria}
          />

          <CardHistorico items={historico} limit={6} />
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-4">
          {/* Ranking */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 h-fit">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
              Top 3 Ranking
            </h3>

            <div className="space-y-3">
              {ranking.slice(0, 3).map((r, i) => (
                <motion.div
                  key={r.posicao}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    r.destaque ? "border" : ""
                  }`}
                  style={
                    r.destaque
                      ? {
                          background: hexToRgba(corPrimaria, 0.07),
                          borderColor: hexToRgba(corPrimaria, 0.2),
                        }
                      : undefined
                  }
                >
                  <span className="text-xl shrink-0">{medalhas[i]}</span>

                  <Avatar
                    nome={r.nome}
                    imagem={r.imagem}
                    cor={corPrimaria}
                    corSecundaria={corSecundaria}
                    size="sm"
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate ${
                        r.destaque
                          ? "font-bold text-zinc-900 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      {r.nome.split(" ")[0]}
                    </p>

                    <p
                      className="text-xs font-semibold"
                      style={{
                        color: r.destaque ? corPrimaria : undefined,
                      }}
                    >
                      {r.pontos.toLocaleString("pt-BR")} pts
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {dados.posicaoRanking > 3 && (
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <span className="text-xs text-zinc-400">Sua posição:</span>

                <span
                  className="text-sm font-bold"
                  style={{ color: corPrimaria }}
                >
                  #{dados.posicaoRanking}
                </span>
              </div>
            )}
          </div>

          {/* Resgates */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 h-fit">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
              Resgates Populares
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {produtosPopulares.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="
              rounded-lg
              overflow-hidden
              border
              border-zinc-100
              dark:border-zinc-800
              hover:border-zinc-300
              dark:hover:border-zinc-600
              transition-colors
              cursor-pointer
            "
                  style={{
                    background: hexToRgba(corPrimaria, 0.02),
                  }}
                >
                  <div className="aspect-4/3 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                    {p.imagem ? (
                      <Image
                        src={p.imagem}
                        alt={p.nome}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xl">{p.emoji ?? "🎁"}</span>
                    )}
                  </div>

                  <div className="p-2">
                    <p className="text-base font-bold text-amber-500">
                      {p.valorPontos.toLocaleString("pt-BR")} {nomePontos}
                    </p>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {p.nome}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full mt-3 py-3 rounded-xl text-md font-semibold text-white hover:opacity-90"
              style={{
                background: `${corPrimaria}`,
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
