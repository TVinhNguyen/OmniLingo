/**
 * Achievements RSC Page — fetches real achievements from gamification-service via BFF.
 * Falls back to mock data when service unavailable.
 */
import { getAccessToken } from "@/lib/auth/session"
import { gql } from "@/lib/api/client"
import { MY_ACHIEVEMENTS_QUERY } from "@/lib/api/queries"
import type { Achievement } from "@/lib/api/types"
import AchievementsClient from "./achievements-client"

export default async function AchievementsPage() {
  const token = await getAccessToken()
  let achievements: Achievement[] = []

  try {
    const res = await gql<{ myAchievements: Achievement[] }>(
      MY_ACHIEVEMENTS_QUERY,
      {},
      token ?? undefined,
    )
    if (res?.myAchievements?.length) achievements = res.myAchievements
  } catch {
    // Service unavailable — client falls back to mock data
  }

  return <AchievementsClient serverAchievements={achievements} />
}
