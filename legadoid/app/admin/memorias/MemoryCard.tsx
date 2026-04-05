"use client";

import { useState, useTransition } from "react";
import { approveMemoryAction, rejectMemoryAction, deleteMemoryAction } from "./actions";
import { CheckCircle2, XCircle, Trash2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Memory {
  id: string;
  author_name: string;
  content: string;
  relation: string | null;
  created_at: string;
  approved: boolean | null;
  moderated_at: string | null;
  memorial: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

function StatusBadge({ approved, moderatedAt }: { approved: boolean | null; moderatedAt: string | null }) {
  if (moderatedAt === null) {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border border-amber-medium/30 bg-amber-medium/10 text-amber-light">
        Pendente
      </span>
    );
  }
  if (approved) {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
        Aprovada
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border border-red-400/30 bg-red-400/10 text-red-400">
      Rejeitada
    </span>
  );
}

export function MemoryCard({ memory }: { memory: Memory }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ approved: boolean | null; moderatedAt: string | null }>({
    approved: memory.approved,
    moderatedAt: memory.moderated_at,
  });
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (deleted) return null;

  function handleApprove() {
    startTransition(async () => {
      const result = await approveMemoryAction(memory.id);
      if (result.success) {
        setStatus({ approved: true, moderatedAt: new Date().toISOString() });
      } else {
        setError(result.error ?? "Erro");
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectMemoryAction(memory.id);
      if (result.success) {
        setStatus({ approved: false, moderatedAt: new Date().toISOString() });
      } else {
        setError(result.error ?? "Erro");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Excluir esta memória permanentemente?")) return;
    startTransition(async () => {
      const result = await deleteMemoryAction(memory.id);
      if (result.success) {
        setDeleted(true);
      } else {
        setError(result.error ?? "Erro ao excluir");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-white/80">{memory.author_name}</p>
            {memory.relation && (
              <span className="text-xs text-white/30">{memory.relation}</span>
            )}
            <StatusBadge approved={status.approved} moderatedAt={status.moderatedAt} />
          </div>
          {memory.memorial && (
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-xs text-white/25">Memorial:</p>
              <Link
                href={`/${memory.memorial.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-0.5"
              >
                {memory.memorial.name}
                <ExternalLink size={10} strokeWidth={1.5} />
              </Link>
            </div>
          )}
        </div>
        <p className="text-xs text-white/25 flex-shrink-0">
          {new Date(memory.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          })}
        </p>
      </div>

      {/* Conteúdo */}
      <p className="text-sm text-white/60 leading-relaxed line-clamp-4">{memory.content}</p>

      {/* Ações */}
      <div className="flex items-center gap-2 pt-1">
        {pending ? (
          <Loader2 size={14} className="animate-spin text-white/30" />
        ) : (
          <>
            <button
              onClick={handleApprove}
              disabled={status.approved === true}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-emerald-400 hover:bg-emerald-400/10"
            >
              <CheckCircle2 size={13} strokeWidth={1.5} />
              Aprovar
            </button>
            <button
              onClick={handleReject}
              disabled={status.approved === false && status.moderatedAt !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-red-400 hover:bg-red-400/10"
            >
              <XCircle size={13} strokeWidth={1.5} />
              Rejeitar
            </button>
            <button
              onClick={handleDelete}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Excluir
            </button>
          </>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}
