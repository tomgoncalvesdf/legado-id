import Link from "next/link";
import { Flame, UserPlus, ImagePlus, Share2, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como Funciona | LEGADO ID",
  description: "Veja como criar um memorial digital em minutos. Simples, bonito e eterno.",
};

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta",
    description:
      "Cadastre-se gratuitamente em segundos. Sem cartão de crédito, sem compromisso. Sua conta é o ponto de partida para guardar histórias para sempre.",
  },
  {
    icon: Flame,
    number: "02",
    title: "Crie o memorial",
    description:
      "Preencha as informações do ente querido — nome, datas, história de vida, frases marcantes. Nossa interface guia você passo a passo com carinho.",
  },
  {
    icon: ImagePlus,
    number: "03",
    title: "Adicione fotos e memórias",
    description:
      "Faça upload de fotos, crie uma linha do tempo com momentos especiais e escreva a biografia. O memorial ganha vida com cada detalhe que você adiciona.",
  },
  {
    icon: Share2,
    number: "04",
    title: "Compartilhe com a família",
    description:
      "Envie o link para familiares e amigos. Eles podem deixar mensagens, acender velas virtuais e contribuir com suas próprias memórias e fotos.",
  },
  {
    icon: Heart,
    number: "05",
    title: "Preserve para sempre",
    description:
      "O memorial fica disponível online permanentemente. Futuras gerações poderão conhecer e se conectar com a história de quem você amou.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-deep/10 text-amber-deep text-sm font-medium mb-6">
            Simples como deve ser
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-stone mb-6 leading-tight">
            Como o <span className="text-amber-deep">LEGADO ID</span> funciona
          </h1>
          <p className="text-lg text-stone/60 max-w-xl mx-auto">
            Em menos de 5 minutos você cria um memorial digital completo, bonito e eterno para quem você ama.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-6 items-start bg-white rounded-2xl p-8 shadow-sm border border-border">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-amber-deep/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-amber-deep" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-deep/60 tracking-widest uppercase">
                    Passo {step.number}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-stone mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 text-center">
        <div className="max-w-xl mx-auto bg-stone rounded-2xl p-10">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Pronto para começar?
          </h2>
          <p className="text-white/60 mb-8">
            Crie o memorial gratuitamente agora mesmo.
          </p>
          <Link href="/criar" className="btn-primary">
            Criar memorial gratuitamente
          </Link>
        </div>
      </section>
    </main>
  );
}
