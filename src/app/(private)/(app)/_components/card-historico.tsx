"use client";

import { motion } from "framer-motion";

interface HistoricoItem {
  id: string;
  tipo: string;
  descricao: string;
  valor?: number;
  criadoEm: string;
}

interface CardHistoricoProps {
  items: HistoricoItem[];
  limit?: number;
  onVerTodos?: () => void;
}

const TIPO_CONFIG: Record<string, { cor: string; bg: string; sinal: string; emoji: string }> = {
  META_CONCLUIDA:     { cor: "#10b981", bg: "#10b98115", sinal: "",  emoji: "🎯" },
  META_APROVADA:      { cor: "#10b981", bg: "#10b98115", sinal: "",  emoji: "✅" },
  META_REJEITADA:     { cor: "#ef4444", bg: "#ef444415", sinal: "",  emoji: "❌" },
  GIRO_GANHO:         { cor: "#f59e0b", bg: "#f59e0b15", sinal: "+", emoji: "🎰" },
  GIRO_USADO:         { cor: "#f59e0b", bg: "#f59e0b15", sinal: "",  emoji: "🎲" },
  COIN_GANHO:         { cor: "#f59e0b", bg: "#f59e0b15", sinal: "+", emoji: "🪙" },
  PONTO_GANHO:        { cor: "#8b5cf6", bg: "#8b5cf615", sinal: "+", emoji: "⭐" },
  RESGATE_SOLICITADO: { cor: "#6b7280", bg: "#6b728015", sinal: "-", emoji: "🛍️" },
  RESGATE_APROVADO:   { cor: "#10b981", bg: "#10b98115", sinal: "",  emoji: "📦" },
  RESGATE_REJEITADO:  { cor: "#ef4444", bg: "#ef444415", sinal: "",  emoji: "🚫" },
  RESGATE_ENTREGUE:   { cor: "#10b981", bg: "#10b98115", sinal: "",  emoji: "🎁" },
  MEMBRO_ATIVADO:     { cor: "#10b981", bg: "#10b98115", sinal: "",  emoji: "👋" },
  MEMBRO_DESATIVADO:  { cor: "#6b7280", bg: "#6b728015", sinal: "",  emoji: "💤" },
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function CardHistorico({ items, limit = 5, onVerTodos }: CardHistoricoProps) {
  const lista = items.slice(0, limit);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Histórico</h3>
        {onVerTodos && (
          <button
            onClick={onVerTodos}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Ver tudo
          </button>
        )}
      </div>

      {lista.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-6">Nenhuma atividade ainda.</p>
      ) : (
        <div className="space-y-0.5">
          {lista.map((item, i) => {
            const cfg = TIPO_CONFIG[item.tipo] ?? {
              cor: "#6b7280", bg: "#6b728015", sinal: "", emoji: "📋",
            };

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2.5 border-b border-zinc-50 dark:border-zinc-800/60 last:border-0"
              >
                {/* Ícone */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                  style={{ background: cfg.bg }}
                >
                  {cfg.emoji}
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-800 dark:text-zinc-200 truncate">
                    {item.descricao}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {formatarData(item.criadoEm)}
                  </p>
                </div>

                {/* Valor */}
                {item.valor != null && (
                  <span
                    className="text-sm font-bold shrink-0"
                    style={{ color: cfg.cor }}
                  >
                    {cfg.sinal}{item.valor}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}