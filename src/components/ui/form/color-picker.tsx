"use client";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

/**
 * Seletor de cor com input nativo, campo hex e preview.
 *
 * @example
 * <ColorPicker label="Cor Primária" value={corPrimaria} onChange={setCorPrimaria} />
 */
export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-700 p-0.5 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          placeholder="#7C3AED"
        />
        <div
          className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 shrink-0"
          style={{ background: value }}
        />
      </div>
    </div>
  );
}