import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession, getActiveTenantId, getServerMembro } from "@/lib/auth-server";
import MetasClient from "./metas-client";

export const dynamic = "force-dynamic";

export default async function MetasPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const membroRaw = await getServerMembro(tenantId, session).catch(() => null);
  if (!membroRaw) redirect("/trocar-empresa");

  const permissoes =
    membroRaw.grupo?.permissoes?.map((p: { chave: string }) => p.chave) ?? [];
  const role = membroRaw.grupo?.nome ?? "";

  const podeVer     = permissoes.includes("metas.ver");
  const podeCriar   = permissoes.includes("metas.criar");
  const podeAprovar = permissoes.includes("metas.aprovar");
  const eAdmin      = role === "ADMIN" || permissoes.includes("personalizacao.editar");

  // Gestor/admin vê todas as metas, jogador só as suas
  const isGestorOuAdmin = podeCriar || podeAprovar || eAdmin;

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const [metasRes, membrosRes, equipeRes] = await Promise.all([
    fetch(
      isGestorOuAdmin
        ? `${process.env.NEXT_PUBLIC_API_URL}/metas`
        : `${process.env.NEXT_PUBLIC_API_URL}/metas/minhas`,
      { headers: { cookie, "x-tenant-id": tenantId }, cache: "no-store" },
    ),
    isGestorOuAdmin
      ? fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/membros`, {
          headers: { cookie, "x-tenant-id": tenantId },
          cache: "no-store",
        })
      : Promise.resolve(null),
    isGestorOuAdmin
      ? fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias?tipo=EQUIPE`, {
          headers: { cookie, "x-tenant-id": tenantId },
          cache: "no-store",
        })
      : Promise.resolve(null),
  ]);

  const metas   = metasRes.ok          ? await metasRes.json()   : [];
  const membros = membrosRes?.ok        ? await membrosRes.json() : [];
  const equipes = equipeRes?.ok         ? await equipeRes.json()  : [];

  let pendentes: any[] = [];
  if (podeAprovar || eAdmin) {
    const pendentesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/metas/pendentes`,
      { headers: { cookie, "x-tenant-id": tenantId }, cache: "no-store" },
    );
    pendentes = pendentesRes.ok ? await pendentesRes.json() : [];
  }

  return (
    <MetasClient
      tenantId={tenantId}
      metas={metas}
      membros={membros}
      equipes={equipes}
      pendentes={pendentes}
      usuarioId={session.user.id}
      podeVer={podeVer}
      podeCriar={podeCriar}
      podeAprovar={podeAprovar}
      eAdmin={eAdmin}
    />
  );
}