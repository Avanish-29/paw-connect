export default function PetSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl bg-card shadow-sm">
          <div className="h-52 animate-pulse bg-sand" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-1/2 animate-pulse rounded bg-sand" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-sand" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-sand" />
          </div>
        </div>
      ))}
    </div>
  )
}
