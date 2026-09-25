import { Briefcase, Terminal, type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

type Step = {
  index: string
  title: string
  body: string
}

type Audience = {
  id: "client" | "freelancer"
  badge: string
  icon: LucideIcon
  badgeClasses: string
  circleClasses: string
  ctaClasses: string
  steps: Step[]
  footerText: string
  cta: string
  href: string
}

const AUDIENCES: Audience[] = [
  {
    id: "client",
    badge: "FOR CLIENTS & PRODUCT TEAMS",
    icon: Briefcase,
    badgeClasses: "bg-primary-container/20 text-primary",
    circleClasses: "bg-primary-container/30 text-primary",
    ctaClasses: "bg-primary text-surface",
    steps: [
      {
        index: "1",
        title: "Find the Right Service",
        body: "Search by keyword or filter by category. Every card shows the price, the delivery time, and the average rating from completed orders.",
      },
      {
        index: "2",
        title: "Order With the Price Locked In",
        body: "Add your requirements and place the order. The price is copied onto the order, so a later change to the service cannot change what you agreed to pay.",
      },
      {
        index: "3",
        title: "Track It, Then Review",
        body: "Follow the order as it moves to Accepted, In Progress, and Completed. Once it is completed you can leave one review with a rating and a comment.",
      },
    ],
    footerText: "Looking for a specific skill?",
    cta: "Explore Talent",
    href: "/services",
  },
  {
    id: "freelancer",
    badge: "FOR BUILDERS & CONSULTANTS",
    icon: Terminal,
    badgeClasses: "bg-tertiary-container/30 text-tertiary",
    circleClasses: "bg-tertiary-container/30 text-tertiary",
    ctaClasses: "bg-tertiary text-on-tertiary",
    steps: [
      {
        index: "1",
        title: "Publish a Service",
        body: "Set your price and delivery time, describe the work, and list the tools you use, the highlights, and what the client gets.",
      },
      {
        index: "2",
        title: "Accept With the Brief Attached",
        body: "Every order arrives with the client's requirements and the agreed price already on it. Accept it, or cancel it while it is still pending.",
      },
      {
        index: "3",
        title: "Watch Your Pipeline and Earnings",
        body: "Your dashboard totals orders by status, charts completed-order earnings by month, and exports the list as CSV. Completed orders can earn a review.",
      },
    ],
    footerText: "Ready to publish your first service?",
    cta: "Become a Seller",
    href: "/register",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-[1440px] scroll-mt-20 bg-background px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="mx-auto mb-space-xl max-w-2xl text-center">
        <span
          data-slot="section-kicker"
          className="font-label-caps text-label-caps tracking-wider text-primary uppercase"
        >
          How It Works
        </span>
        <h2 className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface">
          One Platform, Two Journeys
        </h2>
        <p
          data-slot="section-intro"
          className="mt-2 font-body-lg text-body-lg text-on-surface-variant"
        >
          Clients hire with the price locked in. Freelancers publish, deliver, and get
          reviewed. Every order moves through the same protected path.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {AUDIENCES.map((audience) => (
          <div
            key={audience.id}
            data-slot="audience-card"
            data-audience={audience.id}
            className="flex flex-col justify-between rounded-2xl bg-surface-container-low p-space-lg shadow-md"
          >
            <div>
              <div className="mb-space-md flex items-center justify-between gap-3">
                <span
                  data-slot="audience-badge"
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-label-caps text-label-caps ${audience.badgeClasses}`}
                >
                  <audience.icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  {audience.badge}
                </span>
                <span
                  data-slot="audience-steps"
                  className="shrink-0 font-mono text-caption text-on-surface-variant"
                >
                  01 - 03 STEPS
                </span>
              </div>

              <div className="space-y-space-md">
                {audience.steps.map((step) => (
                  <div key={step.index} data-slot="audience-step" className="flex items-start gap-4">
                    <span
                      data-slot="step-index"
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full font-label-numeric font-bold ${audience.circleClasses}`}
                    >
                      {step.index}
                    </span>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm font-medium text-on-surface">
                        {step.title}
                      </h4>
                      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              data-slot="audience-footer"
              className="mt-space-lg flex items-center justify-between gap-4 rounded-xl bg-surface-container p-space-md pt-space-md"
            >
              <span className="font-body-sm text-body-sm text-on-surface">
                {audience.footerText}
              </span>
              <Link
                data-slot="audience-cta"
                to={audience.href}
                className={`shrink-0 rounded-lg px-4 py-2 font-headline-sm text-headline-sm font-semibold transition-all hover:brightness-110 ${audience.ctaClasses}`}
              >
                {audience.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
