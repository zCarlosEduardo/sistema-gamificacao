"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Power, PowerOff } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { PageHeader, Modal, Campo, inputCls } from "@/components";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusMeta = "ATIVA" | "PAUSADA" | "ENCERRADA";
type StatusMetaUsuario = "EM_ANDAMENTO" | "CONCLUIDA" | "APROVADA" | "REJEITADA";

interface MetaUsuario {
  id: string; // metaUsuarioId
  status: StatusMetaUsuario;
  membro: {
    id: string;
    usuario: { id: string; name: string; image: string | null };
  };
}

interface Meta {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: "INDIVIDUAL" | "EQUIPE";
  status: StatusMeta;
  equipeId: string | null;
  equipe: { id: string; nome: string } | null;
  metasUsuario: MetaUsuario[];
}

interface Equipe {
  id: string;
  nome: string;
}

interface Usuario {
  id: string;
  name: string;
}

interface Props {
  tenantId: string;
  metas: Meta[];
  equipes: Equipe[];       // equipes que o usuário pode gerenciar
  usuarios: Usuario[];     // membros do tenant (para meta individual)
  isGestor: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MU_LABEL: Record<StatusMetaUsuario, string> = {
  EM_ANDAMENTO: "Pendente",
  CONCLUIDA:    "Concluída",
  APROVADA:     "Aprovada",
  REJEITADA:    "Rejeitada",
};

const STATUS_MU_CLS: Record<StatusMetaUsuario, string> = {
  EM_ANDAMENTO: "bg-amber-400/10 text-amber-400",
  CONCLUIDA:    "bg-blue-400/10 text-blue-400",
  APROVADA:     "bg-emerald-400/10 text-emerald-400",
  REJEITADA:    "bg-red-400/10 text-red-400",
};

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

// ─── Sub: linha de MetaUsuario com aprovar/rejeitar ───────────────────────────

function LinhaVinculo({
  mu,
  tenantId,
  corPrimaria,
  onAtualizar,
}: {
  mu: MetaUsuario;
  tenantId: string;
  corPrimaria: string;
  onAtualizar: (muId: string, novoStatus: StatusMetaUsuario) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  function acao(endpoint: string, novoStatus: StatusMetaUsuario) {
    setErro("");
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/metas/${mu.id}/${endpoint}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: { "x-tenant-id": tenantId },
          }
        );
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.message ?? "Erro");
        }
        onAtualizar(mu.id, novoStatus);
      } catch (e: unknown) {
        setErro(e instanceof Error ? e.message : "Erro");
      }
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ backgroundColor: corPrimaria }}
        >
          {mu.membro.usuario.image ? (
            <img src={mu.membro.usuario.image} className="w-full h-full rounded-full object-cover" alt="" />
          ) : (
            iniciais(mu.membro.usuario.name)
          )}
        </div>
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{mu.membro.usuario.name}</span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_MU_CLS[mu.status]}`}>
          {STATUS_MU_LABEL[mu.status]}
        </span>

        {mu.status === "EM_ANDAMENTO" && (
          <>
            <button
              disabled={isPending}
              onClick={() => acao("aprovar", "APROVADA")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-white hover:opacity-80 disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: corPrimaria }}
            >
              {isPending ? "..." : "Aprovar"}
            </button>
            <button
              disabled={isPending}
              onClick={() => acao("rejeitar", "REJEITADA")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300 transition-colors disabled:opacity-50"
            >
              {isPending ? "..." : "Rejeitar"}
            </button>
          </>
        )}
      </div>

      {erro && <p className="text-xs text-red-500 mt-1">{erro}</p>}
    </div>
  );
}

// ─── Sub: card de meta ────────────────────────────────────────────────────────

function CardMeta({
  meta,
  tenantId,
  isGestor,
  corPrimaria,
  nomeMeta,
  onToggleStatus,
  onAbrirEditar,
  onAtualizarVinculo,
}: {
  meta: Meta;
  tenantId: string;
  isGestor: boolean;
  corPrimaria: string;
  nomeMeta: string;
  onToggleStatus: (id: string, novoStatus: StatusMeta) => void;
  onAbrirEditar: (meta: Meta) => void;
  onAtualizarVinculo: (metaId: string, muId: string, novoStatus: StatusMetaUsuario) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pendentes = (meta.metasUsuario ?? []).filter((mu) => mu.status === "EM_ANDAMENTO").length;
  const ativa = meta.status === "ATIVA";

  function toggleStatus() {
    const novoStatus: StatusMeta = ativa ? "PAUSADA" : "ATIVA";
    startTransition(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/metas/${meta.id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
          body: JSON.stringify({ status: novoStatus }),
        }
      );
      if (res.ok) onToggleStatus(meta.id, novoStatus);
    });
  }

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      ativa
        ? "border-zinc-200 dark:border-zinc-800"
        : "border-zinc-200/50 dark:border-zinc-800/50 opacity-60"
    }`}>
      {/* Cabeçalho */}
      <div className="flex items-start gap-3 px-4 py-3 bg-white dark:bg-zinc-900">
        {/* Dot status */}
        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ativa ? "bg-emerald-400" : "bg-zinc-400"}`} />

        <div className="flex-1 min-w-0">
          <p className="font-medium text-zinc-800 dark:text-zinc-100 text-sm">{meta.titulo}</p>
          {meta.descricao && (
            <p className="text-xs text-zinc-400 truncate mt-0.5">{meta.descricao}</p>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-zinc-400">
              {meta.tipo === "EQUIPE"
                ? `Equipe: ${meta.equipe?.nome ?? "—"}`
                : "Individual"}
            </span>
            {pendentes > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-500 font-medium">
                {pendentes} pendente{pendentes !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {isGestor && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onAbrirEditar(meta)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              disabled={isPending}
              onClick={toggleStatus}
              className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              title={ativa ? "Pausar" : "Ativar"}
            >
              {ativa ? <PowerOff size={14} /> : <Power size={14} className="text-emerald-400" />}
            </button>
            {(meta.metasUsuario ?? []).length > 0 && (
              <button
                onClick={() => setAberto((v) => !v)}
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${aberto ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Vínculos expandidos */}
      {aberto && isGestor && (
        <div className="px-4 pb-2 bg-zinc-50/50 dark:bg-zinc-950/30">
          {(meta.metasUsuario ?? []).map((mu) => (
            <LinhaVinculo
              key={mu.id}
              mu={mu}
              tenantId={tenantId}
              corPrimaria={corPrimaria}
              onAtualizar={(muId, novoStatus) =>
                onAtualizarVinculo(meta.id, muId, novoStatus)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Modal Criar/Editar ───────────────────────────────────────────────────────

function ModalMeta({
  meta,
  equipes,
  usuarios,
  tenantId,
  corPrimaria,
  nomeMeta,
  nomeEquipe,
  onSalvar,
  onFechar,
}: {
  meta: Meta | null; // null = criar
  equipes: Equipe[];
  usuarios: Usuario[];
  tenantId: string;
  corPrimaria: string;
  nomeMeta: string;
  nomeEquipe: string;
  onSalvar: (meta: Meta) => void;
  onFechar: () => void;
}) {
  const [titulo, setTitulo] = useState(meta?.titulo ?? "");
  const [descricao, setDescricao] = useState(meta?.descricao ?? "");
  const [tipo, setTipo] = useState<"EQUIPE" | "INDIVIDUAL">(meta?.tipo ?? "EQUIPE");
  const [equipeId, setEquipeId] = useState(meta?.equipeId ?? "");
  const [usuarioIdsSel, setUsuarioIdsSel] = useState<string[]>(
    meta?.metasUsuario.map((mu) => mu.membro.usuario.id) ?? []
  );
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  function salvar() {
    if (!titulo.trim()) { setErro("Título obrigatório."); return; }
    if (tipo === "EQUIPE" && !equipeId) { setErro(`Selecione uma ${nomeEquipe}.`); return; }
    if (tipo === "INDIVIDUAL" && usuarioIdsSel.length === 0) { setErro("Selecione ao menos um usuário."); return; }

    setErro("");
    startTransition(async () => {
      try {
        const body = {
          titulo: titulo.trim(),
          descricao: descricao.trim() || undefined,
          ...(tipo === "EQUIPE"
            ? { equipeId }
            : { usuarioIds: usuarioIdsSel }),
        };

        const url = meta
          ? `${process.env.NEXT_PUBLIC_API_URL}/metas/${meta.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/metas`;

        const res = await fetch(url, {
          method: meta ? "PATCH" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.message ?? "Erro ao salvar.");
        }

        const salva = await res.json();
        onSalvar(salva);
      } catch (e: unknown) {
        setErro(e instanceof Error ? e.message : "Erro desconhecido.");
      }
    });
  }

  return (
    <Modal
      titulo={meta ? `Editar ${nomeMeta}` : `Nova ${nomeMeta}`}
      onClose={onFechar}
    >
      <div className="flex flex-col gap-4">
        <Campo label="Título" required>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder={`Ex: Bater 10 ligações hoje`}
            className={inputCls}
          />
        </Campo>

        <Campo label="Descrição">
          <textarea
            rows={2}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Detalhes opcionais..."
            className={`${inputCls} resize-none`}
          />
        </Campo>

        <Campo label="Tipo">
          <div className="flex gap-2">
            {(["EQUIPE", "INDIVIDUAL"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  tipo === t
                    ? "text-white border-transparent"
                    : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-transparent hover:border-zinc-400"
                }`}
                style={tipo === t ? { backgroundColor: corPrimaria, borderColor: corPrimaria } : {}}
              >
                {t === "EQUIPE" ? nomeEquipe : "Individual"}
              </button>
            ))}
          </div>
        </Campo>

        {tipo === "EQUIPE" ? (
          <Campo label={nomeEquipe} required>
            <select value={equipeId} onChange={(e) => setEquipeId(e.target.value)} className={inputCls}>
              <option value="">Selecione...</option>
              {equipes.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.nome}</option>
              ))}
            </select>
          </Campo>
        ) : (
          <Campo label="Usuários" required>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg max-h-40 overflow-y-auto">
              {usuarios.map((u) => {
                const sel = usuarioIdsSel.includes(u.id);
                return (
                  <label
                    key={u.id}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={sel}
                      onChange={() =>
                        setUsuarioIdsSel((prev) =>
                          sel ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                        )
                      }
                      className="rounded"
                      style={{ accentColor: corPrimaria }}
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{u.name}</span>
                  </label>
                );
              })}
            </div>
          </Campo>
        )}

        {erro && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">{erro}</p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onFechar}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-opacity hover:opacity-80"
            style={{ backgroundColor: corPrimaria }}
          >
            {isPending ? "Salvando..." : meta ? "Salvar" : "Criar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function MetasClient({ tenantId, metas: metasIniciais, equipes, usuarios, isGestor }: Props) {
  const { tenant } = useTenant();
  const nomeMeta   = tenant?.nomeMeta   ?? "Meta";
  const nomeEquipe = tenant?.nomeEquipe ?? "Equipe";
  const corPrimaria = tenant?.corPrimaria ?? "#7C3AED";

  const [metas, setMetas] = useState<Meta[]>(metasIniciais);
  const [filtro, setFiltro] = useState<"TODAS" | "ATIVA" | "PAUSADA">("TODAS");
  const [modalMeta, setModalMeta] = useState<Meta | null | "nova">(null);

  const metasFiltradas = metas.filter((m) =>
    filtro === "TODAS" || m.status === filtro
  );

  // Agrupa por equipe para exibição
  const porEquipe: Record<string, Meta[]> = {};
  for (const m of metasFiltradas) {
    const chave = m.equipeId ?? "__individual__";
    if (!porEquipe[chave]) porEquipe[chave] = [];
    porEquipe[chave].push(m);
  }

  const nomeGrupo = (chave: string) => {
    if (chave === "__individual__") return "Individuais";
    return equipes.find((e) => e.id === chave)?.nome ?? chave;
  };

  function onSalvar(nova: Meta) {
    setMetas((prev) => {
      const existe = prev.find((m) => m.id === nova.id);
      return existe
        ? prev.map((m) => (m.id === nova.id ? { ...m, ...nova } : m))
        : [{ ...nova, metasUsuario: nova.metasUsuario ?? [] }, ...prev];
    });
    setModalMeta(null);
  }

  function onToggleStatus(id: string, novoStatus: StatusMeta) {
    setMetas((prev) => prev.map((m) => (m.id === id ? { ...m, status: novoStatus } : m)));
  }

  function onAtualizarVinculo(metaId: string, muId: string, novoStatus: StatusMetaUsuario) {
    setMetas((prev) =>
      prev.map((m) =>
        m.id !== metaId
          ? m
          : {
              ...m,
              metasUsuario: (m.metasUsuario ?? []).map((mu) =>
                mu.id === muId ? { ...mu, status: novoStatus } : mu
              ),
            }
      )
    );
  }

  return (
    <>
      {(modalMeta === "nova" || (modalMeta && typeof modalMeta === "object")) && (
        <ModalMeta
          meta={modalMeta === "nova" ? null : (modalMeta as Meta)}
          equipes={equipes}
          usuarios={usuarios}
          tenantId={tenantId}
          corPrimaria={corPrimaria}
          nomeMeta={nomeMeta}
          nomeEquipe={nomeEquipe}
          onSalvar={onSalvar}
          onFechar={() => setModalMeta(null)}
        />
      )}

      <div className="space-y-6">
        <PageHeader
          titulo={`${nomeMeta}s`}
          descricao={`Gerencie e acompanhe as ${nomeMeta.toLowerCase()}s da sua equipe.`}
          action={
            isGestor ? (
              <button
                onClick={() => setModalMeta("nova")}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: corPrimaria }}
              >
                <Plus size={16} />
                Nova {nomeMeta}
              </button>
            ) : undefined
          }
        />

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {(["TODAS", "ATIVA", "PAUSADA"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                filtro === f
                  ? "text-white border-transparent"
                  : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
              }`}
              style={filtro === f ? { backgroundColor: corPrimaria, borderColor: corPrimaria } : {}}
            >
              {f === "TODAS" ? "Todas" : f === "ATIVA" ? "Ativas" : "Pausadas"}
              <span className="ml-1.5 opacity-60 text-xs">
                ({f === "TODAS" ? metas.length : metas.filter((m) => m.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Grupos por equipe */}
        {Object.keys(porEquipe).length === 0 && (
          <p className="text-zinc-400 text-sm py-10 text-center">
            Nenhuma {nomeMeta.toLowerCase()} encontrada.
            {isGestor && " Clique em \"Nova Meta\" para criar."}
          </p>
        )}

        {Object.entries(porEquipe).map(([chave, metasGrupo]) => (
          <div key={chave} className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
              {nomeGrupo(chave)}
              <span className="ml-2 normal-case font-normal opacity-60">
                ({metasGrupo.length})
              </span>
            </p>
            {metasGrupo.map((m) => (
              <CardMeta
                key={m.id}
                meta={m}
                tenantId={tenantId}
                isGestor={isGestor}
                corPrimaria={corPrimaria}
                nomeMeta={nomeMeta}
                onToggleStatus={onToggleStatus}
                onAbrirEditar={(meta) => setModalMeta(meta)}
                onAtualizarVinculo={onAtualizarVinculo}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}