"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export type ActionResult = { success: boolean; error?: string };

// ─── Alterar plano de um usuário ──────────────────────────────────────────────
export async function updateUserPlanAction(
  userId: string,
  plan: "free" | "monthly" | "lifetime"
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado" };

  const supabase = createAdminClient();

  const validPlans = ["free", "monthly", "lifetime"];
  if (!validPlans.includes(plan)) {
    return { success: false, error: "Plano inválido" };
  }

  const { error } = await supabase
    .from("users")
    .update({ plan, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin");
  return { success: true };
}

// ─── Ativar / desativar is_admin ──────────────────────────────────────────────
export async function toggleAdminAction(
  userId: string,
  isAdmin: boolean
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado" };

  // Não se auto-remover
  if (admin.id === userId && !isAdmin) {
    return { success: false, error: "Você não pode remover seus próprios privilégios de admin" };
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("users")
    .update({ is_admin: isAdmin, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}
