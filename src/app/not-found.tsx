import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Logo size="lg" className="mb-8" />
      <h1 className="text-7xl font-bold font-[family-name:var(--font-geist)] text-[var(--color-primary)]">
        404
      </h1>
      <h2 className="text-xl font-semibold mt-4">Página não encontrada</h2>
      <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-sm">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link href="/" className="mt-6">
        <Button>Voltar pro início</Button>
      </Link>
    </div>
  );
}