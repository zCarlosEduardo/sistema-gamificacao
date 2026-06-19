import { Topbar } from "@/components/layout/topbar";
import { apiServer } from "@/lib/api-server";
import { redirect } from "next/navigation";
import type { User, Tenant, Member } from "@/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let user: User;
  let tenantData: Tenant | null = null;
  let currentMember: Member | null = null;

  try {
    const res = await apiServer<{ user: User }>("/users/me");
    user = res.user;
  } catch {
    redirect("/login");
  }

  try {
    tenantData = await apiServer<Tenant>("/tenants/current");
  } catch {}

  try {
    currentMember = await apiServer<Member>("/tenants/me");
  } catch {}

  return (
    <div className="min-h-screen">
      <Topbar
        user={{ name: user.name, email: user.email }}
        tenant={tenantData ? {
          nome: tenantData.nome,
          logo: tenantData.logo,
          corPrimaria: tenantData.corPrimaria,
        } : undefined}
        saldo={currentMember ? {
          coins: currentMember.saldoCoins,
          pontos: currentMember.saldoPontos,
          giros: currentMember.girosDisponiveis,
        } : undefined}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}