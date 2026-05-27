"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/contexts/tenant-context";
import { useRouter } from "next/navigation";
import {
  Plus,
  Shield,
  ShieldCheck,
  Users,
  Pencil,
  Trash2,
  Lock,
  LayoutDashboard,
  Target,
  ShoppingCart,
  PackageCheck,
  UserCog,
  Settings2,
  Paintbrush,
  UserCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

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

interface GruposPermissaoClientProps {
  tenantId: string;
  grupos: GrupoPermissao[];
}

// ---------------------------------------------------------------------------
// Mapa de ícones/labels por recurso
// ---------------------------------------------------------------------------

const ICONE_POR_RECURSO: Record<string, React.ElementType> = {
  dashboard:      LayoutDashboard,
  metas:          Target,
  loja:           ShoppingCart,
  resgates:       PackageCheck,
  meus_resgates:  PackageCheck,
  equipes:        Users,
  usuarios:       UserCog,
  pools:          Settings2,
  personalizacao: Paintbrush,
  perfil:         UserCircle,
};

const LABEL_POR_RECURSO: Record<string, string> = {
  dashboard:      "Dashboard",
  metas:          "Metas",
  loja:           "Loja",
  resgates:       "Resgates",
  meus_resgates:  "Resgates",
  equipes:        "Equipes",
  usuarios:       "Usuários",
  pools:          "Pools",
  personalizacao: "Personalização",
  perfil:         "Perfil",
};

function getRecursosUnicos(permissoes: GrupoPermissaoItem[]) {
  const vistos = new Set<string>();
  return permissoes
    .map((p) => p.chave.split(".")[0])
    .filter((r) => { if (vistos.has(r)) return false; vistos.add(r); return true; });
}

// ---------------------------------------------------------------------------
// Modal de confirmação de delete
// ---------------------------------------------------------------------------

function ModalConfirmarDelete({
  grupo, corAtual, onConfirmar, onCancelar, isPending,
}: {
  grupo: GrupoPermissao;
  corAtual: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  isPending: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Excluir grupo</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Esta ação não pode ser desfeita</p>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">
          Tem certeza que deseja excluir o grupo{" "}
          <span className="font-medium text-zinc-900 dark:text-white">{grupo.nome}</span>?{" "}
          {(grupo._count?.membros ?? 0) > 0 && (
            <span className="text-red-500">
              {grupo._count.membros} usuário{grupo._count.membros > 1 ? "s" : ""} perderão este grupo.
            </span>
          )}
        </p>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400
              hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <motion.button
            onClick={onConfirmar}
            disabled={isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500
              hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Card individual de grupo
// ---------------------------------------------------------------------------

function GrupoCard({
  grupo, corAtual, onEditar, onDeletar,
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
      className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800
        rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-300 dark:hover:border-zinc-700
        transition-colors"
    >
      {/* Topo */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${corAtual}18` }}
          >
            {grupo.nativo
              ? <ShieldCheck size={17} style={{ color: corAtual }} />
              : <Shield size={17} style={{ color: corAtual }} />
            }
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                {grupo.nome}
              </p>
              {grupo.nativo && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded
                  text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800
                  text-zinc-500 dark:text-zinc-400">
                  <Lock size={9} />
                  nativo
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
            title={grupo.nativo ? "Visualizar" : "Editar"}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400
              hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100
              dark:hover:bg-zinc-800 transition-colors"
          >
            <Pencil size={14} />
          </button>
          {!grupo.nativo && (
            <button
              type="button"
              onClick={onDeletar}
              title="Excluir"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400
                hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Usuários", value: grupo._count?.membros ?? 0, icon: Users },
          { label: "Permissões", value: grupo.permissoes.length, icon: Shield },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-zinc-950 border border-zinc-200
                dark:border-zinc-800 rounded-lg px-3 py-2.5"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{s.label}</p>
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

      {/* Badges de recursos */}
      {recursos.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {badgesVisiveis.map((recurso) => {
            const Icon = ICONE_POR_RECURSO[recurso] ?? Shield;
            return (
              <span
                key={recurso}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px]
                  font-medium bg-white dark:bg-zinc-950 border border-zinc-200
                  dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                <Icon size={10} />
                {LABEL_POR_RECURSO[recurso] ?? recurso}
              </span>
            );
          })}
          {extras > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px]
              font-medium bg-white dark:bg-zinc-950 border border-zinc-200
              dark:border-zinc-800 text-zinc-400">
              +{extras} mais
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function GruposPermissaoClient({
  tenantId,
  grupos: gruposIniciais,
}: GruposPermissaoClientProps) {
  const router = useRouter();
  const { tenant: tenantCtx } = useTenant();
  const corAtual = tenantCtx?.corPrimaria ?? "#7C3AED";

  const [grupos, setGrupos] = useState(gruposIniciais);
  const [deletando, setDeletando] = useState<GrupoPermissao | null>(null);
  const [erro, setErro] = useState("");
  const [isPending, startTransition] = useTransition();

  const gruposNativos = grupos.filter((g) => g.nativo);
  const gruposCustom = grupos.filter((g) => !g.nativo);
  const totalUsuarios = grupos.reduce((a, g) => a + (g._count?.membros ?? 0), 0);

  function handleDeletar() {
    if (!deletando) return;
    startTransition(async () => {
      setErro("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/grupos/${deletando.id}`,
          {
            method: "DELETE",
            headers: { "x-tenant-id": tenantId },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error();
        setGrupos((prev) => prev.filter((g) => g.id !== deletando.id));
        setDeletando(null);
      } catch {
        setErro("Erro ao excluir. Tente novamente.");
        setDeletando(null);
      }
    });
  }

  return (
    <>
      <AnimatePresence>
        {deletando && (
          <ModalConfirmarDelete
            grupo={deletando}
            corAtual={corAtual}
            onConfirmar={handleDeletar}
            onCancelar={() => setDeletando(null)}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              Grupos de Acesso
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Gerencie os grupos e as permissões de cada perfil do sistema
            </p>
          </div>

          <motion.button
            onClick={() => router.push("grupos-permissao/novo")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm
              font-medium text-white flex-shrink-0"
            style={{ background: corAtual }}
          >
            <Plus size={15} />
            Novo grupo
          </motion.button>
        </div>

        <div className="flex flex-col gap-8">

          {/* Visão geral */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: corAtual }} />
              Visão Geral
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total de grupos",     value: grupos.length,         icon: Shield      },
                { label: "Nativos",             value: gruposNativos.length,  icon: ShieldCheck },
                { label: "Customizados",        value: gruposCustom.length,   icon: Settings2   },
                { label: "Usuários vinculados", value: totalUsuarios,         icon: Users       },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200
                      dark:border-zinc-800 rounded-xl px-4 py-3.5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={13} className="text-zinc-400" />
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</p>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{s.value}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Grupos nativos */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: corAtual }} />
              Grupos Nativos
              <span className="text-xs font-normal text-zinc-400 dark:text-zinc-600 ml-1">
                — não podem ser excluídos
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence>
                {gruposNativos.map((grupo) => (
                  <GrupoCard
                    key={grupo.id}
                    grupo={grupo}
                    corAtual={corAtual}
                    onEditar={() => router.push(`grupos-permissao/${grupo.id}`)}
                    onDeletar={() => setDeletando(grupo)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Grupos customizados */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ background: corAtual }} />
              Grupos Customizados
            </h2>

            {gruposCustom.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200
                dark:border-zinc-800 rounded-xl px-6 py-10 flex flex-col items-center
                justify-center gap-3 text-center">
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
                <motion.button
                  onClick={() => router.push("grupos-permissao/novo")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                    font-medium text-white"
                  style={{ background: corAtual }}
                >
                  <Plus size={14} />
                  Criar grupo
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <AnimatePresence>
                  {gruposCustom.map((grupo) => (
                    <GrupoCard
                      key={grupo.id}
                      grupo={grupo}
                      corAtual={corAtual}
                      onEditar={() => router.push(`grupos-permissao/${grupo.id}`)}
                      onDeletar={() => setDeletando(grupo)}
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