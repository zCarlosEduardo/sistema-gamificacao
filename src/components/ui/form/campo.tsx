"use client";

// ── inputCls ────────────────────────────────────────────────────
// Classe base para inputs — importe onde precisar
export const inputCls =
  "w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors placeholder-zinc-400 dark:placeholder-zinc-600";

export const inputDisabledCls =
  "w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed opacity-60";

// ── Campo ───────────────────────────────────────────────────────

interface CampoProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

/**
 * Wrapper de campo de formulário com label, asterisco opcional e hint.
 *
 * @example
 * <Campo label="Nome completo" required>
 *   <input type="text" className={inputCls} />
 * </Campo>
 *
 * <Campo label="CPF" hint="Usado para identificação única no sistema">
 *   <input type="text" className={inputCls} />
 * </Campo>
 */
export function Campo({ label, required, hint, children }: CampoProps) {
  return (
    <div>
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">{hint}</p>}
    </div>
  );
}

// ── ErroInline ──────────────────────────────────────────────────

/**
 * Mensagem de erro inline com fundo suave.
 *
 * @example
 * <ErroInline mensagem={erro} />
 */
export function ErroInline({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  return (
    <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
      {mensagem}
    </p>
  );
}

// ── BotoesModal ─────────────────────────────────────────────────

interface BotoesModalProps {
  onCancelar: () => void;
  onConfirmar: () => void;
  isPending?: boolean;
  disabled?: boolean;
  labelCancelar?: string;
  labelConfirmar?: string;
  labelPending?: string;
  cor: string;
}

/**
 * Par de botões Cancelar + Confirmar padrão de modal.
 *
 * @example
 * <BotoesModal
 *   onCancelar={() => setOpen(false)}
 *   onConfirmar={handleSalvar}
 *   isPending={isPending}
 *   cor={corAtual}
 *   labelConfirmar="Criar usuário"
 * />
 */
export function BotoesModal({
  onCancelar,
  onConfirmar,
  isPending,
  disabled,
  labelCancelar = "Cancelar",
  labelConfirmar = "Salvar",
  labelPending = "Salvando...",
  cor,
}: BotoesModalProps) {
  return (
    <div className="flex gap-3 pt-1">
      <button
        type="button"
        onClick={onCancelar}
        className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        {labelCancelar}
      </button>
      <button
        type="button"
        onClick={onConfirmar}
        disabled={isPending || disabled}
        className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
        style={{ background: cor }}
      >
        {isPending ? labelPending : labelConfirmar}
      </button>
    </div>
  );
}