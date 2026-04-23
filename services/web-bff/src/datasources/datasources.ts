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

  /** POST /api/v1/learning/lessons/:id/complete */
  completeLesson(lessonId: string, xpEarned: number): Promise<{ ok: boolean }> {
    return call<{ ok: boolean }>(this.ds, `/api/v1/learning/lessons/${lessonId}/complete`, {
      method: "POST",
      body: { xp_earned: xpEarned },
    }).catch(() => ({ ok: false }));
  }

  /** POST /api/v1/learning/paths — enroll user in a track */
  async enrollTrack(language: string, templateId?: string): Promise<{ trackId: string; ok: boolean }> {
    const res = await call<{ path?: { id?: string }; id?: string }>(
      this.ds, "/api/v1/learning/paths",
      { method: "POST", body: { language, template_id: templateId ?? null } },
    ).catch(() => ({})) as Record<string, unknown>;
    const id = (res?.path as Record<string, unknown>)?.id as string ?? res?.id as string ?? "";
    return { trackId: id, ok: !!id };
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

  async getDeck(deckId: string): Promise<Deck> {
    // vocabulary-service: GET /api/v1/vocab/decks/:id
    return this.deckLoader.load(deckId);
  }

  async getDeckCards(deckId: string): Promise<Array<{
    id: string; deckId: string; lemma: string; meaning: string; ipa?: string; pos?: string; status?: string;
  }>> {
    const raw = await call<{ cards?: Array<Record<string, unknown>> }>(
      this.ds,
      `/api/v1/vocab/decks/${deckId}/cards`,
    ).catch(() => ({ cards: [] }));
    return (raw.cards ?? []).map((c) => ({
      id:      (c.id ?? "") as string,
      deckId:  (c.deck_id ?? deckId) as string,
      lemma:   (c.lemma ?? "") as string,
      meaning: (c.meaning ?? "") as string,
      ipa:     (c.ipa ?? undefined) as string | undefined,
      pos:     (c.pos ?? undefined) as string | undefined,
      status:  (c.status ?? "new") as string,
    }));
  }

  async addCard(
    deckId: string,
    lemma: string,
    meaning: string,
    ipa?: string,
    pos?: string,
  ): Promise<{ id: string; deckId: string; lemma: string; meaning: string; ipa?: string; pos?: string }> {
    const raw = await call<{ card?: Record<string, unknown> }>(
      this.ds,
      `/api/v1/vocab/decks/${deckId}/cards`,
      { method: "POST", body: { lemma, meaning, ipa, pos } },
    );
    const c = raw.card ?? {};
    return {
      id: (c.id ?? "") as string,
      deckId: (c.deck_id ?? deckId) as string,
      lemma: (c.lemma ?? lemma) as string,
      meaning: (c.meaning ?? meaning) as string,
      ipa: (c.ipa ?? ipa) as string | undefined,
      pos: (c.pos ?? pos) as string | undefined,
    };
  }

  /** DELETE /api/v1/vocab/decks/:deckId/cards/:cardId */
  async deleteCard(deckId: string, cardId: string): Promise<{ ok: boolean }> {
    await call(this.ds, `/api/v1/vocab/decks/${deckId}/cards/${cardId}`, {
      method: "DELETE",
    }).catch(() => {});
    return { ok: true };
  }

  /** DELETE /api/v1/vocab/decks/:deckId */
  async deleteDeck(deckId: string): Promise<{ ok: boolean }> {
    await call(this.ds, `/api/v1/vocab/decks/${deckId}`, {
      method: "DELETE",
    }).catch(() => {});
    return { ok: true };
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
// ─── Gamification DataSource ──────────────────────────────────────────────────

export class GamificationDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.gamification, token };
  }

  /** GET /api/v1/gamification/profile */
  async getProfile(): Promise<{
    streakCurrent: number;
    streakLongest: number;
    freezesLeft:   number;
    totalXp:       number;
    level:         number;
  }> {
    type ProfileBody = { profile?: Record<string, unknown> };
    const raw: ProfileBody = await call<ProfileBody>(
      this.ds, "/api/v1/gamification/profile",
    ).catch(() => ({ profile: undefined }));
    const p = raw.profile ?? {};
    const xp    = (p["xp"]     ?? {}) as Record<string, unknown>;
    const stk   = (p["streak"] ?? {}) as Record<string, unknown>;
    const totalXp = Number(xp["total_xp"] ?? 0);
    return {
      streakCurrent: Number(stk["current"]      ?? 0),
      streakLongest: Number(stk["longest"]       ?? 0),
      freezesLeft:   Number(stk["freezes_left"]  ?? 0),
      totalXp,
      level: Math.floor(Math.sqrt(totalXp / 100)) + 1,
    };
  }

  /** GET /api/v1/gamification/achievements — list earned achievements */
  async getMyAchievements(): Promise<Array<{
    id: string; code: string; title: string; description: string;
    icon: string; rarity: string; earnedAt: string | null; xpReward: number;
  }>> {
    type Body = { achievements?: Array<Record<string, unknown>> };
    const raw = await call<Body>(
      this.ds, "/api/v1/gamification/achievements",
    ).catch(() => ({ achievements: [] }));
    return (raw.achievements ?? []).map((a) => ({
      id:          String(a.id ?? ""),
      code:        String(a.code ?? ""),
      title:       String(a.title ?? ""),
      description: String(a.description ?? ""),
      icon:        String(a.icon ?? "trophy"),
      rarity:      String(a.rarity ?? "common"),
      earnedAt:    a.earned_at != null ? String(a.earned_at) : null,
      xpReward:    Number(a.xp_reward ?? 0),
    }));
  }

  /** GET /api/v1/gamification/leaderboard — league leaderboard */
  async getMyLeaderboard(): Promise<{
    league: string;
    entries: Array<{ rank: number; userId: string; displayName: string; avatarUrl: string | null; xp: number; isCurrentUser: boolean }>;
    myRank: number;
    myXp:   number;
  }> {
    type Body = { league?: string; entries?: Array<Record<string, unknown>>; my_rank?: number; my_xp?: number };
    const raw = await call<Body>(
      this.ds, "/api/v1/gamification/leaderboard",
    ).catch(() => ({ league: "Bronze", entries: [], my_rank: 0, my_xp: 0 }));
    return {
      league:  String(raw.league ?? "Bronze"),
      myRank:  Number(raw.my_rank ?? 0),
      myXp:    Number(raw.my_xp ?? 0),
      entries: (raw.entries ?? []).map((e) => ({
        rank:          Number(e.rank ?? 0),
        userId:        String(e.user_id ?? e.userId ?? ""),
        displayName:   String(e.display_name ?? e.displayName ?? ""),
        avatarUrl:     e.avatar_url != null ? String(e.avatar_url) : null,
        xp:            Number(e.xp ?? 0),
        isCurrentUser: Boolean(e.is_current_user ?? e.isCurrentUser ?? false),
      })),
    };
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

  async listConversations(): Promise<Array<{
    id: string; messageCount: number; lastMessage: string; ttlSeconds: number;
  }>> {
    const raw = await call<{ conversations?: Array<Record<string, unknown>> }>(
      this.ds, "/api/v1/tutor/conversations",
    ).catch(() => ({ conversations: [] }));
    return (raw.conversations ?? []).map((c) => ({
      id:           String(c.id ?? ""),
      messageCount: Number(c.message_count ?? 0),
      lastMessage:  String(c.last_message ?? ""),
      ttlSeconds:   Number(c.ttl_seconds ?? 0),
    }));
  }

  async getConversation(convId: string): Promise<{
    id: string;
    messages: Array<{ role: string; content: string }>;
  }> {
    const raw = await call<{ conversation_id?: string; messages?: Array<Record<string, unknown>> }>(
      this.ds, `/api/v1/tutor/conversations/${convId}`,
    ).catch(() => ({ conversation_id: convId, messages: [] }));
    return {
      id: raw.conversation_id ?? convId,
      messages: (raw.messages ?? []).map((m) => ({
        role:    String(m.role ?? "user"),
        content: String(m.content ?? ""),
      })),
    };
  }

  /** PATCH /api/v1/tutor/conversations/:id */
  async renameConversation(id: string, title: string): Promise<{ ok: boolean }> {
    await call(this.ds, `/api/v1/tutor/conversations/${id}`, {
      method: "PATCH",
      body: { title },
    }).catch(() => {});
    return { ok: true };
  }

  /** DELETE /api/v1/tutor/conversations/:id */
  async deleteConversation(id: string): Promise<{ ok: boolean }> {
    await call(this.ds, `/api/v1/tutor/conversations/${id}`, {
      method: "DELETE",
    }).catch(() => {});
    return { ok: true };
  }
}

// ─── SRS DataSource ────────────────────────────────────────────────────────────

export class SrsDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.srs, token };
  }

  /** GET /api/v1/srs/due?kind=card&limit=N */
  async getDueCards(limit = 50): Promise<Array<{ itemId: string; state: string; reps: number }>> {
    const raw = await call<{ due?: Array<Record<string, unknown>> }>(
      this.ds, `/api/v1/srs/due?kind=card&limit=${limit}`,
    ).catch(() => ({ due: [] }));
    return (raw.due ?? []).map((d) => ({
      itemId: String(d.item_id ?? ""),
      state:  String(d.state  ?? "new"),
      reps:   Number(d.reps   ?? 0),
    }));
  }

  /** POST /api/v1/srs/schedule — rating: 1=again 2=hard 3=good 4=easy */
  async scheduleCard(itemId: string, rating: number): Promise<{ nextDueAt: string }> {
    const raw = await call<{ next_due_at?: string }>(
      this.ds, "/api/v1/srs/schedule",
      { method: "POST", body: { item_kind: "card", item_id: itemId, rating } },
    ).catch(() => ({ next_due_at: "" }));
    return { nextDueAt: raw.next_due_at ?? "" };
  }

  /** GET /api/v1/srs/stats */
  async getStats(): Promise<{ total: number; dueToday: number; matureCount: number }> {
    type StatsBody = { stats?: Record<string, unknown> };
    const raw: StatsBody = await call<StatsBody>(
      this.ds, "/api/v1/srs/stats",
    ).catch(() => ({ stats: {} } as StatsBody));
    const s: Record<string, unknown> = raw.stats ?? {};
    return {
      total:       Number(s["total"]        ?? 0),
      dueToday:    Number(s["due_today"]    ?? 0),
      matureCount: Number(s["mature_count"] ?? 0),
    };
  }
}

// ─── Context DataSources bundle ────────────────────────────────────────────────

export interface DataSources {
  identity:      IdentityDataSource;
  learning:      LearningDataSource;
  vocabulary:    VocabularyDataSource;
  entitlement:   EntitlementDataSource;
  gamification:  GamificationDataSource;
  progress:      ProgressDataSource;
  aiTutor:       AiTutorDataSource;
  srs:           SrsDataSource;
}

/** Build all DataSources for a single request context. */
export function buildDataSources(cfg: Config, token?: string): DataSources {
  return {
    identity:     new IdentityDataSource(cfg, token),
    learning:     new LearningDataSource(cfg, token),
    vocabulary:   new VocabularyDataSource(cfg, token),
    entitlement:  new EntitlementDataSource(cfg, token),
    gamification: new GamificationDataSource(cfg, token),
    progress:     new ProgressDataSource(cfg, token),
    aiTutor:      new AiTutorDataSource(cfg, token),
    srs:          new SrsDataSource(cfg, token),
  };
}
