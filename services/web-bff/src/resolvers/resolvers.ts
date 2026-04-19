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

    myDecks: async (_: unknown, __: unknown, ctx: BffContext) => {
      requireAuth(ctx);
      return ctx.dataSources.vocabulary.getMyDecks();
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
  },
};
