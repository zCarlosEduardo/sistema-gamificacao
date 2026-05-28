"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/auth-client";
import { useTenant } from "@/contexts/tenant-context";
import { ThemeToggle } from "../ui/theme/theme-toggle";
import { Avatar } from "@/components/ui";

interface TenantLocal {
  nome: string;
  logo: string | null;
  corPrimaria: string;
  corSecundaria: string;
  nomePontos: string;
  nomeEquipe: string;
  nomeMetas: string;
  nomeLoja: string;
  nomeUsuario: string;
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
    label: (t) => t?.nomeUsuario ?? "Usuários",
    href: "/usuario",
    permission: "usuario.ver",
  },
  { label: () => "Pools", href: "/pools", permission: "pools.ver" },
  { label: () => "Meu Perfil", href: "/perfil", permission: null },
  {
    label: () => "Configuração",
    href: "/configuracao",
    permission: "configuracao.ver",
  },
];

function isAtivo(
  item: MenuItem,
  pathname: string,
  allItems: MenuItem[],
): boolean {
  if (item.href === "/") return pathname === "/";
  if (!pathname.startsWith(item.href)) return false;

  // Verifica se existe outro item mais específico que também bate
  const temFilhoMaisEspecifico = allItems.some(
    (outro) =>
      outro.href !== item.href &&
      outro.href.startsWith(item.href) &&
      pathname.startsWith(outro.href),
  );

  return !temFilhoMaisEspecifico;
}

function hasPermissionStatic(
  membro: Membro | null,
  permission: string,
): boolean {
  if (!membro) return false;
  if (membro.role === "SUPER_ADMIN" || membro.role === "ADMIN") return true;
  return membro.permissoes.includes(permission);
}

// ──────────────────────────────────────────────────────────────
// Ícone hamburger/close animado
// ──────────────────────────────────────────────────────────────
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-5 relative flex flex-col justify-center gap-1.25">
      <motion.span
        animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
        className="block h-px bg-zinc-600 dark:bg-zinc-400 rounded-full origin-center"
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
        className="block h-px bg-zinc-600 dark:bg-zinc-400 rounded-full"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
        className="block h-px bg-zinc-600 dark:bg-zinc-400 rounded-full origin-center"
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Drawer mobile
// ──────────────────────────────────────────────────────────────
interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  itensVisiveis: MenuItem[];
  tenant: TenantLocal | null;
  corPrimaria: string;
  corSecundaria: string;
  pathname: string;
  user: User;
  onNavigate: (href: string) => void;
  onSignOut: () => void;
}

function MobileDrawer({
  open,
  onClose,
  itensVisiveis,
  tenant,
  corPrimaria,
  corSecundaria,
  pathname,
  user,
  onNavigate,
  onSignOut,
}: MobileDrawerProps) {
  // Bloqueia scroll do body quando drawer está aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shadow-2xl"
          >
            {/* Header do drawer */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              {tenant?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tenant.logo}
                  alt={tenant.nome}
                  className="h-8 w-auto"
                />
              ) : (
                <div
                  className="h-8 px-3 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: corPrimaria }}
                >
                  {tenant?.nome ?? "Logo"}
                </div>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Fechar menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Pontos */}
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-regular mb-0.5">
                Total {tenant?.nomePontos ?? "Coins"}
              </p>
              <p className="text-xl font-semibold text-amber-500">880,90</p>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-2 px-2">
              {itensVisiveis.map((item, i) => {
                const ativo = isAtivo(item, pathname, itensVisiveis);
                const label = item.label(tenant);

                return (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    onClick={() => onNavigate(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 text-left ${
                      ativo
                        ? "font-medium text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    {/* Indicador lateral */}
                    <span
                      className="w-1 h-5 rounded-full shrink-0 transition-all"
                      style={{
                        background: ativo ? corPrimaria : "transparent",
                      }}
                    />
                    {label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Footer do drawer — perfil + sair */}
            <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-800 p-3 space-y-1">
              <button
                onClick={() => onNavigate("/trocar-empresa")}
                className="w-full text-left px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg transition-colors"
              >
                Alterar empresa
              </button>
              <button
                onClick={onSignOut}
                className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Sair
              </button>

              {/* Identidade do usuário */}
              <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
                <Avatar
                  nome={user?.name ?? ""}
                  cor={corPrimaria}
                  corSecundaria={corSecundaria}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ──────────────────────────────────────────────────────────────
// Topbar principal
// ──────────────────────────────────────────────────────────────
export function Topbar({
  initialUser,
  initialTenant,
  initialMembro,
}: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { tenant: tenantCtx, membro: membroCtx, hasPermission } = useTenant();

  const [menuAberto, setMenuAberto] = useState(false); // dropdown desktop
  const [drawerAberto, setDrawerAberto] = useState(false); // drawer mobile
  const menuRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef(pathname);

  const tenant = (tenantCtx ?? initialTenant) as TenantLocal | null;
  const membro = membroCtx ?? initialMembro;
  const corPrimaria = tenant?.corPrimaria ?? "#7C3AED";
  const corSecundaria = tenant?.corSecundaria ?? "#9333EA";
  function checkPermission(permission: string): boolean {
    if (tenantCtx) return hasPermission(permission);
    return hasPermissionStatic(membro, permission);
  }

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  // Fecha menus ao navegar
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setMenuAberto(false);
      setDrawerAberto(false);
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

  function handleNavigate(href: string) {
    router.push(href);
    setDrawerAberto(false);
  }

  const itensVisiveis = menuItems.filter(
    (item) => item.permission === null || checkPermission(item.permission),
  );

  return (
    <>
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          {/* ── MOBILE: hamburger + logo ── */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setDrawerAberto(true)}
              aria-label="Abrir menu"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <HamburgerIcon open={drawerAberto} />
            </button>

            {tenant?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tenant.logo} alt={tenant.nome} className="h-8 w-auto" />
            ) : (
              <div
                className="h-8 px-3 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: corPrimaria }}
              >
                {tenant?.nome ?? "Logo"}
              </div>
            )}
          </div>

          {/* ── DESKTOP: logo + nav ── */}
          <div className="hidden lg:flex items-center gap-8">
            {tenant?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tenant.logo}
                alt={tenant.nome}
                className="h-12 w-auto"
              />
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
                // FIX 1: pathname.startsWith para subrotas
                const ativo = isAtivo(item, pathname, itensVisiveis);
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
                        layoutId="topbar-nav-indicator" // FIX 2: layoutId único
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

          {/* ── Direita: pontos + avatar (desktop) / só avatar (mobile) ── */}
          <div className="flex items-center gap-3">
            {/* Pontos — oculto em mobile (aparece no drawer) */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5">
              <div className="flex flex-col text-xs font-medium text-zinc-800 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-center">
                <span className="uppercase tracking-widest text-zinc-400 font-regular mb-0.5">
                  total {tenant?.nomePontos ?? "Coins"}
                </span>
                <span className="text-amber-500 text-base text-end">
                  880,90
                </span>
              </div>
            </div>

            {/* Avatar + dropdown (desktop) */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuAberto((v) => !v)}
                aria-label="Abrir menu do usuário"
                className="rounded-full transition-opacity hover:opacity-80 ring-2 ring-zinc-400 dark:ring-zinc-600"
              >
                <Avatar
                  nome={initialUser?.name ?? ""}
                  cor={corPrimaria}
                  corSecundaria={corSecundaria}
                  size="sm"
                />
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
                      <div className="flex justify-center">
                        <ThemeToggle />
                      </div>

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

      {/* Drawer mobile — fora do header para não herdar z-index */}
      <MobileDrawer
        open={drawerAberto}
        onClose={() => setDrawerAberto(false)}
        itensVisiveis={itensVisiveis}
        tenant={tenant}
        corPrimaria={corPrimaria}
        pathname={pathname}
        user={initialUser}
        onNavigate={handleNavigate}
        onSignOut={handleSignOut}
        corSecundaria={corSecundaria}
      />
    </>
  );
}
