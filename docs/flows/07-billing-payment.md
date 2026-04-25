# Flow 07 — Billing & Payment

> Pricing, Checkout, Provider webhook (Stripe / VNPay / MoMo / ZaloPay / Apple IAP / Google Play), Entitlement upgrade, Cancel, Invoice, Trial.
>
> **Services**: `billing` (Go, outbox ✅), `payment` (Go, outbox ✅), `entitlement` (Kafka consumer).
>
> **Luật bất biến**:
> - `payment` là **duy nhất** service gọi provider SDK. `billing` không biết Stripe là gì.
> - Mọi payment state change qua **outbox** → Kafka.
> - `entitlement` là **duy nhất** service quyết định "user được feature gì".

---

## 1. Service split

```
┌─────────────────────────────────────────────────────┐
│                  billing :3010                      │
│  - Plans (free / plus / pro)                        │
│  - Subscriptions (active / trialing / canceled)     │
│  - Invoices + idempotency                           │
│  - Pro-rated calculations                           │
└──────────────┬──────────────────────────────────────┘
               │ sync REST (create session)
               ▼
┌─────────────────────────────────────────────────────┐
│                  payment :3011                      │
│  - Provider abstraction (Stripe/VNPay/MoMo/Apple)   │
│  - 3DS flow                                         │
│  - Webhook handler                                  │
│  - Refunds                                          │
└──────────────┬──────────────────────────────────────┘
               │ HTTPS
               ▼
          Provider (Stripe, ...)
               │
               ▼ webhook
          payment (verify signature)
               │ outbox + Kafka
               ▼
          payment.succeeded / payment.failed
               │
               ├─► billing: update subscription, emit billing.subscription.activated
               │
               └─► entitlement: upgrade plan_tier + features
```

---

## 2. Pricing page

### Public `/pricing`

```
RSC: query pricingPlans(currency: "VND", country: "VN") → [Plan!]!

BFF → billing-service:
  GET /billing/plans?currency=VND&country=VN
    → [
        { id: "free", name: "Free", price: 0, features: [...] },
        { id: "plus", name: "Plus", price: 199000, period: "month", features: [...] },
        { id: "pro", name: "Pro", price: 399000, period: "month", features: [...] }
      ]
```

### Currency & regional pricing

- billing stores price trong `plan_prices(plan_id, currency, country, amount_minor)`.
- MVP1: VND + USD. MVP1.5: thêm 10 currency chính.
- GeoIP detect country ở edge (CloudFlare header) → pass vào query.

---

## 3. Checkout flow

### 3.1. Click "Upgrade to Plus"

```
User (authenticated) → /checkout?plan=plus&period=month&provider=stripe
  │
  ├─ RSC server action checkoutAction:
  │    mutation createCheckoutSession(planId, period, provider, successUrl, cancelUrl)
  │
  ├─ BFF → billing-service:
  │    POST /billing/checkout {
  │      userId, planId, period, currency, country, provider
  │    }
  │
  ├─ billing:
  │    1. BEGIN TX
  │    2. INSERT checkout_sessions (id, user_id, plan_id, ...)
  │    3. POST payment:3011/payment/sessions {
  │         checkoutSessionId, amount, currency, provider,
  │         successUrl, cancelUrl, metadata: { userId, planId }
  │       }
  │    4. payment returns { providerSessionId, redirectUrl }
  │    5. UPDATE checkout_sessions SET provider_session_id=?, redirect_url=?
  │    6. COMMIT
  │    → { checkoutUrl }
  │
  └─ Next.js: redirect user → checkoutUrl (Stripe hosted page / VNPay gateway)
```

### 3.2. User completes payment

```
User pays on Stripe page
  ├─ Stripe redirects user → /checkout/success?session_id=...
  │
  ├─ /checkout/success (RSC):
  │    query checkoutStatus(sessionId) {
  │      state: "pending" | "succeeded" | "failed"
  │      plan, activatedAt
  │    }
  │    (polling mỗi 1s, max 10s — chờ webhook process)
  │
  └─ UI:
    - succeeded → "🎉 Bạn đã là Plus!" + CTA back to dashboard
    - pending → spinner "Đang xử lý thanh toán..."
    - failed → lỗi + retry
```

### 3.3. Provider webhook (authoritative)

```
Stripe POST /payment/webhook/stripe
  ├─ payment:
  │    1. Verify signature (Stripe-Signature header + secret)
  │    2. Parse event: checkout.session.completed / invoice.paid / ...
  │    3. Idempotency: check (provider, event_id) trong `webhook_events` table,
  │       nếu đã process → 200 ngay.
  │    4. BEGIN TX
  │    5. INSERT webhook_events (provider, event_id, payload)
  │    6. UPDATE payment_sessions SET state='succeeded', paid_at=NOW()
  │    7. INSERT outbox: payment.succeeded {
  │         userId, planId, amount, currency, sessionId, providerRef
  │       }
  │    8. COMMIT
  │    → 200 Stripe
  │
  ├─ outbox relay → Kafka publish `payment.succeeded`
  │
  ├─ Kafka consumers:
  │
  │  billing consume payment.succeeded:
  │    1. BEGIN TX
  │    2. UPDATE checkout_sessions SET state='succeeded'
  │    3. INSERT subscriptions (
  │         user_id, plan_id, state='active',
  │         current_period_start, current_period_end, auto_renew
  │       )
  │    4. INSERT invoices (subscription_id, amount, paid_at, ...)
  │    5. INSERT outbox: billing.subscription.activated { userId, planId, ... }
  │    6. INSERT outbox: billing.invoice.paid { ... }
  │    7. COMMIT
  │
  │  entitlement consume billing.subscription.activated:
  │    1. UPSERT user_entitlements (user_id, plan_tier='plus')
  │    2. Load plan_features → upsert user_features
  │    3. INSERT entitlement_audit_log
  │
  │  notification consume billing.invoice.paid:
  │    → send email "Hoá đơn thanh toán" với invoice PDF link
```

---

## 4. Event contracts

### `payment.succeeded`

```json
{
  "eventId": "uuid",
  "userId": "uuid",
  "planId": "plus_monthly",
  "checkoutSessionId": "uuid",
  "amount": 199000,
  "currency": "VND",
  "provider": "stripe",
  "providerRef": "cs_live_xxx",
  "paidAt": "2026-04-19T10:00:00Z"
}
```

### `payment.failed`

```json
{
  "eventId": "uuid",
  "userId": "uuid",
  "checkoutSessionId": "uuid",
  "reason": "card_declined",
  "providerErrorCode": "insufficient_funds"
}
```

### `billing.subscription.activated`

```json
{
  "eventId": "uuid",
  "userId": "uuid",
  "subscriptionId": "uuid",
  "planId": "plus_monthly",
  "planTier": "plus",
  "features": ["ai_chat_tutor_unlimited", "mock_test", "voice_tutor"],
  "periodStart": "2026-04-19T00:00:00Z",
  "periodEnd": "2026-05-19T00:00:00Z"
}
```

**⚠️ Bug hiện tại**: billing code publish `billing.subscription.created` nhưng entitlement consumer nghe `billing.subscription.activated`. Phải thống nhất — đề xuất đổi publisher → `activated` để rõ ý nghĩa (subscription active, dùng được ngay).

### `billing.subscription.canceled` (spelling US)

```json
{
  "eventId": "uuid",
  "userId": "uuid",
  "subscriptionId": "uuid",
  "canceledAt": "...",
  "effectiveEndDate": "...",
  "reason": "user_requested"
}
```

**⚠️ Bug**: entitlement consume `billing.subscription.cancelled` (UK). Thống nhất US → `canceled`.

### `billing.invoice.paid`

```json
{
  "eventId": "uuid",
  "userId": "uuid",
  "invoiceId": "uuid",
  "amount": 199000,
  "currency": "VND",
  "pdfUrl": "https://...",
  "paidAt": "..."
}
```

---

## 5. Trial flow

```
User upgrade Plus → chọn "14-day free trial"
  ├─ billing:
  │    INSERT subscriptions (state='trialing', trial_ends_at=NOW()+14d, ...)
  │    INSERT outbox: billing.trial.started
  │
  ├─ entitlement consume billing.trial.started:
  │    → upgrade plan_tier='plus' (như active)
  │
  ├─ Cron daily scan trong billing:
  │    SELECT subscriptions WHERE state='trialing'
  │      AND trial_ends_at BETWEEN NOW()+2d AND NOW()+3d
  │    → INSERT outbox: billing.trial.ending
  │
  ├─ notification consume billing.trial.ending:
  │    → send email "Trial sắp hết, thanh toán để tiếp tục" + button billing portal
  │
  └─ Khi trial_ends_at đến:
     - Nếu auto_renew=true AND có payment method → gọi payment → charge
     - Nếu fail hoặc không có method:
         state='past_due' grace 7 ngày → state='canceled'
         Emit billing.subscription.canceled
         Entitlement downgrade → plan_tier='free'
```

---

## 6. Cancel subscription

```
User vào /settings/billing → "Cancel subscription"
  ├─ Modal confirm + survey lý do
  ├─ mutation cancelSubscription(reason)
  │    BFF → billing:
  │      UPDATE subscriptions SET
  │        cancel_at_period_end=true,
  │        cancellation_reason=reason
  │      -- KHÔNG xoá ngay; user vẫn dùng đến hết period đã trả tiền
  │      → { effectiveEndDate }
  │
  └─ UI: "Bạn vẫn là Plus đến DD/MM/YYYY. Sau đó về Free."
```

Khi period kết thúc:
- Cron scan: `WHERE cancel_at_period_end=true AND current_period_end < NOW()`
- UPDATE state='canceled' → emit outbox `billing.subscription.canceled`
- entitlement downgrade.

**Reactivate trước khi period end:**
```
mutation reactivateSubscription → UPDATE cancel_at_period_end=false
```

---

## 7. Payment failed flow

```
Stripe webhook: invoice.payment_failed
  ├─ payment:
  │    outbox: payment.failed + billing.payment.failed
  │
  ├─ billing consume payment.failed:
  │    UPDATE subscriptions SET state='past_due', retry_count=retry_count+1
  │    Schedule retry: +1d, +3d, +7d (Stripe auto retry)
  │    Nếu sau 7d vẫn fail → UPDATE state='canceled' → emit canceled event
  │
  ├─ entitlement consume billing.payment.failed:
  │    → NOT downgrade ngay; giữ plan tier với `grace_period_ends_at=NOW()+7d`
  │
  └─ notification consume billing.payment.failed:
     → send email "Thanh toán thất bại, cập nhật thẻ" + link billing portal
```

---

## 8. BFF Schema

```graphql
extend type Query {
  pricingPlans(currency: String, country: String): [Plan!]!
  myEntitlements: Entitlement!                        # ✅ đã có
  mySubscription: Subscription
  billingHistory(cursor: String, limit: Int): InvoicePage!
  checkoutStatus(sessionId: ID!): CheckoutStatus!
}

type Plan {
  id: ID!
  name: String!
  tier: String!          # free | plus | pro
  price: Int!            # minor units (cents/đồng)
  currency: String!
  period: String!        # month | year
  features: [String!]!
  popular: Boolean!
}

type Subscription {
  id: ID!
  planId: ID!
  planName: String!
  state: String!         # trialing | active | past_due | canceled
  currentPeriodStart: DateTime!
  currentPeriodEnd: DateTime!
  cancelAtPeriodEnd: Boolean!
  trialEndsAt: DateTime
}

type Invoice {
  id: ID!
  amount: Int!
  currency: String!
  paidAt: DateTime
  pdfUrl: String
  description: String!
}

type InvoicePage {
  items: [Invoice!]!
  nextCursor: String
}

type CheckoutStatus {
  sessionId: ID!
  state: String!      # pending | succeeded | failed
  planId: ID
  activatedAt: DateTime
  errorMessage: String
}

extend type Mutation {
  createCheckoutSession(
    planId: ID!
    period: String!
    provider: String!
    successUrl: String!
    cancelUrl: String!
  ): CheckoutSessionResult!

  cancelSubscription(reason: String): Subscription!
  reactivateSubscription: Subscription!
  updatePaymentMethod: BillingPortalLink!
}

type CheckoutSessionResult {
  sessionId: ID!
  checkoutUrl: String!
}

type BillingPortalLink {
  url: String!
  expiresAt: DateTime!
}
```

---

## 9. Pages liên quan

| Page | Status | Flow |
|------|--------|------|
| /pricing (public) | ⚠️ UI có, data static | §2 |
| /checkout | 🔴 CẦN TẠO | §3.1 |
| /checkout/success | 🔴 CẦN TẠO | §3.2 |
| /checkout/cancel | 🔴 CẦN TẠO | User cancel giữa chừng → back to pricing |
| /checkout/3ds-callback | 🔴 CẦN TẠO | 3DS flow return |
| /settings/billing | 🔴 Sub-page chưa có | §6, §8 |
| /settings/subscription | 🔴 | Cancel/reactivate |
| /shop | ⚠️ UI có | Gems, power-ups (extend billing + gamification) |

---

## 10. Shop (gems / power-ups / boost)

Không phải subscription — one-time purchase. Pattern giống checkout nhưng:

```
mutation purchaseGems(packId)
  BFF → billing → payment → provider session →
    payment.succeeded → billing.gems.granted → gamification: add_gems
```

Events:
- `billing.gems.purchased { userId, gems, amount }`
- `gamification.gems.credited { userId, gems }`

---

## 11. Refund flow (customer support tool)

Không expose user; chỉ admin panel Phase 2.

```
Admin POST /payment/refund/:paymentId { amount, reason }
  ├─ payment: call provider refund API
  ├─ outbox: payment.refunded
  └─ billing consume: UPDATE invoices SET refunded_amount=... Emit billing.invoice.refunded.
```

---

## 12. Compliance & security

- PCI-DSS: NEVER store raw card number trong DB. Chỉ lưu `provider_token` (Stripe customer_id + payment_method_id).
- 3DS (SCA) required cho EU/UK transactions ≥ €30.
- Webhook signature verify với constant-time compare.
- Idempotency keys trên mọi mutation (từ UI).
- Rate limit checkout creation (5 sessions/user/hour).

---

## 13. Entitlement table (source of truth feature gating)

```
plan_tier = free | plus | pro

features:
  ai_chat_tutor_daily: free=10 / plus=100 / pro=unlimited
  ai_voice_tutor_minutes: free=0 / plus=30 / pro=unlimited
  mock_test_monthly: free=0 / plus=5 / pro=unlimited
  srs_daily_limit: free=100 / plus=unlimited / pro=unlimited
  offline_mode: free=false / plus=true / pro=true
  advanced_analytics: free=false / plus=false / pro=true
  writing_grading_daily: free=1 / plus=10 / pro=unlimited
  tutor_discount_percent: free=0 / plus=10 / pro=20
```

BFF `checkFeature(code)` → entitlement trả về `{ allowed, quotaRemaining, resetAt }`.
