"use client";

import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { CanAccess } from "@/components/ui/can-access";


export default function Home() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <ThemeToggle />

      <CanAccess permission="ver_graficos">
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
          Você tem acesso aos gráficos
        </div>
      </CanAccess>

      <CanAccess permission="permissao_que_nao_existe">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          Isso não deveria aparecer
        </div>
      </CanAccess>
    </div>
  );
}