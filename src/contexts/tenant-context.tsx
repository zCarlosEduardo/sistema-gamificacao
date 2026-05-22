"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

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

export function TenantProvider({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string;
}) {
  const { data: session } = useSession();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [membro, setMembro] = useState<TenantMembro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("session:", session);
    console.log("tenantId:", tenantId);

    if (!session?.user || !tenantId) {
      setLoading(false); // <- aqui
      return;
    }

    async function fetchDados() {
      setLoading(true);
      try {
        const [tenantRes, membroRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`, {
            credentials: "include",
            headers: { "x-tenant-id": tenantId },
          }),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/meu-acesso`,
            {
              credentials: "include",
              headers: { "x-tenant-id": tenantId },
            },
          ),
        ]);

        const tenantData = await tenantRes.json();
        const membroData = await membroRes.json();

        setTenant(tenantData);
        setMembro({
          role: membroData.role,
          permissoes: membroData.permissoes.map(
            (p: { permissao: { chave: string } }) => p.permissao.chave,
          ),
        });
      } catch (err) {
        console.error("Erro ao buscar dados do tenant:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDados();
  }, [session, tenantId]);

function hasPermission(permission: string): boolean {
  console.log('hasPermission:', { permission, membro });
  if (!membro) return false;
  if (membro.role === "SUPER_ADMIN" || membro.role === "ADMIN") return true;
  return membro.permissoes.includes(permission);
}

  return (
    <TenantContext.Provider value={{ tenant, membro, loading, hasPermission }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
