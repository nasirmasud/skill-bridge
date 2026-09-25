import { Link } from "react-router-dom"
import { ArrowRight, Check, Image as ImageIcon, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

const WIZARD_STEPS = [
  {
    number: "1",
    label: "Define Category, Title & Search Tag Indexes",
    final: false,
  },
  {
    number: "2",
    label: "Configure Basic, Standard, and Pro Tier Matrices",
    final: false,
  },
  {
    number: "3",
    label: "Upload High-Res Architecture Previews & Demos",
    final: false,
  },
  {
    number: "4",
    label: "Instant Publishing to 12,000+ Active Clients",
    final: true,
  },
] as const

const PACKAGE_TIERS = [
  {
    tier: "Tier 1",
    name: "Basic",
    price: "$450",
    features: [
      { label: "Next.js 15 Setup", included: true },
      { label: "3 Pages UI", included: true },
      { label: "DB Integration", included: false },
    ],
    popular: false,
  },
  {
    tier: "Tier 2",
    name: "Standard",
    price: "$950",
    features: [
      { label: "Next.js 15 Full App", included: true },
      { label: "Prisma + Postgres", included: true },
      { label: "Stripe Checkout", included: true },
    ],
    popular: true,
  },
  {
    tier: "Tier 3",
    name: "Enterprise",
    price: "$2,200",
    features: [
      { label: "Everything in Standard", included: true },
      { label: "CI/CD + Docker", included: true },
      { label: "30 Days Tech Support", included: true },
    ],
    popular: false,
  },
] as const

function PackageTierCard({
  tier,
}: {
  tier: (typeof PACKAGE_TIERS)[number]
}) {
  return (
    <article
      data-slot="seller-wizard-tier"
      className={`relative rounded-xl p-4 ${
        tier.popular
          ? "bg-surface-container-high shadow-md ring-1 ring-primary/20"
          : "bg-surface-container"
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-2.5 right-3 rounded bg-primary px-1.5 py-0.5 font-label-caps text-[9px] font-bold tracking-wider text-primary-foreground uppercase">
          Popular
        </span>
      )}
      <p
        className={`font-label-caps text-[10px] tracking-wider uppercase ${
          tier.popular ? "text-primary" : "text-outline"
        }`}
      >
        {tier.tier}
      </p>
      <h3 className="mt-1 font-headline-sm text-headline-sm font-bold text-on-surface">
        {tier.name}
      </h3>
      <p className="mt-1 font-label-numeric text-body-md font-semibold text-primary">
        {tier.price}
      </p>
      <ul className="mt-3 space-y-2 font-caption text-caption">
        {tier.features.map((feature) => (
          <li
            key={feature.label}
            className={`flex items-start gap-1.5 ${
              feature.included ? "text-on-surface-variant" : "text-outline"
            }`}
          >
            {feature.included ? (
              <Check className="mt-0.5 size-3 shrink-0 text-tertiary" aria-hidden="true" />
            ) : (
              <Minus className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
            )}
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export function SellerWizardPreview() {
  return (
    <section
      id="seller-wizard-preview"
      data-slot="seller-wizard-preview"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="font-label-caps text-label-caps tracking-wider text-tertiary uppercase">
            Seller Hub Engine
          </span>
          <h2 className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface">
            Turn Your Technical Craft into Predictable Revenue
          </h2>
          <p className="mt-3 font-body-lg text-body-lg text-on-surface-variant">
            Our 4-step Service Publishing Engine lets you configure multi-tier
            architectures with granular deliverable checklists, revision
            counters, and asset preview galleries.
          </p>

          <ol
            aria-label="Service publishing steps"
            className="mt-space-lg space-y-3"
          >
            {WIZARD_STEPS.map((step) => (
              <li key={step.number} className="flex items-center gap-3">
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full font-label-numeric text-caption font-bold ${
                    step.final
                      ? "bg-tertiary/20 text-tertiary"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {step.number}
                </span>
                <span
                  className={`font-body-sm text-body-sm text-on-surface ${
                    step.final ? "font-medium" : ""
                  }`}
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>

          <Button
            asChild
            size="lg"
            className="mt-space-lg h-11 rounded-lg bg-tertiary px-6 text-on-tertiary shadow-md hover:bg-tertiary/85"
          >
            <Link to="/register">
              Start Seller Wizard
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl bg-surface-container-low p-4 shadow-xl lg:col-span-7 lg:p-space-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="size-3 rounded-full bg-error/50" aria-hidden="true" />
              <span className="size-3 rounded-full bg-tertiary/50" aria-hidden="true" />
              <span className="size-3 rounded-full bg-primary/50" aria-hidden="true" />
              <span className="ml-2 truncate font-label-caps text-label-caps text-outline">
                Wizard: Service Builder • Step 2 of 4
              </span>
            </div>
            <span className="shrink-0 rounded bg-surface-container px-2 py-0.5 font-label-caps text-label-caps text-tertiary">
              Draft Autosaved
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PACKAGE_TIERS.map((tier) => (
              <PackageTierCard key={tier.name} tier={tier} />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-outline-variant/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 font-caption text-caption text-outline">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
                <ImageIcon className="size-4" aria-hidden="true" />
              </span>
              <span>Next: Gallery Asset Uploader (Up to 10 images + 1 video)</span>
            </div>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-container text-primary">
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
