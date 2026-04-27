# Database Schema Inventory (auto-audit 2026-04-25)

> Source of truth: `services/*/migrations/*.sql` (verified bằng grep).
> **Mục đích**: trước khi đề xuất thêm bảng/service mới, đối chiếu với file này để tránh duplicate.

---

## 1. Tổng quan 11 service có DB schema

| Service | Stack | Tables | Mục đích DB |
|---------|-------|--------|-------------|
| identity | Go + Postgres | 8 | Auth, user, session, OAuth, password reset |
| learning | Go + Postgres | 5 | Learning profile, path, lesson attempt, onboarding |
| vocabulary | Go + Postgres | 6 | **Word catalog (dictionary) + user decks/cards** |
| assessment | Go + Postgres | 3 | Exercise submission, test session, grading |
| progress | Go + Postgres | 4 | Skill scores, history, cert prediction, activity heatmap |
| gamification | Go + Postgres | 6 | XP, streak, achievement, league |
| billing | Go + Postgres | 5 | Plan catalog, subscription, invoice, coupon |
| payment | Go + Postgres | 4 | Payment intent, transaction, webhook event |
| entitlement | Go + Postgres | 2 | Plan-feature mapping, user entitlement |
| llm-gateway | Go + Postgres | 3 | LLM request log, daily budget, prompt template |
| srs | Rust + Postgres | 3 | FSRS state, review log, outbox |

**Outbox pattern**: 8/11 service có `outbox_events` (identity, learning, vocabulary, gamification, assessment, srs, billing có `idempotency_outbox`, payment có `payment_outbox`).

**MongoDB**: content-service (lessons, exercises, tracks, units — không phải PG, không trong file này).
**Redis**: identity (session), gamification (leaderboard ZSET), entitlement (cache), llm-gateway (response cache), notification (consumer state).

---

## 2. Tables chi tiết per service

### identity (8 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `users` | id, email, phone, password_hash, display_name, ui_language, timezone, status, email_verified, mfa_enabled | Account chính |
| `user_oauth_identities` | user_id, provider, provider_user_id | Google/Apple/FB link |
| `sessions` | id, user_id, refresh_token_hash, device_info, expires_at, revoked_at | Refresh token sessions |
| `roles` | id, name | RBAC roles (user/admin/teacher/...) |
| `user_roles` | user_id, role_id | Many-to-many |
| `email_verifications` | user_id, token_hash, expires_at | Verify email OTP |
| `password_reset_tokens` | user_id, token_hash, expires_at | Forgot/reset password |
| `outbox_events` | id, topic, key, payload | Kafka publish reliability |

### learning (5 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `user_learning_profiles` | user_id, primary_language, secondary_languages[], starting_level, **goals JSONB**, preferences, daily_goal_minutes, reminder_time, learning_languages | Hồ sơ học (after T2 move from identity) |
| `user_learning_paths` | id, user_id, language, path_template_id, current_unit_id, progress_pct | Track enrollment |
| `user_lesson_attempts` | user_id, lesson_id, lesson_version, path_id, started_at, completed_at, score, xp_earned, time_spent_sec | Mỗi lần làm lesson |
| `user_onboarding` | user_id, step, answers JSONB, placement_cefr, recommended_track_id, completed_at | T3 5-step state machine |
| `outbox_events` | — | Kafka |

**Note**: `goals JSONB` chứa array `[{type:"cert", cert:"ielts", target:"7.0"}, {type:"daily", minutes:15}]`. `certGoal` extract từ `goals.find(t==="cert").cert` (dùng cho G15).

### vocabulary (6 tables) ⚠️ **đã cover dictionary use case**
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| **`words`** | id, **language, lemma, pos, ipa, frequency_rank, level, extra JSONB**, UNIQUE(language,lemma,pos) | **Catalog từ vựng public** — dictionary entries |
| **`word_meanings`** | word_id, **ui_language, meaning, order_idx** | Translations đa ngôn ngữ |
| **`word_examples`** | word_id, sentence, **translation JSONB**, audio_url | Example sentences |
| `decks` | id, user_id, name, language | User-owned deck |
| `user_cards` | id, deck_id, word_id, srs_state | User card trong deck |
| `outbox_events` | — | Kafka |

**Indexes**: `gin_trgm_ops (lemma)` fuzzy, `(language, frequency_rank)` ranked, `(language, level)` filter.

**Implication**: KHÔNG cần `dictionary-service` riêng. JMdict/CEDICT/viWiktionary import vào `words` + `word_meanings` (xem [dictionary-import-plan](./dictionary-import-plan.md)).

### assessment (3 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `submissions` | id, user_id, exercise_id, exercise_type, answer JSONB, score, correct, skill_tag, language | Mỗi lần submit exercise |
| `test_sessions` | id, user_id, test_id, status, answers JSONB, total_score, skill_scores JSONB | Mock test session |
| `outbox_events` | — | Kafka |

### progress (4 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `skill_scores` | user_id, language, skill, score, ci_low, ci_high | EMA skill score (L/R/W/S/Vocab/Grammar) |
| `skill_score_history` | user_id, language, skill, score, delta, event_ref | Time series |
| `cert_predictions` | user_id, cert_code, predicted_score, predicted_band, model_version | TOEIC/IELTS/HSK predict |
| `user_activity_daily` | user_id, date, minutes, xp, lessons_completed | Heatmap 365d |

### gamification (6 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `user_xp` | user_id, total_xp, level | XP tracker |
| `user_streaks` | user_id, current, longest, last_active_date, freezes_left | Streak counter |
| `achievements` | code, name, description, icon, xp_reward, criteria JSONB | Catalog 200+ badge |
| `user_achievements` | user_id, achievement_code, earned_at | Unlocked records |
| `league_history` | user_id, week_start, league, rank, xp, promoted | Bronze→Diamond league |
| `outbox_events` | — | Kafka |

**Note**: leaderboard realtime dùng Redis ZSET, table này chỉ snapshot weekly.

### billing (5 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `plans` | code, name, tier, price_cents, currency, interval, features JSONB | Pricing catalog |
| `subscriptions` | id, user_id, plan_code, status, provider, current_period_start/end, trial_end, cancel_at_period_end | Sub lifecycle |
| `invoices` | id, user_id, subscription_id, amount_cents, currency, status, paid_at | Billing history |
| `coupons` | code, discount_pct/cents, max_uses, plan_codes[] | Promo |
| `outbox_events` (`idempotency_outbox`) | — | Kafka + Stripe webhook idempotency |

### payment (4 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `payment_intents` | id, user_id, plan_code, provider, provider_session_id, amount_cents, status, return_url | Checkout session ref |
| `payment_transactions` | id, payment_intent_id, provider_charge_id, status, refund_id, failure_code | Charge records |
| `webhook_events` | id (provider event_id, unique idempotent), provider, event_type, payload, status | Stripe/VNPay webhook receipt |
| `payment_outbox` | — | Kafka relay (UUID + status enum schema, khác `outbox_events` của các service kia) |

### entitlement (2 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `plan_features` | feature_code (UNIQUE), description, min_tier, quota_map JSONB | Catalog tính năng |
| `user_entitlements` | user_id PK, plan_tier, valid_until, family_owner_id, org_id, overrides JSONB | Cache "user X dùng được feature Y?" |

### llm-gateway (3 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `llm_request_logs` | id, request_id, user_id, caller_service, provider, model, prompt_tokens, output_tokens, cost_usd, cache_hit, latency_ms | Audit + cost tracking |
| `daily_budgets` | user_id, date, tokens_used, tokens_limit | Per-user rate limit |
| `prompt_templates` | id, name (UNIQUE), template, model | Versioned prompt registry |

### srs (3 tables)
| Table | Cột chính | Mục đích |
|-------|-----------|---------|
| `srs_states` | user_id, item_id, stability, difficulty, last_reviewed, due_at | FSRS state per card |
| `srs_reviews` | user_id, item_id, rating, reviewed_at, prev_stability, new_stability | History log |
| `outbox_events` | — | Kafka |

---

## 3. Mapping doc 04 spec → implementation thực tế

| Doc 04 § | Spec | Reality |
|---------|------|---------|
| §1 identity | Auth + RBAC | ✅ Đúng |
| §2 learning | Learning orchestration | ✅ Đúng + kèm onboarding state (T3) + preferences (T2 move from identity) |
| §3 content | Mongo, không có PG | ✅ Mongo content-service (không trong file này) |
| §4 vocabulary | Words + decks | ✅ + đã cover dictionary catalog → **không tách dictionary-service** cho MVP1 |
| §6 srs | Rust + PG | ✅ |
| §7 assessment | Grading | ✅ + placement test (T4 trong service) |
| §8 progress | Skill score + ClickHouse | ⚠️ PG only, ClickHouse defer |
| §9 gamification | XP + Redis leaderboard | ✅ |
| §14 billing | Subscription + invoice | ✅ |
| §15 payment | Provider adapter | ✅ |
| §16 entitlement | Feature access | ✅ |
| §22 llm-gateway | LLM proxy + budget | ✅ |
| §17 notification | Push/email | ⚠️ Skeleton, chưa có PG (consumer-only Node TS, dùng Redis state) |
| **§24 dictionary** | **Riêng, Python + PG** | ❌ **Defer Phase 2** — vocabulary đã cover (decision 2026-04-25) |
| §18-21,23-27 | search, AI tutor, writing-ai, media, dict, moderation, proctoring, video | ❌ Phase 1.5/2 |

---

## 4. 4 nguyên tắc tôi sẽ tự áp dụng từ giờ

1. **Trước khi đề xuất bảng mới**: grep `services/*/migrations/*.sql` xem đã có bảng tương tự chưa. Đối chiếu với file này.
2. **Trước khi đề xuất service mới**: đọc lại file này §1 + check doc 04 nói có nên tách không. Default: gộp vào service hiện có nếu schema overlap > 70%.
3. **Trước khi propose architecture**: state assumption explicitly. Nếu không chắc vocabulary có table words không → grep, không assume.
4. **Mỗi sprint update file này**: khi có migration mới, cập nhật bảng tương ứng. File phải là source of truth cho mental model.

---

## 5. Re-audit checklist (run mỗi 2 tuần)

```bash
# 1. Verify file count matches
find services -name "*.sql" -path "*/migrations/*" | wc -l

# 2. List tables per service
for svc in services/*/; do
  name=$(basename "$svc")
  tables=$(grep -h "CREATE TABLE" "$svc"migrations/*.sql 2>/dev/null \
    | grep -oE "[a-z_]+\s*\($" | tr -d '(' | sort -u | tr '\n' ',')
  printf "%-15s %s\n" "$name:" "${tables%,}"
done

# 3. Diff với file này, update nếu lệch
```
