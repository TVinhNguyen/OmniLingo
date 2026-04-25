/**
 * Shared RSC guard for onboarding sub-routes.
 * Returns the user's OnboardingState when the caller is the canonical route,
 * otherwise redirects to the root dispatcher (or /dashboard if complete).
 */
import { redirect } from "next/navigation"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { ONBOARDING_STATE_QUERY } from "@/lib/api/queries"
import type { OnboardingState, OnboardingStep } from "@/lib/api/types"

export async function guardOnboardingStep(
  expected: OnboardingStep,
): Promise<OnboardingState> {
  const token = await getAccessToken()
  if (!token) redirect("/sign-in?next=/onboarding")

  const res = await gql<{ onboardingState: OnboardingState }>(
    ONBOARDING_STATE_QUERY,
    {},
    token,
  )
  const state = res.onboardingState

  if (state.completedAt && expected !== "done") redirect("/dashboard")
  if (state.step !== expected) redirect("/onboarding")
  return state
}
