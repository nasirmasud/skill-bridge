import { Hero } from "@/components/home/Hero"
import { TrustedBy } from "@/components/home/TrustedBy"
import { BrowseCategory } from "@/components/home/BrowseCategory"
import { PopularServices } from "@/components/home/PopularServices"
import { OrderLifecycle } from "@/components/home/OrderLifecycle"
import { Stats } from "@/components/home/Stats"
import { HowItWorks } from "@/components/home/HowItWorks"
import { CuratedStacks } from "@/components/home/CuratedStacks"
import { VerifiedTalents } from "@/components/home/VerifiedTalents"
import { BecomeASeller } from "@/components/home/BecomeASeller"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function Home() {
  usePageTitle("Home")
  return (
    <main>
      <Hero />
      <TrustedBy />
      <BrowseCategory />
      <PopularServices />
      <OrderLifecycle />
      <Stats />
      <HowItWorks />
      <CuratedStacks />
      <VerifiedTalents />
      <BecomeASeller />
    </main>
  )
}
