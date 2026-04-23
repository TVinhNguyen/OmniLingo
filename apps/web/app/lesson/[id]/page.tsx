/**
 * Lesson RSC Page — start lesson session, then render client player.
 * Pattern: RSC fetches session via startLesson mutation → passes sessionId to client.
 */
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { gql } from "@/lib/api/client";
import { START_LESSON_MUTATION } from "@/lib/api/mutations";
import LessonClient from "./lesson-client";

interface StartLessonResult {
  startLesson: { sessionId: string; lessonId: string };
}

// Fallback mock session for when backend is unavailable
const MOCK_SESSION_ID = "mock-session";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const token = await getAccessToken();
  if (!token) redirect("/sign-in");

  let sessionId = MOCK_SESSION_ID;

  try {
    const data = await gql<StartLessonResult>(
      START_LESSON_MUTATION,
      { lessonId: id },
      token,
    );
    sessionId = data.startLesson.sessionId;
  } catch {
    // Backend unavailable or lesson not found — use mock, still show UI
    sessionId = MOCK_SESSION_ID;
  }

  return <LessonClient sessionId={sessionId} lessonId={id} />;
}
