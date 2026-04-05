"use client";

import { useState, useTransition } from "react";
import { MessageSquareHeart, Loader2, Check, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

interface MemoryPost {
  id: string;
  author_name: string | null;
  content: string;
  created_at: string;
  approved: boolean;
}

interface MemoryFeedProps {
  memorialId: string;
  memorialName: string;
  initialMemories: MemoryPost[];
}

// ─── Card de memória ──────────────────────────────────────────────────────────
function MemoryCard({ memory }: { memory: MemoryPost }) {
  return (
    <article className="card-base p-5 space-y-3">
      <div className="flex items-start gap-3">
        {/* Avatar placeholder */}
        <div className="w-9 h-9 rounded-full bg-stone/8 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-stone/30" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone truncate">
            {memory.author_name ?? "Visitante anônimo"}
          </p>
          <p className="text-xs text-stone/40">{formatDate(memory.created_at)}</p>
        </div>
      </div>
      <p className="text-sm text-stone/70 leading-relaxed pl-12">
        {memory.content}
      </p>
    </article>
  );
}

// ─── Formulário de nova memória ───────────────────────────────────────────────
function MemoryForm({
  memorialId,
  memorialName,
  onSubmitted,
}: {
  memorialId: string;
  memorialName: string;
  onSubmitted: () => void;
}) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const contentMax = 600;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) {
      setError("Escreva ao menos 10 caracteres.");
      return;
    }
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("memory_posts").insert({
        memorial_id: memorialId,
        author_name: authorName.trim() || null,
        content: content.trim(),
        approved: false, // requer moderação
      });

      if (dbError) {
        setError("Não foi possível enviar. Tente novamente.");
        return;
      }

      onSubmitted();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card-base p-5 space-y-4">
      <h3 className="font-semibold text-stone text-sm">
        Compartilhe uma memória sobre {memorialName.split(" ")[0]}
      </h3>

      <input
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Seu nome (opcional)"
        maxLength={80}
        className="input-base"
        disabled={isPending}
      />

      <div className="space-y-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Conte uma lembrança especial, um momento marcante ou uma mensagem de carinho…"
          maxLength={contentMax}
          rows={4}
          className="input-base resize-none leading-relaxed w-full"
          disabled={isPending}
          required
        />
        <p className="text-xs text-stone/30 text-right">
          {content.length}/{contentMax}
        </p>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-500">{error}</p>
      )}

      <p className="text-xs text-stone/40">
        As memórias são revisadas antes de aparecerem publicamente.
      </p>

      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="btn-primary flex items-center gap-2 disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <MessageSquareHeart size={15} strokeWidth={1.5} />
            Enviar memória
          </>
        )}
      </button>
    </form>
  );
}

// ─── Feed completo ────────────────────────────────────────────────────────────
export function MemoryFeed({
  memorialId,
  memorialName,
  initialMemories,
}: MemoryFeedProps) {
  const [memories] = useState<MemoryPost[]>(initialMemories);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2">
        <MessageSquareHeart
          size={20}
          className="text-amber-medium"
          strokeWidth={1.5}
        />
        <h2 className="font-display text-xl font-semibold text-stone">
          Memórias compartilhadas
        </h2>
      </div>

      {/* Estado após envio */}
      {submitted ? (
        <div className="card-base p-5 flex items-center gap-3 bg-amber-soft/40 border-amber-light/40">
          <div className="w-8 h-8 rounded-full bg-amber-medium flex items-center justify-center flex-shrink-0">
            <Check size={14} strokeWidth={2.5} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-deep">
              Memória enviada com sucesso!
            </p>
            <p className="text-xs text-amber-deep/60 mt-0.5">
              Ela aparecerá após revisão do responsável pelo memorial.
            </p>
          </div>
        </div>
      ) : (
        <MemoryForm
          memorialId={memorialId}
          memorialName={memorialName}
          onSubmitted={() => setSubmitted(true)}
        />
      )}

      {/* Lista de memórias */}
      {memories.length > 0 ? (
        <div className="space-y-4">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-stone/40">
            Seja o primeiro a compartilhar uma lembrança.
          </p>
        </div>
      )}
    </section>
  );
}
