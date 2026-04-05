import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exemplos de Memoriais | LEGADO ID",
  description: "Veja como famílias brasileiras estão preservando as histórias de quem amam com o LEGADO ID.",
};

const memorials = [
  {
    name: "Maria das Graças",
    surname: "Silva",
    years: "1942 – 2023",
    age: "81 anos",
    city: "São Paulo, SP",
    relation: "Avó e matriarca",
    quote: "\"O amor de uma avó é eterno e incondicional.\"",
    bg: "from-amber-100 to-orange-50",
    accent: "bg-amber-700",
    textAccent: "text-amber-700",
    category: "Família",
    popular: true,
  },
  {
    name: "Carlos Eduardo",
    surname: "Mendes",
    years: "1955 – 2024",
    age: "68 anos",
    city: "Recife, PE",
    relation: "Médico e pai",
    quote: "\"Curou corpos e tocou almas por quatro décadas.\"",
    bg: "from-slate-200 to-blue-50",
    accent: "bg-slate-700",
    textAccent: "text-slate-700",
    category: "Memória",
    popular: true,
  },
  {
    name: "Ana Beatriz",
    surname: "Ferreira",
    years: "1988 – 2022",
    age: "34 anos",
    city: "Curitiba, PR",
    relation: "Mãe e esposa",
    quote: "\"Partiu cedo, mas deixou um amor que não cabe no tempo.\"",
    bg: "from-rose-100 to-pink-50",
    accent: "bg-rose-700",
    textAccent: "text-rose-700",
    category: "Família",
    popular: false,
  },
  {
    name: "José Antônio",
    surname: "Oliveira",
    years: "1938 – 2021",
    age: "83 anos",
    city: "Belo Horizonte, MG",
    relation: "Pai e empresário",
    quote: "\"Construiu um negócio com as mãos e uma família com o coração.\"",
    bg: "from-stone-200 to-neutral-50",
    accent: "bg-stone-700",
    textAccent: "text-stone-700",
    category: "Legado",
    popular: false,
  },
  {
    name: "Lúcia Helena",
    surname: "Costa",
    years: "1960 – 2023",
    age: "63 anos",
    city: "Porto Alegre, RS",
    relation: "Professora e amiga",
    quote: "\"Formou gerações com sabedoria e alegria.\"",
    bg: "from-teal-100 to-emerald-50",
    accent: "bg-teal-700",
    textAccent: "text-teal-700",
    category: "Memória",
    popular: true,
  },
  {
    name: "Roberto",
    surname: "Andrade",
    years: "1970 – 2024",
    age: "54 anos",
    city: "Fortaleza, CE",
    relation: "Músico e pai",
    quote: "\"A música que tocou nunca vai parar de soar.\"",
    bg: "from-violet-100 to-purple-50",
    accent: "bg-violet-700",
    textAccent: "text-violet-700",
    category: "Arte",
    popular: false,
  },
];

const categories = ["Todos", "Família", "Memória", "Legado", "Arte"];

export default function ExemplosPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EF]">

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-700/30 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-8">
            Memoriais criados no LEGADO ID
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-stone-800 mb-6 leading-[1.1]">
            Histórias reais,<br />
            <span className="text-amber-700 italic">preservadas com amor</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Cada memorial é único como a vida da pessoa que ele homenageia.
            Veja como famílias brasileiras estão guardando memórias para sempre.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap justify-center mb-2">
            <span className="text-sm text-stone-400 mr-2">Filtrar por:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  cat === "Todos"
                    ? "bg-stone-800 text-white border-stone-800"
                    : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Memorial Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memorials.map((m, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card visual header */}
              <div className={`relative h-48 bg-gradient-to-br ${m.bg} flex flex-col items-center justify-center p-6`}>
                {m.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      ★ Popular
                    </span>
                  </div>
                )}
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-white/60 border-2 border-white flex items-center justify-center mb-3 shadow-sm">
                  <span className={`font-display text-2xl font-semibold ${m.textAccent}`}>
                    {m.name[0]}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-stone-800 text-center leading-tight">
                  {m.name}<br />{m.surname}
                </h3>
                <p className="text-stone-500 text-sm mt-1">{m.years}</p>
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${m.accent}`} />
                  <span className="text-xs text-stone-400 font-medium">{m.relation}</span>
                  <span className="text-stone-200 mx-1">·</span>
                  <span className="text-xs text-stone-400">{m.city}</span>
                </div>
                <p className="text-stone-500 text-sm italic leading-relaxed border-l-2 border-stone-100 pl-3">
                  {m.quote}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-stone-50 text-stone-400 border border-stone-100">
                    {m.age}
                  </span>
                  <span className="text-xs text-amber-700 font-medium group-hover:underline cursor-pointer">
                    Ver memorial →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-stone-400 text-xs mt-10 max-w-md mx-auto">
          * Os exemplos acima são ilustrativos para demonstração da plataforma.
          Memoriais reais são privados e visíveis apenas para quem o criador compartilhar.
        </p>
      </section>

      {/* CTA section */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-stone-800 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-transparent pointer-events-none" />
            <div className="relative px-8 py-16 md:px-16 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-700/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-6">
                Comece agora
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
                Crie o memorial da sua família
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                Gratuito, bonito e permanente. Em 5 minutos o memorial está pronto para receber memórias.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/criar"
                  className="inline-block bg-amber-700 hover:bg-amber-600 text-white font-medium py-3.5 px-8 rounded-xl transition-colors"
                >
                  Criar memorial gratuito
                </Link>
                <Link
                  href="/precos"
                  className="inline-block bg-white/10 hover:bg-white/20 text-white font-medium py-3.5 px-8 rounded-xl transition-colors border border-white/20"
                >
                  Ver planos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
