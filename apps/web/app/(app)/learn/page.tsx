import { gql } from "@/lib/api/client"
import { getAccessToken } from "@/lib/auth/session"
import { COURSES_QUERY, LESSONS_QUERY, MY_TRACKS_QUERY, UNITS_QUERY } from "@/lib/api/queries"
import type { Course, Lesson, LearningTrack, UnitDTO } from "@/lib/api/types"
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

  // For active track (first), fetch first course → its units. allSettled
  // pattern: track grid still renders even if content-service is down.
  // Lesson completion isn't modelled in BE schema yet; client renders 0%
  // progress per brief.
  const activeTrack = tracks[0]
  let activeCourse: Course | null = null
  let activeUnits: UnitDTO[] = []
  if (activeTrack) {
    try {
      const coursesRes = await gql<{ courses: Course[] }>(
        COURSES_QUERY,
        { trackId: activeTrack.id, language: activeTrack.language },
        token ?? undefined,
      )
      if (coursesRes?.courses?.length) {
        activeCourse = coursesRes.courses[0]
        const unitsRes = await gql<{ units: UnitDTO[] }>(
          UNITS_QUERY,
          { courseId: activeCourse.id, language: activeTrack.language },
          token ?? undefined,
        )
        activeUnits = unitsRes?.units ?? []
      }
    } catch {}
  }

  // Fetch lessons for each unit in parallel — graceful degradation per unit
  const lessonsMap: Record<string, Lesson[]> = {}
  if (activeUnits.length > 0) {
    const results = await Promise.allSettled(
      activeUnits.map((u) =>
        gql<{ lessons: Lesson[] }>(LESSONS_QUERY, { unitId: u.id }, token ?? undefined),
      ),
    )
    results.forEach((r, i) => {
      if (r.status === "fulfilled" && r.value?.lessons?.length) {
        lessonsMap[activeUnits[i].id] = r.value.lessons
      }
    })
  }

  return (
    <LearnClient
      tracks={tracks}
      activeCourse={activeCourse}
      activeUnits={activeUnits}
      lessonsMap={lessonsMap}
    />
  )
}
