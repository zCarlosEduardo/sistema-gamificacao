"use client";

import { Product } from "@/types";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ProductCardProps {
  product: Product;
  saldoPontos: number;
  nomePontos: string;
  onRedeem: () => void;
}

export function ProductCard({ product, saldoPontos, nomePontos, onRedeem }: ProductCardProps) {
    const canAfford = saldoPontos >= product.valorPontos;

    return (
            <Card className="overflow-hidden flex flex-col p-0">
      {/* Imagem do produto */}
      <div className="aspect-4/3 bg-(--color-bg-subtle) relative overflow-hidden">
        {product.imagem ? (
          <img
            src={product.imagem}
            alt={product.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {product.emoji ?? "🎁"}
          </div>
        )}

        {product.categoria && (
          <Badge className="absolute top-2 left-2">{product.categoria}</Badge>
        )}
      </div>

      {/* Informações */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold mb-1">{product.nome}</h3>
        {product.descricao && (
          <p className="text-xs text-(--color-text-muted) mb-3 line-clamp-2">
            {product.descricao}
          </p>
        )}

        {/* Preço + botão (mt-auto empurra pro fim do card) */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-(--color-border)">
          <div>
            <p className="text-lg font-bold text-(--color-primary-light)">
              {product.valorPontos.toLocaleString("pt-BR")}
            </p>
            <p className="text-[10px] text-(--color-text-muted) uppercase tracking-wider">
              {nomePontos.toLowerCase()}
            </p>
          </div>

          <Button
            size="sm"
            variant={canAfford ? "primary" : "outline"}
            disabled={!canAfford}
            onClick={onRedeem}
          >
            {canAfford ? "Resgatar" : "Sem saldo"}
          </Button>
        </div>
      </div>
    </Card>
    )
}