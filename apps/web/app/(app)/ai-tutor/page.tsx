import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { CHECK_FEATURE_QUERY } from "@/lib/api/queries"
import type { FeatureSummary } from "@/lib/api/types"
import { AiTutorClient } from "./ai-tutor-client"

const MOCK_FEATURE: FeatureSummary = { code: "ai_chat_tutor", allowed: true, quota: 10 }

export default async function AiTutorPage() {
  const token = await getAccessToken()
  let feature: FeatureSummary = MOCK_FEATURE
  try {
    const res = await gql<{ checkFeature: FeatureSummary }>(
      CHECK_FEATURE_QUERY,
      { code: "ai_chat_tutor" },
      token ?? undefined,
    )
    if (res?.checkFeature) feature = res.checkFeature
  } catch {}

  return <AiTutorClient feature={feature} />
}
