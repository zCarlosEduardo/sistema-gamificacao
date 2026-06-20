"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Logo size="lg" className="mb-8" />
      <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <h1 className="text-xl font-semibold">Algo deu errado</h1>
      <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-sm">
        Ocorreu um erro inesperado. Tente novamente ou volte pro início.
      </p>
      <div className="flex gap-3 mt-6">
        <Button onClick={reset}>Tentar novamente</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Voltar pro início
        </Button>
      </div>
    </div>
  );
}