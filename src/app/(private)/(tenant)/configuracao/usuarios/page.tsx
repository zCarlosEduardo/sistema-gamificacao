import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import UsuariosClient from "./usuarios-client";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const [membrosRes, gruposRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/membros`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/grupos`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
  ]);

  const membros = membrosRes.ok ? await membrosRes.json() : [];
  const grupos = gruposRes.ok ? await gruposRes.json() : [];

  return (
    <UsuariosClient
      membros={membros}
      grupos={grupos}
      tenantId={tenantId}
    />
  );
}