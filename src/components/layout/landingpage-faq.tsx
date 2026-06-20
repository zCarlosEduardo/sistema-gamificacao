"use client";

import { Accordion } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Preciso instalar alguma coisa?",
    answer: "Não. O Await é 100% web funciona no navegador, desktop ou celular. Sem app pra baixar, sem instalação.",
  },
  {
    question: "Consigo personalizar as cores e os nomes?",
    answer: "Sim. Cada empresa configura cores, logo, e todos os termos do sistema (moeda, meta, equipe, pontos). Seus colaboradores veem a identidade da sua empresa, não a do Await.",
  },
  {
    question: "Como funciona o multiplicador de pontos?",
    answer: "O admin define um multiplicador (ex: 3x). Cada coin que o colaborador ganha na roleta é multiplicado pra virar pontos. 10 coins × 3 = 30 pontos. Isso permite ajustar o valor dos prêmios sem mudar o sistema.",
  },
  {
    question: "O que acontece se um resgate for rejeitado?",
    answer: "Os pontos voltam automaticamente pro saldo do colaborador. Sem ação manual, sem risco de perder pontos.",
  },
  {
    question: "Posso ter mais de uma empresa no mesmo sistema?",
    answer: "Sim. O Await é multitenant cada empresa tem seus dados completamente isolados. Um colaborador pode até estar em mais de uma empresa com saldos separados.",
  },
  {
    question: "Quem controla as permissões?",
    answer: "O administrador define grupos de permissão (ex: Gestor, Coordenador) com acessos específicos. Os 3 grupos padrão (Admin, Gestor, Colaborador) vêm prontos e podem ser editados.",
  },
  {
    question: "Os giros expiram?",
    answer: "Sim. Giros gerados por metas aprovadas expiram no final do dia. Isso mantém o ritmo e incentiva o uso diário.",
  },
  {
    question: "Como faço pra contratar?",
    answer: "Entre em contato pelo email ou pelo botão 'Falar com a gente'. A gente configura tudo pra sua empresa e cria os primeiros acessos.",
  },
];

export function FAQSection() {
  return <Accordion items={faqItems} />;
}