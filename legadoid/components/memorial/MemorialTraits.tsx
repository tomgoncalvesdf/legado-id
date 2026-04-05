import { Heart, Star } from "lucide-react";

interface MemorialTraitsProps {
  traits: string[];
  hobbies: string[];
}

function TagList({
  items,
  variant,
}: {
  items: string[];
  variant: "amber" | "stone";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={
            variant === "amber"
              ? "px-3.5 py-1.5 rounded-full bg-amber-soft text-amber-deep text-sm font-medium border border-amber-light/50"
              : "px-3.5 py-1.5 rounded-full bg-stone/8 text-stone/70 text-sm font-medium border border-stone/10"
          }
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function MemorialTraits({ traits, hobbies }: MemorialTraitsProps) {
  return (
    <section className="space-y-8">
      {traits.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-amber-medium" strokeWidth={1.5} />
            <h2 className="font-display text-xl font-semibold text-stone">
              Como era
            </h2>
          </div>
          <TagList items={traits} variant="amber" />
        </div>
      )}

      {hobbies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-medium" strokeWidth={1.5} />
            <h2 className="font-display text-xl font-semibold text-stone">
              O que amava
            </h2>
          </div>
          <TagList items={hobbies} variant="stone" />
        </div>
      )}
    </section>
  );
}
