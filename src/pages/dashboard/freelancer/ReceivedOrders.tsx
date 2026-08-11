import { useMemo, useState } from "react"
import {
  Search,
  Download,
  Eye,
  ChevronDown,
  Box,
  CheckCircle2,
  Star,
  Wallet,
  Loader2,
  Code2,
  Clapperboard,
  Smartphone,
  Sparkles,
  PenLine,
  Megaphone,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useReceivedOrders, useUpdateOrderStatus } from "@/hooks/useOrders"
import { getErrorMessage, cn } from "@/lib/utils"
import { formatPrice, formatDate, formatShortMonth } from "@/lib/format"
import { LoadingState } from "@/components/shared/LoadingState"
import { ErrorState } from "@/components/shared/ErrorState"
import { Pagination } from "@/components/shared/Pagination"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Order, OrderStatus } from "@/types/order.types"

const PAGE_SIZE = 6

const STATUS_META: Record<
  OrderStatus,
  { label: string; pill: string; dot: string; color: string }
> = {
  PENDING: {
    label: "Pending",
    pill: "bg-amber-500/15 text-amber-400",
    dot: "bg-amber-400",
    color: "#fbbf24",
  },
  ACCEPTED: {
    label: "Accepted",
    pill: "bg-sky-500/15 text-sky-400",
    dot: "bg-sky-400",
    color: "#60a5fa",
  },
  IN_PROGRESS: {
    label: "In Progress",
    pill: "bg-violet-500/15 text-violet-400",
    dot: "bg-violet-400",
    color: "#a78bfa",
  },
  COMPLETED: {
    label: "Completed",
    pill: "bg-emerald-500/15 text-emerald-400",
    dot: "bg-emerald-400",
    color: "#34d399",
  },
  CANCELLED: {
    label: "Cancelled",
    pill: "bg-rose-500/15 text-rose-400",
    dot: "bg-rose-400",
    color: "#fb7185",
  },
}

const STATUS_FILTERS: ("ALL" | OrderStatus)[] = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
}

const THUMB_GRADIENTS = [
  "from-indigo-700 to-violet-900",
  "from-amber-500 to-orange-700",
  "from-slate-800 to-black",
  "from-violet-700 to-fuchsia-900",
  "from-fuchsia-800 to-purple-950",
  "from-slate-800 to-slate-950",
]

function serviceIcon(title: string): LucideIcon {
  const lower = title.toLowerCase()
  if (lower.includes("video") || lower.includes("youtube")) return Clapperboard
  if (lower.includes("mobile") || lower.includes("app")) return Smartphone
  if (lower.includes("3d") || lower.includes("animation")) return Sparkles
  if (
    lower.includes("blog") ||
    lower.includes("content") ||
    lower.includes("write")
  )
    return PenLine
  if (
    lower.includes("seo") ||
    lower.includes("marketing") ||
    lower.includes("social")
  )
    return Megaphone
  return Code2
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
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
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full",
          iconBg
        )}
      >
        <Icon size={16} className={iconColor} strokeWidth={2} />
      </div>
      <div className="mt-3 text-xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground/70">{sub}</div>
    </div>
  )
}

function ServiceThumb({
  order,
  icon: Icon,
  className,
  iconSize = 16,
}: {
  order: Order
  icon: LucideIcon
  className?: string
  iconSize?: number
}) {
  const thumb =
    THUMB_GRADIENTS[
      Math.abs(
        order.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
      ) % THUMB_GRADIENTS.length
    ]

  if (order.service.thumbnail) {
    return (
      <img
        src={order.service.thumbnail}
        alt={order.service.title}
        className={cn("shrink-0 rounded-lg object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
        thumb,
        className
      )}
    >
      <Icon size={iconSize} className="text-white/90" strokeWidth={2} />
    </div>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
        meta.pill
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}

function StatusMenu({
  order,
  onUpdate,
  pending,
}: {
  order: Order
  onUpdate: (id: string, status: OrderStatus) => void
  pending: boolean
}) {
  const allowed = ALLOWED_TRANSITIONS[order.status]
  if (allowed.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={pending}>
          {pending && <Loader2 className="size-3.5 animate-spin" />}
          Update Status
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allowed.map((next) => (
          <DropdownMenuItem
            key={next}
            onClick={() => onUpdate(order.id, next)}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                STATUS_META[next].dot
              )}
            />
            Mark as {STATUS_META[next].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function ReceivedOrders() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL")
  const [serviceId, setServiceId] = useState("all")
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const updateStatus = useUpdateOrderStatus()

  const { data, isLoading, isError, error, refetch } = useReceivedOrders({
    page,
    limit: PAGE_SIZE,
  })

  const orders = useMemo(() => data?.data ?? [], [data])
  const meta = data?.meta

  const stats = useMemo(() => {
    const total = meta?.total ?? orders.length
    const inProgress = orders.filter((o) =>
      ["ACCEPTED", "IN_PROGRESS"].includes(o.status)
    ).length
    const completed = orders.filter((o) => o.status === "COMPLETED").length
    const pending = orders.filter((o) => o.status === "PENDING").length
    const earnings = orders
      .filter((o) => o.status === "COMPLETED")
      .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0)
    return { total, inProgress, completed, pending, earnings }
  }, [orders, meta])

  const allServiceOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const o of orders) {
      if (o.service.category) {
        map.set(o.service.category.id, o.service.category.name)
      }
    }
    return [...map.entries()].map(([id, name]) => ({ id, name }))
  }, [orders])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase()
      const matchesSearch =
        o.service.title.toLowerCase().includes(q) ||
        o.client.name.toLowerCase().includes(q)
      const matchesStatus = status === "ALL" || o.status === status
      const matchesService =
        serviceId === "all" ||
        (o.service.category && o.service.category.id === serviceId)
      return matchesSearch && matchesStatus && matchesService
    })
  }, [orders, search, status, serviceId])

  const overviewSegments = useMemo(() => {
    return STATUS_FILTERS.filter((s) => s !== "ALL").map((s) => {
      const count = orders.filter((o) => o.status === s).length
      return {
        status: s,
        count,
        pct:
          orders.length > 0
            ? Math.round((count / orders.length) * 1000) / 10
            : 0,
        color: STATUS_META[s].color,
      }
    })
  }, [orders])

  const totalInRange = overviewSegments.reduce((sum, s) => sum + s.count, 0)

  const topServices = useMemo(() => {
    const map = new Map<string, number>()
    for (const o of orders) {
      const name = o.service.category?.name ?? "Other"
      map.set(name, (map.get(name) ?? 0) + 1)
    }
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [orders])

  const earningsByMonth = useMemo(() => {
    const now = new Date()
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return {
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: formatShortMonth(d),
      }
    })
    const buckets = new Map(months.map((m) => [m.key, 0]))
    for (const o of orders) {
      if (o.status !== "COMPLETED") continue
      const key = o.createdAt.slice(0, 7)
      if (buckets.has(key)) {
        buckets.set(key, buckets.get(key)! + Number(o.totalPrice || 0))
      }
    }
    return months.map((m) => ({ ...m, value: buckets.get(m.key)! }))
  }, [orders])

  const thisMonth = earningsByMonth[earningsByMonth.length - 1]?.value ?? 0
  const lastMonth =
    earningsByMonth.length > 1 ? earningsByMonth[earningsByMonth.length - 2]?.value ?? 0 : 0
  const trend =
    lastMonth > 0
      ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
      : 0

  const detailsOrder = orders.find((o) => o.id === detailsId)

  const handleUpdateStatus = (id: string, next: OrderStatus) => {
    updateStatus.mutate({ id, status: next })
  }

  const handleExport = () => {
    if (filtered.length === 0) return
    const header = "Order,Service,Client,Status,Amount,Date"
    const rows = filtered.map((o) =>
      [
        o.id,
        `"${o.service.title.replace(/"/g, '""')}"`,
        `"${o.client.name.replace(/"/g, '""')}"`,
        o.status,
        o.totalPrice,
        formatDate(o.createdAt),
      ].join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "received-orders.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Received Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track, manage and deliver outstanding work to your clients.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download size={15} />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={Box}
          iconBg="bg-violet-500/15"
          iconColor="text-violet-400"
          label="Total Orders"
          value={isLoading ? "—" : stats.total}
          sub="All time"
        />
        <StatCard
          icon={Loader2}
          iconBg="bg-sky-500/15"
          iconColor="text-sky-400"
          label="In Progress"
          value={isLoading ? "—" : stats.inProgress}
          sub="Accepted or in progress"
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
          label="Completed"
          value={isLoading ? "—" : stats.completed}
          sub="Delivered orders"
        />
        <StatCard
          icon={Wallet}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-400"
          label="Total Earnings"
          value={isLoading ? "—" : `$${stats.earnings.toLocaleString()}`}
          sub="From completed orders"
        />
        <StatCard
          icon={Star}
          iconBg="bg-rose-500/15"
          iconColor="text-rose-400"
          label="Pending"
          value={isLoading ? "—" : stats.pending}
          sub="Awaiting your action"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        {/* Left */}
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm text-muted-foreground">
              <Search size={15} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or client..."
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as "ALL" | OrderStatus)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "ALL" ? "All Statuses" : STATUS_META[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {allServiceOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal size={14} />
              More Filters
            </Button>
          </div>

          {/* List */}
          {isError ? (
            <div className="mt-5">
              <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
            </div>
          ) : isLoading ? (
            <div className="mt-5">
              <LoadingState count={3} variant="rows" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-5 rounded-2xl border bg-card py-16 text-center">
              <Box className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">No orders found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {orders.length === 0
                  ? "Orders from clients will appear here."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-4 font-medium">Order</th>
                    <th className="px-4 py-4 font-medium">Service</th>
                    <th className="px-4 py-4 font-medium">Client</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Date</th>
                    <th className="px-4 py-4 font-medium">Amount</th>
                    <th className="px-4 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const Icon = serviceIcon(o.service.title)
                    return (
                      <tr
                        key={o.id}
                        className="border-b last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <ServiceThumb
                              order={o}
                              icon={Icon}
                              className="h-11 w-11"
                            />
                            <div className="max-w-[220px]">
                              <div className="text-xs text-muted-foreground">
                                #{o.id.slice(0, 8).toUpperCase()}
                              </div>
                              <div className="mt-0.5 text-sm font-medium leading-snug">
                                {o.service.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {o.service.category?.name ?? "—"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-8">
                              {o.client.profileImg && (
                                <AvatarImage
                                  src={o.client.profileImg}
                                  alt={o.client.name}
                                />
                              )}
                              <AvatarFallback>
                                {getInitials(o.client.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{o.client.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={o.status} />
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {formatDate(o.createdAt)}
                        </td>
                        <td className="px-4 py-4 font-medium">
                          ${formatPrice(o.totalPrice)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="View order details"
                              onClick={() => setDetailsId(o.id)}
                            >
                              <Eye size={16} />
                            </Button>
                            <StatusMenu
                              order={o}
                              onUpdate={handleUpdateStatus}
                              pending={updateStatus.isPending}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {meta && meta.total > PAGE_SIZE && (
            <div className="mt-5">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Order overview */}
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-base font-semibold">Order Overview</h3>
            {isLoading ? (
              <div className="mt-4 h-44 animate-pulse rounded-lg bg-muted/50" />
            ) : totalInRange === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No orders yet.
              </p>
            ) : (
              <>
                <div className="relative mx-auto mt-4 h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overviewSegments.filter((s) => s.count > 0)}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={72}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {overviewSegments
                          .filter((s) => s.count > 0)
                          .map((s) => (
                            <Cell key={s.status} fill={s.color} />
                          ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{totalInRange}</span>
                    <span className="text-[11px] text-muted-foreground">
                      Total
                    </span>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {overviewSegments.map((s) => (
                    <li
                      key={s.status}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        {STATUS_META[s.status].label}
                      </span>
                      <span className="text-muted-foreground/70">
                        {s.count} ({s.pct}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Top services */}
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-base font-semibold">Top Services</h3>
            <ul className="mt-4 space-y-3">
              {topServices.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-medium">{s.count}</span>
                </li>
              ))}
              {topServices.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  No orders yet.
                </li>
              )}
            </ul>
          </div>

          {/* Recent earnings */}
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-base font-semibold">Recent Earnings</h3>
            <div className="mt-3 text-2xl font-bold">
              ${thisMonth.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">This month</span>
              {trend !== 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-medium",
                    trend >= 0
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-rose-500/15 text-rose-400"
                  )}
                >
                  {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
                </span>
              )}
            </div>
            <svg viewBox="0 0 240 60" className="mt-4 h-14 w-full">
              <polyline
                points={earningsByMonth
                  .map((m, i) => {
                    const max = Math.max(1, ...earningsByMonth.map((d) => d.value))
                    const x = (i / (earningsByMonth.length - 1)) * 240
                    const y = 52 - (m.value / max) * 44
                    return `${x},${y}`
                  })
                  .join(" ")}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-xs text-muted-foreground/70">
              Completed order earnings, last 6 months
            </p>
          </div>
        </div>
      </div>

      {/* Order details dialog */}
      <Dialog
        open={Boolean(detailsOrder)}
        onOpenChange={(open) => {
          if (!open) setDetailsId(null)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              #{detailsOrder?.id.slice(0, 8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          {detailsOrder && (
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Service</div>
                <div className="mt-0.5 font-medium">
                  {detailsOrder.service.title}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Client</div>
                  <div className="mt-0.5 font-medium">
                    {detailsOrder.client.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="mt-0.5 font-medium">
                    ${formatPrice(detailsOrder.totalPrice)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <StatusBadge status={detailsOrder.status} />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Placed</div>
                  <div className="mt-0.5 font-medium">
                    {formatDate(detailsOrder.createdAt)}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Requirement
                </div>
                <p className="mt-0.5 leading-relaxed">
                  {detailsOrder.requirement ?? "No requirement provided."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
