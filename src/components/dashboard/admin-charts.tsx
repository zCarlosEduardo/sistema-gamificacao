"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Package, Users, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import type { AdminAnalytics } from "@/types";

interface AdminChartsProps {
  data: AdminAnalytics;
  nomenclaturas: {
    moeda: string;
    pontos: string;
    equipe: string;
    usuario: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: "#f59e0b",
  APROVADO: "#10b981",
  REJEITADO: "#ef4444",
  ENTREGUE: "#6366f1",
};

const CHART_COLORS = ["#7C3AED", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"];

export function AdminCharts({ data, nomenclaturas: n }: AdminChartsProps) {
  return (
    <div className="space-y-6">
      {/* ROI / Investimento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-emerald-400" />
            <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">Valor estimado gasto</p>
          </div>
          <p className="text-2xl font-bold font-(family-name:--font-geist)">
            R$ {(data.investimento.totalEstimado ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-(--color-primary-light)" />
            <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">Resgates aprovados</p>
          </div>
          <p className="text-2xl font-bold font-(family-name:--font-geist)">
            {data.investimento.totalResgates}
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-amber-400" />
            <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">{n.pontos} gastos</p>
          </div>
          <p className="text-2xl font-bold font-(family-name:--font-geist)">
            {(data.investimento.totalPontosGastos ?? 0).toLocaleString("pt-BR")}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top produtos */}
        {data.topProducts.length > 0 && (
          <Card className="p-5">
            <CardTitle className="mb-4">Produtos mais resgatados</CardTitle>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.topProducts} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="nome"
                  width={120}
                  tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg-subtle)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                //   formatter={(value: number) => [`${value} resgates`, "Total"]}
                />
                <Bar dataKey="total" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Resgates por status */}
        {data.resgatesPorStatus.length > 0 && (
          <Card className="p-5">
            <CardTitle className="mb-4">Resgates por status</CardTitle>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.resgatesPorStatus}
                    dataKey="total"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {data.resgatesPorStatus.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#6b7280"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-bg-subtle)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {data.resgatesPorStatus.map((entry) => (
                <div key={entry.status} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[entry.status] ?? "#6b7280" }}
                  />
                  <span className="text-xs text-(--color-text-muted)">{entry.status} ({entry.total})</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Top membros */}
        {data.topMembers.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-amber-400" />
              <CardTitle>Melhores {n.usuario.toLowerCase()}s</CardTitle>
            </div>
            <div className="space-y-3">
              {data.topMembers.slice(0, 5).map((person, i) => (
                <div key={person.nome} className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-5 text-center ${
                    i === 0 ? "text-amber-400" : i === 1 ? "text-zinc-400" : i === 2 ? "text-amber-600" : "text-(--color-text-muted)"
                  }`}>
                    {i + 1}º
                  </span>
                  <Avatar name={person.nome} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{person.nome}</p>
                    <p className="text-xs text-(--color-text-muted)">{person.totalMetasBatidas} {n.equipe.toLowerCase()}s batidas</p>
                  </div>
                  <span className="text-sm font-semibold text-(--color-primary-light)">
                    {person.saldoPontos.toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Top equipes */}
        {data.topTeams.length > 0 && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-(--color-primary-light)" />
              <CardTitle>Melhores {n.equipe.toLowerCase()}s</CardTitle>
            </div>
            <div className="space-y-3">
              {data.topTeams.map((team, i) => (
                <div key={team.nome} className="flex items-center justify-between py-2 border-b border-(--color-border) last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 text-center ${
                      i === 0 ? "text-amber-400" : i === 1 ? "text-zinc-400" : i === 2 ? "text-amber-600" : "text-(--color-text-muted)"
                    }`}>
                      {i + 1}º
                    </span>
                    <div>
                      <p className="text-sm font-medium">{team.nome}</p>
                      <p className="text-xs text-(--color-text-muted)">{team.totalMembros} membros</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-(--color-primary-light)">
                    {team.pontosTotal.toLocaleString("pt-BR")} pts
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}