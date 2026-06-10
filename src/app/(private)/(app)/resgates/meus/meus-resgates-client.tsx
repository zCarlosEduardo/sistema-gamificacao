"use client";

import { useState } from "react";
import { useTenant } from "@/contexts/tenant-context";
import { PageHeader } from "@/components";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusResgate = "PENDENTE" | "APROVADO" | "REJEITADO" | "ENTREGUE";

interface Resgate {
  id: string;
  pontosGastos: number;
  status: StatusResgate;
  observacao: string | null;
  criadoEm: string;
  produto: {
    nome: string;
    imagemUrl: string | null;
  };
}

interface Props {
  resgatesIniciais: Resgate[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<StatusResgate, string> = {
  PENDENTE:  "Pendente",
  APROVADO:  "Aprovado",
  REJEITADO: "Rejeitado",
  ENTREGUE:  "Entregue",
};

const STATUS_CLS: Record<StatusResgate, string> = {
  PENDENTE:  "bg-amber-400/10 text-amber-400",
  APROVADO:  "bg-emerald-400/10 text-emerald-400",
  REJEITADO: "bg-red-400/10 text-red-400",
  ENTREGUE:  "bg-blue-400/10 text-blue-400",
};

const STATUS_DESCRICAO: Record<StatusResgate, string> = {
  PENDENTE:  "Aguardando aprovação do gestor.",
  APROVADO:  "Aprovado! Aguarde a entrega.",
  REJEITADO: "Rejeitado. Seus pontos foram devolvidos.",
  ENTREGUE:  "Entregue com sucesso.",
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function MeusResgatesClient({ resgatesIniciais }: Props) {
  const { tenant } = useTenant();

  const nomePontos  = tenant?.nomePontos  ?? "Pontos";
  const nomeLoja    = tenant?.nomeLoja    ?? "Loja";
  const corPrimaria = tenant?.corPrimaria ?? "#7C3AED";

  const [filtroStatus, setFiltroStatus] = useState<StatusResgate | "TODOS">("TODOS");

  const filtrados = resgatesIniciais.filter(
    (r) => filtroStatus === "TODOS" || r.status === filtroStatus
  );

  const totalGasto = resgatesIniciais
    .filter((r) => r.status !== "REJEITADO")
    .reduce((acc, r) => acc + r.pontosGastos, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Meus Resgates"
        descricao={`Histórico das suas trocas de ${nomePontos.toLowerCase()} na ${nomeLoja}.`}
      />

      {/* Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["PENDENTE", "APROVADO", "ENTREGUE", "REJEITADO"] as StatusResgate[]).map((s) => (
          <div
            key={s}
            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
          >
            <p className="text-xs text-zinc-400 mb-1">{STATUS_LABEL[s]}</p>
            <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              {resgatesIniciais.filter((r) => r.status === s).length}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm text-zinc-400">
        Total gasto:{" "}
        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
          {totalGasto.toLocaleString("pt-BR")} {nomePontos.toLowerCase()}
        </span>{" "}
        (excluindo rejeitados)
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["TODOS", "PENDENTE", "APROVADO", "ENTREGUE", "REJEITADO"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFiltroStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              filtroStatus === s
                ? "text-white border-transparent"
                : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
            }`}
            style={filtroStatus === s ? { backgroundColor: corPrimaria, borderColor: corPrimaria } : {}}
          >
            {s === "TODOS" ? "Todos" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtrados.length === 0 ? (
        <p className="text-zinc-400 text-sm py-10 text-center">Nenhum resgate encontrado.</p>
      ) : (
        <div className="space-y-3">
          {filtrados.map((r) => (
            <div
              key={r.id}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-start gap-4"
            >
              {/* Imagem do produto */}
              <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 overflow-hidden">
                {r.produto.imagemUrl ? (
                  <img
                    src={r.produto.imagemUrl}
                    alt={r.produto.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🎁</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <p className="font-medium text-zinc-800 dark:text-zinc-100 truncate">
                    {r.produto.nome}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${STATUS_CLS[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {formatarData(r.criadoEm)} ·{" "}
                  <span className="font-medium text-zinc-600 dark:text-zinc-300">
                    {r.pontosGastos.toLocaleString("pt-BR")} {nomePontos.toLowerCase()}
                  </span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">{STATUS_DESCRICAO[r.status]}</p>
                {r.observacao && (
                  <p className="text-xs text-zinc-400 mt-1 italic border-l-2 border-zinc-300 dark:border-zinc-700 pl-2">
                    "{r.observacao}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}