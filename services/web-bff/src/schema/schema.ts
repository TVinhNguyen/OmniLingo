/**
 * GraphQL schema definition for web-bff.
 * Core types covering Dashboard, Learning, Vocabulary, Entitlement, Progress, AI Tutor.
 * Exported and used directly by Mercurius.
 */

export const schema = /* GraphQL */ `
  # ─── Scalars ──────────────────────────────────────────────────────────────
  scalar DateTime
  scalar JSON

  # ─── Common ───────────────────────────────────────────────────────────────

  type PageInfo {
    hasNextPage:     Boolean!
    hasPreviousPage: Boolean!
    total:           Int!
  }

  # ─── User ─────────────────────────────────────────────────────────────────

  type User {
    id:        ID!
    username:  String!
    avatarUrl: String
    bio:       String
    createdAt: DateTime!
  }

  # ─── Entitlement ──────────────────────────────────────────────────────────

  type FeatureSummary {
    code:    String!
    allowed: Boolean!
    quota:   Int!
  }

  type Entitlement {
    planTier:   String!
    validUntil: DateTime
    features:   [FeatureSummary!]!
  }

  # ─── Progress ─────────────────────────────────────────────────────────────

  type ProgressSummary {
    streak:       Int!
    totalXp:      Int!
    minutesLearned: Int!
    wordsMastered:  Int!
  }

  type WeeklyProgress {
    date:    String!
    xp:      Int!
    minutes: Int!
  }

  # ─── Learning ─────────────────────────────────────────────────────────────

  enum LessonStatus {
    locked
    available
    completed
  }

  type Lesson {
    id:          ID!
    title:       String!
    unitId:      String!
    orderIndex:  Int!
    durationMin: Int!
    status:      LessonStatus!
  }

  type LearningTrack {
    id:          ID!
    title:       String!
    language:    String!
    level:       String!
    progressPct: Float!
  }

  type StartLessonResult {
    sessionId: String!
    lessonId:  String!
  }

  # ─── Vocabulary ───────────────────────────────────────────────────────────

  type Deck {
    id:           ID!
    name:         String!
    cardCount:    Int!
    dueCount:     Int!
    masteredCount: Int!
  }

  # ─── Dashboard ────────────────────────────────────────────────────────────

  """
  Aggregated dashboard data — single GQL query replaces multiple REST calls.
  """
  type Dashboard {
    user:        User!
    progress:    ProgressSummary!
    entitlement: Entitlement!
    myTracks:    [LearningTrack!]!
    myDecks:     [Deck!]!
  }

  # ─── AI Tutor ─────────────────────────────────────────────────────────────

  type ChatMessage {
    role:    String!
    content: String!
  }

  type ChatResult {
    conversationId: String!
    message:        ChatMessage!
    quotaRemaining: Int!
  }

  type ExplainResult {
    explanation: String!
    examples:    [String!]!
  }

  # ─── Queries ──────────────────────────────────────────────────────────────

  type Query {
    """
    Aggregated dashboard. Resolves user + progress + entitlement + tracks + decks
    in parallel using DataLoader batching.
    """
    dashboard: Dashboard!

    """Current authenticated user profile."""
    me: User!

    """User entitlements and feature access."""
    myEntitlements: Entitlement!

    """Learning tracks for the authenticated user."""
    myTracks: [LearningTrack!]!

    """Lessons in a unit."""
    lessons(unitId: ID!): [Lesson!]!

    """Vocabulary decks owned by user."""
    myDecks: [Deck!]!

    """Check a single feature entitlement."""
    checkFeature(code: String!): FeatureSummary!

    """Progress summary for current user."""
    myProgress: ProgressSummary!

    """Weekly progress data for chart (default last 7 days)."""
    weeklyProgress(days: Int): [WeeklyProgress!]!
  }

  # ─── Mutations ────────────────────────────────────────────────────────────

  type Mutation {
    """Start a lesson session — returns session ID."""
    startLesson(lessonId: ID!): StartLessonResult!

    """Create a new vocabulary deck."""
    createDeck(name: String!, language: String!): Deck!

    """Send a chat message to AI tutor."""
    tutorChat(
      conversationId: String
      message:        String!
      language:       String
    ): ChatResult!

    """Get AI explanation for a word or phrase."""
    explain(
      text:     String!
      context:  String
      language: String
    ): ExplainResult!

    """Update the current user's profile."""
    updateProfile(
      displayName: String
      bio:         String
      uiLanguage:  String
      timezone:    String
      avatarUrl:   String
    ): User!
  }
`;
