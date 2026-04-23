# Flow 06 — Progress & Gamification

> XP, Streak, Badges, Level-up, Leaderboard, Daily goal, Skill radar, Activity heatmap.
>
> **Services**: `progress` (Go), `gamification` (Go). Cả 2 chủ yếu là **Kafka consumer** — ít API write trực tiếp.

---

## 1. Architecture

```
Events in:
  learning.lesson.completed
  srs.review.completed
  assessment.submission.graded
  gamification.xp.awarded          (self-consume hoặc từ progress)

        │
        ▼
┌─────────────────┐       ┌──────────────────┐
│    progress     │       │   gamification   │
│  (skill scores, │       │ (XP, streak,     │
│   minutes, hm)  │       │  badges, level)  │
└────────┬────────┘       └─────────┬────────┘
         │                          │
         └──► Publish:              └──► Publish:
              progress.xp.awarded         gamification.xp.awarded
              progress.daily_goal.reached gamification.streak.updated
              progress.streak.broken      gamification.achievement.unlocked
                                          gamification.level.up
```

**⚠️ Naming bug hiện tại**: gamification consumer đang listen `progress.xp.awarded` nhưng gamification publisher publish `gamification.xp.awarded`. Cần pick 1 convention và sửa (xem [00-overview.md §4.3](./00-overview.md#43--naming-mismatch-cần-sửa-bugs-hiện-tại)).

---

## 2. Progress service

### 2.1. Responsibility

| Aspect | Lưu trong DB |
|--------|--------------|
| Minutes learned (daily, weekly, lifetime) | `user_progress_daily(user_id, date, minutes, xp, lessons)` |
| Skill scores (listening, reading, speaking, writing, vocabulary, grammar) 0-100 | `user_skill_scores(user_id, language, skill, score, updated_at)` |
| Words mastered (SRS state review + stability > threshold) | Derived from srs data + cache trong `user_progress(user_id, words_mastered)` |
| Activity heatmap (365 days) | Computed on-the-fly từ `user_progress_daily` |
| Cert predicted score | ML model (Phase 2), MVP1 = simple formula từ skill scores |

### 2.2. Consume `learning.lesson.completed`

```python
# pseudocode
def handle_lesson_completed(event):
    date = event.completed_at.date()
    with db.tx():
        upsert_daily(
            user_id=event.user_id,
            date=date,
            minutes_delta=event.duration_ms // 60000,
            xp_delta=event.xp_earned,
            lessons_delta=1
        )
        for tag in event.skill_tags:
            update_skill_score(
                user_id=event.user_id,
                language=event.language,
                skill=tag,
                delta=event.score * 0.1  # smoothing
            )
        # Check daily goal
        daily = get_daily(event.user_id, date)
        goal = get_user_daily_goal(event.user_id)
        if daily.minutes >= goal and not daily.goal_reached:
            set_goal_reached(event.user_id, date)
            publish("progress.daily_goal.reached", {...})
```

### 2.3. Consume `srs.review.completed`

```python
def handle_srs_review(event):
    if event.new_state == "review" and event.stability > 21:
        increment_words_mastered(event.user_id, +1)
    update_daily(event.user_id, today, reviews_delta=1)
```

### 2.4. Query API (BFF calls)

```
GET /progress/:userId/summary
  → { streak, totalXp, minutesToday, minutesTotal, wordsMastered, dailyGoal }

GET /progress/:userId/weekly?days=7
  → [{ date, xp, minutes, lessonsCompleted, goalReached }]

GET /progress/:userId/skills?language=en
  → { listening, reading, speaking, writing, vocabulary, grammar } each 0-100

GET /progress/:userId/heatmap?days=365
  → [{ date, activityLevel }] level 0-4 (cho UI calendar xanh)

GET /progress/:userId/cert-predict?cert=ielts
  → { predictedScore: 6.5, confidence: 0.7, targetScore: 7.0, onTrack: false }
```

---

## 3. Gamification service

### 3.1. Responsibility

| Aspect | Lưu |
|--------|-----|
| XP & Level | `user_gamification(user_id, total_xp, level)` |
| Streak | `user_streak(user_id, current, longest, last_active_date, frozen_days)` |
| Badges | `user_achievements(user_id, badge_id, earned_at)` |
| Leaderboard | Redis sorted set theo tuần + theo league (Bronze/Silver/Gold/Diamond) |
| League promotion/relegation | Weekly cron job |

### 3.2. XP calculation

```
base_xp sources:
  - Lesson complete: 10 base + accuracy_bonus (10 × accuracy)
  - SRS review Again: 1, Hard: 2, Good: 3, Easy: 4
  - Perfect lesson (100%): +20 bonus
  - First lesson of the day: +10 bonus
  - Daily goal reached: +50 bonus
  - Streak milestone (7, 30, 100, 365): +100/500/1000/5000
  - XP multiplier: Plus plan 1.5x, Pro plan 2x, weekend 1.5x (stackable cap 3x)
```

### 3.3. Level formula

```
level = floor(sqrt(total_xp / 100))
xp_to_next_level = ((level+1)^2 - level^2) * 100
```

Khi level tăng → emit `gamification.level.up` → notification "🎉 You reached level N!".

### 3.4. Streak logic

```
On learning.lesson.completed or srs.review.completed:
  if last_active_date == today:
    no change
  elif last_active_date == today - 1:
    current += 1
    if current > longest: longest = current
  elif last_active_date == today - 2 and user has streak_freeze:
    consume streak_freeze, streak continues
  else:
    publish("progress.streak.broken", {...})
    current = 1

Update last_active_date = today
publish("gamification.streak.updated", {current, longest})
```

**Streak freeze**: item có thể buy bằng gems. 1 freeze cover 1 ngày miss.

### 3.5. Badge engine

```yaml
badges:
  - id: first_lesson
    trigger: learning.lesson.completed
    condition: "user's lesson_count == 1"
  - id: 7_day_streak
    trigger: gamification.streak.updated
    condition: "current >= 7"
  - id: 100_words
    trigger: progress.xp.awarded
    condition: "words_mastered >= 100"
  - id: night_owl
    trigger: learning.lesson.completed
    condition: "completed_at hour between 0-6 for 5 distinct days"
  - id: perfect_week
    trigger: progress.daily_goal.reached
    condition: "7 consecutive goal_reached dates"
```

Engine: each consume event → eval conditions → if newly earned → INSERT + emit `gamification.achievement.unlocked`.

### 3.6. Leaderboard

```
Redis sorted set per week per league:
  ZSET leaderboard:gold:2026-W16 score=xp member=userId

Query:
  GET /leaderboard?league=gold&period=week
    → Redis ZREVRANGE 0 99 WITHSCORES
    → hydrate user display name, avatar from identity (DataLoader)

Query friends:
  GET /leaderboard/friends?userId=...
    → social-service returns friend ids
    → Redis ZSCORE batch → sort → return
```

Weekly job (Sunday 23:59):
- Top 10% → promote league
- Bottom 20% → relegate
- Everyone's weekly XP → reset để tính tuần mới.

---

## 4. BFF Schema

```graphql
extend type Query {
  myProgress: ProgressSummary!                  # ✅ đã có
  weeklyProgress(days: Int): [WeeklyDay!]!      # ✅ đã có
  skillScores(language: String!): SkillScores!  # 🔴 thêm
  activityHeatmap(days: Int!): [HeatmapDay!]!   # 🔴 thêm
  certPredict(cert: String!): CertPredict       # 🔴 thêm

  myStreak: Streak!                             # 🔴 thêm
  achievements(userId: ID): [Achievement!]!     # 🔴 thêm
  leaderboard(league: String!, period: String!): [LeaderboardEntry!]!
  friendsLeaderboard(period: String!): [LeaderboardEntry!]!
}

type ProgressSummary {
  streak: Int!
  totalXp: Int!
  level: Int!
  xpToNextLevel: Int!
  minutesLearnedToday: Int!
  minutesLearnedTotal: Int!
  wordsMastered: Int!
  dailyGoalMinutes: Int!
  dailyGoalReached: Boolean!
}

type SkillScores {
  listening: Int!
  reading: Int!
  speaking: Int!
  writing: Int!
  vocabulary: Int!
  grammar: Int!
}

type HeatmapDay {
  date: String!
  activityLevel: Int!   # 0-4
  xp: Int!
  minutes: Int!
}

type Streak {
  current: Int!
  longest: Int!
  frozenDaysLeft: Int!
  atRisk: Boolean!       # hôm nay chưa active + tối 21:00
  lastActiveDate: String!
}

type Achievement {
  id: ID!
  name: String!
  description: String!
  iconUrl: String!
  rarity: String!         # common | rare | epic | legendary
  earnedAt: DateTime
  progress: AchievementProgress  # nếu chưa earn
}

type AchievementProgress {
  current: Int!
  target: Int!
}

type LeaderboardEntry {
  rank: Int!
  userId: ID!
  username: String!
  avatarUrl: String
  level: Int!
  xpThisPeriod: Int!
  streak: Int!
}

type CertPredict {
  cert: String!
  predictedScore: Float!
  confidence: Float!
  targetScore: Float
  onTrack: Boolean!
  daysToTarget: Int
}

extend type Mutation {
  freezeStreak: FreezeStreakResult!  # dùng gem
  claimDailyReward: DailyReward!     # sau khi hoàn thành daily goal
}
```

---

## 5. UI integration

### 5.1. Dashboard widgets

| Widget | Query | Update trigger |
|--------|-------|----------------|
| Streak flame | `myStreak` | Sau mỗi lesson/review |
| XP progress bar | `myProgress.totalXp + xpToNextLevel` | Realtime optimistic, hoặc refetch sau complete |
| Daily goal ring | `myProgress.minutesLearnedToday / dailyGoalMinutes` | Sau mỗi lesson |
| Skill radar | `skillScores(language)` | Lazy load, refetch mỗi 5 phút |
| Heatmap | `activityHeatmap(days: 365)` | Lazy load, cache 1h |
| Badges shelf | `achievements(userId: me)` | Refetch sau lesson/review |

### 5.2. /progress page

```
Tabs:
  - Overview: summary + weekly chart + skill radar
  - Activity: heatmap 365d, streak calendar
  - Vocabulary: words learned curve, mastery distribution
  - Goals: daily goal history, cert progress (nếu có)
```

### 5.3. /achievements page

```
Grid 4 cột: badges earned + locked (greyed).
Click badge → modal: description, earnedAt, % users earned.
Filter: All / Earned / Locked, by rarity.
```

### 5.4. /leaderboard page

```
Tabs:
  - League (mặc định): top 100 của league hiện tại + highlight user position
  - Friends: leaderboard bạn bè
  - Global: top 100 toàn cầu (tuần/tháng/all-time)

Countdown timer: "League resets in 2d 14h 30m"
```

---

## 6. Realtime updates

**Pattern**: UI không cần WS cho MVP1. Dùng refetch hoặc GraphQL subscription trong MVP1.5.

MVP1:
- Sau `completeLesson` mutation → optimistic XP animation → refetch dashboard sau 500ms (để Kafka kịp process → progress + gamification update).
- Nếu user mở tab khác → on-focus refetch.

MVP1.5 (optional):
- WS endpoint `/subscriptions` từ BFF subscribe `user:${userId}:updates`.
- Notification service push realtime update qua Redis pub/sub → BFF broadcast.

---

## 7. Edge cases

| Case | Xử lý |
|------|-------|
| User đổi timezone | Dùng user's timezone lưu trong profile để compute "today" |
| Clock skew giữa devices | Server là source of truth; client chỉ hiện cached |
| Event arrives out of order | Idempotent consumer: check `(user_id, event_id)` unique |
| Double XP awarded (duplicate event) | Outbox + idempotency key prevent; consumer cũng check event_id |
| User có lesson completed sau nửa đêm | Date = ngày complete_at theo timezone user |

---

## 8. Metrics

| Metric | Ý nghĩa |
|--------|---------|
| `progress_consumer_lag_seconds` | Kafka consumer lag |
| `daily_goal_reached_rate` | % users hit daily goal |
| `avg_streak_length` | Cho engagement dashboard |
| `badge_unlock_distribution` | Tỉ lệ user có badge X |
| `leaderboard_league_distribution` | Số user per league |
