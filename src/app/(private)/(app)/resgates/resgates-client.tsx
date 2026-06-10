"use client";

import { useState, useTransition } from "react";
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
  membro: {
    usuario: { name: string; email: string };
  };
  produto: {
    nome: string;
  };
}

interface Props {
  tenantId: string;
  resgatesIniciais: Resgate[];
  podeAprovar: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<StatusResgate, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
  ENTREGUE: "Entregue",
};

const STATUS_CLS: Record<StatusResgate, string> = {
  PENDENTE: "bg-amber-400/10 text-amber-400",
  APROVADO: "bg-emerald-400/10 text-emerald-400",
  REJEITADO: "bg-red-400/10 text-red-400",
  ENTREGUE: "bg-blue-400/10 text-blue-400",
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

// ─── Modal inline ─────────────────────────────────────────────────────────────

interface ModalAcaoProps {
  resgate: Resgate;
  acao: "aprovar" | "rejeitar";
  nomePontos: string;
  isPending: boolean;
  erro: string;
  observacao: string;
  corPrimaria: string;
  onObservacao: (v: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
}

function ModalAcao({
  resgate,
  acao,
  nomePontos,
  isPending,
  erro,
  observacao,
  corPrimaria,
  onObservacao,
  onConfirmar,
  onCancelar,
}: ModalAcaoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancelar}
      />
      <div className="relative z-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
          {acao === "aprovar" ? "Aprovar resgate" : "Rejeitar resgate"}
        </h3>
        <p className="text-sm text-zinc-500 mb-4">
          {acao === "aprovar"
            ? `Confirmar aprovação de "${resgate.produto.nome}" para ${resgate.membro.usuario.name}?`
            : `Rejeitar devolve automaticamente os ${nomePontos.toLowerCase()} ao colaborador.`}
        </p>

        <div className="mb-4">
          <label className="text-xs text-zinc-400 block mb-1">
            Observação (opcional)
          </label>
          <textarea
            rows={2}
            value={observacao}
            onChange={(e) => onObservacao(e.target.value)}
            placeholder="Motivo, instrução de retirada, etc."
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none"
          />
        </div>

        {erro && (
          <p className="text-xs text-red-500 mb-3 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
            {erro}
          </p>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancelar}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: acao === "aprovar" ? corPrimaria : "#ef4444" }}
          >
            {isPending ? "Processando..." : acao === "aprovar" ? "Aprovar" : "Rejeitar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function ResgatesClient({ tenantId, resgatesIniciais, podeAprovar }: Props) {
  const { tenant } = useTenant();

  const nomePontos = tenant?.nomePontos ?? "Pontos";
  const nomeLoja   = tenant?.nomeLoja   ?? "Loja";
  const corPrimaria = tenant?.corPrimaria ?? "#7C3AED";

  const [resgates, setResgates] = useState<Resgate[]>(resgatesIniciais);
  const [filtroStatus, setFiltroStatus] = useState<StatusResgate | "TODOS">("TODOS");
  const [buscaNome, setBuscaNome] = useState("");

  const [resgateSelecionado, setResgateSelecionado] = useState<Resgate | null>(null);
  const [acao, setAcao] = useState<"aprovar" | "rejeitar">("aprovar");
  const [observacao, setObservacao] = useState("");
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  const filtrados = resgates.filter((r) => {
    const passaStatus = filtroStatus === "TODOS" || r.status === filtroStatus;
    const passaNome = r.membro.usuario.name.toLowerCase().includes(buscaNome.toLowerCase());
    return passaStatus && passaNome;
  });

  const totais: Record<StatusResgate | "TODOS", number> = {
    TODOS:     resgates.length,
    PENDENTE:  resgates.filter((r) => r.status === "PENDENTE").length,
    APROVADO:  resgates.filter((r) => r.status === "APROVADO").length,
    REJEITADO: resgates.filter((r) => r.status === "REJEITADO").length,
    ENTREGUE:  resgates.filter((r) => r.status === "ENTREGUE").length,
  };

  function abrirModal(r: Resgate, tipo: "aprovar" | "rejeitar") {
    setResgateSelecionado(r);
    setAcao(tipo);
    setObservacao("");
    setErro("");
  }

  function confirmarAcao() {
    if (!resgateSelecionado) return;
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/resgates/${resgateSelecionado.id}/${acao}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "x-tenant-id": tenantId,
            },
            body: JSON.stringify({ observacao: observacao || undefined }),
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message ?? "Erro ao processar.");
        }
        const novoStatus: StatusResgate = acao === "aprovar" ? "APROVADO" : "REJEITADO";
        setResgates((prev) =>
          prev.map((r) =>
            r.id === resgateSelecionado.id
              ? { ...r, status: novoStatus, observacao: observacao || null }
              : r
          )
        );
        setResgateSelecionado(null);
      } catch (e: unknown) {
        setErro(e instanceof Error ? e.message : "Erro desconhecido.");
      }
    });
  }

  return (
    <>
      {resgateSelecionado && (
        <ModalAcao
          resgate={resgateSelecionado}
          acao={acao}
          nomePontos={nomePontos}
          isPending={isPending}
          erro={erro}
          observacao={observacao}
          corPrimaria={corPrimaria}
          onObservacao={setObservacao}
          onConfirmar={confirmarAcao}
          onCancelar={() => setResgateSelecionado(null)}
        />
      )}

      <div className="space-y-6">
        <PageHeader
          titulo={`Resgates — ${nomeLoja}`}
          descricao="Gerencie as solicitações de troca de pontos por produtos."
        />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["TODOS", "PENDENTE", "APROVADO", "REJEITADO", "ENTREGUE"] as const).map((s) => (
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
              {s === "TODOS" ? "Todos" : STATUS_LABEL[s]}{" "}
              <span className="opacity-60">({totais[s]})</span>
            </button>
          ))}
        </div>

        {/* Busca */}
        <input
          type="text"
          placeholder="Buscar por nome do colaborador..."
          value={buscaNome}
          onChange={(e) => setBuscaNome(e.target.value)}
          className="w-full max-w-sm px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
        />

        {/* Tabela */}
        {filtrados.length === 0 ? (
          <p className="text-zinc-400 text-sm py-10 text-center">Nenhum resgate encontrado.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-left text-xs uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900">
                  <th className="px-4 py-3 font-medium">Colaborador</th>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">{nomePontos}</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Observação</th>
                  {podeAprovar && <th className="px-4 py-3 font-medium">Ações</th>}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-900">
                {filtrados.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-800 dark:text-zinc-100">{r.membro.usuario.name}</p>
                      <p className="text-xs text-zinc-400">{r.membro.usuario.email}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">{r.produto.nome}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200 tabular-nums">
                      {r.pontosGastos.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap text-xs">{formatarData(r.criadoEm)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLS[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs max-w-[180px] truncate">
                      {r.observacao ?? "—"}
                    </td>
                    {podeAprovar && (
                      <td className="px-4 py-3">
                        {r.status === "PENDENTE" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => abrirModal(r, "aprovar")}
                              className="px-3 py-1 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-80"
                              style={{ backgroundColor: corPrimaria }}
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => abrirModal(r, "rejeitar")}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                            >
                              Rejeitar
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-xs">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}