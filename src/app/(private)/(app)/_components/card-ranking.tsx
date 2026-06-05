"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components";

interface RankingItem {
  posicao: number;
  nome: string;
  imagem?: string;
  pontos: number;
  destaque?: boolean;
  sub?: string;
}

interface CardRankingProps {
  titulo?: string;
  items: RankingItem[];
  corPrimaria: string;
  corSecundaria: string;
  limit?: number;
}

const medalhas = ["🥇", "🥈", "🥉"];

export function CardRanking({
  titulo = "Ranking",
  items,
  corPrimaria,
  corSecundaria,
  limit = 5,
}: CardRankingProps) {
  const lista = items.slice(0, limit);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-5 h-full">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">{titulo}</h3>

      {lista.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-6">Nenhum dado ainda.</p>
      ) : (
        <div className="space-y-1.5">
          {lista.map((r, i) => (
            <motion.div
              key={r.posicao}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                r.destaque
                  ? "border"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
              style={
                r.destaque
                  ? {
                      background: `linear-gradient(135deg, ${corPrimaria}12, ${corSecundaria}08)`,
                      borderColor: `${corPrimaria}30`,
                    }
                  : undefined
              }
            >
              {/* Posição / medalha */}
              <span className="w-6 shrink-0 text-center">
                {i < 3 ? (
                  <span className="text-base">{medalhas[i]}</span>
                ) : (
                  <span className="text-xs font-bold text-zinc-400">
                    {String(r.posicao).padStart(2, "0")}
                  </span>
                )}
              </span>

              {/* Avatar */}
              <Avatar
                nome={r.nome}
                imagem={r.imagem}
                cor={corPrimaria}
                corSecundaria={corSecundaria}
                size="sm"
              />

              {/* Nome */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm truncate ${
                    r.destaque
                      ? "font-semibold text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-300"
                  }`}
                >
                  {r.nome.split(" ")[0]}
                </p>
                {r.sub && (
                  <p className="text-[10px] text-zinc-400 truncate">{r.sub}</p>
                )}
              </div>

              {/* Pontos */}
              <span
                className={`text-sm font-bold shrink-0 ${
                  r.destaque ? "" : "text-zinc-500 dark:text-zinc-400"
                }`}
                style={r.destaque ? { color: corPrimaria } : undefined}
              >
                {r.pontos.toLocaleString("pt-BR")}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}