import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { MY_PROGRESS_QUERY, WEEKLY_PROGRESS_QUERY, MY_STREAK_QUERY } from "@/lib/api/queries"
import type { ProgressSummary, WeeklyProgress, UserStreak } from "@/lib/api/types"
import { ProgressClient } from "./progress-client"

const MOCK_PROGRESS: ProgressSummary = { streak: 0, totalXp: 0, minutesLearned: 0, wordsMastered: 0 }
const MOCK_WEEKLY: WeeklyProgress[] = [
  { date: "Mon", xp: 220, minutes: 24 },
  { date: "Tue", xp: 380, minutes: 36 },
  { date: "Wed", xp: 120, minutes: 12 },
  { date: "Thu", xp: 440, minutes: 42 },
  { date: "Fri", xp: 310, minutes: 28 },
  { date: "Sat", xp: 560, minutes: 55 },
  { date: "Sun", xp: 490, minutes: 44 },
]

export default async function ProgressPage() {
  const token = await getAccessToken()
  let progress = MOCK_PROGRESS
  let weekly = MOCK_WEEKLY
  try {
    const [pRes, wRes, sRes] = await Promise.all([
      gql<{ myProgress: ProgressSummary }>(MY_PROGRESS_QUERY, {}, token ?? undefined),
      gql<{ weeklyProgress: WeeklyProgress[] }>(WEEKLY_PROGRESS_QUERY, { days: 7 }, token ?? undefined),
      gql<{ myStreak: UserStreak }>(MY_STREAK_QUERY, {}, token ?? undefined),
    ])
    if (pRes?.myProgress) progress = pRes.myProgress
    if (wRes?.weeklyProgress?.length) weekly = wRes.weeklyProgress
    // Prefer gamification streak (authoritative) over progress-service streak
    if (sRes?.myStreak?.current) {
      progress = { ...progress, streak: sRes.myStreak.current, totalXp: sRes.myStreak.totalXp }
    }
  } catch {}

  return <ProgressClient progress={progress} weekly={weekly} />
}
