"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemorialDraft } from "@/app/criar/page";

interface StepHistoriaProps {
  draft: MemorialDraft;
  onChange: (field: keyof MemorialDraft, value: string) => void;
  errors?: Record<string, string[]>;
}

// ─── Tag input simples ────────────────────────────────────────────────────────
function TagInput({
  label,
  placeholder,
  suggestions,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  suggestions: string[];
  value: string; // CSV
  onChange: (csv: string) => void;
}) {
  const tags = value ? value.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const [inputVal, setInputVal] = useState("");

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 10) return;
    onChange([...tags, trimmed].join(", "));
    setInputVal("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag).join(", "));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  const unusedSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-stone/80">{label}</label>

      {/* Campo + tags selecionadas */}
      <div className="min-h-[44px] px-3 py-2 rounded-xl border border-stone/15 bg-white flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-amber-medium/30 focus-within:border-amber-medium transition-colors">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-soft text-amber-deep text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-amber-deep/60 hover:text-amber-deep transition-colors"
              aria-label={`Remover ${tag}`}
            >
              <X size={10} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputVal) addTag(inputVal); }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] text-sm text-stone outline-none bg-transparent placeholder:text-stone/30"
        />
      </div>

      <p className="text-xs text-stone/40">
        Pressione Enter ou vírgula para adicionar. Máximo 10 itens.
      </p>

      {/* Sugestões rápidas */}
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unusedSuggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-stone/15 text-xs text-stone/50 hover:border-amber-medium/50 hover:text-amber-deep hover:bg-amber-soft/30 transition-all"
            >
              <Plus size={10} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Página do step ───────────────────────────────────────────────────────────
const PERSONALITY_SUGGESTIONS = [
  "Amoroso(a)",
  "Generoso(a)",
  "Engraçado(a)",
  "Dedicado(a)",
  "Corajoso(a)",
  "Paciente",
  "Criativo(a)",
  "Protetor(a)",
  "Sábio(a)",
  "Alegre",
  "Determinado(a)",
  "Carinhoso(a)",
];

const HOBBIES_SUGGESTIONS = [
  "Cozinhar",
  "Jardinagem",
  "Música",
  "Leitura",
  "Viagens",
  "Pesca",
  "Costura",
  "Fotografia",
  "Esportes",
  "Pintura",
  "Cinema",
  "Dança",
];

export function StepHistoria({ draft, onChange, errors = {} }: StepHistoriaProps) {
  const bioLength = draft.bio?.length ?? 0;
  const bioMax = 2000;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-stone">
          Conte a história dessa pessoa
        </h2>
        <p className="text-sm text-stone/50 mt-1">
          Esses detalhes tornam o memorial único e especial. Tudo é opcional.
        </p>
      </div>

      {/* Biografia */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-stone/80">
            Biografia / história de vida
          </label>
          <span
            className={cn(
              "text-xs transition-colors",
              bioLength > bioMax * 0.9 ? "text-red-500" : "text-stone/30"
            )}
          >
            {bioLength}/{bioMax}
          </span>
        </div>
        <textarea
          name="bio"
          value={draft.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          maxLength={bioMax}
          rows={5}
          placeholder="Conte sobre a vida, conquistas, momentos marcantes e o legado deixado por essa pessoa..."
          className={cn(
            "input-base resize-none leading-relaxed",
            errors.bio && "border-red-400 focus:ring-red-400/30"
          )}
        />
        {errors.bio && (
          <p className="text-xs text-red-500">{errors.bio[0]}</p>
        )}
      </div>

      {/* Personalidade */}
      <TagInput
        label="Traços de personalidade"
        placeholder="Ex: Generoso(a), Amoroso(a)…"
        suggestions={PERSONALITY_SUGGESTIONS}
        value={draft.personality_traits}
        onChange={(v) => onChange("personality_traits", v)}
      />

      {/* Hobbies */}
      <TagInput
        label="Hobbies e paixões"
        placeholder="Ex: Cozinhar, Jardinagem…"
        suggestions={HOBBIES_SUGGESTIONS}
        value={draft.hobbies}
        onChange={(v) => onChange("hobbies", v)}
      />

      {/* Citação favorita */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone/80">
          Citação ou frase favorita
        </label>
        <input
          type="text"
          name="favorite_quote"
          value={draft.favorite_quote}
          onChange={(e) => onChange("favorite_quote", e.target.value)}
          maxLength={300}
          placeholder='"Uma vida vivida com amor nunca é esquecida."'
          className="input-base"
        />
        <p className="text-xs text-stone/40">
          Aparecerá em destaque na página do memorial.
        </p>
      </div>
    </div>
  );
}
