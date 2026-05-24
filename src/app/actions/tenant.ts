"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function selecionarTenant(tenantId: string) {
  try {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get(
      "better-auth.session_token"
    )?.value;

    if (!sessionToken) {
      redirect("/login");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tenants/selecionar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `better-auth.session_token=${sessionToken}`,
        },
        body: JSON.stringify({
          tenantId,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao selecionar empresa");
    }
  } catch (error) {
    console.error("Erro ao selecionar tenant:", error);
    throw error;
  }

  redirect("/");
}