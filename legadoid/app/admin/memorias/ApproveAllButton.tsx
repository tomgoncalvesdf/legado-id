"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveAllGlobalAction } from "./actions";
import { CheckCircle2, Loader2 } from "lucide-react";

export function ApproveAllButton({ count }: { count: number }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (count === 0) return null;

  function handleClick() {
    if (!confirm(`Aprovar todas as ${count} memórias pendentes?`)) return;

    startTransition(async () => {
      const result = await approveAllGlobalAction();
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-all disabled:opacity-50"
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <CheckCircle2 size={14} strokeWidth={1.5} />
      )}
      Aprovar todas ({count})
    </button>
  );
}
