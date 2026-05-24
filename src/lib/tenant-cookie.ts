import { cookies } from "next/headers";

export const TENANT_COOKIE = "tenant_id";

export async function getTenantIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TENANT_COOKIE)?.value ?? null;
}