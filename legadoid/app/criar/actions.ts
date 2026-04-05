"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";
import type { ActionResult } from "@/types";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const memorialSchema = z.object({
  // Step 1 — Básico
  name: z
    .string()
    .min(2, "O nome precisa ter ao menos 2 caracteres")
    .max(120, "Nome muito longo"),
  birth_date: z.string().optional().nullable(),
  death_date: z.string().optional().nullable(),
  relation: z.string().max(60, "Relação muito longa").optional().nullable(),

  // Step 2 — História
  bio: z.string().max(2000, "Biografia muito longa").optional().nullable(),
  personality_traits: z.string().optional().nullable(), // CSV separado por vírgula
  hobbies: z.string().optional().nullable(),           // CSV separado por vírgula
  favorite_quote: z.string().max(300, "Citação muito longa").optional().nullable(),

  // Step 3 — Privacidade
  slug: z
    .string()
    .min(3, "Link muito curto")
    .max(80, "Link muito longo")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens"),
  privacy: z.enum(["public", "private", "password"]).default("public"),
  password: z.string().optional().nullable(),
});

type MemorialFormData = z.infer<typeof memorialSchema>;

// ─── Helper: buscar perfil autenticado ────────────────────────────────────────
async function getAuthProfile() {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, plan")
    .eq("auth_id", authUser.id)
    .single();

  return profile ?? null;
}

// ─── Verificar se slug está disponível ────────────────────────────────────────
export async function checkSlugAction(
  slug: string,
  excludeId?: string
): Promise<{ available: boolean }> {
  if (!slug || slug.length < 3) return { available: false };

  const supabase = createClient();
  let query = supabase
    .from("memorials")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query;
  return { available: !data || data.length === 0 };
}

// ─── Criar memorial ───────────────────────────────────────────────────────────
export async function createMemorialAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const profile = await getAuthProfile();
  if (!profile) return { error: "Você precisa estar logado para criar um memorial." };

  // Verificar limite de plano
  const supabase = createClient();
  const { count } = await supabase
    .from("memorials")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", profile.id);

  const memorialCount = count ?? 0;
  if (profile.plan === "free" && memorialCount >= 1) {
    return {
      error:
        "No plano gratuito é possível criar apenas 1 memorial. Faça upgrade para criar mais.",
    };
  }

  // Parsear e validar
  const rawData: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    rawData[key] = value === "" ? null : value;
  });

  const parsed = memorialSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.errors.forEach((e) => {
      const key = e.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(e.message);
    });
    return { fieldErrors };
  }

  const data: MemorialFormData = parsed.data;

  // Verificar slug único
  const { available } = await checkSlugAction(data.slug);
  if (!available) {
    return {
      fieldErrors: { slug: ["Este link já está em uso. Escolha outro."] },
    };
  }

  // Processar arrays de texto
  const personalityTraits = data.personality_traits
    ? data.personality_traits.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const hobbies = data.hobbies
    ? data.hobbies.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Inserir no banco
  const { data: memorial, error } = await supabase
    .from("memorials")
    .insert({
      owner_id: profile.id,
      name: data.name,
      slug: data.slug,
      birth_date: data.birth_date ?? null,
      death_date: data.death_date ?? null,
      relation: data.relation ?? null,
      bio: data.bio ?? null,
      personality_traits: personalityTraits,
      hobbies: hobbies,
      favorite_quote: data.favorite_quote ?? null,
      privacy: data.privacy,
      password_hash: data.password ?? null, // em produção: hash com bcrypt
      status: "draft",
    })
    .select("id, slug")
    .single();

  if (error || !memorial) {
    console.error("[createMemorial]", error);
    return { error: "Erro ao criar o memorial. Tente novamente." };
  }

  // Criar plano inicial (free)
  await supabase.from("memorial_plans").insert({
    memorial_id: memorial.id,
    plan_type: "free",
  });

  revalidatePath("/painel");
  redirect(`/criar/sucesso?id=${memorial.id}&slug=${memorial.slug}`);
}

// ─── Publicar memorial ────────────────────────────────────────────────────────
export async function publishMemorialAction(
  memorialId: string
): Promise<ActionResult> {
  const profile = await getAuthProfile();
  if (!profile) return { error: "Não autenticado." };

  const supabase = createClient();
  const { error } = await supabase
    .from("memorials")
    .update({ status: "published" })
    .eq("id", memorialId)
    .eq("owner_id", profile.id);

  if (error) return { error: "Erro ao publicar o memorial." };

  revalidatePath("/painel");
  revalidatePath(`/painel/memoriais/${memorialId}`);
  return { success: "Memorial publicado com sucesso!" };
}

// ─── Atualizar slug (com verificação de disponibilidade) ─────────────────────
export async function updateSlugAction(
  memorialId: string,
  newSlug: string
): Promise<ActionResult> {
  const profile = await getAuthProfile();
  if (!profile) return { error: "Não autenticado." };

  const slugValidation = z
    .string()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/)
    .safeParse(newSlug);

  if (!slugValidation.success) {
    return { error: "Slug inválido. Use apenas letras minúsculas, números e hífens." };
  }

  const { available } = await checkSlugAction(newSlug, memorialId);
  if (!available) return { error: "Este link já está em uso." };

  const supabase = createClient();
  const { error } = await supabase
    .from("memorials")
    .update({ slug: newSlug })
    .eq("id", memorialId)
    .eq("owner_id", profile.id);

  if (error) return { error: "Erro ao atualizar o link." };

  revalidatePath(`/painel/memoriais/${memorialId}`);
  return { success: "Link atualizado!" };
}
