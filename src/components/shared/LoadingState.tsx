import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  count?: number
  variant?: "cards" | "rows"
  className?: string
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-16/10 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-full max-w-sm" />
        <Skeleton className="h-3.5 w-2/3 max-w-xs" />
      </div>
      <Skeleton className="hidden h-8 w-20 sm:block" />
    </div>
  )
}

export function LoadingState({
  count = 4,
  variant = "cards",
  className,
}: LoadingStateProps) {
  if (variant === "rows") {
    return (
      <div className={cn("flex flex-col gap-5", className)}>
        {Array.from({ length: count }).map((_, index) => (
          <RowSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}
