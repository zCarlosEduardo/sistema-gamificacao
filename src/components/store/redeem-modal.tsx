"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Product } from "@/types";

interface RedeemModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  saldoPontos: number;
  memberId: string;
  nomePontos: string;
  onRedeemed: (pontosGastos: number) => void;
}

export function RedeemModal({
  open,
  onClose,
  product,
  saldoPontos,
  memberId,
  nomePontos,
  onRedeemed,
}: RedeemModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!product) return null;

  const canAfford = saldoPontos >= product.valorPontos;
  const saldoRestante = saldoPontos - product.valorPontos;

  async function handleRedeem() {
    setLoading(true);
    setError("");

    try {
      await api.post("/redemptions", {
        memberId,
        productId: product!.id,
      });

      setSuccess(true);
      onRedeemed(product!.valorPontos);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao resgatar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setSuccess(false);
    setError("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-sm bg-(--color-bg) border border-(--color-border) rounded-2xl overflow-hidden shadow-2xl"
          >
            {!loading && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-lg text-(--color-text-muted) hover:text-(--color-text) transition-colors z-10"
              >
                <X size={16} />
              </button>
            )}

            {success ? (
              <div className="p-6 text-center">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold mb-1">Resgate solicitado!</h3>
                <p className="text-sm text-(--color-text-muted) mb-4">
                  Seu resgate de{" "}
                  <span className="font-semibold text-(--color-text)">
                    {product.nome}
                  </span>{" "}
                  está pendente de aprovação.
                </p>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="w-full"
                >
                  Fechar
                </Button>
              </div>
            ) : (
              <>
                <div className="aspect-video bg-(--color-bg-subtle) relative">
                  {product.imagem ? (
                    <img
                      src={product.imagem}
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {product.emoji ?? "🎁"}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{product.nome}</h3>
                    {product.descricao && (
                      <p className="text-sm text-(--color-text-muted) mt-1">
                        {product.descricao}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-(--color-bg-subtle) border border-(--color-border)">
                    <div className="flex justify-between text-sm">
                      <span className="text-(--color-text-muted)">Preço</span>
                      <span className="font-semibold text-(--color-primary-light)">
                        {product.valorPontos.toLocaleString("pt-BR")}{" "}
                        {nomePontos.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-(--color-text-muted)">
                        Seu saldo
                      </span>
                      <span className="font-medium">
                        {saldoPontos.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="border-t border-(--color-border) pt-2 flex justify-between text-sm">
                      <span className="text-(--color-text-muted)">
                        Saldo após
                      </span>
                      <span
                        className={`font-semibold ${canAfford ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {canAfford
                          ? saldoRestante.toLocaleString("pt-BR")
                          : "Insuficiente"}
                      </span>
                    </div>
                  </div>

                  {!canAfford && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle
                        size={16}
                        className="text-red-400 shrink-0"
                      />
                      <p className="text-xs text-red-400">
                        Faltam{" "}
                        {(product.valorPontos - saldoPontos).toLocaleString(
                          "pt-BR",
                        )}{" "}
                        {nomePontos.toLowerCase()}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-400 text-center">
                        {error}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleRedeem}
                    loading={loading}
                    variant="primaryShadow"
                    size="lg"
                    className="w-full"
                    disabled={!canAfford || loading}
                  >
                    {canAfford ? "Confirmar resgate" : "Saldo insuficiente"}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
