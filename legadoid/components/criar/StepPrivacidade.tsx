"use client";

import { useEffect, useState, useTransition } from "react";
import { Globe, Lock, KeyRound, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSlug } from "@/lib/utils";
import { checkSlugAction } from "@/app/criar/actions";
import { FormField } from "@/components/ui/form-field";
import type { MemorialDraft } from "@/app/criar/page";

interface StepPrivacidadeProps {
  draft: MemorialDraft;
  onChange: (field: keyof MemorialDraft, value: string) => void;
  errors?: Record<string, string[]>;
}

type PrivacyOption = {
  value: "public" | "private" | "password";
  label: string;
  description: string;
  icon: React.ElementType;
};

const PRIVACY_OPTIONS: PrivacyOption[] = [
  {
    value: "public",
    label: "Público",
    description: "Qualquer pessoa com o link pode visitar o memorial.",
    icon: Globe,
  },
  {
    value: "private",
    label: "Privado",
    description: "Somente você pode ver. Compartilhe só com quem quiser.",
    icon: Lock,
  },
  {
    value: "password",
    label: "Com senha",
    description: "Visitantes precisam de uma senha para acessar.",
    icon: KeyRound,
  },
];

// ─── Verificador de slug em tempo real ───────────────────────────────────────
function SlugChecker({
  slug,
  onChange,
  baseName,
  error,
}: {
  slug: string;
  onChange: (v: string) => void;
  baseName: string;
  error?: string[];
}) {
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [isPending, startTransition] = useTransition();
  const baseUrl = "legadoid.com/";

  // Gerar slug a partir do nome quando ele mudar (apenas se o slug ainda não foi editado)
  useEffect(() => {
    if (baseName && !slug) {
      onChange(generateSlug(baseName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseName]);

  // Verificar disponibilidade com debounce
  useEffect(() => {
    if (!slug || slug.length < 3) {
      setStatus("idle");
      return;
    }

    const valid = /^[a-z0-9-]+$/.test(slug);
    if (!valid) {
      setStatus("idle");
      return;
    }

    setStatus("checking");
    const timer = setTimeout(() => {
      startTransition(async () => {
        const { available } = await checkSlugAction(slug);
        setStatus(available ? "available" : "taken");
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [slug]);

  const statusIcon =
    status === "checking" ? (
      <Loader2 size={15} className="animate-spin text-stone/40" />
    ) : status === "available" ? (
      <CheckCircle2 size={15} className="text-green-500" />
    ) : status === "taken" ? (
      <XCircle size={15} className="text-red-500" />
    ) : null;

  const statusText =
    status === "available"
      ? "Link disponível!"
      : status === "taken"
      ? "Este link já está em uso."
      : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-stone/80">
        Link do memorial *
      </label>

      <div className="flex items-center rounded-xl border border-stone/15 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-amber-medium/30 focus-within:border-amber-medium transition-colors">
        <span className="px-3 py-2.5 text-sm text-stone/40 border-r border-stone/10 bg-sand/50 whitespace-nowrap flex-shrink-0">
          {baseUrl}
        </span>
        <input
          type="text"
          value={slug}
          onChange={(e) =>
            onChange(
              e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "-")
                .replace(/-{2,}/g, "-")
            )
          }
          placeholder="nome-da-pessoa"
          className="flex-1 px-3 py-2.5 text-sm text-stone outline-none bg-transparent min-w-0"
        />
        <div className="px-3 flex-shrink-0">{statusIcon}</div>
      </div>

      {/* Feedback */}
      {statusText && (
        <p
          className={cn(
            "text-xs",
            status === "available" ? "text-green-600" : "text-red-500"
          )}
        >
          {statusText}
        </p>
      )}
      {error && !statusText && (
        <p className="text-xs text-red-500">{error[0]}</p>
      )}

      <p className="text-xs text-stone/40">
        Apenas letras minúsculas, números e hífens. Pode ser alterado depois.
      </p>
    </div>
  );
}

// ─── Página do step ───────────────────────────────────────────────────────────
export function StepPrivacidade({ draft, onChange, errors = {} }: StepPrivacidadeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-stone">
          Link e privacidade
        </h2>
        <p className="text-sm text-stone/50 mt-1">
          Defina quem pode visitar o memorial e qual será o link de acesso.
        </p>
      </div>

      {/* Slug */}
      <SlugChecker
        slug={draft.slug}
        onChange={(v) => onChange("slug", v)}
        baseName={draft.name}
        error={errors.slug}
      />

      {/* Privacidade */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-stone/80">Quem pode visualizar?</p>
        <div className="space-y-2">
          {PRIVACY_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = draft.privacy === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange("privacy", option.value)}
                className={cn(
                  "w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150",
                  isSelected
                    ? "border-amber-medium bg-amber-soft/40 ring-1 ring-amber-medium/30"
                    : "border-stone/12 bg-white hover:border-stone/25 hover:bg-sand/30"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 p-1.5 rounded-lg flex-shrink-0",
                    isSelected ? "bg-amber-medium text-white" : "bg-stone/8 text-stone/40"
                  )}
                >
                  <Icon size={14} strokeWidth={2} />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-amber-deep" : "text-stone"
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-xs text-stone/50 mt-0.5">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campo de senha (apenas se "com senha" selecionado) */}
      {draft.privacy === "password" && (
        <FormField
          label="Senha de acesso"
          name="password"
          type="password"
          placeholder="Crie uma senha para o memorial"
          value={draft.password}
          onChange={(e) => onChange("password", e.target.value)}
          error={errors.password}
          hint="Compartilhe essa senha com as pessoas que devem ter acesso."
        />
      )}

      {/* Preview do link */}
      {draft.slug && (
        <div className="px-4 py-3 rounded-xl bg-stone/5 border border-stone/10">
          <p className="text-xs text-stone/40 mb-1">Seu link será:</p>
          <p className="text-sm font-medium text-stone break-all">
            legadoid.com/
            <span className="text-amber-medium">{draft.slug || "…"}</span>
          </p>
        </div>
      )}
    </div>
  );
}
