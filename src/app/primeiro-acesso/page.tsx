import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { PrimeiroAcessoClient } from "./primeiro-acesso-client";

export default async function PrimeiroAcessoPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  if (!(session.user as any).primeiroAcesso) redirect("/");

  return (
    <PrimeiroAcessoClient
      userId={session.user.id}
      userName={session.user.name}
    />
  );
}