"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MesData } from "./use-admin-charts";

interface Props {
  dados: MesData[];
  corPrimaria: string;
  corSecundaria: string;
  nomePontos: string;
  nomeMeta: string;
}

function hexToRgba(hex: string, alpha: number) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// Tooltip customizado
function CustomTooltip({ active, payload, label, nomePontos, nomeMeta }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 shadow-xl text-xs space-y-1.5 min-w-[140px]">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-zinc-500 dark:text-zinc-400">{p.name}</span>
          </div>
          <span className="font-bold text-zinc-800 dark:text-zinc-200">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartEvolucaoMensal({ dados, corPrimaria, corSecundaria, nomePontos, nomeMeta }: Props) {
  const id1 = "grad-pontos";
  const id2 = "grad-metas";

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Evolução mensal
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          {nomePontos} distribuídos e {nomeMeta.toLowerCase()}s aprovadas — últimos 6 meses
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={dados} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id={id1} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={corPrimaria}   stopOpacity={0.25} />
              <stop offset="95%" stopColor={corPrimaria}   stopOpacity={0}    />
            </linearGradient>
            <linearGradient id={id2} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={corSecundaria} stopOpacity={0.2}  />
              <stop offset="95%" stopColor={corSecundaria} stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={hexToRgba("#6b7280", 0.12)} />

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
            content={<CustomTooltip nomePontos={nomePontos} nomeMeta={nomeMeta} />}
            cursor={{ stroke: hexToRgba("#6b7280", 0.15), strokeWidth: 1 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />

          <Area
            type="monotone"
            dataKey="pontos"
            name={nomePontos}
            stroke={corPrimaria}
            strokeWidth={2.5}
            fill={`url(#${id1})`}
            dot={{ fill: corPrimaria, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
          <Area
            type="monotone"
            dataKey="metas"
            name={`${nomeMeta}s`}
            stroke={corSecundaria}
            strokeWidth={2}
            strokeDasharray="5 3"
            fill={`url(#${id2})`}
            dot={{ fill: corSecundaria, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            animationDuration={1400}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}