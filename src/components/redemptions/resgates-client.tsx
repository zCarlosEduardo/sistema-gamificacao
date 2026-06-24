"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Package, Check, X, Search } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import type { Redemption } from "@/types";

interface ResgatesClientProps {
  nomePontos: string;
}

const statusConfig: Record<string, { label: string; variant: "warning" | "success" | "danger" | "default" }> = {
  PENDENTE: { label: "Pendente", variant: "warning" },
  APROVADO: { label: "Aprovado", variant: "success" },
  REJEITADO: { label: "Rejeitado", variant: "danger" },
  ENTREGUE: { label: "Entregue", variant: "default" },
};

// Filtros de status disponíveis
const statusFiltros = [
  { value: "", label: "Todos" },
  { value: "PENDENTE", label: "Pendentes" },
  { value: "APROVADO", label: "Aprovados" },
  { value: "ENTREGUE", label: "Entregues" },
  { value: "REJEITADO", label: "Rejeitados" },
];

export function ResgatesClient({ nomePontos }: ResgatesClientProps) {
  const { toast } = useToast();
  const [resgates, setResgates] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(false);
  const [processando, setProcessando] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Busca na API quando filtros mudam
  useEffect(() => {
    async function fetchResgates() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "10");
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (statusFiltro) params.set("status", statusFiltro);

        const res = await api.get<{ data: Redemption[]; meta: { totalPages: number } }>(
          `/redemptions?${params.toString()}`,
        );
        setResgates(res.data);
        setTotalPages(res.meta.totalPages);
      } catch {
        setResgates([]);
      } finally {
        setLoading(false);
      }
    }
    fetchResgates();
  }, [debouncedSearch, statusFiltro, page]);

  // Recarrega a lista atual (após uma ação)
  async function refresh() {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (statusFiltro) params.set("status", statusFiltro);
    try {
      const res = await api.get<{ data: Redemption[]; meta: { totalPages: number } }>(
        `/redemptions?${params.toString()}`,
      );
      setResgates(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {}
  }

  async function handleApprove(id: string) {
    setProcessando(id);
    try {
      await api.post(`/redemptions/${id}/approve`, {});
      toast("Resgate aprovado!", "success");
      await refresh();
    } catch {
      toast("Erro ao aprovar", "error");
    } finally {
      setProcessando(null);
    }
  }

  async function handleReject(id: string) {
    setProcessando(id);
    try {
      await api.post(`/redemptions/${id}/reject`, {});
      toast("Resgate rejeitado. Pontos devolvidos.", "info");
      await refresh();
    } catch {
      toast("Erro ao rejeitar", "error");
    } finally {
      setProcessando(null);
    }
  }

  async function handleDeliver(id: string) {
    setProcessando(id);
    try {
      await api.post(`/redemptions/${id}/deliver`, {});
      toast("Resgate marcado como entregue!", "success");
      await refresh();
    } catch {
      toast("Erro ao marcar entrega", "error");
    } finally {
      setProcessando(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)" />
          <input
            type="text"
            placeholder="Buscar por pessoa ou produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-(--color-bg-subtle) border border-(--color-border) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          />
        </div>
      </div>

      {/* Filtro de status */}
      <div className="flex gap-2 flex-wrap">
        {statusFiltros.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFiltro(f.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              statusFiltro === f.value
                ? "bg-(--color-primary)/10 border-(--color-primary)/30 text-(--color-primary-light)"
                : "border-(--color-border) text-(--color-text-muted) hover:text-(--color-text)"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-(--color-text-muted) text-center py-12">Carregando...</p>
      ) : resgates.length === 0 ? (
        <EmptyState
          icon={<Package size={24} />}
          title="Nenhum resgate encontrado"
          description="Ajuste os filtros ou aguarde novos pedidos."
        />
      ) : (
        <div className="space-y-3">
          {resgates.map((resgate) => {
            const status = statusConfig[resgate.status] ?? statusConfig.PENDENTE;
            const isProcessando = processando === resgate.id;

            return (
              <Card key={resgate.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-(--color-bg) border border-(--color-border) flex items-center justify-center overflow-hidden shrink-0">
                    {resgate.produtoImagem ? (
                      <img src={resgate.produtoImagem} alt={resgate.produtoNome} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{resgate.produtoEmoji ?? "🎁"}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Avatar name={resgate.membroNome ?? "?"} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{resgate.membroNome}</p>
                        <p className="text-xs text-(--color-text-muted) truncate">
                          {resgate.produtoNome} · {resgate.pontosGastos.toLocaleString("pt-BR")} {nomePontos.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ações conforme status */}
                  {resgate.status === "PENDENTE" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleReject(resgate.id)} loading={isProcessando} disabled={isProcessando}>
                        <X size={14} />
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(resgate.id)} loading={isProcessando} disabled={isProcessando}>
                        <Check size={14} /> Aprovar
                      </Button>
                    </div>
                  ) : resgate.status === "APROVADO" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="success">Aprovado</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleDeliver(resgate.id)} loading={isProcessando} disabled={isProcessando}>
                        Marcar entregue
                      </Button>
                    </div>
                  ) : (
                    <Badge variant={status.variant}>{status.label}</Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            «
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm text-(--color-text-muted) px-2">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}