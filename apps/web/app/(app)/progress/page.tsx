import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import {
  MY_PROGRESS_QUERY,
  WEEKLY_PROGRESS_QUERY,
  MY_STREAK_QUERY,
  SKILL_SCORES_QUERY,
  CERT_PREDICT_QUERY,
} from "@/lib/api/queries"
import type {
  ProgressSummary,
  WeeklyProgress,
  UserStreak,
  SkillOverview,
  CertPrediction,
} from "@/lib/api/types"
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
  let skillOverview: SkillOverview | null = null
  let certPrediction: CertPrediction | null = null
  try {
    const [pRes, wRes, sRes, skRes, cRes] = await Promise.allSettled([
      gql<{ myProgress: ProgressSummary }>(MY_PROGRESS_QUERY, {}, token ?? undefined),
      gql<{ weeklyProgress: WeeklyProgress[] }>(WEEKLY_PROGRESS_QUERY, { days: 7 }, token ?? undefined),
      gql<{ myStreak: UserStreak }>(MY_STREAK_QUERY, {}, token ?? undefined),
      // TODO: read language + cert from user preferences (me.uiLanguage / onboardingState.certGoal).
      // Hardcoded "en"/"ielts" skews the radar and prediction for learners of other languages.
      gql<{ skillScores: SkillOverview }>(SKILL_SCORES_QUERY, { language: "en" }, token ?? undefined),
      gql<{ certPredict: CertPrediction }>(CERT_PREDICT_QUERY, { cert: "ielts" }, token ?? undefined),
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
  } catch {}

  return (
    <ProgressClient
      progress={progress}
      weekly={weekly}
      skillOverview={skillOverview}
      certPrediction={certPrediction}
    />
  )
}
