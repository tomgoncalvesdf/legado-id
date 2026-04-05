// ─── RESULTADO DE SERVER ACTIONS ─────────────────────────────────────────────
// Compatível com os múltiplos padrões usados nas actions existentes:
//   { success: true }  |  { success: "Mensagem ok" }  |  { error: "msg" }
export type ActionResult = {
  success?: boolean | string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  [key: string]: unknown;
};

// ─── PLANOS ───────────────────────────────────────────────────────────────────
export type PlanId = "free" | "monthly" | "lifetime";

// ─── USUÁRIO ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  auth_id: string;
  name: string | null;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  plan: PlanId;
  is_admin?: boolean | null;
  created_at: string;
  updated_at: string;
}

// ─── MEMORIAL ─────────────────────────────────────────────────────────────────
export type MemorialPrivacy = "public" | "password" | "private";

export interface Memorial {
  id: string;
  user_id: string;
  name: string;
  relation?: string | null;
  birth_date?: string | null;
  death_date?: string | null;
  bio?: string | null;
  personality_traits?: string[] | null;
  hobbies?: string[] | null;
  favorite_quote?: string | null;
  slug: string;
  privacy: MemorialPrivacy;
  password_hash?: string | null;
  published: boolean;
  cover_photo_url?: string | null;
  profile_photo_url?: string | null;
  // Contadores
  view_count?: number | null;
  views_count?: number | null;
  candles_count?: number | null;
  memories_count?: number | null;
  photos_count?: number | null;
  // Compatibilidade com campo legado
  status?: string | null;
  created_at: string;
  updated_at: string;
}

// ─── FOTO ─────────────────────────────────────────────────────────────────────
export interface MemorialPhoto {
  id: string;
  memorial_id: string;
  url: string;
  caption?: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

// ─── MEMÓRIA (MURO) ───────────────────────────────────────────────────────────
export interface MemoryPost {
  id: string;
  memorial_id: string;
  author_name: string;
  relation?: string | null;
  content: string;
  approved: boolean | null;
  moderated_at: string | null;
  moderated_by?: string | null;
  created_at: string;
}

// ─── VELA ─────────────────────────────────────────────────────────────────────
export interface Candle {
  id: string;
  memorial_id: string;
  lighter_name?: string | null;
  message?: string | null;
  created_at: string;
}

// ─── PAGAMENTO ────────────────────────────────────────────────────────────────
export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled" | "refunded";

export interface Payment {
  id: string;
  user_id: string;
  mp_payment_id: string;
  plan_id: PlanId;
  status: PaymentStatus;
  amount: number;
  created_at: string;
  updated_at: string;
}

// ─── API RESPONSES ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
