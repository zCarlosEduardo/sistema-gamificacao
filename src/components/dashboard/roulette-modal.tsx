"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { PoolPrize, SpinResult } from "@/types";

interface RouletteModalProps {
  open: boolean;
  onClose: () => void;
  memberId: string;
  nomeGiro: string;
  nomeMoeda: string;
  nomePontos: string;
  onSpinComplete?: (result: SpinResult) => void;
}

interface Segment {
  label: string;
  valor: number;
  color: string;
}

function buildSegments(prizes: PoolPrize[]): Segment[] {
  const especiais = prizes
    .filter((p) => p.ativo)
    .sort((a, b) => a.valor - b.valor)
    .map((p) => ({
      label: String(p.valor),
      valor: p.valor,
      color:
        p.valor >= 50
          ? "#f59e0b"
          : p.valor >= 25
            ? "#8b5cf6"
            : p.valor >= 10
              ? "#7C3AED"
              : "#A78BFA",
    }));

  const TOTAL = 8;
  const padrao: Segment = { label: "1", valor: 1, color: "#374151" };
  const padraoAlt: Segment = { label: "1", valor: 1, color: "#1f2937" };

  if (especiais.length === 0) {
    return Array.from({ length: TOTAL }, (_, i) =>
      i % 2 === 0 ? { ...padrao } : { ...padraoAlt },
    );
  }

  const result: Segment[] = Array.from({ length: TOTAL }, (_, i) =>
    i % 2 === 0 ? { ...padrao } : { ...padraoAlt },
  );

  const gap = Math.floor(TOTAL / especiais.length);
  especiais.forEach((esp, idx) => {
    const pos = (idx * gap + Math.floor(gap / 2)) % TOTAL;
    result[pos] = esp;
  });

  return result;
}

export function RouletteModal({
  open,
  onClose,
  memberId,
  nomeGiro,
  nomeMoeda,
  nomePontos,
  onSpinComplete,
}: RouletteModalProps) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loadingPrizes, setLoadingPrizes] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinDuration, setSpinDuration] = useState(4.2);
  const [error, setError] = useState("");

  const spinCount = useRef(0);
  // Guarda o valor ABSOLUTO acumulado do rotation — mesmo ref que o state,
  // mas acessível sem stale closure dentro de callbacks assíncronos.
  const rotationRef = useRef(0);
  // Guarda a posição normalizada (0–360) que o Framer realmente parou,
  // calculada sempre sobre rotationRef para ficar sincronizada.
  const normalizedAngleRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    async function loadPrizes() {
      setLoadingPrizes(true);
      try {
        const data = await api.get<PoolPrize[]>("/roulette/prizes");
        setSegments(buildSegments(data));
      } catch {
        setSegments(buildSegments([]));
      } finally {
        setLoadingPrizes(false);
      }
    }

    loadPrizes();
    setResult(null);
    setError("");
    setRotation(0);
    setSpinDuration(4.2);
    rotationRef.current = 0;
    normalizedAngleRef.current = 0;
    spinCount.current = 0;
  }, [open]);

  async function handleSpin() {
    if (segments.length === 0 || spinning) return;

    setSpinning(true);
    setResult(null);
    setError("");

    try {
      const spinResult = await api.post<SpinResult>("/roulette/spin", {
        memberId,
      });

      const segmentAngle = 360 / segments.length;

      // Todos os índices com o valor sorteado (resolve duplicatas de "1")
      const candidates = segments
        .map((s, i) => (s.valor === spinResult.coinsGanhos ? i : -1))
        .filter((i) => i !== -1);

      const chosenIdx =
        candidates[Math.floor(Math.random() * candidates.length)] ?? 0;

      // Centro absoluto do segmento no sistema de coordenadas da roda (0° = topo)
      const segmentCenter = chosenIdx * segmentAngle + segmentAngle / 2;

      // Efeito cassino: para sempre na pontinha (35%–48% do segmento), nunca no centro
      const side = Math.random() > 0.5 ? 1 : -1;
      const pct = 0.35 + Math.random() * 0.13;
      const jitter = side * pct * segmentAngle;

      // Ângulo alvo absoluto (quanto a roda precisa ter girado para o segmento
      // ficar no topo). Ex: segmento no índice 2, segmentAngle=45° →
      // center=112.5° → target=360-112.5=247.5° → roda gira até 247.5°
      const absoluteTarget = (360 - segmentCenter + jitter + 360) % 360;

      // Delta a partir da posição normalizada REAL (lida do ref, nunca stale)
      let delta = absoluteTarget - normalizedAngleRef.current;
      if (delta < 0) delta += 360;
      // Garante delta mínimo para não parecer que a roda "mal girou"
      if (delta < 45) delta += 360;

      const minSpins = 5 + spinCount.current;
      // Usa rotationRef (não o state) para evitar stale closure
      const totalRotation = rotationRef.current + minSpins * 360 + delta;

      spinCount.current++;
      rotationRef.current = totalRotation;
      normalizedAngleRef.current = totalRotation % 360;
      // Duração cresce levemente a cada giro para manter a surpresa
      const duration = 4.0 + spinCount.current * 0.08;
      setSpinDuration(duration);
      setRotation(totalRotation);

      await new Promise((resolve) => setTimeout(resolve, 4500));

      setResult(spinResult);
      onSpinComplete?.(spinResult);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao girar. Tente novamente.");
    } finally {
      setSpinning(false);
    }
  }

  // handleReplay: limpa o resultado e gira de novo.
  // Não pode chamar handleSpin diretamente após setResult(null) porque o
  // re-render ainda não aconteceu — spinning guard bloquearia. Aguarda um tick.
  async function handleReplay() {
    setResult(null);
    // rAF garante que o React processou o setResult(null) antes de girar
    await new Promise((r) => requestAnimationFrame(r));
    handleSpin();
  }

  function handleClose() {
    if (spinning) return;
    setResult(null);
    setError("");
    onClose();
  }

  const segmentAngle = segments.length > 0 ? 360 / segments.length : 45;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm w-screen h-screen"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-(--color-bg) border border-(--color-border) rounded-2xl p-6 shadow-2xl"
          >
            {!spinning && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-lg text-(--color-text-muted) hover:text-(--color-text) transition-colors"
              >
                <X size={18} />
              </button>
            )}

            {/* Header — original */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap size={20} className="text-(--color-primary-light)" />
                <h2 className="text-xl font-bold font-(family-name:--font-geist)">
                  Roleta
                </h2>
              </div>
              <p className="text-sm text-(--color-text-muted)">
                Gire e descubra quantos {nomeMoeda.toLowerCase()} você vai
                ganhar!
              </p>
            </div>

            {/* Roda — original com ponteiro original */}
            <div className="relative flex items-center justify-center mb-6">
              {/* Ponteiro — original */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
                <div className="w-0 h-0 border-l-10 border-r-10 border-t-20 border-l-transparent border-r-transparent border-t-(--color-primary)" />
              </div>

              {loadingPrizes ? (
                <div className="w-64 h-64 flex items-center justify-center">
                  <Loader2
                    size={32}
                    className="animate-spin text-(--color-primary)"
                  />
                </div>
              ) : (
                // FIX: quando rotation===0 (reset) não anima (transition instant)
                // para evitar o flash de animação ao reabrir o modal.
                // Usamos key trick: ao resetar, passamos duration=0.
                <motion.svg
                  viewBox="0 0 300 300"
                  className="w-64 h-64"
                  style={{ rotate: 0 }}
                  animate={{ rotate: rotation }}
                  transition={
                    rotation === 0
                      ? { duration: 0 }
                      : {
                          duration: spinDuration,
                          ease: [0.12, 0.85, 0.25, 1],
                        }
                  }
                >
                  {segments.map((segment, i) => {
                    const startAngle = i * segmentAngle;
                    const endAngle = startAngle + segmentAngle;
                    const startRad = ((startAngle - 90) * Math.PI) / 180;
                    const endRad = ((endAngle - 90) * Math.PI) / 180;
                    const cx = 150,
                      cy = 150,
                      r = 140;
                    const x1 = cx + r * Math.cos(startRad);
                    const y1 = cy + r * Math.sin(startRad);
                    const x2 = cx + r * Math.cos(endRad);
                    const y2 = cy + r * Math.sin(endRad);
                    const largeArc = segmentAngle > 180 ? 1 : 0;
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
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="1"
                        />
                        <text
                          x={tx}
                          y={ty}
                          fill="white"
                          fontSize="16"
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

                  {/* Centro — original */}
                  <circle
                    cx="150"
                    cy="150"
                    r="28"
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
                    {nomeMoeda.toUpperCase().slice(0, 5)}
                  </text>
                </motion.svg>
              )}
            </div>

            {/* Resultado — original */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4 p-4 rounded-xl bg-(--color-primary)/10 border border-(--color-primary)/30"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles size={20} className="text-amber-400" />
                    <span className="text-xl font-bold">
                      {result.premioEspecial ??
                        `${result.coinsGanhos} ${nomeMoeda}`}
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

            {/* Erro — original */}
            {error && (
              <div className="text-center mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Botões — original */}
            <div className="flex flex-col gap-3">
              {!spinning && result && result.girosRestantes > 0 && (
                <Button
                  onClick={handleReplay}
                  variant="primaryShadow"
                  size="lg"
                  className="w-full"
                >
                  Rodar novamente 🎰 ({result.girosRestantes} restantes)
                </Button>
              )}

              <Button
                onClick={result ? handleClose : handleSpin}
                loading={spinning}
                variant="primaryShadow"
                size="lg"
                className="w-full"
                disabled={spinning || loadingPrizes}
              >
                {spinning
                  ? "Girando..."
                  : result
                    ? "Fechar"
                    : `Girar ${nomeGiro.toLowerCase()}`}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}