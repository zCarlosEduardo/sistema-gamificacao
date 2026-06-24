import { apiServer } from "@/lib/api-server";
import { ResgatesClient } from "@/components/redemptions/resgates-client";
import type { Tenant, Member } from "@/types";
import { redirect } from "next/navigation";
import { canApproveRedemptions } from "@/lib/permissions";

export default async function ResgatesPage() {
  let member: Member | null = null;
  let tenantData: Tenant | null = null;

  try {
    member = await apiServer<Member>("/tenants/me");
  } catch {}

  if (!member || !canApproveRedemptions(member)) {
    redirect("/dashboard");
  }

  try {
    tenantData = await apiServer<Tenant>("/tenants/current");
  } catch {}

  const nomePontos = tenantData?.nomePontos ?? "Pontos";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-geist)]">Resgates</h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Aprove, rejeite e acompanhe as entregas
        </p>
      </div>

      <ResgatesClient nomePontos={nomePontos} />
    </div>
  );
}