import { redirect } from "next/navigation";
import Link from "next/link";
import {
  PlusCircle,
  BookHeart,
  Flame,
  Users,
  Eye,
  ArrowRight,
  Clock,
  MessageSquareHeart,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, getMemorialUrl } from "@/lib/utils";
import type { Memorial } from "@/types";

// ─── Componentes de UI inline ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color = "amber",
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color?: "amber" | "stone" | "green";
}) {
  const colorMap = {
    amber: "bg-amber-soft text-amber-deep",
    stone: "bg-stone/8 text-stone/70",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className="card-base p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-stone">{value}</p>
        <p className="text-xs text-stone/50 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function MemorialCard({ memorial }: { memorial: Memorial }) {
  const url = getMemorialUrl(memorial.slug);
  const statusLabel =
    memorial.status === "published" ? "Publicado" : "Rascunho";
  const statusColor =
    memorial.status === "published"
      ? "bg-green-100 text-green-700"
      : "bg-stone/10 text-stone/50";

  return (
    <div className="card-base p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-card-hover transition-shadow">
      {/* Capa / ícone */}
      <div className="w-14 h-14 rounded-xl bg-amber-soft flex items-center justify-center flex-shrink-0 overflow-hidden">
        {memorial.cover_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={memorial.cover_photo_url}
            alt={memorial.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Flame
            size={22}
            strokeWidth={1.5}
            className="text-amber-medium"
          />
        )}
      </div>

      {/* Dados */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-semibold text-stone truncate">{memorial.name}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-stone/50 mt-1 flex items-center gap-1">
          <Clock size={12} />
          Criado em {formatDate(memorial.created_at)}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-stone/40">
            <Eye size={12} /> {memorial.views_count ?? 0} visitas
          </span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {memorial.status === "published" && (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg border border-stone/15 text-stone/60 hover:text-stone hover:border-stone/30 transition-colors"
          >
            Ver página
          </Link>
        )}
        <Link
          href={`/painel/memoriais/${memorial.id}`}
          className="text-xs px-3 py-1.5 rounded-lg bg-amber-soft text-amber-deep font-medium hover:bg-amber-light/40 transition-colors"
        >
          Editar
        </Link>
      </div>
    </div>
  );
}

// ─── Estado vazio ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="card-base p-10 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-soft flex items-center justify-center">
        <BookHeart size={28} strokeWidth={1.5} className="text-amber-medium" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-stone">
          Nenhum memorial ainda
        </h3>
        <p className="text-sm text-stone/50 max-w-xs mx-auto">
          Crie o primeiro memorial e preserve memórias que durarão para sempre.
        </p>
      </div>
      <Link href="/criar" className="btn-primary inline-flex items-center gap-2">
        <PlusCircle size={16} />
        Criar meu primeiro memorial
      </Link>
    </div>
  );
}

// ─── Página (Server Component) ────────────────────────────────────────────────
export default async function PainelPage() {
  const supabase = createClient();

  // Usuário autenticado
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/entrar");

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from("users")
    .select("id, name, plan")
    .eq("auth_id", authUser.id)
    .single();

  if (!profile) redirect("/entrar");

  // Buscar memoriais do usuário
  const { data: memorials } = await supabase
    .from("memorials")
    .select("*")
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Contar memórias pendentes de moderação em todos os memoriais do usuário
  const memorialIds = (memorials ?? []).map((m) => m.id);
  let pendingMemoriesCount = 0;
  if (memorialIds.length > 0) {
    const { count } = await supabase
      .from("memory_posts")
      .select("*", { count: "exact", head: true })
      .in("memorial_id", memorialIds)
      .is("moderated_at", null);
    pendingMemoriesCount = count ?? 0;
  }

  const allMemorials = (memorials ?? []) as Memorial[];
  const published = allMemorials.filter((m) => m.status === "published");
  const totalViews = allMemorials.reduce(
    (acc, m) => acc + (m.views_count ?? 0),
    0
  );

  const firstName = profile.name?.split(" ")[0] ?? "você";

  return (
    <div className="space-y-8">
      {/* ── Saudação ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-stone">
          Olá, {firstName} 👋
        </h1>
        <p className="text-stone/50 mt-1 text-sm">
          Aqui está um resumo dos seus memoriais.
        </p>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total de memoriais"
          value={allMemorials.length}
          icon={BookHeart}
          color="amber"
        />
        <StatCard
          label="Publicados"
          value={published.length}
          icon={Flame}
          color="green"
        />
        <StatCard
          label="Visitas totais"
          value={totalViews.toLocaleString("pt-BR")}
          icon={Users}
          color="stone"
        />
      </div>

      {/* ── Aviso de memórias pendentes ─────────────────────────────────── */}
      {pendingMemoriesCount > 0 && (
        <div className="card-base p-4 flex items-center justify-between gap-3 border-amber-light/60 bg-amber-soft/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-soft">
              <MessageSquareHeart size={16} className="text-amber-medium" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-deep">
                {pendingMemoriesCount} {pendingMemoriesCount === 1 ? "memória aguarda" : "memórias aguardam"} moderação
              </p>
              <p className="text-xs text-amber-deep/60 mt-0.5">
                Aprove ou oculte as contribuições enviadas pelos visitantes.
              </p>
            </div>
          </div>
          <Link
            href={allMemorials.length === 1
              ? `/painel/memoriais/${allMemorials[0].id}/memorias`
              : "/painel/memoriais"
            }
            className="flex items-center gap-1 text-sm text-amber-deep font-medium hover:underline flex-shrink-0"
          >
            Revisar <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ── CTA criar (se não houver memorials) ou botão rápido ────────── */}
      {allMemorials.length > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone">Seus memoriais</h2>
          <Link
            href="/criar"
            className="flex items-center gap-1.5 text-sm text-amber-medium hover:text-amber-deep font-medium transition-colors"
          >
            <PlusCircle size={15} />
            Novo memorial
          </Link>
        </div>
      )}

      {/* ── Lista de memoriais ─────────────────────────────────────────── */}
      {allMemorials.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {allMemorials.map((memorial) => (
            <MemorialCard key={memorial.id} memorial={memorial} />
          ))}

          {allMemorials.length >= 10 && (
            <Link
              href="/painel/memoriais"
              className="flex items-center justify-center gap-1.5 py-3 text-sm text-amber-medium hover:text-amber-deep font-medium transition-colors"
            >
              Ver todos os memoriais <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}

      {/* ── Plano atual ───────────────────────────────────────────────── */}
      <div className="card-base p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-stone to-stone/90 text-sand">
        <div>
          <p className="text-xs text-sand/50 uppercase tracking-wider mb-1">
            Seu plano
          </p>
          <p className="font-display text-xl font-semibold">
            {profile.plan === "lifetime"
              ? "Legado Eterno ✦"
              : profile.plan === "monthly"
              ? "Legado Mensal"
              : "Gratuito"}
          </p>
          {profile.plan === "free" && (
            <p className="text-xs text-sand/50 mt-0.5">
              Upgrade para desbloquear todos os recursos
            </p>
          )}
        </div>

        {profile.plan === "free" && (
          <Link
            href="/precos"
            className="btn-primary text-sm flex-shrink-0 flex items-center gap-1.5"
          >
            Fazer upgrade <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
