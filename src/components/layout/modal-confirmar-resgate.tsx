"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Produto } from "../../types";

interface Props {
  produto: Produto;
  saldoAtual: number;
  nomePontos: string;
  isPending: boolean;
  corAtual: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmarResgate({
  produto,
  saldoAtual,
  nomePontos,
  isPending,
  corAtual,
  onConfirmar,
  onCancelar,
}: Props) {
  const saldoApos = saldoAtual - produto.valorPontos;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4"
      onClick={onCancelar}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2 }}
        className="w-full sm:max-w-sm bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-zinc-900 dark:text-white">
              Confirmar resgate
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Verifique os detalhes antes de confirmar
            </p>
          </div>
          <button
            onClick={onCancelar}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Emoji */}
        <p className="text-center text-5xl py-2">{produto.emoji ?? "🎁"}</p>

        {/* Detalhes */}
        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
          <div className="flex justify-between items-center py-2.5 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Produto</span>
            <span className="font-medium text-zinc-900 dark:text-white">{produto.nome}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Custo</span>
            <span className="font-medium text-zinc-900 dark:text-white">
              {produto.valorPontos.toLocaleString("pt-BR")} {nomePontos}
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Saldo atual</span>
            <span className="font-medium text-zinc-900 dark:text-white">
              {saldoAtual.toLocaleString("pt-BR")} {nomePontos}
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Saldo após</span>
            <span
              className={`font-semibold ${
                saldoApos >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500"
              }`}
            >
              {saldoApos.toLocaleString("pt-BR")} {nomePontos}
            </span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          <button
            onClick={onCancelar}
            className="flex-1 py-2.5 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={isPending}
            className="flex-[2] py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: corAtual }}
          >
            {isPending ? "Confirmando..." : "Confirmar resgate"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}