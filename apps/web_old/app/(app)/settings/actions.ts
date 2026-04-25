"use server";

/**
 * Server Actions for /settings page.
 * Handles profile update via BFF GraphQL mutation.
 */

import { revalidatePath } from "next/cache";
import { gql } from "@/lib/api/client";
import { UPDATE_PROFILE_MUTATION } from "@/lib/api/mutations";
import { getAccessToken } from "@/lib/auth/session";
import type { User } from "@/lib/api/types";

export interface UpdateProfileState {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  _prev: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const token = await getAccessToken();
  if (!token) {
    return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const displayName = formData.get("displayName") as string | null;
  const bio = formData.get("bio") as string | null;
  const uiLanguage = formData.get("uiLanguage") as string | null;
  const timezone = formData.get("timezone") as string | null;

  const variables: Record<string, string | undefined> = {};
  if (displayName !== null) variables.displayName = displayName;
  if (bio !== null) variables.bio = bio;
  if (uiLanguage !== null) variables.uiLanguage = uiLanguage;
  if (timezone !== null) variables.timezone = timezone;

  try {
    await gql<{ updateProfile: User }>(
      UPDATE_PROFILE_MUTATION,
      variables,
      token,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Cập nhật thất bại.";
    return { error: msg };
  }

  revalidatePath("/settings");
  revalidatePath("/profile");
  return { success: true };
}
