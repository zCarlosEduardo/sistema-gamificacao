"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/auth-client";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Target,
  ShoppingBag,
  Package,
  User,
  Users,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Coins,
  ArrowLeftRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Metas", href: "/metas", icon: <Target size={18} /> },
  { label: "Loja", href: "/loja", icon: <ShoppingBag size={18} /> },
  { label: "Resgates", href: "/resgates", icon: <Package size={18} /> },
  { label: "Equipes", href: "/admin/equipes", icon: <Users size={18} />, adminOnly: true },
  { label: "Permissões", href: "/admin/permissoes", icon: <Shield size={18} />, adminOnly: true },
  { label: "Configurações", href: "/admin/configuracoes", icon: <Settings size={18} />, adminOnly: true },
];

interface TopbarProps {
  user: { name: string; email: string };
  tenant?: { nome: string; logo?: string; corPrimaria?: string };
  saldo?: { coins: number; pontos: number; giros: number };
}

export function Topbar({ user, tenant, saldo }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fecha drawer ao navegar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Bloqueia scroll quando drawer aberto
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await signOut();
    window.location.href = "/login";
  }

  function navigate(href: string) {
    router.push(href);
  }

  // Filtra itens admin por enquanto (depois integra com permissões reais)
  const visibleItems = navItems;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-(--color-border) bg-(--color-bg)/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 max-w-7xl mx-auto">
          {/* Esquerda: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-bg-subtle) transition-colors"
            >
              <Menu size={20} />
            </button>

            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
              {tenant?.logo ? (
                <img src={tenant.logo} alt={tenant.nome} className="h-8 w-auto" />
              ) : (
                <Logo />
              )}
            </button>
          </div>

          {/* Centro: nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleItems.map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`relative px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    active
                      ? "text-(--color-text)"
                      : "text-(--color-text-muted) hover:text-(--color-text)"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="topbar-indicator"
                      className="absolute -bottom-3.25 left-2 right-2 h-0.5 rounded-full bg-(--color-primary)"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Direita: saldo + avatar */}
          <div className="flex items-center gap-2">
            {/* Saldo */}
            {saldo && (
              <div className="hidden sm:flex items-center gap-3 mr-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-(--color-bg-subtle) border border-(--color-border)">
                  <Coins size={14} className="text-amber-400" />
                  <span className="text-xs font-semibold">{saldo.pontos.toLocaleString("pt-BR")}</span>
                </div>
              </div>
            )}

            {/* Avatar + dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-(--color-bg-subtle) transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-(--color-primary)/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-(--color-primary-light)">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`hidden sm:block text-(--color-text-muted) transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 bg-(--color-bg) border border-(--color-border) rounded-xl shadow-xl overflow-hidden"
                  >
                    {/* Info do usuário */}
                    <div className="px-4 py-3 border-b border-(--color-border)">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-(--color-text-muted) truncate">{user.email}</p>
                      {tenant && (
                        <p className="text-[10px] text-(--color-primary-light) mt-1 truncate">
                          {tenant.nome}
                        </p>
                      )}
                    </div>

                    {/* Saldo mobile */}
                    {saldo && (
                      <div className="sm:hidden px-4 py-2 border-b border-(--color-border) flex items-center justify-between">
                        <span className="text-xs text-(--color-text-muted)">Pontos</span>
                        <span className="text-sm font-semibold text-amber-400">{saldo.pontos.toLocaleString("pt-BR")}</span>
                      </div>
                    )}

                    <div className="py-1">
                      <DropdownItem
                        icon={<User size={16} />}
                        label="Meu perfil"
                        onClick={() => navigate("/perfil")}
                      />
                      <DropdownItem
                        icon={<ArrowLeftRight size={16} />}
                        label="Trocar empresa"
                        onClick={() => navigate("/selecionar-empresa")}
                      />
                      <div className="border-t border-(--color-border) my-1" />
                      <DropdownItem
                        icon={<LogOut size={16} />}
                        label="Sair"
                        onClick={handleSignOut}
                        danger
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-(--color-bg) border-r border-(--color-border) flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-(--color-border)">
                {tenant?.logo ? (
                  <img src={tenant.logo} alt={tenant.nome} className="h-8 w-auto" />
                ) : (
                  <Logo />
                )}
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-bg-subtle) transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer saldo */}
              {saldo && (
                <div className="px-4 py-3 border-b border-(--color-border)">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins size={16} className="text-amber-400" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-(--color-text-muted)">Pontos</p>
                        <p className="text-lg font-bold text-amber-400">{saldo.pontos.toLocaleString("pt-BR")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-(--color-text-muted)">Giros</p>
                      <p className="text-lg font-bold text-(--color-primary-light)">{saldo.giros}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto py-2 px-2">
                {visibleItems.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.2 }}
                      onClick={() => navigate(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
                        active
                          ? "bg-(--color-primary)/10 text-(--color-primary-light) font-medium"
                          : "text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-bg-subtle)"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="border-t border-(--color-border) p-3 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-(--color-bg-subtle)">
                  <div className="h-8 w-8 rounded-full bg-(--color-primary)/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-(--color-primary-light)">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-(--color-text-muted) truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-bg-subtle)"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}