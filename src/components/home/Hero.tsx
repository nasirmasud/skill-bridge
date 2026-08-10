import { Search, Star, ShieldCheck, RotateCcw, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

const AVATARS = [
  "https://i.pravatar.cc/64?img=12",
  "https://i.pravatar.cc/64?img=32",
  "https://i.pravatar.cc/64?img=47",
]

const POPULAR_TAGS = [
  "Web Design",
  "Logo Design",
  "Video Editing",
  "SEO",
  "WordPress",
]

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% protected",
  },
  {
    icon: RotateCcw,
    title: "Money Back Guarantee",
    subtitle: "14-day guarantee",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We're here to help",
  },
]

function AvatarStack({ size = "h-6 w-6" }: { size?: string }) {
  return (
    <div className="flex -space-x-2">
      {AVATARS.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={`${size} rounded-full border-2 border-[#07070c] object-cover`}
        />
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#07070c]">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large purple ambient glow, biased top-left */}
        <div className="absolute -top-40 left-[-10%] h-[700px] w-[700px] rounded-full bg-purple-700/25 blur-[120px]" />
        <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px]" />
        {/* Faint secondary glow bleeding toward the right/text side */}
        <div className="absolute -left-[10%] top-10 h-[350px] w-[350px] rounded-full bg-indigo-900/20 blur-[110px]" />

        {/* Scattered star / sparkle dots across the whole section */}
        <span className="absolute left-[8%] top-[14%] h-1 w-1 rounded-full bg-white/60 shadow-[0_0_6px_1px_rgba(255,255,255,0.5)]" />
        <span className="absolute left-[22%] top-[55%] h-1 w-1 rounded-full bg-fuchsia-300/70 shadow-[0_0_8px_2px_rgba(232,121,249,0.5)]" />
        <span className="absolute left-[40%] top-[8%] h-[3px] w-[3px] rounded-full bg-white/50" />
        <span className="absolute right-[38%] top-[18%] h-1 w-1 rounded-full bg-indigo-200/70 shadow-[0_0_6px_1px_rgba(199,210,254,0.5)]" />
        <span className="absolute right-[6%] top-[8%] h-[3px] w-[3px] rounded-full bg-white/60" />
        <span className="absolute right-[30%] bottom-[10%] h-1 w-1 rounded-full bg-fuchsia-200/60" />
      </div>

      <div className="relative mx-auto grid grid-cols-1 items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        {/* Left column */}
        <div className="flex flex-col space-y-8">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full border border-white/10 bg-white/5 py-1.5 pl-3 pr-2 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Trusted by 10K+ businesses worldwide</span>
            <AvatarStack size="h-12 w-12" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
            Find the perfect freelance service for your{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
              business
            </span>
          </h1>

          {/* Subcopy */}
          <p className="max-w-md text-base text-white/60">
            Connect with talented freelancers and get high-quality work done —
            fast, reliable, and hassle-free.
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 pl-4 max-w-lg">
            <Search className="h-4 w-4 shrink-0 text-white/40" />
            <input
              type="text"
              placeholder="What service are you looking for?"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <Button className="shrink-0 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 text-white hover:opacity-90">
              Search
            </Button>
          </div>

          {/* Popular tags */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-white/50">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition-colors hover:bg-white/10"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white/70" />
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="text-xs text-white/50">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="relative ml-auto flex h-[480px] w-full max-w-xl items-center justify-center lg:h-[600px] lg:max-w-2xl">
          {/* Glow */}
          <div className="absolute h-[420px] w-[420px] rounded-full bg-indigo-600/25 blur-3xl lg:h-[520px] lg:w-[520px]" />

          {/* Orbit rings */}
          <div className="absolute h-[480px] w-[480px] rounded-full border border-indigo-400/20 lg:h-[560px] lg:w-[560px]" />
          <div className="absolute h-[360px] w-[360px] rounded-full border border-fuchsia-400/10 lg:h-[420px] lg:w-[420px]" />
          <span className="absolute left-[18%] top-[22%] h-1.5 w-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_10px_2px_rgba(232,121,249,0.7)]" />
          <span className="absolute bottom-[20%] right-[12%] h-1 w-1 rounded-full bg-indigo-200 shadow-[0_0_8px_2px_rgba(199,210,254,0.7)]" />

          {/* Hero image */}
          <img
            src="https://images.unsplash.com/photo-1534430071631-854ff55eec78?w=800&q=80&auto=format&fit=crop"
            alt="Freelancer working on a laptop"
            className="relative z-10 h-full w-full rounded-3xl object-cover object-top [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_100%)]"
          />

          {/* Floating card: happy clients */}
          <div className="absolute right-0 top-6 z-20 flex items-center gap-3 rounded-xl border border-white/10 bg-[#12121a]/95 px-4 py-3 shadow-xl backdrop-blur">
            <AvatarStack size="h-7 w-7" />
            <div>
              <p className="text-sm font-semibold text-white">10K+</p>
              <p className="text-xs text-white/50">Happy Clients</p>
              <div className="mt-0.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating card: secure payments */}
          <div className="absolute bottom-6 right-0 z-20 w-48 rounded-xl border border-white/10 bg-[#12121a]/95 p-4 shadow-xl backdrop-blur">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/10">
              <ShieldCheck className="h-4 w-4 text-indigo-300" />
            </div>
            <p className="mt-2.5 text-sm font-semibold leading-tight text-white">
              Secure Payments
            </p>
            <p className="mt-1 text-xs leading-snug text-white/50">
              Your transactions are protected
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
