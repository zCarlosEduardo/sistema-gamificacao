"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export interface MesSelecionado {
  mes: number;   // 0–11
  ano: number;
}

interface FiltroMesProps {
  valor: MesSelecionado;
  onChange: (novo: MesSelecionado) => void;
  /** Mês mais antigo permitido (padrão: 6 meses atrás) */
  limitePassado?: number;
  corPrimaria?: string;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

function hexToRgba(hex: string, alpha: number) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function FiltroMes({
  valor,
  onChange,
  limitePassado = 6,
  corPrimaria = "#7C3AED",
}: FiltroMesProps) {
  const hoje = new Date();
  const mesAtual = { mes: hoje.getMonth(), ano: hoje.getFullYear() };

  // Calcula o limite mais antigo permitido
  const limiteData = new Date(hoje.getFullYear(), hoje.getMonth() - limitePassado, 1);

  const isAtual =
    valor.mes === mesAtual.mes && valor.ano === mesAtual.ano;

  const isLimite =
    valor.ano < limiteData.getFullYear() ||
    (valor.ano === limiteData.getFullYear() && valor.mes <= limiteData.getMonth());

  function irParaAnterior() {
    if (isLimite) return;
    if (valor.mes === 0) {
      onChange({ mes: 11, ano: valor.ano - 1 });
    } else {
      onChange({ mes: valor.mes - 1, ano: valor.ano });
    }
  }

  function irParaProximo() {
    if (isAtual) return;
    if (valor.mes === 11) {
      onChange({ mes: 0, ano: valor.ano + 1 });
    } else {
      onChange({ mes: valor.mes + 1, ano: valor.ano });
    }
  }

  function irParaAtual() {
    onChange(mesAtual);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Botão mês anterior */}
      <button
        onClick={irParaAnterior}
        disabled={isLimite}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Display do mês */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg border text-sm font-medium min-w-[160px] justify-center"
        style={{
          borderColor: hexToRgba(corPrimaria, 0.25),
          background: hexToRgba(corPrimaria, 0.05),
          color: corPrimaria,
        }}
      >
        <Calendar size={13} />
        <span>
          {MESES[valor.mes]} {valor.ano}
        </span>
      </div>

      {/* Botão próximo mês */}
      <button
        onClick={irParaProximo}
        disabled={isAtual}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} />
      </button>

      {/* Botão voltar para hoje */}
      {!isAtual && (
        <button
          onClick={irParaAtual}
          className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Mês atual
        </button>
      )}
    </div>
  );
}