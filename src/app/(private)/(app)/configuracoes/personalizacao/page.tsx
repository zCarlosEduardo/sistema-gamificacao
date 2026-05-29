import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import PersonalizacaoClient from "./personalizacao-client";

export const dynamic = "force-dynamic";

export default async function PersonalizacaoPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`,
    {
      headers: {
        cookie,
        "x-tenant-id": tenantId,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) redirect("/trocar-empresa");

  const tenant = await response.json();

  return <PersonalizacaoClient tenant={tenant} />;
}