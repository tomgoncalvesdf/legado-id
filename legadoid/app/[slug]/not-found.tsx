import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

export default function MemorialNotFound() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-sm">
        {/* Ícone */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-stone/8 flex items-center justify-center">
            <Flame size={36} strokeWidth={1.5} className="text-stone/20" />
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold text-stone">
            Memorial não encontrado
          </h1>
          <p className="text-sm text-stone/50 leading-relaxed">
            O memorial que você está procurando pode ter sido removido, tornado privado ou o link está incorreto.
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center justify-center gap-2">
            <Flame size={15} strokeWidth={1.5} />
            Criar um memorial
          </Link>
          <Link
            href="/"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft size={15} />
            Página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
