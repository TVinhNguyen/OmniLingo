import { PublicNavbar } from "@/components/public/public-navbar"
import { PublicFooter } from "@/components/public/public-footer"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Certifications } from "@/components/landing/certifications"
import { Testimonials } from "@/components/landing/testimonials"
import { PricingPreview } from "@/components/landing/pricing-preview"
import { FAQ } from "@/components/landing/faq"
import { CTABanner } from "@/components/landing/cta-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main>
        <Hero />
        <Features />
        <Certifications />
        <Testimonials />
        <PricingPreview />
        <FAQ />
        <CTABanner />
      </main>
      <PublicFooter />
    </div>
  )
}
