import { SkeletonMemoryCard, SkeletonPageHeader, Skeleton } from "@/components/ui/Skeleton";

export default function MemoriasLoading() {
  return (
    <div className="space-y-6 animate-fade-up">
      <SkeletonPageHeader />
      {/* Filter tabs */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMemoryCard key={i} />
        ))}
      </div>
    </div>
  );
}
