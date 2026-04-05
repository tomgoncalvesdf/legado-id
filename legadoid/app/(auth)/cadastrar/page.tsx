"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { registerAction, googleSignInAction } from "../actions";
import { FormField } from "@/components/ui/form-field";

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
          <Loader2 className="w-4 h-4 animate-spin" />
          Criando conta…
        </>
      ) : (
        "Criar minha conta"
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
      Cadastrar com Google
    </button>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function CadastrarPage() {
  const [state, formAction] = useFormState(registerAction, {});

  // Sucesso — email de confirmação enviado
  if (state.success) {
    return (
      <div className="card-base p-8 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="w-14 h-14 text-amber-medium" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-2xl font-semibold text-stone">
          Verifique seu email
        </h2>
        <p className="text-sm text-stone/60 leading-relaxed">{state.success}</p>
        <Link
          href="/entrar"
          className="inline-block mt-2 text-sm text-amber-medium hover:text-amber-deep font-medium transition-colors"
        >
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="card-base p-8 space-y-6">
      {/* Cabeçalho */}
      <div className="text-center space-y-1">
        <h1 className="font-display text-3xl font-semibold text-stone">
          Criar conta
        </h1>
        <p className="text-sm text-stone/60">
          Comece a preservar memórias que duram para sempre
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

      {/* Formulário */}
      <form action={formAction} className="space-y-4">
        <FormField
          label="Nome completo"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          error={state.fieldErrors?.name}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={state.fieldErrors?.email}
        />

        <FormField
          label="Senha"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          hint="Use letras, números e símbolos para maior segurança"
          error={state.fieldErrors?.password}
        />

        <FormField
          label="Confirmar senha"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repita sua senha"
          error={state.fieldErrors?.confirmPassword}
        />

        <p className="text-xs text-stone/50 leading-relaxed">
          Ao criar sua conta, você concorda com os nossos{" "}
          <Link href="/termos" className="underline hover:text-stone/80">
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link href="/privacidade" className="underline hover:text-stone/80">
            Política de Privacidade
          </Link>
          .
        </p>

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

      {/* Link para login */}
      <p className="text-center text-sm text-stone/60">
        Já tem uma conta?{" "}
        <Link
          href="/entrar"
          className="text-amber-medium hover:text-amber-deep font-medium transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
