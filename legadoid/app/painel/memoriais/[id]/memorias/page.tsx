"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquareHeart,
  Loader2,
  Filter,
  CheckCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  approveMemoryAction,
  rejectMemoryAction,
  deleteMemoryAction,
  approveAllPendingAction,
} from "./actions";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type MemoryStatus = "pending" | "approved" | "rejected";

interface Memory {
  id: string;
  author_name: string | null;
  content: string;
  created_at: string;
  moderated_at: string | null;
  approved: boolean;
}

function getStatus(m: Memory): MemoryStatus {
  if (m.moderated_at === null) return "pending";
  return m.approved ? "approved" : "rejected";
}

// ─── Badge de status ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: MemoryStatus }) {
  const map = {
    pending: {
      icon: Clock,
      label: "Pendente",
      cls: "bg-amber-soft text-amber-deep",
    },
    approved: {
      icon: CheckCircle2,
      label: "Aprovada",
      cls: "bg-green-50 text-green-700",
    },
    rejected: {
      icon: XCircle,
      label: "Ocultada",
      cls: "bg-stone/10 text-stone/50",
    },
  };
  const { icon: Icon, label, cls } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        cls
      )}
    >
      <Icon size={11} strokeWidth={2} />
      {label}
    </span>
  );
}

// ─── Card de memória com ações ────────────────────────────────────────────────
function MemoryCard({
  memory,
  memorialId,
  onUpdate,
}: {
  memory: Memory;
  memorialId: string;
  onUpdate: (id: string, update: Partial<Memory>) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const status = getStatus(memory);

  async function handle(
    action: () => Promise<{ error?: string; success?: string | boolean }>
  ) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
      } else if (typeof result.success === "string") {
        toast.success(result.success);
      } else {
        toast.success("Ação realizada com sucesso.");
      }
    });
  }

  return (
    <article
      className={cn(
        "card-base p-5 space-y-3 transition-all duration-200",
        status === "rejected" && "opacity-60",
        isPending && "pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-stone">
              {memory.author_name ?? "Visitante anônimo"}
            </p>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-stone/40 mt-0.5">
            {formatDate(memory.created_at)}
            {memory.moderated_at && status !== "pending" && (
              <> · moderado em {formatDate(memory.moderated_at)}</>
            )}
          </p>
        </div>

        {isPending && (
          <Loader2 size={16} className="animate-spin text-stone/40 flex-shrink-0 mt-0.5" />
        )}
      </div>

      {/* Conteúdo */}
      <p className="text-sm text-stone/70 leading-relaxed">{memory.content}</p>

      {/* Ações */}
      <div className="flex items-center gap-2 pt-1">
        {status !== "approved" && (
          <button
            onClick={() =>
              handle(async () => {
                const r = await approveMemoryAction(memorialId, memory.id);
                if (!r.error)
                  onUpdate(memory.id, {
                    approved: true,
                    moderated_at: new Date().toISOString(),
                  });
                return r;
              })
            }
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
          >
            <Check size={13} strokeWidth={2.5} />
            Aprovar
          </button>
        )}

        {status !== "rejected" && (
          <button
            onClick={() =>
              handle(async () => {
                const r = await rejectMemoryAction(memorialId, memory.id);
                if (!r.error)
                  onUpdate(memory.id, {
                    approved: false,
                    moderated_at: new Date().toISOString(),
                  });
                return r;
              })
            }
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone/8 text-stone/60 text-xs font-medium hover:bg-stone/12 transition-colors"
          >
            <X size={13} strokeWidth={2.5} />
            Ocultar
          </button>
        )}

        <button
          onClick={() => {
            if (!confirm("Excluir permanentemente esta memória?")) return;
            handle(async () => {
              const r = await deleteMemoryAction(memorialId, memory.id);
              if (!r.error) onUpdate(memory.id, { id: "__deleted__" });
              return r;
            });
          }}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-500 text-xs font-medium hover:bg-red-50 transition-colors ml-auto"
        >
          <Trash2 size={13} strokeWidth={1.5} />
          Excluir
        </button>
      </div>
    </article>
  );
}

// ─── Filtro por status ────────────────────────────────────────────────────────
type FilterTab = "all" | "pending" | "approved" | "rejected";

function FilterTabs({
  active,
  counts,
  onChange,
}: {
  active: FilterTab;
  counts: Record<FilterTab, number>;
  onChange: (t: FilterTab) => void;
}) {
  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "pending", label: "Pendentes" },
    { key: "approved", label: "Aprovadas" },
    { key: "rejected", label: "Ocultadas" },
  ];

  return (
    <div className="flex gap-1 p-1 bg-stone/6 rounded-xl w-fit">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5",
            active === key
              ? "bg-white text-stone shadow-sm"
              : "text-stone/50 hover:text-stone/80"
          )}
        >
          {label}
          {counts[key] > 0 && (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                active === key
                  ? key === "pending"
                    ? "bg-amber-soft text-amber-deep"
                    : "bg-stone/10 text-stone/60"
                  : "bg-stone/10 text-stone/40"
              )}
            >
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function MemoriasPage({ params }: { params: { id: string } }) {
  const memorialId = params.id;
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("pending");
  const [isApprovingAll, startApprovingAll] = useTransition();

  async function loadMemories() {
    const supabase = createClient();
    const { data } = await supabase
      .from("memory_posts")
      .select("id, author_name, content, created_at, moderated_at, approved")
      .eq("memorial_id", memorialId)
      .order("created_at", { ascending: false });

    setMemories((data ?? []) as Memory[]);
    setLoading(false);
  }

  useEffect(() => {
    loadMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpdate(id: string, update: Partial<Memory>) {
    if (update.id === "__deleted__") {
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } else {
      setMemories((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...update } : m))
      );
    }
  }

  // Contagens
  const counts: Record<FilterTab, number> = {
    all: memories.length,
    pending: memories.filter((m) => getStatus(m) === "pending").length,
    approved: memories.filter((m) => getStatus(m) === "approved").length,
    rejected: memories.filter((m) => getStatus(m) === "rejected").length,
  };

  const filtered = memories.filter((m) =>
    filter === "all" ? true : getStatus(m) === filter
  );

  async function handleApproveAll() {
    startApprovingAll(async () => {
      const result = await approveAllPendingAction(memorialId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setMemories((prev) =>
          prev.map((m) =>
            getStatus(m) === "pending"
              ? { ...m, approved: true, moderated_at: new Date().toISOString() }
              : m
          )
        );
      }
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <Link
          href={`/painel/memoriais/${memorialId}`}
          className="inline-flex items-center gap-1.5 text-sm text-stone/50 hover:text-stone transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Voltar ao memorial
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-stone">
              Memórias
            </h1>
            <p className="text-sm text-stone/50 mt-1">
              Revise e modere as contribuições enviadas pelos visitantes.
            </p>
          </div>

          {/* Aprovar todas */}
          {counts.pending > 0 && (
            <button
              onClick={handleApproveAll}
              disabled={isApprovingAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors flex-shrink-0 disabled:opacity-60"
            >
              {isApprovingAll ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCheck size={15} strokeWidth={2} />
              )}
              Aprovar todas ({counts.pending})
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <FilterTabs active={filter} counts={counts} onChange={setFilter} />

      {/* Lista */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-base p-5 space-y-3">
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-4/5 rounded" />
              <div className="flex gap-2">
                <div className="skeleton h-7 w-20 rounded-lg" />
                <div className="skeleton h-7 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-stone/8 flex items-center justify-center mx-auto">
            <MessageSquareHeart
              size={24}
              className="text-stone/25"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-sm text-stone/40">
            {filter === "pending"
              ? "Nenhuma memória aguardando aprovação."
              : filter === "approved"
              ? "Nenhuma memória aprovada ainda."
              : filter === "rejected"
              ? "Nenhuma memória ocultada."
              : "Nenhuma memória ainda."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              memorialId={memorialId}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Dica de moderação */}
      {memories.length > 0 && (
        <p className="text-xs text-stone/35 text-center pb-4">
          Apenas memórias aprovadas aparecem na página pública do memorial.
        </p>
      )}
    </div>
  );
}
