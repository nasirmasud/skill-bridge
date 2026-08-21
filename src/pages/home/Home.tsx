import { Hero } from "@/components/home/Hero"
import { BrowseCategory } from "@/components/home/BrowseCategory"
import { PopularServices } from "@/components/home/PopularServices"
import { Stats } from "@/components/home/Stats"
import { HowItWorks } from "@/components/home/HowItWorks"
import { BecomeASeller } from "@/components/home/BecomeASeller"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function Home() {
  usePageTitle("Home")
  return (
    <main>
      <Hero />
      <BrowseCategory />
      <PopularServices />
      <Stats />
      <HowItWorks />
      <BecomeASeller />
    </main>
  )
}
