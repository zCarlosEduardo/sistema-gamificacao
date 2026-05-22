"use client";

import { TenantProvider } from "@/contexts/tenant-context";
import { TENANT_ID_FIXO } from "@/lib/constants";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider tenantId={TENANT_ID_FIXO}>
      {children}
    </TenantProvider>
  );
}