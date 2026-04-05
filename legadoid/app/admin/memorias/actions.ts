"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export type ActionResult = { success: boolean; error?: string };

// ─── Aprovar memória ──────────────────────────────────────────────────────────
export async function approveMemoryAction(memoryId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado" };

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("memory_posts")
    .update({ approved: true, moderated_at: now, moderated_by: admin.id })
    .eq("id", memoryId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/memorias");
  revalidatePath("/admin");
  return { success: true };
}

// ─── Rejeitar memória ─────────────────────────────────────────────────────────
export async function rejectMemoryAction(memoryId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado" };

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("memory_posts")
    .update({ approved: false, moderated_at: now, moderated_by: admin.id })
    .eq("id", memoryId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/memorias");
  revalidatePath("/admin");
  return { success: true };
}

// ─── Excluir memória ──────────────────────────────────────────────────────────
export async function deleteMemoryAction(memoryId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado" };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("memory_posts")
    .delete()
    .eq("id", memoryId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/memorias");
  revalidatePath("/admin");
  return { success: true };
}

// ─── Aprovar todas as pendentes ────────────────────────────────────────────────
export async function approveAllGlobalAction(): Promise<ActionResult & { count?: number }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado" };

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("memory_posts")
    .update({ approved: true, moderated_at: now, moderated_by: admin.id })
    .is("moderated_at", null)
    .select("id");

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/memorias");
  revalidatePath("/admin");
  return { success: true, count: data?.length ?? 0 };
}
