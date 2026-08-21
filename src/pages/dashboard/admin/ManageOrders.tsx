import { useMemo, useState } from "react"
import {
  Package,
  CheckCircle2,
  Clock3,
  Hourglass,
  XCircle,
  Search,
  Download,
  Eye,
  Trash2,
  CircleDot,
  BadgeCheck,
  TrendingUp,
  Loader2,
  Code2,
  Clapperboard,
  Smartphone,
  Sparkles,
  PenLine,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  useAdminOrders,
  useDeleteOrder,
  useUpdateOrderStatus,
} from "@/hooks/useOrders"
import { getErrorMessage, cn } from "@/lib/utils"
import { formatCurrency, formatDate, formatTime } from "@/lib/format"
import { Pagination } from "@/components/shared/Pagination"
import { usePageTitle } from "@/hooks/usePageTitle"
import { LoadingState } from "@/components/shared/LoadingState"
import { ErrorState } from "@/components/shared/ErrorState"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge"
import type { Order, OrderStatus } from "@/types/order.types"

const PAGE_SIZE = 8

const THUMB_GRADIENTS = [
  "from-violet-600 to-indigo-900",
  "from-fuchsia-600 to-purple-900",
  "from-slate-700 to-slate-900",
  "from-amber-500 to-orange-700",
  "from-sky-600 to-blue-900",
  "from-rose-500 to-pink-900",
]

const STATUS_FILTERS: OrderStatus[] = [
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

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "#f59e0b",
  ACCEPTED: "#38bdf8",
  IN_PROGRESS: "var(--primary)",
  COMPLETED: "#22c55e",
  CANCELLED: "#f43f5e",
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

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
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
}: {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  label: string
  value: string | number
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
    </div>
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
        <Button variant="ghost" size="icon-sm" disabled={pending} aria-label="Update status">
          {pending && <Loader2 className="size-3.5 animate-spin" />}
          <Settings size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allowed.map((next) => (
          <DropdownMenuItem key={next} onClick={() => onUpdate(order.id, next)}>
            <span
              className={cn("h-2 w-2 rounded-full", STATUS_META[next].dot)}
            />
            Mark as {STATUS_META[next].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function ManageOrders() {
  usePageTitle("Manage Orders")
  const { data, isLoading, isError, error, refetch } = useAdminOrders({
    page: 1,
    limit: 100,
  })
  const deleteOrder = useDeleteOrder()
  const updateStatus = useUpdateOrderStatus()

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL")
  const [page, setPage] = useState(1)
  const [viewTarget, setViewTarget] = useState<Order | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null)

  const orders = useMemo(() => data?.data ?? [], [data])
  const metaTotal = data?.meta?.total ?? orders.length

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "COMPLETED").length
    const inProgress = orders.filter((o) =>
      ["ACCEPTED", "IN_PROGRESS"].includes(o.status)
    ).length
    const pending = orders.filter((o) => o.status === "PENDING").length
    const cancelled = orders.filter((o) => o.status === "CANCELLED").length
    return { total: metaTotal, completed, inProgress, pending, cancelled }
  }, [orders, metaTotal])

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const q = search.toLowerCase()
        const matchesSearch =
          !q ||
          o.service.title.toLowerCase().includes(q) ||
          o.client.name.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
        const matchesStatus = status === "ALL" || o.status === status
        return matchesSearch && matchesStatus
      }),
    [orders, search, status]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  )

  const donutData = useMemo(() => {
    const segments = STATUS_FILTERS.map((s) => ({
      name: s,
      value: orders.filter((o) => o.status === s).length,
    }))
    return segments.filter((s) => s.value > 0)
  }, [orders])

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0),
    [orders]
  )

  const topServices = useMemo(() => {
    const map = new Map<string, { name: string; amount: number }>()
    for (const o of orders) {
      const cat = o.service.category?.name ?? "Other"
      const cur = map.get(cat) ?? { name: cat, amount: 0 }
      cur.amount += Number(o.totalPrice || 0)
      map.set(cat, cur)
    }
    return [...map.values()]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [orders])

  const recentActivity = useMemo(
    () =>
      [...orders]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 4)
        .map((o) => ({
          text: `Order ${o.id.slice(0, 8)} — ${o.status.toLowerCase().replace("_", " ")}`,
          time: o.createdAt,
        })),
    [orders]
  )

  const handleExport = () => {
    if (filtered.length === 0) return
    const header = "Order,Service,Category,Client,Client Email,Freelancer,Status,Amount,Date"
    const rows = filtered.map((o) =>
      [
        o.id,
        `"${o.service.title.replace(/"/g, '""')}"`,
        `"${o.service.category?.name ?? ""}"`,
        `"${o.client.name.replace(/"/g, '""')}"`,
        `"${o.client.email}"`,
        `"${o.service.freelancer.name.replace(/"/g, '""')}"`,
        o.status,
        o.totalPrice,
        formatDate(o.createdAt),
      ].join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orders.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteOrder.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  const handleUpdateStatus = (id: string, next: OrderStatus) => {
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => {
          setViewTarget((current) =>
            current && current.id === id ? { ...current, status: next } : current
          )
        },
      }
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track, manage and review all customer orders across the platform.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download size={16} />
          Export Orders
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        {/* Left: stats + table */}
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              icon={Package}
              iconBg="bg-violet-500/15"
              iconColor="text-violet-400"
              label="Total Orders"
              value={isLoading ? "—" : stats.total.toLocaleString()}
            />
            <StatCard
              icon={CheckCircle2}
              iconBg="bg-emerald-500/15"
              iconColor="text-emerald-400"
              label="Completed"
              value={isLoading ? "—" : stats.completed.toLocaleString()}
            />
            <StatCard
              icon={Clock3}
              iconBg="bg-sky-500/15"
              iconColor="text-sky-400"
              label="In Progress"
              value={isLoading ? "—" : stats.inProgress.toLocaleString()}
            />
            <StatCard
              icon={Hourglass}
              iconBg="bg-amber-500/15"
              iconColor="text-amber-400"
              label="Pending"
              value={isLoading ? "—" : stats.pending.toLocaleString()}
            />
            <StatCard
              icon={XCircle}
              iconBg="bg-rose-500/15"
              iconColor="text-rose-400"
              label="Cancelled"
              value={isLoading ? "—" : stats.cancelled.toLocaleString()}
            />
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative flex min-w-[240px] flex-1 items-center">
              <Search
                size={15}
                className="absolute left-3 text-muted-foreground"
              />
              <Input
                placeholder="Search by order ID, service or client..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as "ALL" | OrderStatus)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {STATUS_FILTERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setSearch("")
                setStatus("ALL")
                setPage(1)
              }}
            >
              <XCircle size={14} />
              Reset
            </Button>
          </div>

          {/* Table */}
          <div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
            {isError ? (
              <div className="p-6">
                <ErrorState
                  message={getErrorMessage(error)}
                  onRetry={() => refetch()}
                />
              </div>
            ) : isLoading ? (
              <div className="p-6">
                <LoadingState count={5} variant="rows" />
              </div>
            ) : pageItems.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-14 text-center">
                <Package className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium">No orders found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-4 font-medium">Order</th>
                    <th className="px-4 py-4 font-medium">Client</th>
                    <th className="px-4 py-4 font-medium">Freelancer</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Date</th>
                    <th className="px-4 py-4 font-medium">Amount</th>
                    <th className="px-4 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((o) => {
                    const Icon = serviceIcon(o.service.title)
                    const thumb =
                      THUMB_GRADIENTS[
                        Math.abs(
                          o.id
                            .split("")
                            .reduce((a, c) => a + c.charCodeAt(0), 0)
                        ) % THUMB_GRADIENTS.length
                      ]
                    return (
                      <tr
                        key={o.id}
                        className="border-b last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {o.service.thumbnail ? (
                              <img
                                src={o.service.thumbnail}
                                alt={o.service.title}
                                className="h-11 w-11 shrink-0 rounded-xl object-cover"
                              />
                            ) : (
                              <div
                                className={cn(
                                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                                  thumb
                                )}
                              >
                                <Icon
                                  size={18}
                                  className="text-white/90"
                                  strokeWidth={2}
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-medium text-primary">
                                {o.id.slice(0, 8)}
                              </div>
                              <div className="font-medium">
                                {o.service.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {o.service.category?.name ?? "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-8">
                              {o.client.profileImg ? (
                                <AvatarImage
                                  src={o.client.profileImg}
                                  alt={o.client.name}
                                />
                              ) : null}
                              <AvatarFallback>
                                {initials(o.client.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{o.client.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {o.client.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span>{o.service.freelancer.name}</span>
                            <BadgeCheck
                              size={13}
                              className="text-sky-400"
                              strokeWidth={2.5}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <OrderStatusBadge status={o.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5">
                            <div>{formatDate(o.createdAt)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(o.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-medium">
                          {formatCurrency(o.totalPrice)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <StatusMenu
                              order={o}
                              onUpdate={handleUpdateStatus}
                              pending={updateStatus.isPending}
                            />
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setViewTarget(o)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-rose-400 hover:text-rose-300"
                              onClick={() => setDeleteTarget(o)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              Showing {pageItems.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}{" "}
              to {(safePage - 1) * PAGE_SIZE + pageItems.length} of{" "}
              {filtered.length} orders
            </span>
            <Pagination
              meta={{ page: safePage, limit: PAGE_SIZE, total: filtered.length }}
              onPageChange={setPage}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Order overview */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Order Overview</h3>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : donutData.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <>
                <div className="relative mt-2 flex justify-center">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={70}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {donutData.map((d) => (
                          <Cell
                            key={d.name}
                            fill={STATUS_COLORS[d.name as OrderStatus]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{orders.length}</span>
                    <span className="text-xs text-muted-foreground">Loaded</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {donutData.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: STATUS_COLORS[d.name as OrderStatus],
                          }}
                        />
                        <span className="capitalize">
                          {d.name.toLowerCase().replace("_", " ")}
                        </span>
                      </span>
                      <span>{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Total revenue */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Total Revenue</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {isLoading ? "—" : formatCurrency(totalRevenue)}
              </span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                <TrendingUp size={12} strokeWidth={2.5} />
                Live
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Non-cancelled orders
            </div>
          </div>

          {/* Top services */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Top Services</h3>
            <div className="mt-3 space-y-3">
              {topServices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              ) : (
                topServices.map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <CircleDot
                        size={13}
                        className={cn(
                          i === 0 && "text-violet-400",
                          i === 1 && "text-sky-400",
                          i === 2 && "text-orange-400",
                          i === 3 && "text-emerald-400",
                          i === 4 && "text-rose-400"
                        )}
                        strokeWidth={2.5}
                      />
                      <span className="max-w-[140px] truncate">{s.name}</span>
                    </span>
                    <span>{formatCurrency(s.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
            <div className="mt-3 space-y-3.5">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              ) : (
                recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        i === 0
                          ? "bg-violet-400"
                          : i === 1
                            ? "bg-emerald-400"
                            : i === 2
                              ? "bg-sky-400"
                              : "bg-amber-400"
                      )}
                    />
                    <div className="flex-1">
                      <div className="text-sm">{a.text}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(a.time)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View dialog */}
      <Dialog
        open={Boolean(viewTarget)}
        onOpenChange={(open) => {
          if (!open) setViewTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-sm">
          {viewTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Order {viewTarget.id.slice(0, 8)}</DialogTitle>
                <DialogDescription>{viewTarget.service.title}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={viewTarget.status} />
                    <StatusMenu
                      order={viewTarget}
                      onUpdate={handleUpdateStatus}
                      pending={updateStatus.isPending}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(viewTarget.totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Client</span>
                  <span className="text-sm">{viewTarget.client.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Freelancer
                  </span>
                  <span className="text-sm">
                    {viewTarget.service.freelancer.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Placed on
                  </span>
                  <span className="text-sm">
                    {formatDate(viewTarget.createdAt)}
                  </span>
                </div>
                {viewTarget.requirement ? (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Requirement
                    </div>
                    <p className="mt-1 text-sm">{viewTarget.requirement}</p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove order{" "}
              <span className="font-medium">
                {deleteTarget?.id.slice(0, 8)}
              </span>{" "}
              from the platform. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
