/* eslint-disable react-hooks/static-components */
"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Package, Pencil, Trash2, Tag, CircleOff, CircleCheck } from "lucide-react";
import {
  Modal,
  ModalConfirmar,
  PageHeader,
  StatCard,
  Campo,
  BotoesModal,
  inputCls,
} from "@/components";
import { useTenant } from "@/contexts/tenant-context";
import type { Produto, CategoriaRef, Props } from "@/types";

const EMOJIS = [
  "🎁", "🍽️", "☕", "🛒", "💳", "🎮", "📱", "👕", "🏆", "⭐", "💰", "🎯",
];

type ProdutoForm = {
  nome: string;
  descricao: string;
  valorPontos: string;
  valorEstimado: string;
  emoji: string;
  imagem: string;
  categoriaId: string;
};

const emptyForm: ProdutoForm = {
  nome: "",
  descricao: "",
  valorPontos: "",
  valorEstimado: "",
  emoji: "🎁",
  imagem: "",
  categoriaId: "",
};

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
        data-unchecked={!checked || undefined}
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
      <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
        {checked ? "Ativo" : "Inativo"}
      </span>
    </button>
  );
}

// ── Thumbnail ────────────────────────────────────────────────────────────────
function Thumbnail({ imagem, emoji, nome }: { imagem?: string | null; emoji?: string | null; nome: string }) {
  if (imagem) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imagem}
        alt={nome}
        className="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shrink-0">
      {emoji ?? "🎁"}
    </div>
  );
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ ativo }: { ativo: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
        ativo
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${ativo ? "bg-emerald-500" : "bg-zinc-400"}`} />
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}

// ── FormProduto ──────────────────────────────────────────────────────────────
function FormProduto({
  values,
  onChange,
  categorias,
  nomePonto,
  corAtual,
}: {
  values: ProdutoForm;
  onChange: (v: ProdutoForm) => void;
  categorias: CategoriaRef[];
  nomePonto: string;
  corAtual: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Campo label="Nome">
          <input
            type="text"
            value={values.nome}
            onChange={(e) => onChange({ ...values, nome: e.target.value })}
            placeholder="Ex: Vale Refeição R$50"
            className={inputCls}
          />
        </Campo>
        <Campo label="Categoria">
          <select
            value={values.categoriaId}
            onChange={(e) => onChange({ ...values, categoriaId: e.target.value })}
            className={inputCls}
          >
            <option value="">Sem categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo label="Descrição">
        <input
          type="text"
          value={values.descricao}
          onChange={(e) => onChange({ ...values, descricao: e.target.value })}
          placeholder="Opcional"
          className={inputCls}
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label={`Valor em ${nomePonto}`}>
          <input
            type="number"
            min={1}
            value={values.valorPontos}
            onChange={(e) => onChange({ ...values, valorPontos: e.target.value })}
            placeholder="500"
            className={inputCls}
          />
        </Campo>
        <Campo label="Valor estimado (R$)">
          <input
            type="number"
            min={0}
            step={0.01}
            value={values.valorEstimado}
            onChange={(e) => onChange({ ...values, valorEstimado: e.target.value })}
            placeholder="50.00"
            className={inputCls}
          />
        </Campo>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Campo label="Emoji">
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => onChange({ ...values, emoji: e })}
                className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                  values.emoji === e
                    ? "border-transparent"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
                style={values.emoji === e ? { background: corAtual } : {}}
              >
                {e}
              </button>
            ))}
          </div>
        </Campo>
        <Campo label="URL da Imagem">
          <input
            type="text"
            value={values.imagem}
            onChange={(e) => onChange({ ...values, imagem: e.target.value })}
            placeholder="https://..."
            className={inputCls}
          />
          {values.imagem && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={values.imagem}
              alt="preview"
              className="mt-2 w-16 h-16 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
            />
          )}
        </Campo>
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function ProdutosClient({
  tenantId,
  produtos: inicial,
  categorias,
}: Props) {
  const { tenant } = useTenant();
  const corAtual = tenant?.corPrimaria ?? "#7C3AED";
  const nomePonto = tenant?.nomePontos ?? "Pontos";
  const nomeLoja = tenant?.nomeLoja ?? "Loja";

  const [produtos, setProdutos] = useState(inicial);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  const [modalCriar, setModalCriar] = useState(false);
  const [form, setForm] = useState<ProdutoForm>(emptyForm);
  const [erroCriar, setErroCriar] = useState("");

  const [editando, setEditando] = useState<Produto | null>(null);
  const [editForm, setEditForm] = useState<ProdutoForm>(emptyForm);
  const [erroEditar, setErroEditar] = useState("");

  const [deletando, setDeletando] = useState<Produto | null>(null);

  const ativos = produtos.filter((p) => p.ativo).length;
  const inativos = produtos.filter((p) => !p.ativo).length;

  function abrirEditar(p: Produto) {
    setEditando(p);
    setEditForm({
      nome: p.nome,
      descricao: p.descricao ?? "",
      valorPontos: String(p.valorPontos),
      valorEstimado: String(p.valorEstimado ?? ""),
      emoji: p.emoji ?? "🎁",
      imagem: p.imagem ?? "",
      categoriaId: p.categoria?.id ?? "",
    });
    setErroEditar("");
  }

  function handleCriar() {
    if (!form.nome.trim() || !form.valorPontos) {
      setErroCriar("Nome e valor em pontos são obrigatórios");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
          credentials: "include",
          body: JSON.stringify({
            nome: form.nome,
            descricao: form.descricao || null,
            valorPontos: Number(form.valorPontos),
            valorEstimado: form.valorEstimado ? Number(form.valorEstimado) : null,
            emoji: form.emoji || null,
            imagem: form.imagem || null,
            categoriaId: form.categoriaId || null,
          }),
        });
        if (!res.ok) throw new Error();
        const novo = await res.json();
        setProdutos((prev) => [novo, ...prev]);
        setModalCriar(false);
        setForm(emptyForm);
        setErroCriar("");
      } catch {
        setErroCriar("Erro ao criar produto");
      }
    });
  }

  function handleEditar() {
    if (!editando || !editForm.nome.trim() || !editForm.valorPontos) return;
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/produtos/${editando.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
            credentials: "include",
            body: JSON.stringify({
              nome: editForm.nome,
              descricao: editForm.descricao || null,
              valorPontos: Number(editForm.valorPontos),
              valorEstimado: editForm.valorEstimado ? Number(editForm.valorEstimado) : null,
              emoji: editForm.emoji || null,
              imagem: editForm.imagem || null,
              categoriaId: editForm.categoriaId || null,
            }),
          },
        );
        if (!res.ok) throw new Error();
        const atualizado = await res.json();
        setProdutos((prev) =>
          prev.map((p) => (p.id === editando.id ? atualizado : p)),
        );
        setEditando(null);
      } catch {
        setErroEditar("Erro ao atualizar produto");
      }
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}/toggle`,
          {
            method: "PATCH",
            headers: { "x-tenant-id": tenantId },
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error();
        const atualizado = await res.json();
        setProdutos((prev) => prev.map((p) => (p.id === id ? atualizado : p)));
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
          `${process.env.NEXT_PUBLIC_API_URL}/produtos/${deletando.id}`,
          {
            method: "DELETE",
            headers: { "x-tenant-id": tenantId },
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error();
        setProdutos((prev) => prev.filter((p) => p.id !== deletando.id));
        setDeletando(null);
      } catch {
        setErro("Erro ao excluir produto");
        setDeletando(null);
      }
    });
  }

  return (
    <>
      {/* ── Modal criar ── */}
      <AnimatePresence>
        {modalCriar && (
          <Modal
            titulo="Novo Produto"
            subtitulo={`Adicione um produto ao ${nomeLoja}`}
            onClose={() => {
              setModalCriar(false);
              setForm(emptyForm);
              setErroCriar("");
            }}
          >
            <div className="flex flex-col gap-5">
              <FormProduto
                values={form}
                onChange={setForm}
                categorias={categorias}
                nomePonto={nomePonto}
                corAtual={corAtual}
              />
              {erroCriar && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                  {erroCriar}
                </p>
              )}
              <BotoesModal
                onCancelar={() => { setModalCriar(false); setForm(emptyForm); }}
                onConfirmar={handleCriar}
                isPending={isPending}
                labelConfirmar="Criar produto"
                disabled={!form.nome.trim() || !form.valorPontos}
                cor={corAtual}
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Modal editar ── */}
      <AnimatePresence>
        {editando && (
          <Modal
            titulo={`Editar — ${editando.nome}`}
            subtitulo="Atualize as informações do produto"
            onClose={() => setEditando(null)}
          >
            <div className="flex flex-col gap-5">
              <FormProduto
                values={editForm}
                onChange={setEditForm}
                categorias={categorias}
                nomePonto={nomePonto}
                corAtual={corAtual}
              />
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
                disabled={!editForm.nome.trim() || !editForm.valorPontos}
                cor={corAtual}
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Modal deletar ── */}
      <AnimatePresence>
        {deletando && (
          <ModalConfirmar
            titulo="Excluir produto"
            descricao={
              <>
                Tem certeza que deseja excluir{" "}
                <span className="font-medium text-zinc-900 dark:text-white">
                  {deletando.nome}
                </span>
                ?
              </>
            }
            onConfirmar={handleDeletar}
            onCancelar={() => setDeletando(null)}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* ── Página ── */}
      <div className="max-w-full">
        <PageHeader
          titulo="Produtos"
          descricao="Gerencie os produtos disponíveis para resgate"
          action={
            <button
              onClick={() => { setForm(emptyForm); setModalCriar(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
              style={{ background: corAtual }}
            >
              <Plus size={15} /> Novo produto
            </button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total" valor={produtos.length} icon={Package} cor={corAtual} />
          <StatCard label="Ativos" valor={ativos} icon={CircleCheck} cor="#10b981" />
          <StatCard label="Inativos" valor={inativos} icon={CircleOff} cor="#a1a1aa" />
          <StatCard label="Categorias" valor={categorias.length} icon={Tag} cor="#8b5cf6" />
        </div>

        {/* Lista vazia */}
        {produtos.length === 0 ? (
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl px-6 py-14 flex flex-col items-center gap-3 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `${corAtual}18` }}
            >
              <Package size={22} style={{ color: corAtual }} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nenhum produto cadastrado
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Adicione produtos para que os usuários possam resgatar
              </p>
            </div>
            <button
              onClick={() => { setForm(emptyForm); setModalCriar(true); }}
              className="mt-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: corAtual }}
            >
              <Plus size={14} /> Criar produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {produtos.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Thumbnail imagem={p.imagem} emoji={p.emoji} nome={p.nome} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight truncate">
                          {p.nome}
                        </p>
                        {p.categoria && (
                          <p className="text-xs text-zinc-400 mt-0.5 truncate">
                            {p.categoria.nome}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge ativo={p.ativo} />
                  </div>

                  {/* Descrição */}
                  {p.descricao && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {p.descricao}
                    </p>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                  {/* Valores */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg px-3 py-2">
                      <p className="text-[11px] text-zinc-400 mb-0.5">{nomePonto}</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {p.valorPontos.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {p.valorEstimado ? (
                      <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg px-3 py-2">
                        <p className="text-[11px] text-zinc-400 mb-0.5">Estimado</p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          R$ {p.valorEstimado.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-0.5">
                    <Toggle
                      checked={p.ativo}
                      onChange={() => handleToggle(p.id)}
                      cor={corAtual}
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => abrirEditar(p)}
                        aria-label="Editar produto"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeletando(p)}
                        aria-label="Excluir produto"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {erro && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg mt-4">
            {erro}
          </p>
        )}
      </div>
    </>
  );
}