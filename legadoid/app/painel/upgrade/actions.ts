"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMPPreference, PLANS, getPaymentUrls, type PlanId } from "@/lib/mercadopago";
import type { ActionResult } from "@/types";

// ─── Helper: usuário autenticado ──────────────────────────────────────────────
async function getAuthProfile() {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, plan")
    .eq("auth_id", authUser.id)
    .single();

  return profile ?? null;
}

// ─── Criar preferência de pagamento e redirecionar ao checkout MP ─────────────
export async function createPaymentPreferenceAction(
  planId: PlanId
): Promise<ActionResult> {
  const profile = await getAuthProfile();
  if (!profile) return { error: "Você precisa estar logado." };

  const plan = PLANS[planId];
  if (!plan) return { error: "Plano inválido." };

  // Não permitir downgrade nem recompra do mesmo plano
  if (profile.plan === "lifetime") {
    return { error: "Você já possui o plano vitalício." };
  }
  if (profile.plan === planId) {
    return { error: `Você já possui o plano ${plan.label}.` };
  }

  const urls = getPaymentUrls(planId);

  try {
    const preference = getMPPreference();

    const response = await preference.create({
      body: {
        items: [
          {
            id: plan.id,
            title: `Legado ID — ${plan.label}`,
            description: plan.description,
            quantity: 1,
            unit_price: plan.price,
            currency_id: "BRL",
          },
        ],
        payer: {
          name: profile.name ?? undefined,
          email: profile.email,
        },
        back_urls: {
          success: urls.success,
          failure: urls.failure,
          pending: urls.pending,
        },
        auto_return: "approved",
        external_reference: `${profile.id}|${planId}`,
        // PIX disponível automaticamente via configuração do MP
        payment_methods: {
          excluded_payment_types: [],
          installments: planId === "lifetime" ? 12 : 1,
        },
        metadata: {
          user_id: profile.id,
          plan_id: planId,
        },
        statement_descriptor: "LEGADO ID",
        expires: false,
      },
    });

    if (!response.init_point) {
      return { error: "Erro ao criar preferência de pagamento." };
    }

    // Redirecionar para o checkout do Mercado Pago
    redirect(response.init_point);
  } catch (err: unknown) {
    console.error("[createPaymentPreference]", err);
    const message =
      err instanceof Error ? err.message : "Erro inesperado ao processar pagamento.";
    return { error: message };
  }
}

// ─── Atualizar plano após confirmação manual (fallback) ───────────────────────
// Chamada pela página de sucesso quando webhook ainda não processou
export async function verifyAndApplyPlanAction(
  planId: PlanId,
  paymentId?: string
): Promise<ActionResult> {
  const profile = await getAuthProfile();
  if (!profile) return { error: "Não autenticado." };

  const supabase = createClient();

  // Se já tem o plano, retornar sucesso
  if (profile.plan === planId || profile.plan === "lifetime") {
    return { success: "Plano já ativo." };
  }

  // Verificar no banco se o pagamento foi registrado pelo webhook
  const { data: payment } = await supabase
    .from("payments")
    .select("id, status, plan_type")
    .eq("user_id", profile.id)
    .eq("plan_type", planId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!payment) {
    // Webhook ainda não chegou — retornar "pendente"
    return {
      success: "pending",
      error: undefined,
    };
  }

  // Aplicar plano
  const { error } = await supabase
    .from("users")
    .update({
      plan: planId,
      plan_expires_at:
        planId === "monthly"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null,
    })
    .eq("id", profile.id);

  if (error) return { error: "Erro ao ativar plano." };

  return { success: "Plano ativado com sucesso!" };
}
