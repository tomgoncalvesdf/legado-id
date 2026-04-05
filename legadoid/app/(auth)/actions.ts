"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// ─── SCHEMAS DE VALIDAÇÃO ─────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().email("Email inválido"),
});

const resetSchema = z.object({
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// ─── TIPOS DE RETORNO ─────────────────────────────────────────────────────────
export interface ActionResult {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function loginAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email:    formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email:    parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email ou senha incorretos. Tente novamente." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Confirme seu email antes de entrar. Verifique sua caixa de entrada." };
    }
    return { error: "Não foi possível fazer login. Tente novamente." };
  }

  revalidatePath("/painel");
  redirect("/painel");
}

// ─── CADASTRO ─────────────────────────────────────────────────────────────────
export async function registerAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name:            formData.get("name") as string,
    email:           formData.get("email") as string,
    password:        formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = createClient();

  // Criar conta no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email:    parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Este email já está cadastrado. Tente fazer login." };
    }
    return { error: "Não foi possível criar sua conta. Tente novamente." };
  }

  // Se email confirmation estiver desativado no Supabase, redireciona direto
  if (data.session) {
    revalidatePath("/painel");
    redirect("/painel");
  }

  // Caso contrário, informa que o email foi enviado
  return {
    success:
      "Conta criada! Verifique seu email para confirmar o cadastro antes de entrar.",
  };
}

// ─── GOOGLE OAUTH ─────────────────────────────────────────────────────────────
export async function googleSignInAction(): Promise<ActionResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: "Não foi possível entrar com Google. Tente novamente." };
  }

  if (data.url) {
    redirect(data.url);
  }

  return {};
}

// ─── ESQUECI A SENHA ──────────────────────────────────────────────────────────
export async function forgotPasswordAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = { email: formData.get("email") as string };

  const parsed = forgotSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha`,
  });

  if (error) {
    return { error: "Não foi possível enviar o email. Tente novamente." };
  }

  return {
    success:
      "Email enviado! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.",
  };
}

// ─── REDEFINIR SENHA ──────────────────────────────────────────────────────────
export async function resetPasswordAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    password:        formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = resetSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Não foi possível redefinir a senha. O link pode ter expirado." };
  }

  revalidatePath("/painel");
  redirect("/painel");
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export async function signOutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
