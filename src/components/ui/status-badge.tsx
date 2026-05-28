"use client";

interface StatusBadgeProps {
  ativo: boolean;
  labelAtivo?: string;
  labelInativo?: string;
}

/**
 * Badge de status ativo/inativo com bolinha colorida.
 *
 * @example
 * <StatusBadge ativo={membro.ativo} />
 */
export function StatusBadge({
  ativo,
  labelAtivo = "Ativo",
  labelInativo = "Inativo",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        ativo
          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${ativo ? "bg-emerald-500" : "bg-zinc-400"}`} />
      {ativo ? labelAtivo : labelInativo}
    </span>
  );
}