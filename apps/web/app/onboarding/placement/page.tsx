import { redirect } from "next/navigation"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { PLACEMENT_TEST_QUERY } from "@/lib/api/queries"
import type { PlacementTest } from "@/lib/api/types"
import { guardOnboardingStep } from "../_guard"
import PlacementClient from "./placement-client"

export default async function PlacementPage() {
  const state = await guardOnboardingStep("placement")
  const answers = state.answers as { nativeLang?: string; targetLangs?: string[] }
  const lang = answers.nativeLang ?? "vi"
  const targetLang = answers.targetLangs?.[0] ?? "en"

  const token = await getAccessToken()
  if (!token) redirect("/sign-in?next=/onboarding/placement")

  let test: PlacementTest | null = null
  let loadError: string | null = null
  try {
    const res = await gql<{ placementTest: PlacementTest }>(
      PLACEMENT_TEST_QUERY,
      { lang, targetLang },
      token,
    )
    test = res.placementTest
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Không tải được bài test"
  }

  return <PlacementClient test={test} loadError={loadError} />
}
