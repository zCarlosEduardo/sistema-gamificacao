"use client";

import { useState, useCallback } from "react";
import { Coins, TrendingUp, Zap } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { useSSE } from "@/lib/use-sse";
import { api } from "@/lib/api";

interface LiveSaldoProps {
  initialSaldo: { coins: number; pontos: number; giros: number };
  memberId: string;
  nomeMoeda: string;
  nomePontos: string;
  nomeGiro: string;
}

export function LiveSaldo({ initialSaldo, memberId, nomeMoeda, nomePontos, nomeGiro }: LiveSaldoProps) {
  const [saldo, setSaldo] = useState(initialSaldo);

  const handleEvent = useCallback(async (event: { type: string; data: any }) => {
    if (["ROLETA_GIRADA", "META_APROVADA", "RESGATE_REJEITADO", "RESGATE_APROVADO", "SALDO_ATUALIZADO"].includes(event.type)) {
      try {
        const member = await api.get("/tenants/me");
        setSaldo({
          coins: member.saldoCoins,
          pontos: member.saldoPontos,
          giros: member.girosDisponiveis,
        });
      } catch {}
    }
  }, []);

  useSSE({
    url: `/events/stream?memberId=${memberId}`,
    onEvent: handleEvent,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label={nomePontos} value={saldo.pontos} icon={<Coins size={20} />} />
      <StatCard label={nomeMoeda} value={saldo.coins} icon={<TrendingUp size={20} />} />
      <StatCard label={`${nomeGiro}s disponíveis`} value={saldo.giros} icon={<Zap size={20} />} />
    </div>
  );
}