import { apiServer } from "@/lib/api-server";
import { MetasClient } from "@/components/goals/metas-client";
import type { PendingApproval, Goal, Tenant, Member } from "@/types";
import { redirect } from "next/navigation";
import { canApproveGoals } from "@/lib/permissions";

export default async function MetasPage() {
  let member: Member | null = null;
  let pendentes: PendingApproval[] = [];
  let metas: Goal[] = [];
  let tenantData: Tenant | null = null;

  try {
    member = await apiServer<Member>("/tenants/me");
  } catch {}

  if (!member || !canApproveGoals(member)) {
    redirect("/dashboard");
  }

  try {
    pendentes = await apiServer<PendingApproval[]>("/goals/pending-approvals");
  } catch {}

  try {
    metas = await apiServer<Goal[]>("/goals");
  } catch {}

  try {
    tenantData = await apiServer<Tenant>("/tenants/current");
  } catch {}

  const n = {
    meta: tenantData?.nomeMeta ?? "Meta",
    giro: tenantData?.nomeGiro ?? "Giro",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-geist)]">{n.meta}s</h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Aprove entregas e acompanhe o progresso
        </p>
      </div>

      <MetasClient
        pendentesIniciais={pendentes}
        metas={metas}
        nomeMeta={n.meta}
        nomeGiro={n.giro}
      />
    </div>
  );
}