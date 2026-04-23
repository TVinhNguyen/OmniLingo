/**
 * /lesson/[id] — Lesson Player RSC
 * Calls startLesson(lessonId) mutation to create/resume a session.
 * Passes sessionId to client component for exercise rendering.
 */
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { gql } from "@/lib/api/client";
import { START_LESSON_MUTATION } from "@/lib/api/mutations";
import type { StartLessonResult } from "@/lib/api/types";
import LessonPlayer from "./lesson-player";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function startLessonSession(lessonId: string): Promise<StartLessonResult | null> {
  try {
    const jar = await cookies();
    const token = jar.get("omni_at")?.value;
    if (!token) return null;

    const data = await gql<{ startLesson: StartLessonResult }>(
      START_LESSON_MUTATION,
      { lessonId },
      token,
    );
    return data.startLesson;
  } catch {
    return null;
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) notFound();

  const session = await startLessonSession(id);

  // If BFF unreachable (or mock scenario), render with deterministic mock session
  const resolved = session ?? {
    lessonId: id,
    sessionId: `mock-session-${id}`,
  };

  return (
    <LessonPlayer
      lessonId={resolved.lessonId}
      sessionId={resolved.sessionId}
    />
  );
}
