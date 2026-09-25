import { Hero } from "@/components/home/Hero"
import { TrustedBy } from "@/components/home/TrustedBy"
import { BrowseCategory } from "@/components/home/BrowseCategory"
import { PopularServices } from "@/components/home/PopularServices"
import { OrderLifecycle } from "@/components/home/OrderLifecycle"
import { HowItWorks } from "@/components/home/HowItWorks"
import { CuratedStacks } from "@/components/home/CuratedStacks"
import { VerifiedTalents } from "@/components/home/VerifiedTalents"
import { ClientDashboardPreview } from "@/components/home/ClientDashboardPreview"
import { SellerWizardPreview } from "@/components/home/SellerWizardPreview"
import { Testimonials } from "@/components/home/Testimonials"
import { Governance } from "@/components/home/Governance"
import { MarketplaceStats } from "@/components/home/MarketplaceStats"
import { Faq } from "@/components/home/Faq"
import { DualCta } from "@/components/home/DualCta"
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
      <HowItWorks />
      <CuratedStacks />
      <VerifiedTalents />
      <ClientDashboardPreview />
      <SellerWizardPreview />
      <Testimonials />
      <Governance />
      <MarketplaceStats />
      <Faq />
      <DualCta />
    </main>
  )
}
