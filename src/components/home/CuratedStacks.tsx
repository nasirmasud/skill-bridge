import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Clock,
  Cloud,
  CodeXml,
  Database,
  Layers,
  Palette,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react"
import { useServices } from "@/hooks/useServices"
import { ErrorState } from "@/components/shared/ErrorState"
import { getErrorMessage } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import type { Service } from "@/types/service.types"

const NOTE =
  "Each group is the exact set of tools sellers list on a service, so every tag, price and delivery time here is copied from the catalog."

const TONES = [
  "bg-primary-container/20 text-primary",
  "bg-tertiary-container/30 text-tertiary",
  "bg-surface-container-high text-primary",
  "bg-secondary-container/30 text-on-secondary-container",
]

const ICON_RULES: { keywords: string[]; icon: LucideIcon }[] = [
  {
    keywords: ["llm", "rag", "langchain", "openai", "gpt", "pinecone", "vector", "agent", "embedding"],
    icon: Sparkles,
  },
  {
    keywords: ["next.js", "nextjs", "react", "vue", "angular", "svelte", "typescript", "javascript", "frontend"],
    icon: CodeXml,
  },
  {
    keywords: ["figma", "design", "tailwind", "css", "storybook", "framer", "motion"],
    icon: Palette,
  },
  {
    keywords: ["postgres", "postgre", "prisma", "pg", "mysql", "redis", "mongo", "sql", "database", "supabase"],
    icon: Database,
  },
  {
    keywords: ["aws", "azure", "gcp", "docker", "kubernetes", "k8s", "terraform", "cloud", "devops", "linux", "nginx"],
    icon: Cloud,
  },
  {
    keywords: ["api", "node", "express", "fastapi", "python", "django", "flask", "backend", "graphql", "rest"],
    icon: Terminal,
  },
]

type Stack = {
  lead: string
  tools: string[]
  services: Service[]
  floorPrice: number
  fastest: number
}

function serviceTools(service: Service) {
  return [...new Set((service.tools ?? []).map((tool) => tool.trim()).filter(Boolean))]
}

function stackIcon(lead: string) {
  const needle = lead.toLowerCase()
  return ICON_RULES.find((rule) => rule.keywords.some((word) => needle.includes(word)))?.icon ?? Layers
}

function buildStacks(services: Service[]) {
  const groups = new Map<string, Service[]>()
  for (const service of services) {
    const tools = serviceTools(service)
    if (tools.length === 0) continue
    const key = [...tools].sort().join("|")
    const bucket = groups.get(key)
    if (bucket) {
      bucket.push(service)
    } else {
      groups.set(key, [service])
    }
  }

  const stacks: Stack[] = [...groups.values()].map((members) => {
    const frequency = new Map<string, number>()
    for (const service of members) {
      for (const tool of serviceTools(service)) {
        frequency.set(tool, (frequency.get(tool) ?? 0) + 1)
      }
    }
    const tools = [...frequency.keys()].sort((first, second) => {
      const spread = (frequency.get(second) ?? 0) - (frequency.get(first) ?? 0)
      return spread !== 0 ? spread : first.localeCompare(second)
    })
    return {
      lead: tools[0],
      tools,
      services: members,
      floorPrice: Math.min(...members.map((service) => Number(service.price))),
      fastest: Math.min(...members.map((service) => service.deliveryDays)),
    }
  })

  return stacks.sort(
    (first, second) =>
      second.services.length - first.services.length ||
      first.fastest - second.fastest ||
      first.lead.localeCompare(second.lead),
  )
}

function StackCard({ stack, icon: Icon, index }: { stack: Stack; icon: LucideIcon; index: number }) {
  const titles = [...stack.services]
    .sort((first, second) => first.deliveryDays - second.deliveryDays || first.title.localeCompare(second.title))
    .slice(0, 2)
  const tags = stack.tools.slice(1, 4)

  return (
    <article
      data-slot="stack-card"
      className="group flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md shadow-sm transition-all hover:bg-surface-container hover:shadow-lg"
    >
      <div>
        <div
          data-slot="stack-tile"
          className={`mb-3 flex size-10 items-center justify-center rounded-lg ${TONES[index % TONES.length]}`}
        >
          <Icon data-slot="stack-icon" className="size-6" aria-hidden="true" />
        </div>
        <h3
          data-slot="stack-title"
          className="font-headline-sm text-headline-sm font-semibold text-on-surface"
        >
          {stack.lead}
        </h3>
        <p
          data-slot="stack-titles-label"
          className="mt-3 font-label-caps text-label-caps tracking-wider text-on-surface-variant uppercase"
        >
          Services in this stack
        </p>
        <ul data-slot="stack-titles" className="mt-1 flex flex-col gap-0.5">
          {titles.map((service) => (
            <li
              key={service.id}
              data-slot="stack-service"
              className="line-clamp-1 font-body-sm text-body-sm text-on-surface"
            >
              {service.title}
            </li>
          ))}
        </ul>
        {tags.length > 0 ? (
          <div data-slot="stack-tags" className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                data-slot="stack-tag"
                className="rounded bg-surface-container-high px-2 py-0.5 font-label-caps text-[11px] text-on-surface-variant"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div
        data-slot="stack-footer"
        className="mt-6 flex items-end justify-between border-t border-outline-variant/30 pt-3"
      >
        <div>
          <span
            data-slot="stack-price-label"
            className="block font-caption text-caption text-on-surface"
          >
            From
          </span>
          <span
            data-slot="stack-price"
            className="font-label-numeric text-headline-sm font-semibold text-on-surface"
          >
            {formatCurrency(stack.floorPrice)}
          </span>
        </div>
        <span
          data-slot="stack-delivery"
          className="flex items-center gap-1 font-caption text-caption text-tertiary"
        >
          <Clock className="size-4" aria-hidden="true" />
          {stack.fastest === 1 ? "Fastest 24 hours" : `Fastest ${stack.fastest} days`}
        </span>
      </div>
    </article>
  )
}

function StackSkeleton() {
  return <div data-slot="stack-skeleton" className="h-72 rounded-xl bg-surface-container-low shadow-sm" />
}

export function CuratedStacks() {
  const { data, isLoading, isError, error, refetch } = useServices({ limit: 12 })
  const services = useMemo(() => data?.data ?? [], [data])
  const stacks = useMemo(() => buildStacks(services).slice(0, 4), [services])

  return (
    <section
      id="curated-stacks"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-xl lg:px-margin-desktop"
    >
      <div className="mb-space-lg flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span
            data-slot="section-kicker"
            className="font-label-caps text-label-caps tracking-wider text-tertiary uppercase"
          >
            Most Shared Stacks
          </span>
          <h2 className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface">
            Find Services by the Stack They Use
          </h2>
        </div>
        <div className="flex max-w-sm flex-col items-start gap-2 md:items-end">
          <p data-slot="section-note" className="font-body-sm text-body-sm text-on-surface-variant">
            {NOTE}
          </p>
          <Link
            data-slot="section-link"
            to="/services"
            className="inline-flex items-center gap-2 font-body-sm text-body-sm text-primary hover:underline"
          >
            Browse all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
        {isError ? (
          <div className="col-span-full">
            <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <StackSkeleton key={index} />)
        ) : stacks.length === 0 ? (
          <p
            data-slot="stack-empty"
            className="col-span-full py-10 text-center font-body-sm text-body-sm text-on-surface-variant"
          >
            {services.length === 0
              ? "No services yet — check back soon."
              : "No services list their tools yet — check back soon."}
          </p>
        ) : (
          stacks.map((stack, index) => (
            <StackCard
              key={stack.lead}
              stack={stack}
              icon={stackIcon(stack.lead)}
              index={index}
            />
          ))
        )}
      </div>
    </section>
  )
}
