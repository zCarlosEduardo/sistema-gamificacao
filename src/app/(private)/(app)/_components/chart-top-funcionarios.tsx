"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TopFuncionario } from "./use-admin-charts";
import { Avatar } from "@/components";

interface Props {
  dados: TopFuncionario[];
  corPrimaria: string;
  corSecundaria: string;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as TopFuncionario;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 shadow-xl text-xs min-w-[160px]">
      <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">{d.nome}</p>
      <p className="text-zinc-500 dark:text-zinc-400">{d.equipe}</p>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Pontos</span>
          <span className="font-bold text-amber-500">{d.pontos.toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Metas</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">{d.metas}</span>
        </div>
      </div>
    </div>
  );
}

// Label customizado dentro da barra
function CustomLabel({ x, y, width, value, nome, equipe, corPrimaria }: any) {
  return (
    <text
      x={x + width + 8}
      y={y + 14}
      fontSize={11}
      fill="#9ca3af"
      dominantBaseline="middle"
    >
      {value.toLocaleString("pt-BR")}
    </text>
  );
}

export function ChartTopFuncionarios({ dados, corPrimaria, corSecundaria }: Props) {
  // Gera gradiente por posição
  const cores = [
    corPrimaria,
    corSecundaria,
    "#f59e0b",
    "#10b981",
    "#3b82f6",
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Top funcionários
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">Por total de pontos acumulados</p>
      </div>

      {/* Lista com avatar + barra inline */}
      <div className="space-y-3">
        {dados.map((f, i) => {
          const max = dados[0].pontos;
          const pct = Math.round((f.pontos / max) * 100);
          const cor = cores[i] ?? corPrimaria;

          return (
            <div key={f.nome} className="flex items-center gap-3">
              {/* Posição */}
              <span className="text-xs font-bold text-zinc-400 w-4 shrink-0 text-center">
                {i + 1}
              </span>

              {/* Avatar */}
              <Avatar
                nome={f.nome}
                imagem={f.imagem}
                cor={cor}
                size="sm"
              />

              {/* Info + barra */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {f.nome.split(" ")[0]}
                  </span>
                  <span className="text-xs font-bold ml-2 shrink-0" style={{ color: cor }}>
                    {f.pontos.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${cor}, ${cor}99)`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">{f.equipe} · {f.metas} metas</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}