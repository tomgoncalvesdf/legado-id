"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string[];
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    const hasError = error && error.length > 0;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-stone/80"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={fieldId}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={
            hasError ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
          }
          className={cn(
            "input-base",
            hasError && "border-red-400 focus:ring-red-400/30 focus:border-red-400",
            className
          )}
          {...props}
        />

        {hasError ? (
          <p
            id={`${fieldId}-error`}
            role="alert"
            className="text-xs text-red-500"
          >
            {error[0]}
          </p>
        ) : hint ? (
          <p id={`${fieldId}-hint`} className="text-xs text-stone/50">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = "FormField";
