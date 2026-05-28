"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";

// ── Modal principal ─────────────────────────────────────────────

interface ModalProps {
  titulo: string;
  subtitulo?: string;
  onClose: () => void;
  children: React.ReactNode;
  /** "md" = 672px (padrão) | "sm" = 448px */
  size?: "sm" | "md";
}

export function Modal({ titulo, subtitulo, onClose, children, size = "md" }: ModalProps) {
  const maxW = size === "sm" ? "max-w-md" : "max-w-2xl";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className={`w-full ${maxW} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">{titulo}</h2>
            {subtitulo && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{subtitulo}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors mt-0.5 shrink-0 ml-4"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ── Modal de confirmação destrutiva ─────────────────────────────

interface ModalConfirmarProps {
  titulo: string;
  descricao: React.ReactNode;
  onConfirmar: () => void;
  onCancelar: () => void;
  isPending?: boolean;
  labelConfirmar?: string;
}

export function ModalConfirmar({
  titulo,
  descricao,
  onConfirmar,
  onCancelar,
  isPending,
  labelConfirmar = "Excluir",
}: ModalConfirmarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancelar}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{titulo}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Esta ação não pode ser desfeita</p>
          </div>
        </div>

        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">{descricao}</div>

        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Aguarde..." : labelConfirmar}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Wrapper com AnimatePresence embutido ────────────────────────
// Uso: <ModalWrapper open={...}> <Modal .../> </ModalWrapper>

export function ModalWrapper({ open, children }: { open: boolean; children: React.ReactNode }) {
  return <AnimatePresence>{open && children}</AnimatePresence>;
}