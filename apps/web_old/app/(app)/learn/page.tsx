/**
 * /learn — RSC wrapper
 * Fetches real learning tracks from web-bff, passes to client component.
 */
import { cookies } from "next/headers";
import { gql } from "@/lib/api/client";
import { MY_TRACKS_QUERY } from "@/lib/api/queries";
import type { LearningTrack } from "@/lib/api/types";
import LearnClient from "./learn-client";

const MOCK_TRACKS: LearningTrack[] = [
  { id: "t1", title: "Japanese N5", language: "ja", level: "N5", progressPct: 62 },
  { id: "t2", title: "English B1", language: "en", level: "B1", progressPct: 35 },
];

async function fetchMyTracks(): Promise<LearningTrack[]> {
  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return MOCK_TRACKS;

    const data = await gql<{ myTracks: LearningTrack[] }>(
      MY_TRACKS_QUERY,
      undefined,
      token,
    );
    return data.myTracks.length > 0 ? data.myTracks : MOCK_TRACKS;
  } catch {
    return MOCK_TRACKS;
  }
}

export default async function LearnPage() {
  const tracks = await fetchMyTracks();
  return <LearnClient initialTracks={tracks} />;
}
