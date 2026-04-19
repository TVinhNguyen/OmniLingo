/**
 * DataSources: one typed class per domain service.
 * Each method is a thin wrapper over callUpstream, designed to be
 * called by GraphQL resolvers. DataLoader instances live here to
 * batch-load related data and prevent N+1 queries.
 */
import DataLoader from "dataloader";
import { callUpstream, type RequestOptions } from "./http.js";
import type { Config } from "../config.js";

// ─── Types returned by downstream services ────────────────────────────────────

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
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
  status: "locked" | "available" | "completed";
}

export interface Deck {
  id: string;
  name: string;
  cardCount: number;
  dueCount: number;
  masteredCount: number;
}

export interface Entitlement {
  planTier: string;
  validUntil?: string | null;
  features: Array<{ code: string; allowed: boolean; quota: number }>;
}

export interface ProgressSummary {
  userId: string;
  streak: number;
  totalXp: number;
  minutesLearned: number;
  wordsMastered: number;
}

// ─── DataSource base helper ────────────────────────────────────────────────────

type DS = { baseUrl: string; token?: string };

function call<T>(ds: DS, path: string, opts?: Omit<RequestOptions, "token">): Promise<T> {
  return callUpstream<T>(ds.baseUrl, path, { ...opts, token: ds.token });
}

// ─── Service DataSources ───────────────────────────────────────────────────────

export class IdentityDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.identity, token };
  }

  async getMe(): Promise<UserProfile> {
    // identity-service returns `display_name`, GQL schema expects `username`
    const raw = await call<Record<string, unknown>>(this.ds, "/api/v1/users/me");
    return {
      id: raw.id as string,
      username: (raw.display_name ?? raw.username ?? "") as string,
      email: (raw.email ?? "") as string,
      avatarUrl: (raw.avatar_url ?? raw.avatarUrl) as string | undefined,
      bio: (raw.bio ?? "") as string,
      createdAt: (raw.created_at ?? raw.createdAt ?? new Date().toISOString()) as string,
    };
  }

  async getUser(id: string): Promise<UserProfile> {
    const raw = await call<Record<string, unknown>>(this.ds, `/api/v1/users/${id}`);
    return {
      id: raw.id as string,
      username: (raw.display_name ?? raw.username ?? "") as string,
      email: (raw.email ?? "") as string,
      avatarUrl: (raw.avatar_url ?? raw.avatarUrl) as string | undefined,
      bio: (raw.bio ?? "") as string,
      createdAt: (raw.created_at ?? raw.createdAt ?? new Date().toISOString()) as string,
    };
  }

  async updateMe(patch: { displayName?: string; bio?: string; uiLanguage?: string; timezone?: string; avatarUrl?: string }): Promise<UserProfile> {
    // identity-service expects snake_case fields
    const body: Record<string, string> = {};
    if (patch.displayName !== undefined) body.display_name = patch.displayName;
    if (patch.bio !== undefined) body.bio = patch.bio;
    if (patch.uiLanguage !== undefined) body.ui_language = patch.uiLanguage;
    if (patch.timezone !== undefined) body.timezone = patch.timezone;
    if (patch.avatarUrl !== undefined) body.avatar_url = patch.avatarUrl;

    const raw = await call<Record<string, unknown>>(this.ds, "/api/v1/users/me", {
      method: "PATCH",
      body,
    });
    return {
      id: raw.id as string,
      username: (raw.display_name ?? raw.username ?? "") as string,
      email: (raw.email ?? "") as string,
      avatarUrl: (raw.avatar_url ?? raw.avatarUrl) as string | undefined,
      bio: (raw.bio ?? "") as string,
      createdAt: (raw.created_at ?? raw.createdAt ?? new Date().toISOString()) as string,
    };
  }
}

export class LearningDataSource {
  private ds: DS;

  /** DataLoader: batch-load multiple tracks in one request */
  trackLoader: DataLoader<string, LearningTrack>;

  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.learning, token };
    this.trackLoader = new DataLoader<string, LearningTrack>(async (ids) => {
      const res = await call<{ tracks: LearningTrack[] }>(
        this.ds, `/api/v1/tracks?ids=${ids.join(",")}`,
      );
      const map = new Map(res.tracks.map((t) => [t.id, t]));
      return ids.map((id) => map.get(id) ?? new Error(`Track ${id} not found`));
    });
  }

  async getMyTracks(): Promise<LearningTrack[]> {
    // learning-service wraps response: { paths: [...] }
    const raw = await call<{ paths?: LearningTrack[] }>(this.ds, "/api/v1/learning/paths");
    return raw.paths ?? [];
  }

  getLessons(unitId: string): Promise<Lesson[]> {
    // learning-service doesn't have a unit listing endpoint yet
    return Promise.resolve([]);
  }

  startLesson(lessonId: string): Promise<{ sessionId: string }> {
    return call<{ sessionId: string }>(this.ds, `/api/v1/learning/lessons/${lessonId}/start`, {
      method: "POST",
    });
  }
}

export class VocabularyDataSource {
  private ds: DS;

  deckLoader: DataLoader<string, Deck>;

  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.vocabulary, token };
    this.deckLoader = new DataLoader<string, Deck>(async (ids) => {
      const res = await call<{ decks: Deck[] }>(
        this.ds, `/api/v1/decks?ids=${ids.join(",")}`,
      );
      const map = new Map(res.decks.map((d) => [d.id, d]));
      return ids.map((id) => map.get(id) ?? new Error(`Deck ${id} not found`));
    });
  }

  async getMyDecks(): Promise<Deck[]> {
    // vocabulary-service wraps response: { decks: [...] } with snake_case fields
    const raw = await call<{ decks?: Array<Record<string, unknown>> | null }>(this.ds, "/api/v1/vocab/decks");
    return (raw.decks ?? []).map(d => ({
      id: (d.id ?? "") as string,
      name: (d.name ?? "") as string,
      cardCount: (d.card_count ?? d.cardCount ?? 0) as number,
      dueCount: (d.due_count ?? d.dueCount ?? 0) as number,
      masteredCount: (d.mastered_count ?? d.masteredCount ?? 0) as number,
    }));
  }

  async createDeck(name: string, language: string): Promise<Deck> {
    // vocabulary-service wraps: { deck: { id, name, card_count, ... } }
    const raw = await call<{ deck?: Record<string, unknown> }>(this.ds, "/api/v1/vocab/decks", {
      method: "POST",
      body: { name, language },
    });
    const d = raw.deck ?? {};
    return {
      id: (d.id ?? "") as string,
      name: (d.name ?? "") as string,
      cardCount: (d.card_count ?? d.cardCount ?? 0) as number,
      dueCount: (d.due_count ?? d.dueCount ?? 0) as number,
      masteredCount: (d.mastered_count ?? d.masteredCount ?? 0) as number,
    };
  }
}

export class EntitlementDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.entitlement, token };
  }

  async getMyEntitlements(): Promise<Entitlement> {
    // entitlement-service returns flat { plan_tier, features: [...] }
    const raw = await call<Record<string, unknown>>(this.ds, "/api/v1/entitlements/me");
    return {
      planTier: (raw.plan_tier ?? raw.planTier ?? "free") as string,
      validUntil: (raw.valid_until ?? raw.validUntil ?? null) as string | null,
      features: (raw.features ?? []) as Array<{ code: string; allowed: boolean; quota: number }>,
    };
  }

  checkFeature(featureCode: string): Promise<{ allowed: boolean; quota: number }> {
    return call<{ allowed: boolean; quota: number }>(
      this.ds, `/api/v1/entitlements/check?feature=${featureCode}`,
    );
  }
}

export class ProgressDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.progress, token };
  }

  async getMySummary(): Promise<ProgressSummary> {
    // progress-service requires ?language param and wraps: { overview: {...} }
    // Use "en" as default; in the future pass user's active language
    const raw = await call<{ overview?: Record<string, unknown> }>(
      this.ds, "/api/v1/progress/overview?language=en",
    ).catch(() => ({ overview: undefined }));

    const o = raw.overview;
    if (!o) {
      return { userId: "", streak: 0, totalXp: 0, minutesLearned: 0, wordsMastered: 0 };
    }
    return {
      userId: (o.user_id ?? o.userId ?? "") as string,
      streak: (o.streak ?? 0) as number,
      totalXp: (o.total_xp ?? o.totalXp ?? 0) as number,
      minutesLearned: (o.minutes_learned ?? o.minutesLearned ?? 0) as number,
      wordsMastered: (o.words_mastered ?? o.wordsMastered ?? 0) as number,
    };
  }

  getWeekly(days: number): Promise<Array<{ date: string; xp: number; minutes: number }>> {
    return call<{ history?: Array<{ date: string; xp: number; minutes: number }> }>(
      this.ds, `/api/v1/progress/history?language=en&skill=overall&days=${days}`,
    ).then(r => r.history ?? []).catch(() => []);
  }
}

export class AiTutorDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.aiTutor, token };
  }

  chat(conversationId: string | null, message: string, language: string): Promise<{
    conversationId: string;
    reply: string;
    quotaRemaining: number;
  }> {
    return call(this.ds, "/api/v1/tutor/chat", {
      method: "POST",
      body: { conversation_id: conversationId, message, language },
    }) as Promise<{ conversationId: string; reply: string; quotaRemaining: number }>;
  }

  explain(text: string, context: string | null, language: string): Promise<{
    explanation: string;
    examples: string[];
  }> {
    return call(this.ds, "/api/v1/tutor/explain", {
      method: "POST",
      body: { text, context, language },
    }) as Promise<{ explanation: string; examples: string[] }>;
  }
}

// ─── Context DataSources bundle ────────────────────────────────────────────────

export interface DataSources {
  identity: IdentityDataSource;
  learning: LearningDataSource;
  vocabulary: VocabularyDataSource;
  entitlement: EntitlementDataSource;
  progress: ProgressDataSource;
  aiTutor: AiTutorDataSource;
}

/** Build all DataSources for a single request context. */
export function buildDataSources(cfg: Config, token?: string): DataSources {
  return {
    identity: new IdentityDataSource(cfg, token),
    learning: new LearningDataSource(cfg, token),
    vocabulary: new VocabularyDataSource(cfg, token),
    entitlement: new EntitlementDataSource(cfg, token),
    progress: new ProgressDataSource(cfg, token),
    aiTutor: new AiTutorDataSource(cfg, token),
  };
}
