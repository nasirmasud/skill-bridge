import { useMemo } from "react"
import {
  Users,
  Package,
  Wallet,
  Wrench,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  UserPlus,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  ChevronRight,
  MoreHorizontal,
  CircleDot,
  Code2,
  Clapperboard,
  Smartphone,
  Sparkles,
  PenLine,
  type LucideIcon,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAdminOrders } from "@/hooks/useOrders"
import { useRoleCount, useAdminUsers } from "@/hooks/useUsers"
import { useCategories } from "@/hooks/useCategories"
import { useAuth } from "@/hooks/useAuth"
import { usePageTitle } from "@/hooks/usePageTitle"
import { cn } from "@/lib/utils"
import { formatCurrency, formatShortMonth } from "@/lib/format"
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { OrderStatus } from "@/types/order.types"

const THUMB_GRADIENTS = [
  "from-violet-600 to-indigo-900",
  "from-fuchsia-600 to-purple-900",
  "from-slate-700 to-slate-900",
  "from-amber-500 to-orange-700",
  "from-sky-600 to-blue-900",
  "from-rose-500 to-pink-900",
]

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

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days < 1) {
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins} min ago`
    return `${Math.floor(mins / 60)} hour(s) ago`
  }
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} week(s) ago`
  return `${Math.floor(days / 30)} month(s) ago`
}

function lastMonths(count: number): { key: string; label: string }[] {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1)
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: formatShortMonth(d),
    }
  })
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  delta,
  up = true,
  loading = false,
}: {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  label: string
  value: string
  delta: string
  up?: boolean
  loading?: boolean
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            iconBg
          )}
        >
          <Icon size={20} className={iconColor} strokeWidth={2} />
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
            up
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          )}
        >
          {up ? (
            <TrendingUp size={12} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={12} strokeWidth={2.5} />
          )}
          {delta}
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold">
        {loading ? "—" : value}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export default function AdminOverview() {
  usePageTitle("Admin Dashboard")
  const { user } = useAuth()

  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({
    page: 1,
    limit: 100,
  })
  const { data: freelancerTotal } = useRoleCount("FREELANCER")
  const { data: clientTotal } = useRoleCount("CLIENT")
  const { data: adminTotal } = useRoleCount("ADMIN")
  const { data: usersData } = useAdminUsers({ page: 1, limit: 100 })
  const { data: categories } = useCategories()

  const orders = useMemo(() => ordersData?.data ?? [], [ordersData])
  const ordersTotal = ordersData?.meta?.total ?? orders.length
  const users = useMemo(() => usersData?.data ?? [], [usersData])
  const cats = useMemo(() => categories ?? [], [categories])

  const totalUsers =
    (freelancerTotal ?? 0) + (clientTotal ?? 0) + (adminTotal ?? 0)
  const statsLoading = freelancerTotal === undefined || clientTotal === undefined

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0),
    [orders]
  )

  const activeServices = useMemo(
    () => cats.reduce((sum, c) => sum + (c.serviceCount ?? 0), 0),
    [cats]
  )

  const revenueByMonth = useMemo(() => {
    const months = lastMonths(6)
    const buckets = new Map(months.map((m) => [m.key, 0]))
    for (const o of orders) {
      if (o.status === "CANCELLED") continue
      const key = o.createdAt.slice(0, 7)
      if (buckets.has(key)) {
        buckets.set(key, buckets.get(key)! + Number(o.totalPrice || 0))
      }
    }
    return months.map((m) => ({
      ...m,
      value: Math.round(buckets.get(m.key)!),
    }))
  }, [orders])

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5),
    [orders]
  )

  const topCategories = useMemo(() => {
    const max = Math.max(1, ...cats.map((c) => c.serviceCount ?? 0))
    return [...cats]
      .sort((a, b) => (b.serviceCount ?? 0) - (a.serviceCount ?? 0))
      .slice(0, 4)
      .map((c, i) => ({
        name: c.name,
        value: c.serviceCount ?? 0,
        pct: Math.round(((c.serviceCount ?? 0) / max) * 100),
        color: ["#a78bfa", "#38bdf8", "#34d399", "#fbbf24"][i],
      }))
  }, [cats])

  const newUsers = useMemo(
    () =>
      [...users]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 4)
        .map((u) => ({
          name: u.name,
          role: u.role,
          img: u.profileImg,
          time: timeAgo(u.createdAt),
        })),
    [users]
  )

  const cancelledCount = useMemo(
    () => orders.filter((o) => o.status === "CANCELLED").length,
    [orders]
  )

  const statusDonut = useMemo(() => {
    const colors: Record<OrderStatus, string> = {
      PENDING: "#f59e0b",
      ACCEPTED: "#38bdf8",
      IN_PROGRESS: "var(--primary)",
      COMPLETED: "#22c55e",
      CANCELLED: "#f43f5e",
    }
    const counts = new Map<OrderStatus, number>()
    for (const o of orders) {
      counts.set(o.status, (counts.get(o.status) ?? 0) + 1)
    }
    return [...counts.entries()].map(([status, value]) => ({
      name: status,
      value,
      color: colors[status],
    }))
  }, [orders])

  const alerts = useMemo(() => {
    const list: {
      icon: LucideIcon
      color: string
      bg: string
      text: string
      time: string
    }[] = []
    if (cancelledCount > 0) {
      list.push({
        icon: ShieldAlert,
        color: "text-rose-400",
        bg: "bg-rose-500/15",
        text: `${cancelledCount} cancelled order${cancelledCount === 1 ? "" : "s"} need review`,
        time: "Needs attention",
      })
    }
    list.push({
      icon: UserPlus,
      color: "text-violet-400",
      bg: "bg-violet-500/15",
      text: `${users.length} users on the platform`,
      time: "Live",
    })
    list.push({
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
      text: "All systems operational",
      time: "Just now",
    })
    return list
  }, [cancelledCount, users.length])

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name.split(" ")[0] ?? "Admin"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening on SkillBridge today.
          </p>
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <a href="/dashboard/admin/orders">
            <ArrowUpRight size={16} />
            View Orders
          </a>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          iconBg="bg-violet-500/15"
          iconColor="text-violet-400"
          label="Total Users"
          value={totalUsers.toLocaleString()}
          delta="Live"
          loading={statsLoading}
        />
        <StatCard
          icon={Package}
          iconBg="bg-sky-500/15"
          iconColor="text-sky-400"
          label="Total Orders"
          value={ordersTotal.toLocaleString()}
          delta="Live"
          loading={ordersLoading}
        />
        <StatCard
          icon={Wallet}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
          label="Total Revenue"
          value={ordersLoading ? "—" : formatCurrency(totalRevenue)}
          delta="Non-cancelled"
        />
        <StatCard
          icon={Wrench}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-400"
          label="Active Services"
          value={activeServices.toLocaleString()}
          delta="Live"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Revenue chart */}
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">Revenue Trend</h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {ordersLoading ? "—" : formatCurrency(totalRevenue)}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                    <TrendingUp size={12} strokeWidth={2.5} />
                    Last 6 months
                  </span>
                </div>
              </div>
            </div>
            {ordersLoading ? (
              <div className="flex h-44 items-center justify-center">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="mt-4 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueByMonth}
                    margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="var(--primary)"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `$${v}`}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      fill="url(#revFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent orders */}
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Orders</h3>
              <Button variant="link" size="sm" asChild>
                <a
                  href="/dashboard/admin/orders"
                  className="flex items-center gap-1 text-xs font-medium text-primary"
                >
                  View All
                  <ChevronRight size={13} />
                </a>
              </Button>
            </div>
            <div className="mt-4 divide-y">
              {recentOrders.length === 0 ? (
                <p className="py-8 text-sm text-muted-foreground">
                  No orders yet.
                </p>
              ) : (
                recentOrders.map((o) => {
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
                    <div
                      key={o.id}
                      className="flex items-center gap-3 py-3"
                    >
                      {o.service.thumbnail ? (
                        <img
                          src={o.service.thumbnail}
                          alt={o.service.title}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                            thumb
                          )}
                        >
                          <Icon
                            size={16}
                            className="text-white/90"
                            strokeWidth={2}
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {o.service.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {o.id.slice(0, 8)}
                        </div>
                      </div>
                      <Avatar className="hidden size-7 sm:block">
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
                      <OrderStatusBadge status={o.status} className="hidden sm:inline-block" />
                      <span className="w-14 shrink-0 text-right text-sm font-medium">
                        {formatCurrency(o.totalPrice)}
                      </span>
                      <Button variant="ghost" size="icon-sm" asChild>
                        <a href="/dashboard/admin/orders">
                          <MoreHorizontal size={15} />
                        </a>
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Top categories */}
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Top Categories</h3>
              <Button variant="link" size="sm" asChild>
                <a
                  href="/dashboard/admin/categories"
                  className="flex items-center gap-1 text-xs font-medium text-primary"
                >
                  View All
                  <ChevronRight size={13} />
                </a>
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {topCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories yet.</p>
              ) : (
                topCategories.map((c) => (
                  <div key={c.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <CircleDot
                          size={13}
                          style={{ color: c.color }}
                          strokeWidth={2.5}
                        />
                        {c.name}
                      </span>
                      <span className="text-muted-foreground">
                        {c.value} services
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Order status */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Order Status</h3>
            {ordersLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : statusDonut.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <>
                <div className="relative mt-2 flex justify-center">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={statusDonut}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={70}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {statusDonut.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{orders.length}</span>
                    <span className="text-xs text-muted-foreground">Orders</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {statusDonut.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: d.color }}
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

          {/* New users */}
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">New Users</h3>
              <Button variant="link" size="sm" asChild>
                <a
                  href="/dashboard/admin/users"
                  className="flex items-center gap-1 text-xs font-medium text-primary"
                >
                  View All
                  <ChevronRight size={13} />
                </a>
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {newUsers.map((u) => (
                <div key={u.name} className="flex items-center gap-3">
                  <Avatar className="size-9">
                    {u.img ? <AvatarImage src={u.img} alt={u.name} /> : null}
                    <AvatarFallback>{initials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.role}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {u.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Alerts</h3>
            <div className="mt-4 space-y-3.5">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      a.bg
                    )}
                  >
                    <a.icon size={15} className={a.color} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform growth */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-fuchsia-600/10 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowUpRight size={16} className="text-primary" />
              Platform Growth
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              User signups and orders are both trending up this month. Keep an
              eye on the orders queue to maintain platform quality.
            </p>
            <Button variant="link" size="sm" className="px-0" asChild>
              <a
                href="/dashboard/admin/orders"
                className="mt-1 flex items-center gap-1 text-xs font-medium text-primary"
              >
                View Orders
                <ChevronRight size={13} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
