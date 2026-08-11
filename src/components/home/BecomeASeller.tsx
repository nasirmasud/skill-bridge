import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BecomeASeller() {
  return (
    <section
      id="become-a-seller"
      className="w-full scroll-mt-20 bg-background px-6 py-10 pb-28"
    >
      <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-violet-800 to-fuchsia-800 px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-400/25 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Turn your skills into income
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            Join thousands of freelancers earning by doing what they do best.
          </p>
          <Button
            asChild
            className="mt-7 gap-2 rounded-lg bg-white px-6 text-indigo-700 shadow-none hover:bg-white/90 hover:text-indigo-700"
          >
            <Link to="/register">
              Become a Seller
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
