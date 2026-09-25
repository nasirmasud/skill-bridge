import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Star } from "lucide-react"
import { useServices } from "@/hooks/useServices"
import { ErrorState } from "@/components/shared/ErrorState"
import { getErrorMessage } from "@/lib/utils"
import { formatCurrency, formatRating } from "@/lib/format"
import type { Service } from "@/types/service.types"

const FILTERS = [
  { key: "all", label: "All Picks" },
  { key: "price", label: "Under $1k" },
  { key: "express", label: "Express 24h" },
] as const

type FilterKey = (typeof FILTERS)[number]["key"]

function deliveryLabel(days: number) {
  return days <= 1 ? "Express 24h" : `${days} Days Delivery`
}

function sellerTier(rating?: number) {
  return rating !== undefined && rating >= 4.9 ? "Top Rated Plus" : "Verified Seller"
}

function Avatar({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (src) {
    return (
      <img
        data-slot="service-avatar"
        src={src}
        alt={name}
        loading="lazy"
        className="size-7 rounded-full object-cover"
      />
    )
  }

  return (
    <span
      data-slot="service-avatar"
      className="flex size-7 items-center justify-center rounded-full bg-primary-container font-label-numeric text-label-numeric text-on-primary-container"
    >
      {initials}
    </span>
  )
}

function ServiceCard({ service }: { service: Service }) {
  const reviewCount = service._count?.reviews ?? 0
  const isExpress = service.deliveryDays <= 1

  return (
    <Link
      to={`/services/${service.id}`}
      data-slot="service-card"
      className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-md transition-all hover:shadow-xl"
    >
      <div
        data-slot="service-media"
        className="relative h-48 w-full overflow-hidden bg-surface-container-highest"
      >
        {service.thumbnail ? (
          <img
            src={service.thumbnail}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <span
          data-slot="service-delivery"
          className={`absolute left-3 top-3 rounded-md bg-surface-container-lowest/80 px-2.5 py-1 font-label-caps text-label-caps backdrop-blur ${
            isExpress ? "text-primary" : "text-tertiary"
          }`}
        >
          {deliveryLabel(service.deliveryDays)}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-space-md">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Avatar
              name={service.freelancer.name}
              src={service.freelancer.profileImg}
            />
            <span
              data-slot="service-seller-name"
              className="min-w-0 truncate font-body-sm text-body-sm font-medium text-on-surface"
            >
              {service.freelancer.name}
            </span>
            <span
              data-slot="service-tier"
              className={`shrink-0 rounded px-1.5 py-0.5 font-label-caps text-[10px] leading-tight font-semibold ${
                (service.avgRating ?? 0) >= 4.9
                  ? "bg-primary-container/30 text-on-surface"
                  : "bg-on-secondary-container/20 text-on-secondary-container"
              }`}
            >
              {sellerTier(service.avgRating)}
            </span>
          </div>

          <h4
            data-slot="service-title"
            className="line-clamp-2 font-headline-sm text-headline-sm text-on-surface transition-colors group-hover:text-primary"
          >
            {service.title}
          </h4>

          <div data-slot="service-rating" className="mt-2 flex items-center gap-2">
            <Star className="size-4 shrink-0 fill-current text-tertiary" />
            <span
              data-slot="service-rating-value"
              className="font-label-numeric text-body-sm font-semibold text-on-surface"
            >
              {formatRating(service.avgRating)}
            </span>
            <span
              data-slot="service-reviews"
              className="font-caption text-caption text-on-surface-variant"
            >
              ({reviewCount} reviews)
            </span>
          </div>

          <ul data-slot="service-tags" className="mt-3 flex flex-wrap gap-1.5">
            {service.tools.slice(0, 3).map((tool) => (
              <li
                key={tool}
                className="rounded bg-surface-container px-2 py-0.5 font-caption text-caption text-on-surface-variant"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>

        <div
          data-slot="service-footer"
          className="-mx-space-md -mb-space-md mt-space-md flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-lowest/40 px-space-md py-space-md"
        >
          <div className="min-w-0">
            <span
              data-slot="service-price-label"
              className="block font-caption text-caption text-on-surface-variant"
            >
              Starting at
            </span>
            <span
              data-slot="service-price"
              className="font-label-numeric text-headline-sm font-semibold text-on-surface"
            >
              {formatCurrency(service.price)}
            </span>
          </div>
          <span
            data-slot="service-quick-view"
            className="shrink-0 rounded-lg bg-surface-container-high px-3.5 py-1.5 font-body-sm text-body-sm font-medium text-on-surface transition-colors group-hover:bg-primary-container group-hover:text-on-primary-container"
          >
            Quick View
          </span>
        </div>
      </div>
    </Link>
  )
}

function CardSkeleton() {
  return (
    <div
      data-slot="service-card-skeleton"
      className="flex flex-col overflow-hidden rounded-xl bg-surface-container-low"
    >
      <div className="h-48 w-full animate-pulse bg-surface-container-highest" />
      <div className="space-y-3 p-space-md">
        <div className="h-7 w-1/2 animate-pulse rounded bg-surface-container" />
        <div className="h-5 w-full animate-pulse rounded bg-surface-container" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-surface-container" />
        <div className="h-9 w-full animate-pulse rounded bg-surface-container" />
      </div>
    </div>
  )
}

export function PopularServices() {
  const { data, isLoading, isError, error, refetch } = useServices({
    limit: 4,
  })
  const [filter, setFilter] = useState<FilterKey>("all")

  const services = useMemo(() => data?.data ?? [], [data])
  const visible = useMemo(() => {
    if (filter === "price") {
      return services.filter((service) => Number(service.price) < 1000)
    }
    if (filter === "express") {
      return services.filter((service) => service.deliveryDays <= 1)
    }
    return services
  }, [filter, services])

  return (
    <section
      id="popular-services"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="mb-space-lg flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span
            data-slot="section-kicker"
            className="font-label-caps text-label-caps tracking-wider text-tertiary uppercase"
          >
            Curated Excellence
          </span>
          <h2 className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface">
            Top-Performing Services Ready for Checkout
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((option) => {
            const isActive = filter === option.key
            return (
              <button
                key={option.key}
                type="button"
                data-filter={option.key}
                aria-pressed={isActive}
                onClick={() => setFilter(option.key)}
                className={`rounded-lg px-3 py-1.5 font-body-sm text-body-sm font-medium transition-colors ${
                  isActive
                    ? "bg-surface-container text-on-surface"
                    : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-4">
        {isError ? (
          <div className="col-span-full">
            <ErrorState
              message={getErrorMessage(error)}
              onRetry={() => refetch()}
            />
          </div>
        ) : isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : visible.length === 0 ? (
          <p className="col-span-full py-10 text-center font-body-sm text-body-sm text-on-surface-variant">
            {services.length === 0
              ? "No services yet — check back soon."
              : "No services match this filter."}
          </p>
        ) : (
          visible.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        )}
      </div>
    </section>
  )
}
