"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "../actions";
import { FormField } from "@/components/ui/form-field";

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
          Enviando…
        </>
      ) : (
        "Enviar link de recuperação"
      )}
    </button>
  );
}

export default function EsqueciSenhaPage() {
  const [state, formAction] = useFormState(forgotPasswordAction, {});

  // Estado de sucesso
  if (state.success) {
    return (
      <div className="card-base p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-amber-soft flex items-center justify-center">
            <Mail className="w-7 h-7 text-amber-medium" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="font-display text-2xl font-semibold text-stone">
          Email enviado!
        </h2>
        <p className="text-sm text-stone/60 leading-relaxed">{state.success}</p>
        <Link
          href="/entrar"
          className="inline-flex items-center gap-1.5 text-sm text-amber-medium hover:text-amber-deep font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="card-base p-8 space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-1">
        <Link
          href="/entrar"
          className="inline-flex items-center gap-1.5 text-sm text-stone/50 hover:text-stone/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </Link>
        <h1 className="font-display text-3xl font-semibold text-stone">
          Esqueci minha senha
        </h1>
        <p className="text-sm text-stone/60">
          Digite seu email e enviaremos um link para você redefinir sua senha.
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
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={state.fieldErrors?.email}
        />

        <SubmitButton />
      </form>
    </div>
  );
}
