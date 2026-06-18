import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import MeusResgatesClient from "./meus-resgates-client";

export const dynamic = "force-dynamic";

export default async function MeusResgatesPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resgates/historico`, {
    headers: { cookie, "x-tenant-id": tenantId },
    cache: "no-store",
  });

  const resgates = res.ok ? await res.json() : [];

  return <MeusResgatesClient resgatesIniciais={resgates} />;
}