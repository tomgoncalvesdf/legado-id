"use client";

import { useState, useTransition } from "react";
import { toggleMemorialPublishedAction, deleteMemorialAdminAction } from "./actions";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";

interface Memorial {
  id: string;
  name: string;
  published: boolean;
}

export function MemorialActions({ memorial }: { memorial: Memorial }) {
  const [pending, startTransition] = useTransition();
  const [isPublished, setIsPublished] = useState(memorial.published);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (deleted) return null;

  function handleTogglePublished() {
    const newValue = !isPublished;
    setIsPublished(newValue);
    setError(null);

    startTransition(async () => {
      const result = await toggleMemorialPublishedAction(memorial.id, newValue);
      if (!result.success) {
        setIsPublished(!newValue);
        setError(result.error ?? "Erro");
      }
    });
  }

  function handleDelete() {
    if (
      !confirm(
        `Tem certeza que deseja excluir permanentemente o memorial "${memorial.name}"? Esta ação não pode ser desfeita.`
      )
    )
      return;

    startTransition(async () => {
      const result = await deleteMemorialAdminAction(memorial.id);
      if (result.success) {
        setDeleted(true);
      } else {
        setError(result.error ?? "Erro ao excluir");
      }
    });
  }

  return (
    <div className="flex items-center gap-1" title={error ?? ""}>
      {pending && (
        <Loader2 size={12} className="animate-spin text-white/40" />
      )}

      <button
        onClick={handleTogglePublished}
        disabled={pending}
        className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${
          isPublished
            ? "text-emerald-400 hover:bg-emerald-400/10"
            : "text-white/20 hover:text-white/50 hover:bg-white/8"
        }`}
        title={isPublished ? "Despublicar" : "Publicar"}
      >
        {isPublished ? (
          <Eye size={13} strokeWidth={1.5} />
        ) : (
          <EyeOff size={13} strokeWidth={1.5} />
        )}
      </button>

      <button
        onClick={handleDelete}
        disabled={pending}
        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50"
        title="Excluir memorial"
      >
        <Trash2 size={13} strokeWidth={1.5} />
      </button>
    </div>
  );
}
