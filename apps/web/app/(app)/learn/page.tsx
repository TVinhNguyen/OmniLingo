import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { MY_TRACKS_QUERY } from "@/lib/api/queries"
import type { LearningTrack } from "@/lib/api/types"
import { LearnClient } from "./learn-client"

const MOCK_TRACKS: LearningTrack[] = [
  { id: "jp-general", title: "Tiếng Nhật Tổng Quát", language: "ja", level: "N5", progressPct: 68 },
  { id: "en-general", title: "Business English", language: "en", level: "B1", progressPct: 32 },
]

export default async function LearnPage() {
  const token = await getAccessToken()
  let tracks: LearningTrack[] = MOCK_TRACKS
  try {
    const res = await gql<{ myTracks: LearningTrack[] }>(MY_TRACKS_QUERY, {}, token ?? undefined)
    if (res?.myTracks?.length) tracks = res.myTracks
  } catch {}

  return <LearnClient tracks={tracks} />
}
