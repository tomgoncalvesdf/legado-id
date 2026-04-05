import Link from "next/link";
import { Check, Minus, ArrowRight, Infinity, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preços | LEGADO ID",
  description: "Planos simples e transparentes para preservar a memória de quem você ama. Comece gratuitamente.",
};

const plans = [
  {
    name: "Gratuito",
    badge: null,
    price: "R$\u00a00",
    period: "para sempre",
    description: "Para quem quer começar e preservar o essencial com beleza e dignidade.",
    cta: "Criar gratuitamente",
    href: "/criar",
    highlight: false,
    features: [
      { text: "1 memorial completo", ok: true },
      { text: "Até 20 fotos", ok: true },
      { text: "Mural de memórias", ok: true },
      { text: "Velas virtuais", ok: true },
      { text: "Compartilhamento por link", ok: true },
      { text: "Disponível permanentemente", ok: true },
      { text: "Linha do tempo", ok: false },
      { text: "Galeria ilimitada", ok: false },
      { text: "QR Code para lápide", ok: false },
      { text: "Temas exclusivos", ok: false },
    ],
  },
  {
    name: "Premium",
    badge: "Mais escolhido",
    price: "R$\u00a019,90",
    period: "por mês",
    description: "Para quem quer um memorial rico, com todos os recursos para honrar cada detalhe da vida.",
    cta: "Começar 7 dias grátis",
    href: "/criar",
    highlight: true,
    features: [
      { text: "Memoriais ilimitados", ok: true },
      { text: "Fotos e vídeos ilimitados", ok: true },
      { text: "Mural de memórias", ok: true },
      { text: "Velas virtuais", ok: true },
      { text: "Compartilhamento por link", ok: true },
      { text: "Disponível permanentemente", ok: true },
      { text: "Linha do tempo completa", ok: true },
      { text: "Galeria ilimitada", ok: true },
      { text: "QR Code para lápide", ok: true },
      { text: "Temas exclusivos", ok: true },
    ],
  },
  {
    name: "Eterno",
    badge: "Melhor custo-benefício",
    price: "R$\u00a0297",
    period: "pagamento único",
    description: "Um investimento único e definitivo. Sem mensalidade jamais. O legado fica para sempre.",
    cta: "Adquirir acesso vitalício",
    href: "/criar",
    highlight: false,
    features: [
      { text: "Tudo do plano Premium", ok: true },
      { text: "Acesso vitalício garantido", ok: true },
      { text: "Sem mensalidade jamais", ok: true },
      { text: "Transferência para herdeiros", ok: true },
      { text: "Backup e exportação", ok: true },
      { text: "Suporte prioritário sempre", ok: true },
      { text: "Novos recursos futuros", ok: true },
      { text: "QR Code para lápide", ok: true },
      { text: "Temas exclusivos", ok: true },
      { text: "Acesso vitalício garantido", ok: true },
    ],
  },
];

const faqs = [
  {
    q: "O memorial gratuito realmente fica para sempre?",
    a: "Sim, sem exceção. Independente do plano, o memorial nunca é apagado. É um compromisso que assumimos com cada família — porque perder uma memória duas vezes seria imperdoável.",
  },
  {
    q: "Posso cancelar o plano mensal a qualquer momento?",
    a: "Sim, sem multa e sem burocracia. O memorial continua no ar mesmo após o cancelamento, preservando todas as memórias e fotos que você adicionou.",
  },
  {
    q: "O que acontece com as fotos se eu fizer downgrade?",
    a: "Nada. Todas as suas fotos e conteúdos são mantidos com segurança. Você apenas ficará limitado a adicionar novas fotos acima do limite do plano gratuito.",
  },
  {
    q: "Existe desconto para funerárias ou compras em volume?",
    a: "Sim. Temos planos especiais para funerárias e cemitérios parceiros com dashboard central, suporte dedicado e preços especiais. Entre em contato pelo e-mail parceiros@legadoid.com.",
  },
  {
    q: "O QR Code para lápide é físico?",
    a: "Geramos o arquivo do QR Code para que você imprima ou grave em qualquer fornecedor de lápides e placas. O QR Code leva direto ao memorial digital, para sempre.",
  },
];

export default function PrecosPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EF]">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-700/25 text-amber-700 text-[11px] font-semibold uppercase tracking-[0.2em] mb-10">
            Preços simples e transparentes
          </span>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-semibold text-stone-800 mb-7 leading-[0.95]">
            Escolha o plano<br />
            <span className="text-amber-700 italic">certo para você.</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-xl mx-auto leading-relaxed">
            Comece gratuitamente. Faça upgrade quando quiser mais.
            Sem surpresas, sem letras miúdas.
          </p>
        </div>
      </section>

      {/* ── PRICING CARDS ─────────────────────────────────────── */}
      <section className="pb-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                  plan.highlight
                    ? "bg-stone-900 shadow-2xl ring-2 ring-amber-600 md:scale-[1.03] md:-translate-y-2"
                    : "bg-white border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="px-6 pt-6 pb-0">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full ${
                      plan.highlight
                        ? "bg-amber-700/25 text-amber-400"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      ★ {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Plan name */}
                  <h3 className={`font-display text-2xl font-semibold mb-2 ${plan.highlight ? "text-white" : "text-stone-800"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-6 ${plan.highlight ? "text-white/55" : "text-stone-500"}`}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-7">
                    <div className={`font-display text-5xl font-bold leading-none mb-1 ${plan.highlight ? "text-white" : "text-stone-800"}`}>
                      {plan.price}
                    </div>
                    <div className={`text-sm ${plan.highlight ? "text-white/35" : "text-stone-400"}`}>
                      {plan.period}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.href}
                    className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium text-sm transition-all mb-7 ${
                      plan.highlight
                        ? "bg-amber-700 hover:bg-amber-600 text-white"
                        : "bg-stone-800 hover:bg-stone-700 text-white"
                    }`}
                  >
                    {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Divider */}
                  <div className={`h-px mb-6 ${plan.highlight ? "bg-white/10" : "bg-stone-100"}`} />

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          f.ok
                            ? plan.highlight ? "bg-amber-700/30" : "bg-amber-100"
                            : plan.highlight ? "bg-white/8" : "bg-stone-100"
                        }`}>
                          {f.ok ? (
                            <Check className={`w-2.5 h-2.5 ${plan.highlight ? "text-amber-400" : "text-amber-700"}`} />
                          ) : (
                            <Minus className={`w-2.5 h-2.5 ${plan.highlight ? "text-white/25" : "text-stone-300"}`} />
                          )}
                        </div>
                        <span className={`text-sm ${
                          f.ok
                            ? plan.highlight ? "text-white/80" : "text-stone-700"
                            : plan.highlight ? "text-white/25" : "text-stone-300"
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
        </div>
      </section>

      {/* ── GUARANTEE ─────────────────────────────────────────── */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-stone-100 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200/50 flex items-center justify-center">
                <Infinity className="w-9 h-9 text-amber-700" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-stone-800 mb-2">
                Garantia de permanência vitalícia
              </h3>
              <p className="text-stone-500 leading-relaxed">
                Todo memorial criado no LEGADO ID é preservado permanentemente, independente do plano.
                Não importa o que aconteça — seu legado não desaparece.
                É um compromisso que fazemos com cada família que confia em nós.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-700/5 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="font-display text-8xl text-amber-800/40 leading-none mb-2 select-none">"</div>
          <blockquote className="font-display text-2xl md:text-3xl text-white/85 italic leading-relaxed mb-7">
            O que mais me surpreendeu foi a elegância. Não parece um site de obituário.
            Parece um livro de família.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <span className="font-display text-xs font-bold text-white/60">C</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white/70">Cláudia S.</p>
              <p className="text-xs text-white/35">Viúva</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-stone-800 leading-tight">
              Perguntas<br />
              <span className="italic text-amber-700">frequentes</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-100 p-7 hover:border-stone-200 hover:shadow-sm transition-all">
                <h4 className="font-semibold text-stone-800 mb-3 flex items-start gap-3">
                  <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-stone-500 text-sm leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-stone-400 text-sm mb-6">Ainda tem dúvidas? Estamos aqui.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/criar"
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-medium py-3.5 px-7 rounded-xl transition-all text-sm"
              >
                Começar gratuitamente <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="mailto:ola@legadoid.com"
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-600 font-medium py-3.5 px-7 rounded-xl transition-all border border-stone-200 text-sm"
              >
                Falar com a equipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
