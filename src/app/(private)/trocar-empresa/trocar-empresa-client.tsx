"use client";

import { selecionarTenant } from "@/app/actions/tenant";
import { motion } from "framer-motion";
import { useTransition } from "react";
import type { TrocarEmpresaClientProps } from "@/components/types";


function getIniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function TrocarEmpresaClient({
  tenants,
  usuarioNome,
  tenantAtualId,
}: TrocarEmpresaClientProps) {
  const [isPending, startTransition] = useTransition();

  function handleSelecionar(tenantId: string) {
    startTransition(async () => {
      await selecionarTenant(tenantId);
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-2">
          Bem-vindo, {usuarioNome.split(" ")[0]}
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Selecione a empresa
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Você tem acesso a {tenants.length}{" "}
          {tenants.length === 1 ? "empresa" : "empresas"}
        </p>
      </motion.div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
        {tenants.map((tenant, i) => {
          const ativo = tenant.id === tenantAtualId;
          return (
            <motion.button
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.00 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelecionar(tenant.id)}
              disabled={isPending}
              className={`relative group flex flex-col items-center gap-4 p-6 rounded-2xl border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                ativo
                  ? "border-(--cor) bg-(--cor)/5 dark:bg-(--cor)/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
              style={{ "--cor": tenant.corPrimaria } as React.CSSProperties}
            >
              {/* Badge ativo */}
              {ativo && (
                <span
                  className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${tenant.corPrimaria}20`,
                    color: tenant.corPrimaria,
                  }}
                >
                  Ativo
                </span>
              )}

              {/* Logo ou iniciais */}
              <div
                className="w-22 h-22 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 bg-zinc-200 dark:bg-zinc-800/20"
              >
                {tenant.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tenant.logo}
                    alt={tenant.nome}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  getIniciais(tenant.nome)
                )}
              </div>

              {/* Info */}
              <div className="text-center">
                <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                  {tenant.nome}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {tenant.cnpj}
                </p>
              </div>

              {/* Indicador hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  boxShadow: `0 0 0 2px ${tenant.corPrimaria}40`,
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Loading */}
      {isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-white/50 dark:bg-zinc-950/50 flex items-center justify-center backdrop-blur-sm z-50"
        >
          <div className="w-6 h-6 rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white animate-spin" />
        </motion.div>
      )}
    </div>
  );
}