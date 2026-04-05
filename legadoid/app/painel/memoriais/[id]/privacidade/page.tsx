"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { updatePrivacyAction } from "./actions";
import { toast } from "sonner";

type Privacy = "public" | "private" | "password";

interface PrivacyOption {
  value: Privacy;
  icon: React.ElementType;
  label: string;
  description: string;
  badge?: string;
}

const OPTIONS: PrivacyOption[] = [
  {
    value: "public",
    icon: Globe,
    label: "Público",
    description:
      "Qualquer pessoa com o link pode visualizar o memorial sem restrições.",
  },
  {
    value: "private",
    icon: Lock,
    label: "Privado",
    description:
      "Somente você (dono do memorial) pode acessar. Ideal para preservar enquanto ainda está editando.",
    badge: "Apenas você",
  },
  {
    value: "password",
    icon: KeyRound,
    label: "Protegido por senha",
    description:
      "Visitantes precisam inserir uma senha para acessar. Útil para famílias que querem controle de acesso.",
  },
];

// ─── Submit button ────────────────────────────────────────────────────────────
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
          <Loader2 size={15} className="animate-spin" />
          Salvando…
        </>
      ) : (
        <>
          <Shield size={15} strokeWidth={1.5} />
          Salvar configurações
        </>
      )}
    </button>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function PrivacidadePage({
  params,
}: {
  params: { id: string };
}) {
  const memorialId = params.id;
  const [currentPrivacy, setCurrentPrivacy] = useState<Privacy>("public");
  const [selectedPrivacy, setSelectedPrivacy] = useState<Privacy>("public");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  // Bound action com memorialId
  const boundAction = updatePrivacyAction.bind(null, memorialId);
  const [state, formAction] = useFormState(boundAction, {});

  // Carregar privacidade atual
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("memorials")
        .select("privacy")
        .eq("id", memorialId)
        .single();

      if (data?.privacy) {
        setCurrentPrivacy(data.privacy as Privacy);
        setSelectedPrivacy(data.privacy as Privacy);
      }
      setLoading(false);
    }
    load();
  }, [memorialId]);

  // Mostrar toast de sucesso/erro
  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      setCurrentPrivacy(selectedPrivacy);
    }
    if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const hasChanges = selectedPrivacy !== currentPrivacy;

  return (
    <div className="space-y-6 max-w-xl">
      {/* Header */}
      <div>
        <Link
          href={`/painel/memoriais/${memorialId}`}
          className="inline-flex items-center gap-1.5 text-sm text-stone/50 hover:text-stone transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Voltar ao memorial
        </Link>
        <h1 className="font-display text-3xl font-semibold text-stone">
          Privacidade e acesso
        </h1>
        <p className="text-sm text-stone/50 mt-1">
          Defina quem pode visualizar este memorial.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          {/* Opções de privacidade */}
          <div className="space-y-2">
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedPrivacy === option.value;

              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150",
                    isSelected
                      ? "border-amber-medium bg-amber-soft/30 ring-1 ring-amber-medium/20"
                      : "border-stone/10 bg-white hover:border-stone/25 hover:bg-sand/30"
                  )}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setSelectedPrivacy(option.value)}
                    className="sr-only"
                  />

                  {/* Ícone */}
                  <div
                    className={cn(
                      "p-2.5 rounded-xl flex-shrink-0 mt-0.5 transition-colors",
                      isSelected
                        ? "bg-amber-medium text-white"
                        : "bg-stone/8 text-stone/40"
                    )}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </div>

                  {/* Texto */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          isSelected ? "text-amber-deep" : "text-stone"
                        )}
                      >
                        {option.label}
                      </p>
                      {option.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone/10 text-stone/50">
                          {option.badge}
                        </span>
                      )}
                      {option.value === currentPrivacy && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle2 size={9} strokeWidth={2.5} />
                          Atual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone/50 mt-1 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Campo de senha (aparece animado quando "password" selecionado) */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              selectedPrivacy === "password"
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <div className="card-base p-5 space-y-3 border-amber-light/40">
              <p className="text-sm font-medium text-stone">
                Senha de acesso para visitantes
              </p>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Crie uma senha para o memorial"
                  maxLength={72}
                  autoComplete="new-password"
                  className={cn(
                    "input-base pr-10 w-full",
                    state.fieldErrors?.password &&
                      "border-red-400 focus:ring-red-400/30"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone/30 hover:text-stone/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {state.fieldErrors?.password && (
                <p className="text-xs text-red-500">
                  {state.fieldErrors.password[0]}
                </p>
              )}

              <p className="text-xs text-stone/40">
                Compartilhe esta senha com as pessoas que devem ter acesso.
                Mínimo 4 caracteres.
              </p>
            </div>
          </div>

          {/* Informações contextuais */}
          <div className="px-4 py-3 rounded-xl bg-stone/5 border border-stone/8 text-xs text-stone/50 leading-relaxed space-y-1">
            {selectedPrivacy === "public" && (
              <p>
                ● O memorial ficará visível para qualquer pessoa que tenha o
                link — inclusive via mecanismos de busca.
              </p>
            )}
            {selectedPrivacy === "private" && (
              <p>
                ● O memorial ficará oculto para visitantes. Somente você, ao
                estar logado, poderá visualizá-lo.
              </p>
            )}
            {selectedPrivacy === "password" && (
              <p>
                ● Visitantes serão redirecionados para uma tela de senha antes
                de acessar o memorial.
              </p>
            )}
          </div>

          {/* Erro global */}
          {state.error && (
            <p role="alert" className="text-sm text-red-500">
              {state.error}
            </p>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3">
            <SubmitButton />
            {!hasChanges && (
              <p className="text-xs text-stone/40">Nenhuma alteração pendente.</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
