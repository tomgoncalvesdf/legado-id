import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exemplos de Memoriais | LEGADO ID",
  description: "Veja como famílias brasileiras estão preservando as histórias de quem amam com o LEGADO ID.",
};

const memorials = [
  {
    name: "Maria das Graças Silva",
    initials: "MG",
    years: "1942 – 2023",
    age: "81 anos",
    city: "São Paulo, SP",
    relation: "Avó e matriarca da família",
    quote: "O amor de uma avó é eterno e incondicional.",
    memories: 47,
    candles: 218,
    theme: { bg: "bg-amber-50", border: "border-amber-200/60", initial: "text-amber-700", dot: "bg-amber-600", badge: "bg-amber-100 text-amber-700" },
    category: "Família",
    featured: true,
  },
  {
    name: "Carlos Eduardo Mendes",
    initials: "CE",
    years: "1955 – 2024",
    age: "68 anos",
    city: "Recife, PE",
    relation: "Médico e pai",
    quote: "Curou corpos e tocou almas por quatro décadas.",
    memories: 83,
    candles: 341,
    theme: { bg: "bg-slate-50", border: "border-slate-200/60", initial: "text-slate-600", dot: "bg-slate-600", badge: "bg-slate-100 text-slate-600" },
    category: "Memória",
    featured: true,
  },
  {
    name: "Ana Beatriz Ferreira",
    initials: "AB",
    years: "1988 – 2022",
    age: "34 anos",
    city: "Curitiba, PR",
    relation: "Mãe e esposa",
    quote: "Partiu cedo, mas deixou um amor que não cabe no tempo.",
    memories: 62,
    candles: 197,
    theme: { bg: "bg-rose-50", border: "border-rose-200/60", initial: "text-rose-600", dot: "bg-rose-600", badge: "bg-rose-100 text-rose-600" },
    category: "Família",
    featured: false,
  },
  {
    name: "José Antônio Oliveira",
    initials: "JA",
    years: "1938 – 2021",
    age: "83 anos",
    city: "Belo Horizonte, MG",
    relation: "Pai e empresário",
    quote: "Construiu um negócio com as mãos e uma família com o coração.",
    memories: 39,
    candles: 156,
    theme: { bg: "bg-stone-50", border: "border-stone-200/60", initial: "text-stone-600", dot: "bg-stone-600", badge: "bg-stone-100 text-stone-600" },
    category: "Legado",
    featured: false,
  },
  {
    name: "Lúcia Helena Costa",
    initials: "LH",
    years: "1960 – 2023",
    age: "63 anos",
    city: "Porto Alegre, RS",
    relation: "Professora e amiga",
    quote: "Formou gerações com sabedoria e alegria.",
    memories: 91,
    candles: 274,
    theme: { bg: "bg-teal-50", border: "border-teal-200/60", initial: "text-teal-700", dot: "bg-teal-600", badge: "bg-teal-100 text-teal-700" },
    category: "Memória",
    featured: true,
  },
  {
    name: "Roberto Andrade",
    initials: "RA",
    years: "1970 – 2024",
    age: "54 anos",
    city: "Fortaleza, CE",
    relation: "Músico e pai",
    quote: "A música que tocou nunca vai parar de soar.",
    memories: 55,
    candles: 183,
    theme: { bg: "bg-violet-50", border: "border-violet-200/60", initial: "text-violet-700", dot: "bg-violet-600", badge: "bg-violet-100 text-violet-700" },
    category: "Arte",
    featured: false,
  },
];

const categories = ["Todos", "Família", "Memória", "Legado", "Arte"];

export default function ExemplosPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EF]">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 to-transparent pointer-events-none" />
        {/* Background decorative text */}
        <div className="absolute inset-x-0 top-16 font-display text-[15vw] font-bold text-stone-100/80 select-none pointer-events-none leading-none text-center hidden md:block">
          LEGADO
        </div>
        <div className="max-w-4xl mx-auto relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-700/25 text-amber-700 text-[11px] font-semibold uppercase tracking-[0.2em] mb-10">
            Memoriais criados no LEGADO ID
          </span>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-semibold text-stone-800 mb-7 leading-[0.95]">
            Histórias reais,<br />
            <span className="text-amber-700 italic">preservadas com amor.</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Cada memorial é tão único quanto a vida que ele homenageia.
            Veja como famílias brasileiras estão guardando suas memórias para sempre.
          </p>
        </div>
      </section>

      {/* ── FILTER ────────────────────────────────────────────── */}
      <section className="pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-stone-400 tracking-wider uppercase mr-2">Filtrar</span>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                  cat === "Todos"
                    ? "bg-stone-800 text-white"
                    : "bg-white text-stone-400 border border-stone-200 hover:border-stone-400 hover:text-stone-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED MEMORIAL (first) ─────────────────────────── */}
      <section className="pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
            <div className="grid md:grid-cols-5">
              {/* Visual side */}
              <div className={`md:col-span-2 ${memorials[0].theme.bg} p-12 flex flex-col items-center justify-center border-r border-stone-100 min-h-[280px]`}>
                <div className={`w-24 h-24 rounded-full bg-white border-2 ${memorials[0].theme.border} flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <span className={`font-display text-3xl font-bold ${memorials[0].theme.initial}`}>
                    {memorials[0].initials}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-stone-800 text-center mb-1">
                  {memorials[0].name}
                </h3>
                <p className="text-stone-400 text-sm mb-4">{memorials[0].years}</p>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${memorials[0].theme.badge}`}>
                  ★ Destaque
                </span>
              </div>
              {/* Content side */}
              <div className="md:col-span-3 p-10 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-5">
                  <span className={`w-2 h-2 rounded-full ${memorials[0].theme.dot}`} />
                  <span className="text-xs text-stone-400 font-medium tracking-wide">{memorials[0].relation}</span>
                  <span className="text-stone-200 mx-1">·</span>
                  <span className="text-xs text-stone-400">{memorials[0].city}</span>
                </div>
                <blockquote className="font-display text-2xl md:text-3xl text-stone-700 italic leading-snug mb-6 border-l-2 border-amber-300 pl-5">
                  "{memorials[0].quote}"
                </blockquote>
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-stone-800">{memorials[0].memories}</div>
                    <div className="text-xs text-stone-400 tracking-wide">memórias</div>
                  </div>
                  <div className="w-px h-8 bg-stone-100" />
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-amber-600">{memorials[0].candles}</div>
                    <div className="text-xs text-stone-400 tracking-wide">velas acesas</div>
                  </div>
                  <div className="w-px h-8 bg-stone-100" />
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-stone-800">{memorials[0].age}</div>
                    <div className="text-xs text-stone-400 tracking-wide">de vida</div>
                  </div>
                </div>
                <Link
                  href="/criar"
                  className="inline-flex items-center gap-2 text-amber-700 text-sm font-semibold group-hover:gap-3 transition-all"
                >
                  Ver memorial completo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEMORIAL GRID ─────────────────────────────────────── */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {memorials.slice(1).map((m, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400"
            >
              {/* Header */}
              <div className={`relative ${m.theme.bg} px-6 pt-8 pb-6 flex flex-col items-center border-b ${m.theme.border}`}>
                {m.featured && (
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${m.theme.badge}`}>
                      ★ Destaque
                    </span>
                  </div>
                )}
                <div className={`w-16 h-16 rounded-full bg-white/80 border ${m.theme.border} flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <span className={`font-display text-2xl font-bold ${m.theme.initial}`}>
                    {m.initials}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-stone-800 text-center leading-tight mb-1">
                  {m.name}
                </h3>
                <p className="text-stone-400 text-xs">{m.years}</p>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className={`w-1.5 h-1.5 rounded-full ${m.theme.dot}`} />
                  <span className="text-xs text-stone-400">{m.relation} · {m.city}</span>
                </div>
                <p className="text-stone-500 text-sm italic leading-relaxed border-l-2 border-stone-100 pl-3 mb-5">
                  "{m.quote}"
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-base font-bold text-stone-700 font-display">{m.memories}</div>
                      <div className="text-[10px] text-stone-400">memórias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-amber-600 font-display">{m.candles}</div>
                      <div className="text-[10px] text-stone-400">velas</div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-700 font-semibold group-hover:underline transition-all cursor-pointer">
                    Ver memorial →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-stone-400 text-xs mt-10 max-w-md mx-auto leading-relaxed">
          Os exemplos acima são ilustrativos para demonstração da plataforma.
          Memoriais reais são privados e visíveis apenas para quem o criador compartilhar.
        </p>
      </section>

      {/* ── DIVIDER QUOTE ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-y border-stone-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-3xl md:text-4xl text-stone-700 italic leading-relaxed">
            "Meus netos nunca conheceram minha avó. Hoje, meu filho de 8 anos
            entra no memorial, vê as fotos, lê a história.
            Isso não tem preço."
          </p>
          <div className="flex items-center justify-center gap-3 mt-7">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
              <span className="font-display text-xs font-bold text-stone-500">M</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-stone-700">Mariana P.</p>
              <p className="text-xs text-stone-400">Neta</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-stone-900 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-transparent pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-800/10 blur-3xl pointer-events-none" />
            <div className="relative px-10 py-20 md:px-20 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-700/20 text-amber-400 text-[11px] font-semibold uppercase tracking-[0.18em] mb-8">
                Comece agora
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">
                Crie o memorial<br />
                <span className="italic text-amber-400">da sua família</span>
              </h2>
              <p className="text-white/55 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Gratuito, bonito e permanente. Em 5 minutos o memorial
                está pronto para receber memórias.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/criar"
                  className="inline-flex items-center justify-center gap-2.5 bg-amber-700 hover:bg-amber-600 text-white font-medium py-4 px-8 rounded-xl transition-colors text-sm tracking-wide"
                >
                  Criar memorial gratuito <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/precos"
                  className="inline-flex items-center justify-center bg-white/8 hover:bg-white/15 text-white/80 font-medium py-4 px-8 rounded-xl transition-colors border border-white/15 text-sm"
                >
                  Ver planos e preços
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
