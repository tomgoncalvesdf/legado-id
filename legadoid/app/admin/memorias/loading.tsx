import { SkeletonMemoryCard, SkeletonPageHeader, Skeleton } from "@/components/ui/Skeleton";

export default function AdminMemoriasLoading() {
  return (
    <div className="space-y-6 animate-fade-up">
      <SkeletonPageHeader />
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm rounded-xl" />
        <Skeleton className="h-9 w-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonMemoryCard key={i} />
        ))}
      </div>
    </div>
  );
}
