import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import ResgatesClient from "./resgates-client";

export const dynamic = "force-dynamic";

export default async function ResgatesPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const [resgatesRes, membroRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/resgates`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/meu-acesso`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
  ]);

  const resgates = resgatesRes.ok ? await resgatesRes.json() : [];
  const membro   = membroRes.ok   ? await membroRes.json()   : null;

  const permissoes: string[] = membro?.grupo?.permissoes?.map((p: { chave: string }) => p.chave) ?? [];
  const podeAprovar =
    session.user.role === "ADMIN" || permissoes.includes("resgates.aprovar");

  return (
    <ResgatesClient
      tenantId={tenantId}
      resgatesIniciais={resgates}
      podeAprovar={podeAprovar}
    />
  );
}