import { Topbar } from "@/components/layout/topbar";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "Sistema de Gamificação",
};

export default function PrivadoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
        <Topbar />
        <main className="px-6 py-6">{children}</main>
      </div>
    </Providers>
  );
}