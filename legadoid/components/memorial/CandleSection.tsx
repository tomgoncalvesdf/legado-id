"use client";

import { useState, useTransition } from "react";
import { Flame, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface Candle {
  id: string;
  author_name: string | null;
  created_at: string;
}

interface CandleSectionProps {
  memorialId: string;
  memorialName: string;
  candles: Candle[];
  initialCount: number;
}

export function CandleSection({
  memorialId,
  memorialName,
  candles: initialCandles,
  initialCount,
}: CandleSectionProps) {
  const [candles, setCandles] = useState<Candle[]>(initialCandles);
  const [count, setCount] = useState(initialCount);
  const [authorName, setAuthorName] = useState("");
  const [lit, setLit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleLightCandle() {
    if (lit) return;
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("candles")
        .insert({
          memorial_id: memorialId,
          author_name: authorName.trim() || null,
        })
        .select("id, author_name, created_at")
        .single();

      if (dbError || !data) {
        setError("Não foi possível acender a vela. Tente novamente.");
        return;
      }

      // Incrementar contador no banco
      await supabase.rpc("increment_candle_count", { memorial_id: memorialId });

      setCandles((prev) => [data, ...prev]);
      setCount((c) => c + 1);
      setLit(true);
    });
  }

  return (
    <section className="card-base p-6 sm:p-8 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-amber-soft">
          <Flame size={20} className="text-amber-medium animate-candle-flicker" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-stone">
            Acenda uma vela
          </h2>
          <p className="text-sm text-stone/50 mt-0.5">
            {count} {count === 1 ? "pessoa acendeu" : "pessoas acenderam"} uma
            vela em memória de {memorialName.split(" ")[0]}
          </p>
        </div>
      </div>

      {/* Velas acesas (avatares) */}
      {candles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {candles.slice(0, 10).map((candle) => (
            <div
              key={candle.id}
              title={`${candle.author_name ?? "Anônimo"} — ${formatDate(candle.created_at)}`}
              className="w-9 h-9 rounded-full bg-amber-soft border-2 border-amber-light/60 flex items-center justify-center cursor-default"
            >
              <Flame size={15} className="text-amber-medium" strokeWidth={1.5} />
            </div>
          ))}
          {count > 10 && (
            <div className="w-9 h-9 rounded-full bg-stone/8 border-2 border-stone/10 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-stone/50">
                +{count - 10}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Formulário */}
      {!lit ? (
        <div className="space-y-3">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Seu nome (opcional)"
            maxLength={80}
            className="input-base"
            disabled={isPending}
          />

          {error && (
            <p role="alert" className="text-xs text-red-500">{error}</p>
          )}

          <button
            onClick={handleLightCandle}
            disabled={isPending}
            className="btn-primary flex items-center gap-2 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Acendendo…
              </>
            ) : (
              <>
                <Flame size={16} strokeWidth={1.5} />
                Acender vela
              </>
            )}
          </button>
        </div>
      ) : (
        // Estado após acender
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-soft/60 border border-amber-light/40">
          <div className="w-8 h-8 rounded-full bg-amber-medium flex items-center justify-center flex-shrink-0">
            <Check size={14} strokeWidth={2.5} className="text-white" />
          </div>
          <p className="text-sm text-amber-deep font-medium">
            Sua vela foi acesa. Que ela ilumine a memória de{" "}
            {memorialName.split(" ")[0]}.
          </p>
        </div>
      )}
    </section>
  );
}
