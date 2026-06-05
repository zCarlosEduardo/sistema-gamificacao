import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AvisosClient from "./avisos-client";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  return (
    <AvisosClient/>
  );
}