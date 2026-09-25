import { BadgeCheck, Star } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Jordan Walsh",
    role: "CTO @ HyperScale AI",
    initials: "JW",
    avatarClass: "bg-primary-container/30 text-on-primary-container",
    quote:
      "Alex restructured our SaaS multi-tenant Prisma database in 3 days. Query response times dropped by 72%, and our deployment went off without a single drop of production traffic.",
  },
  {
    name: "Rachel Sterling",
    role: "VP Product @ Kroma Health",
    initials: "RS",
    avatarClass: "bg-tertiary-container/30 text-on-tertiary-container",
    quote:
      "The design system deliverables Elena created were so clean that our front-end squad implemented the tokens into Tailwind v4 in less than 48 hours. Absolute masterclass in UX craftsmanship.",
  },
  {
    name: "Tariq Mansoor",
    role: "Principal Eng @ NovaPay",
    initials: "TM",
    avatarClass: "bg-secondary-container/40 text-on-secondary-container",
    quote:
      "Skillbridge's price snapshotting and escrow state machine give our procurement department total peace of mind. We booked Marcus for our RAG assistant and shipped ahead of schedule.",
  },
] as const

function Rating() {
  return (
    <div
      className="mb-3 flex items-center gap-1 text-tertiary"
      role="img"
      aria-label="5 out of 5 stars"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="size-4 fill-current"
          aria-hidden="true"
        />
      ))}
      <span className="ml-2 font-label-caps text-label-caps text-outline">
        5.0 / 5.0
      </span>
    </div>
  )
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof TESTIMONIALS)[number]
}) {
  return (
    <article
      data-slot="testimonial-card"
      className="flex flex-col justify-between rounded-2xl bg-surface-container-low p-space-lg shadow-md"
    >
      <div>
        <Rating />
        <blockquote className="font-body-md text-body-md italic text-on-surface">
          “{testimonial.quote}”
        </blockquote>
      </div>
      <div className="mt-space-md flex items-center gap-3 border-t border-outline-variant/20 pt-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full font-label-numeric text-label-numeric font-semibold ${testimonial.avatarClass}`}
          aria-hidden="true"
        >
          {testimonial.initials}
        </span>
        <div className="min-w-0">
          <p className="font-body-sm text-body-sm font-semibold text-on-surface">
            {testimonial.name}
          </p>
          <p className="flex items-center gap-1.5 font-caption text-caption text-outline">
            <BadgeCheck className="size-3.5 shrink-0 text-tertiary" aria-hidden="true" />
            {testimonial.role} · Verified Client
          </p>
        </div>
      </div>
    </article>
  )
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      data-slot="testimonials"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="mb-space-lg flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-label-caps text-label-caps tracking-wider text-primary uppercase">
            Uncompromising Quality
          </span>
          <h2 className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface">
            Verified Reviews from Engineering Leaders
          </h2>
        </div>
        <p className="max-w-sm font-body-sm text-body-sm text-outline">
          Every review is mathematically tied to a completed transaction with locked
          price data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </section>
  )
}
