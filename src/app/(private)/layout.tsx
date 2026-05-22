import { Providers } from "@/components/providers";

export const metadata = {
  title: "Sistema de Gamificação",
};

export default function PrivadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers tenantId="6c5c54be-64a7-407c-a8e5-4b2928c5d5cc">
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
        <main>{children}</main>
      </div>
    </Providers>
  );
}