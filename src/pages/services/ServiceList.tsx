import { useEffect, useState, type ReactNode } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  Home,
  ChevronRight,
  Search,
  Grid,
  ChevronDown,
  SlidersHorizontal,
  Code2,
  Palette,
  PenTool,
  TrendingUp,
  Video,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Rocket,
  Star,
  Heart,
  ArrowLeft,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { useServices } from "@/hooks/useServices"
import { LoadingState } from "@/components/shared/LoadingState"
import { ErrorState } from "@/components/shared/ErrorState"
import { Pagination } from "@/components/shared/Pagination"
import { getErrorMessage, cn } from "@/lib/utils"
import type { Category, Service } from "@/types/service.types"

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Palette,
  PenTool,
  TrendingUp,
  Video,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Grid,
}

const PAGE_SIZE = 8

function formatPrice(price: string | number) {
  const num = Number(price)
  return Number.isInteger(num) ? num.toLocaleString() : num.toFixed(2)
}

function categoryIcon(category: Category | null): LucideIcon {
  if (!category?.icon) return Grid
  return ICON_MAP[category.icon] ?? Grid
}

function Avatar({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="h-7 w-7 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[11px] font-semibold text-white">
      {initials}
    </div>
  )
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to={`/services/${service.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-card/50 transition-colors hover:border-primary/30"
    >
      <div className="relative h-40 overflow-hidden bg-muted">
        {service.thumbnail ? (
          <img
            src={service.thumbnail}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Grid className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        <button
          type="button"
          aria-label="Save"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur transition-colors hover:bg-black/60"
        >
          <Heart className="h-4 w-4 text-white" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Avatar
            name={service.freelancer.name}
            src={service.freelancer.profileImg}
          />
          <span className="text-sm font-medium text-foreground">
            {service.freelancer.name}
          </span>
          <span className="text-xs font-medium text-primary">Top Rated</span>
        </div>
        <h3 className="mb-3 line-clamp-2 text-[15px] leading-snug font-medium text-foreground">
          {service.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {service.avgRating ? service.avgRating.toFixed(1) : "—"}
            </span>
            <span className="text-muted-foreground">
              ({service._count?.reviews ?? 0})
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            From{" "}
            <span className="font-semibold text-foreground">
              ${formatPrice(service.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ServiceList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategoryId = searchParams.get("categoryId") ?? null
  const query = searchParams.get("search") ?? ""
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)

  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const setSearch = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set("search", value)
    else params.delete("search")
    params.delete("page")
    setSearchParams(params, { replace: true })
  }

  const setCategory = (id: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (id) params.set("categoryId", id)
    else params.delete("categoryId")
    params.delete("page")
    setSearchParams(params, { replace: true })
  }

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(Math.max(1, next)))
    setSearchParams(params, { replace: true })
  }

  const { data: categories } = useCategories()
  const {
    data: serviceData,
    isLoading,
    isError,
    error,
    refetch,
  } = useServices({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery || undefined,
    categoryId: activeCategoryId ?? undefined,
  })

  const services = serviceData?.data ?? []
  const meta = serviceData?.meta
  const total = meta?.total ?? 0
  const activeCategory = categories?.find((c) => c.id === activeCategoryId)

  return (
    <div className="bg-background font-sans">
      <div className="mx-auto w-full px-8 py-8 md:px-12 lg:px-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="h-4 w-4" />
          <span>Home</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground/80">Services</span>
        </nav>

        {/* Hero */}
        <div className="relative mb-10 flex items-start justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="mb-4 text-4xl leading-tight font-bold md:text-[44px]">
              Explore our professional
              <br />
              services
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Find the perfect service for your business from talented
              freelancers around the world.
            </p>
          </div>

          {/* Decorative hero graphic */}
          <div className="relative hidden h-52 w-64 shrink-0 md:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/20 to-indigo-600/20 shadow-[0_0_60px_-5px_rgba(139,92,246,0.5)]">
                <Briefcase className="h-12 w-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            {[
              { Icon: Code2, pos: "top-0 left-6" },
              { Icon: TrendingUp, pos: "top-1 right-2" },
              { Icon: PenTool, pos: "top-16 right-0" },
              { Icon: ShieldCheck, pos: "bottom-2 right-4" },
              { Icon: Video, pos: "bottom-4 left-2" },
              { Icon: Palette, pos: "top-16 left-0" },
            ].map(({ Icon, pos }, i) => (
              <div
                key={i}
                className={`absolute ${pos} flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-card shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)]`}
              >
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-8 flex flex-col items-stretch gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="button"
            onClick={() => setCategory(null)}
            className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm whitespace-nowrap text-muted-foreground"
          >
            <Grid className="h-4 w-4" />
            {activeCategory?.name ?? "All Categories"}
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm whitespace-nowrap text-muted-foreground"
          >
            Sort by: <span className="font-medium text-foreground">Popular</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm whitespace-nowrap text-muted-foreground"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              Categories
            </h2>
            <nav className="mb-6 space-y-1">
              <CategoryButton
                active={activeCategoryId === null}
                name="All Services"
                icon={<Grid className="h-4 w-4" strokeWidth={1.75} />}
                count={total}
                onClick={() => setCategory(null)}
              />
              {categories?.map((c) => {
                const Icon = categoryIcon(c)
                return (
                  <CategoryButton
                    key={c.id}
                    active={activeCategoryId === c.id}
                    name={c.name}
                    icon={<Icon className="h-4 w-4" strokeWidth={1.75} />}
                    count={c.serviceCount}
                    onClick={() => setCategory(c.id)}
                  />
                )
              })}
            </nav>

            {/* Custom request card */}
            <div className="rounded-2xl border border-border bg-card/50 p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                <Rocket className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                Need something custom?
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                Can&apos;t find what you&apos;re looking for? Post a custom
                request and get proposals from freelancers.
              </p>
              <button className="w-full rounded-lg bg-gradient-to-r from-primary to-indigo-600 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                Post a Request
              </button>
            </div>
          </aside>

          {/* Main grid */}
          <main className="flex-1">
            <p className="mb-4 text-sm text-muted-foreground">
              Showing {services.length} of {total} services
            </p>

            {isError ? (
              <ErrorState
                message={getErrorMessage(error)}
                onRetry={() => refetch()}
              />
            ) : isLoading ? (
              <LoadingState count={8} />
            ) : services.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/50 py-16 text-center">
                <p className="text-sm font-medium text-foreground">
                  No services found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or category.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
                  {services.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>

                {meta && meta.total > meta.limit && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={meta.page <= 1}
                      onClick={() => setPage(meta.page - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <Pagination
                      meta={meta}
                      onPageChange={setPage}
                      className="hidden sm:flex"
                    />
                    <button
                      type="button"
                      disabled={meta.page >= Math.ceil(total / meta.limit)}
                      onClick={() => setPage(meta.page + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* CTA footer */}
        <div className="mx-auto mt-14 flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/50 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Ready to get started?
              </h3>
              <p className="text-xs text-muted-foreground">
                Join thousands of businesses that trust SkillBridge for their
                projects.
              </p>
            </div>
          </div>
          <button className="rounded-lg bg-gradient-to-r from-primary to-indigo-600 px-5 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90">
            Post a Project
          </button>
        </div>
      </div>
    </div>
  )
}

interface CategoryButtonProps {
  active: boolean
  name: string
  icon: ReactNode
  count?: number
  onClick: () => void
}

function CategoryButton({
  active,
  name,
  icon,
  count,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2.5">
          {icon}
          <span className="truncate">{name}</span>
        </span>
        {count !== undefined && (
          <span
            className={cn(
              "shrink-0 rounded-md px-1.5 py-0.5 text-xs",
              active ? "bg-primary/20 text-primary" : "text-muted-foreground/60"
            )}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  )
}
