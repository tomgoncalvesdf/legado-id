import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ImageIcon,
  Globe,
  Lock,
  Flame,
  Eye,
  ExternalLink,
  Settings,
  BookOpen,
  Clock,
  MessageSquareHeart,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, getMemorialUrl } from "@/lib/utils";
import { publishMemorialAction } from "@/app/criar/actions";
import type { Memorial } from "@/types";

// ─── Card de módulo/ação ──────────────────────────────────────────────────────
function ModuleCard({
  href,
  icon: Icon,
  title,
  description,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="card-base p-5 flex items-start gap-4 hover:shadow-card-hover transition-all duration-200 group"
    >
      <div className="p-2.5 rounded-xl bg-amber-soft group-hover:bg-amber-light/50 transition-colors flex-shrink-0">
        <Icon size={20} className="text-amber-medium" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-stone text-sm">{title}</p>
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-soft text-amber-deep">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-stone/50 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="text-stone/20 group-hover:text-amber-medium transition-colors flex-shrink-0 self-center">
        <ExternalLink size={14} />
      </div>
    </Link>
  );
}

// ─── Página (Server Component) ────────────────────────────────────────────────
export default async function MemorialEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // Usuário autenticado
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/entrar");

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", authUser.id)
    .single();
  if (!profile) redirect("/entrar");

  // Buscar memorial (verificar propriedade)
  const { data: memorial } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", params.id)
    .eq("owner_id", profile.id)
    .single();

  if (!memorial) notFound();

  const m = memorial as Memorial;
  const isPublished = m.status === "published";
  const memorialUrl = getMemorialUrl(m.slug);

  return (
    <div className="space-y-8 max-w-2xl animate-fade-up">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-stone/10 text-stone/50"
              }`}
            >
              {isPublished ? "● Publicado" : "● Rascunho"}
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-stone leading-tight">
            {m.name}
          </h1>
          <p className="text-sm text-stone/50 mt-1 flex items-center gap-1.5">
            <Clock size={13} />
            Criado em {formatDate(m.created_at)}
          </p>
        </div>

        {/* Ver página */}
        {isPublished && (
          <Link
            href={memorialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-1.5 flex-shrink-0 text-sm"
          >
            <Eye size={15} />
            Ver página
          </Link>
        )}
      </div>

      {/* CTA de publicação */}
      {!isPublished && (
        <div className="card-base p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-soft/40 border-amber-light/50">
          <div>
            <p className="font-semibold text-amber-deep text-sm">
              Memorial em rascunho
            </p>
            <p className="text-xs text-amber-deep/60 mt-0.5">
              Publique para compartilhar com a família e amigos.
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await publishMemorialAction(params.id);
            }}
          >
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <Globe size={15} />
              Publicar agora
            </button>
          </form>
        </div>
      )}

      {/* Link do memorial */}
      <div className="px-4 py-3 rounded-xl bg-stone/5 border border-stone/10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-stone/40 mb-0.5">Link do memorial</p>
          <p className="text-sm font-medium text-stone truncate">
            legadoid.com/
            <span className="text-amber-medium">{m.slug}</span>
          </p>
        </div>
        <Link
          href={memorialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-stone/40 hover:text-stone hover:bg-stone/8 transition-colors flex-shrink-0"
        >
          <ExternalLink size={15} />
        </Link>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Visitas", value: m.views_count ?? 0, icon: Eye },
          { label: "Velas", value: m.candles_count ?? 0, icon: Flame },
          { label: "Memórias", value: m.memories_count ?? 0, icon: BookOpen },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card-base p-4 text-center space-y-1">
            <Icon size={16} className="text-amber-medium mx-auto" strokeWidth={1.5} />
            <p className="text-xl font-semibold text-stone">{value}</p>
            <p className="text-xs text-stone/40">{label}</p>
          </div>
        ))}
      </div>

      {/* Módulos de edição */}
      <div className="space-y-3">
        <h2 className="font-semibold text-stone text-sm">Personalizar memorial</h2>

        <div className="space-y-2">
          <ModuleCard
            href={`/painel/memoriais/${params.id}/fotos`}
            icon={ImageIcon}
            title="Galeria de fotos"
            description="Adicione e organize as fotos que vão compor o memorial."
            badge={m.photos_count ? `${m.photos_count} fotos` : undefined}
          />
          <ModuleCard
            href={`/painel/memoriais/${params.id}/memorias`}
            icon={MessageSquareHeart}
            title="Memórias e contribuições"
            description="Revise e modere as memórias enviadas pelos visitantes."
            badge={
              (m.memories_count ?? 0) > 0
                ? `${m.memories_count} memórias`
                : undefined
            }
          />
          <ModuleCard
            href={`/painel/memoriais/${params.id}/privacidade`}
            icon={isPublished ? Globe : Lock}
            title="Privacidade e acesso"
            description="Controle quem pode visualizar este memorial."
          />
          <ModuleCard
            href={`/painel/memoriais/${params.id}/configuracoes`}
            icon={Settings}
            title="Informações e configurações"
            description="Edite nome, datas, biografia e link do memorial."
          />
        </div>
      </div>
    </div>
  );
}
