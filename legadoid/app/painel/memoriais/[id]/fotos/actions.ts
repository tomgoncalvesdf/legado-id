"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

const BUCKET = "memorial-photos";
const MAX_SIZE_MB = 8;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_PHOTOS_FREE = 10;
const MAX_PHOTOS_PAID = 200;

// ─── Helper: verificar propriedade do memorial ────────────────────────────────
async function verifyOwnership(memorialId: string) {
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
  if (!profile) return null;

  const { data: memorial } = await supabase
    .from("memorials")
    .select("id, owner_id")
    .eq("id", memorialId)
    .eq("owner_id", profile.id)
    .single();

  if (!memorial) return null;
  return { profile, supabase };
}

// ─── Upload de foto ───────────────────────────────────────────────────────────
export async function uploadPhotoAction(
  memorialId: string,
  formData: FormData
): Promise<ActionResult & { url?: string; photoId?: string }> {
  const ownership = await verifyOwnership(memorialId);
  if (!ownership) return { error: "Não autorizado." };

  const { profile, supabase } = ownership;

  // Verificar limite de fotos
  const { count } = await supabase
    .from("memorial_photos")
    .select("*", { count: "exact", head: true })
    .eq("memorial_id", memorialId);

  const limit = profile.plan === "free" ? MAX_PHOTOS_FREE : MAX_PHOTOS_PAID;
  if ((count ?? 0) >= limit) {
    return {
      error: `Limite de ${limit} fotos atingido${profile.plan === "free" ? ". Faça upgrade para adicionar mais." : "."}`,
    };
  }

  // Validar arquivo
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Nenhum arquivo selecionado." };
  if (!ALLOWED_TYPES.includes(file.type))
    return { error: "Formato não suportado. Use JPG, PNG, WebP ou GIF." };
  if (file.size > MAX_SIZE_BYTES)
    return { error: `A foto deve ter no máximo ${MAX_SIZE_MB}MB.` };

  // Gerar caminho único no Storage
  const ext = file.name.split(".").pop() ?? "jpg";
  const timestamp = Date.now();
  const storagePath = `${memorialId}/${timestamp}.${ext}`;

  // Upload para Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("[uploadPhoto] storage error:", uploadError);
    return { error: "Erro no upload. Tente novamente." };
  }

  // URL pública
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // Determinar ordem (último + 1)
  const { data: lastPhoto } = await supabase
    .from("memorial_photos")
    .select("display_order")
    .eq("memorial_id", memorialId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (lastPhoto?.display_order ?? 0) + 1;

  // Registrar no banco
  const caption = (formData.get("caption") as string) || null;
  const { data: photo, error: dbError } = await supabase
    .from("memorial_photos")
    .insert({
      memorial_id: memorialId,
      url: publicUrl,
      storage_path: storagePath,
      caption: caption?.trim() || null,
      display_order: nextOrder,
    })
    .select("id")
    .single();

  if (dbError || !photo) {
    // Reverter upload se o registro falhar
    await supabase.storage.from(BUCKET).remove([storagePath]);
    return { error: "Erro ao registrar a foto. Tente novamente." };
  }

  revalidatePath(`/painel/memoriais/${memorialId}/fotos`);
  revalidatePath(`/[slug]`);

  return { success: "Foto enviada!", url: publicUrl, photoId: photo.id };
}

// ─── Definir foto de capa ─────────────────────────────────────────────────────
export async function setCoverPhotoAction(
  memorialId: string,
  photoUrl: string
): Promise<ActionResult> {
  const ownership = await verifyOwnership(memorialId);
  if (!ownership) return { error: "Não autorizado." };

  const { supabase } = ownership;
  const { error } = await supabase
    .from("memorials")
    .update({ cover_photo_url: photoUrl })
    .eq("id", memorialId);

  if (error) return { error: "Erro ao definir foto de capa." };

  revalidatePath(`/painel/memoriais/${memorialId}/fotos`);
  revalidatePath(`/[slug]`);
  return { success: "Foto de capa atualizada!" };
}

// ─── Excluir foto ─────────────────────────────────────────────────────────────
export async function deletePhotoAction(
  memorialId: string,
  photoId: string
): Promise<ActionResult> {
  const ownership = await verifyOwnership(memorialId);
  if (!ownership) return { error: "Não autorizado." };

  const { supabase } = ownership;

  // Buscar storage_path antes de deletar
  const { data: photo } = await supabase
    .from("memorial_photos")
    .select("storage_path, url")
    .eq("id", photoId)
    .eq("memorial_id", memorialId)
    .single();

  if (!photo) return { error: "Foto não encontrada." };

  // Remover do banco
  const { error: dbError } = await supabase
    .from("memorial_photos")
    .delete()
    .eq("id", photoId);

  if (dbError) return { error: "Erro ao remover a foto." };

  // Remover do Storage (se tiver storage_path)
  if (photo.storage_path) {
    await supabase.storage.from(BUCKET).remove([photo.storage_path]);
  }

  // Se era a capa, limpar
  await supabase
    .from("memorials")
    .update({ cover_photo_url: null })
    .eq("id", memorialId)
    .eq("cover_photo_url", photo.url);

  revalidatePath(`/painel/memoriais/${memorialId}/fotos`);
  return { success: "Foto removida." };
}

// ─── Reordenar fotos ──────────────────────────────────────────────────────────
export async function reorderPhotosAction(
  memorialId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  const ownership = await verifyOwnership(memorialId);
  if (!ownership) return { error: "Não autorizado." };

  const { supabase } = ownership;

  // Atualizar display_order de cada foto
  const updates = orderedIds.map((id, index) =>
    supabase
      .from("memorial_photos")
      .update({ display_order: index + 1 })
      .eq("id", id)
      .eq("memorial_id", memorialId)
  );

  await Promise.all(updates);

  revalidatePath(`/painel/memoriais/${memorialId}/fotos`);
  return { success: "Ordem salva." };
}
