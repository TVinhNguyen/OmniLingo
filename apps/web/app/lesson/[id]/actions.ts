"use server";

import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import { COMPLETE_LESSON_MUTATION, SUBMIT_ANSWER_MUTATION } from "@/lib/api/mutations";
import type { SubmitAnswerResult } from "@/lib/api/types";

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

/**
 * submitAnswerAction — grades a single exercise answer via assessment-service.
 * Returns null when backend is unavailable so the client can fall back to
 * local grading.
 */
export async function submitAnswerAction(args: {
  lessonId:      string;
  exerciseId:    string;
  exerciseKind:  string;
  answer:        unknown;
  correctAnswer: unknown;
  maxScore:      number;
  skillTag:      string;
  language:      string;
}): Promise<SubmitAnswerResult | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const data = await gql<{ submitAnswer: SubmitAnswerResult }>(
      SUBMIT_ANSWER_MUTATION,
      args,
      token,
    );
    return data.submitAnswer;
  } catch {
    return null;
  }
}
