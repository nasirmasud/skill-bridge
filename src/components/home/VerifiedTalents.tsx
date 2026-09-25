import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Clock, Star } from "lucide-react"
import { useServices } from "@/hooks/useServices"
import { ErrorState } from "@/components/shared/ErrorState"
import { getErrorMessage } from "@/lib/utils"
import { formatCurrency, formatRating } from "@/lib/format"
import type { Service } from "@/types/service.types"

const NOTE =
  "Ratings and counts come from reviews clients left after completed orders. Names, photos and bios are the seller's own."

type Seller = {
  id: string
  name: string
  profileImg: string | null
  bio: string | null
  services: Service[]
  reviews: number
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function deliveryLabel(days: number) {
  return days <= 1 ? "24 hours" : `${days} days`
}

function Avatar({ seller }: { seller: Seller }) {
  if (seller.profileImg) {
    return (
      <img
        data-slot="talent-avatar"
        src={seller.profileImg}
        alt={seller.name}
        loading="lazy"
        className="size-16 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <span
      data-slot="talent-avatar"
      className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-container font-label-numeric text-headline-sm text-on-primary-container"
    >
      {initialsOf(seller.name)}
    </span>
  )
}

function TalentCard({ seller }: { seller: Seller }) {
  const featured = seller.services[0]
  const reviewCount = featured._count?.reviews ?? 0
  const categories = [...new Set(seller.services.map((service) => service.category?.name))]
    .filter(Boolean)
    .slice(0, 2)

  return (
    <article
      data-slot="talent-card"
      className="group flex flex-col justify-between rounded-2xl bg-surface-container-low p-space-lg shadow-sm transition-all hover:bg-surface-container hover:shadow-lg"
    >
      <div>
        <div className="mb-space-md flex items-start gap-4">
          <Avatar seller={seller} />
          <div className="min-w-0 flex-1">
            <h3
              data-slot="talent-name"
              className="truncate font-headline-sm text-headline-sm font-semibold text-on-surface"
            >
              {seller.name}
            </h3>
            <p
              data-slot="talent-descriptor"
              className="line-clamp-2 font-body-sm text-body-sm text-on-surface-variant"
            >
              {seller.bio || categories[0]}
            </p>
          </div>
        </div>
        <span
          data-slot="talent-service-label"
          className="font-label-caps text-label-caps tracking-wider text-on-surface-variant uppercase"
        >
          Most-reviewed listing
        </span>
        <Link
          data-slot="talent-service"
          to={`/services/${featured.id}`}
          className="mt-1 line-clamp-2 block font-body-md text-body-md font-medium text-on-surface hover:underline"
        >
          {featured.title}
        </Link>
        <p
          data-slot="talent-rating"
          className="mt-1 flex items-center gap-1 font-caption text-caption text-on-surface-variant"
        >
          {reviewCount > 0 ? (
            <>
              <Star
                className="size-4 fill-tertiary text-tertiary"
                aria-hidden="true"
              />
              <span className="font-label-numeric text-label-numeric font-semibold text-on-surface">
                {formatRating(featured.avgRating)}
              </span>{" "}
              <span>({reviewCount} reviews)</span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <span
              key={category}
              data-slot="talent-category"
              className="rounded bg-surface-container-high px-2 py-0.5 font-label-caps text-[11px] text-on-surface-variant"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-space-lg flex items-center justify-between border-t border-outline-variant/30 pt-space-sm">
        <span
          data-slot="talent-price"
          className="font-label-numeric text-headline-sm font-semibold text-on-surface"
        >
          {formatCurrency(featured.price)}
        </span>
        <span
          data-slot="talent-delivery"
          className="flex items-center gap-1 font-caption text-caption text-tertiary"
        >
          <Clock className="size-4" aria-hidden="true" />
          {deliveryLabel(featured.deliveryDays)}
        </span>
      </div>
    </article>
  )
}

function TalentSkeleton() {
  return (
    <div data-slot="talent-skeleton" className="h-80 rounded-2xl bg-surface-container-low shadow-sm" />
  )
}

export function VerifiedTalents() {
  const { data, isLoading, isError, error, refetch } = useServices({ limit: 12 })
  const services = useMemo(() => data?.data ?? [], [data])
  const sellers = useMemo(() => {
    const groups = new Map<string, Seller>()
    for (const service of services) {
      const freelancer = service.freelancer
      if (!freelancer?.id) continue
      const bucket = groups.get(freelancer.id)
      const reviews = service._count?.reviews ?? 0
      if (bucket) {
        bucket.services.push(service)
        bucket.reviews += reviews
      } else {
        groups.set(freelancer.id, {
          id: freelancer.id,
          name: freelancer.name,
          profileImg: freelancer.profileImg,
          bio: freelancer.bio ?? null,
          services: [service],
          reviews,
        })
      }
    }
    return [...groups.values()]
      .map((seller) => ({
        ...seller,
        services: [...seller.services].sort(
          (first, second) =>
            (second._count?.reviews ?? 0) - (first._count?.reviews ?? 0) ||
            first.title.localeCompare(second.title),
        ),
      }))
      .sort(
        (first, second) =>
          second.reviews - first.reviews || first.name.localeCompare(second.name),
      )
      .slice(0, 3)
  }, [services])

  return (
    <section
      id="verified-talents"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="mb-space-lg flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span
            data-slot="section-kicker"
            className="font-label-caps text-label-caps tracking-wider text-primary uppercase"
          >
            Seller Spotlight
          </span>
          <h2 className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface">
            Meet the Sellers Behind the Live Listings
          </h2>
        </div>
        <p
          data-slot="section-note"
          className="max-w-sm font-body-sm text-body-sm text-on-surface-variant md:text-right"
        >
          {NOTE}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
        {isError ? (
          <div className="col-span-full">
            <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <TalentSkeleton key={index} />)
        ) : sellers.length === 0 ? (
          <p
            data-slot="talent-empty"
            className="col-span-full py-10 text-center font-body-sm text-body-sm text-on-surface-variant"
          >
            No seller listings yet — check back soon.
          </p>
        ) : (
          sellers.map((seller) => <TalentCard key={seller.id} seller={seller} />)
        )}
      </div>
    </section>
  )
}
