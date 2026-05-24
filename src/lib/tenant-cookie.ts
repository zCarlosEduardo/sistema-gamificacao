import { cookies } from "next/headers";

export const TENANT_COOKIE = "tenant_id";

export async function getTenantIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(TENANT_COOKIE)?.value ?? null;
}

export async function setTenantIdCookie(tenantId: string) {
  const cookieStore = await cookies();

  cookieStore.set(TENANT_COOKIE, tenantId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function removeTenantIdCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(TENANT_COOKIE);
}