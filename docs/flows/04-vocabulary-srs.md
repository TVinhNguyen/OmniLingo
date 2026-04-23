# Flow 04 — Vocabulary & SRS Review

> Deck CRUD, Card add/edit/delete, Anki import, SRS scheduling (FSRS v5), Review session với rating.
>
> **Services**: `vocabulary` (Go), `srs` (Rust), `dictionary` (Phase MVP1.5 — lookup IPA/meaning), `gamification`, `progress`.

---

## 1. Deck lifecycle

### 1.1. Tạo deck

```
/practice/vocabulary → click "Tạo deck"
  ├─ Form: name, language, description, icon
  ├─ mutation createDeck(name, language)
  │    BFF → vocabulary-service:
  │      1. INSERT decks (id, user_id, name, language, created_at)
  │      2. Emit vocabulary.deck.created
  │      → { deckId, name, cardCount: 0 }
  │
  └─ UI: optimistic add vào myDecks, navigate /practice/vocabulary/decks/[id]
```

### 1.2. Xem deck detail

```
/practice/vocabulary/decks/[id] (RSC)
  ├─ query deck(id) {
  │    id, name, language, cardCount, dueCount, newCount, masteredCount
  │  }
  │  BFF composes:
  │    • vocabulary.getDeck(id) — metadata + cards count
  │    • srs.getDeckStats(deckId) — dueCount, newCount
  │
  ├─ query deckCards(deckId, cursor, limit) {
  │    items { id, lemma, meaning, ipa, pos, audioUrl, srsState }
  │    nextCursor
  │  }
  │
  └─ Render header + action buttons (Bắt đầu học / Ôn tập / Thêm từ / Import) + bảng cards
```

### 1.3. Thêm 1 card (single-word)

```
Form nhập `lemma` + language code
  ├─ mutation addCardByLemma(deckId, lemma, language)
  │    BFF → vocabulary-service:
  │      1. Kiểm tra dictionary (Phase MVP1.5): GET dictionary/lookup?word=...
  │         → { meaning, ipa, pos, audioUrl } (hoặc null nếu không có)
  │      2. Nếu không có trong dictionary:
  │         • MVP1: vẫn tạo card với meaning="(chưa có)", user tự sửa sau.
  │         • Or → gọi llm-gateway để sinh meaning (feature toggle `auto_fill_meaning`).
  │      3. INSERT cards (id, deck_id, lemma, meaning, ipa, pos, audio_url)
  │      4. UPDATE decks SET card_count=card_count+1
  │      5. Emit vocabulary.card.added {
  │           userId, deckId, cardId, lemma, language
  │         }
  │      → card object
  │
  └─ UI: insert vào bảng
```

### 1.4. Thêm nhiều card (bulk)

```
UI tab "Thêm nhiều": textarea (1 từ / dòng) hoặc CSV paste
  ├─ mutation addCardsBulk(deckId, lemmas: [String!])
  │    Service:
  │      1. Parallel lookup (batch) → dictionary/batch { words: [...] }
  │      2. INSERT cards batch
  │      3. UPDATE deck count
  │      4. Emit vocabulary.card.added per lemma (hoặc 1 event aggregate)
  │      → { added: 18, missing: ["xyz", "abc"], duplicates: [] }
```

### 1.5. Edit / Delete card

```
mutation updateCard(cardId, { meaning?, ipa?, notes? })
mutation deleteCard(cardId) → Emit vocabulary.card.removed
```

### 1.6. Import Anki (.apkg)

```
UI /practice/vocabulary/decks/[id]/import
  ├─ File upload (.apkg, max 50MB) → Next.js server action
  │    → media-service presigned PUT URL (hoặc multipart to BFF)
  │    → mutation importAnki(deckId, fileUrl)
  │
  ├─ vocabulary-service:
  │    1. Download file from S3
  │    2. Unzip, parse SQLite collection.anki2
  │    3. Extract cards (front, back, audio, image)
  │    4. Batch INSERT cards
  │    5. Emit vocabulary.import.completed { deckId, added, skipped }
  │
  └─ UI: progress bar (poll query importStatus(jobId) mỗi 2s)
         hoặc WS subscription → khi done → reload danh sách
```

---

## 2. SRS scheduling (FSRS v5)

### 2.1. Khi nào card được schedule

| Event | Action |
|-------|--------|
| `vocabulary.card.added` (consume) | srs: INSERT srs_items (user_id, card_id, state='new', due_at=NOW()) |
| `learning.lesson.completed` with vocabularyLearned[] | srs: batch INSERT srs_items từ lesson |
| `srs.card.reviewed` (self) | srs: UPDATE stability, difficulty, due_at theo FSRS |

### 2.2. FSRS core

```
state ∈ {New, Learning, Review, Relearning}
variables: stability (S), difficulty (D)
rating: 1=Again, 2=Hard, 3=Good, 4=Easy

Next due_at = now + interval(S)
  where interval = f(S, rating, retention_target=0.9)
```

Algorithm chi tiết: dùng crate `fsrs` hoặc port từ open-spaced-repetition/go-fsrs.

---

## 3. Review session flow

### 3.1. Start review

```
/practice/vocabulary/decks/[id] → click "Ôn tập (N thẻ)"
  ├─ Navigate /practice/vocabulary/decks/[id]/review
  │
  ├─ RSC: query dueCards(deckId, limit: 20) {
  │    items { id, lemma, meaning, ipa, pos, audioUrl, srsState }
  │  }
  │  BFF → srs-service:
  │    SELECT srs_items WHERE user_id=? AND deck_id=?
  │      AND due_at <= NOW()
  │    ORDER BY due_at
  │    LIMIT 20
  │  Hydrate card content từ vocabulary.getCards(cardIds) (DataLoader batched)
  │
  └─ Render review UI: card.front (lemma)
```

### 3.2. Review 1 card

```
User thấy lemma → bấm Space (hoặc "Hiện đáp án")
  ↓
UI reveal meaning + IPA + example
  ↓
User rate [1] Again, [2] Hard, [3] Good, [4] Easy (keyboard shortcut)
  ↓
mutation reviewCard(cardId, rating) với optimistic next card
  ↓
BFF → srs-service:
  1. SELECT srs_item → current S, D, last_reviewed
  2. FSRS compute → new S, D, interval, due_at
  3. UPDATE srs_items SET state='review', ...
  4. INSERT srs_reviews (item_id, rating, reviewed_at, elapsed_ms)
  5. Publish srs.review.completed {
       userId, deckId, cardId, rating, newState, nextDueAt
     }
  → { nextDueAt, intervalDays }
```

### 3.3. Kafka fan-out sau `srs.review.completed`

| Consumer | Hành động |
|----------|-----------|
| **progress** | Update `words_mastered` (nếu rating ≥ 3 và state mới = review với stability > threshold); update `reviews_count_today` |
| **gamification** | Cấp XP per review: Again=+1, Hard=+2, Good=+3, Easy=+4; publish `gamification.xp.awarded` |
| **vocabulary** | (Optional) Update `last_reviewed_at` trên card row để UI highlight |

### 3.4. End of session

```
Hết 20 cards hoặc user click "Dừng"
  ├─ UI summary: {
  │    reviewed: 20,
  │    correctRate: 85%,
  │    xpEarned: 56,
  │    streakContribution: true
  │  }
  │
  ├─ mutation finishReviewSession(sessionId)
  │    → { xpEarned, newStreak, newBadges }
  │
  └─ Navigate back /practice/vocabulary/decks/[id]
```

---

## 4. Learn Mode (3-stage introduction)

Khác review: dành cho card mới (`state='new'`), 3 stage:

### Stage 1: Làm quen
```
Show lemma + meaning + audio + example.
Next button — không có rating, không update SRS.
```

### Stage 2: Nhận diện
```
Show lemma, 4 options (1 đúng + 3 nhiễu từ cùng deck).
User click đúng → ✓, sai → show answer + hiện "Nghe + ghi nhớ" lại.
Accuracy > 75% trên 4/5 câu → pass stage.
```

### Stage 3: Ghi nhớ
```
Show meaning, user type lemma (typing, fuzzy match với tolerance).
User type đúng → card chuyển sang state='learning', srs schedule lần đầu.
User type sai 2 lần → back to stage 2.
```

### Sequence

```
/practice/vocabulary/decks/[id]/learn
  ├─ query newCards(deckId, limit: 10) — state='new' only
  │
  ├─ per-card: run 3-stage client-side state machine
  │
  └─ Sau stage 3 pass:
      mutation completeLearnCard(cardId)
      → srs: UPDATE state='learning', due_at=NOW()+10m
```

---

## 5. BFF Schema (additions cho vocabulary + srs)

```graphql
type Card {
  id: ID!
  deckId: ID!
  lemma: String!
  meaning: String
  ipa: String
  pos: String
  audioUrl: String
  imageUrl: String
  exampleSentence: String
  notes: String
  srsState: SRSState
  createdAt: DateTime!
}

type SRSState {
  state: String!     # "new" | "learning" | "review" | "relearning"
  dueAt: DateTime
  stability: Float
  difficulty: Float
  intervalDays: Int
  lastReviewed: DateTime
  reviewsCount: Int!
  lapsesCount: Int!
}

type DeckDetail {
  id: ID!
  name: String!
  language: String!
  description: String
  iconEmoji: String
  cardCount: Int!
  newCount: Int!
  dueCount: Int!
  masteredCount: Int!
  createdAt: DateTime!
}

extend type Query {
  deck(id: ID!): DeckDetail!
  deckCards(deckId: ID!, cursor: String, limit: Int = 50): CardPage!
  dueCards(deckId: ID!, limit: Int = 20): [Card!]!
  newCards(deckId: ID!, limit: Int = 10): [Card!]!
  importStatus(jobId: ID!): ImportJobStatus!
}

type CardPage {
  items: [Card!]!
  nextCursor: String
}

extend type Mutation {
  createDeck(name: String!, language: String!, description: String): DeckDetail!
  updateDeck(deckId: ID!, name: String, description: String): DeckDetail!
  deleteDeck(deckId: ID!): Boolean!

  addCard(
    deckId: ID!
    lemma: String!
    meaning: String
    ipa: String
    pos: String
    exampleSentence: String
  ): Card!
  addCardsBulk(deckId: ID!, lemmas: [String!]!): BulkAddResult!
  updateCard(cardId: ID!, input: UpdateCardInput!): Card!
  deleteCard(cardId: ID!): Boolean!

  importAnki(deckId: ID!, fileUrl: String!): ImportJobStatus!
  importCSV(deckId: ID!, fileUrl: String!): ImportJobStatus!

  reviewCard(cardId: ID!, rating: Int!): ReviewResult!
  completeLearnCard(cardId: ID!): Boolean!
  finishReviewSession(sessionId: ID!): ReviewSessionSummary!
}

type ReviewResult {
  nextDueAt: DateTime!
  intervalDays: Int!
  newState: String!
  xpEarned: Int!
}

type ReviewSessionSummary {
  reviewed: Int!
  correctRate: Float!
  xpEarned: Int!
  durationSeconds: Int!
}

type BulkAddResult {
  added: Int!
  missing: [String!]!
  duplicates: [String!]!
}

type ImportJobStatus {
  jobId: ID!
  state: String!    # queued | processing | done | failed
  added: Int
  skipped: Int
  errorMessage: String
}
```

---

## 6. Luồng keyboard shortcut (review session)

| Key | Action |
|-----|--------|
| `Space` | Reveal answer |
| `1` | Rate Again |
| `2` | Rate Hard |
| `3` | Rate Good |
| `4` | Rate Easy |
| `S` | Play audio |
| `U` | Undo last rating (rollback SRS update, xoá srs_reviews row cuối) |
| `Esc` | Pause session |

---

## 7. Offline support (MVP1.5 — optional)

- IndexedDB cache `dueCards` khi vào session.
- Review offline: queue ratings trong local store.
- Khi online → flush batch `reviewCardsBatch(cards: [...])`.
- Conflict resolution: server là source of truth; nếu card đã review trên device khác, reject local duplicate.

---

## 8. Edge cases

| Case | Xử lý |
|------|-------|
| Review card sau 6 tháng (lapsed) | FSRS tự xử lý, rating Again → state='relearning' |
| Delete deck khi user đang review | Review session invalidate, UI redirect |
| Import Anki file corrupt | Job → failed với errorMessage, cho phép retry |
| Duplicate lemma trong cùng deck | Bulk add: skip, count vào `duplicates[]` |
| Card không có audio | UI ẩn nút "Listen" hoặc dùng TTS browser làm fallback |
