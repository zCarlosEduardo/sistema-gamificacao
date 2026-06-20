import { MarketingHeader } from "@/components/layout/landingpage-header";
import { MarketingFooter } from "@/components/layout/landingpage-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 relative overflow-x-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-46 -translate-y-1/2 w-200 h-125 rounded-full bg-(--color-primary) opacity-6 blur-[120px]" />
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
