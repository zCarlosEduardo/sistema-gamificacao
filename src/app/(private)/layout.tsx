import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Providers } from "@/components/providers";
import { TENANT_ID_FIXO } from "@/lib/constants";
import { getServerMembro, getServerSession, getServerTenant } from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PrivadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const [tenant, membroRaw] = await Promise.all([
    getServerTenant(TENANT_ID_FIXO),
    getServerMembro(TENANT_ID_FIXO, session),
  ]);

  const membro = membroRaw ? {
    role: membroRaw.role,
    permissoes: membroRaw.permissoes.map(
      (p: { permissao: { chave: string } }) => p.permissao.chave
    ),
  } : null;

  return (
    <Providers initialTenant={tenant} initialMembro={membro}>
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
        <Topbar
          initialUser={session.user}
          initialTenant={tenant}
          initialMembro={membro}
        />
        <main className="px-6 py-6">{children}</main>
      </div>
    </Providers>
  );
}