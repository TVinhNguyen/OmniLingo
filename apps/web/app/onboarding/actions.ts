"use server";

import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";

const UPDATE_PROFILE_MUTATION = /* GraphQL */ `
  mutation UpdateProfile($uiLanguage: String, $bio: String) {
    updateProfile(uiLanguage: $uiLanguage, bio: $bio) {
      id
    }
  }
`;

/**
 * completeOnboardingAction — persists onboarding choices to identity-service via BFF.
 *
 * Currently captures: nativeLang (uiLanguage), targetLangs[], goal, level, dailyMins.
 * Stored as a JSON bio string until a dedicated onboarding endpoint exists (Phase 2).
 */
export async function completeOnboardingAction(data: {
  nativeLang:    string;
  targetLangs:   string[];
  goal?:         string;
  level?:        string;
  dailyMins?:    number;
  reminderTime?: string;
}): Promise<{ error?: string }> {
  const token = await getAccessToken();
  if (!token) return { error: "Chưa đăng nhập" };

  const bio = JSON.stringify({
    onboarding: true,
    targetLangs:  data.targetLangs,
    goal:         data.goal,
    level:        data.level,
    dailyMins:    data.dailyMins,
    reminderTime: data.reminderTime,
    completedAt:  new Date().toISOString(),
  });

  try {
    await gql(UPDATE_PROFILE_MUTATION, {
      uiLanguage: data.nativeLang,
      bio,
    }, token);
    return {};
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lưu thông tin thất bại";
    return { error: msg };
  }
}
