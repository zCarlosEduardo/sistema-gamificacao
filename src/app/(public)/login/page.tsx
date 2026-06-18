import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import LoginClient from "./login-client";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/");
  }

  return <LoginClient />;
}