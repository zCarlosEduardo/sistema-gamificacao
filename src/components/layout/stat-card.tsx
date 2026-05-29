"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  valor: number | string;
  icon: LucideIcon;
}

/**
 * Card de estatística com ícone, número e label.
 *
 * @example
 * <StatCard label="Ativos" valor={29} icon={CheckCircle2} />
 */
export function StatCard({ label, valor, icon: Icon }: StatCardProps) {
  return (
    <div
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm
     hover:-translate-y-2 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <Icon size={18} className="text-zinc-700 dark:text-zinc-300" />
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">
          {valor}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}
