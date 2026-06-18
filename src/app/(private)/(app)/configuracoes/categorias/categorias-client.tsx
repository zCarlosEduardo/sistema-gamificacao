/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Tag,
  Users,
  Pencil,
  Trash2,
  CircleCheck,
} from "lucide-react";
import {
  Modal,
  ModalConfirmar,
  PageHeader,
  StatCard,
  SectionTitle,
  StatusBadge,
  Campo,
  BotoesModal,
  inputCls,
} from "@/components";
import { useTenant } from "@/contexts/tenant-context";

interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: "PRODUTO" | "EQUIPE";
  ativo: boolean;
  criadoEm: string;
}

interface Props {
  tenantId: string;
  categorias: Categoria[];
}

// ── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  cor,
}: {
  checked: boolean;
  onChange: () => void;
  cor: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center gap-2 group"
    >
      <span
        className="relative inline-flex w-8 h-[18px] rounded-full transition-colors duration-200 shrink-0"
        style={{ background: checked ? cor : undefined }}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all duration-200 ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
        {!checked && (
          <span className="absolute inset-0 rounded-full border border-zinc-300 dark:border-zinc-600" />
        )}
      </span>
    </button>
  );
}

export default function CategoriasClient({
  tenantId,
  categorias: inicial,
}: Props) {
  const { tenant } = useTenant();
  const corAtual = tenant?.corPrimaria ?? "#7C3AED";
  const nomeEquipe = tenant?.nomeEquipe ?? "Equipe";
  const nomeLoja = tenant?.nomeLoja ?? "Loja";

  const [categorias, setCategorias] = useState(inicial);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  const [modalCriar, setModalCriar] = useState(false);
  const [criarNome, setCriarNome] = useState("");
  const [criarDescricao, setCriarDescricao] = useState("");
  const [criarTipo, setCriarTipo] = useState<"PRODUTO" | "EQUIPE">("PRODUTO");
  const [erroCriar, setErroCriar] = useState("");

  const [editando, setEditando] = useState<Categoria | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [erroEditar, setErroEditar] = useState("");

  const [deletando, setDeletando] = useState<Categoria | null>(null);

  const categoriasProduto = categorias.filter((c) => c.tipo === "PRODUTO");
  const categoriasEquipe = categorias.filter((c) => c.tipo === "EQUIPE");
  const totalAtivas = categorias.filter((c) => c.ativo).length;

  function resetCriar() {
    setCriarNome("");
    setCriarDescricao("");
    setCriarTipo("PRODUTO");
    setErroCriar("");
  }

  function abrirEditar(c: Categoria) {
    setEditando(c);
    setEditNome(c.nome);
    setEditDescricao(c.descricao ?? "");
    setErroEditar("");
  }

  function handleCriar() {
    if (!criarNome.trim()) {
      setErroCriar("Nome obrigatório");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categorias`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-tenant-id": tenantId,
            },
            credentials: "include",
            body: JSON.stringify({
              nome: criarNome,
              descricao: criarDescricao || null,
              tipo: criarTipo,
            }),
          },
        );
        if (!res.ok) throw new Error();
        const nova = await res.json();
        setCategorias((prev) => [...prev, nova]);
        setModalCriar(false);
        resetCriar();
      } catch {
        setErroCriar("Erro ao criar categoria");
      }
    });
  }

  function handleEditar() {
    if (!editando || !editNome.trim()) return;
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categorias/${editando.id}`,
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
            }),
          },
        );
        if (!res.ok) throw new Error();
        const atualizada = await res.json();
        setCategorias((prev) =>
          prev.map((c) => (c.id === editando.id ? atualizada : c)),
        );
        setEditando(null);
      } catch {
        setErroEditar("Erro ao atualizar categoria");
      }
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categorias/${id}/toggle`,
          {
            method: "PATCH",
            headers: { "x-tenant-id": tenantId },
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error();
        const atualizada = await res.json();
        setCategorias((prev) =>
          prev.map((c) => (c.id === id ? atualizada : c)),
        );
      } catch {
        setErro("Erro ao alterar status");
      }
    });
  }

  function handleDeletar() {
    if (!deletando) return;
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categorias/${deletando.id}`,
          {
            method: "DELETE",
            headers: { "x-tenant-id": tenantId },
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error();
        setCategorias((prev) => prev.filter((c) => c.id !== deletando.id));
        setDeletando(null);
      } catch {
        setErro("Erro ao excluir categoria");
        setDeletando(null);
      }
    });
  }

  function CategoriaLista({
    lista,
    tipo,
  }: {
    lista: Categoria[];
    tipo: "PRODUTO" | "EQUIPE";
  }) {
    const Icon = tipo === "PRODUTO" ? Tag : Users;
    const label = tipo === "PRODUTO" ? nomeLoja : nomeEquipe;

    if (lista.length === 0) {
      return (
        <div className="bg-zinc-50 dark:bg-zinc-800 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl px-6 py-10 flex flex-col items-center gap-3 text-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `color-mix(in srgb, ${corAtual} 15%, transparent)` }}
          >
            <Icon size={18} style={{ color: corAtual }} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nenhuma categoria de {label}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Crie categorias para organizar seus itens
            </p>
          </div>
          <button
            onClick={() => {
              setCriarTipo(tipo);
              resetCriar();
              setModalCriar(true);
            }}
            className="mt-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: corAtual }}
          >
            <Plus size={14} /> Criar categoria
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {lista.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `color-mix(in srgb, ${corAtual} 15%, transparent)` }}
                >
                  <Icon size={15} style={{ color: corAtual }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    {c.nome}
                  </p>
                  {c.descricao && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      {c.descricao}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge ativo={c.ativo} />
                <Toggle
                  checked={c.ativo}
                  onChange={() => handleToggle(c.id)}
                  cor={corAtual}
                />
                <button
                  onClick={() => abrirEditar(c)}
                  aria-label="Editar categoria"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeletando(c)}
                  aria-label="Excluir categoria"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      {/* Modal Criar */}
      <AnimatePresence>
        {modalCriar && (
          <Modal
            titulo="Nova Categoria"
            subtitulo="Crie uma categoria para produtos ou equipes"
            onClose={() => {
              setModalCriar(false);
              resetCriar();
            }}
          >
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                {(["PRODUTO", "EQUIPE"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCriarTipo(t)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      criarTipo === t
                        ? "text-white border-transparent"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                    }`}
                    style={criarTipo === t ? { background: corAtual } : {}}
                  >
                    {t === "PRODUTO" ? <Tag size={14} /> : <Users size={14} />}
                    {t === "PRODUTO" ? nomeLoja : nomeEquipe}
                  </button>
                ))}
              </div>
              <Campo label="Nome">
                <input
                  type="text"
                  value={criarNome}
                  onChange={(e) => setCriarNome(e.target.value)}
                  placeholder="Ex: Vale Alimentação"
                  className={inputCls}
                />
              </Campo>
              <Campo label="Descrição">
                <input
                  type="text"
                  value={criarDescricao}
                  onChange={(e) => setCriarDescricao(e.target.value)}
                  placeholder="Opcional"
                  className={inputCls}
                />
              </Campo>
              {erroCriar && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                  {erroCriar}
                </p>
              )}
              <BotoesModal
                onCancelar={() => {
                  setModalCriar(false);
                  resetCriar();
                }}
                onConfirmar={handleCriar}
                isPending={isPending}
                labelConfirmar="Criar categoria"
                disabled={!criarNome.trim()}
                cor={corAtual}
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal Editar */}
      <AnimatePresence>
        {editando && (
          <Modal
            titulo={`Editar — ${editando.nome}`}
            subtitulo={editando.tipo === "PRODUTO" ? nomeLoja : nomeEquipe}
            onClose={() => setEditando(null)}
          >
            <div className="flex flex-col gap-5">
              <Campo label="Nome">
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className={inputCls}
                />
              </Campo>
              <Campo label="Descrição">
                <input
                  type="text"
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                  placeholder="Opcional"
                  className={inputCls}
                />
              </Campo>
              {erroEditar && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                  {erroEditar}
                </p>
              )}
              <BotoesModal
                onCancelar={() => setEditando(null)}
                onConfirmar={handleEditar}
                isPending={isPending}
                labelConfirmar="Salvar"
                disabled={!editNome.trim()}
                cor={corAtual}
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal Deletar */}
      <AnimatePresence>
        {deletando && (
          <ModalConfirmar
            titulo="Excluir categoria"
            descricao={
              <>
                Tem certeza que deseja excluir{" "}
                <span className="font-medium text-zinc-900 dark:text-white">
                  {deletando.nome}
                </span>
                ? Produtos vinculados perderão esta categoria.
              </>
            }
            onConfirmar={handleDeletar}
            onCancelar={() => setDeletando(null)}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      <div className="max-w-full">
        <PageHeader
          titulo="Categorias"
          descricao="Organize seus produtos e equipes em categorias"
          action={
            <button
              onClick={() => {
                resetCriar();
                setModalCriar(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
              style={{ background: corAtual }}
            >
              <Plus size={15} /> Nova categoria
            </button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total" valor={categorias.length} icon={Tag} cor={corAtual} />
          <StatCard label="Ativas" valor={totalAtivas} icon={CircleCheck} cor="#10b981" />
          <StatCard label={`De ${nomeLoja}`} valor={categoriasProduto.length} icon={Tag} cor="#8b5cf6" />
          <StatCard label={`De ${nomeEquipe}`} valor={categoriasEquipe.length} icon={Users} cor="#f59e0b" />
        </div>

        <div className="flex flex-col gap-8">
          <section>
            <SectionTitle titulo={`Categorias de ${nomeLoja}`} cor={corAtual} />
            <CategoriaLista lista={categoriasProduto} tipo="PRODUTO" />
          </section>
          <section>
            <SectionTitle titulo={`Categorias de ${nomeEquipe}`} cor={corAtual} />
            <CategoriaLista lista={categoriasEquipe} tipo="EQUIPE" />
          </section>
        </div>

        {erro && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg mt-4">
            {erro}
          </p>
        )}
      </div>
    </>
  );
}