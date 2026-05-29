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

  const [categoriasRes, produtosRes, saldoRes, configRes, resgatesRes] =
    await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias?tipo=PRODUTO`, {
        headers: { cookie, "x-tenant-id": tenantId },
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
        headers: { cookie, "x-tenant-id": tenantId },
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/funcionarios/me/saldo`, {
        headers: { cookie, "x-tenant-id": tenantId },
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/configuracoes/resgate`, {
        headers: { cookie, "x-tenant-id": tenantId },
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/resgates/historico`, {
        headers: { cookie, "x-tenant-id": tenantId },
        cache: "no-store",
      }),
    ]);

  const [categorias, produtos, saldoData, configResgate, resgates] =
    await Promise.all([
      categoriasRes.ok ? categoriasRes.json() : [],
      produtosRes.ok ? produtosRes.json() : [],
      saldoRes.ok ? saldoRes.json() : { saldo: 0 },
      configRes.ok ? configRes.json() : { ativo: false },
      resgatesRes.ok ? resgatesRes.json() : [],
    ]);

  return (
    <MercadoClient
      tenantId={tenantId}
      produtos={produtos}
      categorias={categorias}
      saldoInicial={saldoData.saldo ?? 0}
      resgateAtivo={configResgate.ativo ?? false}
      nomePeriodo={configResgate.nomePeriodo}
      resgatesIniciais={resgates}
    />
  );
}