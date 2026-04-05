"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Cookie prefix para memorials com senha
// O cookie é: memorial_access_{slug} = "granted"
// HttpOnly, SameSite=Strict, 7 dias
const COOKIE_PREFIX = "memorial_access_";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias em segundos

// ─── Verificar senha e conceder acesso ───────────────────────────────────────
export async function grantAccessAction(
  slug: string,
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = (formData.get("password") as string) ?? "";

  if (!password.trim()) {
    return { error: "Digite a senha para continuar." };
  }

  const supabase = createClient();

  // Buscar memorial e sua senha
  const { data: memorial } = await supabase
    .from("memorials")
    .select("id, password_hash, privacy, status")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("privacy", "password")
    .single();

  if (!memorial || !memorial.password_hash) {
    return { error: "Memorial não encontrado ou não requer senha." };
  }

  // Comparar senha (em produção: bcrypt.compare)
  const isValid = password === memorial.password_hash;

  if (!isValid) {
    return { error: "Senha incorreta. Verifique e tente novamente." };
  }

  // Conceder acesso via cookie seguro
  const cookieStore = cookies();
  cookieStore.set(`${COOKIE_PREFIX}${slug}`, "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: `/`,
  });

  // Redirecionar para o memorial
  redirect(`/${slug}`);
}

// ─── Verificar se visitante já tem acesso (chamada interna) ───────────────────
export function hasMemorialAccess(slug: string): boolean {
  const cookieStore = cookies();
  return cookieStore.get(`${COOKIE_PREFIX}${slug}`)?.value === "granted";
}

// ─── Revogar acesso (logout do memorial) ─────────────────────────────────────
export async function revokeAccessAction(slug: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(`${COOKIE_PREFIX}${slug}`);
  redirect(`/${slug}/senha`);
}
