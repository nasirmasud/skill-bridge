import { Users, Briefcase, Smile, ShieldCheck } from "lucide-react"

const STATS = [
  { icon: Users, value: "25K+", label: "Freelancers" },
  { icon: Briefcase, value: "50K+", label: "Services Completed" },
  { icon: Smile, value: "10K+", label: "Happy Clients" },
  { icon: ShieldCheck, value: "99%", label: "Satisfaction Rate" },
]

export function Stats() {
  return (
    <section className="w-full bg-background px-6 py-10 pb-28">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/50 px-6 py-8 sm:px-10">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              className={`flex items-center gap-4 py-5 sm:py-0 sm:px-6 ${
                i !== 0 ? "sm:border-l sm:border-border" : ""
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_18px_-4px_rgba(99,102,241,0.7)]">
                <Icon
                  className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                  strokeWidth={1.75}
                />
              </span>
              <div>
                <p className="text-xl font-bold text-foreground sm:text-2xl">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
