"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Paintbrush,
  ShieldCheck,
  Users,
  Tag,
  X,
  AlignLeft,
  ChevronRight,
  Settings2,
  Package,
  Megaphone,
} from "lucide-react";
import { CanAccess } from "@/components/ui/can-access";
import { useTenant } from "@/contexts/tenant-context";

// ──────────────────────────────────────────────────────────────
// Helpers de cor
// ──────────────────────────────────────────────────────────────

/** Converte hex para RGB */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/** Luminância relativa — decide se o texto sobre a cor deve ser branco ou preto */
function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance < 0.55;
}

/** Retorna a cor com opacidade (para bg do item ativo em white mode) */
function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

// ──────────────────────────────────────────────────────────────
// Menu items com ícones Lucide
// ──────────────────────────────────────────────────────────────
const menuItems = [
  {
    label: "Empresa",
    href: "/configuracoes/empresa",
    permission: "personalizacao.ver",
    Icon: Building2,
    descricao: "Nome e identidade",
  },
  {
    label: "Grupos de Acesso",
    href: "/configuracoes/grupos-permissao",
    permission: "usuarios.ver",
    Icon: ShieldCheck,
    descricao: "Permissões e grupos",
  },
  {
    label: "Usuários",
    href: "/configuracoes/usuarios",
    permission: "usuarios.ver",
    Icon: Users,
    descricao: "Usuários do sistema",
  },
  {
    label: "Produtos",
    href: "/configuracoes/produtos",
    permission: "mercado.ver",
    Icon: Package,
    descricao: "Produtos em geral",
  },
  {
    label: "Categorias",
    href: "/configuracoes/categorias",
    permission: "mercado.ver",
    Icon: Tag,
    descricao: "Categorias em geral",
  },
  {
    label: "Personalização",
    href: "/configuracoes/personalizacao",
    permission: "personalizacao.ver",
    Icon: Paintbrush,
    descricao: "Nomenclaturas",
  },
  {
    label: "Avisos",
    href: "/configuracoes/avisos",
    permission: "",
    Icon: Megaphone,
    descricao: "Notificações e comunicados",
  },
];

function getActiveItem(pathname: string) {
  return menuItems.find((i) => i.href === pathname);
}

// ──────────────────────────────────────────────────────────────
// Nav compartilhado
// ──────────────────────────────────────────────────────────────
function ConfigNav({
  pathname,
  onNavigate,
  corPrimaria,
  stagger = false,
}: {
  pathname: string;
  onNavigate: (href: string) => void;
  corPrimaria: string;
  stagger?: boolean;
}) {

  return (
    <nav className="flex flex-col gap-0.5">
      {menuItems.map((item, i) => {
        const ativo = pathname === item.href;
        const { Icon } = item;

        return (
          <CanAccess key={item.href} permission={item.permission}>
            <motion.button
              {...(stagger
                ? {
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: i * 0.05, duration: 0.2 },
                  }
                : {})}
              onClick={() => onNavigate(item.href)}
              className="relative w-full text-left px-3 py-2.5 rounded-lg transition-all group"
              style={
                ativo
                  ? {
                      background: hexToRgba(corPrimaria, 0.1),
                      color: corPrimaria,
                    }
                  : undefined
              }
            >
              {/* Estado inativo — Tailwind cuida das cores */}
              {!ativo && (
                <span className="absolute inset-0 rounded-lg transition-colors group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60" />
              )}

              <div className="relative flex items-center gap-2.5">
                {/* Ícone */}
                <span
                  className={`shrink-0 transition-colors ${
                    ativo
                      ? ""
                      : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                  }`}
                  style={ativo ? { color: corPrimaria } : undefined}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </span>

                {/* Texto */}
                <div className="min-w-0">
                  <p
                    className={`text-sm leading-none transition-colors ${
                      ativo
                        ? "font-semibold text-zinc-800 dark:text-zinc-100"
                        : "font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-xs mt-0.5 transition-colors ${
                      ativo ? "opacity-70 " : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {item.descricao}
                  </p>
                </div>
              </div>

              {/* Indicador lateral com cor do tenant */}
              {ativo && (
                <motion.div
                  layoutId="config-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: corPrimaria }}
                />
              )}
            </motion.button>
          </CanAccess>
        );
      })}
    </nav>
  );
}

// ──────────────────────────────────────────────────────────────
// Drawer mobile
// ──────────────────────────────────────────────────────────────
function MobileConfigDrawer({
  open,
  onClose,
  pathname,
  onNavigate,
  corPrimaria,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  onNavigate: (href: string) => void;
  corPrimaria: string;
}) {
  const dark = isColorDark(corPrimaria);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
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
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shadow-2xl"
          >
            {/* Header colorido com a cor do tenant */}
            <div className="flex items-center justify-between px-4 h-14 shrink-0">
              <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-300">
                <Settings2 size={15} strokeWidth={2} />
                <p className="text-xs font-semibold uppercase tracking-widest">
                  Configurações
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar menu"
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{
                  background: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto p-3">
              <ConfigNav
                pathname={pathname}
                onNavigate={onNavigate}
                corPrimaria={corPrimaria}
                stagger
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ──────────────────────────────────────────────────────────────
// Layout principal
// ──────────────────────────────────────────────────────────────
export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { tenant } = useTenant();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const corPrimaria = (tenant as any)?.corPrimaria ?? "#7C3AED";
  const dark = isColorDark(corPrimaria);

  const [drawerAberto, setDrawerAberto] = useState(false);

  function handleNavigate(href: string) {
    router.push(href);
    setDrawerAberto(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerAberto(false);
  }, [pathname]);

  const activeItem = getActiveItem(pathname);
  const ActiveIcon = activeItem?.Icon ?? Settings2;

  return (
    <>
      {/* ── Barra de contexto mobile — com cor do tenant ── */}
      <div
        className="lg:hidden border-b px-4 py-0 flex items-center h-11 rounded-lg tracking-wider dark:border-zinc-50 shrink-0"
        style={{
          background: corPrimaria,
        }}
      >
        <button
          onClick={() => setDrawerAberto(true)}
          className="flex items-center gap-2 w-full h-full"
        >
          {/* Hamburguer */}
          <AlignLeft
            size={15}
            strokeWidth={2}
            className="text-zinc-50 shrink-0"
          />

          {/* Breadcrumb */}
          <span
            className="text-xs uppercase tracking-widest font-semibold shrink-0 text-zinc-50"
          >
            Configurações
          </span>

          <ChevronRight
            size={13}
            className="text-zinc-50 shrink-0"

          />

          <ActiveIcon
            size={13}
            strokeWidth={2}
            className="text-zinc-50 shrink-0"
          />

          <span
            className="text-sm font-semibold truncate dark text-zinc-50"
          >
            {activeItem?.label ?? "Configurações"}
          </span>
        </button>
      </div>

      {/* ── Layout desktop ── */}
      <div className="flex gap-6 min-h-[calc(100vh-56px)]">
        {/* Sidebar — só desktop */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0">
          {/* Cabeçalho da sidebar com cor do tenant */}
          <div className="sticky top-0 rounded-b-xl overflow-hidden">
            <div
              className="px-4 py-3 flex items-center gap-2"
              // style={{ background: corPrimaria }}
            >
              <Settings2
                size={18}
                strokeWidth={2}
                className="dark:text-zinc-50"
              />
              <p
                className="text-xs font-semibold uppercase tracking-widest dark:text-zinc-50"
              >
                Configurações
              </p>
            </div>
          </div>

          {/* Nav */}
          <div className="pt-2 px-1">
            <ConfigNav
              pathname={pathname}
              onNavigate={handleNavigate}
              corPrimaria={corPrimaria}
            />
          </div>
        </aside>

        {/* Divisor — só desktop */}
        <div className="hidden lg:block w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />

        {/* Conteúdo */}
        <main className="flex-1 min-w-0 py-1">{children}</main>
      </div>

      {/* Drawer mobile */}
      <MobileConfigDrawer
        open={drawerAberto}
        onClose={() => setDrawerAberto(false)}
        pathname={pathname}
        onNavigate={handleNavigate}
        corPrimaria={corPrimaria}
      />
    </>
  );
}
