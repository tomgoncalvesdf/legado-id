import Link from "next/link";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-900/10 blur-[120px]" />
      </div>

      <div className="relative text-center max-w-md mx-auto animate-fade-up">
        {/* Ícone */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border border-amber-medium/20 bg-amber-medium/8 flex items-center justify-center">
              <Flame
                size={32}
                strokeWidth={1}
                className="text-amber-medium/60"
              />
            </div>
            {/* Chama pequena acima */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-medium/40 animate-pulse" />
          </div>
        </div>

        {/* Número */}
        <p
          className="text-[120px] font-extralight leading-none text-transparent bg-clip-text mb-4"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 100%)",
          }}
        >
          404
        </p>

        {/* Título */}
        <h1
          className="font-serif text-2xl text-white/80 mb-3"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Esta memória não existe
        </h1>

        <p className="text-sm text-white/30 leading-relaxed mb-10">
          O memorial que você procura pode ter sido removido, ter a privacidade
          alterada, ou o link pode estar incorreto.
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-medium/15 border border-amber-medium/25 text-amber-light text-sm font-medium hover:bg-amber-medium/25 transition-all"
          >
            Voltar ao início
          </Link>
          <Link
            href="/painel"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white/70 hover:bg-white/8 transition-all"
          >
            Meu painel
          </Link>
        </div>

        {/* Separador decorativo */}
        <div className="mt-16 flex items-center gap-4 justify-center opacity-20">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30" />
          <span className="text-white/40 text-xs tracking-widest uppercase">
            Legado ID
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30" />
        </div>
      </div>
    </div>
  );
}
