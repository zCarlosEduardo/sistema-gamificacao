import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return children;
}