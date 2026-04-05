import Link from "next/link";
import { Flame } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Header mínimo */}
      <header className="py-6 px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone hover:text-amber-medium transition-colors"
        >
          <Flame className="w-6 h-6 text-amber-medium" strokeWidth={1.5} />
          <span className="font-display text-xl font-semibold tracking-wide">
            Legado ID
          </span>
        </Link>
      </header>

      {/* Conteúdo centralizado */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="py-6 text-center">
        <p className="text-xs text-stone/40">
          © {new Date().getFullYear()} Legado ID. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
