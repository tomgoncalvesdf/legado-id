"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2, Flame, ArrowRight } from "lucide-react";
import { verifyAndApplyPlanAction } from "../actions";
import type { PlanId } from "@/lib/mercadopago";

type Status = "approved" | "pending" | "checking" | "error";

const PLAN_LABELS: Record<string, string> = {
  monthly: "Legado Mensal",
  lifetime: "Legado Eterno",
};

export default function UpgradeSucessoPage({
  searchParams,
}: {
  searchParams: { plan?: string; status?: string; payment_id?: string };
}) {
  const planId = (searchParams.plan ?? "monthly") as PlanId;
  const mpStatus = searchParams.status; // "approved" | "pending" | "failure"
  const paymentId = searchParams.payment_id;

  const [status, setStatus] = useState<Status>("checking");
  const [isPending, startTransition] = useTransition();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (mpStatus === "failure") {
      setStatus("error");
      return;
    }

    // Verificar/aplicar plano (com retry para webhook ainda não processado)
    async function verify() {
      startTransition(async () => {
        const result = await verifyAndApplyPlanAction(planId, paymentId);

        if (result.success === "pending" && retryCount < 5) {
          // Webhook ainda não chegou — tentar novamente em 3s
          setTimeout(() => setRetryCount((c) => c + 1), 3000);
          setStatus("checking");
        } else if (result.error) {
          setStatus("error");
        } else if (mpStatus === "pending") {
          setStatus("pending");
        } else {
          setStatus("approved");
        }
      });
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  const planLabel = PLAN_LABELS[planId] ?? planId;

  // ── Checking ──────────────────────────────────────────────────────────────
  if (status === "checking") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 size={36} className="animate-spin text-amber-medium" />
        <p className="text-sm text-stone/60">
          Confirmando seu pagamento…
        </p>
      </div>
    );
  }

  // ── Aprovado ──────────────────────────────────────────────────────────────
  if (status === "approved") {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center shadow-sm">
            <CheckCircle2 size={38} className="text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold text-stone">
            Pagamento confirmado!
          </h1>
          <p className="text-stone/60 text-sm leading-relaxed">
            Bem-vindo ao{" "}
            <span className="font-semibold text-amber-deep">{planLabel}</span>.
            Agora você tem acesso a todos os recursos premium do Legado ID.
          </p>
        </div>

        {/* Benefícios desbloqueados */}
        <div className="card-base p-5 text-left space-y-3">
          <p className="text-xs font-semibold text-stone/50 uppercase tracking-wider">
            O que você desbloqueou
          </p>
          {[
            "Memoriais ilimitados",
            "Até 200 fotos por memorial",
            "Suporte prioritário",
            planId === "lifetime" ? "Acesso vitalício garantido" : "Plano mensal renovável",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-sm text-stone/70">
              <Flame size={14} className="text-amber-medium flex-shrink-0" strokeWidth={1.5} />
              {item}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/painel"
            className="btn-primary flex items-center justify-center gap-2"
          >
            Ir ao painel
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/criar"
            className="btn-secondary flex items-center justify-center gap-2 text-sm"
          >
            Criar novo memorial
          </Link>
        </div>
      </div>
    );
  }

  // ── Pendente (boleto/PIX aguardando compensação) ───────────────────────────
  if (status === "pending") {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-soft flex items-center justify-center">
            <Clock size={38} className="text-amber-medium" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold text-stone">
            Pagamento em processamento
          </h1>
          <p className="text-stone/60 text-sm leading-relaxed">
            Seu pagamento foi registrado e está aguardando confirmação. Isso pode
            levar até 2 dias úteis (boleto) ou alguns minutos (PIX).
          </p>
        </div>

        <div className="card-base p-5 space-y-2 text-sm text-stone/60 text-left">
          <p>● Você receberá um email quando o pagamento for confirmado.</p>
          <p>● O plano será ativado automaticamente após a compensação.</p>
          <p>● Em caso de dúvidas, entre em contato com nosso suporte.</p>
        </div>

        <Link href="/painel" className="btn-secondary inline-flex items-center gap-2">
          Voltar ao painel
        </Link>
      </div>
    );
  }

  // ── Erro ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-stone">
          Pagamento não concluído
        </h1>
        <p className="text-stone/60 text-sm">
          Algo deu errado com seu pagamento. Nenhum valor foi cobrado.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/painel/upgrade"
          className="btn-primary flex items-center justify-center gap-2"
        >
          Tentar novamente
        </Link>
        <Link href="/painel" className="btn-secondary flex items-center justify-center gap-2">
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
