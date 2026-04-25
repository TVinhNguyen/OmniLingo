"use server";

import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import {
  UPDATE_ONBOARDING_MUTATION,
  COMPLETE_ONBOARDING_MUTATION,
  SUBMIT_PLACEMENT_MUTATION,
} from "@/lib/api/mutations";
import type {
  OnboardingState,
  PlacementAnswerInput,
  PlacementResult,
} from "@/lib/api/types";

/**
 * Persist data for one step in the onboarding state machine.
 * BE merges `data` into state.answers and advances `step`.
 */
export async function updateOnboardingStepAction(
  step: string,
  data: Record<string, unknown>,
): Promise<{ state?: OnboardingState; error?: string }> {
  const token = await getAccessToken();
  if (!token) return { error: "Chưa đăng nhập" };
  try {
    const res = await gql<{ updateOnboarding: OnboardingState }>(
      UPDATE_ONBOARDING_MUTATION,
      { step, data },
      token,
    );
    return { state: res.updateOnboarding };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Lưu thất bại" };
  }
}

/**
 * Submit placement test answers; returns cefr + recommendedTrackId.
 */
export async function submitPlacementAction(
  testId: string,
  answers: PlacementAnswerInput[],
): Promise<{ result?: PlacementResult; error?: string }> {
  const token = await getAccessToken();
  if (!token) return { error: "Chưa đăng nhập" };
  try {
    const res = await gql<{ submitPlacement: PlacementResult }>(
      SUBMIT_PLACEMENT_MUTATION,
      { testId, answers },
      token,
    );
    return { result: res.submitPlacement };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Nộp bài thất bại" };
  }
}

/**
 * Finalize onboarding: BE sets completedAt, publishes onboarding.completed,
 * and auto-enrolls the recommended track. Redirects to /dashboard on success.
 */
export async function completeOnboardingAction(
  placementCefr?: string | null,
  recommendedTrackId?: string | null,
): Promise<{ error?: string } | never> {
  const token = await getAccessToken();
  if (!token) return { error: "Chưa đăng nhập" };
  try {
    await gql(
      COMPLETE_ONBOARDING_MUTATION,
      {
        placementCefr: placementCefr ?? null,
        recommendedTrackId: recommendedTrackId ?? null,
      },
      token,
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Hoàn tất thất bại" };
  }
  redirect("/dashboard");
}
