/**
 * Onboarding helpers — convert between BE state machine step (snake_case) and
 * URL slug (kebab-case). The BE source of truth lives in identity/learning
 * service outbox events, so we keep snake_case there and just map on the FE.
 */
import type { OnboardingStep } from "@/lib/api/types"

const STEP_TO_SLUG: Record<OnboardingStep, string> = {
  language_select: "language-select",
  goal_select:     "goal-select",
  level_select:    "level-select",
  placement:       "placement",
  done:            "done",
}

const SLUG_TO_STEP: Record<string, OnboardingStep> = Object.fromEntries(
  Object.entries(STEP_TO_SLUG).map(([k, v]) => [v, k as OnboardingStep]),
) as Record<string, OnboardingStep>

export function stepToSlug(step: OnboardingStep): string {
  return STEP_TO_SLUG[step]
}

export function slugToStep(slug: string): OnboardingStep | null {
  return SLUG_TO_STEP[slug] ?? null
}

export function onboardingRouteForStep(step: OnboardingStep): string {
  return `/onboarding/${STEP_TO_SLUG[step]}`
}
