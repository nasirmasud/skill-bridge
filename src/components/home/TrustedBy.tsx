import { Blocks, Code2, CreditCard, LayoutGrid, Terminal, Triangle, Zap } from "lucide-react"

const TRUSTED_BY = [
  { name: "ACME CORP", icon: Blocks, tone: "text-primary" },
  { name: "VERCEL", icon: Triangle, tone: "text-on-surface" },
  { name: "SUPABASE", icon: Zap, tone: "text-tertiary" },
  { name: "LINEAR", icon: Code2, tone: "text-on-secondary-container" },
  { name: "STRIPE", icon: CreditCard, tone: "text-on-surface-variant" },
  { name: "RAYCAST", icon: Terminal, tone: "text-outline" },
  { name: "RETOOL", icon: LayoutGrid, tone: "text-primary" },
]

export function TrustedBy() {
  return (
    <section className="w-full bg-surface-container-lowest/50 py-space-md">
      <div className="mx-auto w-full max-w-[1440px] px-margin-mobile lg:px-margin-desktop">
        <p className="mb-space-md text-center font-label-caps text-label-caps tracking-widest text-outline uppercase">
          Powering next-generation product teams at scale
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 lg:gap-14">
          {TRUSTED_BY.map(({ name, icon: Icon, tone }) => (
            <div
              key={name}
              className="flex items-center gap-2 font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface-variant"
            >
              <Icon className={`size-5 shrink-0 ${tone}`} />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}