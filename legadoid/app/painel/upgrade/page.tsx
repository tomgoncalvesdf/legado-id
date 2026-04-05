"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Infinity,
  Check,
  Loader2,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createPaymentPreferenceAction } from "./actions";
import { useUser } from "@/hooks/useUser";
import type { PlanId } from "@/lib/mercadopago";

// ─── Features por plano ───────────────────────────────────────────────────────
const FEATURES_MONTHLY = [
  "Memoriais ilimitados",
  "Até 200 fotos por memorial",
  "Galeria e linha do tempo",
  "Acesso antecipado a novidades",
  "Suporte prioritário por email",
];

const FEATURES_LIFETIME = [
  "Tudo do plano Mensal",
  "Pagamento único — sem mensalidades",
  "Acesso vitalício garantido",
  "Domínio personalizado (em breve)",
  "Badge exclusivo no memorial",
];

// ─── Card de plano ────────────────────────────────────────────────────────────
function PlanCard({
  planId,
  icon: Icon,
  label,
  price,
  period,
  features,
  highlight,
  currentPlan,
  onSelect,
  loading,
  badge,
}: {
  planId: PlanId;
  icon: React.ElementType;
  label: string;
  price: number;
  period: string;
  features: string[];
  highlight?: boolean;
  currentPlan?: string;
  onSelect: (p: PlanId) => void;
  loading: boolean;
  badge?: string;
}) {
  const isCurrentPlan = currentPlan === planId;
  const isLifetimeOwner = currentPlan === "lifetime";

  return (
    <div
      className={cn(
        "relative card-base p-6 flex flex-col gap-5 transition-all duration-200",
        highlight
          ? "border-2 border-amber-medium ring-4 ring-amber-medium/10 shadow-amber"
          : "hover:shadow-card-hover"
      )}
    >
      {/* Badge de destaque */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-medium text-white text-xs font-bold whitespace-nowrap shadow-sm">
          {badge}
        </div>
      )}

      {/* Cabeçalho */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "p-2.5 rounded-xl",
              highlight ? "bg-amber-medium text-white" : "bg-amber-soft text-amber-medium"
            )}
          >
            <Icon size={20} strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl font-semibold text-stone">{label}</h3>
        </div>

        {/* Preço */}
        <div className="flex items-end gap-1.5">
          <span className="text-sm text-stone/50 self-start mt-1">R$</span>
          <span className="font-display text-4xl font-bold text-stone leading-none">
            {price.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
          </span>
          <span className="text-sm text-stone/50 mb-0.5">{period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-stone/70">
            <Check
              size={15}
              strokeWidth={2.5}
              className="text-amber-medium flex-shrink-0 mt-0.5"
            />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrentPlan ? (
        <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
          <Check size={15} strokeWidth={2.5} />
          Plano atual
        </div>
      ) : isLifetimeOwner ? (
        <div className="py-2.5 rounded-xl bg-stone/6 text-stone/40 text-sm text-center font-medium">
          Já possui plano superior
        </div>
      ) : (
        <button
          onClick={() => onSelect(planId)}
          disabled={loading}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60",
            highlight
              ? "bg-amber-medium text-white hover:bg-amber-deep shadow-amber"
              : "btn-secondary"
          )}
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Aguarde…
            </>
          ) : (
            <>
              <CreditCard size={15} strokeWidth={1.5} />
              Assinar agora
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function UpgradePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { user, loading: userLoading } = useUser();
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [actionError, setActionError] = useState<string | null>(
    searchParams.error === "payment_failed"
      ? "O pagamento não foi concluído. Tente novamente."
      : null
  );

  function handleSelectPlan(planId: PlanId) {
    setSelectedPlan(planId);
    setActionError(null);

    startTransition(async () => {
      const result = await createPaymentPreferenceAction(planId);
      // Se chegou aqui, houve erro (redirect bem-sucedido não retorna)
      if (result?.error) {
        setActionError(result.error);
        setSelectedPlan(null);
      }
    });
  }

  const currentPlan = user?.plan ?? "free";

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <Link
          href="/painel"
          className="inline-flex items-center gap-1.5 text-sm text-stone/50 hover:text-stone transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Painel
        </Link>
        <h1 className="font-display text-3xl font-semibold text-stone">
          Escolha seu plano
        </h1>
        <p className="text-sm text-stone/50 mt-1">
          Preserve memórias sem limites. Cancele quando quiser.
        </p>
      </div>

      {/* Erro */}
      {actionError && (
        <div
          role="alert"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
        >
          <AlertCircle size={16} className="flex-shrink-0" />
          {actionError}
        </div>
      )}

      {/* Plano atual (free) */}
      {currentPlan === "free" && (
        <div className="px-4 py-3 rounded-xl bg-stone/6 border border-stone/10 flex items-center gap-3 text-sm text-stone/60">
          <Zap size={15} className="text-stone/40" />
          Você está no plano gratuito — 1 memorial, até 10 fotos.
        </div>
      )}

      {/* Cards de planos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <PlanCard
          planId="monthly"
          icon={Flame}
          label="Legado Mensal"
          price={29.9}
          period="/mês"
          features={FEATURES_MONTHLY}
          currentPlan={currentPlan}
          onSelect={handleSelectPlan}
          loading={isPending && selectedPlan === "monthly"}
        />
        <PlanCard
          planId="lifetime"
          icon={Infinity}
          label="Legado Eterno"
          price={197}
          period="único"
          features={FEATURES_LIFETIME}
          highlight
          badge="Mais escolhido ✦"
          currentPlan={currentPlan}
          onSelect={handleSelectPlan}
          loading={isPending && selectedPlan === "lifetime"}
        />
      </div>

      {/* Métodos de pagamento */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4 border-t border-stone/8">
        <p className="text-xs text-stone/40 font-medium">Aceito via</p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {["PIX", "Cartão de Crédito", "Boleto"].map((method) => (
            <span
              key={method}
              className="px-3 py-1 rounded-full bg-stone/6 text-xs font-medium text-stone/50 border border-stone/10"
            >
              {method}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-stone/40">
          <span>🔒</span> Pagamento seguro via Mercado Pago
        </div>
      </div>

      {/* Garantia */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-stone/70">
          <Star size={14} className="text-amber-medium" fill="currentColor" strokeWidth={0} />
          Garantia de 7 dias — reembolso sem perguntas
        </div>
        <p className="text-xs text-stone/40">
          Plano mensal: cancele a qualquer momento. Plano eterno: pagamento único e definitivo.
        </p>
      </div>
    </div>
  );
}
