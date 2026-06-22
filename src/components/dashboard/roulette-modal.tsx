"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { SpinResult } from "@/types";

interface RouletteModalProps {
  open: boolean;
  onClose: () => void;
  memberId: string;
  nomeGiro: string;
  nomeMoeda: string;
  nomePontos: string;
  onSpinComplete?: (result: SpinResult) => void;
}

// Segmentos da roleta (visual)
const SEGMENTS = [
  { label: "1", value: 1, color: "#374151" },
  { label: "5", value: 5, color: "#7C3AED" },
  { label: "1", value: 1, color: "#374151" },
  { label: "10", value: 10, color: "#A78BFA" },
  { label: "1", value: 1, color: "#374151" },
  { label: "1", value: 1, color: "#1f2937" },
  { label: "25", value: 25, color: "#7C3AED" },
  { label: "1", value: 1, color: "#374151" },
  { label: "50", value: 50, color: "#f59e0b" },
  { label: "1", value: 1, color: "#1f2937" },
  { label: "5", value: 5, color: "#A78BFA" },
  { label: "1", value: 1, color: "#374151" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

export function RouletteModal({
  open,
  onClose,
  memberId,
  nomeGiro,
  nomeMoeda,
  nomePontos,
  onSpinComplete,
}: RouletteModalProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState("");
  const wheelRef = useRef<SVGSVGElement>(null);

  const findSegmentIndex = useCallback((coinsGanhos: number) => {
    // Encontra o segmento que corresponde ao valor ganho
    const matchingIndices = SEGMENTS.map((s, i) =>
      s.value === coinsGanhos ? i : -1,
    ).filter((i) => i !== -1);

    if (matchingIndices.length === 0) {
      // Se não encontrar exato, pega o mais próximo
      let closest = 0;
      let minDiff = Infinity;
      SEGMENTS.forEach((s, i) => {
        const diff = Math.abs(s.value - coinsGanhos);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });
      return closest;
    }

    // Pega um aleatório entre os que batem
    return matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
  }, []);

  async function handleSpin() {
    setSpinning(true);
    setResult(null);
    setError("");

    try {
      // Chama a API PRIMEIRO — o resultado já é decidido pelo backend
      const spinResult = await api.post<SpinResult>("/roulette/spin", {
        memberId,
      });

      // Calcula pra qual segmento a roda deve parar
      const targetIndex = findSegmentIndex(spinResult.coinsGanhos);

      // Ângulo do segmento alvo (centro do segmento)
      const targetAngle = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

      // Gira múltiplas voltas + para no segmento certo
      // O ponteiro está no topo (0°), então precisamos que o segmento alvo fique no topo
      const fullRotations = 5 + Math.floor(Math.random() * 3); // 5-7 voltas
      const finalRotation = fullRotations * 360 + (360 - targetAngle);

      setRotation((prev) => prev + finalRotation);

      // Espera a animação terminar
      await new Promise((resolve) => setTimeout(resolve, 4000));

      setResult(spinResult);
      onSpinComplete?.(spinResult);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao girar. Tente novamente.");
    } finally {
      setSpinning(false);
    }
  }

  function handleClose() {
    if (spinning) return;
    setResult(null);
    setError("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-(--color-bg) border border-(--color-border) rounded-2xl p-6 shadow-2xl"
          >
            {/* Close */}
            {!spinning && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-lg text-(--color-text-muted) hover:text-(--color-text) transition-colors"
              >
                <X size={18} />
              </button>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap size={20} className="text-(--color-primary-light)" />
                <h2 className="text-xl font-bold font-[family-name:var(--font-geist)]">
                  Roleta
                </h2>
              </div>
              <p className="text-sm text-(--color-text-muted)">
                Gire e descubra quantos {nomeMoeda.toLowerCase()} você vai
                ganhar!
              </p>
            </div>

            {/* Roda */}
            <div className="relative flex items-center justify-center mb-6">
              {/* Ponteiro */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-[var(--color-primary)]" />
              </div>

              {/* Wheel */}
              <motion.svg
                ref={wheelRef}
                viewBox="0 0 300 300"
                className="w-64 h-64"
                animate={{ rotate: rotation }}
                transition={{
                  duration: 4,
                  ease: [0.2, 0.8, 0.3, 1],
                }}
              >
                {SEGMENTS.map((segment, i) => {
                  const startAngle = i * SEGMENT_ANGLE;
                  const endAngle = startAngle + SEGMENT_ANGLE;
                  const startRad = ((startAngle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;
                  const cx = 150;
                  const cy = 150;
                  const r = 140;
                  const x1 = cx + r * Math.cos(startRad);
                  const y1 = cy + r * Math.sin(startRad);
                  const x2 = cx + r * Math.cos(endRad);
                  const y2 = cy + r * Math.sin(endRad);
                  const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

                  // Posição do texto (centro do segmento)
                  const midAngle =
                    (((startAngle + endAngle) / 2 - 90) * Math.PI) / 180;
                  const textR = r * 0.65;
                  const tx = cx + textR * Math.cos(midAngle);
                  const ty = cy + textR * Math.sin(midAngle);
                  const textRotation = (startAngle + endAngle) / 2;

                  return (
                    <g key={i}>
                      <path
                        d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={segment.color}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                      >
                        {segment.label}
                      </text>
                    </g>
                  );
                })}
                {/* Centro */}
                <circle
                  cx="150"
                  cy="150"
                  r="25"
                  fill="var(--color-bg)"
                  stroke="var(--color-border)"
                  strokeWidth="2"
                />
                <text
                  x="150"
                  y="150"
                  fill="var(--color-primary)"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {nomeMoeda.toUpperCase().slice(0, 4)}
                </text>
              </motion.svg>
            </div>

            {/* Resultado */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4 p-4 rounded-xl bg-(--color-primary)/10 border border-(--color-primary)/30"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles size={20} className="text-amber-400" />
                    <span className="text-lg font-bold">
                      {result.premioEspecial
                        ? result.premioEspecial
                        : `${result.coinsGanhos} ${nomeMoeda}`}
                    </span>
                    <Sparkles size={20} className="text-amber-400" />
                  </div>
                  <p className="text-sm text-(--color-text-muted)">
                    +{result.pontosGanhos} {nomePontos.toLowerCase()} •{" "}
                    {result.girosRestantes} {nomeGiro.toLowerCase()}(s)
                    restante(s)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <div className="text-center mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Botão */}
            <Button
              onClick={result ? handleClose : handleSpin}
              loading={spinning}
              variant="primaryShadow"
              size="lg"
              className="w-full"
              disabled={spinning}
            >
              {spinning
                ? "Girando..."
                : result
                  ? "Fechar"
                  : `Girar ${nomeGiro.toLowerCase()}`}
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
