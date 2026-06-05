"use client";

import { Lock, Coins, ArrowRight, Tag } from "lucide-react";
import type { Produto } from "../../types";

interface Props {
  produto: Produto;
  saldo: number;
  resgateAtivo: boolean;
  nomePontos: string;
  corAtual: string;
  onResgatar: (produto: Produto) => void;
}

export function ProdutoCard({
  produto,
  saldo,
  resgateAtivo,
  nomePontos,
  corAtual,
  onResgatar,
}: Props) {
  if (!produto.ativo) return null;

  const semPontos = resgateAtivo && saldo < produto.valorPontos;

  function renderBotao() {
    if (!resgateAtivo) {
      return (
        <button
          disabled
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-700 whitespace-nowrap"
        >
          <Lock size={11} /> Bloqueado
        </button>
      );
    }
    if (semPontos) {
      return (
        <button
          disabled
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 cursor-not-allowed border border-red-200 dark:border-red-800 whitespace-nowrap"
        >
          <Coins size={11} /> Insuficiente
        </button>
      );
    }
    return (
      <button
        onClick={() => onResgatar(produto)}
        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 active:opacity-80 whitespace-nowrap"
        style={{ background: corAtual }}
      >
        <ArrowRight size={11} /> Resgatar
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      {/* Corpo com imagem interna */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {/* Imagem quadrada contida no card */}
        <div className="w-full aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-5xl overflow-hidden">
          {produto.imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{produto.emoji ?? "🎁"}</span>
          )}
        </div>

        {/* Tag de categoria */}
        {produto.categoria && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 w-fit">
            <Tag size={9} />
            {produto.categoria.nome}
          </span>
        )}

        {/* Título */}
        <p className="text-xl font-semibold text-zinc-900 dark:text-white leading-snug">
          {produto.nome}
        </p>

        {/* Descrição */}
        {produto.descricao && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {produto.descricao}
          </p>
        )}
      </div>

      {/* Footer: pontos + botão */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col leading-none">
          <span className="text-md tracking-widest text-zinc-400 dark:text-zinc-500 mb-0.5">
            {nomePontos}
          </span>
          <span className="text-base font-semibold text-amber-700 dark:text-amber-500">
            {produto.valorPontos.toLocaleString("pt-BR")}
          </span>
        </div>
        {renderBotao()}
      </div>
    </div>
  );
}