import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  ChevronDown,
  Download,
  Star,
  Code2,
  Clapperboard,
  Smartphone,
  Sparkles,
  PenLine,
  Package,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock3,
  Headphones,
  ShieldCheck,
  MoreVertical,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useMyOrders } from "@/hooks/useOrders"
import { useCreateReview } from "@/hooks/useReviews"
import { getErrorMessage, cn } from "@/lib/utils"
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge"
import { Pagination } from "@/components/shared/Pagination"
import { LoadingState } from "@/components/shared/LoadingState"
import { ErrorState } from "@/components/shared/ErrorState"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Order, OrderStatus } from "@/types/order.types"

const PAGE_SIZE = 6

const STATUS_FILTERS: ("ALL" | OrderStatus)[] = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]

const THUMB_GRADIENTS = [
  "from-indigo-700 to-violet-900",
  "from-amber-500 to-orange-700",
  "from-slate-800 to-black",
  "from-violet-700 to-fuchsia-900",
  "from-fuchsia-800 to-purple-950",
  "from-slate-800 to-slate-950",
]

function formatPrice(price: string | number) {
  const num = Number(price)
  return Number.isInteger(num) ? num.toLocaleString() : num.toFixed(2)
}

function formatDateTime(iso: string) {
  const date = new Date(iso)
  return {
    date: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

function serviceIcon(title: string): LucideIcon {
  const lower = title.toLowerCase()
  if (lower.includes("video") || lower.includes("youtube")) return Clapperboard
  if (lower.includes("mobile") || lower.includes("app")) return Smartphone
  if (lower.includes("3d") || lower.includes("animation")) return Sparkles
  if (lower.includes("blog") || lower.includes("content") || lower.includes("write"))
    return PenLine
  return Code2
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
}: {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  label: string
  value: string | number
  sub: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconBg
          )}
        >
          <Icon size={16} className={iconColor} strokeWidth={2} />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-3 text-xl font-semibold">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  )
}

export default function MyOrders() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL")
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const { data, isLoading, isError, error, refetch } = useMyOrders({
    page: 1,
    limit: 100,
  })

  const createReview = useCreateReview()

  const orders = useMemo(() => data?.data ?? [], [data])

  const stats = useMemo(() => {
    const all = orders.length
    const inProgress = orders.filter((o) =>
      ["ACCEPTED", "IN_PROGRESS"].includes(o.status)
    ).length
    const completed = orders.filter((o) => o.status === "COMPLETED").length
    const cancelled = orders.filter((o) => o.status === "CANCELLED").length
    const pending = orders.filter((o) => o.status === "PENDING").length
    return { all, inProgress, completed, cancelled, pending }
  }, [orders])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false
      if (!q) return true
      return (
        o.service.title.toLowerCase().includes(q) ||
        o.service.freelancer.name.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      )
    })
  }, [orders, query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageOrders = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleExport = () => {
    const header = ["Order ID", "Service", "Freelancer", "Status", "Date", "Total"]
    const rows = filtered.map((o) => [
      o.id,
      `"${o.service.title}"`,
      o.service.freelancer.name,
      o.status,
      formatDateTime(o.createdAt).date,
      `$${formatPrice(o.totalPrice)}`,
    ])
    const csv = [header, ...rows]
      .map((r) => r.join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `my-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const submitReview = async () => {
    if (!reviewOrder) return
    try {
      await createReview.mutateAsync({
        orderId: reviewOrder.id,
        serviceId: reviewOrder.serviceId,
        rating,
        comment: comment || undefined,
      })
      setReviewOrder(null)
      setRating(5)
      setComment("")
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage all your orders in one place.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={Package}
          iconBg="bg-violet-500/15"
          iconColor="text-violet-400"
          label="All Orders"
          value={isLoading ? "—" : stats.all}
          sub="View all orders"
        />
        <StatCard
          icon={Loader2}
          iconBg="bg-sky-500/15"
          iconColor="text-sky-400"
          label="In Progress"
          value={isLoading ? "—" : stats.inProgress}
          sub="Currently in progress"
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
          label="Completed"
          value={isLoading ? "—" : stats.completed}
          sub="Successfully completed"
        />
        <StatCard
          icon={XCircle}
          iconBg="bg-rose-500/15"
          iconColor="text-rose-400"
          label="Cancelled"
          value={isLoading ? "—" : stats.cancelled}
          sub="Cancelled orders"
        />
        <StatCard
          icon={Clock3}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-400"
          label="Pending"
          value={isLoading ? "—" : stats.pending}
          sub="Awaiting response"
        />
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search your orders..."
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "ALL" | OrderStatus)
              setPage(1)
            }}
            className="appearance-none rounded-lg border bg-muted/40 py-2.5 pr-9 pl-3.5 text-sm text-foreground outline-none"
            aria-label="Filter by status"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Status" : s.replace("_", " ")}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={filtered.length === 0}
        >
          <Download size={14} />
          Export
        </Button>
      </div>

      {/* Content */}
      <div className="mt-5">
        {isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : isLoading ? (
          <LoadingState count={4} variant="rows" />
        ) : pageOrders.length === 0 ? (
          <div className="rounded-2xl border bg-card py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">No orders found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query || statusFilter !== "ALL"
                ? "Try a different search term or filter."
                : "Place your first order to get started."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-4 font-medium">Order / Service</th>
                    <th className="px-4 py-4 font-medium">Freelancer</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Date</th>
                    <th className="px-4 py-4 font-medium">Total</th>
                    <th className="px-4 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageOrders.map((o) => {
                    const Icon = serviceIcon(o.service.title)
                    const thumb =
                      THUMB_GRADIENTS[
                        Math.abs(o.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
                          THUMB_GRADIENTS.length
                      ]
                    const dt = formatDateTime(o.createdAt)
                    const canReview =
                      o.status === "COMPLETED" && !o.review
                    return (
                      <tr
                        key={o.id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            {o.service.thumbnail ? (
                              <img
                                src={o.service.thumbnail}
                                alt={o.service.title}
                                className="h-14 w-16 shrink-0 rounded-xl object-cover"
                              />
                            ) : (
                              <div
                                className={cn(
                                  "flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                                  thumb
                                )}
                              >
                                <Icon size={20} className="text-white/90" strokeWidth={2} />
                              </div>
                            )}
                            <div>
                              <Link
                                to={`/services/${o.serviceId}`}
                                className="font-medium leading-snug hover:text-primary"
                              >
                                {o.service.title}
                              </Link>
                              <div className="mt-1 text-xs text-muted-foreground">
                                #{o.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            {o.service.freelancer.profileImg ? (
                              <img
                                src={o.service.freelancer.profileImg}
                                alt={o.service.freelancer.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-semibold text-white">
                                {o.service.freelancer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}
                            <span>{o.service.freelancer.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <OrderStatusBadge status={o.status} />
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div>{dt.date}</div>
                          <div className="text-xs text-muted-foreground">
                            {dt.time}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top font-medium">
                          ${formatPrice(o.totalPrice)}
                        </td>
                        <td className="px-4 py-4 align-top">
                          {canReview ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                setReviewOrder(o)
                                setRating(5)
                                setComment("")
                              }}
                            >
                              <Star className="fill-current" />
                              Leave a Review
                            </Button>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <Button asChild variant="outline" size="sm">
                                <Link to={`/services/${o.serviceId}`}>
                                  View Details
                                </Link>
                              </Button>
                              <button
                                type="button"
                                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                aria-label="More actions"
                              >
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {pageOrders.map((o) => {
                const Icon = serviceIcon(o.service.title)
                const thumb =
                  THUMB_GRADIENTS[
                    Math.abs(o.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
                      THUMB_GRADIENTS.length
                  ]
                const dt = formatDateTime(o.createdAt)
                const canReview = o.status === "COMPLETED" && !o.review
                return (
                  <div key={o.id} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-start gap-3">
                      {o.service.thumbnail ? (
                        <img
                          src={o.service.thumbnail}
                          alt={o.service.title}
                          className="h-14 w-16 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                            thumb
                          )}
                        >
                          <Icon size={20} className="text-white/90" strokeWidth={2} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/services/${o.serviceId}`}
                          className="line-clamp-2 font-medium leading-snug hover:text-primary"
                        >
                          {o.service.title}
                        </Link>
                        <div className="mt-1 text-xs text-muted-foreground">
                          #{o.id.slice(0, 8)}
                        </div>
                      </div>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {o.service.freelancer.name}
                      </span>
                      <span className="font-medium">
                        ${formatPrice(o.totalPrice)}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {dt.date} · {dt.time}
                    </div>
                    <div className="mt-3">
                      {canReview ? (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setReviewOrder(o)
                            setRating(5)
                            setComment("")
                          }}
                        >
                          <Star className="fill-current" />
                          Leave a Review
                        </Button>
                      ) : (
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link to={`/services/${o.serviceId}`}>
                            View Details
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              meta={{ page: safePage, limit: PAGE_SIZE, total: filtered.length }}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Support banner */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20">
            <ShieldCheck size={20} className="text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">
              Have an issue with your order?
            </div>
            <div className="text-xs text-muted-foreground">
              We&apos;re here to help and resolve any problems.
            </div>
          </div>
        </div>
        <Button className="gap-2">
          <Headphones size={15} />
          Contact Support
        </Button>
      </div>

      {/* Review dialog */}
      <Dialog
        open={Boolean(reviewOrder)}
        onOpenChange={(open) => !open && setReviewOrder(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Rate the service you received from{" "}
              <span className="font-medium text-foreground">
                {reviewOrder?.service.freelancer.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Your rating</span>
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(n)}
                    className="p-0.5"
                  >
                    <Star
                      size={22}
                      className={cn(
                        "transition-colors",
                        n <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Comment (optional)</label>
              <Textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewOrder(null)}
              disabled={createReview.isPending}
            >
              Cancel
            </Button>
            <Button onClick={submitReview} disabled={createReview.isPending}>
              {createReview.isPending && <Loader2 className="animate-spin" />}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
