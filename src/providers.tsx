"use client";

import { TenantProvider } from "@/contexts/tenant-context";

interface ProvidersProps {
  children: React.ReactNode;
  initialSession?: unknown;
  initialTenant?: unknown;
  initialMembro?: unknown;
}

export function Providers({ children, initialTenant, initialMembro }: ProvidersProps) {
  return (
    <TenantProvider
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialTenant={initialTenant as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialMembro={initialMembro as any}
    >
      {children}
    </TenantProvider>
  );
}