import { Fragment } from "react"
import { Search, MessageSquare, CheckCircle2 } from "lucide-react"

const STEPS = [
  {
    icon: Search,
    number: "01",
    title: "Find a Service",
    description: "Browse categories or search for the service you need.",
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "Connect & Collaborate",
    description: "Discuss details, agree on price, and start the project.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Get It Done",
    description: "Receive high-quality work and leave a review.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full scroll-mt-20 bg-background px-6 py-16 pb-28"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          How it{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
            works
          </span>
        </h2>

        <div className="mt-12 flex items-start justify-between">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="flex w-40 flex-col items-center text-center sm:w-48">
                <div className="flex items-center gap-2">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-indigo-500/40 bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/10 shadow-[0_0_25px_-6px_rgba(129,140,248,0.7)] dark:border-indigo-400/30 dark:from-indigo-600/40 dark:to-fuchsia-600/30">
                    <step.icon
                      className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {step.number}
                  </span>
                </div>
                <p className="mt-4 text-base font-semibold text-foreground">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {i !== STEPS.length - 1 && (
                <div className="mt-8 hidden flex-1 border-t border-dashed border-border sm:block" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
