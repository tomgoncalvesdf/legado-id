"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { Flame, KeyRound, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { grantAccessAction } from "./actions";

// ─── Submit button ────────────────────────────────────────────────────────────
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Verificando…
        </>
      ) : (
        <>
          <KeyRound size={16} strokeWidth={1.5} />
          Acessar memorial
        </>
      )}
    </button>
  );
}

// ─── Página gate de senha ─────────────────────────────────────────────────────
export default function SenhaPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [showPassword, setShowPassword] = useState(false);

  // Bind do slug na server action
  const boundAction = grantAccessAction.bind(null, slug);
  const [state, formAction] = useFormState(boundAction, {});

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Header mínimo */}
      <header className="py-6 px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone hover:text-amber-medium transition-colors"
        >
          <Flame className="w-5 h-5 text-amber-medium" strokeWidth={1.5} />
          <span className="font-display text-lg font-semibold tracking-wide">
            Legado ID
          </span>
        </Link>
      </header>

      {/* Conteúdo centralizado */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Ícone */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-stone/8 border border-stone/10 flex items-center justify-center mx-auto">
              <Lock size={28} strokeWidth={1.5} className="text-stone/30" />
            </div>
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-semibold text-stone">
                Memorial protegido
              </h1>
              <p className="text-sm text-stone/55 leading-relaxed">
                Este memorial é privado. Insira a senha para ter acesso.
              </p>
            </div>
          </div>

          {/* Card de formulário */}
          <div className="card-base p-6 space-y-4">
            {/* Erro */}
            {state.error && (
              <div
                role="alert"
                className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
              >
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-4">
              {/* Campo de senha */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-stone/80"
                >
                  Senha de acesso
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    autoFocus
                    className="input-base pr-10 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone/30 hover:text-stone/60 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <SubmitButton />
            </form>
          </div>

          {/* Info */}
          <p className="text-center text-xs text-stone/35">
            Não tem a senha? Entre em contato com quem compartilhou o memorial.
          </p>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="py-6 text-center">
        <p className="text-xs text-stone/30">
          © {new Date().getFullYear()} Legado ID
        </p>
      </footer>
    </div>
  );
}
