"use client";

import { Button } from "@/components/ui/button";

export function HeroButtons() {
  return (
    <div className="flex items-center justify-start gap-4 pt-4">
      <Button
        variant="primaryShadow"
        size="lg"
        onClick={() => {
          document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Como funciona
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => {
          document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Falar com a gente
      </Button>
    </div>
  );
}