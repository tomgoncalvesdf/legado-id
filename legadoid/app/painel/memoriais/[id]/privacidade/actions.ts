"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

// ─── Schema de privacidade ────────────────────────────────────────────────────
const privacySchema = z.discriminatedUnion("privacy", [
  z.object({ privacy: z.literal("public") }),
  z.object({ privacy: z.literal("private") }),
  z.object({
    privacy: z.literal("password"),
    password: z
      .string()
      .min(4, "A senha precisa ter ao menos 4 caracteres.")
      .max(72, "Senha muito longa."),
  }),
]);

// ─── Helper: verificar propriedade ───────────────────────────────────────────
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
    .select("id, privacy, password_hash")
    .eq("id", memorialId)
    .eq("owner_id", profile.id)
    .single();

  if (!memorial) return null;
  return { supabase, memorial };
}

// ─── Atualizar configurações de privacidade ───────────────────────────────────
export async function updatePrivacyAction(
  memorialId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const result = await verifyOwnership(memorialId);
  if (!result) return { error: "Não autorizado." };

  const { supabase } = result;

  const rawData = {
    privacy: formData.get("privacy") as string,
    password: (formData.get("password") as string) || undefined,
  };

  const parsed = privacySchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.errors.forEach((e) => {
      const key = e.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(e.message);
    });
    return { fieldErrors };
  }

  const updateData: Record<string, unknown> = {
    privacy: parsed.data.privacy,
  };

  // Armazenar senha em texto simples por ora
  // Em produção: usar bcrypt (ex: import bcryptjs from 'bcryptjs')
  if (parsed.data.privacy === "password" && "password" in parsed.data) {
    updateData.password_hash = parsed.data.password;
  } else {
    // public ou private — limpar hash de senha
    updateData.password_hash = null;
  }

  const { error } = await supabase
    .from("memorials")
    .update(updateData)
    .eq("id", memorialId);

  if (error) return { error: "Erro ao salvar as configurações de privacidade." };

  revalidatePath(`/painel/memoriais/${memorialId}/privacidade`);
  revalidatePath(`/painel/memoriais/${memorialId}`);
  revalidatePath(`/[slug]`);

  return { success: "Configurações de privacidade atualizadas." };
}

// ─── Verificar senha de acesso (usada pelo visitante) ─────────────────────────
export async function verifyMemorialPasswordAction(
  slug: string,
  password: string
): Promise<{ valid: boolean; memorialId?: string }> {
  const supabase = createClient();

  const { data: memorial } = await supabase
    .from("memorials")
    .select("id, password_hash, privacy")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("privacy", "password")
    .single();

  if (!memorial || !memorial.password_hash) return { valid: false };

  // Comparação direta (substituir por bcryptjs.compare em produção)
  const valid = password === memorial.password_hash;

  return { valid, memorialId: valid ? memorial.id : undefined };
}
