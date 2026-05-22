"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "@/lib/auth-client";
import { useTenant } from "@/contexts/tenant-context";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";

const menuItems = [
  { label: "Dashboard", href: "/", permission: null },
  { label: "Metas", href: "/metas", permission: "metas.ver" },
  { label: "Mercado", href: "/mercado", permission: "mercado.ver" },
  {
    label: "Meus Resgates",
    href: "/resgates/meus",
    permission: "resgates.ver",
  },
  { label: "Resgates", href: "/resgates", permission: "resgates.aprovar" },
  { label: "Equipe", href: "/equipe", permission: "equipe.ver" },
  { label: "Usuários", href: "/usuarios", permission: "usuarios.ver" },
  { label: "Pools", href: "/pools", permission: "pools.ver" },
  {
    label: "Personalização",
    href: "/personalizacao",
    permission: "personalizacao.ver",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { tenant, hasPermission } = useTenant();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const corPrimaria = tenant?.corPrimaria ?? "#7C3AED";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    function handleClickFora(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const itensVisiveis = menuItems.filter(
    (item) => item.permission === null || hasPermission(item.permission),
  );

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const initials = session?.user?.name ? getInitials(session.user.name) : "??";

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo + Nav */}
        <div className="flex items-center gap-8">
          {mounted && tenant?.logo ? (
            <img src={tenant.logo} alt={tenant.nome} className="h-7 w-auto" />
          ) : (
            <div
              className="w-24 h-12 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: mounted ? corPrimaria : "#7C3AED" }}
            >
              {mounted ? (tenant?.nome?.[0] ?? "Logo aqui") : "Logo aqui"}
            </div>
          )}

          {/* Menu */}
          <nav className="flex items-center gap-1">
            {itensVisiveis.map((item) => {
              const ativo = pathname === item.href;
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
                  {item.label}
                  {ativo && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: corPrimaria }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Direita */}
        <div className="flex items-center gap-3">
          {/* Pontos */}
          <div className="hidden sm:flex items-center gap-1.5  px-3 py-1.5 rounded-full">
            <div className="flex flex-col text-xs font-medium text-zinc-900 dark:text-white text-center uppercase w-full">
              <span>total {tenant?.nomeMoeda ?? "Coins"}</span>
              <span className="text-amber-500 dark:text-amber-500">0</span>
            </div>
          </div>

          {/* Avatar */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuAberto(!menuAberto)}
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
                  {/* Info usuário */}
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        router.push("/perfil");
                        setMenuAberto(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Meu perfil
                    </button>
                    <button
                      onClick={() => {
                        router.push("/trocar-empresa");
                        setMenuAberto(false);
                      }}
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
