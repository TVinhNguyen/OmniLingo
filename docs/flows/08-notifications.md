# Flow 08 — Notifications

> Notification service = **Kafka consumer fan-in** từ mọi service, output ra 3 channel: in-app, email, push (web push / FCM / APNs).
>
> **Service**: `notification` (Node.js :3009).

---

## 1. Architecture

```
Publisher services:
  identity, learning, vocabulary, srs, billing, payment, gamification, tutor (P2)
        │
        ▼ Kafka topics (fan-in)
┌──────────────────────────────────────────┐
│         notification-service             │
│  ┌───────────────────────────────────┐   │
│  │ consumer: route event → template  │   │
│  └───────────────────────────────────┘   │
│  ┌───────────────────────────────────┐   │
│  │ user preferences check            │   │
│  │ (allowed channels per event type) │   │
│  └───────────────────────────────────┘   │
│  ┌───────────────────────────────────┐   │
│  │ Dispatcher:                       │   │
│  │  - in-app DB row (user_notifs)    │   │
│  │  - email (SendGrid / SES)         │   │
│  │  - push (FCM / APNs / Web Push)   │   │
│  └───────────────────────────────────┘   │
└──────────────────────────────────────────┘
         │
         ▼
     User sees notification
         │
  ┌──────┼──────────────┐
  ▼      ▼              ▼
 bell icon  email inbox  phone push
```

---

## 2. Topic → Template → Channel mapping

| Kafka topic | Template | Channels | Condition |
|-------------|----------|----------|-----------|
| `identity.user.registered` | welcome_v1 | email | Always |
| `identity.user.deleted` | account_deleted | email | Always |
| `onboarding.completed` | onboarding_done | email, in-app | Always |
| `learning.lesson.completed` | — | in-app (chỉ khi milestone) | Nếu là lesson đầu của unit/track; hoặc `progress.daily_goal.reached` |
| `progress.daily_goal.reached` | daily_goal_reached | in-app, push | User có `daily_goal_push=true` |
| `gamification.streak.at_risk` | streak_at_risk | push, email | User chưa active hôm nay + 21:00 local |
| `gamification.streak.updated` | streak_milestone | push, in-app | Milestone (7, 30, 100, 365 days) |
| `gamification.achievement.unlocked` | badge_unlocked | in-app, push | Always |
| `gamification.level.up` | level_up | in-app, push | Always |
| `srs.card.due` (daily digest) | srs_due_digest | push, in-app | User có `srs_reminder=true`, fire 1 lần/ngày |
| `billing.invoice.paid` | invoice_paid | email | Always |
| `billing.payment.failed` | payment_failed | email, in-app | Always, high priority |
| `billing.trial.ending` | trial_ending | email | 3 days before |
| `billing.subscription.canceled` | subscription_canceled | email | Always |
| `tutor.booking.confirmed` (P2) | booking_confirmed | email, push | — |
| `tutor.booking.reminder` (P2) | booking_reminder | push | 30m before |
| `community.reply.created` (P2) | community_reply | in-app | Nếu reply vào post của user |

---

## 3. Consumer logic (pseudocode)

```typescript
async function handleEvent(topic: string, payload: any) {
  const rule = getNotificationRule(topic);
  if (!rule) return;

  // 1. Load user preferences
  const prefs = await loadUserPrefs(payload.userId);

  // 2. Check condition (e.g. streak at risk only after 21:00 local)
  if (!rule.condition(payload, prefs)) return;

  // 3. Deduplicate: same user + same template + within window
  const key = `notif:${payload.userId}:${rule.templateId}:${rule.dedupeWindow(payload)}`;
  const isNew = await redis.setnx(key, 1, { ex: rule.dedupeTtl });
  if (!isNew) return;

  // 4. For each allowed channel, dispatch
  for (const channel of rule.channels) {
    if (!prefs.channels[rule.templateId]?.[channel]) continue;
    switch (channel) {
      case 'in-app':
        await insertInAppNotification({
          userId: payload.userId,
          type: rule.templateId,
          title: render(rule.titleTemplate, payload),
          body: render(rule.bodyTemplate, payload),
          targetUrl: rule.urlBuilder(payload),
        });
        break;
      case 'email':
        await sendEmail({
          to: await fetchEmail(payload.userId),
          template: rule.emailTemplate,
          params: payload,
        });
        break;
      case 'push':
        await sendPush({
          tokens: await fetchPushTokens(payload.userId),
          title: render(rule.pushTitle, payload),
          body: render(rule.pushBody, payload),
          data: { targetUrl: rule.urlBuilder(payload) },
        });
        break;
    }
  }
}
```

---

## 4. User preferences

Stored in `user_notification_prefs`:

```
{
  userId: "uuid",
  channels: {
    streak_at_risk:   { in-app: true, email: false, push: true },
    daily_goal:       { in-app: true, email: false, push: true },
    srs_digest:       { in-app: true, email: false, push: true, time: "19:00" },
    invoice:          { in-app: true, email: true,  push: false },
    community:        { in-app: true, email: false, push: false },
    marketing:        { email: false, push: false }
  },
  timezone: "Asia/Ho_Chi_Minh",
  quietHours: { start: "22:00", end: "07:00" }
}
```

Settings page `/settings/notifications`:

```
Grid: Loại thông báo × Kênh (In-app / Email / Push) → toggle switches
+ Khung giờ yên tĩnh (không push trong khoảng này)
+ Unsubscribe all marketing
```

---

## 5. In-app notification storage

```sql
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target_url TEXT,
  icon TEXT,
  priority SMALLINT DEFAULT 0,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX idx_user_unread (user_id, read, created_at DESC)
);
```

### BFF queries

```graphql
extend type Query {
  notifications(filter: NotificationFilter, cursor: String, limit: Int = 20): NotificationPage!
  unreadNotificationCount: Int!
}

type NotificationPage {
  items: [Notification!]!
  nextCursor: String
  unreadCount: Int!
}

type Notification {
  id: ID!
  type: String!
  title: String!
  body: String!
  targetUrl: String
  icon: String
  priority: Int!
  read: Boolean!
  createdAt: DateTime!
}

enum NotificationFilter {
  ALL UNREAD LEARNING SOCIAL BILLING SYSTEM
}

extend type Mutation {
  markNotificationsRead(ids: [ID!]!): Int!
  markAllNotificationsRead: Int!
  deleteNotification(id: ID!): Boolean!
  updateNotificationPrefs(input: NotificationPrefsInput!): NotificationPrefs!
}
```

### Realtime badge count (bell icon)

- MVP1: poll `unreadNotificationCount` mỗi 30s.
- MVP1.5: WS subscription `notificationAdded` → realtime badge +1.

---

## 6. Scheduled notifications (cron)

Some events KHÔNG đến từ Kafka mà từ cron job trong notification-service.

### 6.1. Daily reminder

```
Hourly job:
  SELECT users WHERE reminder_enabled=true
    AND reminder_time = current_hour_in_user_tz
    AND NOT active_today(user_id)
  → send push "Bạn chưa học hôm nay, 5 phút thôi nhé!"
```

### 6.2. Streak at risk

```
Hourly job 20:00 local:
  SELECT users WHERE current_streak > 0
    AND last_active_date < today_in_user_tz
  → send push "⚠️ Streak X ngày của bạn sắp mất! Học 1 bài nhé."
```

### 6.3. SRS daily digest

```
Daily 19:00 local:
  SELECT srs_due_count > 0 users
  → send push "Bạn có N thẻ cần ôn hôm nay" + deep link /practice/vocabulary
```

### 6.4. Weekly recap

```
Sunday 20:00 local:
  Aggregate user's week: xp, minutes, lessons, streak
  → send email "Tuần qua của bạn" với summary cards
```

---

## 7. Push token registration

```
User cho phép notification → browser/device gets push token
  ├─ mutation registerPushToken(token, deviceType, deviceId)
  │    BFF → notification-service:
  │      UPSERT user_push_tokens (user_id, device_id, token, type, updated_at)
  │
  └─ Server có thể gọi FCM/APNs với token này.
```

Token invalidation: khi FCM/APNs trả về error "invalid_token" → DELETE row.

---

## 8. Email provider abstraction

```
notification-service:
  email_provider = "sendgrid" | "ses" | "mailgun"

  Templates trong DB hoặc git:
    templates/welcome_v1.mjml (compile → HTML)
    templates/daily_goal_reached.mjml
    ...

  Rendered locally hoặc qua provider templates (Sendgrid dynamic templates).
```

Transactional (welcome, invoice) vs Marketing (weekly digest):
- Transactional: always send (user pháp lý đồng ý khi register).
- Marketing: opt-in via /settings/notifications. Có unsubscribe link trong mọi email.

---

## 9. Edge cases

| Case | Xử lý |
|------|-------|
| User không có email (social login pseudo email) | Skip email channel, vẫn in-app + push |
| Push token expired | Retry with fresh token; nếu fail 3 lần → xoá token |
| Quiet hours trùng push time | Defer push đến 07:00 local (lưu vào queue table) |
| Duplicate event (consumer retry) | Dedupe via redis key `notif:userId:templateId:dedupeKey` TTL 1h |
| User just registered, không có preferences | Mặc định = opt-in mọi transactional, opt-out marketing |
| User unsubscribe email nhưng vẫn cần invoice | Vẫn gửi (transactional), không override luật pháp lý |

---

## 10. Pages liên quan

| Page | Status | Flow |
|------|--------|------|
| /notifications | ✅ UI có | §5 query notifications |
| /settings/notifications | 🔴 CHƯA CÓ sub-page | §4 prefs |
| Bell dropdown (layout) | ⚠️ UI có, cần wire | Poll unreadCount, list items |

---

## 11. Observability

- `notification_consumer_lag_seconds{topic}` — alert > 60s
- `notification_dispatch_total{channel,status}`
- `email_bounce_rate`, `push_delivery_rate`
- `unsubscribe_rate_7d` — alert > 2% (content có vấn đề)

---

## 12. Events publish (notification → downstream)

| Topic | Khi nào | Consumer |
|-------|---------|----------|
| `notification.email.bounced` | Email bounce hard | identity (flag email invalid) |
| `notification.user.unsubscribed` | User click unsub link | marketing analytics |
| `audit.notification.events` | Mọi send | SIEM |
