"use server";

import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import { COMPLETE_LESSON_MUTATION } from "@/lib/api/mutations";

/**
 * completeLessonAction — records lesson completion via BFF.
 * Fire-and-forget from the client; errors are silently swallowed.
 */
export async function completeLessonAction(
  lessonId: string,
  xpEarned: number,
): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;
  try {
    await gql(COMPLETE_LESSON_MUTATION, { lessonId, xpEarned }, token);
  } catch {
    // Non-critical — client-side XP still displayed
  }
}
