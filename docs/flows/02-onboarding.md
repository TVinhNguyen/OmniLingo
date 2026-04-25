# Flow 02 — Onboarding

> Sau khi user register (hoặc first-time OAuth), redirect `/onboarding`. 8-step wizard xác định ngôn ngữ, mục tiêu, level, lịch học.
>
> **Service liên quan**: `identity`, `learning`, `assessment`, `notification`.
> **Mục tiêu UX**: < 3 phút, dropout rate < 15%.

---

## 1. Tổng quan flow

```
Register/OAuth Done
    │
    ▼
/onboarding (wizard state giữ trong server session hoặc localStorage + mỗi step sync BE)
    │
    ├─ Step 1: Chọn ngôn ngữ học (multi, ít nhất 1)
    ├─ Step 2: Ngôn ngữ mẹ đẻ
    ├─ Step 3: Mục tiêu (travel / work / study / exam)
    ├─ Step 4: Nếu goal=exam → chọn cert + target score + deadline
    ├─ Step 5: Tự đánh giá level hoặc làm placement test
    ├─ Step 6: (optional) Placement test 10-15 câu
    ├─ Step 7: Daily goal (5/10/20/30 phút/ngày)
    ├─ Step 8: Giờ nhắc nhở (time picker + chọn ngày trong tuần)
    │
    ▼
Publish onboarding.completed
    │
    ├─► learning: tạo initial track + placement-based unit unlock
    ├─► gamification: unlock "First Steps" badge
    ├─► notification: schedule daily reminder cron
    │
    ▼
Redirect /dashboard
```

---

## 2. State management

Server-side onboarding state (để user có thể resume nếu close tab):

**GraphQL query** (BFF → learning):
```graphql
query OnboardingState {
  onboardingState {
    currentStep     # 1..8
    completed
    selectedLanguages
    nativeLanguage
    goal
    certGoal { cert, targetScore, deadline }
    level
    dailyGoalMinutes
    reminder { time, days }
  }
}
```

**Mutation** mỗi step:
```graphql
mutation SetOnboardingField(input: OnboardingInput!) {
  updateOnboarding(input: $input) {
    currentStep
    completed
  }
}
```

**Service layer**: learning-service có bảng `user_onboarding(user_id PK, state JSONB, completed_at)`.

---

## 3. Step-by-step

### Step 1: Chọn ngôn ngữ học

```
UI: grid flags (en, ja, ko, zh, es, fr, de, vi, ...)
User chọn 1+ ngôn ngữ → click "Tiếp"
    │
    ▼ mutation updateOnboarding(selectedLanguages: ["en", "ja"])
BFF → learning-service: UPDATE user_onboarding SET state->'languages'=...
  → emit learning.goal.set (partial)
```

### Step 2: Ngôn ngữ mẹ đẻ

```
Dropdown từ IP geo → pre-select default
    │
    ▼ mutation updateProfile(nativeLanguage: "vi")
BFF → identity-service: UPDATE user_profile SET native_language='vi'
```

### Step 3: Mục tiêu

```
Radio: [Du lịch] [Công việc] [Học thuật] [Luyện thi] [Giao tiếp hằng ngày]
    │
    ▼ mutation updateOnboarding(goal: "exam")
```

**Business rule**: Nếu goal = `exam` → step 4 hiện, ngược lại skip.

### Step 4: Chứng chỉ (conditional)

```
Dropdown cert: IELTS / TOEFL / TOEIC / CEFR / HSK / JLPT / TOPIK / DELF / Goethe
Input target score (min-max phụ thuộc cert)
Date picker deadline (min = 1 tháng từ hôm nay)
    │
    ▼ mutation updateOnboarding(certGoal: { cert: "ielts", targetScore: 7.0, deadline: "2027-01-01" })
learning-service: UPDATE user_onboarding, compute weeks_remaining
```

### Step 5: Đánh giá level

```
Option A: Radio "Hoàn toàn mới / Biết ít / Trung cấp / Khá / Giỏi" (A1-C2)
Option B: Button "Làm bài test 5 phút" → chuyển placement test

Nếu Option A:
    ▼ mutation updateOnboarding(level: "B1")
    Skip step 6
```

### Step 6: Placement test (nếu chọn Option B)

```
UI: /onboarding/placement
    ├─ GET → query placementTest(language: "en")
    │   BFF → assessment-service → trả về 10-15 câu adaptive
    │   {
    │     questions: [{ id, prompt, options, type: "mcq" | "listening" | "reading" }]
    │   }
    │
    ├─ User trả lời từng câu (adaptive: sai thì dễ hơn, đúng thì khó hơn)
    │
    └─ Submit all → mutation submitPlacement(language, answers: [...])
         BFF → assessment-service:
           1. Grade từng câu
           2. Compute CEFR level (A1 → C2)
           3. Compute per-skill breakdown
           4. INSERT placement_results
           5. Publish assessment.submission.graded
           → { level: "B1+", skillScores: {listen: 60, read: 75, ...} }
         → progress-service consume event → set baseline
```

### Step 7: Daily goal

```
Radio card: [5 phút - Nhẹ nhàng] [10 phút - Đều đặn] [20 phút - Nghiêm túc] [30 phút - Chuyên sâu]
    │
    ▼ mutation updateOnboarding(dailyGoalMinutes: 20)
learning: UPDATE state, emit learning.goal.set { minutes: 20 }
```

### Step 8: Giờ nhắc nhở

```
Time picker + checkbox days (T2-CN)
    │
    ▼ mutation updateOnboarding(reminder: { time: "19:00", days: [1,2,3,4,5,6,7] })
BFF → notification-service:
  1. UPDATE user_reminders SET ...
  2. Schedule cron job (push + email theo user settings)
```

---

## 4. Hoàn thành onboarding

```
User click "Bắt đầu học" sau step 8
    │
    ▼ mutation completeOnboarding()
BFF → learning-service:
  1. Read user_onboarding state
  2. Tạo default track cho MỖI ngôn ngữ đã chọn:
     INSERT user_tracks (user_id, track_id, current_unit_id, enrolled_at)
     với track_id = tìm theo (language, level, goal)
  3. UPDATE user_onboarding SET completed_at=NOW()
  4. Publish onboarding.completed {
       userId, languages, level, goal, dailyGoalMinutes
     }
  5. → { dashboardUrl: "/dashboard" }

Kafka fan-out:
  • gamification: unlock badge "First Steps" → emit gamification.achievement.unlocked
  • notification: send "Welcome aboard!" + setup reminder schedule
  • progress: initialize skill baseline (nếu chưa có từ placement)

UI: confetti animation → redirect /dashboard
```

---

## 5. Event contract

### `onboarding.completed`

```json
{
  "userId": "uuid",
  "languages": ["en", "ja"],
  "nativeLanguage": "vi",
  "goal": "exam",
  "certGoal": {
    "cert": "ielts",
    "targetScore": 7.0,
    "deadline": "2027-01-01"
  },
  "level": "B1",
  "placementScoreBreakdown": {
    "listening": 62,
    "reading": 70,
    "speaking": null,
    "writing": null
  },
  "dailyGoalMinutes": 20,
  "reminder": { "time": "19:00", "days": [1,2,3,4,5,6,7] },
  "completedAt": "2026-04-19T10:30:00Z"
}
```

---

## 6. BFF Schema additions cần

```graphql
extend type Query {
  onboardingState: OnboardingState!
  placementTest(language: String!): PlacementTest!
}

type OnboardingState {
  currentStep: Int!
  completed: Boolean!
  selectedLanguages: [String!]!
  nativeLanguage: String
  goal: String
  certGoal: CertGoal
  level: String
  dailyGoalMinutes: Int
  reminder: Reminder
}

type CertGoal {
  cert: String!
  targetScore: Float!
  deadline: DateTime!
}

type Reminder {
  time: String!   # "HH:MM"
  days: [Int!]!   # 1=Mon..7=Sun
}

type PlacementTest {
  language: String!
  questions: [PlacementQuestion!]!
}

type PlacementQuestion {
  id: ID!
  type: String!   # "mcq" | "listening" | "reading"
  prompt: String!
  options: [String!]
  audioUrl: String
}

input OnboardingInput {
  selectedLanguages: [String!]
  nativeLanguage: String
  goal: String
  certGoal: CertGoalInput
  level: String
  dailyGoalMinutes: Int
  reminder: ReminderInput
}

extend type Mutation {
  updateOnboarding(input: OnboardingInput!): OnboardingState!
  submitPlacement(language: String!, answers: [PlacementAnswer!]!): PlacementResult!
  completeOnboarding: CompleteResult!
}

type PlacementResult {
  level: String!
  skillScores: SkillScores!
  recommendedTrackId: ID!
}

type CompleteResult {
  ok: Boolean!
  dashboardUrl: String!
}
```

---

## 7. Error handling

| Case | Xử lý |
|------|-------|
| User refresh giữa chừng | Load `onboardingState`, resume từ `currentStep` |
| User skip → click "Quay về sau" | Server cho phép; dashboard sẽ hiện banner "Hoàn thành onboarding để unlock khuyến nghị cá nhân hoá" |
| Placement test timeout (>10p) | Auto submit với câu đã trả lời |
| Submit placement lần 2 | 409 — chỉ 1 lần/language trong 7 ngày |
| Language chọn không support | 400 (phía FE filter trước) |

---

## 8. UI pages

| Page | Mô tả |
|------|-------|
| /onboarding | Container wizard |
| /onboarding/languages | Step 1 |
| /onboarding/native | Step 2 |
| /onboarding/goal | Step 3 |
| /onboarding/cert | Step 4 (conditional) |
| /onboarding/level | Step 5 |
| /onboarding/placement | Step 6 (optional) |
| /onboarding/daily-goal | Step 7 |
| /onboarding/reminder | Step 8 |
| /onboarding/finish | Success screen (3s rồi redirect) |

Frontend có thể implement 1 trang `/onboarding` với internal state machine, hoặc tách route — tuỳ UX team.

---

## 9. Metrics cần track

- Completion rate per step (funnel)
- Time to complete
- % chọn placement test vs self-rate
- Average level chọn vs placement result (để calibrate self-rate UI)
