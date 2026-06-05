"use client";

import { Search } from "lucide-react";
import type { CategoriaRef } from "../../types";

interface Props {
  categorias: CategoriaRef[];
  categoriaAtiva: string;
  busca: string;
  onCategoria: (id: string) => void;
  onBusca: (v: string) => void;
}

export function FiltrosCategorias({
  categorias,
  categoriaAtiva,
  busca,
  onCategoria,
  onBusca,
}: Props) {
  const tabs = [{ id: "", nome: "Todos" }, ...categorias];

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onCategoria(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              categoriaAtiva === tab.id
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {tab.nome}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2">
        <Search size={13} className="text-zinc-400 shrink-0" />
        <input
          type="text"
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          placeholder="Buscar produto..."
          className="bg-transparent text-xs text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 outline-none w-36"
        />
      </div>
    </div>
  );
}