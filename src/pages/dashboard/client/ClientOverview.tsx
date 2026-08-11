import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Wallet,
  Loader2,
  CheckCircle2,
  Heart,
  Code2,
  Search as SearchIcon,
  Clapperboard,
  Package,
  ArrowRight,
  Plus,
  MessageCircle,
  FileText,
  TrendingUp,
  Clock,
  ShieldCheck,
  Headphones,
  Briefcase,
  Smartphone,
  Sparkles,
  PenLine,
  type LucideIcon,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { useMyOrders } from "@/hooks/useOrders"
import { useAuth } from "@/hooks/useAuth"
import { getErrorMessage, cn } from "@/lib/utils"
import { formatPrice, formatShortMonth } from "@/lib/format"
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge"
import { LoadingState } from "@/components/shared/LoadingState"
import { ErrorState } from "@/components/shared/ErrorState"
import { Button } from "@/components/ui/button"

const THUMB_GRADIENTS = [
  "from-indigo-700 to-violet-900",
  "from-amber-500 to-orange-700",
  "from-slate-800 to-black",
  "from-violet-700 to-fuchsia-900",
  "from-fuchsia-800 to-purple-950",
  "from-slate-800 to-slate-950",
]

const PIE_COLORS = [
  "var(--primary)",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#6366f1",
  "#f43f5e",
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

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days < 1) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} week(s) ago`
  if (days < 365) return `${Math.floor(days / 30)} month(s) ago`
  return `${Math.floor(days / 365)} year(s) ago`
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
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            iconBg
          )}
        >
          <Icon size={18} className={iconColor} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-4 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  )
}

export default function ClientOverview() {
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch } = useMyOrders({
    page: 1,
    limit: 100,
  })

  const orders = useMemo(() => data?.data ?? [], [data])

  const stats = useMemo(() => {
    const totalSpent = orders.reduce(
      (sum, o) => sum + Number(o.totalPrice || 0),
      0
    )
    const active = orders.filter((o) =>
      ["ACCEPTED", "IN_PROGRESS"].includes(o.status)
    ).length
    const completed = orders.filter((o) => o.status === "COMPLETED").length
    const freelancers = new Set(
      orders.map((o) => o.service.freelancer.id)
    ).size
    return { totalSpent, active, completed, freelancers }
  }, [orders])

  const spendByMonth = useMemo(() => {
    const months = lastMonths(7)
    const buckets = new Map(months.map((m) => [m.key, 0]))
    for (const o of orders) {
      const key = o.createdAt.slice(0, 7)
      if (buckets.has(key)) {
        buckets.set(key, buckets.get(key)! + Number(o.totalPrice || 0))
      }
    }
    return months.map((m) => ({ ...m, value: buckets.get(m.key)! }))
  }, [orders])

  const maxSpend = Math.max(1, ...spendByMonth.map((d) => d.value))

  const spendByCategory = useMemo(() => {
    const buckets = new Map<string, number>()
    for (const o of orders) {
      const name = o.service.category?.name ?? "Other"
      buckets.set(name, (buckets.get(name) ?? 0) + Number(o.totalPrice || 0))
    }
    return [...buckets.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [orders])

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 4),
    [orders]
  )

  const activity = useMemo(
    () =>
      [...orders]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 4)
        .map((o) => ({
          status: o.status,
          text:
            o.status === "COMPLETED"
              ? `Order "${o.service.title}" was completed`
              : `You placed an order for "${o.service.title}"`,
          time: timeAgo(o.createdAt),
        })),
    [orders]
  )

  const quickActions = [
    { icon: Plus, label: "Browse Services", to: "/services" },
    { icon: SearchIcon, label: "Find a Freelancer", to: "/services" },
    { icon: MessageCircle, label: "My Orders", to: "/dashboard/client/orders" },
    { icon: FileText, label: "View Invoices", to: "/dashboard/client/orders" },
  ]

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      {/* Welcome banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/15 to-fuchsia-600/10 p-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name.split(" ")[0] ?? "there"} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/services">
            <Plus size={16} />
            Post a Project
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          iconBg="bg-violet-500/15"
          iconColor="text-violet-400"
          label="Total Spent"
          value={isLoading ? "—" : `$${stats.totalSpent.toLocaleString()}`}
          sub="Across all your orders"
        />
        <StatCard
          icon={Loader2}
          iconBg="bg-sky-500/15"
          iconColor="text-sky-400"
          label="Active Orders"
          value={isLoading ? "—" : stats.active}
          sub="Accepted or in progress"
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
          label="Completed Projects"
          value={isLoading ? "—" : stats.completed}
          sub="Successfully delivered"
        />
        <StatCard
          icon={Heart}
          iconBg="bg-rose-500/15"
          iconColor="text-rose-400"
          label="Freelancers Hired"
          value={isLoading ? "—" : stats.freelancers}
          sub="Unique sellers you've worked with"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Spending chart */}
        <div className="rounded-2xl border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Spending Overview</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Monthly spend and breakdown by category
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground">
              <TrendingUp size={13} />
              Last 7 months
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {isLoading ? (
              <div className="h-40 animate-pulse rounded-lg bg-muted/50" />
            ) : (
              <div
                className="flex items-end justify-between gap-3 px-1"
                style={{ height: 160 }}
              >
                {spendByMonth.map((d) => (
                  <div
                    key={d.key}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-primary to-fuchsia-500 transition-all hover:opacity-80"
                        style={{ height: `${(d.value / maxSpend) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="h-40 animate-pulse rounded-lg bg-muted/50" />
            ) : spendByCategory.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                No spending data yet
              </div>
            ) : (
              <div>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={spendByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={70}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {spendByCategory.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${formatPrice(value as number)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  {spendByCategory.map((c, i) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="font-medium">
                        ${formatPrice(c.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="text-base font-semibold">Quick Actions</h3>
          <div className="mt-4 space-y-2.5">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex w-full items-center gap-3 rounded-lg border bg-muted/30 px-3.5 py-3 text-sm transition-colors hover:bg-muted/60"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <a.icon size={15} />
                </div>
                <span className="flex-1 text-left">{a.label}</span>
                <ArrowRight size={14} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="rounded-2xl border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent Orders</h3>
            <Link
              to="/dashboard/client/orders"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
            >
              View All
              <ArrowRight size={13} />
            </Link>
          </div>

          {isError ? (
            <ErrorState
              message={getErrorMessage(error)}
              onRetry={() => refetch()}
            />
          ) : isLoading ? (
            <LoadingState count={3} variant="rows" />
          ) : recentOrders.length === 0 ? (
            <div className="py-8 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse services and place your first order.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-1">
              {recentOrders.map((o) => {
                const Icon = serviceIcon(o.service.title)
                const thumb =
                  THUMB_GRADIENTS[
                    Math.abs(o.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
                      THUMB_GRADIENTS.length
                  ]
                return (
                  <Link
                    key={o.id}
                    to={`/services/${o.serviceId}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40"
                  >
                    {o.service.thumbnail ? (
                      <img
                        src={o.service.thumbnail}
                        alt={o.service.title}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                          thumb
                        )}
                      >
                        <Icon size={18} className="text-white/90" strokeWidth={2} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {o.service.title}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{o.service.freelancer.name}</span>
                      </div>
                    </div>
                    <OrderStatusBadge status={o.status} />
                    <span className="w-16 shrink-0 text-right text-sm font-medium">
                      ${formatPrice(o.totalPrice)}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent Activity</h3>
            <Link
              to="/dashboard/client/orders"
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              View All
            </Link>
          </div>
          {isLoading ? (
            <LoadingState count={3} variant="rows" />
          ) : activity.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">
              No activity yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      a.status === "COMPLETED"
                        ? "bg-emerald-600/15 text-emerald-400"
                        : "bg-violet-600/15 text-violet-400"
                    )}
                  >
                    {a.status === "COMPLETED" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Briefcase size={14} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-snug">{a.text}</p>
                    <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock size={10} />
                      {a.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Support banner */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20">
            <ShieldCheck size={20} className="text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">Have an issue with your order?</div>
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
    </div>
  )
}
