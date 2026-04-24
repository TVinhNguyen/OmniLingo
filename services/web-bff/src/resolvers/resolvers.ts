/**
 * GraphQL resolvers for web-bff.
 * Context type provides: user (AuthUser | null), dataSources (DataSources).
 */
import type { MercuriusContext } from "mercurius";
import type { AuthUser } from "../middleware/auth.js";
import type { DataSources } from "../datasources/datasources.js";

export interface BffContext extends MercuriusContext {
  user: AuthUser | null;
  dataSources: DataSources;
}

/** Tier hierarchy: higher index = higher plan. */
const TIER_ORDER: Record<string, number> = {
  free: 0,
  plus: 1,
  pro: 2,
  ultimate: 3,
};

/** Throws a GQL-friendly 401 if user is not authenticated. */
function requireAuth(ctx: BffContext): AuthUser {
  if (!ctx.user) {
    throw Object.assign(new Error("Authentication required"), { extensions: { code: "UNAUTHENTICATED" } });
  }
  return ctx.user;
}

/**
 * Throws a GQL-friendly 403 if the authenticated user's tier is below the minimum required.
 * Used for field-level authorization on AI features (Plus+) and premium features (Pro+).
 */
function requiresTier(ctx: BffContext, minTier: "plus" | "pro" | "ultimate"): AuthUser {
  const user = requireAuth(ctx);
  const userLevel = TIER_ORDER[user.tier?.toLowerCase() ?? "free"] ?? 0;
  const requiredLevel = TIER_ORDER[minTier];
  if (userLevel < requiredLevel) {
    throw Object.assign(
      new Error(`This feature requires ${minTier} plan or higher`),
      { extensions: { code: "FORBIDDEN", requiredTier: minTier, currentTier: user.tier ?? "free" } },
    );
  }
  return user;
}

export const resolvers = {
  // ─── Query ─────────────────────────────────────────────────────────────

  Query: {
    /**
     * Dashboard: resolves all sub-fields in parallel (Promise.all).
     * The heavy lifting is done in field resolvers below to keep this lean.
     */
    dashboard: (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return {}; // field resolvers handle each sub-field
    },

    me: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.identity.getMe();
    },

    myEntitlements: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.entitlement.getMyEntitlements();
    },

    myTracks: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.learning.getMyTracks();
    },

    lessons: async (_: unknown, { unitId }: { unitId: string }, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.learning.getLessons(unitId);
    },

    lessonContent: async (
      _: unknown,
      { lessonId, language }: { lessonId: string; language?: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      const content = await ctx.dataSources.content.getLessonContent(lessonId, language ?? "en");
      if (!content) {
        throw Object.assign(new Error(`Lesson ${lessonId} not found`), { extensions: { code: "NOT_FOUND" } });
      }
      return content;
    },

    myDecks: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.vocabulary.getMyDecks();
    },

    deck: async (_: unknown, { id }: { id: string }, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.vocabulary.getDeck(id);
    },

    deckCards: async (_: unknown, { deckId }: { deckId: string }, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.vocabulary.getDeckCards(deckId);
    },

    checkFeature: async (_: unknown, { code }: { code: string }, ctx: BffContext) => {
      requireAuth(ctx);
      const result = await ctx.dataSources.entitlement.checkFeature(code);
      return { code, ...result };
    },

    myProgress: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.progress.getMySummary();
    },

    weeklyProgress: async (_: unknown, { days }: { days?: number }, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.progress.getWeekly(days ?? 7);
    },

    conversations: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.aiTutor.listConversations();
    },

    conversation: async (_: unknown, { id }: { id: string }, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.aiTutor.getConversation(id);
    },

    dueCards: async (_: unknown, { limit }: { limit?: number }, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.srs.getDueCards(limit ?? 50);
    },

    srsStats: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.srs.getStats();
    },

    srsDueCount: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      const stats = await ctx.dataSources.srs.getStats();
      return stats.dueToday;
    },

    myStreak: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      const p = await ctx.dataSources.gamification.getProfile();
      return {
        current:     p.streakCurrent,
        longest:     p.streakLongest,
        freezesLeft: p.freezesLeft,
        totalXp:     p.totalXp,
        level:       p.level,
      };
    },

    myAchievements: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.gamification.getMyAchievements();
    },

    myLeaderboard: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.gamification.getMyLeaderboard();
    },

    notifications: async (
      _: unknown,
      { filter, cursor, limit }: { filter?: string; cursor?: string; limit?: number },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.notification.getNotifications(filter, cursor, limit);
    },

    unreadNotificationCount: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.notification.getUnreadCount();
    },

    pricingPlans: async (
      _: unknown,
      { currency, country }: { currency?: string; country?: string },
      ctx: BffContext,
    ) => {
      return ctx.dataSources.billing.getPlans(currency, country);
    },

    mySubscription: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.billing.getMySubscription();
    },

    billingHistory: async (
      _: unknown,
      { cursor, limit }: { cursor?: string; limit?: number },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.billing.getBillingHistory(cursor, limit);
    },

    checkoutStatus: async (_: unknown, { sessionId }: { sessionId: string }, ctx: BffContext) => {
      requireAuth(ctx);
      const raw = await ctx.dataSources.billing.getCheckoutStatus(sessionId);
      return {
        sessionId:    String(raw.session_id ?? raw.sessionId ?? sessionId),
        state:        String(raw.state ?? "pending"),
        planId:       raw.plan_id != null ? String(raw.plan_id) : null,
        activatedAt:  raw.activated_at != null ? String(raw.activated_at) : null,
        errorMessage: raw.error_message != null ? String(raw.error_message) : null,
      };
    },
  },

  // ─── Dashboard field resolvers (parallel execution) ─────────────────────

  Dashboard: {
    user: async (_: unknown, __: unknown, ctx: BffContext) => {
      return ctx.dataSources.identity.getMe();
    },
    progress: async (_: unknown, __: unknown, ctx: BffContext) => {
      return ctx.dataSources.progress.getMySummary();
    },
    entitlement: async (_: unknown, __: unknown, ctx: BffContext) => {
      return ctx.dataSources.entitlement.getMyEntitlements();
    },
    myTracks: async (_: unknown, __: unknown, ctx: BffContext) => {
      return ctx.dataSources.learning.getMyTracks();
    },
    myDecks: async (_: unknown, __: unknown, ctx: BffContext) => {
      return ctx.dataSources.vocabulary.getMyDecks();
    },
  },

  // ─── Mutation ──────────────────────────────────────────────────────────

  Mutation: {
    startLesson: async (
      _: unknown,
      { lessonId }: { lessonId: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      const result = await ctx.dataSources.learning.startLesson(lessonId);
      return { sessionId: result.sessionId, lessonId };
    },

    createDeck: async (
      _: unknown,
      { name, language }: { name: string; language: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.vocabulary.createDeck(name, language);
    },

    addCard: async (
      _: unknown,
      args: { deckId: string; lemma: string; meaning: string; ipa?: string; pos?: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      const { deckId, lemma, meaning, ipa, pos } = args;
      return ctx.dataSources.vocabulary.addCard(deckId, lemma, meaning, ipa, pos);
    },

    tutorChat: async (
      _: unknown,
      args: { conversationId?: string; message: string; language?: string },
      ctx: BffContext,
    ) => {
      requiresTier(ctx, "plus"); // AI Tutor requires Plus plan or higher
      const { conversationId = null, message, language = "en" } = args;
      const result = await ctx.dataSources.aiTutor.chat(conversationId, message, language);
      return {
        conversationId: result.conversationId,
        message: { role: "assistant", content: result.reply },
        quotaRemaining: result.quotaRemaining,
      };
    },

    explain: async (
      _: unknown,
      args: { text: string; context?: string; language?: string },
      ctx: BffContext,
    ) => {
      requiresTier(ctx, "plus"); // AI Explain requires Plus plan or higher
      const { text, context = null, language = "en" } = args;
      return ctx.dataSources.aiTutor.explain(text, context, language);
    },

    updateProfile: async (
      _: unknown,
      args: { displayName?: string; bio?: string; uiLanguage?: string; timezone?: string; avatarUrl?: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.identity.updateMe(args);
    },

    reviewCard: async (
      _: unknown,
      { itemId, rating }: { itemId: string; rating: number },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.srs.scheduleCard(itemId, rating);
    },

    completeLesson: async (
      _: unknown,
      { lessonId, xpEarned }: { lessonId: string; xpEarned: number },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.learning.completeLesson(lessonId, xpEarned);
    },

    submitAnswer: async (
      _: unknown,
      args: {
        lessonId:      string;
        exerciseId:    string;
        exerciseKind:  string;
        answer:        unknown;
        correctAnswer: unknown;
        maxScore:      number;
        skillTag:      string;
        language:      string;
      },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      void args.lessonId; // reserved for future session-scoped grading
      return ctx.dataSources.assessment.submitExercise({
        exerciseId:    args.exerciseId,
        exerciseKind:  args.exerciseKind,
        answer:        args.answer,
        correctAnswer: args.correctAnswer,
        maxScore:      args.maxScore,
        skillTag:      args.skillTag,
        language:      args.language,
      });
    },

    enrollTrack: async (
      _: unknown,
      { language, templateId }: { language: string; templateId?: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.learning.enrollTrack(language, templateId);
    },

    renameConversation: async (
      _: unknown,
      { id, title }: { id: string; title: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.aiTutor.renameConversation(id, title);
    },

    deleteConversation: async (
      _: unknown,
      { id }: { id: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.aiTutor.deleteConversation(id);
    },

    deleteCard: async (
      _: unknown,
      { deckId, cardId }: { deckId: string; cardId: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.vocabulary.deleteCard(deckId, cardId);
    },

    deleteDeck: async (
      _: unknown,
      { deckId }: { deckId: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.vocabulary.deleteDeck(deckId);
    },

    addCardFromChat: async (
      _: unknown,
      { deckId, lemma, meaning, ipa, pos }: {
        deckId: string; lemma: string; meaning: string; ipa?: string; pos?: string;
      },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.vocabulary.addCard(deckId, lemma, meaning, ipa, pos);
    },

    markNotificationsRead: async (
      _: unknown,
      { ids }: { ids: string[] },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.notification.markRead(ids);
    },

    markAllNotificationsRead: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.notification.markAllRead();
    },

    updateNotificationPrefs: async (
      _: unknown,
      { prefs }: { prefs: unknown },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.notification.updatePrefs(prefs);
    },

    createCheckoutSession: async (
      _: unknown,
      args: { planId: string; period: string; provider: string; successUrl: string; cancelUrl: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      const { planId, period, provider, successUrl, cancelUrl } = args;
      return ctx.dataSources.billing.createCheckoutSession(planId, period, provider, successUrl, cancelUrl);
    },

    cancelSubscription: async (
      _: unknown,
      { reason }: { reason?: string },
      ctx: BffContext,
    ) => {
      requireAuth(ctx);
      return ctx.dataSources.billing.cancelSubscription(reason);
    },

    reactivateSubscription: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.billing.reactivateSubscription();
    },
  },
};
