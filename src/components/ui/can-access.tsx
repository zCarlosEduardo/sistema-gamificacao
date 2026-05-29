// src/components/can-access.tsx
"use client";

import { useSession } from "@/lib/auth-client";
import { useTenant } from "@/contexts/tenant-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface CanAccessProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function CanAccess({ 
  permission, 
  children, 
  fallback = null 
}: CanAccessProps) {
  const router = useRouter();
  
  const { data: session, isPending: authPending } = useSession();
  const { hasPermission, loading: tenantLoading, membro } = useTenant();

  useEffect(() => {
    if (!authPending && !session) {
      router.push("/login");
    }
  }, [session, authPending, router]);

  if (authPending) return null;
  
  if (!session) return null;

  if (tenantLoading) return null;
  
  if (!hasPermission(permission)) return <>{fallback}</>;

  return <>{children}</>;
}