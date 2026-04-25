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

export interface LearningPreferences {
  dailyGoalMinutes: number;
  reminderTime: string | null;
  learningLanguages: string[];
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

  async updateMe(patch: {
    displayName?: string; uiLanguage?: string; timezone?: string; avatarUrl?: string;
  }): Promise<UserProfile> {
    const body: Record<string, unknown> = {};
    if (patch.displayName !== undefined) body.display_name = patch.displayName;
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

  /** GET /api/v1/learning/today-mission */
  async getTodayMission(): Promise<{
    lessonId: string | null;
    lessonTitle: string | null;
    minutesToGoal: number;
    xpReward: number;
    dueCardCount: number;
  }> {
    type Body = { mission?: Record<string, unknown> };
    const raw = await call<Body>(
      this.ds, "/api/v1/learning/today-mission",
    ).catch(() => ({ mission: undefined }));
    const m = raw.mission ?? {};
    return {
      lessonId:      m.lesson_id != null ? String(m.lesson_id) : null,
      lessonTitle:   m.lesson_title != null ? String(m.lesson_title) : null,
      minutesToGoal: Number(m.minutes_to_goal ?? 0),
      xpReward:      Number(m.xp_reward ?? 50),
      dueCardCount:  Number(m.due_card_count ?? 0),
    };
  }

  /** GET /api/v1/learning/profile — includes learning preferences */
  async getMyProfile(): Promise<LearningPreferences> {
    const raw = await call<{ profile?: Record<string, unknown> }>(this.ds, "/api/v1/learning/profile")
      .catch(() => ({ profile: undefined }));
    const p = raw.profile ?? {};
    return {
      dailyGoalMinutes: Number(p.daily_goal_minutes ?? 10),
      reminderTime: p.reminder_time != null ? String(p.reminder_time) : null,
      learningLanguages: Array.isArray(p.learning_languages) ? p.learning_languages as string[] : [],
    };
  }

  /** PUT /api/v1/learning/profile — update learning preferences */
  async updateLearningPreferences(patch: {
    dailyGoalMinutes?: number;
    reminderTime?: string | null;
    learningLanguages?: string[];
  }): Promise<LearningPreferences> {
    // Fetch current profile first — PUT /profile requires primary_language and full body
    const current = await call<{ profile?: Record<string, unknown> }>(this.ds, "/api/v1/learning/profile")
      .catch(() => ({ profile: {} as Record<string, unknown> }));
    const p = current.profile ?? {};
    const body: Record<string, unknown> = { ...p };
    if (patch.dailyGoalMinutes !== undefined) body.daily_goal_minutes = patch.dailyGoalMinutes;
    if (patch.reminderTime !== undefined) body.reminder_time = patch.reminderTime;
    if (patch.learningLanguages !== undefined) body.learning_languages = patch.learningLanguages;
    await call<unknown>(this.ds, "/api/v1/learning/profile", { method: "PUT", body });
    return this.getMyProfile();
  }

  // ─── T3: Onboarding ─────────────────────────────────────────────────────────

  async getOnboardingState(): Promise<{
    step: string; answers: Record<string, unknown>;
    placementCefr: string | null; recommendedTrackId: string | null; completedAt: string | null;
  }> {
    const raw = await call<{ state?: Record<string, unknown> }>(this.ds, "/api/v1/onboarding/state")
      .catch(() => ({ state: undefined }));
    const s = raw.state ?? {};
    return {
      step:               (s.step ?? "language_select") as string,
      answers:            (s.answers ?? {}) as Record<string, unknown>,
      placementCefr:      s.placementCefr != null ? String(s.placementCefr) : null,
      recommendedTrackId: s.recommendedTrackId != null ? String(s.recommendedTrackId) : null,
      completedAt:        s.completedAt != null ? String(s.completedAt) : null,
    };
  }

  async updateOnboardingStep(step: string, data: Record<string, unknown>): Promise<{
    step: string; answers: Record<string, unknown>;
    placementCefr: string | null; recommendedTrackId: string | null; completedAt: string | null;
  }> {
    const raw = await call<{ state?: Record<string, unknown> }>(this.ds, "/api/v1/onboarding/step", {
      method: "POST",
      body: { step, data },
    });
    const s = raw.state ?? {};
    return {
      step:               (s.step ?? step) as string,
      answers:            (s.answers ?? {}) as Record<string, unknown>,
      placementCefr:      s.placementCefr != null ? String(s.placementCefr) : null,
      recommendedTrackId: s.recommendedTrackId != null ? String(s.recommendedTrackId) : null,
      completedAt:        s.completedAt != null ? String(s.completedAt) : null,
    };
  }

  async completeOnboarding(placementCefr?: string | null, recommendedTrackId?: string | null): Promise<{
    step: string; answers: Record<string, unknown>;
    placementCefr: string | null; recommendedTrackId: string | null; completedAt: string | null;
  }> {
    const raw = await call<{ state?: Record<string, unknown> }>(this.ds, "/api/v1/onboarding/complete", {
      method: "POST",
      body: { placementCefr: placementCefr ?? null, recommendedTrackId: recommendedTrackId ?? null },
    });
    const s = raw.state ?? {};
    return {
      step:               (s.step ?? "done") as string,
      answers:            (s.answers ?? {}) as Record<string, unknown>,
      placementCefr:      s.placementCefr != null ? String(s.placementCefr) : null,
      recommendedTrackId: s.recommendedTrackId != null ? String(s.recommendedTrackId) : null,
      completedAt:        s.completedAt != null ? String(s.completedAt) : null,
    };
  }
}

// ─── Content DataSource ────────────────────────────────────────────────────────

/** Mirror of content-service ICourse shape (locale-picked title/description). */
export interface CourseDTO {
  id: string;
  trackId: string;
  language: string;
  level: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  order: number;
  unitIds: string[];
}

/** Mirror of content-service IUnit shape (locale-picked title). */
export interface UnitDTO {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessonIds: string[];
}

/** Shared locale-picker: prefers `language`, falls back to 'en', then first value. */
function pickLocale(v: unknown, language: string): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const m = v as Record<string, string>;
    return m[language] ?? m["en"] ?? Object.values(m)[0] ?? "";
  }
  return "";
}

/** Shape returned by GQL; mirrors a subset of content-service Exercise model. */
export interface ExerciseDTO {
  id:            string;
  kind:          string;
  prompt:        string;
  audioRef?:     string;
  choices?:      string[];
  correctAnswer: unknown;
  explanation?:  string;
  skill?:        string;
  maxScore:      number;
  language:      string;
}

export interface LessonContentDTO {
  lessonId:         string;
  title:            string;
  language:         string;
  estimatedMinutes: number;
  exercises:        ExerciseDTO[];
}

/**
 * content-service persists lessons as ordered `blocks[]` where exercise blocks
 * reference external exerciseId. This class fetches the lesson + its
 * referenced exercises in two calls and flattens them into a single DTO.
 */
export class ContentDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.content, token };
  }

  /** GET /api/v1/content/lessons/:id — returns { lesson: {...} } */
  async getLesson(lessonId: string): Promise<Record<string, unknown> | null> {
    const raw = await call<{ lesson?: Record<string, unknown> }>(
      this.ds, `/api/v1/content/lessons/${lessonId}`,
    ).catch(() => ({ lesson: undefined }));
    return raw.lesson ?? null;
  }

  /** GET /api/v1/content/exercises?ids=a,b,c — returns { exercises: [...] } */
  async getExercisesBatch(ids: string[]): Promise<Array<Record<string, unknown>>> {
    if (ids.length === 0) return [];
    const raw = await call<{ exercises?: Array<Record<string, unknown>> }>(
      this.ds, `/api/v1/content/exercises?ids=${ids.map(encodeURIComponent).join(",")}`,
    ).catch(() => ({ exercises: [] }));
    return raw.exercises ?? [];
  }

  /**
   * Fetch full lesson content, resolving exercise blocks into inlined
   * Exercise records. Locale is picked from `language` (defaults to "en")
   * for any `Record<string, string>` fields (title / prompt / explanation).
   */
  async getLessonContent(lessonId: string, language = "en"): Promise<LessonContentDTO | null> {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) return null;

    const blocks = (lesson.blocks ?? []) as Array<Record<string, unknown>>;
    const exerciseIds = blocks
      .filter((b) => b.type === "exercise" && typeof b.exerciseId === "string")
      .map((b) => b.exerciseId as string);

    const exRows = await this.getExercisesBatch(exerciseIds);
    const exMap = new Map(exRows.map((e) => [String(e.id ?? ""), e] as const));

    const exercises: ExerciseDTO[] = [];
    for (const id of exerciseIds) {
      const e = exMap.get(id);
      if (!e) continue;
      const prompt = e.prompt as Record<string, unknown> | undefined;
      exercises.push({
        id,
        kind:          String(e.type ?? ""),
        prompt:        pickLocale(prompt?.text, language),
        audioRef:      prompt?.audioRef as string | undefined,
        choices:       Array.isArray(e.choices) ? (e.choices as string[]) : undefined,
        correctAnswer: e.answer ?? e.referenceText ?? e.pairs ?? null,
        explanation:   pickLocale(e.explanation, language) || undefined,
        skill:         e.skill as string | undefined,
        maxScore:      1.0,
        language:      String(e.language ?? language),
      });
    }

    return {
      lessonId,
      title:            pickLocale(lesson.title, language),
      language:         String(lesson.language ?? language),
      estimatedMinutes: Number(lesson.estimatedMinutes ?? 10),
      exercises,
    };
  }

  /** GET /api/v1/content/courses?trackId= → { courses: [...] } */
  async listCoursesByTrack(trackId: string, language = "en"): Promise<CourseDTO[]> {
    const raw = await call<{ courses?: Array<Record<string, unknown>> }>(
      this.ds, `/api/v1/content/courses?trackId=${encodeURIComponent(trackId)}`,
    ).catch(() => ({ courses: [] }));
    return (raw.courses ?? []).map((c) => ({
      id:           String(c.id ?? ""),
      trackId:      String(c.trackId ?? trackId),
      language:     String(c.language ?? language),
      level:        String(c.level ?? ""),
      title:        pickLocale(c.title, language),
      description:  pickLocale(c.description, language) || undefined,
      thumbnailUrl: c.thumbnailUrl != null ? String(c.thumbnailUrl) : undefined,
      order:        Number(c.order ?? 0),
      unitIds:      Array.isArray(c.unitIds) ? (c.unitIds as string[]) : [],
    }));
  }

  /** GET /api/v1/content/units?courseId= → { units: [...] } */
  async listUnitsByCourse(courseId: string, language = "en"): Promise<UnitDTO[]> {
    const raw = await call<{ units?: Array<Record<string, unknown>> }>(
      this.ds, `/api/v1/content/units?courseId=${encodeURIComponent(courseId)}`,
    ).catch(() => ({ units: [] }));
    return (raw.units ?? []).map((u) => ({
      id:        String(u.id ?? ""),
      courseId:  String(u.courseId ?? courseId),
      title:     pickLocale(u.title, language),
      order:     Number(u.order ?? 0),
      lessonIds: Array.isArray(u.lessonIds) ? (u.lessonIds as string[]) : [],
    }));
  }
}

// ─── Assessment DataSource ─────────────────────────────────────────────────────

export interface SubmitAnswerResultDTO {
  correct:     boolean;
  score:       number;
  maxScore:    number;
  xpDelta:     number;
  explanation: string | null;
}

/** Maps content-service exercise kinds to assessment-service types. */
function mapExerciseKind(kind: string): string {
  switch (kind) {
    case "fill_in_blank": return "gap_fill";
    case "sentence_arrange": return "gap_fill"; // order ≈ ordered slot fill
    case "translation": return "gap_fill";
    // multiple_choice, matching, dictation, speaking_prompt, writing_prompt:
    // content-service and assessment-service use the same constant, passthrough.
    default: return kind; // multiple_choice, dictation, matching pass through
  }
}

export class AssessmentDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.assessment, token };
  }

  /** POST /api/v1/assessments/exercises/:id/submit */
  async submitExercise(args: {
    exerciseId:    string;
    exerciseKind:  string;
    answer:        unknown;
    correctAnswer: unknown;
    maxScore:      number;
    skillTag:      string;
    language:      string;
  }): Promise<SubmitAnswerResultDTO> {
    const body = {
      exercise_type:  mapExerciseKind(args.exerciseKind),
      answer:         args.answer,
      correct_answer: args.correctAnswer,
      max_score:      args.maxScore,
      skill_tag:      args.skillTag,
      language:       args.language,
    };
    type Raw = { submission?: { result?: { correct?: boolean; score?: number; max_score?: number; explanation?: string } } };
    const raw = await call<Raw>(
      this.ds, `/api/v1/assessments/exercises/${encodeURIComponent(args.exerciseId)}/submit`,
      { method: "POST", body },
    ).catch((): Raw => ({ submission: { result: { correct: false, score: 0, max_score: args.maxScore } } }));
    const r = raw.submission?.result ?? {};
    const correct = Boolean(r.correct);
    const score   = Number(r.score ?? 0);
    // Simple XP formula: 12 XP on correct, 0 otherwise (matches existing FE)
    return {
      correct,
      score,
      maxScore:    Number(r.max_score ?? args.maxScore),
      xpDelta:     correct ? 12 : 0,
      explanation: (r.explanation as string | undefined) ?? null,
    };
  }

  /** GET /api/v1/assessments/placement?lang=en&targetLang=vi */
  async getPlacementTest(lang: string, targetLang: string): Promise<{
    testId: string; lang: string; targetLang: string;
    questions: Array<{ id: string; prompt: string; choices: string[]; skill: string }>;
  }> {
    const raw = await call<{ test?: Record<string, unknown> }>(
      this.ds, `/api/v1/assessments/placement?lang=${encodeURIComponent(lang)}&targetLang=${encodeURIComponent(targetLang)}`,
    ).catch(() => ({ test: undefined }));
    const t = (raw.test ?? {}) as Record<string, unknown>;
    return {
      testId:     (t.testId ?? "") as string,
      lang:       (t.lang   ?? lang) as string,
      targetLang: (t.targetLang ?? targetLang) as string,
      questions:  Array.isArray(t.questions) ? t.questions as Array<{ id: string; prompt: string; choices: string[]; skill: string }> : [],
    };
  }

  /** POST /api/v1/assessments/placement/submit */
  async submitPlacement(testId: string, answers: Array<{ questionId: string; choice: number }>, targetLang: string): Promise<{
    cefr: string; score: number; correctCount: number; totalCount: number; recommendedTrackId: string;
  }> {
    const raw = await call<{ result?: Record<string, unknown> }>(
      this.ds, "/api/v1/assessments/placement/submit",
      { method: "POST", body: { testId, answers, targetLang } },
    );
    const r = (raw.result ?? {}) as Record<string, unknown>;
    return {
      cefr:               (r.cefr ?? "A1") as string,
      score:              Number(r.score ?? 0),
      correctCount:       Number(r.correctCount ?? 0),
      totalCount:         Number(r.totalCount ?? 0),
      recommendedTrackId: (r.recommendedTrackId ?? "") as string,
    };
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

  /** GET /api/v1/gamification/leaderboard/:leagueId — league leaderboard
   * Service route: /leaderboard/:leagueId (default leagueId = "global")
   * Response: { leaderboard: [...], league: "global" }
   */
  async getMyLeaderboard(leagueId = "global"): Promise<{
    league: string;
    entries: Array<{ rank: number; userId: string; displayName: string; avatarUrl: string | null; xp: number; isCurrentUser: boolean }>;
    myRank: number;
    myXp:   number;
  }> {
    type Body = { league?: string; leaderboard?: Array<Record<string, unknown>>; my_rank?: number; my_xp?: number };
    const raw = await call<Body>(
      this.ds, `/api/v1/gamification/leaderboard/${leagueId}`,
    ).catch(() => ({ league: "Bronze", leaderboard: [], my_rank: 0, my_xp: 0 }));
    return {
      league:  String(raw.league ?? "Bronze"),
      myRank:  Number(raw.my_rank ?? 0),
      myXp:    Number(raw.my_xp ?? 0),
      // Response key is `leaderboard` (not `entries`) per handler.go
      entries: (raw.leaderboard ?? []).map((e) => ({
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

  async getSkillOverview(language: string): Promise<{
    language: string;
    skills:   Array<{
      skill:     string;
      score:     number;
      ciLow:     number | null;
      ciHigh:    number | null;
      updatedAt: string | null;
    }>;
  }> {
    const raw = await call<{ overview?: {
      language?: string;
      skills?:   Record<string, {
        score?:      number;
        ci_low?:     number;
        ci_high?:    number;
        updated_at?: string;
      }>;
    } }>(
      this.ds, `/api/v1/progress/overview?language=${encodeURIComponent(language)}`,
    ).catch(() => ({ overview: undefined }));

    const o = raw.overview;
    if (!o || !o.skills) return { language, skills: [] };
    const skills = Object.entries(o.skills).map(([skill, v]) => ({
      skill,
      score:     Number(v.score ?? 0),
      ciLow:     v.ci_low  !== undefined ? Number(v.ci_low)  : null,
      ciHigh:    v.ci_high !== undefined ? Number(v.ci_high) : null,
      updatedAt: v.updated_at ?? null,
    }));
    return { language: o.language ?? language, skills };
  }

  async getPredictedScore(cert: string): Promise<{
    certCode:       string;
    predictedScore: number;
    predictedBand:  string | null;
    modelVersion:   string;
    computedAt:     string;
  }> {
    const raw = await call<{ prediction?: {
      cert_code?:       string;
      predicted_score?: number;
      predicted_band?:  string;
      model_version?:   string;
      computed_at?:     string;
    } }>(
      this.ds, `/api/v1/progress/predicted-score?cert=${encodeURIComponent(cert)}`,
    ).catch(() => ({ prediction: undefined }));

    const p = raw.prediction;
    return {
      certCode:       p?.cert_code        ?? cert,
      predictedScore: Number(p?.predicted_score ?? 0),
      predictedBand:  p?.predicted_band   ?? null,
      modelVersion:   p?.model_version    ?? "unknown",
      computedAt:     p?.computed_at      ?? new Date().toISOString(),
    };
  }

  /** GET /api/v1/progress/activity-heatmap?days=N */
  async getActivityHeatmap(days = 365): Promise<Array<{ date: string; minutes: number; xp: number; lessonsCompleted: number }>> {
    type Body = { heatmap?: Array<Record<string, unknown>> };
    const raw = await call<Body>(
      this.ds, `/api/v1/progress/activity-heatmap?days=${days}`,
    ).catch(() => ({ heatmap: [] }));
    return (raw.heatmap ?? []).map((d) => ({
      date:             String(d.date ?? ""),
      minutes:          Number(d.minutes ?? d.minutes_studied ?? 0),
      xp:               Number(d.xp ?? d.xp_earned ?? 0),
      lessonsCompleted: Number(d.lessonsCompleted ?? d.lessons_done ?? 0),
    }));
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

// ─── Notification DataSource ──────────────────────────────────────────────────

export class NotificationDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.notification, token };
  }

  /** GET /api/v1/notifications?filter=&cursor=&limit= */
  async getNotifications(
    filter?: string,
    cursor?: string,
    limit = 20,
  ): Promise<{ items: unknown[]; nextCursor: string | null; unreadCount: number }> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (filter && filter !== "ALL") params.set("filter", filter);
    if (cursor) params.set("cursor", cursor);
    type Raw = { items?: unknown[]; next_cursor?: string | null; unread_count?: number };
    const raw = await call<Raw>(
      this.ds, `/api/v1/notifications?${params}`,
    ).catch((): Raw => ({ items: [], next_cursor: null, unread_count: 0 }));
    return {
      items:       raw.items ?? [],
      nextCursor:  raw.next_cursor ?? null,
      unreadCount: Number(raw.unread_count ?? 0),
    };
  }

  /** GET /api/v1/notifications/unread-count */
  async getUnreadCount(): Promise<number> {
    const raw = await call<{ count?: number }>(
      this.ds, "/api/v1/notifications/unread-count",
    ).catch(() => ({ count: 0 }));
    return Number(raw.count ?? 0);
  }

  /** POST /api/v1/notifications/read { ids } */
  async markRead(ids: string[]): Promise<number> {
    const raw = await call<{ updated?: number }>(
      this.ds, "/api/v1/notifications/read",
      { method: "POST", body: { ids } },
    ).catch(() => ({ updated: 0 }));
    return Number(raw.updated ?? 0);
  }

  /** POST /api/v1/notifications/read-all */
  async markAllRead(): Promise<number> {
    const raw = await call<{ updated?: number }>(
      this.ds, "/api/v1/notifications/read-all",
      { method: "POST" },
    ).catch(() => ({ updated: 0 }));
    return Number(raw.updated ?? 0);
  }

  /** PATCH /api/v1/notifications/preferences */
  async updatePrefs(prefs: unknown): Promise<boolean> {
    await call(this.ds, "/api/v1/notifications/preferences", {
      method: "PATCH",
      body: prefs as Record<string, unknown>,
    }).catch(() => {});
    return true;
  }
}

// ─── Billing DataSource ───────────────────────────────────────────────────────

export class BillingDataSource {
  private ds: DS;
  constructor(cfg: Config, token?: string) {
    this.ds = { baseUrl: cfg.services.billing, token };
  }

  /** GET /billing/plans?currency=&country= */
  async getPlans(currency = "VND", country = "VN"): Promise<unknown[]> {
    const raw = await call<{ plans?: unknown[] }>(
      this.ds, `/billing/plans?currency=${currency}&country=${country}`,
    ).catch(() => ({ plans: [] }));
    return raw.plans ?? [];
  }

  /** GET /billing/subscriptions/current */
  async getMySubscription(): Promise<unknown | null> {
    const raw = await call<Record<string, unknown>>(
      this.ds, "/billing/subscriptions/current",
    ).catch(() => null);
    return raw;
  }

  /** GET /billing/invoices?cursor=&limit= */
  async getBillingHistory(cursor?: string, limit = 10): Promise<{ items: unknown[]; nextCursor: string | null }> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set("cursor", cursor);
    const raw = await call<{ invoices?: unknown[]; next_cursor?: string }>(
      this.ds, `/billing/invoices?${params}`,
    ).catch(() => ({ invoices: [], next_cursor: null }));
    return {
      items: raw.invoices ?? [],
      nextCursor: raw.next_cursor ?? null,
    };
  }

  /** GET /billing/checkout/:sessionId/status */
  async getCheckoutStatus(sessionId: string): Promise<Record<string, unknown>> {
    const raw = await call<Record<string, unknown>>(
      this.ds, `/billing/checkout/${sessionId}/status`,
    ).catch(() => ({ session_id: sessionId, state: "pending" }));
    return raw;
  }

  /** POST /billing/checkout */
  async createCheckoutSession(
    planId: string,
    period: string,
    provider: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ sessionId: string; checkoutUrl: string }> {
    const raw = await call<Record<string, unknown>>(
      this.ds, "/billing/checkout",
      {
        method: "POST",
        body: { plan_id: planId, period, provider, success_url: successUrl, cancel_url: cancelUrl },
      },
    );
    return {
      sessionId:   String(raw.session_id ?? raw.sessionId ?? ""),
      checkoutUrl: String(raw.checkout_url ?? raw.checkoutUrl ?? ""),
    };
  }

  /** POST /billing/subscriptions/cancel */
  async cancelSubscription(reason?: string): Promise<unknown> {
    const raw = await call<Record<string, unknown>>(
      this.ds, "/billing/subscriptions/cancel",
      { method: "POST", body: { reason: reason ?? null } },
    ).catch(() => ({}));
    return raw;
  }

  /** POST /billing/subscriptions/reactivate */
  async reactivateSubscription(): Promise<unknown> {
    const raw = await call<Record<string, unknown>>(
      this.ds, "/billing/subscriptions/reactivate",
      { method: "POST" },
    ).catch(() => ({}));
    return raw;
  }
}

// ─── Context DataSources bundle ────────────────────────────────────────────────

export interface DataSources {
  identity:      IdentityDataSource;
  learning:      LearningDataSource;
  content:       ContentDataSource;
  vocabulary:    VocabularyDataSource;
  entitlement:   EntitlementDataSource;
  gamification:  GamificationDataSource;
  progress:      ProgressDataSource;
  aiTutor:       AiTutorDataSource;
  srs:           SrsDataSource;
  assessment:    AssessmentDataSource;
  notification:  NotificationDataSource;
  billing:       BillingDataSource;
}

/** Build all DataSources for a single request context. */
export function buildDataSources(cfg: Config, token?: string): DataSources {
  return {
    identity:     new IdentityDataSource(cfg, token),
    learning:     new LearningDataSource(cfg, token),
    content:      new ContentDataSource(cfg, token),
    vocabulary:   new VocabularyDataSource(cfg, token),
    entitlement:  new EntitlementDataSource(cfg, token),
    gamification: new GamificationDataSource(cfg, token),
    progress:     new ProgressDataSource(cfg, token),
    aiTutor:      new AiTutorDataSource(cfg, token),
    srs:          new SrsDataSource(cfg, token),
    assessment:   new AssessmentDataSource(cfg, token),
    notification: new NotificationDataSource(cfg, token),
    billing:      new BillingDataSource(cfg, token),
  };
}
