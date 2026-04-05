import Link from "next/link";
import { Check, ArrowRight, Infinity, Star, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preços | LEGADO ID",
  description: "Planos acessíveis para preservar a memória de quem você ama para sempre. Comece gratuitamente.",
};

const plans = [
  {
    name: "Gratuito",
    badge: null,
    price: "R$ 0",
    priceNote: "para sempre",
    description: "Para quem quer começar e preservar o essencial com beleza e cuidado.",
    cta: "Criar gratuitamente",
    href: "/criar",
    highlight: false,
    features: [
      { text: "1 memorial completo", included: true },
      { text: "Até 20 fotos", included: true },
      { text: "Mural de memórias", included: true },
      { text: "Velas virtuais", included: true },
      { text: "Compartilhamento por link", included: true },
      { text: "Disponível permanentemente", included: true },
      { text: "Linha do tempo", included: false },
      { text: "Galeria ilimitada", included: false },
      { text: "QR Code para lápide", included: false },
    ],
  },
  {
    name: "Completo",
    badge: "Mais escolhido",
    price: "R$ 19,90",
    priceNote: "por mês",
    description: "Para quem quer um memorial rico, com todos os recursos para honrar cada detalhe.",
    cta: "Começar 7 dias grátis",
    href: "/criar",
    highlight: true,
    features: [
      { text: "Memoriais ilimitados", included: true },
      { text: "Fotos e vídeos ilimitados", included: true },
      { text: "Mural de memórias", included: true },
      { text: "Velas virtuais", included: true },
      { text: "Compartilhamento por link", included: true },
      { text: "Disponível permanentemente", included: true },
      { text: "Linha do tempo completa", included: true },
      { text: "QR Code para lápide", included: true },
      { text: "Temas exclusivos", included: true },
    ],
  },
  {
    name: "Eterno",
    badge: "Melhor custo-benefício",
    price: "R$ 297",
    priceNote: "pagamento único",
    description: "Um investimento único. Sem mensalidade jamais. O legado fica para sempre.",
    cta: "Adquirir acesso vitalício",
    href: "/criar",
    highlight: false,
    features: [
      { text: "Tudo do plano Completo", included: true },
      { text: "Acesso vitalício garantido", included: true },
      { text: "Sem mensalidade jamais", included: true },
      { text: "Transferência para herdeiros", included: true },
      { text: "Backup e exportação", included: true },
      { text: "Suporte prioritário sempre", included: true },
      { text: "Novos recursos futuros", included: true },
      { text: "QR Code para lápide", included: true },
      { text: "Temas exclusivos", included: true },
    ],
  },
];

const faqs = [
  {
    q: "O memorial gratuito realmente fica para sempre?",
    a: "Sim. Independente do plano, garantimos que o memorial nunca será apagado. É um compromisso nosso com as famílias.",
  },
  {
    q: "Posso cancelar o plano mensal a qualquer momento?",
    a: "Sim, sem multa e sem burocracia. O memorial continua no ar mesmo após o cancelamento, preservando todas as memórias.",
  },
  {
    q: "O que acontece com as fotos se eu fizer downgrade?",
    a: "Nada. Todas as suas fotos e conteúdos são mantidos. Você apenas ficará limitado a adicionar novas fotos acima do limite do plano gratuito.",
  },
  {
    q: "Existe desconto para funerárias ou compras em volume?",
    a: "Sim! Temos planos especiais para funerárias e cemitérios parceiros. Entre em contato pelo e-mail parceiros@legadoid.com.",
  },
];

export default function PrecosPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EF]">

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-700/30 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-8">
            Preços simples e transparentes
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-stone-800 mb-6 leading-[1.1]">
            Escolha o plano<br />
            <span className="text-amber-700 italic">certo para você</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-xl mx-auto leading-relaxed">
            Comece gratuitamente. Faça upgrade quando quiser mais.
            Sem surpresas, sem letras miúdas.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl flex flex-col overflow-hidden transition-all ${
                plan.highlight
                  ? "bg-stone-800 shadow-2xl ring-2 ring-amber-600 scale-[1.02]"
                  : "bg-white border border-stone-100 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className={`px-6 pt-5 pb-0`}>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    plan.highlight ? "bg-amber-700/30 text-amber-400" : "bg-amber-100 text-amber-700"
                  }`}>
                    <Star className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <h3 className={`font-display text-2xl font-semibold mb-1 ${plan.highlight ? "text-white" : "text-stone-800"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-5 leading-relaxed ${plan.highlight ? "text-white/60" : "text-stone-500"}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className={`font-display text-4xl font-bold ${plan.highlight ? "text-white" : "text-stone-800"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-2 ${plan.highlight ? "text-white/40" : "text-stone-400"}`}>
                    {plan.priceNote}
                  </span>
                </div>

                <Link
                  href={plan.href}
                  className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium text-sm transition-all mb-6 ${
                    plan.highlight
                      ? "bg-amber-700 hover:bg-amber-600 text-white"
                      : "bg-stone-800 hover:bg-stone-700 text-white"
                  }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        f.included
                          ? plan.highlight ? "bg-amber-700/30" : "bg-amber-100"
                          : "bg-stone-100"
                      }`}>
                        {f.included ? (
                          <Check className={`w-2.5 h-2.5 ${plan.highlight ? "text-amber-400" : "text-amber-700"}`} />
                        ) : (
                          <span className="w-1.5 h-px bg-stone-300 block" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        f.included
                          ? plan.highlight ? "text-white/85" : "text-stone-700"
                          : plan.highlight ? "text-white/30" : "text-stone-300"
                      }`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee banner */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-8 flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Infinity className="w-7 h-7 text-amber-700" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-stone-800 mb-1">
              Garantia de permanência vitalícia
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Todo memorial criado no LEGADO ID é preservado permanentemente, independente do plano.
              Seu legado não desaparece — é um compromisso que fazemos com cada família.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-stone-800 text-center mb-10">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
                <h4 className="font-semibold text-stone-800 mb-2 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-stone-500 text-sm leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
