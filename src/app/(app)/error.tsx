"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <h2 className="text-lg font-semibold">Erro ao carregar</h2>
      <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-xs">
        Não foi possível carregar essa página. Tente novamente.
      </p>
      <Button onClick={reset} className="mt-6">
        Tentar novamente
      </Button>
    </div>
  );
}