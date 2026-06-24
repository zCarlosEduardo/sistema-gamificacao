"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { Target, Check, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import type { PendingApproval, Goal } from "@/types";

interface MetasClientProps {
  pendentesIniciais: PendingApproval[];
  metas: Goal[];
  nomeMeta: string;
  nomeGiro: string;
}

export function MetasClient({ pendentesIniciais, metas, nomeMeta, nomeGiro }: MetasClientProps) {
  const { toast } = useToast();
  const [pendentes, setPendentes] = useState(pendentesIniciais);
  const [confirmando, setConfirmando] = useState<PendingApproval | null>(null);
  const [processando, setProcessando] = useState(false);

  async function handleApprove() {
    if (!confirmando) return;
    setProcessando(true);

    try {
      await api.post(`/goals/${confirmando.goalId}/assignments/${confirmando.assignmentId}/approve`, {});
      // Remove da lista de pendentes
      setPendentes((prev) => prev.filter((p) => p.assignmentId !== confirmando.assignmentId));
      toast(`Meta aprovada! ${confirmando.girosRecompensa} ${nomeGiro.toLowerCase()}(s) gerado(s).`, "success");
      setConfirmando(null);
    } catch {
      toast("Erro ao aprovar", "error");
    } finally {
      setProcessando(false);
    }
  }

  async function handleReject(item: PendingApproval) {
    try {
      await api.post(`/goals/${item.goalId}/assignments/${item.assignmentId}/reject`, {});
      setPendentes((prev) => prev.filter((p) => p.assignmentId !== item.assignmentId));
      toast("Meta rejeitada", "info");
    } catch {
      toast("Erro ao rejeitar", "error");
    }
  }

  return (
    <>
      <Tabs
        tabs={[
          { id: "pendentes", label: `Aprovações (${pendentes.length})` },
          { id: "todas", label: "Todas as metas" },
        ]}
      >
        {(activeTab) => (
          <div className="space-y-3">
            {activeTab === "pendentes" &&
              (pendentes.length === 0 ? (
                <EmptyState
                  icon={<Check size={24} />}
                  title="Tudo em dia!"
                  description="Nenhuma meta aguardando aprovação no momento."
                />
              ) : (
                pendentes.map((item) => (
                  <Card key={item.assignmentId} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar name={item.memberNome} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold">{item.titulo}</h3>
                        <p className="text-xs text-(--color-text-muted)">
                          {item.memberNome} · bateu {item.progresso.toLocaleString("pt-BR")}/{item.valorAlvo.toLocaleString("pt-BR")} {item.unidade}
                        </p>
                        <Badge variant="primary" className="mt-1">
                          +{item.girosRecompensa} {nomeGiro.toLowerCase()}(s)
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleReject(item)}>
                          <X size={14} />
                        </Button>
                        <Button size="sm" onClick={() => setConfirmando(item)}>
                          <Check size={14} /> Aprovar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ))}

            {activeTab === "todas" &&
              (metas.length === 0 ? (
                <EmptyState
                  icon={<Target size={24} />}
                  title="Nenhuma meta criada"
                  description="As metas que você criar aparecem aqui."
                />
              ) : (
                metas.map((meta) => (
                  <Card key={meta.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{meta.titulo}</h3>
                        <p className="text-xs text-(--color-text-muted)">
                          {meta.tipo === "EQUIPE" ? "Meta de equipe" : "Meta individual"} · {meta.totalAssignments ?? 0} participante(s)
                        </p>
                      </div>
                      <Badge variant={meta.status === "ATIVA" ? "success" : "default"}>
                        {meta.status}
                      </Badge>
                    </div>
                  </Card>
                ))
              ))}
          </div>
        )}
      </Tabs>

      {/* Modal de confirmação */}
      <AnimatePresence>
        {confirmando && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !processando && setConfirmando(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-sm bg-(--color-bg) border border-(--color-border) rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-amber-400" />
                </div>
                <h2 className="text-lg font-bold">Confirmar aprovação</h2>
              </div>

              <p className="text-sm text-(--color-text-muted) mb-4">
                Você vai aprovar a meta <span className="font-semibold text-(--color-text)">"{confirmando.titulo}"</span> de{" "}
                <span className="font-semibold text-(--color-text)">{confirmando.memberNome}</span>.
              </p>

              <div className="p-3 rounded-lg bg-(--color-bg-subtle) border border-(--color-border) mb-4">
                <p className="text-sm">
                  Isso vai gerar <span className="font-bold text-(--color-primary-light)">{confirmando.girosRecompensa} {nomeGiro.toLowerCase()}(s)</span> pra essa pessoa.
                </p>
                <p className="text-xs text-(--color-text-muted) mt-1">
                  Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setConfirmando(null)}
                  disabled={processando}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleApprove}
                  loading={processando}
                  disabled={processando}
                >
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}