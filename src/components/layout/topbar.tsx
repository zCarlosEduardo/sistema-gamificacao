"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/auth-client";
import { useTenant } from "@/contexts/tenant-context";

// Prefixo "Local" evita colisão com o tipo Tenant exportado pelo contexto
interface TenantLocal {
  nome: string;
  logo: string | null;
  corPrimaria: string;
  nomePontos: string;
  nomeEquipe: string;
  nomeMetas: string;
  nomeLoja: string;
}

interface Membro {
  role: string;
  permissoes: string[];
}

interface User {
  name: string;
  email: string;
}

interface TopbarProps {
  initialUser: User;
  initialTenant: TenantLocal | null;
  initialMembro: Membro | null;
}

interface MenuItem {
  label: (tenant: TenantLocal | null) => string;
  href: string;
  permission: string | null;
}

// Labels são funções que resolvem o valor real do tenant
const menuItems: MenuItem[] = [
  { label: () => "Dashboard", href: "/", permission: null },
  {
    label: (t) => t?.nomeMetas ?? "Metas",
    href: "/metas",
    permission: "metas.ver",
  },
  {
    label: (t) => t?.nomeLoja ?? "Mercado",
    href: "/mercado",
    permission: "mercado.ver",
  },
  {
    label: () => "Meus Resgates",
    href: "/resgates/meus",
    permission: "resgates.ver",
  },
  {
    label: () => "Resgates",
    href: "/resgates",
    permission: "resgates.aprovar",
  },
  {
    label: (t) => t?.nomeEquipe ?? "Equipe",
    href: "/equipe",
    permission: "equipe.ver",
  },
  { label: () => "Usuários", href: "/usuarios", permission: "usuarios.ver" },
  { label: () => "Pools", href: "/pools", permission: "pools.ver" },
  {
    label: () => "Personalização",
    href: "/personalizacao",
    permission: "personalizacao.ver",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function hasPermissionStatic(
  membro: Membro | null,
  permission: string,
): boolean {
  if (!membro) return false;
  if (membro.role === "SUPER_ADMIN" || membro.role === "ADMIN") return true;
  return membro.permissoes.includes(permission);
}

export function Topbar({
  initialUser,
  initialTenant,
  initialMembro,
}: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { tenant: tenantCtx, membro: membroCtx, hasPermission } = useTenant();

  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef(pathname);

  // Cast para TenantLocal — evita colisão com o tipo Tenant do contexto
  const tenant = (tenantCtx ?? initialTenant) as TenantLocal | null;
  const membro = membroCtx ?? initialMembro;
  const corPrimaria = tenant?.corPrimaria ?? "#7C3AED";

  function checkPermission(permission: string): boolean {
    if (tenantCtx) return hasPermission(permission);
    return hasPermissionStatic(membro, permission);
  }

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  // Fecha menu ao navegar — ref evita setState síncrono no body do effect
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setMenuAberto(false);
    }
  }, [pathname]);

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  }

  const itensVisiveis = menuItems.filter(
    (item) => item.permission === null || checkPermission(item.permission),
  );

  const initials = initialUser?.name ? getInitials(initialUser.name) : "??";

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Esquerda: logo/nome do tenant + nav — layout idêntico ao original */}
        <div className="flex items-center gap-8">
          {tenant?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenant.logo} alt={tenant.nome} className="h-12 w-auto" />
          ) : (
            <div
              className="w-32 h-12 rounded-lg flex items-center justify-center text-white text-xs font-bold px-2"
              style={{ background: corPrimaria }}
            >
              {tenant?.nome ?? "Logo"}
            </div>
          )}

          <nav className="flex items-center gap-1">
            {itensVisiveis.map((item) => {
              const ativo = pathname === item.href;
              const label = item.label(tenant);

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`relative px-3 py-1.5 text-sm rounded-md transition-colors ${
                    ativo
                      ? "text-zinc-900 dark:text-white font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {label}
                  {ativo && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: corPrimaria }}
                      suppressHydrationWarning
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Direita: pontos + avatar — idêntico ao original */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5">
            <div className="flex flex-col text-xs font-medium text-zinc-900 dark:text-white text-center uppercase">
              <span>total {tenant?.nomePontos ?? "Coins"}</span>
              <span className="text-amber-500">0</span>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuAberto((v) => !v)}
              aria-label="Abrir menu do usuário"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-opacity hover:opacity-80 ring-2 ring-zinc-400 dark:ring-zinc-600"
              style={{ background: corPrimaria }}
            >
              {initials}
            </button>

            <AnimatePresence>
              {menuAberto && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {initialUser?.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {initialUser?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => router.push("/perfil")}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Meu perfil
                    </button>
                    <button
                      onClick={() => router.push("/trocar-empresa")}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Alterar empresa
                    </button>
                    <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
