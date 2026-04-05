/**
 * Re-exporta createAdminClient a partir do módulo server para manter
 * compatibilidade com imports `@/lib/supabase/admin` usados em todo o projeto.
 *
 * createAdminClient usa a service role key — nunca expor no frontend.
 */
export { createAdminClient } from "./server";
