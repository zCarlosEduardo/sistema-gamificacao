"use server";

import { redirect } from "next/navigation";
import { setTenantIdCookie } from "@/lib/tenant-cookie";

export async function selecionarTenant(tenantId: string) {
  await setTenantIdCookie(tenantId);

  redirect("/");
}