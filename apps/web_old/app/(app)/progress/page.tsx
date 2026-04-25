/**
 * /progress — async RSC
 * Fetches real ProgressSummary (streak, totalXp, minutesLearned, wordsMastered).
 * Charts use deterministic mock weekly data (BFF has no time-series endpoint yet).
 */
import { cookies } from "next/headers";
import { gql } from "@/lib/api/client";
import { MY_PROGRESS_QUERY } from "@/lib/api/queries";
import type { ProgressSummary } from "@/lib/api/types";
import ProgressClient from "./progress-client";

const MOCK_PROGRESS: ProgressSummary = {
  streak: 7,
  totalXp: 1240,
  minutesLearned: 148,
  wordsMastered: 312,
};

async function fetchMyProgress(): Promise<ProgressSummary> {
  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return MOCK_PROGRESS;

    const data = await gql<{ myProgress: ProgressSummary }>(
      MY_PROGRESS_QUERY,
      undefined,
      token,
    );
    return data.myProgress;
  } catch {
    return MOCK_PROGRESS;
  }
}

export default async function ProgressPage() {
  const progress = await fetchMyProgress();
  return <ProgressClient progress={progress} />;
}
