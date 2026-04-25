/**
 * /onboarding — RSC dispatcher. Fetches the user's onboarding state and
 * redirects to the canonical sub-route for the current step, or to /dashboard
 * if completed. Each sub-route guards against out-of-order navigation by
 * falling back to this dispatcher.
 */
import { redirect } from "next/navigation"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { ONBOARDING_STATE_QUERY } from "@/lib/api/queries"
import type { OnboardingState } from "@/lib/api/types"
import { onboardingRouteForStep } from "@/lib/onboarding"

export default async function OnboardingRootPage() {
  const token = await getAccessToken()
  if (!token) redirect("/sign-in?next=/onboarding")

  const res = await gql<{ onboardingState: OnboardingState }>(
    ONBOARDING_STATE_QUERY,
    {},
    token,
  )
  const state = res.onboardingState

  if (state.completedAt) redirect("/dashboard")
  redirect(onboardingRouteForStep(state.step))
}
