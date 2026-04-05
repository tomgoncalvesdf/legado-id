import Link from "next/link";
import { Flame, UserPlus, ImagePlus, Share2, Heart, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como Funciona | LEGADO ID",
  description: "Veja como criar um memorial digital premium em minutos. Simples, bonito e eterno.",
};

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta gratuitamente",
    description:
      "Cadastre-se em segundos usando seu e-mail ou conta Google. Sem cartão de crédito, sem burocracia. Você começa a criar imediatamente.",
    detail: "Leva menos de 1 minuto",
  },
  {
    icon: Flame,
    number: "02",
    title: "Inicie o memorial",
    description:
      "Preencha o nome, datas e história de vida. Nossa interface guia você com carinho em cada etapa — como um assistente dedicado ao lado.",
    detail: "Processo guiado passo a passo",
  },
  {
    icon: ImagePlus,
    number: "03",
    title: "Adicione fotos e memórias",
    description:
      "Faça upload de fotos, organize uma galeria e crie uma linha do tempo com os momentos mais importantes. O memorial ganha vida com cada detalhe.",
    detail: "Ilimitado no plano Premium",
  },
  {
    icon: Share2,
    number: "04",
    title: "Convide família e amigos",
    description:
      "Compartilhe o link com quem você quiser. Familiares podem deixar mensagens, acender velas virtuais e contribuir com suas próprias fotos e memórias.",
    detail: "Privacidade total sob seu controle",
  },
  {
    icon: Heart,
    number: "05",
    title: "Preserve para gerações",
    description:
      "O memorial fica disponível online para sempre. Seus filhos, netos e bisnetos poderão conhecer e se conectar com a história de quem eles nunca conheceram.",
    detail: "Garantia de permanência vitalícia",
  },
];

const features = [
  { label: "Design elegante e responsivo" },
  { label: "Galeria de fotos ilimitada" },
  { label: "Mural de memórias colaborativo" },
  { label: "Velas virtuais com mensagem" },
  { label: "Linha do tempo de vida" },
  { label: "Controle total de privacidade" },
  { label: "QR Code para lápide" },
  { label: "Disponível para sempre" },
];

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EF]">

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-700/30 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-8">
            Simples como deve ser
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-stone-800 mb-6 leading-[1.1]">
            Em 5 minutos,<br />
            <span className="text-amber-700 italic">um legado para sempre</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Criar um memorial digital no LEGADO ID é intuitivo e guiado.
            Você foca nas memórias — nós cuidamos do resto.
          </p>
          <Link
            href="/criar"
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-medium py-4 px-8 rounded-xl transition-all"
          >
            Começar agora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              return (
                <div key={index} className="relative flex gap-6">
                  {/* Line connector */}
                  {!isLast && (
                    <div className="absolute left-8 top-20 bottom-0 w-px bg-gradient-to-b from-amber-200 to-transparent" />
                  )}
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-center justify-center z-10">
                    <Icon className="w-6 h-6 text-amber-700" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs font-bold text-amber-700/60 tracking-widest uppercase">
                          Passo {step.number}
                        </span>
                        <h3 className="font-display text-xl font-semibold text-stone-800 mt-1 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-stone-500 leading-relaxed text-[15px]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-stone-50">
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                        {step.detail}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-stone-800 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent pointer-events-none" />
            <div className="relative p-10 md:p-14">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-700/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-5">
                    Tudo incluso
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
                    Tudo que você precisa para um memorial perfeito
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-8">
                    Cada recurso foi pensado para tornar a experiência de criar e visitar um memorial algo especial.
                  </p>
                  <Link
                    href="/criar"
                    className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-medium py-3.5 px-7 rounded-xl transition-colors"
                  >
                    Criar memorial gratuito <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
