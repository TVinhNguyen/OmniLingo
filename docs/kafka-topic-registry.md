# Kafka Topic Registry

> **Convention**: `<domain>.<entity>.<action>` — all lowercase, dot-separated, no underscores in segments.  
> **Generated**: 2026-04-25 | **Pattern regex**: `^[a-z]+\.[a-z_]+\.[a-z_]+$`

All 21 topics conform to the naming convention. The `_` character is allowed **within** a segment (e.g., `lesson_started`) but not between segments.

---

## Topics

| # | Topic | Producer | Consumer(s) | Go Struct | Idempotency Key |
|---|-------|----------|-------------|-----------|-----------------|
| 1 | `identity.user.registered` | identity | gamification, notifications | `identity/internal/domain.UserRegisteredEvent` | `event_id` |
| 2 | `identity.user.logged_in` | identity | *(audit/analytics — future)* | `identity/internal/domain.UserLoggedInEvent` | `event_id` |
| 3 | `identity.user.deleted` | identity | gamification, entitlement | `identity/internal/domain.UserDeletedEvent` | `event_id` |
| 4 | `learning.lesson.started` | learning | progress | `learning/internal/domain.LessonStartedEvent` | `event_id` |
| 5 | `learning.lesson.completed` | learning | progress, gamification | `learning/internal/domain.LessonCompletedEvent` | `event_id` |
| 6 | `learning.goal.set` | learning | *(analytics — future)* | `learning/internal/domain.GoalSetEvent` | `event_id` |
| 7 | `vocabulary.card.added` | vocabulary | srs, progress | `vocabulary/internal/domain.CardAddedEvent` | `event_id` |
| 8 | `vocabulary.card.removed` | vocabulary | srs | `vocabulary/internal/domain.CardRemovedEvent` | `event_id` |
| 9 | `vocabulary.card.marked_known` | vocabulary | srs, progress | `vocabulary/internal/domain.CardMarkedKnownEvent` | `event_id` |
| 10 | `vocabulary.deck.created` | vocabulary | *(analytics — future)* | `vocabulary/internal/domain.DeckCreatedEvent` | `event_id` |
| 11 | `vocabulary.import.completed` | vocabulary | srs | `vocabulary/internal/domain.ImportCompletedEvent` | `event_id` |
| 12 | `gamification.xp.awarded` | gamification | progress, notifications | `gamification/internal/domain.XPAwardedEvent` | `event_id` |
| 13 | `gamification.streak.updated` | gamification | notifications | `gamification/internal/domain.StreakUpdatedEvent` | `event_id` |
| 14 | `gamification.achievement.unlocked` | gamification | notifications | `gamification/internal/domain.AchievementUnlockedEvent` | `event_id` |
| 15 | `billing.subscription.created` | billing | entitlement | `billing/internal/domain.SubscriptionCreatedEvent` | `event_id` |
| 16 | `billing.subscription.canceled` | billing | entitlement | `billing/internal/domain.SubscriptionCanceledEvent` | `event_id` |
| 17 | `billing.invoice.paid` | billing | notifications | `billing/internal/domain.InvoicePaidEvent` | `event_id` |
| 18 | `srs.review.completed` | srs (Rust) | progress | *(Rust struct in srs/src/domain)* | `event_id` |
| 19 | `assessment.exercise.graded` | assessment | progress, gamification | `assessment/internal/domain.ExerciseGradedEvent` | `event_id` |
| 20 | `assessment.submission.graded` | assessment | progress, srs | `assessment/internal/domain.SubmissionGradedEvent` | `event_id` |
| 21 | `assessment.test.completed` | assessment | progress | `assessment/internal/domain.TestCompletedEvent` | `event_id` |

---

## Audit Topics

Audit topics follow `audit.<service>.events` — these are **internal observability** topics, not domain events.

| Topic | Producer |
|-------|----------|
| `audit.identity.events` | identity |
| `audit.learning.events` | learning |
| `audit.vocabulary.events` | vocabulary |
| `audit.gamification.events` | gamification |
| `audit.billing.events` | billing |
| `audit.payment.events` | payment |
| `audit.assessment.events` | assessment |

---

## Compliance Audit

All topics verified against `^[a-z]+\.[a-z_]+\.[a-z_]+$`:

- ✅ All 21 domain topics — **PASS**
- ✅ All 7 audit topics — **PASS**
- ✅ No topics use `_` as segment separator (only within segments)
- ✅ No topics omit the `<action>` segment

### Issues Fixed (G5)

| Before | After | File |
|--------|-------|------|
| `"learning.lesson.started"` (inline string) | `domain.TopicLessonStarted` (constant) | `learning/internal/service/learning_service.go` |
| `"learning.lesson.completed"` (inline string) | `domain.TopicLessonCompleted` (constant) | `learning/internal/service/learning_service.go` |
| `"learning.goal.set"` (inline string) | `domain.TopicGoalSet` (constant) | `learning/internal/service/learning_service.go` |

> **Note**: `assessment` service publishes `assessment.exercise.graded` and `assessment.submission.graded` — consumer (`progress-service`) references only `assessment.submission.graded`. Both topics are valid and documented above. G6 will add the outbox to assessment-service to make these durable.

---

## Adding New Topics

1. Add a typed constant to `<service>/internal/domain/events.go` (or `entities.go`)
2. Add the producer struct with `event_id uuid` field
3. Register the topic in this file
4. Ensure at least one consumer is documented (or label as `*(future)*`)
