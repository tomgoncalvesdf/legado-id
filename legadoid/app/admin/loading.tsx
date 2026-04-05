import { SkeletonStatCard, SkeletonTable, SkeletonPageHeader } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      <SkeletonPageHeader />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/8 bg-white/4 p-5 space-y-3 animate-pulse">
            <div className="h-3 w-20 rounded-full bg-white/8" />
            <div className="h-1.5 rounded-full bg-white/8" />
            <div className="h-3 w-28 rounded-full bg-white/6" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonTable rows={5} cols={3} />
        <SkeletonTable rows={5} cols={3} />
      </div>
    </div>
  );
}
