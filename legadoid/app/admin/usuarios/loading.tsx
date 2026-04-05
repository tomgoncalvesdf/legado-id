import { SkeletonTable, SkeletonPageHeader } from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UsuariosLoading() {
  return (
    <div className="space-y-6 animate-fade-up">
      <SkeletonPageHeader />
      {/* Filter bar */}
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm rounded-xl" />
        <Skeleton className="h-9 w-56 rounded-xl" />
      </div>
      <SkeletonTable rows={8} cols={5} />
    </div>
  );
}
