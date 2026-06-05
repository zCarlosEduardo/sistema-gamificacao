"use client";

interface MultiSelectProps {
  label: string;
  opcoes: { id: string; nome: string }[];
  selecionados: string[];
  onChange: (ids: string[]) => void;
  cor: string;
}

/**
 * Seletor múltiplo em chips clicáveis.
 *
 * @example
 * <MultiSelect
 *   label="Equipes"
 *   opcoes={equipes}
 *   selecionados={equipeIds}
 *   onChange={setEquipeIds}
 *   cor={corAtual}
 * />
 */
export function MultiSelect({ label, opcoes, selecionados, onChange, cor }: MultiSelectProps) {
  function toggle(id: string) {
    onChange(
      selecionados.includes(id)
        ? selecionados.filter((s) => s !== id)
        : [...selecionados, id],
    );
  }

  return (
    <div>
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((op) => {
          const sel = selecionados.includes(op.id);
          return (
            <button
              key={op.id}
              type="button"
              onClick={() => toggle(op.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                sel
                  ? "text-white border-transparent"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 hover:border-zinc-400"
              }`}
              style={sel ? { background: cor, borderColor: cor } : {}}
            >
              {op.nome}
            </button>
          );
        })}
      </div>
    </div>
  );
}