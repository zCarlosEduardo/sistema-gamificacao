"use client";

import { motion } from "framer-motion";

interface MetaAtual {
  titulo: string;
  descricao?: string;
  valorAlvo: number;
  progresso: number;
  unidade?: string;
  status: "EM_ANDAMENTO" | "CONCLUIDA";
  dataFim?: string;
  percentual: number;
}

interface CardMetaProps {
  metaAtual: MetaAtual | null;
  sorteiosPendentes: { id: string }[];
  saldoGiros: number;
  nomeMoeda: string;
  nomeMeta: string;
  corPrimaria: string;
  corSecundaria: string;
  onRevelar?: () => void;
}

function hexToRgba(hex: string, alpha: number) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const int = parseInt(hex, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

export function CardMeta({
  metaAtual,
  sorteiosPendentes,
  saldoGiros,
  nomeMoeda,
  nomeMeta,
  corPrimaria,
  corSecundaria,
  onRevelar,
}: CardMetaProps) {
  const metaConcluida = metaAtual?.status === "CONCLUIDA";
  const temGiro = sorteiosPendentes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
      style={{
        borderColor: hexToRgba(corPrimaria, 0.2),
        background: `linear-gradient(135deg, ${hexToRgba(corPrimaria, 0.08)} 0%, ${hexToRgba(corSecundaria, 0.04)} 100%)`,
      }}
    >
      {/* Glow radial de fundo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 85% 50%, ${hexToRgba(corPrimaria, 0.12)}, transparent 65%)`,
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        {/* ── Lado esquerdo: info da meta ── */}
        <div className="flex-1 min-w-0">

          {/* Badge status */}
          {metaConcluida ? (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-4"
              style={{
                background: hexToRgba("#f59e0b", 0.1),
                borderColor: hexToRgba("#f59e0b", 0.3),
                color: "#f59e0b",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Recompensa pendente
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border mb-4"
              style={{
                borderColor: hexToRgba(corPrimaria, 0.25),
                color: hexToRgba(corPrimaria, 0.9),
                background: hexToRgba(corPrimaria, 0.08),
              }}
            >
              {nomeMeta} em andamento
            </span>
          )}

          {/* Título */}
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
            {metaAtual
              ? metaConcluida
                ? `${nomeMeta} Alcançada! 🎉`
                : metaAtual.titulo
              : `Nenhuma ${nomeMeta} ativa`}
          </h2>

          {/* Descrição */}
          {metaAtual && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed max-w-md">
              {metaConcluida
                ? `Você alcançou "${metaAtual.titulo}". Role a roleta e descubra quantos ${nomeMoeda} você ganhou!`
                : (metaAtual.descricao ?? `${metaAtual.progresso} de ${metaAtual.valorAlvo} ${metaAtual.unidade ?? ""}`)}
            </p>
          )}

          {/* Barra de progresso */}
          {metaAtual && !metaConcluida && (
            <div className="mb-6 max-w-sm">
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span>{metaAtual.progresso} {metaAtual.unidade}</span>
                <span className="font-semibold" style={{ color: corPrimaria }}>{metaAtual.percentual}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metaAtual.percentual}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${corPrimaria}, ${corSecundaria})` }}
                />
              </div>
            </div>
          )}

          {/* Botão revelar */}
          {temGiro && (
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={onRevelar}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})`,
                  boxShadow: `0 8px 24px ${hexToRgba(corPrimaria, 0.35)}`,
                }}
              >
                <span className="text-base">🎰</span>
                Revelar {nomeMoeda}
              </button>
              <span className="text-xs text-zinc-400">
                {sorteiosPendentes.length} sorteio{sorteiosPendentes.length > 1 ? "s" : ""} disponível
              </span>
            </div>
          )}
        </div>

        {/* ── Lado direito: giros disponíveis ── */}
        <div className="shrink-0 flex flex-col items-center justify-center self-center">
          <div className="relative flex items-center justify-center">

            {/* Anel externo girando lento */}
            <svg
              className="absolute animate-spin-slow"
              width="160" height="160"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80" cy="80" r="72"
                fill="none"
                stroke={corPrimaria}
                strokeWidth="1.5"
                strokeDasharray="12 8"
                opacity="0.3"
              />
            </svg>

            {/* Anel interno girando ao contrário */}
            <svg
              className="absolute animate-spin-reverse"
              width="130" height="130"
              viewBox="0 0 130 130"
            >
              <circle
                cx="65" cy="65" r="58"
                fill="none"
                stroke={corSecundaria}
                strokeWidth="1"
                strokeDasharray="6 10"
                opacity="0.4"
              />
            </svg>

            {/* Círculo central com glow */}
            <div
              className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${hexToRgba(corPrimaria, 0.15)}, ${hexToRgba(corPrimaria, 0.04)})`,
                border: `1px solid ${hexToRgba(corPrimaria, 0.25)}`,
                boxShadow: `0 0 32px ${hexToRgba(corPrimaria, 0.2)}, inset 0 0 16px ${hexToRgba(corPrimaria, 0.08)}`,
              }}
            >
              <motion.span
                key={saldoGiros}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-5xl font-black leading-none"
                style={{ color: corPrimaria }}
              >
                {saldoGiros}
              </motion.span>
              <span className="text-[10px] uppercase tracking-widest mt-1" style={{ color: hexToRgba(corPrimaria, 0.7) }}>
                giros
              </span>
            </div>
          </div>

          {/* Label embaixo */}
          <p className="text-xs text-zinc-400 mt-4 text-center max-w-[120px] leading-relaxed">
            {saldoGiros > 0
              ? `${nomeMoeda} te esperando`
              : `Bata uma ${nomeMeta} para ganhar giros`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}