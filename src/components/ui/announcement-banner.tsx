"use client";

import { useState } from "react";
import { Info, AlertTriangle, CheckCircle, X, Pin } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Announcement } from "@/types";

const tipoStyles = {
  INFO: {
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: <Info size={16} className="text-blue-400 shrink-0" />,
    text: "text-blue-300",
  },
  ALERTA: {
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: <AlertTriangle size={16} className="text-amber-400 shrink-0" />,
    text: "text-amber-300",
  },
  SUCESSO: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <CheckCircle size={16} className="text-emerald-400 shrink-0" />,
    text: "text-emerald-300",
  },
};

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = announcements.filter((a) => !dismissed.has(a.id));

  if (visible.length === 0) return null;

  function dismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]));
  }

  return (
    <div className="space-y-2 mb-6">
      {visible.map((aviso) => {
        const style = tipoStyles[aviso.tipo] ?? tipoStyles.INFO;

        return (
          <div
            key={aviso.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3 rounded-xl border",
              style.bg,
            )}
          >
            {style.icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={cn("text-sm font-medium", style.text)}>
                  {aviso.titulo}
                </p>
                {aviso.fixado && (
                  <Pin size={12} className="text-(--color-text-muted)" />
                )}
              </div>
              <p className="text-xs text-(--color-text-muted) mt-0.5">
                {aviso.conteudo}
              </p>
            </div>
            {!aviso.fixado && (
              <button
                onClick={() => dismiss(aviso.id)}
                className="p-1 rounded text-(--color-text-muted) hover:text-(--color-text) transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
