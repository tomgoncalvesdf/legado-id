"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatLifespan, calcAge, getMemorialShareText } from "@/lib/utils";
import type { Memorial } from "@/types";

interface MemorialHeroProps {
  memorial: Memorial;
  candleCount: number;
}

// ─── Botão de compartilhar ────────────────────────────────────────────────────
function ShareButton({ memorial }: { memorial: Memorial }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/${memorial.slug}`;
    const text = getMemorialShareText(memorial.name, memorial.slug);

    if (navigator.share) {
      await navigator.share({ title: `Memorial de ${memorial.name}`, text, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors"
    >
      {copied ? (
        <>
          <Check size={15} strokeWidth={2.5} />
          Link copiado!
        </>
      ) : (
        <>
          <Share2 size={15} strokeWidth={1.5} />
          Compartilhar
        </>
      )}
    </button>
  );
}

// ─── Hero principal ───────────────────────────────────────────────────────────
export function MemorialHero({ memorial, candleCount }: MemorialHeroProps) {
  const lifespan = formatLifespan(memorial.birth_date ?? undefined, memorial.death_date ?? undefined);
  const age = memorial.birth_date ? calcAge(memorial.birth_date, memorial.death_date ?? undefined) : null;

  return (
    <section className="relative overflow-hidden">
      {/* Fundo: foto de capa ou gradiente padrão */}
      <div className="absolute inset-0">
        {memorial.cover_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={memorial.cover_photo_url}
            alt={`Foto de capa do memorial de ${memorial.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          // Gradiente Éter como fallback
          <div className="w-full h-full bg-gradient-to-br from-stone via-stone/90 to-stone/80" />
        )}
        {/* Overlay escuro para legibilidade */}
        <div className="memorial-cover-overlay" />
      </div>

      {/* Barra de navegação mínima */}
      <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <Flame size={18} strokeWidth={1.5} className="text-amber-light" />
          <span className="font-display text-base font-medium tracking-wide hidden sm:block">
            Legado ID
          </span>
        </Link>

        <ShareButton memorial={memorial} />
      </div>

      {/* Conteúdo principal do hero */}
      <div className="relative z-10 px-5 sm:px-8 pb-10 pt-6 sm:pt-8 max-w-3xl mx-auto">
        {/* Tag de relação */}
        {memorial.relation && (
          <span className="inline-block px-3 py-1 rounded-full bg-white/12 border border-white/20 text-white/70 text-xs font-medium mb-4 backdrop-blur-sm">
            {memorial.relation}
          </span>
        )}

        {/* Nome */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
          {memorial.name}
        </h1>

        {/* Datas e idade */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {lifespan && (
            <p className="text-white/70 text-base font-light tracking-wide">
              {lifespan}
            </p>
          )}
          {age !== null && (
            <span className="text-white/40 text-sm hidden sm:block">·</span>
          )}
          {age !== null && (
            <p className="text-white/55 text-sm">
              {age} {age === 1 ? "ano" : "anos"} de vida
            </p>
          )}
        </div>

        {/* Contador de velas */}
        <div className="mt-6 flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/12 backdrop-blur-sm border border-white/15 text-white text-sm">
            <Flame
              size={16}
              strokeWidth={1.5}
              className="text-amber-light animate-candle-flicker"
            />
            <span className="font-medium">{candleCount}</span>
            <span className="text-white/60">
              {candleCount === 1 ? "vela acesa" : "velas acesas"}
            </span>
          </div>
        </div>
      </div>

      {/* Borda inferior suave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-mist z-10" />
    </section>
  );
}
