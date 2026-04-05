import Link from "next/link";
import { Flame } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exemplos de Memoriais | LEGADO ID",
  description: "Veja exemplos de memoriais digitais criados no LEGADO ID. Histórias reais preservadas com carinho.",
};

const examples = [
  {
    name: "Maria das Graças Silva",
    years: "1942 – 2023",
    relation: "Avó e matriarca",
    description: "Uma vida dedicada à família, à fé e ao amor incondicional. Seus netos criaram este memorial para preservar suas histórias, receitas e sabedoria.",
    tags: ["Família", "81 anos", "São Paulo"],
    color: "bg-amber-50",
  },
  {
    name: "Dr. Carlos Eduardo Mendes",
    years: "1955 – 2024",
    relation: "Médico e pai",
    description: "Quarenta anos de medicina dedicados aos pacientes do interior do Nordeste. Um legado de cuidado e humanidade que seus filhos registraram com orgulho.",
    tags: ["Medicina", "68 anos", "Recife"],
    color: "bg-stone-50",
  },
  {
    name: "Ana Beatriz Ferreira",
    years: "1988 – 2022",
    relation: "Mãe jovem",
    description: "Partiu cedo demais, mas deixou um amor imenso. Seus filhos, marido e amigos mantêm viva sua memória através de fotos, músicas e histórias que ela adorava.",
    tags: ["Mãe", "34 anos", "Curitiba"],
    color: "bg-rose-50",
  },
];

export default function ExemplosPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-deep/10 text-amber-deep text-sm font-medium mb-6">
            Histórias reais
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-stone mb-6 leading-tight">
            Memoriais criados com <span className="text-amber-deep">carinho</span>
          </h1>
          <p className="text-lg text-stone/60 max-w-xl mx-auto">
            Cada memorial é único. Veja como famílias brasileiras estão preservando as histórias de quem amam.
          </p>
        </div>
      </section>

      {/* Examples */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <div key={index} className={`${example.color} rounded-2xl p-6 border border-border`}>
              <div className="w-12 h-12 rounded-full bg-stone/10 flex items-center justify-center mb-4">
                <Flame className="w-5 h-5 text-amber-deep" />
              </div>
              <h3 className="font-display text-lg font-semibold text-stone mb-1">{example.name}</h3>
              <p className="text-sm text-stone/50 mb-1">{example.years}</p>
              <p className="text-xs text-amber-deep font-medium mb-3">{example.relation}</p>
              <p className="text-sm text-stone/60 leading-relaxed mb-4">{example.description}</p>
              <div className="flex flex-wrap gap-2">
                {example.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/80 text-stone/60 border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="pb-16 px-4 text-center">
        <p className="text-stone/40 text-sm max-w-md mx-auto">
          * Os exemplos acima são ilustrativos. Memoriais reais são privados e visíveis apenas para quem o criador compartilhar.
        </p>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 text-center">
        <div className="max-w-xl mx-auto bg-stone rounded-2xl p-10">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Crie o memorial da sua família
          </h2>
          <p className="text-white/60 mb-8">
            Gratuito, bonito e permanente. Começa em 5 minutos.
          </p>
          <Link href="/criar" className="btn-primary">
            Começar agora
          </Link>
        </div>
      </section>
    </main>
  );
}
