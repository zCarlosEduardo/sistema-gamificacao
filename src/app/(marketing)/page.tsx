import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    emoji: "🎯",
    titulo: "Gestor cria metas",
    desc: "Metas individuais ou por equipe, com valor alvo e prazo.",
  },
  {
    emoji: "🎰",
    titulo: "Colaborador gira a roleta",
    desc: "Ao bater a meta, ganha giros na roleta e coleta coins.",
  },
  {
    emoji: "🎁",
    titulo: "Troca por recompensas",
    desc: "Coins viram pontos. Pontos trocam por produtos na loja interna.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-[family-name:var(--font-geist)] font-bold leading-tight">
            Sua equipe engajada.
            <br />
            <span className="text-[var(--color-primary)]">
              Seus resultados multiplicados.
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-lg mx-auto">
            Metas, coins, roleta e recompensas — tudo num sistema que transforma
            produtividade em jogo. Sem complicação.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="#como-funciona">
              <Button size="lg">Como funciona</Button>
            </Link>
            <Link href="#contato">
              <Button variant="outline" size="lg">Falar com a gente</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="px-6 py-20 border-t border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-[family-name:var(--font-geist)] font-bold text-center mb-12">
            Como funciona
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((item) => (
              <Card key={item.titulo}>
                <span className="text-3xl">{item.emoji}</span>
                <h3 className="text-lg font-semibold mt-3 mb-2">{item.titulo}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="px-6 py-20 border-t border-[var(--color-border)] text-center">
        <div className="max-w-lg mx-auto space-y-4">
          <h2 className="text-2xl font-[family-name:var(--font-geist)] font-bold">
            Quer levar o Await pra sua empresa?
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Entre em contato com a gente e descubra como gamificar seus resultados.
          </p>
          <a href="mailto:contato@await.com.br">
            <Button size="lg">Falar com a gente</Button>
          </a>
        </div>
      </section>
    </>
  );
}