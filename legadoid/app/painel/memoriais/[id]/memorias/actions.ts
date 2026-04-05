"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

// ─── Helper: verificar propriedade do memorial ────────────────────────────────
async function verifyOwnership(memorialId: string) {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", authUser.id)
    .single();
  if (!profile) return null;

  const { data: memorial } = await supabase
    .from("memorials")
    .select("id")
    .eq("id", memorialId)
    .eq("owner_id", profile.id)
    .single();

  if (!memorial) return null;
  return supabase;
}

// ─── Aprovar memória ──────────────────────────────────────────────────────────
export async function approveMemoryAction(
  memorialId: string,
  postId: string
): Promise<ActionResult> {
  const supabase = await verifyOwnership(memorialId);
  if (!supabase) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("memory_posts")
    .update({ approved: true, moderated_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("memorial_id", memorialId);

  if (error) return { error: "Erro ao aprovar a memória." };

  revalidatePath(`/painel/memoriais/${memorialId}/memorias`);
  revalidatePath(`/[slug]`);
  return { success: "Memória aprovada." };
}

// ─── Rejeitar/ocultar memória ─────────────────────────────────────────────────
export async function rejectMemoryAction(
  memorialId: string,
  postId: string
): Promise<ActionResult> {
  const supabase = await verifyOwnership(memorialId);
  if (!supabase) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("memory_posts")
    .update({ approved: false, moderated_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("memorial_id", memorialId);

  if (error) return { error: "Erro ao rejeitar a memória." };

  revalidatePath(`/painel/memoriais/${memorialId}/memorias`);
  revalidatePath(`/[slug]`);
  return { success: "Memória ocultada." };
}

// ─── Excluir memória permanentemente ─────────────────────────────────────────
export async function deleteMemoryAction(
  memorialId: string,
  postId: string
): Promise<ActionResult> {
  const supabase = await verifyOwnership(memorialId);
  if (!supabase) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("memory_posts")
    .delete()
    .eq("id", postId)
    .eq("memorial_id", memorialId);

  if (error) return { error: "Erro ao excluir a memória." };

  revalidatePath(`/painel/memoriais/${memorialId}/memorias`);
  revalidatePath(`/[slug]`);
  return { success: "Memória excluída." };
}

// ─── Aprovar todas as pendentes de uma vez ────────────────────────────────────
export async function approveAllPendingAction(
  memorialId: string
): Promise<ActionResult> {
  const supabase = await verifyOwnership(memorialId);
  if (!supabase) return { error: "Não autorizado." };

  const { error, count } = await supabase
    .from("memory_posts")
    .update({ approved: true, moderated_at: new Date().toISOString() })
    .eq("memorial_id", memorialId)
    .is("moderated_at", null); // apenas as nunca moderadas

  if (error) return { error: "Erro ao aprovar as memórias." };

  revalidatePath(`/painel/memoriais/${memorialId}/memorias`);
  revalidatePath(`/[slug]`);
  return { success: `${count ?? "Todas as"} memórias aprovadas.` };
}
