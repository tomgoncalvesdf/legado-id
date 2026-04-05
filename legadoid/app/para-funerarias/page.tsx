import Link from "next/link";
import { Building2, QrCode, Users, BarChart3, Headphones, Shield, ArrowRight, TrendingUp, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para Funerárias | LEGADO ID",
  description: "Ofereça memoriais digitais premium como serviço adicional. Aumente a receita e entregue mais valor às famílias.",
};

const benefits = [
  {
    icon: TrendingUp,
    title: "Nova fonte de receita",
    description: "Ofereça memoriais digitais como complemento ao atendimento. Agregue valor real às famílias e aumente o ticket médio sem custo operacional extra.",
  },
  {
    icon: QrCode,
    title: "QR Code para lápide",
    description: "Disponibilize QR Codes físicos que levam ao memorial digital. Uma experiência moderna, emocionante e diferenciada para os visitantes do cemitério.",
  },
  {
    icon: Users,
    title: "Dashboard central",
    description: "Gerencie todos os memoriais criados pela sua funerária em um painel único e intuitivo. Visão completa de cada família atendida.",
  },
  {
    icon: BarChart3,
    title: "Métricas e relatórios",
    description: "Acompanhe o número de famílias atendidas, visitas aos memoriais, engajamento e muito mais através de relatórios mensais automatizados.",
  },
  {
    icon: Headphones,
    title: "Suporte dedicado",
    description: "Acesso a um gerente de conta exclusivo. Suporte ágil via WhatsApp e treinamento completo para sua equipe sem custo adicional.",
  },
  {
    icon: Shield,
    title: "Marca branca",
    description: "Opção de oferecer o serviço com a sua própria identidade visual. Seus clientes veem apenas o nome e a marca da sua empresa.",
  },
];

const stats = [
  { number: "94%", label: "das famílias voltam ao memorial nos 12 meses seguintes" },
  { number: "3x", label: "mais tempo de relacionamento com a família após o serviço" },
  { number: "R$ 297", label: "ticket médio por memorial Premium" },
];

const steps = [
  { number: "01", title: "Entre em contato", description: "Nossa equipe apresenta o programa de parceiros e tira todas as dúvidas." },
  { number: "02", title: "Assine o contrato", description: "Planos flexíveis para funerárias de todos os portes, sem burocracia." },
  { number: "03", title: "Treinamento da equipe", description: "Capacitamos sua equipe em menos de 2 horas. É simples e intuitivo." },
  { number: "04", title: "Comece a oferecer", description: "Ofereça o serviço às famílias desde o primeiro dia de parceria." },
];

export default function ParaFunerariasPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EF]">

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/80 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-700/30 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-8">
            Programa de parceiros
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-stone-800 mb-6 leading-[1.1]">
            Entregue mais do que<br />
            <span className="text-amber-700 italic">um serviço. Um legado.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Funerárias e cemitérios parceiros do LEGADO ID oferecem memoriais digitais premium,
            diferenciando o atendimento e gerando nova receita com alto valor percebido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:parceiros@legadoid.com"
              className="inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-medium py-4 px-8 rounded-xl transition-all"
            >
              Quero ser parceiro <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/criar"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 font-medium py-4 px-8 rounded-xl transition-all border border-stone-200"
            >
              Ver demonstração
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-8 text-center shadow-sm">
              <div className="font-display text-5xl font-bold text-amber-700 mb-3">{s.number}</div>
              <p className="text-stone-500 text-sm leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-4">
              Vantagens exclusivas
            </span>
            <h2 className="font-display text-4xl font-semibold text-stone-800">
              Benefícios para parceiros
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-stone-800 mb-2">{b.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works for partners */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-semibold text-stone-800">
              Como funciona a parceria
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-stone-800 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {s.number}
                </div>
                <h4 className="font-semibold text-stone-800 mb-2">{s.title}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-stone-800 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-transparent pointer-events-none" />
            <div className="relative px-8 py-16 md:px-16">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">
                      Parceria premium
                    </span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
                    Vamos conversar sobre sua funerária?
                  </h2>
                  <p className="text-white/60 leading-relaxed">
                    Nossa equipe apresenta o programa completo, os planos disponíveis e como implementar em sua operação sem complicações.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <p className="text-white/50 text-sm mb-2">Entre em contato por</p>
                  <p className="text-white font-medium text-lg mb-6">parceiros@legadoid.com</p>
                  <Link
                    href="mailto:parceiros@legadoid.com"
                    className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-medium py-3.5 px-7 rounded-xl transition-colors w-full"
                  >
                    Enviar mensagem <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-white/30 text-xs text-center mt-4">
                    Resposta em até 24 horas úteis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
