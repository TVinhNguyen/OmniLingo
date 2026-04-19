/**
 * TypeScript types mirroring the web-bff GraphQL schema.
 * Keep in sync with services/web-bff/src/schema/schema.ts
 */

export type LessonStatus = "locked" | "available" | "completed";

export interface User {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
}

export interface FeatureSummary {
  code: string;
  allowed: boolean;
  quota: number;
}

export interface Entitlement {
  planTier: string;
  validUntil: string | null;
  features: FeatureSummary[];
}

export interface ProgressSummary {
  streak: number;
  totalXp: number;
  minutesLearned: number;
  wordsMastered: number;
}

export interface LearningTrack {
  id: string;
  title: string;
  language: string;
  level: string;
  progressPct: number;
}

export interface Lesson {
  id: string;
  title: string;
  unitId: string;
  orderIndex: number;
  durationMin: number;
  status: LessonStatus;
}

export interface Deck {
  id: string;
  name: string;
  cardCount: number;
  dueCount: number;
  masteredCount: number;
}

export interface Dashboard {
  user: User;
  progress: ProgressSummary;
  entitlement: Entitlement;
  myTracks: LearningTrack[];
  myDecks: Deck[];
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatResult {
  conversationId: string;
  message: ChatMessage;
  quotaRemaining: number;
}

export interface ExplainResult {
  explanation: string;
  examples: string[];
}

export interface StartLessonResult {
  sessionId: string;
  lessonId: string;
}

export interface WeeklyProgress {
  date: string;
  xp: number;
  minutes: number;
}
