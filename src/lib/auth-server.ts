import { headers } from "next/headers";

export async function getServerSession() {
  const headersList = await headers();
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/get-session`,
    {
      headers: {
        cookie: headersList.get("cookie") ?? "",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data ?? null;
}

export async function getServerMembro(tenantId: string, session: { user: { id: string } }) {
  const headersList = await headers();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/meu-acesso`,
    {
      headers: {
        cookie: headersList.get("cookie") ?? "",
        "x-tenant-id": tenantId,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) return null;

  return response.json();
}

export async function getServerTenant(tenantId: string) {
  const headersList = await headers();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`,
    {
      headers: {
        cookie: headersList.get("cookie") ?? "",
        "x-tenant-id": tenantId,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) return null;

  return response.json();
}