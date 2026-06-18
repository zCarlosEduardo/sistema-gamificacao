import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import MercadoClient from "./mercado-client";

export const dynamic = "force-dynamic";

export default async function MercadoPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const [categoriasRes, produtosRes, membroRes, resgatesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias?tipo=PRODUTO`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/meu-acesso`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/resgates/historico`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
  ]);

  const [categorias, produtos, membro] = await Promise.all([
    categoriasRes.ok ? categoriasRes.json() : [],
    produtosRes.ok ? produtosRes.json() : [],
    membroRes.ok ? membroRes.json() : null,
  ]);

  return (
    <MercadoClient
      tenantId={tenantId}
      produtos={produtos}
      categorias={categorias}
      saldoInicial={membro?.saldoPontos ?? 0}
      resgateAtivo={true}
      resgatesIniciais={resgatesRes.ok ? await resgatesRes.json() : []}
    />
  );
}
