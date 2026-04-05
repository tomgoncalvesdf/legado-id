import { createAdminClient } from "@/lib/supabase/admin";
import { formatCount } from "@/lib/admin";
import { MemoryCard } from "./MemoryCard";
import { ApproveAllButton } from "./ApproveAllButton";
import { Search } from "lucide-react";

const PAGE_SIZE = 24;

interface PageProps {
  searchParams: {
    q?: string;
    status?: string;
    page?: string;
  };
}

export default async function AdminMemoriasPage({ searchParams }: PageProps) {
  const supabase = createAdminClient();

  const q = searchParams.q?.trim() ?? "";
  const statusFilter = searchParams.status ?? "pending";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // ─── Query ────────────────────────────────────────────────────────────────────
  let query = supabase
    .from("memory_posts")
    .select(
      `
      id, author_name, content, relation, created_at, approved, moderated_at,
      memorials(id, name, slug)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) {
    query = query.or(`author_name.ilike.%${q}%,content.ilike.%${q}%`);
  }

  if (statusFilter === "pending") {
    query = query.is("moderated_at", null);
  } else if (statusFilter === "approved") {
    query = query.eq("approved", true).not("moderated_at", "is", null);
  } else if (statusFilter === "rejected") {
    query = query.eq("approved", false).not("moderated_at", "is", null);
  }

  const { data, count } = await query;

  const memories = (data ?? []).map((m: any) => ({
    ...m,
    memorial: Array.isArray(m.memorials) ? m.memorials[0] : m.memorials,
  }));

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // ─── Contagens por status ─────────────────────────────────────────────────────
  const [pendingRes, approvedRes, rejectedRes, totalRes] = await Promise.all([
    supabase
      .from("memory_posts")
      .select("*", { count: "exact", head: true })
      .is("moderated_at", null),
    supabase
      .from("memory_posts")
      .select("*", { count: "exact", head: true })
      .eq("approved", true)
      .not("moderated_at", "is", null),
    supabase
      .from("memory_posts")
      .select("*", { count: "exact", head: true })
      .eq("approved", false)
      .not("moderated_at", "is", null),
    supabase.from("memory_posts").select("*", { count: "exact", head: true }),
  ]);

  const statusCounts = {
    all: totalRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    approved: approvedRes.count ?? 0,
    rejected: rejectedRes.count ?? 0,
  };

  const tabs = [
    { key: "pending", label: "Pendentes", count: statusCounts.pending },
    { key: "approved", label: "Aprovadas", count: statusCounts.approved },
    { key: "rejected", label: "Rejeitadas", count: statusCounts.rejected },
    { key: "all", label: "Todas", count: statusCounts.all },
  ];

  function buildUrl(params: Record<string, string>) {
    const base = new URLSearchParams();
    if (q) base.set("q", q);
    base.set("status", statusFilter);
    base.set("page", "1");
    Object.entries(params).forEach(([k, v]) => {
      if (v === "") base.delete(k);
      else base.set(k, v);
    });
    const str = base.toString();
    return `/admin/memorias${str ? `?${str}` : ""}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-white">Moderação Global</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {formatCount(statusCounts.all)} memórias na plataforma ·{" "}
            <span
              className={
                statusCounts.pending > 0 ? "text-amber-light" : "text-white/40"
              }
            >
              {statusCounts.pending} pendentes
            </span>
          </p>
        </div>
        {statusFilter === "pending" && (
          <ApproveAllButton count={statusCounts.pending} />
        )}
      </div>

      {/* Filtros + busca */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form method="GET" action="/admin/memorias" className="flex-1 max-w-sm">
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar por autor ou conteúdo…"
              className="w-full pl-8 pr-4 py-2 text-sm rounded-xl bg-white/6 border border-white/8 text-white placeholder:text-white/25 outline-none focus:border-amber-medium/40 transition-all"
            />
            <input type="hidden" name="status" value={statusFilter} />
          </div>
        </form>

        {/* Status tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={buildUrl({ status: tab.key })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? "bg-white/12 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    tab.key === "pending" && tab.count > 0
                      ? "bg-amber-medium/30 text-amber-light"
                      : "opacity-50"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Grid de memórias */}
      {memories.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/4 py-20 text-center">
          <p className="text-sm text-white/20">
            {statusFilter === "pending"
              ? "Nenhuma memória pendente 🎉"
              : "Nenhuma memória encontrada"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {memories.map((m: any) => (
            <MemoryCard key={m.id} memory={m} />
          ))}
        </div>
      )}

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
            const p = i + 1;
            return (
              <a
                key={p}
                href={buildUrl({ page: String(p) })}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all ${
                  p === page
                    ? "bg-amber-medium/20 text-amber-light font-medium"
                    : "text-white/40 hover:text-white/70 hover:bg-white/6"
                }`}
              >
                {p}
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
