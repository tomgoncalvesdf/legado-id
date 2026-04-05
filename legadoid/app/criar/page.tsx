"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Flame, Loader2 } from "lucide-react";
import { createMemorialAction } from "./actions";
import { StepIndicator } from "@/components/criar/StepIndicator";
import { StepBasico } from "@/components/criar/StepBasico";
import { StepHistoria } from "@/components/criar/StepHistoria";
import { StepPrivacidade } from "@/components/criar/StepPrivacidade";

// ─── Tipo do rascunho local ───────────────────────────────────────────────────
export interface MemorialDraft {
  // Step 1
  name: string;
  relation: string;
  birth_date: string;
  death_date: string;
  // Step 2
  bio: string;
  personality_traits: string;
  hobbies: string;
  favorite_quote: string;
  // Step 3
  slug: string;
  privacy: "public" | "private" | "password";
  password: string;
}

const EMPTY_DRAFT: MemorialDraft = {
  name: "",
  relation: "",
  birth_date: "",
  death_date: "",
  bio: "",
  personality_traits: "",
  hobbies: "",
  favorite_quote: "",
  slug: "",
  privacy: "public",
  password: "",
};

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    label: "Informações",
    description: "Dados básicos da pessoa homenageada",
  },
  {
    label: "História",
    description: "Biografia, personalidade e memórias marcantes",
  },
  {
    label: "Publicação",
    description: "Link do memorial e configurações de acesso",
  },
];

// ─── Validação por passo (client-side simples) ────────────────────────────────
function validateStep(step: number, draft: MemorialDraft): string | null {
  if (step === 0) {
    if (!draft.name.trim() || draft.name.trim().length < 2)
      return "O nome precisa ter ao menos 2 caracteres.";
  }
  if (step === 2) {
    if (!draft.slug || draft.slug.length < 3)
      return "O link do memorial precisa ter ao menos 3 caracteres.";
    if (!/^[a-z0-9-]+$/.test(draft.slug))
      return "O link pode conter apenas letras minúsculas, números e hífens.";
    if (draft.privacy === "password" && !draft.password.trim())
      return "Defina uma senha para proteger o memorial.";
  }
  return null;
}

// ─── Botão de submit final ────────────────────────────────────────────────────
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary flex items-center gap-2 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Criando memorial…
        </>
      ) : (
        <>
          Criar memorial
          <Flame size={16} strokeWidth={1.5} />
        </>
      )}
    </button>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function CriarMemorialPage() {
  const [draft, setDraft] = useState<MemorialDraft>(EMPTY_DRAFT);
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [state, formAction] = useFormState(createMemorialAction, {});

  function handleChange(field: keyof MemorialDraft, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setStepError(null);
  }

  function handleNext() {
    const error = validateStep(step, draft);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  // Erros do servidor por campo (step 3 principalmente)
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Navbar mínima */}
      <header className="py-5 px-6 flex items-center justify-between border-b border-stone/8 bg-mist">
        <Link
          href="/painel"
          className="flex items-center gap-2 text-stone/60 hover:text-stone transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Painel</span>
        </Link>

        <Link href="/" className="flex items-center gap-2">
          <Flame size={20} className="text-amber-medium" strokeWidth={1.5} />
          <span className="font-display text-lg font-semibold text-stone tracking-wide">
            Legado ID
          </span>
        </Link>

        <div className="w-20 sm:w-24" /> {/* espaçador */}
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl space-y-8">
          {/* Step indicator */}
          <StepIndicator steps={STEPS} currentStep={step} />

          {/* Card do formulário */}
          <div className="card-base p-6 sm:p-8">
            {/* Erro de servidor global */}
            {state.error && (
              <div
                role="alert"
                className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
              >
                {state.error}
              </div>
            )}

            {/* Erro de validação de step */}
            {stepError && (
              <div
                role="alert"
                className="mb-6 px-4 py-3 rounded-lg bg-amber-soft border border-amber-light/60 text-sm text-amber-deep"
              >
                {stepError}
              </div>
            )}

            {/* Conteúdo do passo */}
            <form
              action={step === STEPS.length - 1 ? formAction : undefined}
              onSubmit={
                step < STEPS.length - 1
                  ? (e) => {
                      e.preventDefault();
                      handleNext();
                    }
                  : undefined
              }
            >
              {/* Campos ocultos com todos os dados do draft (enviados no submit final) */}
              {step === STEPS.length - 1 && (
                <>
                  <input type="hidden" name="name" value={draft.name} />
                  <input type="hidden" name="relation" value={draft.relation} />
                  <input type="hidden" name="birth_date" value={draft.birth_date} />
                  <input type="hidden" name="death_date" value={draft.death_date} />
                  <input type="hidden" name="bio" value={draft.bio} />
                  <input type="hidden" name="personality_traits" value={draft.personality_traits} />
                  <input type="hidden" name="hobbies" value={draft.hobbies} />
                  <input type="hidden" name="favorite_quote" value={draft.favorite_quote} />
                </>
              )}

              {/* Steps */}
              {step === 0 && (
                <StepBasico
                  draft={draft}
                  onChange={handleChange}
                  errors={fieldErrors}
                />
              )}
              {step === 1 && (
                <StepHistoria
                  draft={draft}
                  onChange={handleChange}
                  errors={fieldErrors}
                />
              )}
              {step === 2 && (
                <StepPrivacidade
                  draft={draft}
                  onChange={handleChange}
                  errors={fieldErrors}
                />
              )}

              {/* Navegação */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone/8">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ArrowLeft size={15} />
                    Voltar
                  </button>
                ) : (
                  <div />
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                  >
                    Continuar
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <SubmitButton />
                )}
              </div>
            </form>
          </div>

          {/* Nota de segurança */}
          <p className="text-center text-xs text-stone/35">
            Suas informações estão protegidas conforme a LGPD.{" "}
            <Link href="/privacidade" className="underline hover:text-stone/60">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
