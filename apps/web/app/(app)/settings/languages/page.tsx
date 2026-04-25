/**
 * Languages settings RSC — fetches `me.learningLanguages` and hands off to client.
 * Save reuses updateLearningPreferences action from /settings/learning.
 */
import { redirect } from "next/navigation"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { ME_QUERY } from "@/lib/api/queries"
import type { User } from "@/lib/api/types"
import { LanguagesClient } from "./languages-client"

export default async function LanguagesSettingsPage() {
  const token = await getAccessToken()
  if (!token) redirect("/sign-in")

  let learningLanguages: string[] = []

  try {
    const res = await gql<{ me: User }>(ME_QUERY, {}, token)
    if (res?.me?.learningLanguages) {
      learningLanguages = res.me.learningLanguages
    }
  } catch {
    // identity / learning-service unavailable
  }

  return <LanguagesClient initial={{ learningLanguages }} />
}
