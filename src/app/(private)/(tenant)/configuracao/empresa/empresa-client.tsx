"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useTenant } from "@/contexts/tenant-context";

interface Tenant {
  id: string;
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  logo: string | null;
  corPrimaria: string;
  corSecundaria: string;
  nomeMoeda: string;
  nomeMeta: string;
  nomePontos: string;
  nomeEquipe: string;
  nomeLoja: string;
}

interface EmpresaClientProps {
  tenant: Tenant;
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
      <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-700 p-0.5 bg-transparent"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          placeholder="#7C3AED"
        />
        <div
          className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
          style={{ background: value }}
        />
      </div>
    </div>
  );
}

export default function EmpresaClient({ tenant }: EmpresaClientProps) {
  const { tenant: tenantCtx } = useTenant();
  console.log('tenant:', JSON.stringify(tenant));
  const corAtual = tenantCtx?.corPrimaria ?? tenant.corPrimaria;

  const [nome, setNome] = useState(tenant.nome);
  const [logo, setLogo] = useState(tenant.logo ?? "");
  const [corPrimaria, setCorPrimaria] = useState(tenant.corPrimaria);
  const [corSecundaria, setCorSecundaria] = useState(tenant.corSecundaria);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [isPending, startTransition] = useTransition();
  const { atualizarTenant } = useTenant();

  function handleSalvar() {
    startTransition(async () => {
      setSucesso(false);
      setErro("");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenant.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-tenant-id": tenant.id,
            },
            credentials: "include",
            body: JSON.stringify({
              nome,
              logo: logo || null,
              corPrimaria,
              corSecundaria,
            }),
          },
        );

        if (!res.ok) throw new Error("Erro ao salvar");

        atualizarTenant({
          nome,
          logo: logo || null,
          corPrimaria,
          corSecundaria,
        });
        setSucesso(true);
        setTimeout(() => setSucesso(false), 3000);
      } catch {
        setErro("Erro ao salvar. Tente novamente.");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          Minha Empresa
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Gerencie as informações e identidade visual da sua empresa
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Dados empresariais — somente leitura */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
            <span
              className="w-1 h-4 rounded-full"
              style={{ background: corAtual }}
            />
            Dados Empresariais
          </h2>
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Razão Social
                </label>
                <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed">
                  {tenant.razaoSocial ?? "Não informado"}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                  CNPJ
                </label>
                <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed font-mono">
                  {tenant.cnpj ?? "Não informado"}
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Estes dados são vinculados ao CNPJ e não podem ser alterados.
            </p>
          </div>
        </section>

        {/* Dados personalizáveis */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
            <span
              className="w-1 h-4 rounded-full"
              style={{ background: corAtual }}
            />
            Identificação
          </h2>
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Nome de Exibição
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                  placeholder="Nome que aparece no sistema"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Logo */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
            <span
              className="w-1 h-4 rounded-full"
              style={{ background: corAtual }}
            />
            Logo
          </h2>
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700"
                style={{ background: corPrimaria }}
              >
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  (nome?.[0]?.toUpperCase() ?? "?")
                )}
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                  URL da Logo
                </label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cores */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
            <span
              className="w-1 h-4 rounded-full"
              style={{ background: corAtual }}
            />
            Cores
          </h2>
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-5">
            <ColorPicker
              label="Cor Primária"
              value={corPrimaria}
              onChange={setCorPrimaria}
            />
            <ColorPicker
              label="Cor Secundária"
              value={corSecundaria}
              onChange={setCorSecundaria}
            />
            <div
              className="h-10 rounded-lg w-full"
              style={{
                background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})`,
              }}
            />
          </div>
        </section>

        {/* Feedback + Botão salvar */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <div>
            {sucesso && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-emerald-500"
              >
                ✓ Salvo com sucesso
              </motion.p>
            )}
            {erro && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-500"
              >
                {erro}
              </motion.p>
            )}
          </div>
          <motion.button
            onClick={handleSalvar}
            disabled={isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ background: corAtual }}
          >
            {isPending ? "Salvando..." : "Salvar alterações"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
