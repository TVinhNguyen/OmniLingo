/**
 * Learning settings RSC — fetches `me` for current daily goal + reminder time,
 * then hands off to client form. Save action calls updateLearningPreferences.
 */
import { redirect } from "next/navigation"
import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { ME_QUERY } from "@/lib/api/queries"
import type { User } from "@/lib/api/types"
import { LearningClient } from "./learning-client"

export default async function LearningSettingsPage() {
  const token = await getAccessToken()
  if (!token) redirect("/sign-in")

  let dailyGoalMinutes = 15
  let reminderTime: string | null = null

  try {
    const res = await gql<{ me: User }>(ME_QUERY, {}, token)
    if (res?.me) {
      dailyGoalMinutes = res.me.dailyGoalMinutes ?? 15
      reminderTime = res.me.reminderTime ?? null
    }
  } catch {
    // identity / learning-service unavailable — fall back to defaults
  }

  return <LearningClient initial={{ dailyGoalMinutes, reminderTime }} />
}
