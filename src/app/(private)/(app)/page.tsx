import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  getServerSession,
  getActiveTenantId,
  getServerMembro,
} from "@/lib/auth-server";
import { DashboardJogador } from "./_components/dashboard-jogador";
import { DashboardGestor } from "./_components/dashboard-gestor";
import { DashboardAdmin } from "./_components/dashboard-admin";

async function fetchDashboard(rota: string, tenantId: string) {
  const headersList = await headers();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/${rota}`,
    {
      headers: {
        cookie: headersList.get("cookie") ?? "",
        "x-tenant-id": tenantId,
      },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getActiveTenantId();
  if (!tenantId) redirect("/trocar-empresa");

  const membroRaw = await getServerMembro(tenantId, session).catch(() => null);
  if (!membroRaw) redirect("/trocar-empresa");

  const permissoes =
    membroRaw.grupo?.permissoes?.map((p: { chave: string }) => p.chave) ?? [];
  const role = membroRaw.grupo?.nome ?? "";

  // Baseado em permissões — funciona com grupos customizados também
  const podeJogar = permissoes.includes("roleta.jogar");
  const eGestor = permissoes.includes("equipe.gerenciar");

  // Admin: grupo nativo ADMIN ou quem tem personalizacao.editar (permissão exclusiva de admin)
  const eAdmin =
    role === "ADMIN" || permissoes.includes("personalizacao.editar");

  const [dadosJogador, dadosGestor, dadosAdmin] = await Promise.all([
    podeJogar ? fetchDashboard("jogador", tenantId) : null,
    eGestor ? fetchDashboard("gestor", tenantId) : null,
    eAdmin ? fetchDashboard("admin", tenantId) : null,
  ]);

  const naoTemAcesso = !eAdmin && !eGestor && !podeJogar;

  return (
    <div className="space-y-8">
      {eAdmin && dadosAdmin && <DashboardAdmin dados={dadosAdmin} />}
      {eGestor && dadosGestor && <DashboardGestor dados={dadosGestor} />}
      {podeJogar && dadosJogador && (
        <DashboardJogador dados={dadosJogador} userName={session.user.name} />
      )}
      {naoTemAcesso && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3">
          <span className="text-5xl">👋</span>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Bem-vindo! Seu acesso está configurado como visualizador.
          </p>
        </div>
      )}
    </div>
  );
}
