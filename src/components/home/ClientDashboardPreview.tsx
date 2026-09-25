import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  ShieldCheck,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const ORDER_PREVIEWS = [
  {
    title: "Next.js 15 Migration & Turbopack Setup",
    seller: "Alex M.",
    price: "$450.00",
    status: "IN_PROGRESS",
    statusLabel: "In progress",
    statusClass: "bg-primary-container/20 text-primary",
    dotClass: "bg-primary",
    action: "Workspace",
  },
  {
    title: "SOC2 Readiness & JWT Verification",
    seller: "Elena R.",
    price: "$1,250.00",
    status: "COMPLETED",
    statusLabel: "Completed",
    statusClass: "bg-tertiary-container/30 text-tertiary",
    dotClass: "bg-tertiary",
    action: "Leave review",
  },
  {
    title: "Vector Embeddings Pipeline & Pinecone",
    seller: "Marcus C.",
    price: "$1,200.00",
    status: "ACCEPTED",
    statusLabel: "Accepted",
    statusClass: "bg-secondary-container/40 text-secondary",
    dotClass: "bg-secondary",
    action: "Workspace",
  },
] as const

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

function exportPreviewCsv() {
  const rows = [
    ["Order", "Freelancer", "Status", "Price snapshot"],
    ...ORDER_PREVIEWS.map((order) => [
      order.title,
      order.seller,
      order.statusLabel,
      order.price,
    ]),
  ]
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n")
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = "skillbridge-client-preview.csv"
  link.click()
  URL.revokeObjectURL(url)
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  trend,
}: {
  icon: LucideIcon
  label: string
  value: string
  detail: string
  trend?: boolean
}) {
  return (
    <div className="rounded-xl bg-surface-container p-space-md">
      <div className="flex items-center justify-between gap-3">
        <span className="font-caption text-caption text-outline">{label}</span>
        <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
      </div>
      <p className="mt-2 font-label-numeric text-headline-xl font-bold text-on-surface">
        {value}
      </p>
      {trend ? (
        <p className="mt-1 flex items-center gap-1 font-caption text-caption text-tertiary">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          {detail}
        </p>
      ) : (
        <p className="mt-1 font-caption text-caption text-outline">{detail}</p>
      )}
    </div>
  )
}

function FulfillmentCard() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-container p-space-md">
      <div className="min-w-0">
        <p className="font-caption text-caption text-outline">Fulfillment health</p>
        <p className="mt-1 font-body-sm text-body-sm font-medium text-on-surface">
          98.2% milestones met
        </p>
        <p className="mt-1 font-caption text-caption text-tertiary">0 disputes opened</p>
      </div>
      <svg
        className="size-16 shrink-0 -rotate-90"
        viewBox="0 0 36 36"
        role="img"
        aria-label="98.2 percent fulfillment health"
      >
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="var(--surface-container-highest)"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          pathLength="100"
          stroke="var(--tertiary)"
          strokeDasharray="98.2 1.8"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    </div>
  )
}

function OrderRow({
  order,
}: {
  order: (typeof ORDER_PREVIEWS)[number]
}) {
  const isCompleted = order.status === "COMPLETED"

  return (
    <div className="flex flex-col gap-3 border-b border-outline-variant/20 py-4 first:pt-0 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`size-2 shrink-0 rounded-full ${order.dotClass} ${
              order.status === "IN_PROGRESS" ? "animate-pulse" : ""
            }`}
            aria-hidden="true"
          />
          <p className="truncate font-body-sm text-body-sm font-semibold text-on-surface">
            {order.title}
          </p>
        </div>
        <p className="mt-1 truncate font-caption text-caption text-outline">
          Freelancer: {order.seller} · Price snap: {order.price}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <span
          className={`rounded px-2 py-0.5 font-label-caps text-label-caps ${order.statusClass}`}
        >
          {order.statusLabel}
        </span>
        <Link
          to="/dashboard/client/orders"
          className={`inline-flex items-center gap-1 rounded px-3 py-1.5 font-caption text-caption font-medium transition-colors ${
            isCompleted
              ? "bg-tertiary text-on-tertiary hover:bg-tertiary/85"
              : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
          }`}
        >
          {order.action}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export function ClientDashboardPreview() {
  return (
    <section
      id="client-dashboard-preview"
      data-slot="client-dashboard-preview"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="rounded-2xl bg-surface-container-low p-space-lg shadow-xl lg:p-space-xl">
        <div className="mb-space-lg flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-label-caps text-label-caps tracking-wider text-primary uppercase">
              Client workspace / live operations
            </span>
            <h2 className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface">
              Client Command Center &amp; Spend Analytics
            </h2>
            <p className="mt-2 max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
              Keep commitments, spend signals, and delivery milestones in one focused view.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-2 border-outline-variant/50 bg-surface-container text-on-surface"
              onClick={exportPreviewCsv}
            >
              <Download className="size-3.5" aria-hidden="true" />
              Export CSV
            </Button>
            <span className="inline-flex items-center gap-1.5 rounded bg-tertiary-container/30 px-2.5 py-1 font-label-caps text-label-caps text-tertiary">
              <span className="size-1.5 rounded-full bg-tertiary" aria-hidden="true" />
              Live telemetry
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="space-y-4">
            <MetricCard
              icon={Wallet}
              label="Total capital deployed"
              value="$48,250.00"
              detail="+14.2% vs last quarter"
              trend
            />
            <MetricCard
              icon={Clock3}
              label="Active orders in flight"
              value="6 orders"
              detail="4 in progress · 2 in review"
            />
            <FulfillmentCard />
          </div>

          <div className="rounded-xl bg-surface-container p-space-md lg:col-span-2 lg:p-space-lg">
            <div className="flex flex-col gap-2 border-b border-outline-variant/20 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-label-caps text-label-caps tracking-wider text-outline uppercase">
                  Order trackers
                </p>
                <p className="mt-1 font-caption text-caption text-on-surface-variant">
                  Prisma relational view
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded bg-surface-container-highest/40 px-2.5 py-1 font-caption text-caption text-on-surface-variant">
                <ShieldCheck className="size-3.5 text-tertiary" aria-hidden="true" />
                Server-verified states
              </span>
            </div>

            <div className="pt-1">
              {ORDER_PREVIEWS.map((order) => (
                <OrderRow key={order.status} order={order} />
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t border-outline-variant/20 pt-4 font-caption text-caption text-outline sm:flex-row sm:items-center sm:justify-between">
              <span>Showing 3 of 28 historical orders</span>
              <Link
                to="/dashboard/client/orders"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Open full analytics
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-outline-variant/20 pt-4 font-caption text-caption text-on-surface-variant">
          <CheckCircle2 className="size-4 shrink-0 text-tertiary" aria-hidden="true" />
          <span>Preview data mirrors the client order lifecycle.</span>
        </div>
      </div>
    </section>
  )
}
