"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/contexts/tenant-context";
import {
  Plus,
  Shield,
  ShieldCheck,
  Users,
  Pencil,
  Trash2,
  Lock,
  Target,
  ShoppingCart,
  PackageCheck,
  UserCog,
  Settings2,
  Paintbrush,
  Dices,
} from "lucide-react";
// REMOVE o import de X (lucide) se não usar mais em outro lugar
import {
  Modal,
  ModalConfirmar,
  PageHeader,
  StatCard,
  SectionTitle,
  inputCls,
} from "@/components/ui";

// ── Tipos ──────────────────────────────────────────────────────

export interface GrupoPermissaoItem {
  id: string;
  chave: string;
}

export interface GrupoPermissao {
  id: string;
  nome: string;
  descricao: string | null;
  nativo: boolean;
  ativo: boolean;
  criadoEm: string;
  permissoes: GrupoPermissaoItem[];
  _count: { membros: number };
}

interface Props {
  tenantId: string;
  grupos: GrupoPermissao[];
}

// ── Permissões disponíveis ──────────────────────────────────────

const TODAS_PERMISSOES: { chave: string; label: string; recurso: string }[] = [
  { chave: "metas.ver", label: "Ver", recurso: "Metas" },
  { chave: "metas.criar", label: "Criar", recurso: "Metas" },
  { chave: "metas.editar", label: "Editar", recurso: "Metas" },
  { chave: "metas.deletar", label: "Deletar", recurso: "Metas" },
  { chave: "metas.aprovar", label: "Aprovar", recurso: "Metas" },
  { chave: "mercado.ver", label: "Ver", recurso: "Mercado" },
  { chave: "mercado.criar", label: "Criar", recurso: "Mercado" },
  { chave: "mercado.editar", label: "Editar", recurso: "Mercado" },
  { chave: "mercado.deletar", label: "Deletar", recurso: "Mercado" },
  { chave: "resgates.ver", label: "Ver", recurso: "Resgates" },
  { chave: "resgates.aprovar", label: "Aprovar", recurso: "Resgates" },
  { chave: "equipe.ver", label: "Ver", recurso: "Equipe" },
  { chave: "equipe.gerenciar", label: "Gerenciar", recurso: "Equipe" },
  { chave: "usuarios.ver", label: "Ver", recurso: "Usuários" },
  { chave: "usuarios.criar", label: "Criar", recurso: "Usuários" },
  { chave: "usuarios.editar", label: "Editar", recurso: "Usuários" },
  { chave: "usuarios.deletar", label: "Deletar", recurso: "Usuários" },
  { chave: "pools.ver", label: "Ver", recurso: "Pools" },
  { chave: "pools.configurar", label: "Configurar", recurso: "Pools" },
  { chave: "personalizacao.ver", label: "Ver", recurso: "Personalização" },
  {
    chave: "personalizacao.editar",
    label: "Editar",
    recurso: "Personalização",
  },
  { chave: "roleta.jogar", label: "Jogar", recurso: "Roleta" },
];

const RECURSOS = [...new Set(TODAS_PERMISSOES.map((p) => p.recurso))];

const ICONE_POR_RECURSO: Record<string, React.ElementType> = {
  Metas: Target,
  Mercado: ShoppingCart,
  Resgates: PackageCheck,
  Equipe: Users,
  Usuários: UserCog,
  Pools: Settings2,
  Personalização: Paintbrush,
  Roleta: Dices,
};

// ── Helpers ─────────────────────────────────────────────────────

function getRecursosUnicos(permissoes: GrupoPermissaoItem[]) {
  return [
    ...new Set(
      permissoes.map((p) => {
        const recurso = p.chave.split(".")[0];
        return recurso.charAt(0).toUpperCase() + recurso.slice(1);
      }),
    ),
  ];
}

// ── Seletor de permissões ───────────────────────────────────────

function SeletorPermissoes({
  selecionadas,
  onChange,
  cor,
  readOnly,
}: {
  selecionadas: string[];
  onChange: (chaves: string[]) => void;
  cor: string;
  readOnly?: boolean;
}) {
  function toggleChave(chave: string) {
    if (readOnly) return;
    onChange(
      selecionadas.includes(chave)
        ? selecionadas.filter((c) => c !== chave)
        : [...selecionadas, chave],
    );
  }

  function toggleRecurso(recurso: string) {
    if (readOnly) return;
    const chaves = TODAS_PERMISSOES.filter((p) => p.recurso === recurso).map(
      (p) => p.chave,
    );
    const todasSelecionadas = chaves.every((c) => selecionadas.includes(c));
    if (todasSelecionadas) {
      onChange(selecionadas.filter((c) => !chaves.includes(c)));
    } else {
      onChange([...new Set([...selecionadas, ...chaves])]);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {RECURSOS.map((recurso) => {
        const Icon = ICONE_POR_RECURSO[recurso] ?? Shield;
        const permissoesDoRecurso = TODAS_PERMISSOES.filter(
          (p) => p.recurso === recurso,
        );
        const todasSel = permissoesDoRecurso.every((p) =>
          selecionadas.includes(p.chave),
        );
        const algunsSel = permissoesDoRecurso.some((p) =>
          selecionadas.includes(p.chave),
        );

        return (
          <div
            key={recurso}
            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {recurso}
                </span>
                {algunsSel && !todasSel && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
                    parcial
                  </span>
                )}
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => toggleRecurso(recurso)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors border ${
                    todasSel
                      ? "text-white border-transparent"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"
                  }`}
                  style={todasSel ? { background: cor } : {}}
                >
                  {todasSel ? "Desmarcar tudo" : "Marcar tudo"}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {permissoesDoRecurso.map((p) => {
                const sel = selecionadas.includes(p.chave);
                return (
                  <button
                    key={p.chave}
                    type="button"
                    onClick={() => toggleChave(p.chave)}
                    disabled={readOnly}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      sel
                        ? "text-white border-transparent"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-zinc-400 disabled:cursor-default"
                    }`}
                    style={sel ? { background: cor } : {}}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Card de grupo ───────────────────────────────────────────────

function GrupoCard({
  grupo,
  corAtual,
  onEditar,
  onDeletar,
}: {
  grupo: GrupoPermissao;
  corAtual: string;
  onEditar: () => void;
  onDeletar: () => void;
}) {
  const recursos = getRecursosUnicos(grupo.permissoes);
  const badgesVisiveis = recursos.slice(0, 4);
  const extras = recursos.length - 4;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${corAtual}18` }}
          >
            {grupo.nativo ? (
              <ShieldCheck size={17} style={{ color: corAtual }} />
            ) : (
              <Shield size={17} style={{ color: corAtual }} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                {grupo.nome}
              </p>
              {grupo.nativo && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <Lock size={9} /> nativo
                </span>
              )}
            </div>
            {grupo.descricao && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                {grupo.descricao}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={onEditar}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Pencil size={14} />
          </button>
          {!grupo.nativo && (
            <button
              type="button"
              onClick={onDeletar}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Usuários", value: grupo._count?.membros ?? 0, icon: Users },
          { label: "Permissões", value: grupo.permissoes.length, icon: Shield },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                {s.label}
              </p>
              <div className="flex items-center gap-1.5">
                <Icon size={13} className="text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {s.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {recursos.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {badgesVisiveis.map((recurso) => {
            const Icon = ICONE_POR_RECURSO[recurso] ?? Shield;
            return (
              <span
                key={recurso}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                <Icon size={10} /> {recurso}
              </span>
            );
          })}
          {extras > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
              +{extras} mais
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Componente principal ────────────────────────────────────────

export default function GruposPermissaoClient({
  tenantId,
  grupos: gruposIniciais,
}: Props) {
  const { tenant: tenantCtx } = useTenant();
  const corAtual = tenantCtx?.corPrimaria ?? "#7C3AED";

  const [grupos, setGrupos] = useState(gruposIniciais);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  // Modal criar
  const [modalCriar, setModalCriar] = useState(false);
  const [criarNome, setCriarNome] = useState("");
  const [criarDescricao, setCriarDescricao] = useState("");
  const [criarPermissoes, setCriarPermissoes] = useState<string[]>([]);
  const [erroCriar, setErroCriar] = useState("");

  // Modal editar/visualizar
  const [grupoEditando, setGrupoEditando] = useState<GrupoPermissao | null>(
    null,
  );
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editPermissoes, setEditPermissoes] = useState<string[]>([]);
  const [erroEditar, setErroEditar] = useState("");

  // Modal deletar
  const [grupoDeletando, setGrupoDeletando] = useState<GrupoPermissao | null>(
    null,
  );

  const gruposNativos = grupos.filter((g) => g.nativo);
  const gruposCustom = grupos.filter((g) => !g.nativo);
  const totalUsuarios = grupos.reduce(
    (a, g) => a + (g._count?.membros ?? 0),
    0,
  );

  function abrirEditar(grupo: GrupoPermissao) {
    setGrupoEditando(grupo);
    setEditNome(grupo.nome);
    setEditDescricao(grupo.descricao ?? "");
    setEditPermissoes(grupo.permissoes.map((p) => p.chave));
    setErroEditar("");
  }

  function resetCriar() {
    setCriarNome("");
    setCriarDescricao("");
    setCriarPermissoes([]);
    setErroCriar("");
  }

  function handleCriar() {
    setErroCriar("");
    startTransition(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grupos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": tenantId,
          },
          credentials: "include",
          body: JSON.stringify({
            nome: criarNome,
            descricao: criarDescricao || null,
            permissoes: criarPermissoes,
            tenantId,
          }),
        });
        if (!res.ok) throw new Error("Erro ao criar grupo");
        const novo = await res.json();
        setGrupos((prev) => [...prev, { ...novo, _count: { membros: 0 } }]);
        setModalCriar(false);
        resetCriar();
      } catch (e: unknown) {
        setErroCriar(e instanceof Error ? e.message : "Erro ao criar grupo");
      }
    });
  }

  function handleEditar() {
    if (!grupoEditando) return;
    setErroEditar("");
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/grupos/${grupoEditando.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-tenant-id": tenantId,
            },
            credentials: "include",
            body: JSON.stringify({
              nome: editNome,
              descricao: editDescricao || null,
              permissoes: editPermissoes,
            }),
          },
        );
        if (!res.ok) throw new Error("Erro ao atualizar grupo");
        const atualizado = await res.json();
        setGrupos((prev) =>
          prev.map((g) =>
            g.id === grupoEditando.id ? { ...atualizado, _count: g._count } : g,
          ),
        );
        setGrupoEditando(null);
      } catch (e: unknown) {
        setErroEditar(
          e instanceof Error ? e.message : "Erro ao atualizar grupo",
        );
      }
    });
  }

  function handleDeletar() {
    if (!grupoDeletando) return;
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/grupos/${grupoDeletando.id}`,
          {
            method: "DELETE",
            headers: { "x-tenant-id": tenantId },
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error();
        setGrupos((prev) => prev.filter((g) => g.id !== grupoDeletando.id));
        setGrupoDeletando(null);
      } catch {
        setErro("Erro ao excluir. Tente novamente.");
        setGrupoDeletando(null);
      }
    });
  }

  return (
    <>
      {/* ── Modal Criar ── */}
      <AnimatePresence>
        {modalCriar && (
          <Modal
            titulo="Novo Grupo de Acesso"
            subtitulo="Defina o nome e as permissões do grupo"
            onClose={() => {
              setModalCriar(false);
              resetCriar();
            }}
          >
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={criarNome}
                    onChange={(e) => setCriarNome(e.target.value)}
                    placeholder="Ex: Vendedor, Gestor..."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={criarDescricao}
                    onChange={(e) => setCriarDescricao(e.target.value)}
                    placeholder="Opcional"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-3">
                  Permissões{" "}
                  <span className="text-zinc-400 font-normal normal-case">
                    ({criarPermissoes.length} selecionadas)
                  </span>
                </label>
                <SeletorPermissoes
                  selecionadas={criarPermissoes}
                  onChange={setCriarPermissoes}
                  cor={corAtual}
                />
              </div>

              {erroCriar && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                  {erroCriar}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => {
                    setModalCriar(false);
                    resetCriar();
                  }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCriar}
                  disabled={isPending || !criarNome}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
                  style={{ background: corAtual }}
                >
                  {isPending ? "Criando..." : "Criar grupo"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Modal Editar/Visualizar ── */}
      <AnimatePresence>
        {grupoEditando && (
          <Modal
            titulo={
              grupoEditando.nativo
                ? `Visualizar — ${grupoEditando.nome}`
                : `Editar — ${grupoEditando.nome}`
            }
            subtitulo={
              grupoEditando.nativo
                ? "Grupo nativo — permissões não podem ser alteradas"
                : `${grupoEditando._count?.membros ?? 0} usuário(s) neste grupo`
            }
            onClose={() => setGrupoEditando(null)}
          >
            <div className="flex flex-col gap-5">
              {!grupoEditando.nativo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Nome <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={editDescricao}
                      onChange={(e) => setEditDescricao(e.target.value)}
                      placeholder="Opcional"
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-3">
                  Permissões{" "}
                  <span className="text-zinc-400 font-normal normal-case">
                    ({editPermissoes.length} selecionadas)
                  </span>
                </label>
                <SeletorPermissoes
                  selecionadas={editPermissoes}
                  onChange={setEditPermissoes}
                  cor={corAtual}
                  readOnly={grupoEditando.nativo}
                />
              </div>

              {erroEditar && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                  {erroEditar}
                </p>
              )}

              {!grupoEditando.nativo && (
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setGrupoEditando(null)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEditar}
                    disabled={isPending || !editNome}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
                    style={{ background: corAtual }}
                  >
                    {isPending ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              )}

              {grupoEditando.nativo && (
                <button
                  onClick={() => setGrupoEditando(null)}
                  className="w-full py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Fechar
                </button>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Modal Deletar ── */}
      <AnimatePresence>
        {grupoDeletando && (
          <ModalConfirmar
            titulo="Excluir grupo"
            descricao={
              <>
                Tem certeza que deseja excluir o grupo{" "}
                <span className="font-medium text-zinc-900 dark:text-white">
                  {grupoDeletando.nome}
                </span>
                ?{" "}
                {(grupoDeletando._count?.membros ?? 0) > 0 && (
                  <span className="text-red-500">
                    {grupoDeletando._count.membros} usuário(s) perderão este
                    grupo.
                  </span>
                )}
              </>
            }
            onConfirmar={handleDeletar}
            onCancelar={() => setGrupoDeletando(null)}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* ── Página ── */}
      <div className="max-w-full mx-auto">
        {/* Header */}
        <PageHeader
          titulo="Grupos de Acesso"
          descricao="Gerencie os grupos e as permissões de cada perfil"
          action={
            <button
              onClick={() => {
                resetCriar();
                setModalCriar(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
              style={{ background: corAtual }}
            >
              <Plus size={15} /> Novo grupo
            </button>
          }
        />

        {/* Cards totais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total de grupos", valor: grupos.length, icon: Shield },
            {
              label: "Nativos",
              valor: gruposNativos.length,
              icon: ShieldCheck,
            },
            {
              label: "Customizados",
              valor: gruposCustom.length,
              icon: Settings2,
            },
            { label: "Usuários vinculados", valor: totalUsuarios, icon: Users },
          ].map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              valor={s.valor}
              icon={s.icon}
            />
          ))}
        </div>

        <div className="flex flex-col gap-8">
          {/* Grupos nativos */}
          <section>
            <SectionTitle
              titulo="Grupos Nativos"
              subtitulo="— não podem ser excluídos"
              cor={corAtual}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence>
                {gruposNativos.map((grupo) => (
                  <GrupoCard
                    key={grupo.id}
                    grupo={grupo}
                    corAtual={corAtual}
                    onEditar={() => abrirEditar(grupo)}
                    onDeletar={() => setGrupoDeletando(grupo)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Grupos customizados */}
          <section>
            <SectionTitle titulo="Grupos Customizados" cor={corAtual} />
            {gruposCustom.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl px-6 py-10 flex flex-col items-center justify-center gap-3 text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${corAtual}18` }}
                >
                  <Shield size={18} style={{ color: corAtual }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Nenhum grupo customizado
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">
                    Crie grupos com permissões personalizadas para o seu time
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetCriar();
                    setModalCriar(true);
                  }}
                  className="mt-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: corAtual }}
                >
                  <Plus size={14} /> Criar grupo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <AnimatePresence>
                  {gruposCustom.map((grupo) => (
                    <GrupoCard
                      key={grupo.id}
                      grupo={grupo}
                      corAtual={corAtual}
                      onEditar={() => abrirEditar(grupo)}
                      onDeletar={() => setGrupoDeletando(grupo)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          <AnimatePresence>
            {erro && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-500 pb-4"
              >
                {erro}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
