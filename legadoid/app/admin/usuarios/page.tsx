import { createAdminClient } from "@/lib/supabase/admin";
import { formatCount } from "@/lib/admin";
import { UserTable } from "./UserTable";
import { Users, Search } from "lucide-react";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: {
    q?: string;
    plan?: string;
    page?: string;
  };
}

export default async function AdminUsuariosPage({ searchParams }: PageProps) {
  const supabase = createAdminClient();

  const q = searchParams.q?.trim() ?? "";
  const planFilter = searchParams.plan ?? "all";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // ─── Query base ──────────────────────────────────────────────────────────────
  let query = supabase
    .from("users")
    .select(
      `
      id, name, email, plan, is_admin, created_at,
      memorials(count)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
  }
  if (planFilter !== "all") {
    query = query.eq("plan", planFilter);
  }

  const { data, count } = await query;

  // Normalizar contagem de memoriais
  const users = (data ?? []).map((u: any) => ({
    ...u,
    memorial_count: Array.isArray(u.memorials)
      ? u.memorials[0]?.count ?? 0
      : 0,
  }));

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // ─── Contagens por plano (para filtros) ──────────────────────────────────────
  const [freeRes, monthlyRes, lifetimeRes] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).eq("plan", "free"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("plan", "monthly"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("plan", "lifetime"),
  ]);

  const counts = {
    all: count ?? 0,
    free: freeRes.count ?? 0,
    monthly: monthlyRes.count ?? 0,
    lifetime: lifetimeRes.count ?? 0,
  };

  // ─── Filtros ─────────────────────────────────────────────────────────────────
  const filters = [
    { key: "all", label: "Todos", count: counts.all },
    { key: "free", label: "Gratuito", count: counts.free },
    { key: "monthly", label: "Mensal", count: counts.monthly },
    { key: "lifetime", label: "Eterno", count: counts.lifetime },
  ];

  function buildUrl(params: Record<string, string>) {
    const base = new URLSearchParams();
    if (q) base.set("q", q);
    if (planFilter !== "all") base.set("plan", planFilter);
    base.set("page", "1");
    Object.entries(params).forEach(([k, v]) => {
      if (v === "" || v === "all") base.delete(k);
      else base.set(k, v);
    });
    const str = base.toString();
    return `/admin/usuarios${str ? `?${str}` : ""}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Usuários</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {formatCount(count ?? 0)} usuários registrados
          </p>
        </div>
      </div>

      {/* Filtros + busca */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form method="GET" action="/admin/usuarios" className="flex-1 max-w-sm">
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar por nome ou email…"
              className="w-full pl-8 pr-4 py-2 text-sm rounded-xl bg-white/6 border border-white/8 text-white placeholder:text-white/25 outline-none focus:border-amber-medium/40 focus:bg-white/8 transition-all"
            />
            {planFilter !== "all" && (
              <input type="hidden" name="plan" value={planFilter} />
            )}
          </div>
        </form>

        {/* Plan filter tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
          {filters.map((f) => (
            <a
              key={f.key}
              href={buildUrl({ plan: f.key, page: "1" })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                planFilter === f.key
                  ? "bg-white/12 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-50">{f.count}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <UserTable users={users} />

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          {page > 1 && (
            <a
              href={buildUrl({ page: String(page - 1) })}
              className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/6 transition-all"
            >
              ← Anterior
            </a>
          )}

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === page;
            return (
              <a
                key={pageNum}
                href={buildUrl({ page: String(pageNum) })}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all ${
                  isActive
                    ? "bg-amber-medium/20 text-amber-light font-medium"
                    : "text-white/40 hover:text-white/70 hover:bg-white/6"
                }`}
              >
                {pageNum}
              </a>
            );
          })}

          {page < totalPages && (
            <a
              href={buildUrl({ page: String(page + 1) })}
              className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/6 transition-all"
            >
              Próxima →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
