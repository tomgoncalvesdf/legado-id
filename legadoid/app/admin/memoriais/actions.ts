"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export type ActionResult = { success: boolean; error?: string };

// ─── Publicar / despublicar memorial ─────────────────────────────────────────
export async function toggleMemorialPublishedAction(
  memorialId: string,
  published: boolean
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado" };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("memorials")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", memorialId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/memoriais");
  return { success: true };
}

// ─── Excluir memorial (admin override) ───────────────────────────────────────
export async function deleteMemorialAdminAction(
  memorialId: string
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado" };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("memorials")
    .delete()
    .eq("id", memorialId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/memoriais");
  revalidatePath("/admin");
  return { success: true };
}
