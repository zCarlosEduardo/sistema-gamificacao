import { redirect } from "next/navigation";
import { getServerSession, getActiveTenantId, getServerMembro } from "@/lib/auth-server";
import { PerfilClient } from "./perfil-client";

export default async function PerfilPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const membroRaw = await getServerMembro(tenantId, session).catch(() => null);

  return (
    <PerfilClient
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        cpf: (session.user as any).cpf ?? null,
        image: (session.user as any).image ?? null,
      }}
    />
  );
}