import { Link } from "react-router-dom"
import { BadgeDollarSign, Rocket, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type CtaCard = {
  id: "hire" | "sell"
  label: string
  title: string
  body: string
  icon: LucideIcon
  badgeClass: string
  cardClass: string
  primaryLabel: string
  primaryHref: string
  primaryClass: string
  secondaryLabel: string
  secondaryHref: string
  secondaryClass: string
}

const CTA_CARDS: CtaCard[] = [
  {
    id: "hire",
    label: "HIRE TALENT",
    title: "Looking to ship mission-critical software?",
    body: "Get matched with vetted senior engineers, UI architects, and DevOps leaders ready to start this week.",
    icon: Rocket,
    badgeClass: "bg-primary-container/20 text-primary",
    cardClass: "bg-gradient-to-br from-surface-container-low to-surface-container",
    primaryLabel: "Explore All Services",
    primaryHref: "/services",
    primaryClass: "bg-primary text-on-primary hover:bg-primary/90",
    secondaryLabel: "Post Custom Scope",
    secondaryHref: "/register",
    secondaryClass: "bg-surface-container-high text-on-surface hover:bg-surface-bright",
  },
  {
    id: "sell",
    label: "BECOME A SELLER",
    title: "Are you an elite developer or designer?",
    body: "Monetize your technical expertise with high-paying client contracts, clear milestone SLAs, and prompt payouts.",
    icon: BadgeDollarSign,
    badgeClass: "bg-tertiary-container/30 text-tertiary",
    cardClass: "bg-gradient-to-br from-surface-container-low to-surface-container-high",
    primaryLabel: "Apply as Freelancer",
    primaryHref: "/register",
    primaryClass: "bg-tertiary text-on-tertiary hover:bg-tertiary/90",
    secondaryLabel: "Seller Benefits",
    secondaryHref: "/#how-it-works",
    secondaryClass: "bg-surface-container text-on-surface hover:bg-surface-bright",
  },
]

export function DualCta() {
  return (
    <section
      id="become-a-seller"
      aria-label="Hire talent or become a seller"
      data-slot="dual-cta"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {CTA_CARDS.map((card) => {
          const Icon = card.icon

          return (
            <article
              key={card.id}
              data-slot="dual-cta-card"
              data-cta={card.id}
              className={`relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-2xl p-space-lg shadow-xl lg:p-space-xl ${card.cardClass}`}
            >
              <div className="relative z-10">
                <span
                  className={`mb-space-md inline-flex items-center gap-2 rounded-full px-3 py-1 font-label-caps text-label-caps ${card.badgeClass}`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {card.label}
                </span>
                <h2 className="font-headline-lg text-headline-lg font-semibold tracking-tight text-on-surface sm:font-headline-xl sm:text-headline-xl">
                  {card.title}
                </h2>
                <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
                  {card.body}
                </p>
              </div>

              <div className="relative z-10 mt-space-lg flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className={`h-auto px-6 py-3 font-headline-sm text-headline-sm font-semibold shadow-md ${card.primaryClass}`}
                >
                  <Link to={card.primaryHref}>{card.primaryLabel}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className={`h-auto px-6 py-3 font-headline-sm text-headline-sm font-medium ${card.secondaryClass}`}
                >
                  <Link to={card.secondaryHref}>{card.secondaryLabel}</Link>
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
