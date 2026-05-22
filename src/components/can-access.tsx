"use client";

import { useTenant } from "@/contexts/tenant-context";

interface CanAccessProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function CanAccess({ permission, children, fallback = null }: CanAccessProps) {
  const { hasPermission, loading, membro } = useTenant();

  console.log('CanAccess render:', { permission, loading, membro, result: !loading && hasPermission(permission) });

  if (loading) return null;
  if (!hasPermission(permission)) return <>{fallback}</>;

  return <>{children}</>;
}