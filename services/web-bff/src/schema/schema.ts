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
    id:                  ID!
    username:            String!
    avatarUrl:           String
    bio:                 String
    createdAt:           DateTime!
    dailyGoalMinutes:    Int!
    reminderTime:        String
    learningLanguages:   [String!]!
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

  """One day of activity \u2014 used for the 365-day heatmap."""
  type ActivityDay {
    date:             String!
    minutes:          Int!
    xp:               Int!
    lessonsCompleted: Int!
  }

  """Today's recommended mission \u2014 next lesson + daily goal progress."""
  type TodayMission {
    lessonId:      String
    lessonTitle:   String
    minutesToGoal: Int!
    xpReward:      Int!
    dueCardCount:  Int!
  }

  """Streak data from the gamification service."""
  type UserStreak {
    current:      Int!
    longest:      Int!
    freezesLeft:  Int!
    totalXp:      Int!
    level:        Int!
  }

  """Per-skill proficiency score (0-100)."""
  type SkillScore {
    skill:     String!
    score:     Float!
    ciLow:     Float
    ciHigh:    Float
    updatedAt: DateTime
  }

  """All skill scores for a user/language pair."""
  type SkillOverview {
    language: String!
    skills:   [SkillScore!]!
  }

  """Certification score prediction (IELTS, TOEIC, JLPT, HSK)."""
  type CertPrediction {
    certCode:       String!
    predictedScore: Float!
    predictedBand:  String
    modelVersion:   String!
    computedAt:     DateTime!
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

  """A course within a learning track."""
  type Course {
    id:          ID!
    trackId:     String!
    language:    String!
    level:       String!
    title:       String!
    description: String
    thumbnailUrl: String
    order:       Int!
    unitIds:     [String!]!
  }

  """A unit within a course."""
  type Unit {
    id:        ID!
    courseId:  String!
    title:     String!
    order:     Int!
    lessonIds: [String!]!
  }

  type StartLessonResult {
    sessionId: String!
    lessonId:  String!
  }

  """A single exercise within a lesson (content-service source)."""
  type Exercise {
    id:            ID!
    kind:          String!       # multiple_choice | fill_in_blank | sentence_arrange | dictation | speaking_prompt | matching | translation
    prompt:        String!       # localised prompt text
    audioRef:      String
    choices:       [String!]
    correctAnswer: JSON
    explanation:   String
    skill:         String
    maxScore:      Float!
    language:      String!
  }

  """Full lesson payload with ordered exercises (source: content-service)."""
  type LessonContent {
    lessonId:         ID!
    title:            String!
    language:         String!
    estimatedMinutes: Int!
    exercises:        [Exercise!]!
  }

  """Result of grading a single exercise answer."""
  type SubmitAnswerResult {
    correct:     Boolean!
    score:       Float!
    maxScore:    Float!
    xpDelta:     Int!
    explanation: String
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

  # ─── Notifications ────────────────────────────────────────────────────────

  """An in-app notification."""
  type AppNotification {
    id:        ID!
    type:      String!
    title:     String!
    body:      String!
    targetUrl: String
    icon:      String
    priority:  Int!
    read:      Boolean!
    createdAt: DateTime!
  }

  type NotificationPage {
    items:       [AppNotification!]!
    nextCursor:  String
    unreadCount: Int!
  }

  # ─── Billing ──────────────────────────────────────────────────────────────

  """Pricing plan (free / plus / pro)."""
  type Plan {
    id:       ID!
    name:     String!
    tier:     String!
    price:    Int!        # minor units (VND / cents)
    currency: String!
    period:   String!     # month | year
    features: [String!]!
    popular:  Boolean!
  }

  """Active subscription state."""
  type BillingSubscription {
    id:                 ID!
    planId:             ID!
    planName:           String!
    state:              String!   # trialing | active | past_due | canceled
    currentPeriodStart: DateTime!
    currentPeriodEnd:   DateTime!
    cancelAtPeriodEnd:  Boolean!
    trialEndsAt:        DateTime
  }

  type Invoice {
    id:          ID!
    amount:      Int!
    currency:    String!
    paidAt:      DateTime
    pdfUrl:      String
    description: String!
  }

  type InvoicePage {
    items:      [Invoice!]!
    nextCursor: String
  }

  type CheckoutStatus {
    sessionId:    ID!
    state:        String!  # pending | succeeded | failed
    planId:       ID
    activatedAt:  DateTime
    errorMessage: String
  }

  type CheckoutSessionResult {
    sessionId:   ID!
    checkoutUrl: String!
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

    """Lesson content (ordered exercises) — source: content-service."""
    lessonContent(lessonId: ID!, language: String): LessonContent!

    """Courses in a track (published only, sorted by order)."""
    courses(trackId: ID!, language: String): [Course!]!

    """Units in a course (sorted by course.unitIds order)."""
    units(courseId: ID!, language: String): [Unit!]!

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

<<<<<<< HEAD
    """Per-skill proficiency scores for a language (skill radar source)."""
    skillScores(language: String!): SkillOverview!

    """Predicted certification score (cert = ielts|toeic|jlpt|hsk)."""
    certPredict(cert: String!): CertPrediction!
=======
    """Activity heatmap for last N days (default 365)."""
    activityHeatmap(days: Int): [ActivityDay!]!

    """Today's mission — next lesson + progress-to-daily-goal."""
    todayMission: TodayMission!
>>>>>>> bb8d495 (feat(mvp1-backend): T2 identity prefs + T5 heatmap + T6 today-mission + T7/T8 leaderboard fix)

    """List all AI tutor conversation sessions for current user."""
    conversations: [ConversationSummary!]!

    """Full conversation message history by ID."""
    conversation(id: ID!): Conversation!

    """SRS due cards for the current user (kind=card)."""
    dueCards(limit: Int): [DueCard!]!

    """SRS aggregate stats for current user."""
    srsStats: SrsStats!

    """Count of cards due today (shortcut for dashboard widgets)."""
    srsDueCount: Int!

    """Streak + XP from gamification service."""
    myStreak: UserStreak!

    """List of achievements/badges earned by the current user."""
    myAchievements: [Achievement!]!

    """Leaderboard (top users + current user rank) for current league."""
    myLeaderboard: Leaderboard!

    """Paginated in-app notifications for current user."""
    notifications(filter: String, cursor: String, limit: Int): NotificationPage!

    """Count of unread in-app notifications (for bell badge)."""
    unreadNotificationCount: Int!

    """Public pricing plans."""
    pricingPlans(currency: String, country: String): [Plan!]!

    """Current user's active subscription (null if on free plan)."""
    mySubscription: BillingSubscription

    """Invoice history (paginated)."""
    billingHistory(cursor: String, limit: Int): InvoicePage!

    """Poll checkout session state (pending→succeeded|failed)."""
    checkoutStatus(sessionId: ID!): CheckoutStatus!

    # T3: Onboarding
    """Current user's onboarding progress."""
    onboardingState: OnboardingState!

    # T4: Placement Test
    """CEFR placement test questions for a language pair."""
    placementTest(lang: String!, targetLang: String!): PlacementTest!
  }

  # ─── T3: Onboarding types ────────────────────────────────

  """User's onboarding state machine state."""
  type OnboardingState {
    step:               String!   # language_select|goal_select|level_select|placement|done
    answers:            JSON!     # accumulated step answers
    placementCefr:      String    # A1–C2, set after placement test
    recommendedTrackId: String
    completedAt:        DateTime
  }

  # ─── T4: Placement test types ──────────────────────────────

  type PlacementQuestion {
    id:      ID!
    prompt:  String!
    choices: [String!]!
    skill:   String!   # vocabulary|grammar|reading|listening
  }

  type PlacementTest {
    testId:     String!
    lang:       String!
    targetLang: String!
    questions:  [PlacementQuestion!]!
  }

  type PlacementResult {
    cefr:               String!  # A1|A2|B1|B2|C1|C2
    score:              Float!
    correctCount:       Int!
    totalCount:         Int!
    recommendedTrackId: String!
  }

  input PlacementAnswerInput {
    questionId: String!
    choice:     Int!   # 0-indexed
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

    """Update the current user's identity profile (display name, avatar, locale)."""
    updateProfile(
      displayName:       String
      uiLanguage:        String
      timezone:          String
      avatarUrl:         String
    ): User!

    """Update learning preferences (owned by learning-service)."""
    updateLearningPreferences(
      dailyGoalMinutes:  Int
      reminderTime:      String
      learningLanguages: [String!]
    ): LearningPreferencesResult!

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

    """
    Submit a single exercise answer for server-side grading.
    The caller provides the correctAnswer + maxScore (both obtained from a
    previous lessonContent query); assessment-service computes Correct/Score.
    """
    submitAnswer(
      lessonId:      ID!
      exerciseId:    ID!
      exerciseKind:  String!
      answer:        JSON!
      correctAnswer: JSON
      maxScore:      Float!
      skillTag:      String!
      language:      String!
    ): SubmitAnswerResult!

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

    """Mark specific notifications as read. Returns count updated."""
    markNotificationsRead(ids: [ID!]!): Int!

    """Mark all notifications as read. Returns count updated."""
    markAllNotificationsRead: Int!

    """Save notification channel preferences (JSON object)."""
    updateNotificationPrefs(prefs: JSON!): Boolean!

    """Initiate a checkout session. Returns redirect URL."""
    createCheckoutSession(
      planId:      ID!
      period:      String!
      provider:    String!
      successUrl:  String!
      cancelUrl:   String!
    ): CheckoutSessionResult!

    """Cancel subscription at period end."""
    cancelSubscription(reason: String): BillingSubscription

    """Reactivate a subscription that was set to cancel."""
    reactivateSubscription: BillingSubscription

    # T3: Onboarding mutations
    """Advance onboarding to the next step."""
    updateOnboarding(
      step: String!
      data: JSON!
    ): OnboardingState!

    """Mark onboarding complete and trigger track enrollment."""
    completeOnboarding(
      placementCefr:      String
      recommendedTrackId: String
    ): OnboardingState!

    # T4: Placement test mutation
    """Submit placement test answers and receive CEFR result."""
    submitPlacement(
      testId:  String!
      answers: [PlacementAnswerInput!]!
    ): PlacementResult!
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

  """Learning preferences result (source: learning-service)."""
  type LearningPreferencesResult {
    dailyGoalMinutes:  Int!
    reminderTime:      String
    learningLanguages: [String!]!
  }
`;
