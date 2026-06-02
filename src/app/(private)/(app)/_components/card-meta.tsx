"use client";

import { motion } from "framer-motion";

interface MetaAtual {
  titulo: string;
  status: "EM_ANDAMENTO" | "CONCLUIDA";
  percentual: number;
}

interface CardMetaProps {
  metaAtual: MetaAtual | null;
  sorteiosPendentes: { id: string }[];
  saldoGiros: number;
  totalMetasBatidas: number;
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
  totalMetasBatidas,
  nomeMoeda,
  nomeMeta,
  corPrimaria,
  corSecundaria,
  onRevelar,
}: CardMetaProps) {
  const temGiro = sorteiosPendentes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border h-full flex flex-col"
      style={{
        borderColor: hexToRgba(corPrimaria, 0.2),
        background: `linear-gradient(145deg, ${hexToRgba(corPrimaria, 0.07)} 0%, ${hexToRgba(corSecundaria, 0.03)} 100%)`,
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 90% 10%, ${hexToRgba(corPrimaria, 0.1)}, transparent 60%)`,
        }}
      />

      <div className="relative flex flex-col h-full p-6 gap-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className="text-[10px] uppercase tracking-widest font-semibold mb-1"
              style={{ color: hexToRgba(corPrimaria, 0.7) }}
            >
              {nomeMeta}s
            </p>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">
              {temGiro
                ? `Você tem ${saldoGiros} giro${saldoGiros > 1 ? "s" : ""} disponível${saldoGiros > 1 ? "is" : ""}!`
                : totalMetasBatidas > 0
                  ? `${totalMetasBatidas} ${nomeMeta.toLowerCase()}${totalMetasBatidas > 1 ? "s" : ""} batida${totalMetasBatidas > 1 ? "s" : ""}!`
                  : `Nenhuma ${nomeMeta.toLowerCase()} concluída ainda`}
            </h2>
          </div>

          {/* Indicador de giros */}
          <div className="shrink-0 relative flex items-center justify-center">
            <svg className="absolute animate-spin-slow" width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="32" fill="none" stroke={corPrimaria}
                strokeWidth="1.5" strokeDasharray="10 7" opacity="0.3" />
            </svg>
            <svg className="absolute animate-spin-reverse" width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke={corSecundaria}
                strokeWidth="1" strokeDasharray="6 8" opacity="0.35" />
            </svg>
            <div
              className="w-12 h-12 rounded-full flex flex-col items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${hexToRgba(corPrimaria, 0.15)}, ${hexToRgba(corPrimaria, 0.04)})`,
                border: `1px solid ${hexToRgba(corPrimaria, 0.25)}`,
                boxShadow: `0 0 20px ${hexToRgba(corPrimaria, 0.2)}`,
              }}
            >
              <motion.span
                key={saldoGiros}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-xl font-black leading-none"
                style={{ color: corPrimaria }}
              >
                {saldoGiros}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Status da meta atual */}
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: hexToRgba(corPrimaria, 0.06),
            border: `1px solid ${hexToRgba(corPrimaria, 0.12)}`,
          }}
        >
          <span className="text-2xl shrink-0">
            {temGiro ? "🎰" : metaAtual?.status === "CONCLUIDA" ? "✅" : "🎯"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
              {metaAtual
                ? metaAtual.titulo
                : `Aguardando ${nomeMeta.toLowerCase()}...`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: hexToRgba(corPrimaria, 0.8) }}>
              {temGiro
                ? "Meta batida — pronto para girar!"
                : metaAtual?.status === "CONCLUIDA"
                  ? "Aguardando aprovação do gestor"
                  : metaAtual
                    ? `${metaAtual.percentual}% concluída`
                    : "Nenhuma meta ativa no momento"}
            </p>
          </div>
        </div>

        {/* Totais */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3 flex flex-col gap-0.5"
            style={{ background: hexToRgba(corPrimaria, 0.05), border: `1px solid ${hexToRgba(corPrimaria, 0.1)}` }}
          >
            <span className="text-[10px] uppercase tracking-widest text-zinc-400">Total batidas</span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{totalMetasBatidas}</span>
          </div>
          <div
            className="rounded-xl p-3 flex flex-col gap-0.5"
            style={{ background: hexToRgba(corPrimaria, 0.05), border: `1px solid ${hexToRgba(corPrimaria, 0.1)}` }}
          >
            <span className="text-[10px] uppercase tracking-widest text-zinc-400">Giros disponíveis</span>
            <span className="text-2xl font-bold" style={{ color: corPrimaria }}>{saldoGiros}</span>
          </div>
        </div>

        {/* Botão — empurra pro fundo */}
        <div className="mt-auto">
          {temGiro ? (
            <button
              onClick={onRevelar}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})`,
                boxShadow: `0 6px 20px ${hexToRgba(corPrimaria, 0.3)}`,
              }}
            >
              🎰 Resgatar {nomeMoeda}
            </button>
          ) : (
            <div
              className="w-full py-3 rounded-xl text-sm text-center"
              style={{ color: hexToRgba(corPrimaria, 0.5), background: hexToRgba(corPrimaria, 0.04) }}
            >
              Bata uma {nomeMeta.toLowerCase()} para ganhar giros
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}