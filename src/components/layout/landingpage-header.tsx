import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/">
        <Logo />
      </Link>
      <Link href="/login">
        <Button size="lg" variant="outline">
          Entrar
        </Button>
      </Link>
    </header>
  );
}