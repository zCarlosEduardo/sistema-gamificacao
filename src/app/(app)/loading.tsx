import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div>
      {/* Topbar skeleton */}
      <div className="h-14 border-b border-[var(--color-border)] px-6 flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32 hidden sm:block" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>

        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}