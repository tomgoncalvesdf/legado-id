import { createAdminClient } from "@/lib/supabase/admin";
import { formatCount } from "@/lib/admin";
import {
  Users,
  BookHeart,
  MessageSquareHeart,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Flame,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  created_at: string;
}

interface RecentMemorial {
  id: string;
  name: string;
  slug: string;
  privacy: string;
  created_at: string;
  users: { name: string | null; email: string } | null;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 flex items-start gap-4 ${
        accent
          ? "bg-amber-medium/10 border-amber-medium/20"
          : "bg-white/4 border-white/8"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          accent ? "bg-amber-medium/20" : "bg-white/8"
        }`}
      >
        <Icon
          size={18}
          strokeWidth={1.5}
          className={accent ? "text-amber-light" : "text-white/60"}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/40 mb-1">{label}</p>
        <p className="text-2xl font-semibold text-white tabular-nums">{value}</p>
        {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Badge de plano ───────────────────────────────────────────────────────────
function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    lifetime:
      "bg-amber-medium/20 text-amber-light border border-amber-medium/30",
    monthly: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
    free: "bg-white/8 text-white/40 border border-white/10",
  };
  const labels: Record<string, string> = {
    lifetime: "Eterno",
    monthly: "Mensal",
    free: "Gratuito",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
        styles[plan] ?? styles.free
      }`}
    >
      {labels[plan] ?? plan}
    </span>
  );
}

// ─── Privacy badge ────────────────────────────────────────────────────────────
function PrivacyBadge({ privacy }: { privacy: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    public: { label: "Público", cls: "text-emerald-400" },
    private: { label: "Privado", cls: "text-white/30" },
    password: { label: "Senha", cls: "text-amber-400" },
  };
  const { label, cls } = map[privacy] ?? { label: privacy, cls: "text-white/30" };
  return <span className={`text-xs ${cls}`}>{label}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // Buscar métricas em paralelo
  const [
    totalUsersRes,
    freeUsersRes,
    monthlyUsersRes,
    lifetimeUsersRes,
    totalMemoriaisRes,
    totalMemoriasRes,
    pendingMemoriasRes,
    totalViewsRes,
    recentUsersRes,
    recentMemoriaisRes,
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("plan", "free"),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("plan", "monthly"),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("plan", "lifetime"),
    supabase.from("memorials").select("*", { count: "exact", head: true }),
    supabase.from("memory_posts").select("*", { count: "exact", head: true }),
    supabase
      .from("memory_posts")
      .select("*", { count: "exact", head: true })
      .is("moderated_at", null),
    supabase
      .from("memorials")
      .select("view_count")
      .then((r) => ({
        data: (r.data ?? []).reduce((acc: number, m: { view_count?: number | null }) => acc + (m.view_count ?? 0), 0),
      })),
    supabase
      .from("users")
      .select("id, name, email, plan, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("memorials")
      .select("id, name, slug, privacy, created_at, users(name, email)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const totalUsers = totalUsersRes.count ?? 0;
  const freeUsers = freeUsersRes.count ?? 0;
  const monthlyUsers = monthlyUsersRes.count ?? 0;
  const lifetimeUsers = lifetimeUsersRes.count ?? 0;
  const totalMemoriais = totalMemoriaisRes.count ?? 0;
  const totalMemorias = totalMemoriasRes.count ?? 0;
  const pendingMemorias = pendingMemoriasRes.count ?? 0;
  const totalViews = (totalViewsRes as { data: number }).data;
  const recentUsers: RecentUser[] = (recentUsersRes.data ?? []) as RecentUser[];
  const recentMemoriais: RecentMemorial[] = (recentMemoriaisRes.data ?? []) as unknown as RecentMemorial[];

  // Receita estimada (simples)
  const revenueEstimate = monthlyUsers * 29.9 + lifetimeUsers * 197.0;
  const paidUsers = monthlyUsers + lifetimeUsers;
  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">
          Métricas da plataforma em tempo real
        </p>
      </div>

      {/* Stats principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Usuários"
          value={formatCount(totalUsers)}
          sub={`${freeUsers} gratuitos · ${paidUsers} pagantes`}
          icon={Users}
        />
        <StatCard
          label="Memoriais Criados"
          value={formatCount(totalMemoriais)}
          sub={`${totalViews > 0 ? formatCount(totalViews) : "0"} visualizações`}
          icon={BookHeart}
        />
        <StatCard
          label="Memórias Enviadas"
          value={formatCount(totalMemorias)}
          sub={
            pendingMemorias > 0
              ? `${pendingMemorias} aguardando moderação`
              : "Todas moderadas"
          }
          icon={MessageSquareHeart}
        />
        <StatCard
          label="Receita Estimada"
          value={`R$ ${revenueEstimate.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub={`${conversionRate}% de conversão`}
          icon={CreditCard}
          accent
        />
      </div>

      {/* Planos breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/40 uppercase tracking-wide font-medium">
              Gratuito
            </p>
            <span className="text-xs text-white/30">{freeUsers}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-white/20"
              style={{
                width: totalUsers > 0 ? `${(freeUsers / totalUsers) * 100}%` : "0%",
              }}
            />
          </div>
          <p className="text-xs text-white/30 mt-2">
            {totalUsers > 0
              ? `${((freeUsers / totalUsers) * 100).toFixed(0)}% dos usuários`
              : "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-blue-400/70 uppercase tracking-wide font-medium">
              Mensal
            </p>
            <span className="text-xs text-white/30">{monthlyUsers}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-blue-400/60"
              style={{
                width: totalUsers > 0 ? `${(monthlyUsers / totalUsers) * 100}%` : "0%",
              }}
            />
          </div>
          <p className="text-xs text-white/30 mt-2">
            R$ {(monthlyUsers * 29.9).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}/mês
          </p>
        </div>

        <div className="rounded-2xl border border-amber-medium/20 bg-amber-medium/8 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-amber-light/70 uppercase tracking-wide font-medium">
              Eterno
            </p>
            <span className="text-xs text-white/30">{lifetimeUsers}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-amber-medium/70"
              style={{
                width: totalUsers > 0 ? `${(lifetimeUsers / totalUsers) * 100}%` : "0%",
              }}
            />
          </div>
          <p className="text-xs text-white/30 mt-2">
            R$ {(lifetimeUsers * 197).toLocaleString("pt-BR", { minimumFractionDigits: 0 })} acumulado
          </p>
        </div>
      </div>

      {/* Alertas */}
      {pendingMemorias > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-medium/30 bg-amber-medium/10 px-4 py-3">
          <AlertCircle size={16} className="text-amber-light flex-shrink-0" strokeWidth={1.5} />
          <p className="text-sm text-amber-light/80">
            <span className="font-semibold">{pendingMemorias}</span>{" "}
            {pendingMemorias === 1 ? "memória aguarda" : "memórias aguardam"} moderação.{" "}
            <a href="/admin/memorias" className="underline underline-offset-2 hover:text-amber-light transition-colors">
              Moderar agora →
            </a>
          </p>
        </div>
      )}

      {/* Tabelas recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuários recentes */}
        <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-white/40" strokeWidth={1.5} />
              <h2 className="text-sm font-medium text-white">Novos Usuários</h2>
            </div>
            <a
              href="/admin/usuarios"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Ver todos →
            </a>
          </div>
          <div className="divide-y divide-white/4">
            {recentUsers.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-white/20">
                Nenhum usuário ainda
              </p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-white/50">
                      {(u.name ?? u.email)[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">
                      {u.name ?? "—"}
                    </p>
                    <p className="text-xs text-white/30 truncate">{u.email}</p>
                  </div>
                  <PlanBadge plan={u.plan} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Memoriais recentes */}
        <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-white/40" strokeWidth={1.5} />
              <h2 className="text-sm font-medium text-white">Novos Memoriais</h2>
            </div>
            <a
              href="/admin/memoriais"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Ver todos →
            </a>
          </div>
          <div className="divide-y divide-white/4">
            {recentMemoriais.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-white/20">
                Nenhum memorial ainda
              </p>
            ) : (
              recentMemoriais.map((m) => (
                <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{m.name}</p>
                    <p className="text-xs text-white/30 truncate">
                      legadoid.com/{m.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PrivacyBadge privacy={m.privacy} />
                    <a
                      href={`/${m.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/20 hover:text-white/50 transition-colors"
                      title="Abrir memorial"
                    >
                      <Eye size={13} strokeWidth={1.5} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
