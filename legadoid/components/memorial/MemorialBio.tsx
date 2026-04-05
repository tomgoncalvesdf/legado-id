import { Quote } from "lucide-react";

interface MemorialBioProps {
  bio?: string | null;
  quote?: string | null;
  name: string;
}

export function MemorialBio({ bio, quote, name }: MemorialBioProps) {
  return (
    <section className="space-y-8">
      {/* Biografia */}
      {bio && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-stone">
            Sobre {name.split(" ")[0]}
          </h2>
          <div className="prose prose-stone prose-sm max-w-none">
            {bio.split("\n").map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="text-stone/70 leading-relaxed text-base">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Citação favorita */}
      {quote && (
        <figure className="relative px-6 py-6 rounded-2xl bg-amber-soft/50 border border-amber-light/40">
          {/* Aspas decorativas */}
          <Quote
            size={32}
            className="absolute top-4 left-4 text-amber-medium/20"
            strokeWidth={1}
          />

          <blockquote className="relative z-10 pl-4">
            <p className="font-display text-xl sm:text-2xl font-medium text-stone/80 italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
            <figcaption className="mt-3 text-sm text-stone/40 font-medium">
              — {name}
            </figcaption>
          </blockquote>
        </figure>
      )}
    </section>
  );
}
