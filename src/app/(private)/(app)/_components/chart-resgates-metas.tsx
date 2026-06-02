"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MesData } from "./use-admin-charts";

interface Props {
  dados: MesData[];
  nomeMeta: string;
  corPrimaria: string;
}

function CustomTooltip({ active, payload, label, nomeMeta }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 shadow-xl text-xs min-w-[140px]">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-zinc-500 dark:text-zinc-400">{p.name}</span>
          </div>
          <span className="font-bold text-zinc-800 dark:text-zinc-200">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartResgatesMetas({ dados, nomeMeta, corPrimaria }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          {nomeMeta}s × Resgates
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Comparativo mensal de metas aprovadas e resgates realizados
        </p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={dados}
          margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
          barCategoryGap="30%"
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.1)" vertical={false} />
          <XAxis
            dataKey="mes"
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
            content={<CustomTooltip nomeMeta={nomeMeta} />}
            cursor={{ fill: "rgba(107,114,128,0.06)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="metas"
            name={`${nomeMeta}s`}
            fill={corPrimaria}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
            opacity={0.85}
          />
          <Bar
            dataKey="resgates"
            name="Resgates"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            animationDuration={1200}
            animationEasing="ease-out"
            opacity={0.85}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}