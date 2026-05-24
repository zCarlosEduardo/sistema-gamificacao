import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Providers } from "@/components/providers";
import {
  getServerMembro,
  getServerSession,
  getServerTenant,
  getActiveTenantId,
} from "@/lib/auth-server";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PrivadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const tenantId = await getActiveTenantId();

  // Sem empresa selecionada
  if (!tenantId) {
    redirect("/trocar-empresa");
  }

  const [tenant, membroRaw] = await Promise.all([
    getServerTenant(tenantId),
    getServerMembro(tenantId, session),
  ]);

  if (!tenant || !membroRaw || !membroRaw.ativo) {
    redirect("/trocar-empresa");
  }

  const membro = {
    role: membroRaw.grupo?.nome ?? "JOGADOR",
    permissoes:
      membroRaw.grupo?.permissoes?.map(
        (p: { chave: string }) => p.chave
      ) ?? [],
  };

  return (
    <Providers initialTenant={tenant} initialMembro={membro}>
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
        <Topbar
          initialUser={session.user}
          initialTenant={tenant}
          initialMembro={membro}
        />

        <main className="px-6 py-6">
          {children}
        </main>
      </div>
    </Providers>
  );
}