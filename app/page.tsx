import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PartnerLogos } from "@/components/partner-logos"
import { IntroductionSection } from "@/components/introduction-section"
import { FeatureCards } from "@/components/feature-cards"
import { BottomBadge } from "@/components/bottom-badge"
import { Footer } from "@/components/footer"
import { HowItWorks } from "@/components/how-it-works"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background geometric pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Navigation />
      <HeroSection />

      {/* What is Onion AI Section */}
      <section className="relative py-20 px-6">
        <PartnerLogos />
        <IntroductionSection />
        <FeatureCards />
        <BottomBadge />
      </section>

      <HowItWorks />

      <Footer />
    </div>
  )
}
