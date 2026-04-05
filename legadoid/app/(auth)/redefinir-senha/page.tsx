"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { resetPasswordAction } from "../actions";
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
          Salvando…
        </>
      ) : (
        "Redefinir senha"
      )}
    </button>
  );
}

export default function RedefinirSenhaPage() {
  const [state, formAction] = useFormState(resetPasswordAction, {});

  return (
    <div className="card-base p-8 space-y-6">
      {/* Cabeçalho */}
      <div className="text-center space-y-1">
        <h1 className="font-display text-3xl font-semibold text-stone">
          Redefinir senha
        </h1>
        <p className="text-sm text-stone/60">
          Escolha uma nova senha segura para sua conta.
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
          label="Nova senha"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          hint="Use letras, números e símbolos para maior segurança"
          error={state.fieldErrors?.password}
        />

        <FormField
          label="Confirmar nova senha"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a nova senha"
          error={state.fieldErrors?.confirmPassword}
        />

        <SubmitButton />
      </form>
    </div>
  );
}
