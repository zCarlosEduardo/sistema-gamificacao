import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession, getActiveTenantId } from "@/lib/auth-server";
import MetasClient from "./metas-client";

export const dynamic = "force-dynamic";

export default async function MetasPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";
  const h = { cookie, "x-tenant-id": tenantId };

  // Membro atual
  const membroRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/meu-acesso`,
    { headers: h, cache: "no-store" },
  );
  const membroAtual = membroRes.ok ? await membroRes.json() : null;
  if (!membroAtual) redirect("/login");

  const permissoes: string[] =
    membroAtual?.grupo?.permissoes?.map((p: { chave: string }) => p.chave) ??
    [];

  const isGestor =
    session.user.role === "ADMIN" || permissoes.includes("metas.criar");

  // Fetches paralelos
  const [metasRes, equipesCatRes, membrosRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/metas`, {
      headers: h,
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias?tipo=EQUIPE`, {
      headers: h,
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/membros`, {
      headers: h,
      cache: "no-store",
    }),
  ]);

  const todasMetas = metasRes.ok ? await metasRes.json() : [];
  const equipesCat: { id: string; nome: string }[] = equipesCatRes.ok
    ? await equipesCatRes.json()
    : [];
  const membrosRaw: {
    id: string;
    equipes: { equipe: { id: string } }[];
    usuario: { id: string; name: string; email: string; image: string | null };
  }[] = membrosRes.ok ? await membrosRes.json() : [];

  // Equipes do membro atual (para filtrar o que ele pode ver/gerenciar)
  const equipeIdsDoMembro = new Set(
    membrosRaw
      .find((mb) => mb.id === membroAtual.id)
      ?.equipes?.map((e) => e.equipe.id) ?? [],
  );

  // Gestor vê todas as metas; jogador só vê metas da sua equipe ou individuais dele
  const metasFiltradas = isGestor
    ? todasMetas
    : todasMetas.filter(
        (m: {
          equipeId: string | null;
          metasUsuario: { membro: { id: string } }[];
        }) => {
          if (m.equipeId && equipeIdsDoMembro.has(m.equipeId)) return true;
          if (
            !m.equipeId &&
            m.metasUsuario.some(
              (mu: { membro: { id: string } }) =>
                mu.membro.id === membroAtual.id,
            )
          )
            return true;
          return false;
        },
      );

  // Equipes que o gestor pode gerenciar (todas) ou que o jogador pertence
  const equipes = isGestor
    ? equipesCat
    : equipesCat.filter((eq) => equipeIdsDoMembro.has(eq.id));

  // Usuários disponíveis para meta individual (membros ativos do tenant)
  const usuarios = isGestor
    ? membrosRaw.map((mb) => ({ id: mb.usuario.id, name: mb.usuario.name }))
    : [];

  return (
    <MetasClient
      tenantId={tenantId}
      metas={metasFiltradas}
      equipes={equipes}
      usuarios={usuarios}
      isGestor={isGestor}
    />
  );
}
