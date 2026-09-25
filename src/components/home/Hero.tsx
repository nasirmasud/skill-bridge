import { ArrowRight, BadgeCheck, ChevronDown, LayoutGrid, Search, Star, Users, Wallet } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useCategories } from "@/hooks/useCategories"

const TRENDING_TAGS = [
  "Next.js 15",
  "UI/UX Systems",
  "PostgreSQL Tuning",
  "Tailwind CSS",
  "LLM Fine-Tuning",
  "Mobile Flutter",
]

const TRUST_METRICS = [
  {
    icon: BadgeCheck,
    value: "99.4%",
    label: "Order Success Rate",
    tone: "bg-tertiary/15 text-tertiary",
  },
  {
    icon: Star,
    value: "4.9 / 5.0",
    label: "Avg Client Rating",
    tone: "bg-primary/15 text-primary",
  },
  {
    icon: Users,
    value: "12,400+",
    label: "Elite Freelancers",
    tone: "bg-secondary-container/30 text-on-secondary-container",
  },
]

const BUDGET_RANGES: Record<string, { min?: number; max?: number }> = {
  any: {},
  entry: { min: 0, max: 500 },
  mid: { min: 500, max: 2500 },
  enterprise: { min: 2500 },
}

export function Hero() {
  const [query, setQuery] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [budgetKey, setBudgetKey] = useState("any")
  const { data: categories } = useCategories()
  const navigate = useNavigate()

  const buildUrl = (term: string, categoryIdValue: string, budgetValue: string) => {
    const params = new URLSearchParams()
    if (term.trim()) params.set("search", term.trim())
    if (categoryIdValue && categoryIdValue !== "all") {
      params.set("categoryId", categoryIdValue)
    }
    const range = BUDGET_RANGES[budgetValue]
    if (range?.min !== undefined) params.set("minPrice", String(range.min))
    if (range?.max !== undefined) params.set("maxPrice", String(range.max))
    const qs = params.toString()
    navigate(qs ? `/services?${qs}` : "/services")
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    buildUrl(query, categoryId, budgetKey)
  }

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pt-20 xl:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-surface-container-high px-3 py-1 font-label-caps text-label-caps tracking-wider text-primary uppercase shadow-sm">
            <span className="size-2 animate-pulse rounded-full bg-tertiary" />
            <span>Skillbridge 2.0 Engine Live — Powered by Express + Prisma</span>
            <ArrowRight className="size-3.5" />
          </div>

          <h1 className="mb-4 text-display-hero-mobile font-semibold tracking-tight text-foreground lg:text-display-hero">
            Scale Faster with{" "}
            <span className="bg-gradient-to-r from-primary via-primary-fixed to-tertiary bg-clip-text text-transparent">
              Vetted World-Class
            </span>{" "}
            Freelancers
          </h1>

          <p className="mx-auto mb-8 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            The trusted marketplace connecting ambitious companies with elite
            engineers, designers, and AI specialists. Instant booking,
            transparent pricing, guaranteed delivery.
          </p>

          <form
            className="relative flex w-full flex-col items-stretch gap-2 rounded-xl bg-surface-container-low/90 p-2 shadow-xl backdrop-blur-xl sm:p-3 md:flex-row md:items-center"
            onSubmit={handleSubmit}
          >
            <label className="flex min-w-0 items-center gap-2 rounded-lg bg-surface-container px-3 py-2.5 md:min-w-[170px]">
              <LayoutGrid className="size-4 shrink-0 text-outline" />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent font-body-sm text-body-sm text-foreground focus:outline-none"
              >
                <option value="all">All Categories</option>
                {(categories ?? []).map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="bg-surface-container"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-4 shrink-0 text-outline" aria-hidden="true" />
            </label>

            <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg bg-surface-container px-3.5 py-2.5">
              <Search className="size-4 shrink-0 text-primary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try 'Full-Stack Next.js 15', 'Figma Design System', 'FastAPI'..."
                className="w-full bg-transparent font-body-sm text-body-sm text-foreground placeholder:text-outline focus:outline-none"
              />
              <span className="hidden rounded bg-surface-container-high px-1.5 py-0.5 font-label-caps text-label-caps text-on-surface-variant lg:inline-block">
                ⌘K
              </span>
            </div>

            <label className="flex min-w-0 items-center gap-2 rounded-lg bg-surface-container px-3 py-2.5 md:min-w-[150px]">
              <Wallet className="size-4 shrink-0 text-outline" />
              <select
                value={budgetKey}
                onChange={(e) => setBudgetKey(e.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent font-body-sm text-body-sm text-foreground focus:outline-none"
              >
                <option value="any">Any Budget</option>
                <option value="entry">&lt; $500</option>
                <option value="mid">$500 - $2,500</option>
                <option value="enterprise">$2,500+</option>
              </select>
              <ChevronDown className="size-4 shrink-0 text-outline" aria-hidden="true" />
            </label>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-3 font-headline-sm text-headline-sm font-semibold text-on-primary-container shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Find Talent
              <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 font-caption text-caption tracking-wider text-outline uppercase">
              Trending:
            </span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => buildUrl(tag, "all", "any")}
                className="rounded-full bg-surface-container px-2.5 py-1 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 rounded-xl bg-surface-container-lowest/60 p-3 shadow-sm backdrop-blur sm:grid-cols-3 sm:gap-4 sm:p-4">
          {TRUST_METRICS.map(({ icon: Icon, value, label, tone }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 rounded-lg bg-surface-container-low px-4 py-2.5 sm:justify-start"
            >
              <div className={`flex size-9 items-center justify-center rounded-lg ${tone}`}>
                <Icon className="size-4" />
              </div>
              <div className="text-left">
                <div className="font-label-numeric text-headline-sm font-semibold text-foreground">
                  {value}
                </div>
                <div className="font-caption text-caption text-outline">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}