import { Link } from "react-router-dom"
import { Heart, Star, ArrowRight, Grid } from "lucide-react"
import { useServices } from "@/hooks/useServices"
import { ErrorState } from "@/components/shared/ErrorState"
import { getErrorMessage } from "@/lib/utils"
import type { Service } from "@/types/service.types"

function formatPrice(price: string | number) {
  const num = Number(price)
  return Number.isInteger(num) ? num.toLocaleString() : num.toFixed(2)
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
        className="h-7 w-7 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[11px] font-semibold text-white">
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
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
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
          aria-label="Save service"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Seller */}
        <div className="flex items-center gap-2">
          <Avatar
            name={service.freelancer.name}
            src={service.freelancer.profileImg}
          />
          <span className="text-sm font-medium text-foreground">
            {service.freelancer.name}
          </span>
          <span className="text-xs text-primary">
            {service.avgRating ? "Top Rated" : "Freelancer"}
          </span>
        </div>

        {/* Title */}
        <p className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
          {service.title}
        </p>

        {/* Rating + price */}
        <div className="mt-3 flex items-center justify-between">
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

export function PopularServices() {
  const { data, isLoading, isError, error, refetch } = useServices({
    limit: 6,
  })
  const services = data?.data ?? []

  return (
    <section className="w-full bg-background px-6 py-10 pb-28">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Popular services
          </h2>
          <Link
            to="/services"
            className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {isError ? (
            <div className="col-span-full">
              <ErrorState
                message={getErrorMessage(error)}
                onRetry={() => refetch()}
              />
            </div>
          ) : isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card/50"
              >
                <div className="h-44 w-full bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-5 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              </div>
            ))
          ) : services.length === 0 ? (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No services yet — check back soon.
            </p>
          ) : (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
