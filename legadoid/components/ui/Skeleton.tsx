// ─── Primitivo base ───────────────────────────────────────────────────────────
export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/6 ${className}`}
      {...props}
    />
  );
}

// ─── Skeletons compostos ──────────────────────────────────────────────────────

/** Linha de texto genérica */
export function SkeletonText({ width = "100%" }: { width?: string }) {
  return (
    <Skeleton className="h-3.5 rounded-full" style={{ width }} />
  );
}

/** Card de memorial no painel */
export function SkeletonMemorialCard() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonText width="60%" />
          <SkeletonText width="40%" />
        </div>
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonText width="100%" />
        <SkeletonText width="80%" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

/** Stat card do dashboard */
export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5 flex items-start gap-4">
      <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <SkeletonText width="50%" />
        <Skeleton className="h-7 w-20 rounded-lg" />
        <SkeletonText width="70%" />
      </div>
    </div>
  );
}

/** Linha de tabela */
export function SkeletonTableRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-3.5 rounded-full" style={{ width: `${60 + (i % 3) * 15}%` }} />
        </td>
      ))}
    </tr>
  );
}

/** Tabela inteira */
export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden">
      <div className="h-10 bg-white/4 border-b border-white/8" />
      <table className="w-full">
        <tbody className="divide-y divide-white/4">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Card de memória (moderação) */
export function SkeletonMemoryCard() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <SkeletonText width="30%" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonText width="100%" />
        <SkeletonText width="90%" />
        <SkeletonText width="70%" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="ml-auto h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

/** Header de página do painel */
export function SkeletonPageHeader() {
  return (
    <div className="space-y-2 mb-6">
      <Skeleton className="h-6 w-48 rounded-lg" />
      <SkeletonText width="200px" />
    </div>
  );
}
