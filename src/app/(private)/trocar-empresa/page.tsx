import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import TrocarEmpresaClient from "./trocar-empresa-client";
import { getActiveTenantId } from "@/lib/auth-server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function TrocarEmpresaPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const tenantAtualId = await getActiveTenantId();

  const cookieStore = await cookies();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tenants/meus-tenants`,
    {
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );

  const tenantsData = await response.json();

  const tenants = Array.isArray(tenantsData)
    ? tenantsData
    : tenantsData.data ?? tenantsData.tenants ?? [];

  return (
    <TrocarEmpresaClient
      tenants={tenants}
      usuarioNome={session.user.name}
      tenantAtualId={tenantAtualId ?? undefined}
    />
  );
}