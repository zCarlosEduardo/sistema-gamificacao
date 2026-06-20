import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CircleDashed,
  Gift,
  Target,
  Palette,
  Shield,
  BarChart3,
  Zap,
  Users,
  Lock,
} from "lucide-react";
import { HeroCard, StatsSection } from "@/components/layout/landingpage-cards";
import { HeroButtons } from "@/components/layout/hero-buttons";
import { FadeIn } from "@/components/ui/fade-in";
import { FAQSection } from "@/components/layout/landingpage-faq";

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

const diferenciais = [
  {
    icon: Palette,
    titulo: "100% personalizado",
    desc: "Cores, nomes, moedas, termos tudo reflete a identidade da sua empresa. Ninguém sabe que é o Await por trás.",
  },
  {
    icon: Shield,
    titulo: "Segurança multitenant",
    desc: "Dados isolados por empresa. Cada cliente tem seu ambiente separado, sem risco de vazamento.",
  },
  {
    icon: BarChart3,
    titulo: "Dashboard em tempo real",
    desc: "Ranking, metas ativas, resgates pendentes tudo atualiza ao vivo, sem recarregar.",
  },
  {
    icon: Zap,
    titulo: "Automação inteligente",
    desc: "Meta bateu? Giro gerado. Resgate rejeitado? Pontos devolvidos. Tudo automático, zero trabalho manual.",
  },
  {
    icon: Users,
    titulo: "Equipes e permissões",
    desc: "Organize por equipes, defina quem gerencia o quê. Gestor aprova metas, admin configura tudo.",
  },
  {
    icon: Lock,
    titulo: "Controle total",
    desc: "Grupos de permissão flexíveis, audit log de todas as ações, e multiplicador de pontos configurável.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between py-32 gap-12">
        <div className="md:flex-1 space-y-6">
          <FadeIn>
            <span className="text-xs font-medium text-[var(--color-primary-light)] border px-2 py-1.5 border-[var(--color-primary)]/20 rounded-full bg-[var(--color-primary)]/10 inline-block">
              Gamificação corporativa
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl font-[family-name:var(--font-geist)] font-bold leading-tight">
              Bater meta nunca foi tão{" "}
              <span className="text-[var(--color-primary-light)]">divertido.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
              Metas, roleta de coins, ranking e loja de recompensas tudo num lugar
              só. Sua equipe se engaja, você acompanha. Sem planilha, sem
              complicação.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <HeroButtons />
          </FadeIn>
        </div>
        <FadeIn delay={0.2} direction="right" className="md:flex-1 w-full">
          <HeroCard />
        </FadeIn>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="flex flex-col gap-12 py-20 max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-lg font-[family-name:var(--font-geist)] font-semibold text-start text-[var(--color-text-muted)] uppercase">
            Como funciona
          </h2>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.titulo} delay={i * 0.1}>
                <Card className="p-6 bg-[var(--color-bg-subtle)] border-[var(--color-border)] hover:scale-[1.03] transition-transform duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-[var(--color-primary-light)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.titulo}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                </Card>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn>
          <StatsSection />
        </FadeIn>
      </section>

      {/* Passo a passo */}
      <section className="py-20 max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-lg font-[family-name:var(--font-geist)] font-semibold text-start text-[var(--color-text-muted)] uppercase mb-12">
            O ciclo completo
          </h2>
        </FadeIn>
        <div className="space-y-0">
          {[
            { step: "01", title: "Gestor cria a meta", desc: "Individual ou de equipe, com valor alvo e prazo definido." },
            { step: "02", title: "Colaborador entrega", desc: "O progresso é atualizado e a meta é marcada como concluída." },
            { step: "03", title: "Gestor aprova", desc: "Com um clique, giros são gerados automaticamente pra quem bateu." },
            { step: "04", title: "Roleta sorteia coins", desc: "Cada giro é uma chance de ganhar coins especiais ou o valor padrão." },
            { step: "05", title: "Coins viram pontos", desc: "Multiplicador configurável por empresa. 10 coins × 3 = 30 pontos." },
            { step: "06", title: "Troca por recompensas", desc: "O colaborador escolhe o prêmio na loja e solicita o resgate." },
          ].map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.05}>
              <div className="flex gap-6 py-5 border-b border-[var(--color-border)] group">
                <span className="text-2xl font-bold text-[var(--color-primary)]/30 group-hover:text-[var(--color-primary-light)] transition-colors font-[family-name:var(--font-geist)]">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-lg font-[family-name:var(--font-geist)] font-semibold text-start text-[var(--color-text-muted)] uppercase mb-12">
            Por que o Await
          </h2>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {diferenciais.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.titulo} delay={i * 0.08}>
                <div className="p-5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                      <Icon size={18} className="text-[var(--color-primary-light)]" />
                    </div>
                    <h3 className="font-semibold text-sm">{item.titulo}</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="text-lg font-[family-name:var(--font-geist)] font-semibold text-start text-[var(--color-text-muted)] uppercase mb-8">
            Perguntas frequentes
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <FAQSection />
        </FadeIn>
      </section>

      {/* CTA */}
      <FadeIn>
        <section
          id="contato"
          className="px-6 py-12 mb-24 text-center bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-primary-light)]/5 rounded-xl border border-[var(--color-primary)]/30"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-[family-name:var(--font-geist)] font-bold">
              Quer levar o Await pra sua empresa?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              Fale com a gente e veja como transformar seus resultados com
              gamificação. Personalizamos toda a plataforma para refletir a
              identidade da sua empresa.
            </p>
            <a href="mailto:contato@await.com.br">
              <Button size="lg" variant="primaryShadow">
                Falar com a gente
              </Button>
            </a>
          </div>
        </section>
      </FadeIn>
    </>
  );
}