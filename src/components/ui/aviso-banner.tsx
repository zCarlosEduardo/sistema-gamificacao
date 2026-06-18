"use client";

import { CheckCircle, Lock } from "lucide-react";
import type { AvisoBannerProps } from "@/types";

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function AvisoBanner({
  resgateAtivo,
  nomePeriodo,
  corPrimaria,
}: AvisoBannerProps) {
  const texto = resgateAtivo
    ? `Resgate liberado${nomePeriodo ? ` — ${nomePeriodo}` : ""}! Aproveite para trocar seus pontos pelos produtos disponíveis.`
    : "Resgates bloqueados no momento. O período de troca ainda não foi liberado pelo sistema.";

  return (
    <div
      className="flex items-center gap-6 px-4 py-6 text-base rounded-xl"
      style={{
        backgroundColor: hexToRgba(corPrimaria, 0.08),
        border: `1.5px solid ${hexToRgba(corPrimaria, 0.25)}`,
      }}
    >
      <span className="shrink-0" style={{ color: corPrimaria }}>
        {resgateAtivo ? <CheckCircle size={20} /> : <Lock size={20} />}
      </span>
      <span style={{ color: corPrimaria }}>{texto}</span>
    </div>
  );
}
