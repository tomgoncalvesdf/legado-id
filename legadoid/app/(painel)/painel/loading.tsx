// Skeleton de loading para o painel (exibido enquanto a page.tsx carrega)
export default function PainelLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Saudação */}
      <div className="space-y-2">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-4 w-72 rounded" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-base p-5 flex items-center gap-4">
            <div className="skeleton w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <div className="skeleton h-7 w-12 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Título */}
      <div className="skeleton h-5 w-36 rounded" />

      {/* Cards de memoriais */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="card-base p-5 flex items-center gap-4">
          <div className="skeleton w-14 h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-48 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
