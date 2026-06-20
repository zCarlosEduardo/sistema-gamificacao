import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-(--color-border) bg-(--color-bg-subtle) p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold font-[family-name:var(--font-geist) mt-1">
            {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
          </p>
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-lg bg-(--color-primary)/10 flex items-center justify-center text-(--color-primary-light)">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <p className={cn("text-xs mt-2", trend.value >= 0 ? "text-emerald-400" : "text-red-400")}>
          {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}