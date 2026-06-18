import { Rocket } from "lucide-react";
import { Logo } from "../ui/logo";

export function MarketingFooter() {
  return (
    <footer className="px-6 py-6 border-t border-(--color-border) text-center text-sm text-(--color-text-muted) flex items-center justify-between gap-2 flex-wrap md:flex-nowrap flex-col md:flex-row">
      <Logo />
      <div className="flex items-center gap-4">
        © {new Date().getFullYear()} · Engajamento que dá gosto de ver!
        <Rocket size={16} className="text-(--color-primary-light)" />
      </div>
    </footer>
  );
}
