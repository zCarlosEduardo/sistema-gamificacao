import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Providers } from "@/components/providers";
import {
  getServerMembro,
  getServerSession,
  getServerTenant,
} from "@/lib/auth-server";
import {
  getTenantIdFromCookie,
  setTenantIdCookie,
} from "@/lib/tenant-cookie";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Tenant {
  id: string;
  nome: string;
  slug: string;
  logo: string | null;
  corPrimaria: string;
}

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  let tenantId: string | null = await getTenantIdFromCookie();

  // Sem tenant selecionado
  if (!tenantId) {
    const cookieStore = await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tenants/meus-tenants`,
      {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );

    const tenantsData = await response.json();

    const tenants: Tenant[] = Array.isArray(tenantsData)
      ? tenantsData
      : tenantsData.data ?? tenantsData.tenants ?? [];

    // Nenhum tenant
    if (tenants.length === 0) {
      redirect("/trocar-empresa");
    }

    // Apenas 1 tenant → seleciona automático
    if (tenants.length === 1) {
      tenantId = tenants[0].id;

      await setTenantIdCookie(tenantId);
    }

    // Mais de 1 → escolher
    if (tenants.length > 1) {
      redirect("/trocar-empresa");
    }
  }

  // Garantia final para o TypeScript
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