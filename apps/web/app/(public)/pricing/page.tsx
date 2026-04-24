/**
 * Pricing RSC — fetches real pricingPlans from BFF, falls back to mock when unavailable.
 * Public route (no auth token required).
 */
import { gql } from "@/lib/api/client"
import { PRICING_PLANS_QUERY } from "@/lib/api/queries"
import type { Plan } from "@/lib/api/types"
import PricingClient from "./pricing-client"

export default async function PricingPage() {
  let plans: Plan[] = []
  try {
    const res = await gql<{ pricingPlans: Plan[] }>(
      PRICING_PLANS_QUERY,
      { currency: "VND", country: "VN" },
    )
    if (res?.pricingPlans?.length) plans = res.pricingPlans
  } catch {
    // billing-service unavailable → client falls back to MOCK_PLANS
  }
  return <PricingClient plans={plans} />
}
