/**
 * /ai-tutor — RSC thin wrapper
 * Checks entitlement (quota) server-side before rendering client.
 */
import { cookies } from "next/headers";
import { gql } from "@/lib/api/client";
import { CHECK_FEATURE_QUERY } from "@/lib/api/queries";
import type { FeatureSummary } from "@/lib/api/types";
import AiTutorClient from "./ai-tutor-client";

async function fetchQuota(): Promise<number> {
  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return 10; // Free tier default

    const data = await gql<{ checkFeature: FeatureSummary }>(
      CHECK_FEATURE_QUERY,
      { code: "ai_tutor_messages" },
      token,
    );
    return data.checkFeature.quota;
  } catch {
    return 10; // fallback to free tier
  }
}

export default async function AiTutorPage() {
  const quotaRemaining = await fetchQuota();
  return <AiTutorClient initialQuota={quotaRemaining} />;
}
