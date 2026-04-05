import { FormField } from "@/components/ui/form-field";
import type { MemorialDraft } from "@/app/criar/page";

interface StepBasicoProps {
  draft: MemorialDraft;
  onChange: (field: keyof MemorialDraft, value: string) => void;
  errors?: Record<string, string[]>;
}

const RELATION_OPTIONS = [
  "Mãe",
  "Pai",
  "Avó",
  "Avô",
  "Filho(a)",
  "Cônjuge / Parceiro(a)",
  "Irmão / Irmã",
  "Amigo(a)",
  "Outro",
];

export function StepBasico({ draft, onChange, errors = {} }: StepBasicoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-stone">
          Quem você quer homenagear?
        </h2>
        <p className="text-sm text-stone/50 mt-1">
          Essas são as informações principais que aparecerão no memorial.
        </p>
      </div>

      {/* Nome */}
      <FormField
        label="Nome completo *"
        name="name"
        type="text"
        placeholder="Ex: Maria Aparecida Silva"
        value={draft.name}
        onChange={(e) => onChange("name", e.target.value)}
        error={errors.name}
        autoFocus
      />

      {/* Relação */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone/80">
          Qual era sua relação com essa pessoa?
        </label>
        <select
          value={draft.relation}
          onChange={(e) => onChange("relation", e.target.value)}
          className="input-base"
        >
          <option value="">Selecione (opcional)</option>
          {RELATION_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.relation && (
          <p className="text-xs text-red-500">{errors.relation[0]}</p>
        )}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Data de nascimento"
          name="birth_date"
          type="date"
          value={draft.birth_date}
          onChange={(e) => onChange("birth_date", e.target.value)}
          error={errors.birth_date}
          hint="Opcional — aparece no cabeçalho do memorial"
        />

        <FormField
          label="Data de falecimento"
          name="death_date"
          type="date"
          value={draft.death_date}
          onChange={(e) => onChange("death_date", e.target.value)}
          error={errors.death_date}
        />
      </div>

      {/* Preview de lifespan */}
      {(draft.birth_date || draft.death_date) && (
        <div className="px-4 py-3 rounded-xl bg-amber-soft/50 border border-amber-soft">
          <p className="text-sm text-amber-deep font-medium">
            {draft.birth_date
              ? new Date(draft.birth_date + "T00:00:00").getFullYear()
              : "?"}{" "}
            —{" "}
            {draft.death_date
              ? new Date(draft.death_date + "T00:00:00").getFullYear()
              : "?"}
          </p>
          <p className="text-xs text-amber-deep/60 mt-0.5">
            É assim que as datas vão aparecer no memorial
          </p>
        </div>
      )}
    </div>
  );
}
