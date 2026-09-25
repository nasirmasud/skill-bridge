type MarketplaceStat = {
  value: string
  label: string
  caption: string
  valueClass: string
}

const MARKETPLACE_STATS: MarketplaceStat[] = [
  {
    value: "$4.8M+",
    label: "Total Project Volume",
    caption: "Disbursed with zero escrow disputes",
    valueClass: "text-primary",
  },
  {
    value: "99.8%",
    label: "On-Time SLA Delivery",
    caption: "Tracked by automated milestone engine",
    valueClass: "text-tertiary",
  },
  {
    value: "< 15 Min",
    label: "First Response Time",
    caption: "Average seller reply window",
    valueClass: "text-on-secondary-container",
  },
  {
    value: "48+",
    label: "Global Currencies",
    caption: "Direct localized bank settlements",
    valueClass: "text-on-surface",
  },
]

export function MarketplaceStats() {
  return (
    <section
      id="marketplace-stats"
      aria-label="Marketplace statistics"
      data-slot="marketplace-stats"
      className="mx-auto w-full max-w-[1440px] px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MARKETPLACE_STATS.map(({ value, label, caption, valueClass }) => (
          <article
            key={label}
            data-slot="marketplace-stat-card"
            className="flex min-w-0 min-h-[9rem] flex-col justify-center rounded-2xl bg-surface-container-low p-space-lg text-center shadow-sm"
          >
            <p
              className={`font-label-numeric text-display-hero-mobile font-bold lg:text-headline-xl ${valueClass}`}
            >
              {value}
            </p>
            <p className="mt-1 font-body-md text-body-md font-medium text-on-surface">
              {label}
            </p>
            <p className="mt-0.5 font-caption text-caption text-outline">{caption}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
