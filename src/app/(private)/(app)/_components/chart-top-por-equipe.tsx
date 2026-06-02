"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";
import { TopPorEquipe } from "./use-admin-charts";

interface Props {
  dados: TopPorEquipe[];
  nomeEquipe: string;
  nomeMeta: string;
}

function CustomTooltip({ active, payload, label, nomeEquipe, nomeMeta }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as TopPorEquipe;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 shadow-xl text-xs min-w-[150px]">
      <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">{d.equipe}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Média pts</span>
          <span className="font-bold text-amber-500">{d.mediapontos.toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">{nomeMeta}s batidas</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">{d.totalMetas}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Membros</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">{d.membros}</span>
        </div>
      </div>
    </div>
  );
}

export function ChartTopPorEquipe({ dados, nomeEquipe, nomeMeta }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Desempenho por {nomeEquipe.toLowerCase()}
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">Média de pontos acumulados por grupo</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={dados}
          margin={{ top: 16, right: 8, bottom: 0, left: -16 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.1)" vertical={false} />
          <XAxis
            dataKey="equipe"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip nomeEquipe={nomeEquipe} nomeMeta={nomeMeta} />}
            cursor={{ fill: "rgba(107,114,128,0.06)" }}
          />
          <Bar
            dataKey="mediapontos"
            radius={[6, 6, 0, 0]}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {dados.map((entry, i) => (
              <Cell key={entry.equipe} fill={entry.cor} opacity={0.85} />
            ))}
            <LabelList
              dataKey="mediapontos"
              position="top"
              style={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
              formatter={(v: number) => v.toLocaleString("pt-BR")}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda colorida */}
      <div className="flex flex-wrap gap-3 mt-4">
        {dados.map((d) => (
          <div key={d.equipe} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.cor }} />
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{d.equipe}</span>
          </div>
        ))}
      </div>
    </div>
  );
}