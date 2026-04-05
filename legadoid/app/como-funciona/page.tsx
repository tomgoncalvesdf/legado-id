import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como Funciona | LEGADO ID",
  description: "Criar um memorial digital no LEGADO ID é simples, guiado e profundo. Em minutos, um legado para sempre.",
};

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    subtitle: "Sem cartão. Sem burocracia.",
    description:
      "Cadastre-se com e-mail ou Google em menos de 60 segundos. O memorial começa a ganhar forma imediatamente — você ainda não precisa saber o que vai escrever.",
    detail: "Gratuito para sempre",
    note: "Não pedimos cartão de crédito para começar",
  },
  {
    number: "02",
    title: "Inicie o memorial",
    subtitle: "Guiado, passo a passo.",
    description:
      "Nome, datas, história de vida. Nossa interface conduz você com cuidado — como um assistente silencioso ao lado, nunca pressionando, sempre esperando. Leva de 3 a 5 minutos.",
    detail: "Interface guiada",
    note: "Você pode pausar e retomar quando quiser",
  },
  {
    number: "03",
    title: "Adicione fotos e memórias",
    subtitle: "Cada foto tem um peso.",
    description:
      "Faça upload de fotos de celulares, álbuns antigos, prints de conversas. Organize uma galeria e crie uma linha do tempo com os momentos que definiram uma vida. O memorial ganha alma com cada detalhe.",
    detail: "Galeria ilimitada no plano Premium",
    note: "Fotos ficam guardadas com segurança para sempre",
  },
  {
    number: "04",
    title: "Convide quem você ama",
    subtitle: "Um tributo coletivo.",
    description:
      "Envie o link para família e amigos. Cada um pode deixar uma mensagem, acender uma vela virtual, adicionar fotos que você talvez nunca tivesse visto. O memorial se torna um espaço vivo, colaborativo.",
    detail: "Privacidade total — você controla quem acessa",
    note: "Sem cadastro necessário para quem contribui",
  },
  {
    number: "05",
    title: "Preserve para gerações",
    subtitle: "O legado é eterno.",
    description:
      "Seus filhos, netos e bisnetos poderão conhecer quem eles nunca encontraram. Com o QR Code para a lápide, qualquer visitante do cemitério acessa o memorial em segundos. Uma vida inteira, ao alcance de um toque.",
    detail: "Garantia de permanência vitalícia",
    note: "O memorial nunca é apagado, independente do plano",
  },
];

const included = [
  "Design elegante em todos os dispositivos",
  "Galeria de fotos e vídeos",
  "Mural de memórias colaborativo",
  "Velas virtuais com mensagem",
  "Linha do tempo de vida",
  "Privacidade e controle total",
  "QR Code para lápide",
  "Disponível permanentemente",
];

const testimonial = {
  quote:
    "Fiz o memorial do meu pai em uma hora, ainda no dia do velório. Quando compartilhei no grupo da família, minha tia ligou chorando — ela tinha fotos que a gente nunca tinha visto.",
  name: "Rodrigo M.",
  role: "Filho",
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EF]">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 to-transparent pointer-events-none" />
        {/* Decorative large number */}
        <div className="absolute right-0 top-20 font-display text-[20vw] font-bold text-stone-100 select-none pointer-events-none leading-none pr-4 hidden lg:block">
          5
        </div>
        <div className="max-w-4xl mx-auto relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-700/25 text-amber-700 text-[11px] font-semibold uppercase tracking-[0.2em] mb-10">
            Simples como deve ser
          </span>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-semibold text-stone-800 leading-[0.95] mb-8">
            Cinco passos.<br />
            <span className="text-amber-700 italic">Um legado eterno.</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-xl leading-relaxed mb-12">
            Criar um memorial no LEGADO ID é intuitivo, guiado e profundo.
            Você foca nas memórias — nós cuidamos do resto.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/criar"
              className="inline-flex items-center gap-2.5 bg-stone-800 hover:bg-stone-700 text-white font-medium py-4 px-8 rounded-xl transition-all text-sm tracking-wide"
            >
              Começar gratuitamente <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/exemplos"
              className="inline-flex items-center gap-2.5 bg-white hover:bg-stone-50 text-stone-600 font-medium py-4 px-8 rounded-xl transition-all border border-stone-200 text-sm"
            >
              Ver exemplos reais
            </Link>
          </div>
        </div>
      </section>

      {/* ── STEPS ─────────────────────────────────────────────── */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-0">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div className="absolute left-[52px] top-[88px] w-px h-[calc(100%-40px)] bg-gradient-to-b from-amber-200 via-amber-100 to-transparent z-0" />
                  )}

                  <div className="flex gap-8 md:gap-12 group py-8">
                    {/* Step number */}
                    <div className="flex-shrink-0 z-10">
                      <div className="w-[72px] h-[72px] rounded-2xl bg-white border border-stone-100 shadow-sm group-hover:shadow-md group-hover:border-amber-200 transition-all duration-300 flex items-center justify-center">
                        <span className="font-display text-2xl font-bold text-stone-300 group-hover:text-amber-600 transition-colors duration-300">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="mb-1">
                        <span className="text-[11px] font-semibold text-amber-700/70 uppercase tracking-[0.18em]">
                          {step.subtitle}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-semibold text-stone-800 mb-3 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-stone-500 leading-relaxed text-base max-w-xl mb-4">
                        {step.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-2 text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          {step.detail}
                        </span>
                        <span className="text-xs text-stone-400">{step.note}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL PULL-QUOTE ────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-y border-stone-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-display text-7xl text-amber-200 leading-none mb-4 select-none">"</div>
          <blockquote className="font-display text-2xl md:text-3xl text-stone-700 leading-relaxed font-medium italic mb-8">
            {testimonial.quote}
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
              <span className="font-display text-sm font-bold text-stone-500">
                {testimonial.name[0]}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-stone-700">{testimonial.name}</p>
              <p className="text-xs text-stone-400">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TUDO INCLUSO ──────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-stone-900 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/25 to-stone-900/0 pointer-events-none" />
            {/* Decorative */}
            <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-amber-900/10 blur-3xl pointer-events-none" />
            <div className="relative p-10 md:p-16 lg:p-20">
              <div className="grid md:grid-cols-2 gap-14 items-center">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-700/20 text-amber-400 text-[11px] font-semibold uppercase tracking-[0.18em] mb-6">
                    Tudo incluso
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">
                    Tudo que um memorial<br />
                    <span className="text-amber-400 italic">precisa ter</span>
                  </h2>
                  <p className="text-white/55 leading-relaxed mb-10 text-base">
                    Cada recurso foi criado para tornar a experiência de criar e
                    visitar um memorial algo verdadeiramente especial.
                  </p>
                  <Link
                    href="/criar"
                    className="inline-flex items-center gap-2.5 bg-amber-700 hover:bg-amber-600 text-white font-medium py-4 px-8 rounded-xl transition-colors text-sm"
                  >
                    Criar memorial gratuito <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {included.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl px-5 py-3.5 transition-colors group cursor-default">
                      <div className="w-5 h-5 rounded-full bg-amber-700/25 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-amber-400" />
                      </div>
                      <span className="text-white/75 text-sm group-hover:text-white/90 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="pb-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-stone-800 mb-5 leading-tight">
            Pronto para criar<br />
            <span className="italic text-amber-700">o memorial?</span>
          </h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Gratuitamente. Sem cartão de crédito. O memorial fica pronto em minutos
            e disponível para sempre.
          </p>
          <Link
            href="/criar"
            className="inline-flex items-center gap-2.5 bg-stone-800 hover:bg-stone-700 text-white font-medium py-4 px-10 rounded-xl transition-all text-sm tracking-wide"
          >
            Começar agora <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-stone-400 text-xs mt-5">
            Mais de 500 famílias brasileiras já criaram seu memorial no LEGADO ID
          </p>
        </div>
      </section>
    </main>
  );
}
