import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleDashed, Gift, Target } from "lucide-react";
import { HeroCard, StatsSection } from "@/components/layout/landingpage-cards";
import { HeroButtons } from "@/components/layout/hero-buttons";

const features = [
  {
    icon: Target,
    titulo: "Metas",
    desc: "Defina metas individuais ou de equipe. Quem entrega, ganha coins automático.",
  },
  {
    icon: CircleDashed,
    titulo: "Roleta",
    desc: "Os coins viram giros. A roleta entrega aquela dose de surpresa que mantém todo mundo voltando.",
  },
  {
    icon: Gift,
    titulo: "Recompensas",
    desc: "Pontos são trocados por prêmios reais na loja. Você define o catálogo, eles escolhem.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between py-32 gap-12 animate-fade-in">
        <div className="md:flex-1 space-y-6">
          <span className="text-xs font-medium text-(--color-primary-light) border px-2 py-1.5 border-(--color-primary)/20  rounded-full bg-(--color-primary)/10 inline-block">
            Gamificação corporativa
          </span>
          <h1 className="text-4xl sm:text-5xl font-(family-name:--font-geist) font-bold leading-tight">
            Bater meta nunca foi tão{" "}
            <span className="text-(--color-primary-light)">divertido.</span>
          </h1>
          <p className="text-lg text-(--color-text-muted) max-w-2xl mx-auto">
            Metas, roleta de coins, ranking e loja de recompensas tudo num lugar
            só. Sua equipe se engaja, você acompanha. Sem planilha, sem
            complicação.
          </p>
          <div className="flex items-center justify-start gap-4 pt-4">
            <HeroButtons />
          </div>
        </div>
        <div className="md:flex-1 w-full">
          <HeroCard />
        </div>
      </section>

      {/* Como funciona */}
      <section
        id="como-funciona"
        className="flex flex-col gap-12 py-20 max-w-6xl mx-auto"
      >
        <div className=" gap-24 md:gap-12 items-center">
          <h2 className="text-lg font-(family-name:--font-geist) font-semibold text-start mb-6 text-(--color-text-muted) uppercase">
            Como funciona
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 ">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.titulo}
                  className="p-6 bg-(--color-bg-subtle) border-(--color-border) hover:transition-transform hover:scale-[1.05] duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-(--color-primary)/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-(--color-primary-light)" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{item.titulo}</h3>

                  <p className="text-sm text-(--color-text-muted)">
                    {item.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
        <StatsSection />
      </section>

      {/* Contato */}
      <section
        id="contato"
        className="px-6 py-12 mb-24 text-center gradient bg-linear-to-br from-(--color-primary)/15 to-(--color-primary-light)/2 rounded-xl border border-(--color-primary)/50"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-4xl font-(family-name:--font-geist) font-bold">
            Quer levar o Await pra sua empresa?
          </h2>
          <p className="text-(--color-text-muted) mb-6">
            Fale com a gente e veja como transformar seus resultados com
            gamificação. Personalizamos toda a plataforma para refletir a
            identidade da sua empresa, com suas cores, termos e regras de
            negócio.
          </p>
          <a href="mailto:contato@await.com.br">
            <Button size="lg" variant="primaryShadow">
              Falar com a gente
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
