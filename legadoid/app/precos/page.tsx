import Link from "next/link";
import { Check, Flame, Infinity } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preços | LEGADO ID",
  description: "Planos acessíveis para preservar a memória de quem você ama para sempre.",
};

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Para quem quer começar e preservar o essencial.",
    cta: "Criar gratuitamente",
    href: "/criar",
    highlight: false,
    features: [
      "1 memorial",
      "20 fotos",
      "Mural de memórias",
      "Velas virtuais",
      "Compartilhamento por link",
      "Disponível permanentemente",
    ],
  },
  {
    name: "Completo",
    price: "R$ 19,90",
    period: "por mês",
    description: "Para quem quer um memorial completo e rico em memórias.",
    cta: "Assinar agora",
    href: "/criar",
    highlight: true,
    features: [
      "Memoriais ilimitados",
      "Fotos ilimitadas",
      "Linha do tempo",
      "Vídeos",
      "Temas exclusivos",
      "Domínio personalizado",
      "QR Code para lápide",
      "Suporte prioritário",
    ],
  },
  {
    name: "Eterno",
    price: "R$ 297",
    period: "pagamento único",
    description: "Um pagamento único. O memorial dura para sempre, sem mensalidade.",
    cta: "Adquirir acesso vitalício",
    href: "/criar",
    highlight: false,
    features: [
      "Tudo do plano Completo",
      "Acesso vitalício",
      "Sem mensalidade jamais",
      "Transferência para herdeiros",
      "Backup garantido",
      "Prioridade máxima no suporte",
    ],
  },
];

export default function PrecosPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-deep/10 text-amber-deep text-sm font-medium mb-6">
            Preços simples e justos
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-stone mb-6 leading-tight">
            Um memorial que <span className="text-amber-deep">dura para sempre</span>
          </h1>
          <p className="text-lg text-stone/60 max-w-xl mx-auto">
            Comece gratuitamente. Faça upgrade quando quiser mais recursos.
            Sem surpresas, sem letras miúdas.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlight
                  ? "bg-stone border-stone shadow-xl ring-2 ring-amber-deep"
                  : "bg-white border-border"
              }`}
            >
              {plan.highlight && (
                <div className="text-center mb-4">
                  <span className="text-xs font-semibold text-amber-deep bg-amber-deep/20 px-3 py-1 rounded-full uppercase tracking-wide">
                    Mais popular
                  </span>
                </div>
              )}
              <h3 className={`font-display text-xl font-semibold mb-1 ${plan.highlight ? "text-white" : "text-stone"}`}>
                {plan.name}
              </h3>
              <div className="flex items-end gap-1 mb-1">
                <span className={`font-display text-3xl font-bold ${plan.highlight ? "text-white" : "text-stone"}`}>
                  {plan.price}
                </span>
              </div>
              <p className={`text-sm mb-2 ${plan.highlight ? "text-white/50" : "text-stone/40"}`}>
                {plan.period}
              </p>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-white/70" : "text-stone/60"}`}>
                {plan.description}
              </p>

              <Link
                href={plan.href}
                className={`block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all mb-8 ${
                  plan.highlight
                    ? "bg-amber-deep text-white hover:bg-amber-deep/90"
                    : "bg-stone text-white hover:bg-stone/90"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-amber-deep" : "text-amber-deep"}`} />
                    <span className={`text-sm ${plan.highlight ? "text-white/80" : "text-stone/70"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="pb-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-deep/10 flex items-center justify-center mx-auto mb-4">
            <Infinity className="w-6 h-6 text-amber-deep" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-stone mb-3">
            Garantia de permanência
          </h2>
          <p className="text-stone/60 leading-relaxed">
            Independente do plano, os memoriais criados no LEGADO ID são preservados permanentemente.
            Seu legado não desaparece.
          </p>
        </div>
      </section>
    </main>
  );
}
