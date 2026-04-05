import { createClient } from "@/lib/supabase/server";

// Super admins definidos por email (ou coluna is_admin na tabela users)
// Em produção: usar coluna `is_admin boolean` na tabela users com RLS
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

export interface AdminProfile {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  is_admin: boolean;
}

// ─── Verificar se o usuário autenticado é admin ───────────────────────────────
export async function requireAdmin(): Promise<AdminProfile | null> {
  const supabase = createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Verificar por email (simples) ou coluna is_admin
  const isAdminByEmail = ADMIN_EMAILS.includes(authUser.email ?? "");

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, plan, is_admin")
    .eq("auth_id", authUser.id)
    .single();

  if (!profile) return null;

  const isAdmin = isAdminByEmail || profile.is_admin === true;
  if (!isAdmin) return null;

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    plan: profile.plan,
    is_admin: true,
  };
}

// ─── Formatar números grandes ─────────────────────────────────────────────────
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
