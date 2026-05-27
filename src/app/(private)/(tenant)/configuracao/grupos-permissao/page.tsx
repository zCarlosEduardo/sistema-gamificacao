import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import GruposPermissaoClient, { type GrupoPermissao } from "./grupos-permissao-client";

export const dynamic = "force-dynamic";

export default async function GruposPermissaoPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/grupos`,
    {
      headers: {
        cookie,
        "x-tenant-id": tenantId,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) redirect("/trocar-empresa");

  const grupos: GrupoPermissao[] = await response.json();

  return <GruposPermissaoClient tenantId={tenantId} grupos={grupos} />;
}