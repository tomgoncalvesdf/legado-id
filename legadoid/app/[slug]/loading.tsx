export default function MemorialLoading() {
  return (
    <div className="min-h-screen bg-mist animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-72 sm:h-96 bg-stone/10">
        <div className="absolute inset-0 bg-gradient-to-t from-stone/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 space-y-3">
          <div className="skeleton h-10 w-64 rounded-lg" />
          <div className="skeleton h-5 w-40 rounded" />
          <div className="flex gap-3 mt-4">
            <div className="skeleton h-10 w-32 rounded-xl" />
            <div className="skeleton h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Corpo */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Bio */}
        <div className="space-y-3">
          <div className="skeleton h-6 w-32 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
          <div className="skeleton h-4 w-4/6 rounded" />
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Velas */}
        <div className="card-base p-6 space-y-4">
          <div className="skeleton h-6 w-48 rounded" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton w-10 h-10 rounded-full" />
            ))}
          </div>
          <div className="skeleton h-11 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
