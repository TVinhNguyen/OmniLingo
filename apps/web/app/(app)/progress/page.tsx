import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import {
  ME_QUERY,
  MY_PROGRESS_QUERY,
  WEEKLY_PROGRESS_QUERY,
  MY_STREAK_QUERY,
  SKILL_SCORES_QUERY,
  CERT_PREDICT_QUERY,
  ACTIVITY_HEATMAP_QUERY,
} from "@/lib/api/queries"
import type {
  ProgressSummary,
  WeeklyProgress,
  UserStreak,
  SkillOverview,
  CertPrediction,
  ActivityDay,
  User,
} from "@/lib/api/types"
import { ProgressClient } from "./progress-client"
import { ActivityHeatmap } from "@/components/app/activity-heatmap"

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

  // Fetch `me` first so we know which language to use for skillScores. Done
  // sequentially (one extra round trip) so the second fan-out can be parameterised
  // by the user's primary learning language instead of a hardcoded "en".
  let me: User | null = null
  try {
    const res = await gql<{ me: User }>(ME_QUERY, {}, token ?? undefined)
    if (res?.me) me = res.me
  } catch {
    // identity / learning-service unavailable
  }
  const language = me?.learningLanguages?.[0] ?? "en"
  // TODO: replace hardcoded "ielts" once BE exposes a `certGoal` (LearningProfile is
  // not in the BFF schema yet — verified in services/web-bff/src/schema/schema.ts).
  const cert = "ielts"

  let progress = MOCK_PROGRESS
  let weekly = MOCK_WEEKLY
  let skillOverview: SkillOverview | null = null
  let certPrediction: CertPrediction | null = null
  let heatmap: ActivityDay[] = []
  try {
    const [pRes, wRes, sRes, skRes, cRes, hRes] = await Promise.allSettled([
      gql<{ myProgress: ProgressSummary }>(MY_PROGRESS_QUERY, {}, token ?? undefined),
      gql<{ weeklyProgress: WeeklyProgress[] }>(WEEKLY_PROGRESS_QUERY, { days: 7 }, token ?? undefined),
      gql<{ myStreak: UserStreak }>(MY_STREAK_QUERY, {}, token ?? undefined),
      gql<{ skillScores: SkillOverview }>(SKILL_SCORES_QUERY, { language }, token ?? undefined),
      gql<{ certPredict: CertPrediction }>(CERT_PREDICT_QUERY, { cert }, token ?? undefined),
      gql<{ activityHeatmap: ActivityDay[] }>(ACTIVITY_HEATMAP_QUERY, { days: 365 }, token ?? undefined),
    ])
    if (pRes.status === "fulfilled" && pRes.value?.myProgress) progress = pRes.value.myProgress
    if (wRes.status === "fulfilled" && wRes.value?.weeklyProgress?.length) weekly = wRes.value.weeklyProgress
    // Prefer gamification streak (authoritative) over progress-service streak
    if (sRes.status === "fulfilled" && sRes.value?.myStreak?.current) {
      progress = { ...progress, streak: sRes.value.myStreak.current, totalXp: sRes.value.myStreak.totalXp }
    }
    if (skRes.status === "fulfilled" && skRes.value?.skillScores?.skills.length) {
      skillOverview = skRes.value.skillScores
    }
    if (cRes.status === "fulfilled" && cRes.value?.certPredict) {
      certPrediction = cRes.value.certPredict
    }
    if (hRes.status === "fulfilled" && hRes.value?.activityHeatmap) {
      heatmap = hRes.value.activityHeatmap
    }
  } catch {}

  return (
    <div className="space-y-6">
      <ProgressClient
        progress={progress}
        weekly={weekly}
        skillOverview={skillOverview}
        certPrediction={certPrediction}
      />
      {heatmap.length > 0 && <ActivityHeatmap days={heatmap} />}
    </div>
  )
}
