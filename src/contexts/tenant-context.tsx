"use client";

import { createContext, useContext, useState } from "react";

interface Tenant {
  id: string;
  nome: string;
  corPrimaria: string;
  corSecundaria: string;
  logo: string | null;
  nomeMoeda: string;
  nomeMeta: string;
  nomePontos: string;
  nomeEquipe: string;
  nomeLoja: string;
}

interface TenantMembro {
  role: string;
  permissoes: string[];
}

interface TenantContextType {
  tenant: Tenant | null;
  membro: TenantMembro | null;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  atualizarTenant: (dados: Partial<Tenant>) => void;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  membro: null,
  loading: false,
  hasPermission: () => false,
  atualizarTenant: () => {},
});

export function TenantProvider({
  children,
  initialTenant,
  initialMembro,
}: {
  children: React.ReactNode;
  initialTenant: Tenant | null;
  initialMembro: TenantMembro | null;
}) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant);
  const [membro] = useState<TenantMembro | null>(initialMembro);

  function hasPermission(permission: string): boolean {
    if (!membro) return false;
    if (membro.role === "SUPER_ADMIN" || membro.role === "ADMIN") return true;
    return membro.permissoes.includes(permission);
  }

  function atualizarTenant(dados: Partial<Tenant>) {
    setTenant((prev) => prev ? { ...prev, ...dados } : prev);
  }

  return (
    <TenantContext.Provider value={{ tenant, membro, loading: false, hasPermission, atualizarTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}