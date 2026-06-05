"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Target, CheckCircle2, Clock, XCircle,
  Users, User, ChevronDown, ChevronRight,
} from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import {
  PageHeader, Modal, Campo, MultiSelect,
  Avatar, inputCls, BotoesModal, ErroInline,
} from "@/components";

// ─── Tipos ───────────────────────────────────────────────────

// Status do schema: ATIVA | PAUSADA | ENCERRADA
type StatusMeta = "ATIVA" | "PAUSADA" | "ENCERRADA";
type StatusMetaUsuario = "EM_ANDAMENTO" | "CONCLUIDA" | "APROVADA" | "REJEITADA";

interface MetaUsuario {
  id: string;
  status: StatusMetaUsuario;
  atualizadoEm: string;
  meta: {
    id: string;
    titulo: string;
    descricao?: string;
    tipo: "INDIVIDUAL" | "EQUIPE";
    status: StatusMeta;
  };
}

interface Meta {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: "INDIVIDUAL" | "EQUIPE";
  status: StatusMeta; // ATIVA | PAUSADA | ENCERRADA
  criadoEm: string;
  equipe?: { id: string; nome: string } | null;
  _count?: { metasUsuario: number };
}

interface MembroEquipe {
  equipe: { id: string; nome: string };
}

interface MembroMetaUsuario {
  id: string;
  status: StatusMetaUsuario;
  meta: { id: string; titulo: string };
}

interface Membro {
  id: string;
  ativo: boolean;
  usuario: { id: string; name: string; image?: string | null };
  grupo: { nome: string } | null;
  equipes: MembroEquipe[];             // vem do backend
  metasUsuario?: MembroMetaUsuario[];  // incluído via listarMembros atualizado
}

interface Pendente {
  id: string;
  status: string;
  atualizadoEm: string;
  meta: { id: string; titulo: string };
  membro: { usuario: { id: string; name: string; image?: string | null } };
}

interface Equipe { id: string; nome: string }

interface MetasClientProps {
  tenantId: string;
  metas: MetaUsuario[] | Meta[];
  membros: Membro[];
  equipes: Equipe[];
  pendentes: Pendente[];
  usuarioId: string;
  podeVer: boolean;
  podeCriar: boolean;
  podeAprovar: boolean;
  eAdmin: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
  });
}

const STATUS_CFG = {
  EM_ANDAMENTO: { label: "Em andamento",        cor: "#6366f1", Icon: Clock },
  CONCLUIDA:    { label: "Aguardando aprovação", cor: "#f59e0b", Icon: Clock },
  APROVADA:     { label: "Aprovada",             cor: "#10b981", Icon: CheckCircle2 },
  REJEITADA:    { label: "Rejeitada",            cor: "#ef4444", Icon: XCircle },
} as const;

function StatusPill({ status }: { status: StatusMetaUsuario }) {
  const { label, cor, Icon } = STATUS_CFG[status] ?? STATUS_CFG.EM_ANDAMENTO;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
      style={{ background: hexToRgba(cor, 0.1), color: cor }}
    >
      <Icon size={10} />
      {label}
    </span>
  );
}

// ── Card de aprovação pendente ────────────────────────────────

function CardPendente({
  item, corPrimaria, onAprovar, onRejeitar, isPending,
}: {
  item: Pendente;
  corPrimaria: string;
  onAprovar: (id: string) => void;
  onRejeitar: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-100 dark:border-amber-500/15"
      style={{ background: hexToRgba("#f59e0b", 0.04) }}
    >
      <Avatar
        nome={item.membro.usuario.name}
        imagem={item.membro.usuario.image ?? undefined}
        cor={corPrimaria}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
          {item.membro.usuario.name.split(" ")[0]}
        </p>
        <p className="text-xs text-zinc-400 truncate">{item.meta.titulo}</p>
        <p className="text-[10px] text-zinc-400 mt-0.5">{formatData(item.atualizadoEm)}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onAprovar(item.id)}
          disabled={isPending}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
        >
          Aprovar
        </button>
        <button
          onClick={() => onRejeitar(item.id)}
          disabled={isPending}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          Rejeitar
        </button>
      </div>
    </motion.div>
  );
}

// ── Grupo colapsável por equipe ───────────────────────────────

function GrupoEquipe({
  equipe, membros, corPrimaria, nomeMeta, isPending, onConcluir, icone,
}: {
  equipe: Equipe;
  membros: Membro[];
  corPrimaria: string;
  nomeMeta: string;
  isPending: boolean;
  onConcluir: (metaId: string, nome: string) => void;
  icone?: React.ReactNode;
}) {
  const [aberto, setAberto] = useState(true);
  const totalMetas = membros.reduce((acc, m) => acc + (m.metasUsuario?.length ?? 0), 0);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <button
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: hexToRgba(corPrimaria, 0.1) }}
        >
          {icone ?? <Users size={14} style={{ color: corPrimaria }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{equipe.nome}</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {membros.length} membro{membros.length !== 1 ? "s" : ""}
            {totalMetas > 0 && ` · ${totalMetas} ${nomeMeta.toLowerCase()}${totalMetas !== 1 ? "s" : ""}`}
          </p>
        </div>
        {aberto
          ? <ChevronDown size={14} className="text-zinc-400 shrink-0" />
          : <ChevronRight size={14} className="text-zinc-400 shrink-0" />}
      </button>

      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-100 dark:border-zinc-800 p-3 space-y-2">
              {membros.length === 0 ? (
                <p className="text-xs text-zinc-400 py-2 px-2">Nenhum membro nesta equipe.</p>
              ) : (
                membros.map((m) => (
                  <CardMembroGestor
                    key={m.id}
                    membro={m}
                    corPrimaria={corPrimaria}
                    nomeMeta={nomeMeta}
                    isPending={isPending}
                    onConcluir={onConcluir}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Card de membro com suas metas ─────────────────────────────

function CardMembroGestor({
  membro, corPrimaria, nomeMeta, isPending, onConcluir,
}: {
  membro: Membro;
  corPrimaria: string;
  nomeMeta: string;
  isPending: boolean;
  onConcluir: (metaId: string, nome: string) => void;
}) {
  const metas = membro.metasUsuario ?? [];

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
      <Avatar
        nome={membro.usuario.name}
        imagem={membro.usuario.image ?? undefined}
        cor={corPrimaria}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {membro.usuario.name.split(" ")[0]}
        </p>
        {membro.grupo && (
          <p className="text-[10px] text-zinc-400">{membro.grupo.nome}</p>
        )}

        {metas.length > 0 ? (
          <div className="mt-2 space-y-1.5">
            {metas.map((mu) => (
              <div
                key={mu.id}
                className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: STATUS_CFG[mu.status]?.cor ?? "#6366f1" }}
                  />
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 truncate">
                    {mu.meta.titulo}
                  </p>
                </div>
                {(mu.status === "EM_ANDAMENTO") && (
                  <button
                    onClick={() => onConcluir(mu.meta.id, mu.meta.titulo)}
                    disabled={isPending}
                    className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                    style={{ background: hexToRgba(corPrimaria, 0.1), color: corPrimaria }}
                  >
                    Concluir
                  </button>
                )}
                {mu.status !== "EM_ANDAMENTO" && (
                  <StatusPill status={mu.status} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-zinc-400 mt-1.5">
            Nenhuma {nomeMeta.toLowerCase()} ativa.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Row de meta com toggle ATIVA/PAUSADA ──────────────────────

function RowMetaAtiva({
  meta, corPrimaria, onToggle, isPending,
}: {
  meta: Meta;
  corPrimaria: string;
  onToggle: (metaId: string, novoStatus: StatusMeta) => void;
  isPending: boolean;
}) {
  const ativa = meta.status === "ATIVA";

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
          {meta.titulo}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[10px] text-zinc-400">
            {meta.tipo === "EQUIPE" ? `Equipe · ${meta.equipe?.nome ?? "—"}` : "Individual"}
          </span>
          <span className="text-[10px] text-zinc-400">
            {meta._count?.metasUsuario ?? 0} vinculado(s)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] text-zinc-400">{ativa ? "Ativa" : "Pausada"}</span>
        <button
          onClick={() => onToggle(meta.id, ativa ? "PAUSADA" : "ATIVA")}
          disabled={isPending}
          className="relative w-10 h-5 rounded-full transition-colors duration-200 disabled:opacity-50 focus:outline-none"
          style={ativa ? { background: corPrimaria } : { background: "#d4d4d8" }}
          aria-label={ativa ? "Pausar meta" : "Ativar meta"}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              ativa ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

// ── Visão do gestor ───────────────────────────────────────────

function VisaoGestor({
  metas, membros, equipes, pendentes,
  corPrimaria, nomeMeta,
  isPending, onAprovar, onRejeitar, onConcluir, onToggleStatus,
}: {
  metas: Meta[];
  membros: Membro[];
  equipes: Equipe[];
  pendentes: Pendente[];
  corPrimaria: string;
  nomeMeta: string;
  isPending: boolean;
  onAprovar: (id: string) => void;
  onRejeitar: (id: string) => void;
  onConcluir: (metaId: string, nome: string) => void;
  onToggleStatus: (metaId: string, novoStatus: StatusMeta) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Pendentes */}
      {pendentes.length > 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse block shrink-0" />
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {pendentes.length} {nomeMeta.toLowerCase()}{pendentes.length > 1 ? "s" : ""} para aprovar
            </p>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {pendentes.map((p) => (
                <CardPendente
                  key={p.id}
                  item={p}
                  corPrimaria={corPrimaria}
                  onAprovar={onAprovar}
                  onRejeitar={onRejeitar}
                  isPending={isPending}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Membros por equipe */}
      {equipes.map((equipe) => {
        // Usa equipes[] do membro para filtrar corretamente
        const membrosEquipe = membros.filter(
          (m) => m.ativo && m.equipes?.some((e) => e.equipe.id === equipe.id),
        );
        if (membrosEquipe.length === 0) return null;
        return (
          <GrupoEquipe
            key={equipe.id}
            equipe={equipe}
            membros={membrosEquipe}
            corPrimaria={corPrimaria}
            nomeMeta={nomeMeta}
            isPending={isPending}
            onConcluir={onConcluir}
          />
        );
      })}

      {/* Membros sem equipe */}
      {(() => {
        const semEquipe = membros.filter(
          (m) => m.ativo && (!m.equipes || m.equipes.length === 0),
        );
        if (semEquipe.length === 0) return null;
        return (
          <GrupoEquipe
            equipe={{ id: "__individual__", nome: "Sem equipe" }}
            membros={semEquipe}
            corPrimaria={corPrimaria}
            nomeMeta={nomeMeta}
            isPending={isPending}
            onConcluir={onConcluir}
            icone={<User size={14} style={{ color: corPrimaria }} />}
          />
        );
      })()}

      {/* Gerenciar metas cadastradas */}
      {metas.length > 0 && (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 mb-2 pl-1">
            {nomeMeta}s cadastradas
          </p>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
            {metas.map((meta) => (
              <RowMetaAtiva
                key={meta.id}
                meta={meta}
                corPrimaria={corPrimaria}
                onToggle={onToggleStatus}
                isPending={isPending}
              />
            ))}
          </div>
        </div>
      )}

      {equipes.length === 0 && metas.length === 0 && pendentes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <Target size={28} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">Nenhuma {nomeMeta.toLowerCase()} criada ainda.</p>
        </div>
      )}
    </div>
  );
}

// ── Visão do jogador ──────────────────────────────────────────

function VisaoJogador({
  metas, corPrimaria, nomeMeta,
}: {
  metas: MetaUsuario[];
  corPrimaria: string;
  nomeMeta: string;
}) {
  const ativas    = metas.filter((m) => m.status === "EM_ANDAMENTO");
  const historico = metas.filter((m) => m.status !== "EM_ANDAMENTO");

  if (metas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center">
        <Target size={28} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
        <p className="text-sm text-zinc-400">Nenhuma {nomeMeta.toLowerCase()} para você ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ativas.length > 0 && (
        <section>
          <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 mb-2 pl-1">
            Em andamento — {ativas.length}
          </p>
          <div className="space-y-2.5">
            {ativas.map((item, i) => (
              <CardMetaJogador key={item.id} item={item} corPrimaria={corPrimaria} delay={i * 0.05} />
            ))}
          </div>
        </section>
      )}

      {historico.length > 0 && (
        <section>
          <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 mb-2 pl-1">
            Histórico — {historico.length}
          </p>
          <div className="space-y-2 opacity-80">
            {historico.map((item, i) => (
              <CardMetaJogador key={item.id} item={item} corPrimaria={corPrimaria} delay={i * 0.04} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CardMetaJogador({
  item, corPrimaria, delay = 0,
}: {
  item: MetaUsuario;
  corPrimaria: string;
  delay?: number;
}) {
  const { cor } = STATUS_CFG[item.status] ?? STATUS_CFG.EM_ANDAMENTO;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border bg-white dark:bg-zinc-900 p-4"
      style={{ borderColor: hexToRgba(cor, 0.2) }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
            {item.meta.titulo}
          </p>
          {item.meta.descricao && (
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{item.meta.descricao}</p>
          )}
        </div>
        <StatusPill status={item.status} />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          {item.meta.tipo === "EQUIPE"
            ? <><Users size={11} /> Meta de equipe</>
            : <><User size={11} /> Individual</>}
        </span>
        <span className="text-[10px] text-zinc-400">{formatData(item.atualizadoEm)}</span>
      </div>
    </motion.div>
  );
}

// ── Componente principal ──────────────────────────────────────

export default function MetasClient({
  tenantId, metas, membros, equipes, pendentes,
  usuarioId, podeVer, podeCriar, podeAprovar, eAdmin,
}: MetasClientProps) {
  const { tenant } = useTenant();
  const corPrimaria   = tenant?.corPrimaria   ?? "#6366f1";
  const corSecundaria = tenant?.corSecundaria ?? "#818cf8";
  const nomeMeta      = tenant?.nomeMeta      ?? "Meta";

  const [isPending, startTransition] = useTransition();
  const [pendentesState, setPendentesState] = useState<Pendente[]>(pendentes);
  const [metasState, setMetasState] = useState<any[]>(metas);

  const [modalCriar, setModalCriar] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<"INDIVIDUAL" | "EQUIPE">("INDIVIDUAL");
  const [equipeId, setEquipeId] = useState("");
  const [membrosSelecionados, setMembrosSelecionados] = useState<string[]>([]);
  const [erroCriar, setErroCriar] = useState("");

  const [modalConcluir, setModalConcluir] = useState<{
    metaId: string; usuarioId: string; nome: string;
  } | null>(null);

  const isGestorOuAdmin = podeCriar || podeAprovar || eAdmin;

  async function handleCriar() {
    setErroCriar("");
    startTransition(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metas`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
          credentials: "include",
          body: JSON.stringify({
            titulo,
            descricao: descricao || undefined,
            tipo,
            valorAlvo: 1,
            equipeId: tipo === "EQUIPE" ? equipeId || undefined : undefined,
          }),
        });
        if (!res.ok) throw new Error("Erro ao criar meta");
        const novaMeta = await res.json();

        await Promise.all(
          membrosSelecionados.map((uid) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/metas/${novaMeta.id}/vincular/${uid}`, {
              method: "POST",
              headers: { "x-tenant-id": tenantId },
              credentials: "include",
            }),
          ),
        );

        setMetasState((prev) => [novaMeta, ...prev]);
        setModalCriar(false);
        setTitulo(""); setDescricao(""); setTipo("INDIVIDUAL");
        setEquipeId(""); setMembrosSelecionados([]);
      } catch (e: any) {
        setErroCriar(e.message ?? "Erro ao criar meta");
      }
    });
  }

  async function handleAprovar(metaUsuarioId: string) {
    startTransition(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/metas/${metaUsuarioId}/aprovar`,
        { method: "PATCH", headers: { "x-tenant-id": tenantId }, credentials: "include" },
      );
      if (res.ok) setPendentesState((prev) => prev.filter((p) => p.id !== metaUsuarioId));
    });
  }

  async function handleRejeitar(metaUsuarioId: string) {
    startTransition(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/metas/${metaUsuarioId}/rejeitar`,
        { method: "PATCH", headers: { "x-tenant-id": tenantId }, credentials: "include" },
      );
      if (res.ok) setPendentesState((prev) => prev.filter((p) => p.id !== metaUsuarioId));
    });
  }

  async function handleConcluir() {
    if (!modalConcluir?.usuarioId) return;
    startTransition(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/metas/${modalConcluir.metaId}/concluir/${modalConcluir.usuarioId}`,
        { method: "PATCH", headers: { "x-tenant-id": tenantId }, credentials: "include" },
      );
      if (res.ok) {
        setModalConcluir(null);
        window.location.reload();
      }
    });
  }

  // Envia status correto: "ATIVA" | "PAUSADA"
  async function handleToggleStatus(metaId: string, novoStatus: StatusMeta) {
    startTransition(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/metas/${metaId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
          credentials: "include",
          body: JSON.stringify({ status: novoStatus }),
        },
      );
      if (res.ok) {
        setMetasState((prev) =>
          prev.map((m) => m.id === metaId ? { ...m, status: novoStatus } : m),
        );
      }
    });
  }

  const membrosParaVincular =
    tipo === "EQUIPE" && equipeId
      ? membros.filter((m) => m.ativo && m.equipes?.some((e) => e.equipe.id === equipeId))
      : membros.filter((m) => m.ativo);

  return (
    <div className="space-y-6">
      <PageHeader
        titulo={isGestorOuAdmin ? `${nomeMeta}s` : `Minhas ${nomeMeta.toLowerCase()}s`}
        descricao={
          isGestorOuAdmin
            ? `Gerencie as ${nomeMeta.toLowerCase()}s por equipe`
            : `Suas ${nomeMeta.toLowerCase()}s`
        }
        action={
          (podeCriar || eAdmin) ? (
            <button
              onClick={() => setModalCriar(true)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})` }}
            >
              <Plus size={15} />
              Nova {nomeMeta}
            </button>
          ) : undefined
        }
      />

      {isGestorOuAdmin ? (
        <VisaoGestor
          metas={metasState as Meta[]}
          membros={membros}
          equipes={equipes}
          pendentes={pendentesState}
          corPrimaria={corPrimaria}
          nomeMeta={nomeMeta}
          isPending={isPending}
          onAprovar={handleAprovar}
          onRejeitar={handleRejeitar}
          onConcluir={(metaId, nome) =>
            setModalConcluir({ metaId, usuarioId: "", nome })
          }
          onToggleStatus={handleToggleStatus}
        />
      ) : (
        podeVer && (
          <VisaoJogador
            metas={metasState as MetaUsuario[]}
            corPrimaria={corPrimaria}
            nomeMeta={nomeMeta}
          />
        )
      )}

      {/* Modal criar */}
      <AnimatePresence>
        {modalCriar && (
          <Modal
            titulo={`Nova ${nomeMeta}`}
            subtitulo="Ficará ativa a partir de hoje"
            onClose={() => setModalCriar(false)}
          >
            <div className="space-y-4">
              <Campo label="Título" required>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder={`Ex: Bater ${nomeMeta.toLowerCase()} de SLA`}
                  className={inputCls}
                />
              </Campo>
              <Campo label="Descrição">
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o que precisa ser feito..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </Campo>
              <Campo label="Tipo">
                <select
                  value={tipo}
                  onChange={(e) => {
                    setTipo(e.target.value as "INDIVIDUAL" | "EQUIPE");
                    setMembrosSelecionados([]);
                  }}
                  className={inputCls}
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="EQUIPE">Equipe</option>
                </select>
              </Campo>
              {tipo === "EQUIPE" && equipes.length > 0 && (
                <Campo label="Equipe">
                  <select
                    value={equipeId}
                    onChange={(e) => { setEquipeId(e.target.value); setMembrosSelecionados([]); }}
                    className={inputCls}
                  >
                    <option value="">Selecione uma equipe</option>
                    {equipes.map((e) => (
                      <option key={e.id} value={e.id}>{e.nome}</option>
                    ))}
                  </select>
                </Campo>
              )}
              <Campo label="Vincular a">
                <MultiSelect
                  label=" "
                  opcoes={membrosParaVincular.map((m) => ({
                    id: m.usuario.id,
                    nome: m.usuario.name,
                  }))}
                  selecionados={membrosSelecionados}
                  onChange={setMembrosSelecionados}
                  cor={corPrimaria}
                />
              </Campo>
              <ErroInline mensagem={erroCriar} />
              <BotoesModal
                onCancelar={() => setModalCriar(false)}
                onConfirmar={handleCriar}
                isPending={isPending}
                disabled={!titulo.trim() || membrosSelecionados.length === 0}
                labelConfirmar={`Criar ${nomeMeta}`}
                labelPending="Criando..."
                cor={corPrimaria}
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal concluir */}
      <AnimatePresence>
        {modalConcluir && (
          <Modal
            titulo="Marcar como concluída"
            subtitulo={modalConcluir.nome}
            onClose={() => setModalConcluir(null)}
            size="sm"
          >
            <div className="space-y-4">
              <Campo label="Quem concluiu?">
                <select
                  value={modalConcluir.usuarioId}
                  onChange={(e) =>
                    setModalConcluir((prev) =>
                      prev ? { ...prev, usuarioId: e.target.value } : null,
                    )
                  }
                  className={inputCls}
                >
                  <option value="">Selecione o colaborador</option>
                  {membros.filter((m) => m.ativo).map((m) => (
                    <option key={m.usuario.id} value={m.usuario.id}>
                      {m.usuario.name}
                    </option>
                  ))}
                </select>
              </Campo>
              <BotoesModal
                onCancelar={() => setModalConcluir(null)}
                onConfirmar={handleConcluir}
                isPending={isPending}
                disabled={!modalConcluir.usuarioId}
                labelConfirmar="Confirmar conclusão"
                labelPending="Salvando..."
                cor={corPrimaria}
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}