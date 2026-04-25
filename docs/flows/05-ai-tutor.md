# Flow 05 — AI Tutor

> Text chat, Explain word, Create flashcard from chat, Conversation history. Voice tutor = Phase MVP1.5.
>
> **Services**: `ai-tutor` (Python), `llm-gateway` (Go), `entitlement`, `vocabulary`.
>
> **Luật**: `ai-tutor` **KHÔNG** gọi Claude/OpenAI trực tiếp. Mọi LLM call đi qua `llm-gateway` để quota, safety filter, PII redaction, caching.

---

## 1. Architecture

```
User (Browser)
  │
  ▼ Server Action chatAction
Next.js
  │
  ▼ GraphQL mutation tutorChat
web-bff
  │
  ├─► entitlement: checkFeature("ai_chat_tutor") — quota còn?
  │
  ▼ (nếu OK)
ai-tutor :3021
  │
  ├─ Build context:
  │    • user profile (language, level, goal)
  │    • last N messages từ conversation
  │    • system prompt (role, guardrails)
  │
  ▼ POST llm-gateway:3030/v1/chat/completions
llm-gateway
  │
  ├─ PII redact (email, phone, card number)
  ├─ Safety filter (pre-prompt scan)
  ├─ Quota check per user + per tenant
  ├─ Cache lookup (prompt hash → response)
  │
  ▼ POST api.anthropic.com (hoặc provider config)
Claude / OpenAI
  │
  ▼ Stream response
llm-gateway → ai-tutor → BFF → Next.js → UI (SSE hoặc chunk flush)
```

---

## 2. Chat flow

### 2.1. Start conversation

```
User ─► /ai-tutor
         │
         ├─ RSC: query conversations(limit: 20) {
         │    items { id, title, lastMessage, updatedAt }
         │  }
         │
         └─ Nếu chưa có → hiện welcome screen.
            Nếu có → load last conversation hoặc tạo new.
```

### 2.2. Send message

```
User gõ câu hỏi → submit
  ├─ mutation tutorChat(conversationId?, message, language)
  │
  ├─ BFF → entitlement.checkFeature("ai_chat_tutor")
  │    → { allowed: true, quotaRemaining: 42 }
  │
  ├─ BFF → ai-tutor:
  │    POST /chat { conversationId, userId, message, language, stream: true }
  │
  ├─ ai-tutor:
  │    1. Nếu conversationId null → INSERT conversations (id, user_id, title=null)
  │    2. INSERT messages (conv_id, role='user', content, created_at)
  │    3. Build context:
  │       - System prompt (role: language tutor, language: {language}, user level: B1)
  │       - Last 10 messages (sliding window)
  │       - User profile snippet
  │    4. POST llm-gateway:3030/v1/chat/completions { model, messages, stream }
  │    5. Stream response chunks
  │    6. Aggregate → INSERT messages (role='assistant', content)
  │    7. Nếu title của conversation chưa có → sau assistant response, call llm-gateway
  │       lần 2 (cheap model) để sinh title 5 chữ
  │    8. → stream { conversationId, messageId, chunk } + final { quotaRemaining }
  │
  └─ UI: stream render typewriter; sau khi done → update quota hiện trong sidebar.
```

### 2.3. llm-gateway responsibilities

| Phase | Action |
|-------|--------|
| Pre | PII redact input (regex: email, phone, credit card, IBAN) |
| Pre | Safety filter: block prompts chứa (illegal / self-harm / adult) — return 403 `CONTENT_BLOCKED` |
| Pre | Quota: `per_user_per_day`, `per_tenant_per_month` (atomic Redis decr) |
| Pre | Cache: SHA256(model + messages) → Redis (TTL 1h) cho deterministic prompts |
| During | Proxy streaming chunks |
| Post | Token accounting: tokens_in, tokens_out → UPDATE `usage_daily` row |
| Post | Audit log: `audit.llm-gateway.events` (no payload, chỉ metadata) |
| Post | Cost tracking per model → billing reconciliation |

---

## 3. Explain word

Khác chat: single-shot, không giữ conversation.

```
User đang đọc/lesson → highlight word "afraid" → click icon
  ├─ mutation explain(text: "afraid", context: "She was afraid of the dog.", language: "en")
  │
  ├─ BFF → ai-tutor → llm-gateway:
  │    prompt template: "Explain '{text}' in context '{context}' for {level} learner"
  │    Return structured JSON:
  │    {
  │      meaning: "cảm thấy sợ",
  │      ipa: "/əˈfreɪd/",
  │      pos: "adjective",
  │      examples: ["She was afraid of the dog.", "Don't be afraid to ask."],
  │      synonyms: ["scared", "frightened"],
  │      tips: "Thường đi với 'of' (afraid of something)."
  │    }
  │
  ├─ UI: render popup / side panel với các field
  │
  └─ Nút "Thêm vào SRS" → mutation addCard(deckId, lemma, meaning, ipa, exampleSentence)
```

---

## 4. Create flashcard từ chat

```
Trong chat, user thấy assistant giới thiệu từ mới → hover → "Save as flashcard"
  ├─ Client extract từ context (assistant response có thể có format)
  ├─ mutation addCardFromChat(messageId, deckId?)
  │    BFF → ai-tutor:
  │      1. Load message
  │      2. Extract word, meaning, example (dùng llm-gateway 1 lần cheap call)
  │      3. Nếu deckId null → tìm deck mặc định (language phù hợp) hoặc tạo mới
  │      4. Call vocabulary.addCard
  │      → { cardId, deckId }
  │
  └─ UI: toast "Đã thêm vào deck X"
```

---

## 5. Conversation history

### 5.1. List conversations

```
query conversations(cursor, limit) → {
  items: [{
    id, title, preview, messageCount, updatedAt, pinned
  }],
  nextCursor
}
```

### 5.2. Load messages

```
query conversation(id) {
  id, title, createdAt,
  messages { id, role, content, createdAt, tokens }
}
```

### 5.3. Rename / pin / delete

```
mutation renameConversation(id, title)
mutation pinConversation(id, pinned: true)
mutation deleteConversation(id)
```

---

## 6. Voice Tutor (MVP1.5 — stub trong MVP1)

MVP1 chỉ hiện UI "Voice tutor (Sắp ra mắt)" disabled. Luồng chi tiết:

```
User click "Voice" → upgrade check nếu free tier
  ├─ WebRTC browser ↔ speech-ai:3022 (voice gateway)
  │
  ├─ speech-ai:
  │    1. Receive audio stream (16kHz, 20ms frames)
  │    2. VAD (voice activity detection) → detect utterance
  │    3. STT streaming (Whisper / Deepgram) → text chunks
  │    4. Send to ai-tutor (SSE / WS) with conversationId
  │
  ├─ ai-tutor → llm-gateway → Claude (streaming)
  │
  ├─ ai-tutor → speech-ai TTS (ElevenLabs / Azure):
  │    Chunk-by-chunk synthesize → audio stream back to browser
  │
  └─ Browser playback via Web Audio API.

Latency target E2E: < 800ms (first audio byte).
```

---

## 7. BFF Schema

```graphql
extend type Query {
  conversations(cursor: String, limit: Int = 20, pinnedFirst: Boolean = true): ConversationPage!
  conversation(id: ID!): Conversation!
}

type ConversationPage {
  items: [ConversationSummary!]!
  nextCursor: String
}

type ConversationSummary {
  id: ID!
  title: String
  preview: String!
  messageCount: Int!
  updatedAt: DateTime!
  pinned: Boolean!
}

type Conversation {
  id: ID!
  title: String
  messages: [Message!]!
  createdAt: DateTime!
}

type Message {
  id: ID!
  role: String!    # "user" | "assistant" | "system"
  content: String!
  createdAt: DateTime!
  tokens: Int
}

extend type Mutation {
  tutorChat(
    conversationId: ID
    message: String!
    language: String!
  ): ChatResponse!       # streamable; hoặc non-stream return full

  explain(
    text: String!
    context: String
    language: String!
  ): Explanation!

  addCardFromChat(messageId: ID!, deckId: ID): Card!
  renameConversation(id: ID!, title: String!): Conversation!
  pinConversation(id: ID!, pinned: Boolean!): Conversation!
  deleteConversation(id: ID!): Boolean!
}

type ChatResponse {
  conversationId: ID!
  messageId: ID!
  content: String!
  quotaRemaining: Int!
}

type Explanation {
  meaning: String!
  ipa: String
  pos: String
  examples: [String!]!
  synonyms: [String!]!
  antonyms: [String!]!
  tips: String
}
```

**Streaming consideration**: GraphQL Mercurius hỗ trợ `@defer` / subscription. MVP1 đơn giản hoá — non-stream response (block user trong 2-5s), MVP1.5 upgrade sang SSE endpoint ngoài GraphQL.

---

## 8. Entitlement matrix

| Plan | Messages/day | Explain/day | Voice tutor | Custom persona |
|------|--------------|-------------|-------------|----------------|
| Free | 10 | 20 | ❌ | ❌ |
| Plus | 100 | unlimited | 30 phút/ngày | ❌ |
| Pro | unlimited | unlimited | unlimited | ✅ |

Entitlement service:
- `ai_chat_tutor_daily` — decrement counter mỗi message.
- `ai_voice_tutor_minutes` — track time-based.
- Reset counter hàng ngày 00:00 UTC+7 (job cron).

---

## 9. Error handling

| Case | Response | UI |
|------|----------|----|
| Quota exceeded | 429 `QUOTA_EXCEEDED` { resetAt } | Modal "Bạn đã dùng hết lượt hôm nay. Upgrade Plus để dùng không giới hạn." |
| Content blocked | 403 `CONTENT_BLOCKED` { reason } | Toast tiếng Việt, không show LLM error raw |
| LLM provider timeout | 504 → retry 1 lần, nếu vẫn fail → 500 | "Xin lỗi, AI đang chậm. Thử lại?" |
| LLM response invalid JSON (explain) | ai-tutor retry 1 lần với stricter prompt | Nếu vẫn fail → fallback dictionary lookup |
| Abusive user (toxic input) | Flag + notify moderation | Sau 3 lần → lock AI feature 24h |

---

## 10. Events publish

| Topic | Khi nào | Consumer |
|-------|---------|----------|
| `ai-tutor.message.sent` | Mỗi user message | analytics, content (để mine FAQ) |
| `ai-tutor.quota.exceeded` | User hit quota | notification (upsell email) |
| `audit.ai-tutor.events` | Mọi conversation (không log body) | SIEM |

---

## 11. Observability

- Prometheus metrics từ `llm-gateway`:
  - `llm_requests_total{model, status}`
  - `llm_tokens_in_total`, `llm_tokens_out_total`
  - `llm_latency_seconds_bucket`
  - `llm_cache_hit_ratio`
- Alert: cost/hour > $X, latency p95 > 3s, quota error rate > 5%.
