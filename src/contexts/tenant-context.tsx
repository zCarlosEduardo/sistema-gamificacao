"use client";

import { createContext, useContext, useState } from "react";

interface Tenant {
  id: string;
  nome: string;
  slug: string;
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
  role: "SUPER_ADMIN" | "ADMIN" | "MEMBRO";
  permissoes: string[];
}

interface TenantContextType {
  tenant: Tenant | null;
  membro: TenantMembro | null;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  membro: null,
  loading: false,
  hasPermission: () => false,
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
  const [tenant] = useState<Tenant | null>(initialTenant);
  const [membro] = useState<TenantMembro | null>(initialMembro);

  function hasPermission(permission: string): boolean {
    if (!membro) return false;
    if (membro.role === "SUPER_ADMIN" || membro.role === "ADMIN") return true;
    return membro.permissoes.includes(permission);
  }

  return (
    <TenantContext.Provider value={{ tenant, membro, loading: false, hasPermission }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}