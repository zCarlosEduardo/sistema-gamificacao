"use client";

import { useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import {
  AvisoBanner,
  FiltrosCategorias,
  ModalConfirmarResgate,
  PageHeader,
  ProdutoCard,
} from "@/components";
import type { CategoriaRef, Produto, Resgate } from "@/types";

interface Props {
  tenantId: string;
  produtos: Produto[];
  categorias: CategoriaRef[];
  saldoInicial: number;
  resgateAtivo: boolean;
  nomePeriodo?: string;
  resgatesIniciais?: Resgate[];
}

export default function MercadoClient({
  tenantId,
  produtos,
  categorias,
  saldoInicial,
  resgateAtivo,
  nomePeriodo,
  resgatesIniciais = [],
}: Props) {
  const { tenant } = useTenant();
  const corAtual = tenant?.corPrimaria ?? "#7C3AED";
  const nomePontos = tenant?.nomePontos ?? "Pontos";
  const nomeLoja = tenant?.nomeLoja ?? "Loja";

  const [saldo, setSaldo] = useState(saldoInicial);
  const [, setResgates] = useState<Resgate[]>(resgatesIniciais);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState("");

  const [categoriaAtiva, setCategoriaAtiva] = useState("");
  const [busca, setBusca] = useState("");

  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null,
  );

  const produtosFiltrados = produtos.filter((p) => {
    if (categoriaAtiva && p.categoria?.id !== categoriaAtiva) return false;
    if (busca && !p.nome.toLowerCase().includes(busca.toLowerCase()))
      return false;
    return true;
  });

  function handleResgatar(produto: Produto) {
    setProdutoSelecionado(produto);
  }

  function handleConfirmarResgate() {
    if (!produtoSelecionado) return;

    startTransition(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resgates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": tenantId,
          },
          credentials: "include",
          body: JSON.stringify({ produtoId: produtoSelecionado.id }),
        });

        if (!res.ok) throw new Error();

        const novoResgate: Resgate = await res.json();

        setSaldo((prev) => prev - produtoSelecionado.valorPontos);
        setResgates((prev) => [novoResgate, ...prev]);
        setProdutoSelecionado(null);
      } catch {
        setErro("Erro ao realizar resgate. Tente novamente.");
        setProdutoSelecionado(null);
      }
    });
  }

  return (
    <>
      {/* Modal de confirmação */}
      <AnimatePresence>
        {produtoSelecionado && (
          <ModalConfirmarResgate
            produto={produtoSelecionado}
            saldoAtual={saldo}
            nomePontos={nomePontos}
            isPending={isPending}
            corAtual={corAtual}
            onConfirmar={handleConfirmarResgate}
            onCancelar={() => setProdutoSelecionado(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-full">
        {/* Header */}
        <PageHeader
          titulo={nomeLoja}
          descricao={`Troque seus ${nomePontos} por recompensas`}
        />

        {/* Banner de status */}
        <div className="mb-6">
          <AvisoBanner
            resgateAtivo={resgateAtivo}
            nomePeriodo={nomePeriodo}
            corPrimaria={corAtual}
            corSecundaria={tenant?.corSecundaria}
          />
        </div>

        {/* Filtros */}
        <div className="mb-5">
          <FiltrosCategorias
            categorias={categorias}
            categoriaAtiva={categoriaAtiva}
            busca={busca}
            onCategoria={setCategoriaAtiva}
            onBusca={setBusca}
          />
        </div>

        {/* Grid de produtos */}
        {produtosFiltrados.length === 0 ? (
          <div className="bg-zinc-50 dark:bg-zinc-800 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl px-6 py-14 flex flex-col items-center gap-3 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `${corAtual}18` }}
            >
              <Package size={22} style={{ color: corAtual }} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nenhum produto encontrado
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Tente ajustar os filtros ou a busca
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 320px))",
            }}
          >
            {produtosFiltrados.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                saldo={saldo}
                resgateAtivo={resgateAtivo}
                nomePontos={nomePontos}
                corAtual={corAtual}
                onResgatar={handleResgatar}
              />
            ))}
          </div>
        )}

        {erro && (
          <p className="text-sm text-red-500 mt-4 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
            {erro}
          </p>
        )}
      </div>
    </>
  );
}
