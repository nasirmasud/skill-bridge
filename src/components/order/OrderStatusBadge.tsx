import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types/order.types"

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-400",
  ACCEPTED: "bg-sky-500/15 text-sky-400",
  IN_PROGRESS: "bg-violet-500/15 text-violet-400",
  COMPLETED: "bg-emerald-500/15 text-emerald-400",
  CANCELLED: "bg-rose-500/15 text-rose-400",
}

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {status}
    </span>
  )
}
