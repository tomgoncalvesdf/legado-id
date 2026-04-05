import Link from "next/link";
import { Lock, Flame, ArrowLeft } from "lucide-react";

/**
 * Exibido quando um visitante tenta acessar um memorial privado.
 * Não revela se o memorial existe ou não (segurança por obscuridade).
 */
export function PrivateMemorialGate() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-sm">
        {/* Ícone */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-stone/8 flex items-center justify-center">
            <Lock size={32} strokeWidth={1.5} className="text-stone/25" />
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold text-stone">
            Memorial não encontrado
          </h1>
          <p className="text-sm text-stone/50 leading-relaxed">
            Este memorial pode ser privado, ter sido removido ou o link estar incorreto.
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center justify-center gap-2">
            <Flame size={15} strokeWidth={1.5} />
            Criar um memorial
          </Link>
          <Link href="/" className="btn-secondary flex items-center justify-center gap-2">
            <ArrowLeft size={15} />
            Página inicial
          </Link>
        </div>

        {/* Hint para dono */}
        <p className="text-xs text-stone/35">
          Você é o dono deste memorial?{" "}
          <Link
            href="/entrar"
            className="text-amber-medium hover:underline"
          >
            Faça login
          </Link>{" "}
          para acessá-lo.
        </p>
      </div>
    </div>
  );
}
