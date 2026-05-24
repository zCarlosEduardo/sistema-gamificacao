import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { getActiveTenantId } from "@/lib/auth-server";
import TrocarEmpresaClient from "@/app/(private)/trocar-empresa/trocar-empresa-client";

export const dynamic = "force-dynamic";

export default async function TrocarEmpresaPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const [tenantsRes, tenantAtualId] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/meus-tenants`, {
      headers: {
        cookie: `better-auth.session_token=${session.session.token}`,
      },
      cache: "no-store",
    }),
    getActiveTenantId(),
  ]);

  const tenants = await tenantsRes.json();

  return (
    <TrocarEmpresaClient
      tenants={tenants}
      usuarioNome={session.user.name}
      tenantAtualId={tenantAtualId ?? undefined}
    />
  );
}