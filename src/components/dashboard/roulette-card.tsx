"use client";

import { useState } from "react";
import { Zap, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RouletteModal } from "./roulette-modal";

interface RouletteCardProps {
  giros: number;
  nomeGiro: string;
  nomeMoeda?: string;
  nomePontos?: string;
  memberId?: string;
}

export function RouletteCard({
  giros: girosIniciais,
  nomeGiro,
  nomeMoeda = "Coins",
  nomePontos = "Pontos",
  memberId = "",
}: RouletteCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [giros, setGiros] = useState(girosIniciais);

  if (giros <= 0) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8 border-(--color-primary)/30 bg-linear-to-r from-(--color-primary)/15 via-(--color-primary)/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-(--color-primary)/10 rounded-full blur-3xl -translate-y-8 translate-x-8" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-(--color-primary)/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Zap size={28} className="text-(--color-primary-light)" />
                </motion.div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Roleta disponível!</h3>
                  <Sparkles size={16} className="text-amber-400" />
                </div>
                <p className="text-sm text-(--color-text-muted)">
                  Você tem{" "}
                  <span className="font-bold text-(--color-primary-light)">
                    {giros} {nomeGiro.toLowerCase()}(s)
                  </span>{" "}
                  pra usar agora
                </p>
              </div>
            </div>
            <Button
              variant="primaryShadow"
              size="lg"
              className="shrink-0"
              onClick={() => setModalOpen(true)}
            >
              Girar agora
            </Button>
          </div>
        </Card>
      </motion.div>

      <RouletteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        memberId={memberId}
        nomeGiro={nomeGiro}
        nomeMoeda={nomeMoeda}
        nomePontos={nomePontos}
        onSpinComplete={(result) => setGiros(result.girosRestantes)}
      />
    </>
  );
}
