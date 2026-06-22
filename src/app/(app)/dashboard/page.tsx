import { Target, Clock, Users, Package, BarChart3, Trophy } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { AnnouncementBanner } from "@/components/ui/announcement-banner";
import { apiServer } from "@/lib/api-server";
import { isAdmin, isManager, canApproveGoals } from "@/lib/permissions";

import type {
  PlayerDashboard,
  ManagerDashboard,
  AdminAnalytics,
  Member,
  Tenant,
  Announcement,
} from "@/types";
import Link from "next/link";
import { AdminCharts } from "@/components/dashboard/admin-charts";
import { RouletteCard } from "@/components/dashboard/roulette-card";
import { LiveSaldo } from "@/components/dashboard/live-saldo";
import { ProductsPreview } from "@/components/dashboard/products-preview";

export default async function DashboardPage() {
  let member: Member | null = null;
  let tenantData: Tenant | null = null;
  let playerData: PlayerDashboard | null = null;
  let managerData: ManagerDashboard | null = null;
  let adminData: AdminAnalytics | null = null;
  let announcements: Announcement[] = [];

  try {
    member = await apiServer<Member>("/tenants/me");
  } catch {}
  try {
    tenantData = await apiServer<Tenant>("/tenants/current");
  } catch {}

  if (member) {
    try {
      playerData = await apiServer<PlayerDashboard>(
        `/dashboard/player?memberId=${member.id}`,
      );
    } catch {}
    if (isManager(member)) {
      try {
        managerData = await apiServer<ManagerDashboard>("/dashboard/manager");
      } catch {}
    }
    if (isAdmin(member)) {
      try {
        adminData = await apiServer<AdminAnalytics>("/dashboard/admin");
      } catch {}
    }
    try {
      announcements = await apiServer<Announcement[]>("/announcements/active");
    } catch {}
  }

  // Nomenclaturas do tenant (ou padrão)
  const n = {
    moeda: tenantData?.nomeMoeda ?? "Coins",
    pontos: tenantData?.nomePontos ?? "Pontos",
    meta: tenantData?.nomeMeta ?? "Meta",
    equipe: tenantData?.nomeEquipe ?? "Equipe",
    loja: tenantData?.nomeLoja ?? "Loja",
    usuario: tenantData?.nomeUsuario ?? "Usuário",
    giro: tenantData?.nomeGiro ?? "Giro",
  };

  const saldo = {
    coins: member?.saldoCoins ?? 0,
    pontos: member?.saldoPontos ?? 0,
    giros: member?.girosDisponiveis ?? 0,
  };

  const metasAtivas = playerData?.metasAtivas ?? [];
  const resgatesPendentes = playerData?.resgatesPendentes ?? [];
  const showManager = member && isManager(member);
  const showAdmin = member && isAdmin(member);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-(family-name:--font-geist)">
          Dashboard
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          {showAdmin
            ? "Visão completa do sistema"
            : showManager
              ? "Visão do gestor"
              : "Seu progresso"}
        </p>
      </div>

      {/* Avisos */}
      <AnnouncementBanner announcements={announcements} />

      {/* Stats admin/gestor */}
      {managerData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label={`${n.usuario}s ativos`}
            value={managerData.membros.ativos}
            icon={<Users size={20} />}
          />
          <StatCard
            label={`${n.meta}s ativas`}
            value={managerData.metas.ativas}
            icon={<Target size={20} />}
          />
          <StatCard
            label="Resgates pendentes"
            value={managerData.resgates.pendentes}
            icon={<Package size={20} />}
          />
          <StatCard
            label={`Total de ${n.usuario}s`}
            value={managerData.membros.total}
            icon={<BarChart3 size={20} />}
          />
        </div>
      )}

      {/* Analytics admin */}
      {adminData && <AdminCharts data={adminData} nomenclaturas={n} />}

      {/* Pendências de aprovação */}
      {managerData &&
        member &&
        canApproveGoals(member) &&
        managerData.aguardandoAprovacao.length > 0 && (
          <Card className="p-5 border-amber-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-400" />
                <CardTitle>Aguardando aprovação</CardTitle>
                <Badge variant="warning">
                  {managerData.aguardandoAprovacao.length}
                </Badge>
              </div>
              <Link href="/metas">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {managerData.aguardandoAprovacao.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 border-b border-(--color-border) last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={item.nome} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{item.nome}</p>
                      <p className="text-xs text-(--color-text-muted)">
                        {item.titulo}
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning">Concluída</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

      {/* Roleta destacada */}
      <RouletteCard
        giros={saldo.giros}
        nomeGiro={n.giro}
        nomeMoeda={n.moeda}
        nomePontos={n.pontos}
        memberId={member?.id ?? ""}
      />

      {/* Saldo do jogador */}
      <div>
        <h2 className="text-sm font-medium text-(--color-text-muted) uppercase tracking-wider mb-3">
          Meu saldo
        </h2>
        <LiveSaldo
          initialSaldo={saldo}
          memberId={member?.id ?? ""}
          nomeMoeda={n.moeda}
          nomePontos={n.pontos}
          nomeGiro={n.giro}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-(--color-text-muted) uppercase tracking-wider">
              Minhas {n.meta.toLowerCase()}s
            </h2>
            <Link href="/metas">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>

          {metasAtivas.length === 0 ? (
            <EmptyState
              icon={<Target size={24} />}
              title={`Nenhuma ${n.meta.toLowerCase()} ativa`}
              description={`Quando o gestor criar ${n.meta.toLowerCase()}s pra você, elas aparecem aqui.`}
            />
          ) : (
            <div className="space-y-3">
              {metasAtivas.slice(0, 5).map((meta) => {
                const percentage = Math.min(
                  Math.round((meta.progresso / meta.valorAlvo) * 100),
                  100,
                );
                const concluida = meta.status === "CONCLUIDA";

                return (
                  <Card
                    key={meta.id}
                    className="p-4 hover:border-(--color-primary)/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-(--color-primary)/10 flex items-center justify-center">
                          <Target
                            size={18}
                            className="text-(--color-primary-light)"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">
                            {meta.titulo}
                          </h3>
                          <p className="text-xs text-(--color-text-muted)">
                            {meta.progresso.toLocaleString("pt-BR")} /{" "}
                            {meta.valorAlvo.toLocaleString("pt-BR")}{" "}
                            {meta.unidade}
                          </p>
                        </div>
                      </div>
                      <Badge variant={concluida ? "success" : "default"}>
                        {concluida ? "Concluída" : `${percentage}%`}
                      </Badge>
                    </div>
                    <Progress
                      value={meta.progresso}
                      max={meta.valorAlvo}
                      size="sm"
                    />
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Produtos populares */}
          <ProductsPreview
            tenantId={member?.id ?? ""}
            nomeLoja={n.loja}
            nomePontos={n.pontos}
          />
          {/* Ranking */}
          {managerData && managerData.ranking.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-amber-400" />
                <CardTitle>Top 5</CardTitle>
              </div>
              <div className="space-y-3">
                {managerData.ranking.map((person, i) => (
                  <div key={person.nome} className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold w-5 text-center ${
                        i === 0
                          ? "text-amber-400"
                          : i === 1
                            ? "text-zinc-400"
                            : i === 2
                              ? "text-amber-600"
                              : "text-(--color-text-muted)"
                      }`}
                    >
                      {i + 1}º
                    </span>
                    <Avatar name={person.nome} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {person.nome}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-(--color-primary-light)">
                      {person.saldoPontos.toLocaleString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Resgates pendentes */}
          {resgatesPendentes.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-amber-400" />
                <CardTitle>Meus resgates</CardTitle>
              </div>
              <div className="space-y-3">
                {resgatesPendentes.map((resgate) => (
                  <div
                    key={resgate.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {resgate.produtoNome ?? "Produto"}
                      </p>
                      <p className="text-xs text-(--color-text-muted)">
                        {resgate.pontosGastos} {n.pontos.toLowerCase()}
                      </p>
                    </div>
                    <Badge variant="warning">Pendente</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
