"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import Link from "next/link";
import type { Product } from "@/types";

interface ProductsPreviewProps {
  tenantId: string;
  nomeLoja: string;
  nomePontos: string;
}

export function ProductsPreview({
  nomeLoja,
  nomePontos,
}: ProductsPreviewProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/products", { limit: "4" });
        const data = Array.isArray(res) ? res : (res.data ?? []);
        setProducts(data);
      } catch {}
    }
    load();
  }, []);

  if (products.length === 0) return null;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} className="text-(--color-primary-light)" />
          <CardTitle>{nomeLoja}</CardTitle>
        </div>
        <Link href="/loja">
          <Button variant="ghost" size="sm">
            Ver tudo
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {product.emoji ? (
                <span className="text-xl">{product.emoji}</span>
              ) : (
                <div className="h-8 w-8 rounded-lg bg-(--color-bg-subtle) border border-(--color-border) flex items-center justify-center">
                  <ShoppingBag
                    size={14}
                    className="text-(--color-text-muted)"
                  />
                </div>
              )}
              <p className="text-sm font-medium">{product.nome}</p>
            </div>
            <Badge variant="primary">
              {product.valorPontos} {nomePontos.toLowerCase()}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
