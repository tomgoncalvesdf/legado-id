import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Barra de progresso */}
      <div className="flex items-center mb-6">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Círculo do passo */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                    isDone
                      ? "bg-amber-medium text-white"
                      : isActive
                      ? "bg-amber-soft border-2 border-amber-medium text-amber-deep"
                      : "bg-stone/8 border-2 border-stone/15 text-stone/30"
                  )}
                >
                  {isDone ? <Check size={14} strokeWidth={2.5} /> : index + 1}
                </div>
                {/* Label visível apenas no desktop */}
                <span
                  className={cn(
                    "hidden sm:block text-[11px] font-medium whitespace-nowrap transition-colors",
                    isActive ? "text-amber-deep" : isDone ? "text-stone/60" : "text-stone/30"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Linha conectora */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 rounded-full transition-all duration-500",
                    isDone ? "bg-amber-medium" : "bg-stone/10"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Descrição do passo atual */}
      <div className="text-center sm:text-left">
        <p className="sm:hidden text-xs font-medium text-amber-deep uppercase tracking-wider mb-0.5">
          Passo {currentStep + 1} de {steps.length}
        </p>
        <p className="text-sm text-stone/50">{steps[currentStep].description}</p>
      </div>
    </div>
  );
}
