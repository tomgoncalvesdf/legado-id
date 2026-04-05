import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// ─── Singleton do cliente MP ──────────────────────────────────────────────────
let _client: MercadoPagoConfig | null = null;

export function getMPClient(): MercadoPagoConfig {
  if (_client) return _client;

  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "MERCADO_PAGO_ACCESS_TOKEN não configurado nas variáveis de ambiente."
    );
  }

  _client = new MercadoPagoConfig({
    accessToken: token,
    options: { timeout: 5000 },
  });

  return _client;
}

// ─── Helpers tipados ──────────────────────────────────────────────────────────
export function getMPPreference() {
  return new Preference(getMPClient());
}

export function getMPPayment() {
  return new Payment(getMPClient());
}

// ─── Planos disponíveis ───────────────────────────────────────────────────────
export const PLANS = {
  monthly: {
    id: "monthly",
    label: "Legado Mensal",
    price: 29.9,
    description: "Acesso completo com pagamento mensal recorrente",
    currency: "BRL",
  },
  lifetime: {
    id: "lifetime",
    label: "Legado Eterno",
    price: 197.0,
    description: "Acesso vitalício com pagamento único",
    currency: "BRL",
  },
} as const;

export type PlanId = keyof typeof PLANS;

// ─── URLs de retorno ──────────────────────────────────────────────────────────
export function getPaymentUrls(planId: PlanId) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://legadoid.com";
  return {
    success: `${base}/painel/upgrade/sucesso?plan=${planId}&status=approved`,
    failure: `${base}/painel/upgrade?error=payment_failed`,
    pending: `${base}/painel/upgrade/sucesso?plan=${planId}&status=pending`,
  };
}
