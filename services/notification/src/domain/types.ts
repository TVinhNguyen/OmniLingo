// Domain types for notification-service

export type Channel = 'push' | 'email' | 'in_app' | 'sms';
export type NotifStatus = 'pending' | 'sent' | 'failed' | 'throttled';

export interface NotificationTemplate {
  code: string;
  channel: Channel;
  subject?: string; // for email
  body: string;     // Handlebars template
  variables: string[];
}

export interface NotificationPayload {
  userId: string;
  channel: Channel;
  templateCode: string;
  variables: Record<string, string>;
  deviceToken?: string; // for push
  email?: string;       // for email
  metadata?: Record<string, unknown>;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  channel: Channel;
  templateCode: string;
  status: NotifStatus;
  sentAt?: Date;
  failureReason?: string;
  createdAt: Date;
}

export interface UserNotifPrefs {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  streakReminders: boolean;
  lessonReminders: boolean;
  achievementAlerts: boolean;
  marketingEmails: boolean;
}

// ─── Built-in template codes ───────────────────────────────────────────────────
export const TEMPLATES = {
  STREAK_AT_RISK:           'streak.at_risk',
  STREAK_BROKEN:            'streak.broken',
  SRS_DUE:                  'srs.items_due',
  ACHIEVEMENT_UNLOCKED:     'gamification.achievement.unlocked',
  LESSON_REMINDER:          'learning.lesson_reminder',
  TRIAL_ENDING:             'billing.trial.ending',
  SUBSCRIPTION_CONFIRMED:   'billing.subscription.confirmed',
  SUBSCRIPTION_CANCELED:    'billing.subscription.canceled',
  WELCOME:                  'identity.welcome',
} as const;

// ─── Kafka event shapes consumed ──────────────────────────────────────────────

export interface KafkaEvent {
  event_id: string;
  user_id: string;
  created_at: string;
  [key: string]: unknown;
}
