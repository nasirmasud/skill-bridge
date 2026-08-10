import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Home,
  ChevronRight,
  Heart,
  Star,
  Users,
  Check,
  ShieldCheck,
  Send,
  ChevronLeft,
  BadgeCheck,
  Loader2,
} from "lucide-react"
import { useService, useServices } from "@/hooks/useServices"
import { getErrorMessage, cn } from "@/lib/utils"
import type { Service } from "@/types/service.types"

function formatPrice(price: string | number) {
  const num = Number(price)
  return Number.isInteger(num) ? num.toLocaleString() : num.toFixed(2)
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }
        />
      ))}
    </span>
  )
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
        className="h-12 w-12 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-semibold text-white">
      {initials}
    </div>
  )
}

function RelatedCard({ service }: { service: Service }) {
  return (
    <Link
      to={`/services/${service.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-muted/30 transition hover:border-muted-foreground/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {service.thumbnail ? (
          <img
            src={service.thumbnail}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Home className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
        <button
          type="button"
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur transition hover:bg-black/60"
          aria-label="Save service"
        >
          <Heart size={14} className="text-white" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {service.freelancer.name}
          </span>
          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            Top Rated
          </span>
        </div>
        <h4 className="mt-2.5 line-clamp-2 text-sm leading-snug font-medium text-foreground">
          {service.title}
        </h4>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-foreground/80">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {service.avgRating ? service.avgRating.toFixed(1) : "—"}
            <span className="text-muted-foreground/70">
              ({service._count?.reviews ?? 0})
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            From{" "}
            <span className="font-semibold text-foreground">
              ${formatPrice(service.price)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ServiceDetails() {
  const { id = "" } = useParams()
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeTab, setActiveTab] = useState("Overview")
  const [liked, setLiked] = useState(false)

  const {
    data: service,
    isLoading,
    isError,
    error,
    refetch,
  } = useService(id)

  const { data: relatedData } = useServices({
    page: 1,
    limit: 4,
    categoryId: service?.categoryId,
  })

  const relatedServices = (relatedData?.data ?? []).filter(
    (s) => s.id !== service?.id
  )

  const images = service
    ? [service.thumbnail, ...service.gallery].filter(
        (img): img is string => Boolean(img)
      )
    : []

  useEffect(() => {
    setActiveThumb(0)
  }, [id])

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !service) {
    return (
      <div className="mx-auto w-full max-w-3xl bg-background px-8 py-16 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Service not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {getErrorMessage(error)}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/services"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Back to Services
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-gradient-to-r from-primary to-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const activeImage = images[activeThumb] ?? service.thumbnail ?? ""
  const tabs = [
    "Overview",
    "About the Seller",
    `Reviews (${service.reviewCount})`,
    "FAQ",
  ]

  return (
    <div className="bg-background font-sans">
      <div className="mx-auto w-full px-8 py-8 md:px-12 lg:px-16">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-2 hover:text-foreground">
            <Home size={15} /> Home
          </Link>
          <ChevronRight size={14} className="text-muted-foreground/50" />
          <Link to="/services" className="cursor-pointer hover:text-foreground">
            Services
          </Link>
          <ChevronRight size={14} className="text-muted-foreground/50" />
          <Link to="/services" className="cursor-pointer hover:text-foreground">
            {service.category.name}
          </Link>
          <ChevronRight size={14} className="text-muted-foreground/50" />
          <span className="line-clamp-1 max-w-md text-foreground">
            {service.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT COLUMN */}
          <div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_0.9fr]">
              {/* Gallery */}
              <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt="Service preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-sm text-muted-foreground">
                        No image available
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setLiked((l) => !l)}
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur transition hover:bg-black/60"
                    aria-label="Save service"
                  >
                    <Heart
                      size={17}
                      className={liked ? "fill-rose-500 text-rose-500" : "text-white"}
                    />
                  </button>
                </div>

                {images.length > 1 && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveThumb((t) => (t - 1 + images.length) % images.length)
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-muted-foreground/50 hover:text-foreground"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex gap-2 overflow-x-auto">
                      {images.map((t, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveThumb(i)}
                          className={cn(
                            "h-14 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition",
                            activeThumb === i
                              ? "border-primary"
                              : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        >
                          <img src={t} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveThumb((t) => (t + 1) % images.length)
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-muted-foreground/50 hover:text-foreground"
                      aria-label="Next image"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Title / info */}
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400">
                  <Star size={12} className="fill-amber-400" /> Top Rated Seller
                </span>

                <h1 className="mt-3 text-2xl leading-snug font-bold text-foreground sm:text-3xl">
                  {service.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    {service.avgRating ? service.avgRating.toFixed(1) : "—"}
                    <span className="font-normal text-muted-foreground">
                      ({service.reviewCount} reviews)
                    </span>
                  </span>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={14} /> {service.deliveryDays} day delivery
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                <ul className="mt-5 space-y-3">
                  {(service.highlights.length > 0
                    ? service.highlights
                    : ["Responsive on all devices", "SEO Optimized", "Fast Loading Speed"]
                  ).map((label) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 text-sm text-foreground/80"
                    >
                      <Check size={16} className="shrink-0 text-primary" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-10 flex gap-6 overflow-x-auto border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-3 text-sm font-medium whitespace-nowrap transition",
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* About this service */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                About this service
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>

              <h3 className="mt-6 mb-3 text-sm font-semibold text-foreground">
                What you will get:
              </h3>
              <ul className="space-y-2.5">
                {(service.whatYouGet.length > 0
                  ? service.whatYouGet
                  : ["Professional Quality Work", "On-Time Delivery", "Clear Communication"]
                ).map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-foreground/80"
                  >
                    <Check size={16} className="shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools & Technologies */}
            {service.tools.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Tools & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground/80"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* What buyers say */}
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  What buyers say
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab(`Reviews (${service.reviewCount})`)}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                >
                  See all reviews <ChevronRight size={14} />
                </button>
              </div>

              {service.reviews.length === 0 ? (
                <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No reviews yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Be the first to review this service.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {service.reviews.slice(0, 2).map((review) => (
                    <div
                      key={review.id}
                      className="rounded-2xl border border-border bg-muted/30 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={review.client.name}
                          src={review.client.profileImg}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {review.client.name}
                            </span>
                            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                              Verified
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1">
                            <Stars rating={review.rating} />
                            <span className="ml-1 text-xs text-muted-foreground">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {review.comment ?? "No comment provided."}
                      </p>
                      <span className="mt-3 block text-xs text-muted-foreground/60">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-5">
            {/* Package card */}
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <span className="text-sm text-muted-foreground">
                {service.packageName ?? "Basic Package"}
              </span>
              <div className="mt-1 text-3xl font-bold text-foreground">
                ${formatPrice(service.price)}
              </div>

              <ul className="mt-4 space-y-2.5">
                {(service.packageFeatures.length > 0
                  ? service.packageFeatures
                  : [
                      `${service.deliveryDays} Day Delivery`,
                      "Responsive Design",
                      "Clear Communication",
                    ]
                ).map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-foreground/80"
                  >
                    <Check size={15} className="shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-2.5 font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:from-blue-500 hover:to-violet-500"
              >
                Continue (${formatPrice(service.price)})
              </button>
              <button
                type="button"
                className="mt-2.5 w-full rounded-xl border border-border py-2.5 font-medium text-foreground/80 transition hover:bg-muted"
              >
                Contact Seller
              </button>
            </div>

            {/* Seller card */}
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <div className="flex items-center gap-3">
                <Avatar
                  name={service.freelancer.name}
                  src={service.freelancer.profileImg}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">
                      {service.freelancer.name}
                    </span>
                    <BadgeCheck size={14} className="text-primary" />
                  </div>
                  <span className="text-xs text-primary">Top Rated Seller</span>
                  <div className="mt-0.5 flex items-center gap-1">
                    <Stars rating={Math.round(service.avgRating)} />
                    <span className="text-xs text-muted-foreground">
                      {service.avgRating ? service.avgRating.toFixed(1) : "—"} (
                      {service.reviewCount})
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 border-t border-border pt-4 text-center">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {service.deliveryDays} days
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground/70">
                    Delivery
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    ${formatPrice(service.price)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground/70">
                    Starting at
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {service.reviewCount}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground/70">
                    Reviews
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-xl border border-primary/30 py-2.5 font-medium text-primary transition hover:bg-primary/10"
              >
                View Seller Profile
              </button>
              <button
                type="button"
                className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 py-2.5 font-medium text-primary transition hover:bg-primary/10"
              >
                <Send size={14} /> Message Seller
              </button>
            </div>

            {/* Secure payments */}
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <ShieldCheck size={17} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  Secure Payments
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Your transaction is protected by our escrow system.
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* You might also like */}
        {relatedServices.length > 0 && (
          <div className="mt-14">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                You might also like
              </h3>
              <Link
                to="/services"
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                View all services <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((s) => (
                <RelatedCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
