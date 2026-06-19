import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  ArrowLeft,
  CircleCheck,
  Dices,
  Gift,
  Medal,
  Trophy,
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-(--color-bg)">
      {/* Lado do formulário */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Header mobile */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-(--color-text-muted) hover:text-(--color-text) transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="w-16" />
        </div>
        {/* Form centralizado */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      {/* Lado decorativo — só desktop */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden items-center justify-center">
        {/* Gradiente de fundo */}

        {/* Glow central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full bg-(--color-primary) opacity-10 blur-[120px]" />

        {/* Conteúdo */}
        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
          <div className="relative w-80 h-96">
            {/* Card 1 — Meta batida */}
            <div className="absolute top-0 left-0 animate-float-slow bg-(--color-bg-subtle)/80 backdrop-blur-md rounded-xl p-4 border border-(--color-border) w-52 -rotate-6 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CircleCheck size={14} className="text-emerald-400" />
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  Meta batida!
                </span>
              </div>
              <p className="text-sm font-semibold">Fechar 10 chamados</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                <span className="text-[10px] text-emerald-400 font-bold">
                  100%
                </span>
              </div>
            </div>

            {/* Card 2 — Roleta */}
            <div className="absolute top-20 right-0 animate-float-mid bg-(--color-bg-subtle)/80 backdrop-blur-md rounded-xl p-4 border border-(--color-border) w-48 rotate-[4deg] shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Dices
                  size={18}
                  className="text-(--color-primary-light) animate-spin-slow"
                />
                <span className="text-xs font-medium text-(--color-primary-light)">
                  Roleta
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-400">+50</p>
              <p className="text-[10px] text-(--color-text-muted)">
                coins ganhos no Jackpot!
              </p>
            </div>

            {/* Card 3 — Resgate */}
            <div className="absolute bottom-16 left-4 animate-float-fast bg-(--color-bg-subtle)/80 backdrop-blur-md rounded-xl p-4 border border-(--color-border) w-56 rotate-2 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-(--color-primary)/10 flex items-center justify-center">
                  <Gift size={20} className="text-(--color-primary-light)" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Camiseta Await</p>
                  <p className="text-xs text-(--color-text-muted)">
                    Resgatada por 100 pts
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 — Ranking */}
            <div className="absolute bottom-0 right-2 animate-float-slow bg-(--color-bg-subtle)/80 backdrop-blur-md rounded-xl p-4 border border-(--color-border) w-44 -rotate-8 shadow-xl">
              <div className="flex items-center gap-1.5 mb-2">
                <Trophy size={12} className="text-amber-400" />
                <span className="text-[10px] text-(--color-text-muted) uppercase tracking-wider">
                  Ranking
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Medal size={12} className="text-amber-400" />
                  <span className="text-xs font-medium flex-1">Maria</span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    4.200
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Medal size={12} className="text-zinc-400" />
                  <span className="text-xs font-medium flex-1">Carlos</span>
                  <span className="text-[10px] text-(--color-text-muted) font-bold">
                    3.680
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Medal size={12} className="text-amber-700" />
                  <span className="text-xs font-medium flex-1">João</span>
                  <span className="text-[10px] text-(--color-text-muted) font-bold">
                    2.910
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-12 text-center">
            <Logo size="lg" />
            <p className="mt-3 text-sm text-(--color-text-muted)">
              Onde produtividade vira recompensa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
