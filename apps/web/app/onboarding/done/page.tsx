import { guardOnboardingStep } from "../_guard"
import DoneClient from "./done-client"

export default async function DonePage() {
  const state = await guardOnboardingStep("done")
  return (
    <DoneClient
      placementCefr={state.placementCefr}
      recommendedTrackId={state.recommendedTrackId}
      answers={state.answers as Record<string, unknown>}
    />
  )
}
