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
    streak:         Int!
    totalXp:        Int!
    minutesLearned: Int!
    wordsMastered:  Int!
  }

  type WeeklyProgress {
    date:    String!
    xp:      Int!
    minutes: Int!
  }

  """Streak data from the gamification service."""
  type UserStreak {
    current:      Int!
    longest:      Int!
    freezesLeft:  Int!
    totalXp:      Int!
    level:        Int!
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

  """A single vocabulary card inside a deck."""
  type Card {
    id:      ID!
    deckId:  ID!
    lemma:   String!
    meaning: String!
    ipa:     String
    pos:     String
    status:  String   # new | learning | mastered
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

  """Summary of a conversation session in AI Tutor."""
  type ConversationSummary {
    id:           ID!
    messageCount: Int!
    lastMessage:  String!
    ttlSeconds:   Int!
  }

  """A single message in a conversation."""
  type ConversationMessage {
    role:    String! # user | assistant
    content: String!
  }

  """Full conversation with messages."""
  type Conversation {
    id:       ID!
    messages: [ConversationMessage!]!
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

    """Single deck by ID (must be owned by caller)."""
    deck(id: ID!): Deck!

    """Cards in a deck."""
    deckCards(deckId: ID!): [Card!]!

    """Check a single feature entitlement."""
    checkFeature(code: String!): FeatureSummary!

    """Progress summary for current user."""
    myProgress: ProgressSummary!

    """Weekly progress data for chart (default last 7 days)."""
    weeklyProgress(days: Int): [WeeklyProgress!]!

    """List all AI tutor conversation sessions for current user."""
    conversations: [ConversationSummary!]!

    """Full conversation message history by ID."""
    conversation(id: ID!): Conversation!

    """SRS due cards for the current user (kind=card)."""
    dueCards(limit: Int): [DueCard!]!

    """SRS aggregate stats for current user."""
    srsStats: SrsStats!

    """Streak + XP from gamification service."""
    myStreak: UserStreak!

    """List of achievements/badges earned by the current user."""
    myAchievements: [Achievement!]!

    """Leaderboard (top users + current user rank) for current league."""
    myLeaderboard: Leaderboard!
  }

  """An SRS due item (card)."""
  type DueCard {
    itemId: ID!
    state:  String!
    reps:   Int!
  }

  """SRS aggregate statistics."""
  type SrsStats {
    total:       Int!
    dueToday:    Int!
    matureCount: Int!
  }

  """A gamification achievement or badge."""
  type Achievement {
    id:          ID!
    code:        String!
    title:       String!
    description: String!
    icon:        String!
    rarity:      String!
    earnedAt:    String
    xpReward:    Int!
  }

  """Leaderboard entry."""
  type LeaderboardEntry {
    rank:        Int!
    userId:      String!
    displayName: String!
    avatarUrl:   String
    xp:          Int!
    isCurrentUser: Boolean!
  }

  """Full leaderboard response."""
  type Leaderboard {
    league:  String!
    entries: [LeaderboardEntry!]!
    myRank:  Int!
    myXp:    Int!
  }

  # ─── Mutations ────────────────────────────────────────────────────────────

  type Mutation {
    """Start a lesson session — returns session ID."""
    startLesson(lessonId: ID!): StartLessonResult!

    """Create a new vocabulary deck."""
    createDeck(name: String!, language: String!): Deck!

    """Add a card (lemma + meaning) to an existing deck."""
    addCard(
      deckId:  ID!
      lemma:   String!
      meaning: String!
      ipa:     String
      pos:     String
    ): Card!

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

    """Submit SRS review rating for a card."""
    reviewCard(
      itemId: ID!
      rating: Int!  # 1=again 2=hard 3=good 4=easy
    ): ReviewResult!

    """Mark a lesson complete and record XP earned."""
    completeLesson(
      lessonId: ID!
      xpEarned: Int!
    ): CompleteLessonResult!

    """Enroll the user in a learning track (creates a new learning path)."""
    enrollTrack(language: String!, templateId: String): EnrollTrackResult!

    """Rename an AI tutor conversation."""
    renameConversation(id: ID!, title: String!): MutationOk!

    """Delete an AI tutor conversation."""
    deleteConversation(id: ID!): MutationOk!

    """Delete a card from a deck."""
    deleteCard(deckId: ID!, cardId: ID!): MutationOk!

    """Delete an entire deck (and all its cards)."""
    deleteDeck(deckId: ID!): MutationOk!

    """Save a word/phrase from AI chat as a flashcard in a deck."""
    addCardFromChat(
      deckId:  ID!
      lemma:   String!
      meaning: String!
      ipa:     String
      pos:     String
    ): Card!
  }

  """Result of an SRS review submission."""
  type ReviewResult {
    nextDueAt: String!
  }

  """Result of completing a lesson."""
  type CompleteLessonResult {
    ok: Boolean!
  }

  """Result of enrolling in a track."""
  type EnrollTrackResult {
    trackId: String!
    ok:      Boolean!
  }

  """Generic mutation success indicator."""
  type MutationOk {
    ok: Boolean!
  }
`;
