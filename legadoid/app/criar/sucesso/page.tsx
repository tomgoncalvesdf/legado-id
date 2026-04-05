import Link from "next/link";
import { Suspense } from "react";
import { Flame, ArrowRight, Share2, Settings } from "lucide-react";
import { redirect } from "next/navigation";

// ─── Conteúdo da página ───────────────────────────────────────────────────────
function SucessoContent({ id, slug }: { id: string; slug: string }) {
  if (!id || !slug) redirect("/criar");

  const memorialUrl = `https://legadoid.com/${slug}`;

  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Ícone animado */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-soft flex items-center justify-center shadow-amber">
            <Flame
              size={36}
              strokeWidth={1.5}
              className="text-amber-medium animate-candle-flicker"
            />
          </div>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-semibold text-stone leading-tight">
            Memorial criado com sucesso!
          </h1>
          <p className="text-stone/55 text-sm leading-relaxed">
            O memorial foi salvo como rascunho. Você pode adicionar fotos,
            personalizar e publicar quando estiver pronto.
          </p>
        </div>

        {/* Link do memorial */}
        <div className="px-4 py-4 rounded-2xl bg-stone/5 border border-stone/10 space-y-1">
          <p className="text-xs text-stone/40 font-medium uppercase tracking-wider">
            Seu link
          </p>
          <p className="text-sm font-medium text-stone break-all">
            legadoid.com/
            <span className="text-amber-medium">{slug}</span>
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/painel/memoriais/${id}`}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Settings size={16} strokeWidth={1.5} />
            Personalizar memorial
          </Link>

          <Link
            href="/painel"
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            Ir ao painel
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Dica de próximo passo */}
        <div className="px-5 py-4 rounded-2xl bg-amber-soft/60 border border-amber-light/50 text-left space-y-2">
          <p className="text-xs font-semibold text-amber-deep uppercase tracking-wider">
            Próximos passos sugeridos
          </p>
          <ul className="text-sm text-amber-deep/80 space-y-1.5">
            {[
              "Adicione fotos e a foto de capa",
              "Crie eventos na linha do tempo",
              "Publique e compartilhe o link com a família",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-medium/20 text-amber-deep text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Link de compartilhamento rápido */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Legado ID — Memorial",
                url: memorialUrl,
              });
            } else {
              navigator.clipboard.writeText(memorialUrl);
            }
          }}
          className="inline-flex items-center gap-2 text-sm text-stone/50 hover:text-stone transition-colors"
        >
          <Share2 size={14} />
          Compartilhar link do memorial
        </button>
      </div>
    </div>
  );
}

// ─── Wrapper (Server Component) ───────────────────────────────────────────────
export default async function SucessoPage({
  searchParams,
}: {
  searchParams: { id?: string; slug?: string };
}) {
  const id = searchParams.id ?? "";
  const slug = searchParams.slug ?? "";

  return (
    <Suspense fallback={null}>
      <SucessoContent id={id} slug={slug} />
    </Suspense>
  );
}
