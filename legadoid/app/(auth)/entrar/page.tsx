"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { loginAction, googleSignInAction } from "../actions";
import { FormField } from "@/components/ui/form-field";

// ─── Submit button com estado de loading ──────────────────────────────────────
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
          <Loader2 className="w-4 h-4 animate-spin" />
          Entrando…
        </>
      ) : (
        "Entrar"
      )}
    </button>
  );
}

// ─── Botão Google ─────────────────────────────────────────────────────────────
function GoogleButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-stone/20 rounded-xl bg-white hover:bg-sand/60 transition-colors text-sm font-medium text-stone disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      Continuar com Google
    </button>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function EntrarPage() {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <div className="card-base p-8 space-y-6">
      {/* Cabeçalho */}
      <div className="text-center space-y-1">
        <h1 className="font-display text-3xl font-semibold text-stone">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-stone/60">
          Entre na sua conta para acessar seus memoriais
        </p>
      </div>

      {/* Erro global */}
      {state.error && (
        <div
          role="alert"
          className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      {/* Formulário de email/senha */}
      <form action={formAction} className="space-y-4">
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={state.fieldErrors?.email}
        />

        <div className="space-y-1.5">
          <FormField
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={state.fieldErrors?.password}
          />
          <div className="text-right">
            <Link
              href="/esqueci-senha"
              className="text-xs text-amber-medium hover:text-amber-deep transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>

        <SubmitButton />
      </form>

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-stone/10" />
        <span className="text-xs text-stone/40">ou</span>
        <div className="flex-1 h-px bg-stone/10" />
      </div>

      {/* Google OAuth */}
      <form
        action={async () => {
          await googleSignInAction();
        }}
      >
        <GoogleButton />
      </form>

      {/* Link para cadastro */}
      <p className="text-center text-sm text-stone/60">
        Não tem uma conta?{" "}
        <Link
          href="/cadastrar"
          className="text-amber-medium hover:text-amber-deep font-medium transition-colors"
        >
          Criar conta gratuita
        </Link>
      </p>
    </div>
  );
}
