import { createAdminClient } from "@/lib/supabase/admin";
import { formatCount } from "@/lib/admin";
import { MemorialActions } from "./MemorialActions";
import { Search, ExternalLink } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: {
    q?: string;
    privacy?: string;
    published?: string;
    page?: string;
  };
}

function PrivacyBadge({ privacy }: { privacy: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    public: { label: "Público", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    private: { label: "Privado", cls: "text-white/40 bg-white/5 border-white/10" },
    password: { label: "Senha", cls: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  };
  const { label, cls } = map[privacy] ?? { label: privacy, cls: "text-white/30 bg-white/5 border-white/10" };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

export default async function AdminMemoriaisPage({ searchParams }: PageProps) {
  const supabase = createAdminClient();

  const q = searchParams.q?.trim() ?? "";
  const privacyFilter = searchParams.privacy ?? "all";
  const publishedFilter = searchParams.published ?? "all";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // ─── Query ────────────────────────────────────────────────────────────────────
  let query = supabase
    .from("memorials")
    .select(
      `
      id, name, slug, privacy, published, view_count, created_at,
      users(name, email, plan),
      memory_posts(count)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) {
    query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
  }
  if (privacyFilter !== "all") {
    query = query.eq("privacy", privacyFilter);
  }
  if (publishedFilter === "published") {
    query = query.eq("published", true);
  } else if (publishedFilter === "unpublished") {
    query = query.eq("published", false);
  }

  const { data, count } = await query;

  const memorials = (data ?? []).map((m: any) => ({
    ...m,
    memory_count: Array.isArray(m.memory_posts) ? m.memory_posts[0]?.count ?? 0 : 0,
    owner: Array.isArray(m.users) ? m.users[0] : m.users,
  }));

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  function buildUrl(params: Record<string, string>) {
    const base = new URLSearchParams();
    if (q) base.set("q", q);
    if (privacyFilter !== "all") base.set("privacy", privacyFilter);
    if (publishedFilter !== "all") base.set("published", publishedFilter);
    base.set("page", "1");
    Object.entries(params).forEach(([k, v]) => {
      if (v === "" || v === "all") base.delete(k);
      else base.set(k, v);
    });
    const str = base.toString();
    return `/admin/memoriais${str ? `?${str}` : ""}`;
  }

  const privacyFilters = [
    { key: "all", label: "Todos" },
    { key: "public", label: "Públicos" },
    { key: "private", label: "Privados" },
    { key: "password", label: "Com senha" },
  ];

  const publishedFilters = [
    { key: "all", label: "Todos" },
    { key: "published", label: "Publicados" },
    { key: "unpublished", label: "Rascunhos" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Memoriais</h1>
        <p className="text-sm text-white/40 mt-0.5">
          {formatCount(count ?? 0)} memoriais criados
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search */}
        <form method="GET" action="/admin/memoriais" className="flex-1 max-w-sm">
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar por nome ou slug…"
              className="w-full pl-8 pr-4 py-2 text-sm rounded-xl bg-white/6 border border-white/8 text-white placeholder:text-white/25 outline-none focus:border-amber-medium/40 transition-all"
            />
            {privacyFilter !== "all" && (
              <input type="hidden" name="privacy" value={privacyFilter} />
            )}
            {publishedFilter !== "all" && (
              <input type="hidden" name="published" value={publishedFilter} />
            )}
          </div>
        </form>

        {/* Privacy filter */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
          {privacyFilters.map((f) => (
            <a
              key={f.key}
              href={buildUrl({ privacy: f.key })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                privacyFilter === f.key
                  ? "bg-white/12 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </a>
          ))}
        </div>

        {/* Published filter */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
          {publishedFilters.map((f) => (
            <a
              key={f.key}
              href={buildUrl({ published: f.key })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                publishedFilter === f.key
                  ? "bg-white/12 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </a>
          ))}
        </div>
      </div>

      {/* Tabela */}
      {memorials.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/4 py-16 text-center">
          <p className="text-sm text-white/20">Nenhum memorial encontrado</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/4">
                <th className="px-4 py-3 text-left text-xs text-white/30 font-medium">
                  Memorial
                </th>
                <th className="px-4 py-3 text-left text-xs text-white/30 font-medium">
                  Criado por
                </th>
                <th className="px-4 py-3 text-center text-xs text-white/30 font-medium">
                  Privacidade
                </th>
                <th className="px-4 py-3 text-center text-xs text-white/30 font-medium">
                  Views
                </th>
                <th className="px-4 py-3 text-center text-xs text-white/30 font-medium">
                  Memórias
                </th>
                <th className="px-4 py-3 text-center text-xs text-white/30 font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs text-white/30 font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {memorials.map((m: any) => (
                <tr key={m.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-white/80 truncate max-w-[180px] font-medium">
                          {m.name}
                        </p>
                        <Link
                          href={`/${m.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0"
                        >
                          <ExternalLink size={11} strokeWidth={1.5} />
                        </Link>
                      </div>
                      <p className="text-xs text-white/25">/{m.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-white/60 truncate max-w-[140px]">
                        {m.owner?.name ?? "—"}
                      </p>
                      <p className="text-xs text-white/25 truncate max-w-[140px]">
                        {m.owner?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PrivacyBadge privacy={m.privacy} />
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums text-white/50 text-xs">
                    {formatCount(m.view_count ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums text-white/50 text-xs">
                    {m.memory_count}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${
                        m.published
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                          : "text-white/30 bg-white/4 border-white/10"
                      }`}
                    >
                      {m.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <MemorialActions memorial={{ id: m.id, name: m.name, published: m.published }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
