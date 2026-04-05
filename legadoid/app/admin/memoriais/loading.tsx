import { SkeletonTable, SkeletonPageHeader, Skeleton } from "@/components/ui/Skeleton";

export default function AdminMemoriaisLoading() {
  return (
    <div className="space-y-6 animate-fade-up">
      <SkeletonPageHeader />
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm rounded-xl" />
        <Skeleton className="h-9 w-52 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>
      <SkeletonTable rows={8} cols={7} />
    </div>
  );
}
