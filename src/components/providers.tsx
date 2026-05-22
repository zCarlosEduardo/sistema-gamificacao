"use client";

import { TenantProvider } from "@/contexts/tenant-context";

export function Providers({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string;
}) {
  return <TenantProvider tenantId={tenantId}>{children}</TenantProvider>;
}