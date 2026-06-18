"use client";

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { RoiMesData } from "./use-admin-charts";

interface Props {
  dados: RoiMesData[];
  nomeMeta: string;
  corPrimaria: string;
}

function CustomTooltip({ active, payload, label, nomeMeta }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 shadow-xl text-xs min-w-[180px]">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-zinc-500 dark:text-zinc-400">{p.name}</span>
          </div>
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            {p.name === "Gasto (R$)" || p.name === "Custo/Meta"
              ? `R$ ${Number(p.value).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChartROI({ dados, nomeMeta, corPrimaria }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Custo-benefício mensal
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          {nomeMeta}s batidas vs gasto real em resgates (R$)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={dados} margin={{ top: 4, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.1)" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="metas"
            orientation="left"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="reais"
            orientation="right"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${v}`}
          />
          <Tooltip content={<CustomTooltip nomeMeta={nomeMeta} />} cursor={{ fill: "rgba(107,114,128,0.06)" }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} iconType="circle" iconSize={8} />

          <Bar
            yAxisId="metas"
            dataKey="metasBatidas"
            name={`${nomeMeta}s batidas`}
            fill={corPrimaria}
            radius={[4, 4, 0, 0]}
            opacity={0.85}
            animationDuration={1000}
            animationEasing="ease-out"
            barSize={28}
          />
          <Line
            yAxisId="reais"
            type="monotone"
            dataKey="gastoReais"
            name="Gasto (R$)"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1400}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Insight de custo médio */}
      {dados.length > 0 && (() => {
        const totalMetas  = dados.reduce((a, d) => a + d.metasBatidas, 0);
        const totalGasto  = dados.reduce((a, d) => a + d.gastoReais, 0);
        const custoPorMeta = totalMetas > 0 ? (totalGasto / totalMetas).toFixed(2) : "0";
        const tendencia    = dados[dados.length - 1].gastoReais > dados[0].gastoReais ? "↑" : "↓";

        return (
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-900 dark:text-white">{totalMetas}</p>
              <p className="text-[10px] text-zinc-400">metas no período</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-500">
                R$ {totalGasto.toLocaleString("pt-BR")}
              </p>
              <p className="text-[10px] text-zinc-400">total investido</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-500">R$ {custoPorMeta}</p>
              <p className="text-[10px] text-zinc-400">custo por meta {tendencia}</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}