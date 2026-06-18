"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Target,
  Dices,
  ShoppingBag,
  Package,
  Users,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  Coins,
  Star,
  RotateCw,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuJogador: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  { label: "Minhas Metas", href: "/metas", icon: <Target size={20} /> },
  { label: "Roleta", href: "/roleta", icon: <Dices size={20} /> },
  { label: "Loja", href: "/loja", icon: <ShoppingBag size={20} /> },
  { label: "Meus Resgates", href: "/resgates", icon: <Package size={20} /> },
];

const menuAdmin: MenuItem[] = [
  { label: "Equipes", href: "/admin/equipes", icon: <Users size={20} /> },
  {
    label: "Permissões",
    href: "/admin/permissoes",
    icon: <Shield size={20} />,
  },
  {
    label: "Configurações",
    href: "/admin/configuracoes",
    icon: <Settings size={20} />,
  },
];

interface SidebarProps {
  saldo?: {
    coins: number;
    pontos: number;
    giros: number;
  };
  tenantNome?: string;
}

export function Sidebar({ saldo, tenantNome }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] z-50 transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--color-border)]">
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          <span className="text-sm font-semibold truncate">
            {tenantNome || "Await"}
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ChevronLeft
            size={18}
            className={cn(
              "transition-transform duration-300",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Saldo */}
      {saldo && (
        <div
          className={cn(
            "px-3 py-3 border-b border-[var(--color-border)] space-y-1.5 transition-all duration-300",
            collapsed && "px-2",
          )}
        >
          <SaldoItem
            icon={<Coins size={16} className="text-amber-400" />}
            label="Coins"
            value={saldo.coins}
            collapsed={collapsed}
          />
          <SaldoItem
            icon={<Star size={16} className="text-[var(--color-primary)]" />}
            label="Pontos"
            value={saldo.pontos}
            collapsed={collapsed}
          />
          <SaldoItem
            icon={<RotateCw size={16} className="text-emerald-400" />}
            label="Giros"
            value={saldo.giros}
            collapsed={collapsed}
          />
        </div>
      )}

      {/* Menu principal */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <MenuSection
          items={menuJogador}
          pathname={pathname}
          collapsed={collapsed}
        />

        <div className="my-3 mx-2 border-t border-[var(--color-border)]" />

        <p
          className={cn(
            "px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] transition-all duration-300",
            collapsed && "opacity-0 h-0 mb-0 overflow-hidden",
          )}
        >
          Administração
        </p>
        <MenuSection
          items={menuAdmin}
          pathname={pathname}
          collapsed={collapsed}
        />
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-[var(--color-border)]">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut size={20} />
          <span
            className={cn(
              "transition-all duration-300",
              collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100",
            )}
          >
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
}

function MenuSection({
  items,
  pathname,
  collapsed,
}: {
  items: MenuItem[];
  pathname: string;
  collapsed: boolean;
}) {
  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative",
              collapsed && "justify-center px-0",
              isActive
                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]",
            )}
          >
            {/* Indicador ativo */}
            <div
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-[var(--color-primary)] transition-all duration-300",
                isActive ? "h-5 opacity-100" : "h-0 opacity-0",
              )}
            />

            <span
              className={cn(
                "transition-transform duration-200",
                isActive && "scale-110",
              )}
            >
              {item.icon}
            </span>

            <span
              className={cn(
                "transition-all duration-300 whitespace-nowrap",
                collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100",
              )}
            >
              {item.label}
            </span>

            {/* Tooltip quando collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50">
                {item.label}
              </div>
            )}
          </Link>
        );
      })}
    </>
  );
}

function SaldoItem({
  icon,
  label,
  value,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  collapsed: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md group relative",
        collapsed && "justify-center px-0",
      )}
    >
      {icon}
      <div
        className={cn(
          "flex items-center justify-between flex-1 transition-all duration-300",
          collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100",
        )}
      >
        <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
        <span className="text-xs font-semibold">
          {value.toLocaleString("pt-BR")}
        </span>
      </div>

      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50">
          {label}: {value.toLocaleString("pt-BR")}
        </div>
      )}
    </div>
  );
}
