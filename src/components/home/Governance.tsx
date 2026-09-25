import {
  BadgeDollarSign,
  Braces,
  History,
  KeyRound,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

type GovernancePillar = {
  title: string
  body: string
  label: string
  icon: LucideIcon
  iconClass: string
}

const GOVERNANCE_PILLARS: GovernancePillar[] = [
  {
    title: "Strict Role Guarding",
    body: "Dual JWT rotation with 7d session windows, ownership authorization checks, and granular admin override limits.",
    label: "Role-Based Access",
    icon: KeyRound,
    iconClass: "bg-primary-container/20 text-primary",
  },
  {
    title: "Data Audit & Soft Deletes",
    body: "Zero permanent destructive operations. Prisma-managed soft deletion flags safeguard historical order receipts.",
    label: "Audit Trail",
    icon: History,
    iconClass: "bg-tertiary-container/20 text-tertiary",
  },
  {
    title: "Zero Price Tampering",
    body: "Order costs are immutable snapshots frozen at time of creation, immunizing clients against in-flight fee changes.",
    label: "Snapshot Engine",
    icon: BadgeDollarSign,
    iconClass: "bg-secondary-container/20 text-secondary",
  },
  {
    title: "OpenAPI Standardized",
    body: "REST architecture with strict schema validation, predictable JSON envelopes, and unified HTTP status errors.",
    label: "Swagger Ready",
    icon: Braces,
    iconClass: "bg-surface-container-high text-primary-fixed",
  },
]

export function Governance() {
  return (
    <section
      id="governance"
      aria-labelledby="governance-heading"
      data-slot="governance"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div
        data-slot="governance-panel"
        className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-space-lg shadow-xl lg:p-space-xl"
      >
        <div className="mx-auto mb-space-xl max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-wider text-primary">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Enterprise Governance
          </span>
          <h2
            id="governance-heading"
            className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface"
          >
            Engineered with Institutional Rigor
          </h2>
          <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
            Built from the ground up to satisfy stringent infosec standards, role-based
            controls, and audit trails.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GOVERNANCE_PILLARS.map(({ title, body, label, icon: Icon, iconClass }) => (
            <article
              key={title}
              data-slot="governance-card"
              className="flex min-w-0 flex-col justify-between rounded-xl bg-surface-container-low p-space-md transition-colors hover:bg-surface-container"
            >
              <div>
                <div
                  className={`mb-3 flex size-10 items-center justify-center rounded-lg ${iconClass}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  {title}
                </h3>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {body}
                </p>
              </div>
              <span className="mt-4 font-label-caps text-[10px] uppercase tracking-wider text-outline">
                {label}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
