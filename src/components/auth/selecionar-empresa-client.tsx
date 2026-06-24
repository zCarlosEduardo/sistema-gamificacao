"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { TenantListItem } from "@/types";

interface SelecionarEmpresaClientProps {
  tenants: TenantListItem[];
}

export function SelecionarEmpresaClient({ tenants }: SelecionarEmpresaClientProps) {
  const router = useRouter();
  const [selecionando, setSelecionando] = useState<string | null>(null);

  async function handleSelect(tenantId: string) {
    setSelecionando(tenantId);

    try {
      await api.post("/tenants/select", { tenantId });
      // Usa window.location pra forçar reload e o layout buscar os dados do novo tenant
      window.location.href = "/dashboard";
    } catch {
      setSelecionando(null);
    }
  }

  return (
    <div className="space-y-2">
      {tenants.map((tenant) => {
        const isLoading = selecionando === tenant.id;

        return (
          <button
            key={tenant.id}
            onClick={() => handleSelect(tenant.id)}
            disabled={!!selecionando}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-(--color-border) bg-(--color-bg-subtle) hover:border-(--color-primary)/40 hover:bg-(--color-primary)/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left group"
          >
            {/* Logo ou ícone */}
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
              style={{ backgroundColor: `${tenant.corPrimaria}20` }}
            >
              {tenant.logo ? (
                <img src={tenant.logo} alt={tenant.nome} className="w-full h-full object-cover" />
              ) : (
                <Building2 size={22} style={{ color: tenant.corPrimaria }} />
              )}
            </div>

            {/* Nome */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{tenant.nome}</p>
            </div>

            {/* Seta ou loading */}
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-(--color-primary)" />
            ) : (
              <ChevronRight size={18} className="text-(--color-text-muted) group-hover:text-(--color-primary) transition-colors" />
            )}
          </button>
        );
      })}
    </div>
  );
}