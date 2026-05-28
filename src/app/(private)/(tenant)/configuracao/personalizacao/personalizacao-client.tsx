"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useTenant } from "@/contexts/tenant-context";
import { Coins, Target, Star, Users, ShoppingCart } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/ui";

interface Tenant {
  id: string;
  nomeMoeda: string;
  nomeMeta: string;
  nomePontos: string;
  nomeEquipe: string;
  nomeLoja: string;
  corPrimaria: string;
}

interface PersonalizacaoClientProps {
  tenant: Tenant;
}

const CAMPOS: {
  key: keyof Omit<Tenant, "id" | "corPrimaria">;
  label: string;
  descricao: string;
  placeholder: string;
  icon: React.ElementType;
}[] = [
  {
    key: "nomeMoeda",
    label: "Moeda",
    descricao: "Nome da moeda virtual usada no sistema",
    placeholder: "Ex: Coins, Fichas, Créditos...",
    icon: Coins,
  },
  {
    key: "nomeMeta",
    label: "Meta",
    descricao: "Como as metas são chamadas no sistema",
    placeholder: "Ex: Meta, Desafio, Missão...",
    icon: Target,
  },
  {
    key: "nomePontos",
    label: "Pontos",
    descricao: "Nome da unidade de pontuação",
    placeholder: "Ex: Pontos, XP, Stars...",
    icon: Star,
  },
  {
    key: "nomeEquipe",
    label: "Equipe",
    descricao: "Como os grupos de usuários são chamados",
    placeholder: "Ex: Equipe, Time, Squad...",
    icon: Users,
  },
  {
    key: "nomeLoja",
    label: "Loja",
    descricao: "Nome do espaço de resgates",
    placeholder: "Ex: Loja, Mercado, Vitrine...",
    icon: ShoppingCart,
  },
];

export default function PersonalizacaoClient({
  tenant,
}: PersonalizacaoClientProps) {
  const { tenant: tenantCtx, atualizarTenant } = useTenant();
  const corPrimaria = tenantCtx?.corPrimaria ?? tenant.corPrimaria;

  const [valores, setValores] = useState({
    nomeMoeda: tenant.nomeMoeda,
    nomeMeta: tenant.nomeMeta,
    nomePontos: tenant.nomePontos,
    nomeEquipe: tenant.nomeEquipe,
    nomeLoja: tenant.nomeLoja,
  });

  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(key: keyof typeof valores, value: string) {
    setValores((prev) => ({ ...prev, [key]: value }));
  }

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
            body: JSON.stringify(valores),
          },
        );

        if (!res.ok) throw new Error("Erro ao salvar");

        atualizarTenant(valores);
        setSucesso(true);
        setTimeout(() => setSucesso(false), 3000);
      } catch {
        setErro("Erro ao salvar. Tente novamente.");
      }
    });
  }

  return (
    <div className="max-w-full items-center mx-auto">
      {/* Header */}
      <PageHeader
        titulo="Nomenclaturas"
        descricao="Personalize como cada elemento é chamado dentro do sistema"
      />

      <div className="flex flex-col gap-8">
        <section>
          <SectionTitle titulo="Elementos do Sistema" cor={corPrimaria} />

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-5">
            {CAMPOS.map((campo) => {
              const Icon = campo.icon;

              return (
                <div key={campo.key}>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                    <Icon size={14} />
                    {campo.label}
                  </label>

                  <input
                    type="text"
                    value={valores[campo.key]}
                    onChange={(e) => handleChange(campo.key, e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                    placeholder={campo.placeholder}
                  />

                  <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">
                    {campo.descricao}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Preview */}
        <section>
          <SectionTitle titulo="Preview" cor={corPrimaria} />

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <div className="flex flex-wrap gap-2">
              {CAMPOS.map((campo) => {
                const Icon = campo.icon;

                return (
                  <span
                    key={campo.key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                    style={{ background: corPrimaria, opacity: 0.7 }}
                  >
                    <Icon size={12} />
                    {valores[campo.key] || campo.label}
                  </span>
                );
              })}
            </div>

            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-3">
              Assim os elementos aparecerão para os usuários.
            </p>
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
            style={{ background: corPrimaria }}
          >
            {isPending ? "Salvando..." : "Salvar alterações"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
