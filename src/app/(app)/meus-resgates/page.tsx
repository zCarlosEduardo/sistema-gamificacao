import { apiServer } from "@/lib/api-server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";
import type { Redemption, Tenant } from "@/types";

// Mapeia status pra cor do badge
const statusConfig: Record<
  string,
  { label: string; variant: "warning" | "success" | "danger" | "default" }
> = {
  PENDENTE: { label: "Pendente", variant: "warning" },
  APROVADO: { label: "Aprovado", variant: "success" },
  REJEITADO: { label: "Rejeitado", variant: "danger" },
  ENTREGUE: { label: "Entregue", variant: "default" },
};

export default async function MeusResgatesPage() {
  let resgates: Redemption[] = [];
  let tenantData: Tenant | null = null;

  try {
    const res = await apiServer<{ data: Redemption[] }>("/redemptions/mine");
    resgates = res.data;
  } catch {}

  try {
    tenantData = await apiServer<Tenant>("/tenants/current");
  } catch {}

  const nomePontos = tenantData?.nomePontos ?? "Pontos";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-(family-name:--font-geist)">
          Meus resgates
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Acompanhe o status dos seus pedidos
        </p>
      </div>

      {resgates.length === 0 ? (
        <EmptyState
          icon={<Package size={24} />}
          title="Nenhum resgate ainda"
          description="Quando você resgatar um produto na loja, ele aparece aqui."
        />
      ) : (
        <div className="space-y-3">
          {resgates.map((resgate) => {
            const status =
              statusConfig[resgate.status] ?? statusConfig.PENDENTE;

            return (
              <Card key={resgate.id} className="p-4">
                <div className="flex items-center gap-4">
                  {/* Imagem/emoji do produto */}
                  <div className="h-14 w-14 rounded-lg bg-(--color-bg) border border-(--color-border) flex items-center justify-center overflow-hidden shrink-0">
                    {resgate.produtoImagem ? (
                      <img
                        src={resgate.produtoImagem}
                        alt={resgate.produtoNome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">
                        {resgate.produtoEmoji ?? "🎁"}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold">
                      {resgate.produtoNome ?? "Produto"}
                    </h3>
                    <p className="text-xs text-(--color-text-muted)">
                      {resgate.pontosGastos.toLocaleString("pt-BR")}{" "}
                      {nomePontos.toLowerCase()}
                    </p>
                    <p className="text-[11px] text-(--color-text-muted) mt-0.5">
                      {new Date(resgate.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="text-right shrink-0">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {resgate.status === "REJEITADO" && resgate.observacao && (
                      <p className="text-[11px] text-(--color-text-muted) mt-1 max-w-37.5">
                        {resgate.observacao}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
