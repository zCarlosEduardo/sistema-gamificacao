import { StoreClient } from "@/components/store/store-client";
import { apiServer } from "@/lib/api-server";
import { Member, Product, ProductCategory, Tenant } from "@/types";

export default async function LojaPage() {
  let products: Product[] = [];
  let categories: ProductCategory[] = [];
  let member: Member | null = null;
  let tenantData: Tenant | null = null;

  try {
    const res = await apiServer<{ data: Product[] }>("/products");
    products = res.data;
  } catch {}

  try {
    categories = await apiServer<ProductCategory[]>("/products/categories");
  } catch {}

  try {
    member = await apiServer<Member>("/tenants/me");
  } catch {}

  try {
    tenantData = await apiServer<Tenant>("/tenants/current");
  } catch {}

  // Nomenclaturas do tenant
  const nomePontos = tenantData?.nomePontos ?? "Pontos";
  const nomeLoja = tenantData?.nomeLoja ?? "Loja";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[family-name(--font-geist)]">
          {nomeLoja}
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Troque seus {nomePontos.toLocaleLowerCase()} por recompensas
        </p>
      </div>

      <StoreClient
        products={products}
        categories={categories}
        saldoPontos={member?.saldoPontos ?? 0}
        memberId={member?.id ?? ""}
        nomePontos={nomePontos}
      />
    </div>
  );
}
