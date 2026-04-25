import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { ME_QUERY, MY_TRACKS_QUERY, MY_STREAK_QUERY } from "@/lib/api/queries"
import type { User, LearningTrack, UserStreak } from "@/lib/api/types"
import { ProfileClient } from "./profile-client"

const MOCK_USER: User = { id: "0", username: "Người dùng", avatarUrl: null, bio: null, createdAt: new Date().toISOString(), dailyGoalMinutes: 15, reminderTime: null, learningLanguages: [] }

export default async function ProfilePage() {
  const token = await getAccessToken()
  let user: User = MOCK_USER
  let tracks: LearningTrack[] = []
  let streak: UserStreak | undefined
  try {
    const [uRes, tRes, sRes] = await Promise.all([
      gql<{ me: User }>(ME_QUERY, {}, token ?? undefined),
      gql<{ myTracks: LearningTrack[] }>(MY_TRACKS_QUERY, {}, token ?? undefined),
      gql<{ myStreak: UserStreak }>(MY_STREAK_QUERY, {}, token ?? undefined),
    ])
    if (uRes?.me) user = uRes.me
    if (tRes?.myTracks) tracks = tRes.myTracks
    if (sRes?.myStreak) streak = sRes.myStreak
  } catch {}

  return <ProfileClient user={user} tracks={tracks} streak={streak} />
}
