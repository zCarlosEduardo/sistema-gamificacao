import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import GruposPermissaoClient from "./grupos-permissao-client";

export const dynamic = "force-dynamic";

export default async function GruposPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/grupos`,
    {
      headers: {
        cookie,
        "x-tenant-id": tenantId,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) redirect("/configuracoes");

  const grupos = await res.json();

  return <GruposPermissaoClient tenantId={tenantId} grupos={grupos} />;
}