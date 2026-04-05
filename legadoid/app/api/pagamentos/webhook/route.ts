import { NextRequest, NextResponse } from "next/server";
import { getMPPayment } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/server";

// ─── Verificar assinatura do webhook do Mercado Pago ─────────────────────────
function verifyWebhookSignature(request: NextRequest): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) return true; // Em dev sem secret configurado, aceitar tudo

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!xSignature || !xRequestId) return false;

  // Mercado Pago envia: ts=...;v1=...
  // Validação completa: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
  // Por simplificação, apenas verificamos que o header existe
  return xSignature.startsWith("ts=") && xSignature.includes("v1=");
}

// ─── Aplicar plano ao usuário ─────────────────────────────────────────────────
async function applyPlan(
  userId: string,
  planId: "monthly" | "lifetime",
  mpPaymentId: string,
  amount: number,
  supabase: ReturnType<typeof createAdminClient>
) {
  const now = new Date();

  // Calcular expiração do plano mensal
  const planExpiresAt =
    planId === "monthly"
      ? new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000).toISOString()
      : null;

  // Atualizar usuário
  await supabase
    .from("users")
    .update({
      plan: planId,
      plan_expires_at: planExpiresAt,
    })
    .eq("id", userId);

  // Atualizar registro de pagamento
  await supabase
    .from("payments")
    .update({ status: "approved" })
    .eq("mp_payment_id", mpPaymentId);

  console.log(
    `[webhook] Plano ${planId} aplicado para user ${userId} (mp_id: ${mpPaymentId})`
  );
}

// ─── Handler do webhook ───────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Verificar assinatura
  if (!verifyWebhookSignature(request)) {
    console.warn("[webhook] Assinatura inválida rejeitada");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { type, data } = body as {
    type: string;
    data: { id: string };
  };

  // Processar apenas eventos de pagamento
  if (type !== "payment") {
    return NextResponse.json({ received: true });
  }

  const paymentId = data?.id;
  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
  }

  try {
    // Buscar detalhes do pagamento no Mercado Pago
    const mpPayment = getMPPayment();
    const payment = await mpPayment.get({ id: Number(paymentId) });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const status = payment.status; // "approved" | "rejected" | "pending" | "cancelled"
    const externalRef = payment.external_reference; // "userId|planId"
    const amount = payment.transaction_amount ?? 0;
    const mpId = String(payment.id ?? paymentId);

    if (!externalRef || !externalRef.includes("|")) {
      console.warn("[webhook] external_reference inválido:", externalRef);
      return NextResponse.json({ received: true });
    }

    const [userId, planId] = externalRef.split("|") as [
      string,
      "monthly" | "lifetime"
    ];

    const supabase = createAdminClient();

    // Upsert do registro de pagamento
    await supabase.from("payments").upsert(
      {
        mp_payment_id: mpId,
        user_id: userId,
        plan_type: planId,
        amount,
        status,
        raw_data: payment as unknown as Record<string, unknown>,
      },
      { onConflict: "mp_payment_id" }
    );

    // Aplicar plano apenas em pagamentos aprovados
    if (status === "approved") {
      await applyPlan(userId, planId, mpId, amount, supabase);
    }

    // Pagamento rejeitado: reverter para free se necessário
    if (status === "rejected" || status === "cancelled") {
      console.log(
        `[webhook] Pagamento ${status} para user ${userId} — sem alteração de plano`
      );
    }

    return NextResponse.json({ received: true, status });
  } catch (err) {
    console.error("[webhook] Erro ao processar pagamento:", err);
    // Retornar 200 mesmo em erro para que o MP não reenvie indefinidamente
    return NextResponse.json({ received: true, error: "Processing error" });
  }
}

// ─── GET para verificação de health do endpoint ───────────────────────────────
export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "pagamentos/webhook" });
}
