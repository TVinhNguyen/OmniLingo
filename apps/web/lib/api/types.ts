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

/** Alias used by dashboard page.tsx */
export type DashboardData = Dashboard;

export interface VocabWord {
  id: string;
  lemma: string;
  language: string;
  definition: string;
}

export interface DeckCard {
  id: string;
  deckId: string;
  lemma: string;
  meaning: string;
  ipa?: string;
  pos?: string;
  status?: string; // "new" | "learning" | "mastered"
}

export interface DeckDetail {
  id: string;
  name: string;
  cardCount: number;
  dueCount: number;
  masteredCount: number;
}

export interface ConversationSummary {
  id: string;
  messageCount: number;
  lastMessage: string;
  ttlSeconds: number;
}

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: string;
  messages: ChatHistoryMessage[];
}

export interface DueCard {
  itemId: string;
  state: string;
  reps: number;
}

export interface SrsStats {
  total: number;
  dueToday: number;
  matureCount: number;
}

export interface UserStreak {
  current:     number;
  longest:     number;
  freezesLeft: number;
  totalXp:     number;
  level:       number;
}

export interface Achievement {
  id:          string
  code:        string
  title:       string
  description: string
  icon:        string
  rarity:      string
  earnedAt:    string | null
  xpReward:    number
}

export interface LeaderboardEntry {
  rank:          number
  userId:        string
  displayName:   string
  avatarUrl:     string | null
  xp:            number
  isCurrentUser: boolean
}

export interface Leaderboard {
  league:  string
  entries: LeaderboardEntry[]
  myRank:  number
  myXp:    number
}

export interface AppNotification {
  id:        string
  type:      string
  title:     string
  body:      string
  targetUrl: string | null
  icon:      string | null
  priority:  number
  read:      boolean
  createdAt: string
}

export interface NotificationPage {
  items:       AppNotification[]
  nextCursor:  string | null
  unreadCount: number
}

export interface Plan {
  id:       string
  name:     string
  tier:     string
  price:    number
  currency: string
  period:   string
  features: string[]
  popular:  boolean
}

export interface BillingSubscription {
  id:                 string
  planId:             string
  planName:           string
  state:              string
  currentPeriodStart: string
  currentPeriodEnd:   string
  cancelAtPeriodEnd:  boolean
  trialEndsAt:        string | null
}

export interface Invoice {
  id:          string
  amount:      number
  currency:    string
  paidAt:      string | null
  pdfUrl:      string | null
  description: string
}

export interface InvoicePage {
  items:      Invoice[]
  nextCursor: string | null
}

export interface CheckoutStatus {
  sessionId:    string
  state:        string
  planId:       string | null
  activatedAt:  string | null
  errorMessage: string | null
}

export interface CheckoutSessionResult {
  sessionId:   string
  checkoutUrl: string
}
