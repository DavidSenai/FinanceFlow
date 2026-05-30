export default function Skeleton({ className = '' }) {
  return (
    <div className={`bg-dark-700/30 rounded-xl animate-pulse ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700/50 space-y-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
