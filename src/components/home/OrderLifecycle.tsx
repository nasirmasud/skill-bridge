import {
  BadgeCheck,
  ClipboardCheck,
  Lock,
  RefreshCcw,
  Star,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const STEPS: {
  step: string
  status: string
  title: string
  body: string
  footer: string
  Icon: LucideIcon
  statusTone: string
  iconTone: string
}[] = [
  {
    step: "STEP 01",
    status: "PENDING",
    title: "Order Placed",
    body: "The agreed price is copied into your order, so later edits to the service can never change what you pay.",
    footer: "Price Snapshot Saved",
    Icon: Lock,
    statusTone: "bg-primary/20 text-primary",
    iconTone: "text-primary",
  },
  {
    step: "STEP 02",
    status: "ACCEPTED",
    title: "Seller Confirms Scope",
    body: "The seller accepts the order and confirms the scope before any work begins.",
    footer: "Seller Accepted",
    Icon: ClipboardCheck,
    statusTone: "bg-secondary-container/40 text-on-secondary-container",
    iconTone: "text-on-secondary-container",
  },
  {
    step: "STEP 03",
    status: "IN_PROGRESS",
    title: "Work in Progress",
    body: "Only the seller or an admin can move an order forward. No step can be skipped or reversed.",
    footer: "No Skipped Steps",
    Icon: Wrench,
    statusTone: "bg-primary-container/30 text-primary",
    iconTone: "text-primary",
  },
  {
    step: "STEP 04",
    status: "COMPLETED",
    title: "Sign-Off & Review",
    body: "Delivery is approved and the order locks at COMPLETED. The client can then leave one review.",
    footer: "One Review Per Order",
    Icon: Star,
    statusTone: "bg-tertiary/20 text-tertiary",
    iconTone: "text-tertiary",
  },
]

const STATES = ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED"]

export function OrderLifecycle() {
  return (
    <section
      id="order-lifecycle"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-xl lg:px-margin-desktop"
    >
      <div
        data-slot="lifecycle-panel"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container-low to-surface-container-lowest p-space-lg shadow-xl lg:p-space-xl"
      >
        <div className="mb-space-xl flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div
              data-slot="section-kicker"
              className="mb-2 inline-flex items-center gap-2 font-label-caps text-label-caps tracking-wider text-tertiary uppercase"
            >
              <RefreshCcw className="size-4 shrink-0" />
              Protected Order Delivery
            </div>
            <h2 className="font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface">
              Every Order Follows the Same Protected Path
            </h2>
          </div>
          <p
            data-slot="lifecycle-note"
            className="max-w-sm rounded-lg bg-surface-container px-4 py-2 font-caption text-caption text-on-surface-variant"
          >
            Every status change is validated on the server before it is saved.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {STEPS.map(
            ({ step, status, title, body, footer, Icon, statusTone, iconTone }) => (
              <div
                key={step}
                data-slot="lifecycle-step"
                className="flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-sm"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      data-slot="step-number"
                      className="rounded bg-surface-container-high px-2 py-0.5 font-label-caps text-label-caps text-on-surface-variant"
                    >
                      {step}
                    </span>
                    <span
                      data-slot="step-status"
                      className={`rounded px-2 py-0.5 font-label-caps text-label-caps font-semibold uppercase ${statusTone}`}
                    >
                      {status}
                    </span>
                  </div>
                  <h4 className="mb-1.5 font-headline-sm text-headline-sm font-semibold text-on-surface">
                    {title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {body}
                  </p>
                </div>
                <div
                  data-slot="step-footer"
                  className="mt-4 flex items-center pt-3 font-caption text-caption text-on-surface-variant"
                >
                  <Icon className={`mr-1 size-4 shrink-0 ${iconTone}`} />
                  {footer}
                </div>
              </div>
            )
          )}
        </div>

        <div
          data-slot="lifecycle-banner"
          className="mt-space-lg flex flex-col items-center justify-between gap-4 rounded-xl bg-surface-container-high/60 p-space-md md:flex-row"
        >
          <div className="flex items-center gap-3">
            <BadgeCheck className="size-6 shrink-0 text-tertiary" />
            <div>
              <div
                data-slot="lifecycle-banner-title"
                className="font-headline-sm text-headline-sm font-medium text-on-surface"
              >
                Every Transition Validated Server-Side
              </div>
              <p
                data-slot="lifecycle-banner-caption"
                className="font-caption text-caption text-on-surface-variant"
              >
                Clients can never change an order's status themselves, and a completed
                order can only ever be reviewed once.
              </p>
            </div>
          </div>
          <div
            data-slot="lifecycle-states"
            className="flex shrink-0 flex-wrap items-center gap-1.5 rounded-lg bg-surface-container px-4 py-2 font-label-caps text-label-caps text-on-surface-variant"
          >
            {STATES.map((state, index) => (
              <span key={state} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <span aria-hidden="true">→</span>
                ) : null}
                {state}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
