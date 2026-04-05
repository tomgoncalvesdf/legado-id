import Link from "next/link";
import { BookHeart, MessageSquareHeart, Image as ImageIcon, Flame, Search } from "lucide-react";

// ─── Tipo base ────────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  compact?: boolean;
}

// ─── Componente base ──────────────────────────────────────────────────────────
export function EmptyState({
  icon: Icon = Flame,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-12 px-6" : "py-20 px-8"
      }`}
    >
      {/* Ícone com halo âmbar */}
      <div className="relative mb-5">
        <div
          className={`${
            compact ? "w-14 h-14" : "w-16 h-16"
          } rounded-2xl border border-amber-medium/15 bg-amber-medium/6 flex items-center justify-center`}
        >
          <Icon
            size={compact ? 22 : 26}
            strokeWidth={1}
            className="text-amber-medium/50"
          />
        </div>
        {/* Glow sutil */}
        <div className="absolute inset-0 rounded-2xl bg-amber-medium/5 blur-lg -z-10" />
      </div>

      {/* Texto */}
      <h3
        className={`font-medium text-white/60 mb-2 ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-white/30 leading-relaxed max-w-xs ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {description}
      </p>

      {/* Ações */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-6">
          {action && (
            action.href ? (
              <Link
                href={action.href}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-medium/15 border border-amber-medium/25 text-amber-light text-sm font-medium hover:bg-amber-medium/25 transition-all press-effect"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-medium/15 border border-amber-medium/25 text-amber-light text-sm font-medium hover:bg-amber-medium/25 transition-all press-effect"
              >
                {action.label}
              </button>
            )
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/8 text-white/40 text-sm hover:text-white/60 hover:bg-white/8 transition-all"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Empty states pré-configurados ───────────────────────────────────────────

/** Nenhum memorial criado */
export function EmptyMemoriais() {
  return (
    <EmptyState
      icon={BookHeart}
      title="Nenhum memorial ainda"
      description="Crie o primeiro memorial para honrar quem você ama e preservar suas memórias para sempre."
      action={{ label: "Criar memorial", href: "/criar" }}
    />
  );
}

/** Nenhuma memória enviada / aguardando */
export function EmptyMemorias({ isPending = false }: { isPending?: boolean }) {
  return (
    <EmptyState
      icon={MessageSquareHeart}
      title={isPending ? "Nenhuma memória pendente" : "Nenhuma memória ainda"}
      description={
        isPending
          ? "Ótimo! Todas as memórias enviadas já foram moderadas."
          : "Ainda não há memórias registradas neste memorial. Elas aparecerão aqui assim que forem enviadas."
      }
      compact={isPending}
    />
  );
}

/** Nenhuma foto */
export function EmptyFotos() {
  return (
    <EmptyState
      icon={ImageIcon}
      title="Nenhuma foto adicionada"
      description="Adicione fotos para criar uma galeria de memórias visuais deste memorial."
    />
  );
}

/** Resultado de busca vazio */
export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title={`Nenhum resultado para "${query}"`}
      description="Tente buscar com outros termos ou verifique a ortografia."
      compact
    />
  );
}
