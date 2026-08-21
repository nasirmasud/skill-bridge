import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Star, ShieldCheck, RotateCcw, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

const AVATARS = [
  "https://i.pravatar.cc/64?img=12",
  "https://i.pravatar.cc/64?img=32",
  "https://i.pravatar.cc/64?img=47",
]

const POPULAR_TAGS = [
  "Web Design",
  "Logo Design",
  "Video Editing",
  "SEO",
  "WordPress",
]

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% protected",
  },
  {
    icon: RotateCcw,
    title: "Money Back Guarantee",
    subtitle: "14-day guarantee",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We're here to help",
  },
]

const SAMPLE_SERVICES = [
  {
    name: "Sadia Rahman",
    avatar: "https://i.pravatar.cc/64?img=47",
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=640&q=80&auto=format&fit=crop",
    title: "Modern website design & development",
    rating: "4.9",
    reviews: 214,
    price: 120,
    wrapper:
      "lg:absolute lg:left-0 lg:top-4 lg:-rotate-3 motion-safe:lg:animate-[hero-float_7s_ease-in-out_infinite]",
  },
  {
    name: "Marcus Lee",
    avatar: "https://i.pravatar.cc/64?img=32",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=640&q=80&auto=format&fit=crop",
    title: "Minimal logo design for your brand",
    rating: "4.8",
    reviews: 168,
    price: 85,
    wrapper:
      "lg:absolute lg:bottom-8 lg:right-0 lg:rotate-2 motion-safe:lg:animate-[hero-float_9s_ease-in-out_1s_infinite]",
  },
]

function AvatarStack({ size = "h-5 w-5" }: { size?: string }) {
  return (
    <div className="flex -space-x-2">
      {AVATARS.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={`${size} rounded-full border-2 border-background object-cover`}
        />
      ))}
    </div>
  )
}

function MiniServiceCard({
  service,
  className = "",
}: {
  service: (typeof SAMPLE_SERVICES)[number]
  className?: string
}) {
  return (
    <div
      className={`w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/5 lg:w-72 ${className}`}
    >
      <div className="relative h-36 w-full overflow-hidden bg-muted">
        <img
          src={service.thumbnail}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <img
            src={service.avatar}
            alt=""
            aria-hidden="true"
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-foreground">
            {service.name}
          </span>
          <span className="text-xs font-medium text-primary">Top Rated</span>
        </div>
        <p className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
          {service.title}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {service.rating}
            </span>
            <span className="text-muted-foreground">
              ({service.reviews})
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            From{" "}
            <span className="font-semibold text-foreground">
              ${service.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const submitSearch = (value: string) => {
    const term = value.trim()
    navigate(term ? `/services?search=${encodeURIComponent(term)}` : "/services")
  }

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Full-banner background image */}
      <img
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&auto=format&fit=crop"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Readability overlays (theme-aware) */}
      <div className="pointer-events-none absolute inset-0 bg-background/75" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/30" />

      {/* Soft brand tint */}
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-25%] left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative mx-auto grid w-full grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-12 lg:py-24 xl:px-16">
        {/* Left column */}
        <div className="flex flex-col space-y-7">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-muted/60 py-1.5 pl-3 pr-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Trusted by 10K+ businesses worldwide</span>
            <AvatarStack />
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl xl:text-6xl">
            Find the perfect{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 h-3 rounded-sm bg-primary/15 sm:h-4"
              />
              <span className="relative">freelance service</span>
            </span>{" "}
            for your business
          </h1>

          {/* Subcopy */}
          <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
            Connect with talented freelancers and get high-quality work done —
            fast, reliable, and hassle-free.
          </p>

          {/* Search bar */}
          <form
            className="flex h-14 w-full max-w-xl items-center gap-2 rounded-2xl border border-border bg-card p-2 pl-4 shadow-sm transition-shadow focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10"
            onSubmit={(e) => {
              e.preventDefault()
              submitSearch(query)
            }}
          >
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What service are you looking for?"
              className="h-full w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button type="submit" size="lg" className="h-full rounded-xl px-6">
              Search
            </Button>
          </form>

          {/* Popular tags */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => submitSearch(tag)}
                className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3 sm:gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — marketplace collage */}
        <div className="relative flex flex-col items-center justify-center gap-6 lg:block lg:h-[540px]">
          {/* Backdrop blob */}
          <div className="absolute left-1/2 top-1/2 hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl lg:block" />

          {SAMPLE_SERVICES.map((service) => (
            <MiniServiceCard
              key={service.name}
              service={service}
              className={service.wrapper}
            />
          ))}

          {/* Floating rating chip */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-md lg:absolute lg:right-10 lg:top-[38%] motion-safe:lg:animate-[hero-float_8s_ease-in-out_0.5s_infinite]">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">4.9</span>
            <span className="text-xs text-muted-foreground">
              Average rating
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
