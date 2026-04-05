import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Rota de callback OAuth (Google, etc.)
 * O Supabase redireciona aqui após autenticação com `code` na query string.
 * Trocamos o `code` pela sessão e redirecionamos para o destino correto.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // `next` permite redirecionar para a página original que o usuário tentou acessar
  const next = searchParams.get("next") ?? "/painel";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirecionar para o destino (painel ou página de origem)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Em caso de erro, redirecionar para login com mensagem de erro
  return NextResponse.redirect(
    `${origin}/entrar?error=auth_callback_error`
  );
}
