"use client";

import { CanAccess } from "@/components/can-access";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const menuItens = [
  {
    label: "Empresa",
    href: "/configuracao/empresa",
    permission: "configuracao.empresa",
    icon: "🏢",
    descricao: "Nome, Slug e identidade visual da empresa",
  },
  {
    label: "Usuários",
    href: "/configuracao/usuarios",
    permission: "configuracao.usuarios",
    icon: "👥",
    descricao: "Gerencie os usuários da sua empresa",
  },
  {
    label: "Grupos e Permissões",
    href: "/configuracao/grupos-permissao",
    permission: "configuracao.grupos-permissao",
    icon: "🔒",
    descricao: "Gerencie os grupos e permissões da sua empresa",
  },
  {
    label: "Personalização",
    href: "/configuracao/personalizacao",
    permission: "configuracao.personalizacao",
    icon: "🎨",
    descricao: "Personalize as configurações da sua empresa",
  },
  {
    label: "Categorias",
    href: "/configuracao/categorias",
    permission: "configuracao.categorias",
    icon: "📂",
    descricao: "Gerencie as categorias da sua empresa",
  },
];

export default function ConfiguracaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-6 min-h[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 ">
        <div className="sticky top-6">
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-3">
            Configurações
          </p>
        </div>
        <nav className="flex flex-col gap-1 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
          {menuItens.map((item) => {
            const ativo = pathname === item.href;
            return (
              <CanAccess key={item.href} permission={item.permission}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-all group ${
                    ativo
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {item.label}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {item.descricao}
                      </p>
                    </div>
                  </div>
                  {ativo && (
                    <motion.div
                      layoutId="config-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zinc-00 dark:bg-white rounded-full"
                    />
                  )}
                </button>
              </CanAccess>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg p-6">
        <main>{children}</main>
      </div>
    </div>
  );
}
