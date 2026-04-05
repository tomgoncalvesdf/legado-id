import Link from "next/link";
import { QrCode, Users, BarChart3, Headphones, Shield, ArrowRight, TrendingUp, Award, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para Funerárias | LEGADO ID",
  description: "Ofereça memoriais digitais premium como serviço adicional. Aumente a receita e entregue mais valor às famílias.",
};

const stats = [
  {
    number: "94%",
    label: "das famílias voltam ao memorial nos 12 meses seguintes ao serviço",
  },
  {
    number: "3×",
    label: "mais tempo de relacionamento com a família após o funeral",
  },
  {
    number: "R$\u00a0297",
    label: "ticket médio por memorial no plano Eterno",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Nova fonte de receita",
    description:
      "Ofereça memoriais digitais como complemento natural ao atendimento. Agregue valor real às famílias e aumente o ticket médio sem custo operacional extra.",
  },
  {
    icon: QrCode,
    title: "QR Code para lápide",
    description:
      "Disponibilize QR Codes físicos que levam ao memorial digital. Uma experiência moderna, emocionante e diferenciada para os visitantes do cemitério.",
  },
  {
    icon: Users,
    title: "Dashboard central",
    description:
      "Gerencie todos os memoriais criados pela sua funerária em um painel único e intuitivo — com visão completa de cada família atendida.",
  },
  {
    icon: BarChart3,
    title: "Métricas e relatórios",
    description:
      "Acompanhe o número de famílias atendidas, visitas aos memoriais, engajamento e mais, através de relatórios mensais automatizados.",
  },
  {
    icon: Headphones,
    title: "Suporte dedicado",
    description:
      "Um gerente de conta exclusivo. Suporte ágil via WhatsApp e treinamento completo para sua equipe — sem custo adicional.",
  },
  {
    icon: Shield,
    title: "Marca branca disponível",
    description:
      "Ofereça o serviço com a sua própria identidade visual. Seus clientes veem apenas o nome e a marca da sua empresa.",
  },
];

const steps = [
  {
    number: "01",
    title: "Entre em contato",
    description: "Nossa equipe apresenta o programa de parceiros, tira todas as dúvidas e entende seu contexto.",
  },
  {
    number: "02",
    title: "Assine o contrato",
    description: "Planos flexíveis para funerárias de todos os portes, sem burocracia e sem fidelidade forçada.",
  },
  {
    number: "03",
    title: "Treinamento",
    description: "Capacitamos sua equipe em menos de 2 horas. Interface simples, processo guiado.",
  },
  {
    number: "04",
    title: "Comece a oferecer",
    description: "Oferça o serviço às famílias desde o primeiro dia. Receita imediata, valor real entregue.",
  },
];

const included = [
  "Dashboard central para sua funerária",
  "Memoriais ilimitados por família",
  "QR Codes para lápides",
  "Relatórios mensais automatizados",
  "Suporte dedicado via WhatsApp",
  "Treinamento completo da equipe",
  "Opção de marca branca",
  "Gerente de conta exclusivo",
];

export default function ParaFunerariasPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EF]">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/70 to-transparent pointer-events-none" />
        {/* Decorative */}
        <div className="absolute right-0 top-20 font-display text-[18vw] font-bold text-stone-100 select-none pointer-events-none leading-none pr-2 hidden lg:block">
          B2B
        </div>
        <div className="max-w-4xl mx-auto relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-700/25 text-amber-700 text-[11px] font-semibold uppercase tracking-[0.2em] mb-10">
            Programa de parceiros
          </span>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-semibold text-stone-800 mb-7 leading-[0.95]">
            Entregue mais do<br />
            que um serviço.<br />
            <span className="text-amber-700 italic">Um legado.</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl leading-relaxed mb-12">
            Funerárias e cemitérios parceiros do LEGADO ID oferecem memoriais
            digitais premium — diferenciando o atendimento e gerando nova receita
            com alto valor percebido pelas famílias.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="mailto:parceiros@legadoid.com"
              className="inline-flex items-center gap-2.5 bg-stone-800 hover:bg-stone-700 text-white font-medium py-4 px-8 rounded-xl transition-all text-sm tracking-wide"
            >
              Quero ser parceiro <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/como-funciona"
              className="inline-flex items-center gap-2.5 bg-white hover:bg-stone-50 text-stone-600 font-medium py-4 px-8 rounded-xl transition-all border border-stone-200 text-sm"
            >
              Ver como funciona
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-100 p-10 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="font-display text-6xl font-bold text-amber-700 mb-4 leading-none">
                  {s.number}
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER STATEMENT ─────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-y border-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-2xl md:text-3xl text-stone-600 italic leading-relaxed">
            "A família que você atendeu ontem vai voltar ao memorial por anos.
            Cada visita é uma lembrança de quem os acompanhou
            no momento mais difícil."
          </p>
        </div>
      </section>

      {/* ── BENEFITS ──────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold uppercase tracking-[0.18em] mb-5">
              Exclusivo para parceiros
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-stone-800 leading-tight">
              Benefícios da parceria
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-stone-50 group-hover:bg-amber-50 transition-colors flex items-center justify-center mb-5 border border-stone-100 group-hover:border-amber-200/60">
                    <Icon className="w-5 h-5 text-stone-400 group-hover:text-amber-700 transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-stone-800 mb-2.5">{b.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────── */}
      <section className="pb-28 px-6 bg-white border-y border-stone-100">
        <div className="max-w-4xl mx-auto py-24">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-stone-800 leading-tight">
              Como funciona<br />
              <span className="italic text-amber-700">a parceria</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="group text-center">
                <div className="w-14 h-14 rounded-2xl bg-stone-800 group-hover:bg-amber-700 transition-colors flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <span className="font-display text-white font-bold text-sm">{s.number}</span>
                </div>
                <h4 className="font-display font-semibold text-stone-800 mb-2 text-base">{s.title}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BLOCK ─────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-stone-900 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-stone-900/0 pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-700/5 blur-3xl pointer-events-none" />
            <div className="relative px-10 py-16 md:px-16 md:py-20">
              <div className="grid md:grid-cols-5 gap-12 items-center">
                {/* Left */}
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2.5 mb-6">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-[11px] font-bold uppercase tracking-[0.18em]">
                      Parceria premium
                    </span>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">
                    Vamos conversar<br />
                    <span className="italic text-amber-400">sobre sua funerária?</span>
                  </h2>
                  <p className="text-white/55 leading-relaxed mb-8">
                    Nossa equipe apresenta o programa completo, os planos disponíveis
                    e como implementar em sua operação sem complicações.
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {included.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-amber-700/30 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-amber-400" />
                        </div>
                        <span className="text-white/60 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div className="md:col-span-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Entre em contato</p>
                    <p className="text-white font-semibold text-lg mb-2">parceiros@legadoid.com</p>
                    <p className="text-white/35 text-sm mb-7 leading-relaxed">
                      Nossa equipe responde em até 24 horas úteis com uma proposta personalizada.
                    </p>
                    <Link
                      href="mailto:parceiros@legadoid.com"
                      className="flex items-center justify-center gap-2.5 bg-amber-700 hover:bg-amber-600 text-white font-medium py-4 px-7 rounded-xl transition-colors w-full text-sm"
                    >
                      Enviar mensagem <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/criar"
                      className="flex items-center justify-center gap-2 mt-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 font-medium py-3.5 px-7 rounded-xl transition-colors w-full text-sm border border-white/8"
                    >
                      Ver demonstração do memorial
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
