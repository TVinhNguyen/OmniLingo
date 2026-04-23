/**
 * /test-prep — async RSC
 * Checks entitlement for test_prep feature.
 * Free users: shows gate with upgrade CTA.
 * Paid users: renders full page.
 */
import { cookies } from "next/headers";
import { gql } from "@/lib/api/client";
import { CHECK_FEATURE_QUERY } from "@/lib/api/queries";
import type { FeatureSummary } from "@/lib/api/types";
import TestPrepClient from "./test-prep-client";
import TestPrepGate from "./test-prep-gate";

async function checkTestPrepAccess(): Promise<FeatureSummary> {
  const FREE_FALLBACK: FeatureSummary = { code: "test_prep", allowed: true, quota: 1 };
  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return FREE_FALLBACK;

    const data = await gql<{ checkFeature: FeatureSummary }>(
      CHECK_FEATURE_QUERY,
      { code: "test_prep" },
      token,
    );
    return data.checkFeature;
  } catch {
    return FREE_FALLBACK;
  }
}

export default async function TestPrepPage() {
  const entitlement = await checkTestPrepAccess();

  if (!entitlement.allowed) {
    return <TestPrepGate />;
  }

  return <TestPrepClient quota={entitlement.quota} />;
}
