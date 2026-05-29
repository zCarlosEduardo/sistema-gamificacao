import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import ProdutosClient from "./produtos-client";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const [categoriasRes, produtosRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias?tipo=PRODUTO`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
      headers: { cookie, "x-tenant-id": tenantId },
      cache: "no-store",
    }),
  ]);

  const [categorias, produtos] = await Promise.all([
    categoriasRes.json(),
    produtosRes.json(),
  ]);

  return (
    <ProdutosClient
      tenantId={tenantId}
      produtos={produtos}
      categorias={categorias}
    />
  );
}