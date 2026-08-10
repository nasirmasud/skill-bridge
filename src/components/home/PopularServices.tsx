import { Heart, Star, ArrowRight } from "lucide-react"

const SERVICES = [
  {
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&q=80&auto=format&fit=crop",
    seller: "John Doe",
    avatar: "https://i.pravatar.cc/64?img=14",
    badge: "Level 2 Seller",
    title: "Build a responsive website",
    rating: "4.9",
    reviews: 320,
    price: "150",
  },
  {
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80&auto=format&fit=crop",
    seller: "Sara Smith",
    avatar: "https://i.pravatar.cc/64?img=47",
    badge: "Top Rated Seller",
    title: "Design modern minimal logo",
    rating: "5.0",
    reviews: 540,
    price: "50",
  },
  {
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=80&auto=format&fit=crop",
    seller: "Mike Johnson",
    avatar: "https://i.pravatar.cc/64?img=13",
    badge: "Level 2 Seller",
    title: "Edit professional video",
    rating: "4.8",
    reviews: 210,
    price: "80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571677208775-fd71941aa474?w=500&q=80&auto=format&fit=crop",
    seller: "Emily Brown",
    avatar: "https://i.pravatar.cc/64?img=48",
    badge: "Top Rated Seller",
    title: "Do SEO keyword research",
    rating: "4.9",
    reviews: 410,
    price: "40",
  },
  {
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&q=80&auto=format&fit=crop",
    seller: "Chris Lee",
    avatar: "https://i.pravatar.cc/64?img=15",
    badge: "Level 2 Seller",
    title: "Write engaging blog content",
    rating: "4.7",
    reviews: 185,
    price: "35",
  },
  {
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&q=80&auto=format&fit=crop",
    seller: "Olivia Martin",
    avatar: "https://i.pravatar.cc/64?img=49",
    badge: "Level 1 Seller",
    title: "Compose custom background music",
    rating: "4.8",
    reviews: 260,
    price: "95",
  },
]

export function PopularServices() {
  return (
    <section className="w-full bg-background px-6 py-10 pb-28">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Popular services
          </h2>
          <a
            href="#services"
            className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all services
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group overflow-hidden rounded-2xl border border-border bg-card/50 transition-colors hover:border-primary/30"
            >
              {/* Thumbnail */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
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
                  <img
                    src={service.avatar}
                    alt={service.seller}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {service.seller}
                  </span>
                  <span className="text-xs text-primary">{service.badge}</span>
                </div>

                {/* Title */}
                <p className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
                  {service.title}
                </p>

                {/* Rating + price */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{service.rating}</span>
                    <span className="text-muted-foreground">({service.reviews})</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    From <span className="font-semibold text-foreground">${service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
