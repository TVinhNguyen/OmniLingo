/**
 * Leaderboard RSC Page — fetches real league leaderboard from gamification-service.
 * Falls back to mock data when service unavailable.
 */
import { getAccessToken } from "@/lib/auth/session"
import { gql } from "@/lib/api/client"
import { MY_LEADERBOARD_QUERY } from "@/lib/api/queries"
import type { Leaderboard } from "@/lib/api/types"
import LeaderboardClient from "./leaderboard-client"

export default async function LeaderboardPage() {
  const token = await getAccessToken()
  let leaderboard: Leaderboard | undefined

  try {
    const res = await gql<{ myLeaderboard: Leaderboard }>(
      MY_LEADERBOARD_QUERY,
      {},
      token ?? undefined,
    )
    if (res?.myLeaderboard?.entries) leaderboard = res.myLeaderboard
  } catch {
    // Service unavailable — client falls back to mock data
  }

  return <LeaderboardClient serverLeaderboard={leaderboard} />
}
