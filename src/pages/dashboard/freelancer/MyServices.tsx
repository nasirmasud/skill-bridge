import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  ChevronDown,
  Plus,
  Box,
  CheckCircle2,
  Eye,
  Star,
  LayoutGrid,
  List,
  Edit3,
  Code2,
  Clapperboard,
  Smartphone,
  Sparkles,
  PenLine,
  TrendingUp,
  Package,
  Lightbulb,
  Tag,
  Image as ImageIcon,
  Trash2,
  Loader2,
  type LucideIcon,
} from "lucide-react"
import { useFreelancerServices, useDeleteService } from "@/hooks/useServices"
import { useAuth } from "@/hooks/useAuth"
import { getErrorMessage, cn } from "@/lib/utils"
import { LoadingState } from "@/components/shared/LoadingState"
import { ErrorState } from "@/components/shared/ErrorState"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import type { Service, ServiceStatus } from "@/types/service.types"

const PAGE_SIZE = 6

const STATUS_META: Record<
  ServiceStatus,
  { label: string; pill: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    pill: "bg-emerald-500/15 text-emerald-400",
    dot: "bg-emerald-400",
  },
  INACTIVE: {
    label: "Inactive",
    pill: "bg-rose-500/15 text-rose-400",
    dot: "bg-rose-400",
  },
  DRAFT: {
    label: "Draft",
    pill: "bg-slate-500/15 text-slate-400",
    dot: "bg-slate-400",
  },
}

const STATUS_FILTERS: ("ALL" | ServiceStatus)[] = [
  "ALL",
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
]

const THUMB_GRADIENTS = [
  "from-indigo-700 to-violet-900",
  "from-amber-500 to-orange-700",
  "from-slate-800 to-black",
  "from-violet-700 to-fuchsia-900",
  "from-fuchsia-800 to-purple-950",
  "from-slate-800 to-slate-950",
]

const TIPS = [
  {
    icon: Lightbulb,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    title: "Create unique services",
    body: "Stand out with unique service titles and descriptions.",
  },
  {
    icon: Tag,
    color: "text-sky-400",
    bg: "bg-sky-500/15",
    title: "Set competitive prices",
    body: "Research the market and set fair prices for your services.",
  },
  {
    icon: ImageIcon,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    title: "Use high quality images",
    body: "Good visuals help clients trust your service.",
  },
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
  return Code2
}

function formatPrice(price: string | number) {
  const num = Number(price)
  return Number.isInteger(num) ? num.toLocaleString() : num.toFixed(2)
}

function lastMonths(count: number): { key: string; label: string }[] {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1)
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString(undefined, { month: "short" }),
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

function ServiceThumb({
  service,
  icon: Icon,
  className,
  iconSize = 18,
}: {
  service: Service
  icon: LucideIcon
  className?: string
  iconSize?: number
}) {
  const thumb =
    THUMB_GRADIENTS[
      Math.abs(
        service.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
      ) % THUMB_GRADIENTS.length
    ]

  if (service.thumbnail) {
    return (
      <img
        src={service.thumbnail}
        alt={service.title}
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

export default function MyServices() {
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch } = useFreelancerServices(
    user?.id ?? ""
  )
  const deleteService = useDeleteService()
  const [view, setView] = useState<"list" | "grid">("list")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"ALL" | ServiceStatus>("ALL")
  const [categoryId, setCategoryId] = useState("all")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const services = useMemo(() => data ?? [], [data])

  const stats = useMemo(() => {
    const active = services.filter((s) => s.status === "ACTIVE").length
    const draft = services.filter((s) => s.status === "DRAFT").length
    const reviews = services.reduce(
      (sum, s) => sum + (s._count?.reviews ?? 0),
      0
    )
    return { total: services.length, active, draft, reviews }
  }, [services])

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>()
    for (const s of services) {
      const cur = map.get(s.categoryId)
      if (cur) {
        cur.count++
      } else {
        map.set(s.categoryId, {
          id: s.categoryId,
          name: s.category.name,
          count: 1,
        })
      }
    }
    return [...map.values()]
  }, [services])

  const growthByMonth = useMemo(() => {
    const months = lastMonths(6)
    const buckets = new Map(months.map((m) => [m.key, 0]))
    for (const s of services) {
      const key = s.createdAt.slice(0, 7)
      if (buckets.has(key)) {
        buckets.set(key, buckets.get(key)! + 1)
      }
    }
    return months.map((m) => ({ ...m, value: buckets.get(m.key)! }))
  }, [services])

  const maxGrowth = Math.max(1, ...growthByMonth.map((d) => d.value))

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch = s.title
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus = status === "ALL" || s.status === status
      const matchesCategory =
        categoryId === "all" || s.categoryId === categoryId
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [services, search, status, categoryId])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteService.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and organize the services you offer to clients.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/dashboard/freelancer/services/new">
            <Plus size={16} />
            Add New Service
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Box}
          iconBg="bg-violet-500/15"
          iconColor="text-violet-400"
          label="Total Services"
          value={isLoading ? "—" : stats.total}
          sub="Active listings"
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
          label="Active Services"
          value={isLoading ? "—" : stats.active}
          sub="Visible to clients"
        />
        <StatCard
          icon={Eye}
          iconBg="bg-sky-500/15"
          iconColor="text-sky-400"
          label="Draft Services"
          value={isLoading ? "—" : stats.draft}
          sub="Not yet published"
        />
        <StatCard
          icon={Star}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-400"
          label="Reviews Received"
          value={isLoading ? "—" : stats.reviews}
          sub="Across all services"
        />
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm text-muted-foreground">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search your services..."
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Select
          value={categoryId}
          onValueChange={(v) => {
            setCategoryId(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as "ALL" | ServiceStatus)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "ALL" ? "All Statuses" : STATUS_META[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="List view"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isError ? (
        <div className="mt-5">
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <div className="mt-5">
          <LoadingState
            count={3}
            variant={view === "grid" ? "cards" : "rows"}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-5 rounded-2xl border bg-card py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">
            {services.length === 0
              ? "No services yet"
              : "No services match your filters"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {services.length === 0
              ? "Create your first service to start selling."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
          {/* Left: service list */}
          <div>
            {view === "list" ? (
              <div className="overflow-x-auto rounded-2xl border bg-card">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead>
                    <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-4 font-medium">Service</th>
                      <th className="px-4 py-4 font-medium">Category</th>
                      <th className="px-4 py-4 font-medium">Price</th>
                      <th className="px-4 py-4 font-medium">Status</th>
                      <th className="px-4 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((s) => {
                      const Icon = serviceIcon(s.title)
                      return (
                        <tr
                          key={s.id}
                          className="border-b last:border-0 hover:bg-muted/40"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-start gap-3">
                              <ServiceThumb
                                service={s}
                                icon={Icon}
                                className="h-11 w-11"
                                iconSize={16}
                              />
                            <div className="max-w-[240px] text-sm font-medium leading-snug">
                              {s.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {s.category.name}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          From{" "}
                          <span className="font-medium text-foreground">
                            ${formatPrice(s.price)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                              STATUS_META[s.status].pill
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                STATUS_META[s.status].dot
                              )}
                            />
                            {STATUS_META[s.status].label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Edit service"
                              asChild
                            >
                              <Link
                                to={`/dashboard/freelancer/services/${s.id}/edit`}
                              >
                                <Edit3 size={16} />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Delete service"
                              onClick={() => setDeleteTarget(s)}
                              className="text-muted-foreground hover:text-destructive"
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
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((s) => {
                  const meta = STATUS_META[s.status]
                  const Icon = serviceIcon(s.title)
                  return (
                    <div
                      key={s.id}
                      className="overflow-hidden rounded-2xl border bg-card"
                    >
                      <div className="relative">
                        <ServiceThumb
                          service={s}
                          icon={Icon}
                          className="h-28 w-full rounded-none"
                          iconSize={26}
                        />
                      </div>
                      <div className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium",
                              meta.pill
                            )}
                          >
                            <span
                              className={cn("h-1.5 w-1.5 rounded-full", meta.dot)}
                            />
                            {meta.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {s._count?.reviews ?? 0} reviews
                          </span>
                        </div>
                        <h4 className="text-sm font-medium leading-snug">
                          {s.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {s.category.name}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            From{" "}
                            <span className="font-semibold text-foreground">
                              ${formatPrice(s.price)}
                            </span>
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Edit service"
                              asChild
                            >
                              <Link
                                to={`/dashboard/freelancer/services/${s.id}/edit`}
                              >
                                <Edit3 size={15} />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Delete service"
                              onClick={() => setDeleteTarget(s)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Showing{" "}
                  {(safePage - 1) * PAGE_SIZE + 1} to{" "}
                  {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length} services
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Previous page"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronDown className="size-4 rotate-90" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <Button
                        key={n}
                        variant={n === safePage ? "default" : "outline"}
                        size="icon"
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Next page"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronDown className="size-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Grow your services */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-base font-semibold">Grow Your Services</h3>
              <div className="mt-4 flex h-16 items-end justify-center gap-1.5">
                {growthByMonth.map((d) => (
                  <div
                    key={d.key}
                    className="w-4 rounded-t-sm bg-gradient-to-t from-primary to-fuchsia-500"
                    style={{ height: `${(d.value / maxGrowth) * 100}%` }}
                  />
                ))}
                <TrendingUp
                  size={20}
                  className="ml-1 self-start text-emerald-400"
                />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Add more services and details to attract more clients and boost
                orders.
              </p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/dashboard/freelancer/services/new">
                  Add New Service
                </Link>
              </Button>
            </div>

            {/* Categories */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-base font-semibold">Categories</h3>
              <ul className="mt-4 space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => setCategoryId("all")}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      categoryId === "all"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span>All Categories</span>
                    <span className="text-muted-foreground">
                      {services.length}
                    </span>
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        categoryId === c.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span>{c.name}</span>
                      <span
                        className={
                          categoryId === c.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                      >
                        {c.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-base font-semibold">Tips</h3>
              <div className="mt-4 space-y-4">
                {TIPS.map((t) => (
                  <div key={t.title} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        t.bg
                      )}
                    >
                      <t.icon size={15} className={t.color} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {t.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-5 w-full">
                View All Tips
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.title}
              </span>{" "}
              from your services. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteService.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteService.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
