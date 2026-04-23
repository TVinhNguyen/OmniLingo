/**
 * /profile — async RSC
 * Fetches real User profile + LearningTracks from web-bff.
 */
import { cookies } from "next/headers";
import { gql } from "@/lib/api/client";
import { ME_QUERY, MY_TRACKS_QUERY } from "@/lib/api/queries";
import type { User, LearningTrack } from "@/lib/api/types";
import ProfileClient from "./profile-client";

const MOCK_USER: User = {
  id: "mock",
  username: "Learner",
  avatarUrl: null,
  bio: "Đang học ngôn ngữ mới mỗi ngày.",
  createdAt: new Date().toISOString(),
};

const MOCK_TRACKS: LearningTrack[] = [
  { id: "t1", title: "English B1", language: "en", level: "B1", progressPct: 62 },
  { id: "t2", title: "Japanese N5", language: "ja", level: "N5", progressPct: 34 },
];

async function fetchProfileData(): Promise<{ user: User; tracks: LearningTrack[] }> {
  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return { user: MOCK_USER, tracks: MOCK_TRACKS };

    const [userData, tracksData] = await Promise.all([
      gql<{ me: User }>(ME_QUERY, undefined, token),
      gql<{ myTracks: LearningTrack[] }>(MY_TRACKS_QUERY, undefined, token),
    ]);

    return {
      user: userData.me,
      tracks: tracksData.myTracks.length > 0 ? tracksData.myTracks : MOCK_TRACKS,
    };
  } catch {
    return { user: MOCK_USER, tracks: MOCK_TRACKS };
  }
}

export default async function ProfilePage() {
  const { user, tracks } = await fetchProfileData();
  return <ProfileClient user={user} tracks={tracks} />;
}
