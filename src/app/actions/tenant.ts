"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setTenantIdCookie } from "@/lib/tenant-cookie";

export async function selecionarTenant(tenantId: string) {
  await setTenantIdCookie(tenantId);
  redirect("/");
}

export async function limparTenantCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("tenant_id");
}