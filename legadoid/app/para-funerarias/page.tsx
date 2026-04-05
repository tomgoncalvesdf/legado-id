import Link from "next/link";
import { Building2, QrCode, Users, BarChart3, Headphones, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para Funerárias | LEGADO ID",
  description: "Ofereça memoriais digitais premium como serviço adicional. Aumente a receita e entregue mais valor às famílias.",
};

const benefits = [
  {
    icon: Building2,
    title: "Serviço adicional de alto valor",
    description: "Ofereça memoriais digitais como complemento aos seus serviços. Uma nova fonte de receita sem custo operacional extra.",
  },
  {
    icon: QrCode,
    title: "QR Code para lápides",
    description: "Disponibilize QR Codes que levam ao memorial digital quando escaneados. Uma experiência moderna e emocionante.",
  },
  {
    icon: Users,
    title: "Dashboard para sua equipe",
    description: "Gerencie todos os memoriais criados pela sua funerária em um painel centralizado e fácil de usar.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e métricas",
    description: "Acompanhe quantas famílias foram atendidas, visitas aos memoriais e muito mais através do painel administrativo.",
  },
  {
    icon: Headphones,
    title: "Suporte dedicado",
    description: "Acesso a um gerente de conta exclusivo para funerárias parceiras. Suporte rápido via WhatsApp.",
  },
  {
    icon: Shield,
    title: "Marca branca disponível",
    description: "Opção de oferecer o serviço com a sua própria marca. Seus clientes veem apenas o nome da sua empresa.",
  },
];

export default function ParaFunerariasPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-deep/10 text-amber-deep text-sm font-medium mb-6">
            Para funerárias e cemitérios
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-stone mb-6 leading-tight">
            Entregue mais do que um serviço.{" "}
            <span className="text-amber-deep">Entregue um legado.</span>
          </h1>
          <p className="text-lg text-stone/60 max-w-xl mx-auto">
            Parceiros do LEGADO ID oferecem memoriais digitais premium às famílias, agregando valor ao serviço e gerando nova receita.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:parceiros@legadoid.com" className="btn-primary">
              Quero ser parceiro
            </Link>
            <Link href="/criar" className="btn-secondary">
              Ver demonstração
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-semibold text-stone text-center mb-12">
            Benefícios exclusivos para parceiros
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-amber-deep/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-amber-deep" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-stone mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-stone/60 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4">
        <div className="max-w-2xl mx-auto bg-stone rounded-2xl p-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Vamos conversar?
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Entre em contato com nossa equipe comercial. Explicamos tudo sobre o programa de parceiros, comissões e como funciona na prática.
          </p>
          <Link
            href="mailto:parceiros@legadoid.com"
            className="inline-block bg-amber-deep text-white py-3 px-8 rounded-xl font-medium hover:bg-amber-deep/90 transition-colors"
          >
            Entrar em contato
          </Link>
          <p className="text-white/30 text-sm mt-4">parceiros@legadoid.com</p>
        </div>
      </section>
    </main>
  );
}
