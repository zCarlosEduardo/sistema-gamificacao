import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import PoolsClient from "./pools-client";

export const dynamic = "force-dynamic";

export default async function PoolsPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";
  const h = { cookie, "x-tenant-id": tenantId };

  const [poolRes, tenantRes, membrosRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pools`, { headers: h, cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`, { headers: h, cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/membros`, { headers: h, cache: "no-store" }),
  ]);

  const pool     = poolRes.ok     ? await poolRes.json()     : [];
  const tenant   = tenantRes.ok   ? await tenantRes.json()   : null;
  const membros  = membrosRes.ok  ? await membrosRes.json()  : [];

  const membrosAtivos = membros.filter((m: { ativo: boolean }) => m.ativo).length;

  return (
    <PoolsClient
      tenantId={tenantId}
      poolIniciais={pool}
      configInicial={{
        metasPorDia: 3,              // TODO: salvar no tenant (campo ainda não existe)
        taxaMargem: 3,               // TODO: salvar no tenant
        multiplicadorPontos: tenant?.multiplicadorPontos ?? 3,
        membrosAtivos,
      }}
    />
  );
}