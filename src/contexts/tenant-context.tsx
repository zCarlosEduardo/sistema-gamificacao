"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

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
  loading: true,
  hasPermission: () => false,
});

const CACHE_KEY = "tenant_cache";

function getCache(tenantId: string) {
  try {
    const raw = sessionStorage.getItem(`${CACHE_KEY}_${tenantId}`);
    if (!raw) return null;
    return JSON.parse(raw) as { tenant: Tenant; membro: TenantMembro };
  } catch {
    return null;
  }
}

function setCache(tenantId: string, data: { tenant: Tenant; membro: TenantMembro }) {
  try {
    sessionStorage.setItem(`${CACHE_KEY}_${tenantId}`, JSON.stringify(data));
  } catch {}
}

export function TenantProvider({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string;
}) {
  const fetchedRef = useRef(false);

  const [state, setState] = useState<{
    tenant: Tenant | null;
    membro: TenantMembro | null;
    loading: boolean;
  }>({
    tenant: null,
    membro: null,
    loading: true,
  });

  useEffect(() => {
    if (!tenantId) return;

    // Navegação client-side: já tem dados, não refaz
    if (fetchedRef.current && state.tenant) return;

    // Tenta cache primeiro
    const cached = getCache(tenantId);
    if (cached) {
      setState({ tenant: cached.tenant, membro: cached.membro, loading: false });
      fetchedRef.current = true;
      return;
    }

    fetchedRef.current = true;

    async function fetchDados() {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const [tenantRes, membroRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`, {
            credentials: "include",
            headers: { "x-tenant-id": tenantId },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/meu-acesso`, {
            credentials: "include",
            headers: { "x-tenant-id": tenantId },
          }),
        ]);

        if (!tenantRes.ok || !membroRes.ok) {
          throw new Error("Erro na requisição dos dados do Tenant");
        }

        const tenantData = await tenantRes.json();
        const membroData = await membroRes.json();

        const membroFormatado: TenantMembro = {
          role: membroData.role,
          permissoes: membroData.permissoes.map(
            (p: { permissao: { chave: string } }) => p.permissao.chave,
          ),
        };

        setCache(tenantId, { tenant: tenantData, membro: membroFormatado });
        setState({ tenant: tenantData, membro: membroFormatado, loading: false });
      } catch (err) {
        console.error("Erro ao buscar dados do tenant:", err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchDados();
  }, [tenantId]);

  function hasPermission(permission: string): boolean {
    if (!state.membro) return false;
    if (state.membro.role === "SUPER_ADMIN" || state.membro.role === "ADMIN") return true;
    return state.membro.permissoes.includes(permission);
  }

  return (
    <TenantContext.Provider value={{ ...state, hasPermission }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}