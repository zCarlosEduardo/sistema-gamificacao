import { apiServer } from "@/lib/api-server";
import { SelecionarEmpresaClient } from "@/components/auth/selecionar-empresa-client";
import { redirect } from "next/navigation";
import type { TenantListItem } from "@/types";

export default async function SelecionarEmpresaPage() {
  let tenants: TenantListItem[] = [];

  try {
    const res = await apiServer<{ tenants: TenantListItem[]; needsSelection: boolean }>("/tenants/mine");
    tenants = res.tenants;
  } catch {
    redirect("/login");
  }

  // Se só tem 1 tenant, nem precisa escolher — vai direto
  if (tenants.length === 1) {
    redirect("/dashboard");
  }

  // Se não tem nenhum, algo errado
  if (tenants.length === 0) {
    redirect("/login");
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-geist)]">
          Escolha a empresa
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Você tem acesso a mais de uma empresa
        </p>
      </div>

      <SelecionarEmpresaClient tenants={tenants} />
    </div>
  );
}