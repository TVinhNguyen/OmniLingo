import { Suspense } from "react"
import { gql } from "@/lib/api/client"
import { PRICING_PLANS_QUERY } from "@/lib/api/queries"
import type { Plan } from "@/lib/api/types"
import CancelClient from "./cancel-client"

/**
 * /checkout/cancel — RSC parent: fetch real VND plans (cheapest is rendered in
 * the "Muốn thử plan rẻ hơn?" accordion). Suspense wraps client child because
 * it uses useSearchParams.
 */
export default async function CancelPage() {
  let plans: Plan[] = []
  try {
    const res = await gql<{ pricingPlans: Plan[] }>(
      PRICING_PLANS_QUERY,
      { currency: "VND", country: "VN" },
    )
    plans = res?.pricingPlans ?? []
  } catch {
    plans = []
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-soft" />}>
      <CancelClient plans={plans} />
    </Suspense>
  )
}
