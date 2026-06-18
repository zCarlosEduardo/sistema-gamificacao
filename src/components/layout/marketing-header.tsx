import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
      <Link href="/">
        <Logo />
      </Link>
      <Link href="/login">
        <Button size="sm">Entrar</Button>
      </Link>
    </header>
  );
}