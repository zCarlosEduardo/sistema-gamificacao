"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "./product-card";
import type { Product, ProductCategory } from "@/types";

interface StoreClientProps {
  categories: ProductCategory[];
  saldoPontos: number;
  memberId: string;
  nomePontos: string;
}

export function StoreClient({
  categories,
  saldoPontos,
  memberId,
  nomePontos,
}: StoreClientProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Debounce: atrasa o search 400ms e volta pra página 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Busca produtos na API quando filtros mudam
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "12");
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (activeCategory) params.set("categoryId", activeCategory);

        const res = await api.get<{ data: Product[]; meta: { totalPages: number } }>(
          `/products?${params.toString()}`,
        );

        setProducts(res.data);
        setTotalPages(res.meta.totalPages);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [debouncedSearch, activeCategory, page]);

  return (
    <div className="space-y-6">
      {/* Busca */}
      <input
        type="text"
        placeholder="Buscar produto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm bg-(--color-bg-subtle) border border-(--color-border) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
      />

      {/* Categorias */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => {
            setActiveCategory(null);
            setPage(1);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            !activeCategory
              ? "bg-(--color-primary)/10 border-(--color-primary)/30 text-(--color-primary-light)"
              : "border-(--color-border) text-(--color-text-muted) hover:text-(--color-text)"
          }`}
        >
          Todos
        </button>
        {categories
          .filter((c) => c.ativo)
          .map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id === activeCategory ? null : cat.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeCategory === cat.id
                  ? "bg-(--color-primary)/10 border-(--color-primary)/30 text-(--color-primary-light)"
                  : "border-(--color-border) text-(--color-text-muted) hover:text-(--color-text)"
              }`}
            >
              {cat.nome}
            </button>
          ))}
      </div>

      {/* Grid de produtos */}
      {loading ? (
        <p className="text-sm text-(--color-text-muted) text-center py-12">Carregando...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-(--color-text-muted) text-center py-12">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              saldoPontos={saldoPontos}
              nomePontos={nomePontos}
              onRedeem={() => console.log("Resgatar:", product.nome)}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm text-(--color-text-muted)">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}