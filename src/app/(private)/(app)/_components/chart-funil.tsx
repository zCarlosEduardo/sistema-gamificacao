"use client";

import { motion } from "framer-motion";
import { FunilData } from "./use-admin-charts";

interface Props {
  dados: FunilData[];
  corPrimaria: string;
}

export function ChartFunil({ dados, corPrimaria }: Props) {
  const max = dados[0]?.valor ?? 1;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-5">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Funil de engajamento
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Acompanhe onde os colaboradores estão no fluxo de gamificação
        </p>
      </div>

      <div className="space-y-3">
        {dados.map((etapa, i) => {
          const pct = Math.round((etapa.valor / max) * 100);
          const conversao = i > 0
            ? Math.round((etapa.valor / dados[i - 1].valor) * 100)
            : 100;

          return (
            <div key={etapa.etapa}>
              {/* Taxa de conversão entre etapas */}
              {i > 0 && (
                <div className="flex items-center gap-2 mb-2 ml-2">
                  <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    conversao >= 80
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                      : conversao >= 60
                        ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                        : "bg-red-50 dark:bg-red-950/30 text-red-500"
                  }`}>
                    {conversao}% converteram
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Número */}
                <div className="w-12 shrink-0 text-right">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">
                    {etapa.valor}
                  </span>
                </div>

                {/* Barra */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {etapa.etapa}
                    </span>
                    <span className="text-[10px] text-zinc-400">{pct}% do total</span>
                  </div>
                  <div className="h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                      className="h-full rounded-lg flex items-center px-3"
                      style={{ background: etapa.cor }}
                    >
                      <span className="text-[10px] text-white font-medium truncate opacity-90">
                        {etapa.descricao}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo de saúde */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Taxa de engajamento",
              valor: `${Math.round((dados[1]?.valor / dados[0]?.valor) * 100)}%`,
              cor: "text-violet-500",
            },
            {
              label: "Conversão roleta",
              valor: `${Math.round((dados[2]?.valor / dados[1]?.valor) * 100)}%`,
              cor: "text-blue-500",
            },
            {
              label: "Taxa de resgate",
              valor: `${Math.round((dados[3]?.valor / dados[2]?.valor) * 100)}%`,
              cor: "text-emerald-500",
            },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className={`text-xl font-bold ${item.cor}`}>{item.valor}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}