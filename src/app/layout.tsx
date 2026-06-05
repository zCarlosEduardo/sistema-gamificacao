import { getActiveTenantId, getServerTenant } from "@/lib/auth-server";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";


export async function generateMetadata() {
  const tenantId = await getActiveTenantId();

  if (!tenantId) {
    return {
      title: "Await",
    };
  }

  const tenant = await getServerTenant(tenantId);

  return {
    title: tenant?.nome
      ? `${tenant.nome} • Await`
      : "Await",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="h-full antialiased bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}