import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health
 *
 * Health check para monitoramento Vercel / UptimeRobot / BetterStack.
 * Verifica conexão com o Supabase e retorna status dos serviços.
 */
export async function GET() {
  const start = Date.now();

  let dbStatus: "ok" | "error" = "ok";
  let dbLatencyMs = 0;

  try {
    const supabase = createAdminClient();
    const dbStart = Date.now();

    // Query leve — apenas verifica conectividade
    const { error } = await supabase
      .from("users")
      .select("id")
      .limit(1)
      .single();

    dbLatencyMs = Date.now() - dbStart;

    // "PGRST116" = no rows found — ainda assim indica DB funcionando
    if (error && error.code !== "PGRST116") {
      dbStatus = "error";
    }
  } catch {
    dbStatus = "error";
  }

  const totalMs = Date.now() - start;
  const healthy = dbStatus === "ok";

  const body = {
    status: healthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    services: {
      database: {
        status: dbStatus,
        latency_ms: dbLatencyMs,
      },
    },
    total_ms: totalMs,
  };

  return NextResponse.json(body, {
    status: healthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
      "X-Health-Status": body.status,
    },
  });
}
