/**
 * Lesson RSC Page — start lesson session + fetch content, then render client player.
 * Pattern: RSC runs startLesson mutation and lessonContent query in parallel;
 * falls back to null content (client renders mock) when backend is unavailable.
 */
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import { START_LESSON_MUTATION } from "@/lib/api/mutations";
import { LESSON_CONTENT_QUERY } from "@/lib/api/queries";
import type { LessonContent } from "@/lib/api/types";
import LessonClient from "./lesson-client";

interface StartLessonResult {
  startLesson: { sessionId: string; lessonId: string };
}

interface LessonContentResult {
  lessonContent: LessonContent;
}

const MOCK_SESSION_ID = "mock-session";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const token = await getAccessToken();
  if (!token) redirect("/sign-in");

  const [sessionResult, contentResult] = await Promise.allSettled([
    gql<StartLessonResult>(START_LESSON_MUTATION, { lessonId: id }, token),
    gql<LessonContentResult>(LESSON_CONTENT_QUERY, { lessonId: id }, token),
  ]);

  const sessionId =
    sessionResult.status === "fulfilled"
      ? sessionResult.value.startLesson.sessionId
      : MOCK_SESSION_ID;

  const content =
    contentResult.status === "fulfilled" && contentResult.value.lessonContent.exercises.length > 0
      ? contentResult.value.lessonContent
      : null;

  return <LessonClient sessionId={sessionId} lessonId={id} content={content} />;
}
