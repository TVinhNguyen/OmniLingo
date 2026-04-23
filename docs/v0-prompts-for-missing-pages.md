---
title: Prompt v0.dev cho các trang còn thiếu trong version2/
date: 2026-04-19
purpose: Copy-paste lên v0.dev để tạo UI còn thiếu, **chưa tích hợp backend**
---

# Hướng dẫn sử dụng

1. Mỗi section dưới đây là **1 prompt hoàn chỉnh** — copy block Markdown (giữa dấu `---` đầu và cuối) rồi paste vào v0.dev.
2. v0 sẽ generate UI bằng Tailwind + shadcn/ui + lucide-react (khớp stack hiện tại trong `version2/`).
3. Sau khi v0 tạo xong, download zip → giải nén vào `version2/app/` đúng đường dẫn ghi trong prompt.
4. **KHÔNG** viết API call thật — để v0 dùng mock data theo shape ví dụ. Phần integrate backend làm sau theo [FRONTEND-BACKEND-STANDARDS.md](../FRONTEND-BACKEND-STANDARDS.md).

**Quy ước chung cho mọi prompt**:
- Stack: Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui + lucide-react + motion/react
- Route group: `(app)` nếu cần auth, `(auth)` cho flow auth, `(public)` cho marketing
- UI tone: tiếng Việt cho label/button, Inter font, rounded-2xl cards, soft shadow
- Mock data: inline array/object, 5–10 items để UI không trống
- Client component: `"use client"` khi cần state/event

---

# WAVE 1 — CHẶN MVP LAUNCH

## 1.1. `/practice/vocabulary/decks/[id]` — Deck detail (rebuild)

**Path**: `version2/app/(app)/practice/vocabulary/decks/[id]/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js App Router `/practice/vocabulary/decks/[id]` — chi tiết một deck flashcard.

Layout:
- Header: breadcrumb "Practice > Vocabulary > [Deck name]", avatar cờ ngôn ngữ, tên deck (font lớn), badge level (A1–C2), description 1 dòng, số card, visibility icon (private/public/shared)
- Action bar (sticky top):
  - Nút PRIMARY cực to "Bắt đầu học" (màu gradient primary, w-full trên mobile, w-64 trên desktop)
  - Nút secondary: `🎮 Game`, `📊 Stats`, `⚙️ Cài đặt`, `Chia sẻ`, `✏️ Chỉnh sửa`
- Stats grid (4 cards): #New (xanh), #Learning (vàng), #Due (đỏ), #Mastered (xanh lá). Mỗi card: con số to + label
- Heatmap calendar 90 ngày (grid 7×13, ô xanh đậm nhạt theo số card review ngày đó)
- Tabs: "Tất cả thẻ" / "Mới" / "Đang học" / "Đến hạn" / "Đã thuộc"
- Bảng thẻ: cột Lemma | IPA | Nghĩa | POS | Status badge | Action (edit/delete). Pagination 20/page
- Nút floating "+ Thêm thẻ" → modal form (lemma, IPA, meaning, POS dropdown, example, audio upload, image upload, tags)
- Nút "Import" → modal với tabs CSV / Anki (.apkg) / Quizlet URL / Paste text

Mock data:
- deck = { id, name: "IELTS Vocabulary 5000", language: "en", level: "B2", description: "...", cardCount: 487, visibility: "private" }
- cards = [{ id, lemma: "afraid", ipa: "/əˈfreɪd/", meaning: "sợ hãi", pos: "adj", status: "learning", nextReview: "2026-04-21" }, ...]

Behavior: nút "Bắt đầu học" link đến `/practice/vocabulary/decks/[id]/learn` nếu còn card mới, hoặc `/review` nếu chỉ còn due, hoặc show toast "Hết phần hôm nay 🎉"

Keyboard shortcut: phím `L` để start learn, `R` để start review, `N` để thêm thẻ mới
```

---

## 1.2. `/practice/vocabulary/decks/[id]/learn` — Learn Mode

**Path**: `version2/app/(app)/practice/vocabulary/decks/[id]/learn/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js `/practice/vocabulary/decks/[id]/learn` — chế độ học từ mới (Learn Mode).

Flow: 3 giai đoạn XOAY VÒNG trên 7 card/session
- Giai đoạn 1 "Làm quen": card hiển thị đồng thời Từ (font 5xl) + Phiên âm (IPA) + Nghĩa + nút phát âm + ví dụ câu. Chỉ có nút `Tiếp` → sang card tiếp theo
- Giai đoạn 2 "Nhận diện": hiển thị Từ ở đầu, 4 ô card chọn Nghĩa (chỉ 1 đúng). Click ô → nếu đúng: viền xanh + animation tick, sai: viền đỏ + show đáp án đúng sau 1s. Nút `Tiếp`
- Giai đoạn 3 "Ghi nhớ": hiển thị Nghĩa + IPA ở đầu, input text gõ Từ. Nút `Kiểm tra`. Sai: input rung + show đáp án, Đúng: confetti animation

Layout:
- Top: progress bar ngang (N/21 steps, vì 7 cards × 3 stages), X button thoát (confirm dialog "Tiến độ sẽ được lưu")
- Middle: card flashcard to giữa màn hình, bo tròn rounded-3xl
- Bottom: nút navigation to (primary full width trên mobile)
- Hotkeys: Space = flip/next, 1-4 cho MCQ

Mock data: 7 cards mẫu IELTS như afraid/terrified/anxious/nervous/scared/petrified/fearful

Full-screen mode, ẩn main nav (chỉ có thanh top của session)
```

---

## 1.3. `/practice/vocabulary/decks/[id]/review` — Review Session (SRS)

**Path**: `version2/app/(app)/practice/vocabulary/decks/[id]/review/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js `/practice/vocabulary/decks/[id]/review` — SRS Review Session với Focus Mode.

Layout:
- Full-screen, background gradient nhẹ, ẩn sidebar + main nav
- Top bar minimal: progress `12/45`, timer tổng (format `02:34`), nút X thoát, nút toggle Focus Mode
- GIỮA MÀN HÌNH: flashcard lớn (w-2xl, rounded-3xl, shadow lớn)
  - Mặt trước: chỉ hiển thị Từ (font-serif, text-7xl, căn giữa). Subtext nhỏ: "Bấm Space hoặc click để lật"
  - Sau khi flip (animation 3D flip 0.6s): hiển thị Từ nhỏ ở top + IPA + Audio icon (auto-play) + Nghĩa (text-3xl) + ví dụ câu (italic) + hình ảnh nếu có
- Dưới flashcard (chỉ show sau khi flip): 4 nút rating ngang
  - `[1] Lại` (ghost outline đỏ) — subtext "<1m"
  - `[2] Khó` (ghost outline cam) — subtext "6m"
  - `[3] Tốt` (ghost outline xanh) — subtext "10m"
  - `[4] Dễ` (ghost outline xanh đậm) — subtext "4d"
  - Mỗi nút to (h-16), icon + text + shortcut badge góc trên phải
- Góc trên phải card: nút icon `✏️ Quick Edit` + `🚩 Flag/Suspend`
- Kết thúc session: modal congrats XP earned + streak + nút `Xem lại` / `Kết thúc`

Keyboard:
- Space = flip
- 1/2/3/4 = rating
- E = quick edit
- F = flag
- Esc = thoát

Mock: 5 cards mẫu cho demo flow

CẢM GIÁC: Giống Anki + Duolingo lesson player, tối giản không distracting
```

---

## 1.4. `/practice/vocabulary/decks/[id]/add-card` — Add/Edit Card

**Path**: `version2/app/(app)/practice/vocabulary/decks/[id]/add-card/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js `/practice/vocabulary/decks/[id]/add-card` — form thêm/sửa thẻ flashcard đầy đủ.

Form fields (grouped trong Card):
- Section 1: "Thông tin chính"
  - Lemma (required, input text lớn)
  - IPA (input text, tooltip link IPA chart)
  - Nghĩa (textarea, 2 dòng)
  - POS (dropdown: noun/verb/adj/adv/prep/conj/interj)
- Section 2: "Ví dụ & Ngữ cảnh"
  - Example sentence (textarea)
  - Example translation (textarea)
  - Collocations (multi-tag input)
- Section 3: "Media" (optional, collapsible)
  - Audio upload (drop zone + waveform preview + URL input alternative)
  - Image upload (drop zone + preview)
- Section 4: "Tổ chức"
  - Tags (multi-tag input, suggest từ tags đã có)
  - Difficulty (slider 1-5)
  - Notes (textarea)
- Footer sticky:
  - Nút "Hủy" (ghost)
  - Nút "Lưu và thêm thẻ mới" (secondary, clear form sau save)
  - Nút "Lưu" (primary)

Auto-suggest từ dictionary: khi nhập lemma → gợi ý IPA + nghĩa (dùng mock function)

Upload: dùng drag-drop, không gọi API thực, chỉ hiển thị filename + preview

Layout: max-w-3xl mx-auto, 2 cột trên desktop (info trái, media phải), 1 cột mobile
```

---

## 1.5. `/practice/vocabulary/decks/new` — Tạo deck (rebuild đủ nghiệp vụ)

**Path**: `version2/app/(app)/practice/vocabulary/decks/new/page.tsx` (thay trang `/practice/vocabulary/new` hiện tại)

**v0 prompt:**

```
Tạo trang Next.js `/practice/vocabulary/decks/new` — wizard 4 bước tạo deck mới.

Wizard layout: progress stepper trên cùng (1-2-3-4), mỗi step 1 card to giữa, nút Back/Next dưới.

Bước 1: "Thông tin cơ bản"
- Input name (required, placeholder "VD: IELTS Vocabulary 5000")
- Textarea description
- Dropdown ngôn ngữ nguồn (ngôn ngữ học) với flag icon
- Dropdown ngôn ngữ mẹ đẻ (nghĩa tiếng gì)
- Dropdown level (A1-C2 / N5-N1 / HSK 1-9 tuỳ ngôn ngữ)

Bước 2: "Nội dung deck" (radio 3 tuỳ chọn)
- [Option A] Tạo rỗng — tự thêm card sau
- [Option B] Chọn template — grid cards (Top 1000 words / Business English / IELTS Vocab / TOEIC 600 / Daily conversation...). Click card → preview 10 từ mẫu
- [Option C] Import từ file:
  - Tabs: CSV / TSV / Anki (.apkg) / Quizlet URL / Paste text
  - Drop zone hoặc textarea paste
  - Preview bảng 5 dòng đầu sau upload

Bước 3: "Tuỳ chỉnh"
- Visibility radio: Private (mặc định) / Public (share community) / Shared (link-only)
- Tags (multi-tag input)
- Cover: emoji picker (64 options) hoặc upload image
- SRS algorithm dropdown: FSRS v5 (khuyến nghị) / SM-2 (cổ điển)
- Daily new cards slider (5-50, default 15)
- Daily review cap slider (50-500, default 200)

Bước 4: "Xác nhận"
- Hiển thị summary tất cả setting
- Preview cover + name + description
- Nút "Tạo deck" (primary to) + "Quay lại chỉnh sửa"

Mock data template cards và import preview để UI có thực.

Sau khi xong, redirect `/practice/vocabulary/decks/[newId]` (trong mock, push dummy id).
```

---

## 1.6. `/checkout/success` — Payment Success

**Path**: `version2/app/checkout/success/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js `/checkout/success` — trang cảm ơn sau thanh toán thành công.

Layout:
- Center aligned, max-w-xl
- Icon check-circle tròn xanh lớn (animation scale + confetti khi load)
- Heading "Thanh toán thành công! 🎉"
- Subheading: "Chào mừng bạn đến với [Plan name]"
- Card "Chi tiết đơn hàng":
  - Plan: Plus / Pro / Ultimate
  - Billing cycle: Monthly / Yearly
  - Next billing date
  - Amount paid (với currency)
  - Invoice number
  - Payment method (masked, e.g., "Visa ****4242")
- Card "Bước tiếp theo":
  - List 3 actions: "Khám phá AI Tutor", "Bắt đầu test prep", "Tham gia community"
  - Mỗi item: icon + title + CTA link
- Footer buttons:
  - Nút primary: "Về Dashboard" → /dashboard
  - Nút ghost: "Tải hoá đơn PDF"
  - Nút text: "Cần giúp? Liên hệ support"

Query param `?session_id=xxx` hiển thị nhỏ dưới footer (read-only)

Animation: fade-in top-down, confetti canvas dùng canvas-confetti package

Mock order: { plan: "Pro", cycle: "yearly", amount: "$199", nextBilling: "2027-04-19", invoiceId: "INV-2026-0419-001", paymentMethod: "Visa ****4242" }
```

---

## 1.7. `/checkout/cancel` — Payment Cancelled

**Path**: `version2/app/checkout/cancel/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js `/checkout/cancel` — trang khi user cancel thanh toán.

Layout:
- Center aligned, max-w-lg
- Icon X-circle màu xám (không đỏ để không alarming)
- Heading "Thanh toán đã huỷ"
- Subtext: "Bạn chưa bị tính phí. Có thể quay lại bất cứ lúc nào."
- Card "Có vấn đề?":
  - Accordion 3 câu hỏi: "Lỗi card?", "Muốn đổi plan?", "Muốn thử plan rẻ hơn?"
  - Mỗi expand: hướng dẫn + CTA
- Footer buttons:
  - Primary: "Thử lại" → /checkout
  - Secondary: "Xem các gói khác" → /pricing
  - Ghost: "Về trang chủ" → /dashboard

Poll/Feedback bar dưới cùng: "Lý do bạn huỷ?" với 4 radio (Quá đắt / Tính năng không đủ / Đang cân nhắc / Khác) + textarea optional → nút "Gửi phản hồi"
```

---

## 1.8. `/checkout/3ds-callback` — 3DS Processing

**Path**: `version2/app/checkout/3ds-callback/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js `/checkout/3ds-callback` — trang loading khi provider redirect về sau 3D Secure verification.

Layout:
- Center, full-height
- Logo OmniLingo ở top
- Spinner lớn tròn ở giữa (animation rotate)
- Heading "Đang xác nhận thanh toán..."
- Subtext: "Vui lòng không tắt trang này. Quá trình chỉ mất vài giây."
- Progress bar indeterminate dưới heading
- Dưới cùng: icon khoá + text nhỏ "Giao dịch được bảo mật bởi 3D Secure"

Auto behavior: sau 3s mock, redirect `/checkout/success` hoặc `/checkout/cancel` dựa vào query param `?status=success|failed`

Không cho bấm back button (useEffect beforeunload warning)
```

---

## 1.9. `/auth/callback/[provider]` — OAuth Callback

**Path**: `version2/app/auth/callback/[provider]/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js `/auth/callback/[provider]` — handler OAuth (Google/Facebook/Apple/GitHub).

Layout:
- Full-height centered
- Logo provider + OmniLingo ở top (hai icon nối nhau bằng dấu link)
- Spinner loading to
- Heading động: "Đang đăng nhập bằng [Provider]..."
- Step indicator dưới heading:
  - ✓ Xác thực với [Provider]
  - ⋯ Tạo phiên OmniLingo
  - ⋯ Chuẩn bị dashboard
- Nếu error: icon X đỏ + message + nút "Thử lại" → /sign-in

Handle: đọc query `?code=xxx&state=xxx` hoặc `?error=xxx`
Mock: sau 2s redirect `/dashboard` (nếu success) hoặc `/sign-in?error=oauth_failed`

Param: `provider` = "google" | "facebook" | "apple" | "github" → hiển thị logo đúng
```

---

## 1.10. `/messages/[conversationId]` — Message Thread

**Path**: `version2/app/(app)/messages/[conversationId]/page.tsx`

**v0 prompt:**

```
Tạo trang Next.js `/messages/[conversationId]` — chi tiết thread chat 1-1.

Layout 2 cột:
- Cột trái (w-80, hidden trên mobile): list conversation (đã có ở /messages)
  - Search input top
  - List items: avatar + name + last message + time + unread badge
  - Active conversation highlight
- Cột phải (flex-1): thread chi tiết
  - Top header: avatar + name partner + status online/offline + nút call (video+audio) + nút info
  - Middle scroll area: message bubbles
    - My messages: align right, gradient primary
    - Partner messages: align left, bg muted
    - System messages: center, text-xs muted (e.g., "Marcus joined")
    - Mỗi bubble: text + timestamp nhỏ + read-receipt tick (✓ sent, ✓✓ delivered, ✓✓ blue read)
    - Group consecutive messages từ same sender (không show avatar lặp)
  - Typing indicator: "[Partner] đang gõ..." + 3 chấm animation
  - Bottom composer:
    - Nút attach file (paperclip icon)
    - Nút emoji picker
    - Input text (auto-resize textarea, max 6 rows)
    - Nút mic (voice note record — hold to record, show waveform)
    - Nút send (plane icon, disabled khi input rỗng)
- Correction tool: khi hover message của partner (language learning context), hiện nút "Suggest correction" → inline edit + gửi kèm bubble highlighted

Mock data: 10 messages demo, partner = "Yuki Tanaka" (Nhật), my target language = Japanese

Keyboard: Ctrl+Enter = send, Esc = clear
Voice note: dùng MediaRecorder API mock (chỉ UI)
```

---

# WAVE 2 — TRẢI NGHIỆM HỌC & ENGAGEMENT

## 2.1. `/practice/listening` — Rebuild với tabs

**Path**: `version2/app/(app)/practice/listening/page.tsx` (overwrite)

**v0 prompt:**

```
Rebuild trang `/practice/listening` với 5 tabs, không phải chỉ 1 exercise mock.

Tabs (shadcn Tabs):
1. "Dictation" — chép chính tả
   - Grid cards bài: title + level (A1-C2) + duration + difficulty
   - Click → modal player: audio controls (play/pause/replay last 3s/speed 0.5×-1.5×) + input text gõ từng câu + nút Check → highlight word sai (red underline) + nút Show answer
   - Score cuối: accuracy % + words per minute

2. "Nghe & Chọn" — listen & choose
   - Grid cards bài
   - Click → player + 4 ô card chọn đáp án (giống lesson)

3. "Điền khuyết" — gap fill
   - Audio + transcript với [____] rải rác, user gõ điền
   - Nút Submit → mark đúng/sai

4. "Shadowing" — nhại theo
   - Audio native + waveform
   - Nút "Hold to record" → user đọc theo
   - Score match rhythm/pitch

5. "Podcast"
   - List podcast episodes: cover art + title + host + duration + level badge
   - Click → episode page (tạo riêng `/practice/listening/podcast/[id]`)
   - Player + transcript clickable (click từ → popup dictionary + Add to SRS)
   - Comprehension questions cuối episode

Filter bar trên tabs: Level (A1-C2) | Category (news/podcast/academic/conversation/interview) | Duration (<3m / 3-10m / >10m)

Mock: 6 items/tab

UX: khi click bài, slide-in panel từ phải (Drawer) thay vì navigate page khác (giữ context)
```

---

## 2.2. `/practice/speaking` — Rebuild với 6 tabs

**Path**: `version2/app/(app)/practice/speaking/page.tsx` (overwrite)

**v0 prompt:**

```
Rebuild `/practice/speaking` với 6 tabs.

Tabs:
1. "Phát âm" — pronunciation drill
   - Grid câu/từ target, level filter
   - Click → record modal: câu đích to, waveform realtime khi record, sau khi xong hiện: điểm tổng (/100) + highlight phoneme sai (red underline), nút Try again/Next

2. "Shadowing"
   - Video/audio native + transcript
   - 2 waveform so sánh (native trên, user dưới)
   - Score rhythm + pitch match

3. "Ghép câu" — sentence construction
   - Hiện từ key, user nói thành câu hoàn chỉnh
   - AI evaluate + suggest corrections

4. "AI Roleplay" (tính năng chính)
   - Grid scenario cards: Khách sạn / Phỏng vấn / Taxi / Debate / Ordering food / Job interview / Doctor visit
   - Mỗi card: icon scene + title + description + level
   - Click → full-screen voice chat UI (giống AI tutor voice): avatar AI (animated), transcript realtime, nút hold-to-speak, timer, nút End
   - Sau cuộc: summary (goals achieved, grammar tips, vocab learned)

5. "Thử thách ngày" — daily challenge
   - 1 thử thách / ngày (topic + 60s limit)
   - Leaderboard cộng đồng

6. "Mock Speaking" (IELTS/TOEFL)
   - 3 parts IELTS flow (intro / long turn / discussion)
   - Timer per part + record
   - AI score theo rubric IELTS

Mock: 5 items/tab. Dùng emoji/icon cho scenario thay vì image
```

---

## 2.3. `/practice/reading/[id]` — Reader view

**Path**: `version2/app/(app)/practice/reading/[id]/page.tsx`

**v0 prompt:**

```
Tạo trang `/practice/reading/[id]` — reader view cho graded reader / article.

Layout 3 cột:
- Left sidebar (w-64, collapsible): 
  - Table of contents (nếu nhiều chương)
  - Saved words (list từ đã tap + Add to SRS)
  - Notes section
- Main content (max-w-3xl):
  - Header: title + author + level badge + reading time estimate
  - Body text (prose, font-serif, text-lg, leading-relaxed)
  - Mỗi từ: span hoverable. Click từ → popover (shadcn) hiện:
    - Lemma + IPA + audio button
    - POS + nghĩa (primary definition)
    - Ví dụ câu khác
    - Nút "Thêm vào SRS" (+)
    - Nút "Dịch câu này" (gọi AI, show inline dưới câu)
  - Double-click câu → highlight + option "Save sentence" / "Translate"
- Right sidebar (w-64, sticky): 
  - Toolbar: font size slider, toggle furigana/pinyin (nếu JP/ZH), dark/sepia/light mode, line spacing
  - Reading stats mini: time spent + WPM + % through
  - Nút "Finish reading" → comprehension quiz

Cuối bài: Card "Comprehension check" với 5 câu multiple choice + nút Submit → show score

Progress bar mảnh ở top (scroll progress %)

Mock text: 1 article mẫu "How coffee changed the world" 500 từ, 10-15 từ clickable có dictionary data
```

---

## 2.4. `/practice/writing` — Rebuild với 4 tabs

**Path**: `version2/app/(app)/practice/writing/page.tsx` (overwrite)

**v0 prompt:**

```
Rebuild `/practice/writing` với 4 tabs.

Tabs:
1. "Bài tập có hướng dẫn" — guided prompts
   - Grid prompts: title + level + type (email/essay/letter/report) + word count target
   - Click → editor page inline:
     - Left: prompt + requirements + tips
     - Right: textarea lớn (max-w-2xl) + toolbar format + word counter + optional timer
     - Footer: nút "Nộp AI chấm"
   - Sau submit: result panel
     - Overall band score (e.g., IELTS 6.5)
     - Rubric cards: Task achievement / Cohesion / Lexical / Grammar — mỗi card: score + feedback 2 dòng
     - Highlighted text inline với underline màu theo loại lỗi (grammar=red, lexical=orange, cohesion=blue), hover popup giải thích
     - Nút "Show corrected version" → diff view
     - Nút "Add errors to review" (auto tạo flashcard lỗi)

2. "Nhật ký" — journal (free writing)
   - Timeline entries bên trái, editor bên phải
   - Nút "+ Entry mới"
   - AI chữa nhẹ nhàng (bubble suggestion, không band score)
   - Track: streak, words/week, improvement trend

3. "Xây câu" — sentence builder (beginner)
   - Hiện từ pool (drag) + target translation
   - User drag từ để tạo câu
   - Nút Check → đúng/sai

4. "Viết tay" — handwriting (JP/ZH only)
   - Canvas vẽ kanji/hanzi bằng mouse/touch
   - Nút "Nhận diện" → AI so với đáp án
   - Stroke order feedback (animation show đúng)

Mock: 8 prompts/tab, 3 journal entries
```

---

## 2.5. `/practice/grammar/[id]` — Grammar lesson detail

**Path**: `version2/app/(app)/practice/grammar/[id]/page.tsx`

**v0 prompt:**

```
Tạo trang `/practice/grammar/[id]` — chi tiết 1 bài ngữ pháp.

Layout 2 cột:
- Main (flex-1):
  - Header: title (e.g., "Present Perfect Tense") + level badge + progress (% mastered)
  - Section "Giải thích" (prose):
    - Definition + when to use
    - Sơ đồ cấu trúc (diagram hoặc table)
    - 3-5 ví dụ highlight (subject/verb/object màu khác nhau)
  - Section "Luyện tập" — 4 loại drill:
    a. Multiple choice (5 câu)
    b. Chia động từ (fill verb form)
    c. Sắp xếp câu (drag-drop words)
    d. Dịch câu (type translation)
  - Submit each drill → show correct answer + explanation
- Right sidebar (w-72, sticky):
  - "Mục lục" — list section nhảy đến
  - "Liên quan" — 3-5 bài ngữ pháp liên quan (e.g., "Past Perfect", "Present Continuous")
  - "Lỗi hay gặp" — common mistakes

Footer action bar:
- Nút "Đánh dấu đã thuộc"
- Nút "Thêm vào ôn tập" (add to SRS)
- Nút "Xem bài tiếp theo"

Mock: Present Perfect với đầy đủ ví dụ + 15 câu drill
```

---

## 2.6. `/practice/pronunciation` — Rebuild đầy đủ

**Path**: `version2/app/(app)/practice/pronunciation/page.tsx` (overwrite)

**v0 prompt:**

```
Rebuild `/practice/pronunciation` — phoneme workshop đầy đủ.

Layout 3 sections dọc:

Section 1 "IPA Chart tương tác":
- Tabs: Consonants / Vowels / Diphthongs
- Grid theo bảng IPA chuẩn: rows = manner, cols = place
- Mỗi cell: phoneme symbol (to) + example word nhỏ
- Click cell → drawer phải mở:
  - Phoneme + audio native (3 giọng: US/UK/AU)
  - Mouth diagram (position tongue/lip)
  - Example words (5) + minimal pair contrast
  - Nút "Drill này" → modal record

Section 2 "Minimal Pair Drills":
- Grid cards cặp: /θ/ think vs /s/ sink, /r/ red vs /l/ led, etc.
- Mỗi card: 2 phoneme + 2 example words + Listen button
- Click "Start drill" → modal:
  - Hiển thị 1 word random (không cho biết cặp nào), user nghe rồi chọn A hoặc B
  - 10 lượt, score cuối

Section 3 "Tongue Twisters":
- List theo level A1-C2
- Click → record page: hiển thị câu, nút hold-to-record, playback + native comparison

Top of page: score widget "Pronunciation score" — gauge + trend 30 days

Mock: 44 phoneme tiếng Anh, 15 minimal pairs, 20 tongue twisters
```

---

## 2.7. `/ai-tutor/[conversationId]` + `/ai-tutor/history`

**Path**: 
- `version2/app/(app)/ai-tutor/[conversationId]/page.tsx`
- `version2/app/(app)/ai-tutor/history/page.tsx`

**v0 prompt:**

```
Tạo 2 trang cho AI Tutor:

1. `/ai-tutor/[conversationId]` — mở conversation cũ
   Giống layout `/ai-tutor` hiện tại (2 cột, sidebar history + chat area), nhưng:
   - Load messages từ conversation cụ thể (mock 20 messages history)
   - Header conversation: title + created date + tag (topic) + nút Rename/Archive/Delete
   - Tiếp tục chat bình thường
   - Breadcrumb: "AI Tutor > [Conversation title]"

2. `/ai-tutor/history` — danh sách đầy đủ conversation
   Layout single column, max-w-4xl:
   - Search bar top (filter theo keyword)
   - Filter chips: All / This week / This month / Archived / Starred
   - Sort dropdown: Newest / Oldest / Most messages
   - List item (card):
     - Icon topic + title conversation (auto-generated từ đoạn đầu)
     - Preview text 2 dòng (dot-dot-dot)
     - Meta: date + # messages + language + star icon
     - Right: dropdown menu (Rename / Archive / Export / Delete)
   - Pagination 20/page
   - Empty state: icon chat + "Chưa có cuộc hội thoại nào" + CTA

Mock: 25 conversations với topic đa dạng (travel, job interview, grammar question, translation, role-play...)
```

---

## 2.8. `/progress/[skill]` — Skill deep-dive

**Path**: `version2/app/(app)/progress/[skill]/page.tsx`

**v0 prompt:**

```
Tạo trang `/progress/[skill]` — chi tiết 1 kỹ năng (skill = vocabulary/grammar/listening/speaking/reading/writing).

Layout max-w-6xl:
- Header: icon skill to + title "Listening progress" + badge level hiện tại (CEFR) + nút quay lại /progress
- Top cards (grid 4):
  - Current level (e.g., B2) + progress bar to next (B2 → C1)
  - Total time spent (hours)
  - Exercises completed
  - Accuracy % (7-day rolling)
- Chart section (tabs):
  - Tab "Xu hướng": line chart score/time over 90 days
  - Tab "Chi tiết": stacked bar chart theo sub-skill (e.g., listening: dictation/podcast/conversation)
  - Tab "So sánh": so với cộng đồng (percentile)
- "Điểm yếu" section:
  - Card list 5 weakness atoms (e.g., "Past tense irregular verbs", "Phoneme /θ/")
  - Mỗi card: atom name + # sai gần đây + nút "Luyện ngay"
- "Bài tập gần đây" section:
  - Table: date, exercise name, type, score, duration, link "Làm lại"
  - Pagination
- Footer action:
  - Nút primary "Tạo session luyện điểm yếu" (generate custom session)
  - Nút "Đặt mục tiêu kỹ năng"

Mock data dài, biểu đồ dùng recharts
```

---

## 2.9. `/profile/edit`

**Path**: `version2/app/(app)/profile/edit/page.tsx`

**v0 prompt:**

```
Tạo trang `/profile/edit` — chỉnh sửa profile.

Layout 2 cột (max-w-4xl):
- Left: avatar section
  - Avatar lớn tròn (w-32 h-32)
  - Nút "Upload ảnh mới" + "Xoá ảnh"
  - Preview crop tool
- Right: form fields (flex-1)
  - Username (input text, validation 3-20 chars, check availability icon)
  - Display name (input)
  - Bio (textarea, max 200 chars + counter)
  - Country (select with flag icons)
  - Birthday (date picker, optional)
  - Gender (radio: male/female/other/prefer not to say)
  - Interests (multi-tag select: travel/music/tech/food/sports/books/movies...)
  - Native language (select flag)
  - Learning languages (multi-select with level per language)
  - Social links: twitter/instagram/linkedin (optional)
  - Privacy: 
    - Profile visibility (public/friends/private)
    - Show learning languages to public (toggle)
    - Show achievements (toggle)
    - Show on leaderboard (toggle)
- Footer sticky:
  - Nút "Huỷ"
  - Nút "Lưu thay đổi" (primary, disabled nếu không có thay đổi)

Mock: prefill form với data user hiện tại
```

---

## 2.10. `/achievements/[id]`

**Path**: `version2/app/(app)/achievements/[id]/page.tsx`

**v0 prompt:**

```
Tạo trang `/achievements/[id]` — chi tiết 1 huy hiệu.

Layout max-w-3xl, center:
- Hero: badge icon rất to (w-48 h-48) + gradient background tương ứng rarity
- Badge name (font-serif, text-5xl)
- Rarity badge (Common/Rare/Epic/Legendary với màu khác nhau)
- Description (prose)
- Earned status:
  - Nếu earned: "Bạn đã đạt được vào [date]" + confetti decoration
  - Nếu chưa: progress bar + "Còn X để hoàn thành"
- Card "Điều kiện":
  - List conditions (e.g., "Học 30 ngày liên tiếp", "Review 1000 cards")
  - Mỗi: icon tick/uncheck + progress bar mini
- Card "Bạn bè cũng đạt được":
  - Grid avatars + name 8-12 friends
- Card "Huy hiệu liên quan":
  - 3-5 badge khác cùng category
- Footer:
  - Nút "Chia sẻ" (copy link + share social)
  - Nút "Xem tất cả huy hiệu" → /achievements

Mock 1 badge mẫu: "Streak Master" (Epic rarity, earned)
```

---

# WAVE 3 — SOCIAL, TUTOR, LIVE CLASS

## 3.1. `/community/new` + `/community/tag/[tag]`

**Path**:
- `version2/app/(app)/community/new/page.tsx`
- `version2/app/(app)/community/tag/[tag]/page.tsx`

**v0 prompt:**

```
Tạo 2 trang community:

1. `/community/new` — tạo post mới
   Layout single column, max-w-3xl:
   - Header: breadcrumb + "Tạo bài viết mới"
   - Form:
     - Type selector tabs: "Thảo luận" / "Câu hỏi" / "Ngữ pháp check" / "Bài viết của tôi (xin feedback)"
     - Title input (large, required)
     - Language tag dropdown (flag icons)
     - Level tag dropdown (A1-C2)
     - Topic tags (multi-input, suggest)
     - Content editor: rich text (TipTap-like) với toolbar bold/italic/code/link/image/code-block
     - Preview toggle
   - Sidebar phải (sticky):
     - "Tips khi post" checklist
     - "Các bài tương tự" auto-suggest dựa trên title
   - Footer:
     - Nút "Save draft"
     - Nút "Post" (primary)
     - Nút "Preview"

2. `/community/tag/[tag]` — list post theo tag
   Layout giống /community main page nhưng filter theo tag:
   - Header: "#[tag]" + description + nút "Follow tag"
   - Filter bar: sort (hot/new/top) + time (today/week/month/all)
   - List posts (card): title + author + language + level + preview + stats (upvotes/comments/views) + timestamp
   - Sidebar: related tags + top contributors in this tag

Mock: 20 posts per tag, 5 tags demo (grammar, ielts, japanese, vocab, pronunciation)
```

---

## 3.2. `/tutors/[id]/review` + `/tutors/bookings`

**Path**:
- `version2/app/(app)/tutors/[id]/review/page.tsx`
- `version2/app/(app)/tutors/bookings/page.tsx`

**v0 prompt:**

```
Tạo 2 trang tutor:

1. `/tutors/[id]/review` — viết review sau buổi học
   Layout center, max-w-2xl:
   - Header: tutor info mini (avatar + name + session date + duration)
   - Rating stars (5 stars, 32px, click to set)
   - Rating breakdown (4 khía cạnh, mỗi 5 stars):
     - Teaching quality
     - Communication
     - Preparation
     - Overall
   - Textarea "Viết review" (min 20 chars)
   - Checkbox "Recommend tutor" (default on)
   - Tags suggest (multi-select): patient / clear / fun / strict / organized...
   - Upload photos (optional, max 3)
   - Checkbox "Post anonymously" 
   - Footer: nút Submit

2. `/tutors/bookings` — my bookings
   Layout max-w-5xl:
   - Tabs: Upcoming (count) / Past / Cancelled
   - Each booking card:
     - Left: date/time block lớn (month + day + time range)
     - Middle: tutor avatar + name + language flag + duration + price + status badge
     - Right actions (tuỳ tab):
       - Upcoming: "Join" (big primary if <10min), "Reschedule", "Cancel"
       - Past: "Review" (nếu chưa review), "Book again", "Report issue"
       - Cancelled: "Book again"
   - Empty state per tab
   - Calendar view toggle (top right) — shows upcoming in week/month view

Mock: 8 upcoming, 12 past, 2 cancelled
```

---

## 3.3. `/live/[id]` + `/live/[id]/room`

**Path**:
- `version2/app/(app)/live/[id]/page.tsx`
- `version2/app/(app)/live/[id]/room/page.tsx`

**v0 prompt:**

```
Tạo 2 trang live class:

1. `/live/[id]` — chi tiết class
   Layout:
   - Hero: banner image + title + instructor avatar + language flag + level
   - Time info: schedule (date + time + duration + timezone) + countdown to start
   - Description (prose)
   - Roster: avatars của students enrolled (circle stack) + count "23/30 enrolled"
   - Materials: list documents/links (disabled cho non-enrolled)
   - Reviews & ratings từ past classes cùng instructor
   - Sticky sidebar:
     - Price (if paid)
     - Nút PRIMARY: "Enroll" hoặc "Join class" (nếu trong giờ) hoặc "Unenroll"
     - Nút ghost: "Add to calendar"

2. `/live/[id]/room` — classroom
   Full-screen layout:
   - Top bar: class title + timer + nút "Leave" (red, confirm)
   - Main area:
     - Grid video tiles (instructor lớn nhất, students nhỏ hơn, 4-8 tiles)
     - Each tile: video + name + status icons (mic on/off, hand raised)
   - Bottom toolbar (floating):
     - Mic toggle
     - Camera toggle
     - Share screen
     - Whiteboard (opens overlay)
     - Chat (opens right panel)
     - Record toggle (instructor only)
     - Raise hand
     - Settings (audio/video device)
     - Leave (red)
   - Right panel tabs (collapsible): Chat / Participants / Materials / Notes
   - Overlay: realtime quiz modal khi instructor push quiz
   - Breakout rooms modal (instructor pushes)

Mock: 1 class "Business English B2 — Presentations", 6 participants

Components cần tạo: VideoTile, Toolbar, ChatPanel, ParticipantsList, QuizOverlay
```

---

## 3.4. `/challenges` + `/language-exchange`

**Path**:
- `version2/app/(app)/challenges/page.tsx`
- `version2/app/(app)/language-exchange/page.tsx`

**v0 prompt:**

```
Tạo 2 trang social:

1. `/challenges` — active challenges
   Layout:
   - Hero: "Thử thách hiện tại" với 1 featured challenge to
   - Tabs: Active / Upcoming / Completed / My challenges
   - Grid cards (3 cols):
     - Challenge cover image
     - Title (e.g., "30-day Streak Challenge")
     - Duration badge
     - Participants count
     - Progress bar (nếu joined)
     - Reward preview (XP, gems, badge)
     - Nút "Join" hoặc "Continue"
   - Click card → detail page inline (drawer):
     - Full description + rules
     - Leaderboard top 10
     - My progress breakdown
     - Daily tasks checklist

2. `/language-exchange` — tìm partner
   Layout 2 cột:
   - Left filter bar (w-72):
     - "Tôi học": dropdown language
     - "Partner native": dropdown
     - Level range slider
     - Online now toggle
     - Interests multi-select
     - Age range
     - Location (optional)
   - Right: grid partner cards
     - Avatar + name + country flag
     - Native lang → Learning lang (arrow)
     - Level badges
     - Bio 1 line
     - Interest tags
     - Online dot
     - Nút "Say hi" (message)
     - Nút "Add friend"
   - Sort: best match / newest / most active

Mock: 12 challenges, 30 partners
```

---

## 3.5. `/billing/gift` + `/billing/referral`

**Path**:
- `version2/app/(app)/billing/gift/page.tsx`
- `version2/app/(app)/billing/referral/page.tsx`

**v0 prompt:**

```
Tạo 2 trang billing:

1. `/billing/gift` — tặng subscription
   Layout max-w-2xl:
   - Hero: "Tặng OmniLingo cho người thân 🎁"
   - Step 1: "Chọn gói"
     - 3 cards: Plus/Pro/Ultimate + giá tháng/năm
   - Step 2: "Thời hạn"
     - Radio: 1 tháng / 3 tháng / 6 tháng / 12 tháng (hiển thị giá tổng + discount %)
   - Step 3: "Người nhận"
     - Email recipient
     - Tên recipient
     - Textarea "Lời chúc" (max 200 chars)
     - Date picker "Ngày gửi" (mặc định: hôm nay, có thể schedule)
   - Step 4: "Xem trước"
     - Preview thiệp mời email (card đẹp với logo + lời chúc + nút Redeem)
   - Footer: "Tiếp tục thanh toán" → /checkout?type=gift

2. `/billing/referral` — chương trình giới thiệu
   Layout:
   - Hero card: "Giới thiệu bạn bè — Nhận 1 tháng miễn phí"
   - Cách hoạt động: 3 bước (icon + text)
   - Referral link box:
     - Input readonly với link
     - Nút "Copy" + toast khi click
     - Share buttons: Facebook / Twitter / WhatsApp / Email / SMS
   - Stats dashboard (4 cards):
     - Bạn bè đã mời: 12
     - Đã tham gia: 8
     - Đã subscribe: 3
     - Reward earned: 90 ngày Plus
   - Referral history table:
     - Email + Status (invited/signed up/subscribed) + Date + Reward
   - FAQ accordion

Mock full data
```

---

## 3.6. `/shop/[id]` + `/shop/cart`

**Path**:
- `version2/app/(app)/shop/[id]/page.tsx`
- `version2/app/(app)/shop/cart/page.tsx`

**v0 prompt:**

```
Tạo 2 trang shop:

1. `/shop/[id]` — chi tiết vật phẩm
   Layout 2 cột (max-w-5xl):
   - Left: product image/animation to (w-96 h-96)
   - Right:
     - Category badge (Power-up / Cosmetic / Gem pack)
     - Title + description
     - Rarity (nếu cosmetic)
     - Price card:
       - Giá gems (hoặc tiền thật)
       - Quantity selector (cho gem pack)
       - Bonus info (e.g., "+20% bonus")
     - Nút PRIMARY to "Mua ngay" + "Thêm vào giỏ"
     - Giá cả hiện tại của user (gems balance)
   - Tabs dưới:
     - "Chi tiết": description dài + effects
     - "Cách dùng": step-by-step
     - "Đánh giá": ratings + reviews

2. `/shop/cart` — giỏ hàng
   Layout:
   - Left (flex-1): list items
     - Each item: image + name + description + quantity selector + price + remove button
     - Empty state: icon + "Giỏ hàng trống" + CTA về shop
   - Right (w-96, sticky): order summary
     - Subtotal
     - Discount (nếu có coupon)
     - Total (gems hoặc $)
     - Coupon input + Apply
     - Nút PRIMARY to "Thanh toán"
     - Nút ghost "Tiếp tục mua sắm"

Mock: 1 item detail "Streak Freeze Pack" + 4 items trong cart
```

---

# WAVE 4 — SETTINGS, TEST PREP, HELP

## 4.1. Settings sub-pages (10 trang)

**Path**: `version2/app/(app)/settings/[name]/page.tsx` với `name` = account/learning/languages/notifications/privacy/accessibility/security/connected-accounts/data-export + `/security/2fa`

**v0 prompt:**

```
Tạo 10 trang settings sub-pages. Tất cả chung layout:
- Sidebar trái (w-64): menu items với icon (Account/Learning/Languages/Notifications/Privacy/Accessibility/Security/Devices/Connected/Data). Active highlight.
- Main area (flex-1, max-w-3xl): content per page
- Top breadcrumb: "Settings > [Current]"
- Footer sticky: "Save changes" + "Cancel" (chỉ hiện khi có dirty)

1. /settings/account: email (đổi), password change (old/new/confirm), delete account (danger zone card)
2. /settings/learning: daily goal radio 5/10/15/20 phút, reminder time picker, reminder days Mon-Sun checkbox, motion effects toggle, sound effects toggle
3. /settings/languages: list learning languages (add/remove card), UI language dropdown (flag), native language dropdown
4. /settings/notifications: table-like toggle grid — rows: SRS due / Streak / Social / Promotions / System — cols: Push / Email / In-app. Frequency dropdown (realtime/daily/off)
5. /settings/privacy: profile visibility radio, block list table, download data button (GDPR), delete data button (danger)
6. /settings/accessibility: font size slider (12-24px preview text), dyslexia font toggle (OpenDyslexic), theme radio (light/dark/system), captions default toggle, reduce motion toggle
7. /settings/security: password change, 2FA toggle → /settings/security/2fa, active sessions table (device/location/last active/logout button per row)
8. /settings/security/2fa: QR code (Authenticator app), manual code input, backup codes list (10 codes, show once + copy + download), nút Confirm
9. /settings/connected-accounts: list OAuth (Google/Apple/Facebook/GitHub) với Connect/Disconnect button per provider
10. /settings/data-export: format radio (CSV/JSON/Both), scope checkboxes (profile/progress/messages/decks), nút "Request export" → show "Chúng tôi sẽ email link sau 24h"

Mỗi page: mock data, không call API, chỉ log action
```

---

## 4.2. Test Prep exams — 7 trang mới

**Path**: `version2/app/(app)/test-prep/[exam]/page.tsx` với exam = toefl/toeic/cefr/hsk/jlpt/topik/delf/goethe

**v0 prompt:**

```
Tạo 8 trang exam dashboard (test-prep detail cho mỗi cert).

Shared layout (based on existing /test-prep/ielts):
- Header: exam logo + name + target test date countdown + nút "Đặt lại mục tiêu"
- Current score gauge (visual gauge theo scale riêng mỗi exam):
  - IELTS: 0-9 band
  - TOEFL: 0-120
  - TOEIC: 10-990
  - HSK: 1-9 level
  - JLPT: N5-N1
  - TOPIK: 1-6 level
  - DELF: A1-C2
  - Goethe: A1-C2
- Breakdown skills (4 cards cho mỗi kỹ năng):
  - Listening / Reading / Writing / Speaking (hoặc theo exam: HSK có Listening/Reading/Writing only)
  - Per card: progress bar + predicted score + "Practice" button
- CTA section:
  - Nút "Take diagnostic test"
  - Nút "Start study plan"
  - Nút "Browse question bank"
  - Nút "Take mock test"
- Weekly schedule: list daily tasks (Mon-Sun)
- Recent performance: line chart score theo ngày

Tạo 8 trang với prefill đúng exam:
- /test-prep/toefl (TOEFL iBT, 120 score)
- /test-prep/toeic (TOEIC L&R, 990 score)
- /test-prep/cefr (CEFR general, A1-C2)
- /test-prep/hsk (HSK 1-9, Chinese)
- /test-prep/jlpt (JLPT N5-N1, Japanese)
- /test-prep/topik (TOPIK 1-6, Korean)
- /test-prep/delf (DELF A1-C2, French)
- /test-prep/goethe (Goethe A1-C2, German)

Config object giữa file cho easier maintain

Mock: cho mỗi exam, score demo ở mức B1/intermediate tương đương
```

---

## 4.3. Test Prep mock test + diagnostic + study plan

**Path**:
- `version2/app/(app)/test-prep/[exam]/diagnostic/page.tsx`
- `version2/app/(app)/test-prep/[exam]/mock-test/[id]/page.tsx`
- `version2/app/(app)/test-prep/[exam]/study-plan/page.tsx`

**v0 prompt:**

```
Tạo 3 trang test prep:

1. /test-prep/[exam]/diagnostic — bài kiểm tra đầu
   Layout:
   - Pre-start screen: intro + "Bạn sẽ làm bài trong 30-45 phút" + nút "Start"
   - During test: full-screen
     - Top: timer countdown to + "Question 5/30" + progress bar + nút "Flag" + nút Pause
     - Middle: câu hỏi + options
     - Bottom: "Previous" + "Next" + "Submit early" (confirm modal)
   - Review panel (drawer bên phải, toggle): grid 30 ô, màu theo status (unvisited/answered/flagged), click jump to question
   - Submit → result page:
     - Estimated level (band/score)
     - Breakdown per skill (chart)
     - Weak areas list
     - Recommended study plan CTA

2. /test-prep/[exam]/mock-test/[id] — full mock test
   Giống diagnostic nhưng:
   - Dài hơn (2-3h)
   - Chia sections (Listening → Reading → Writing → Speaking)
   - Mỗi section timer riêng
   - Audio player cho listening (không cho replay trong IELTS)
   - Text editor cho writing (word counter)
   - Speaking record modal
   - Cuối: full score breakdown + transcript + giải thích từng câu + so sánh với previous attempts

3. /test-prep/[exam]/study-plan — kế hoạch học
   Layout:
   - Header: "Kế hoạch 60 ngày đạt IELTS 7.0"
   - Progress overview: hiện tại/mục tiêu + ngày thi
   - Calendar grid: 60 ngày, mỗi ô: tasks (e.g., "Listening 45min", "Vocab 15 cards")
   - Milestones highlighted: day 15 (diagnostic), day 30 (mock 1), day 55 (mock 2)
   - Click ngày → drawer chi tiết task + nút "Start" / "Mark done"
   - Sidebar: stats (completion %, streak trong plan)

Mock: 30 câu diagnostic, 1 mock test đầy đủ, 60-day plan
```

---

## 4.4. Help sub-pages

**Path**:
- `version2/app/(public)/help/category/[slug]/page.tsx`
- `version2/app/(public)/help/search/page.tsx`
- `version2/app/(public)/blog/tag/[tag]/page.tsx`

**v0 prompt:**

```
Tạo 3 trang help/blog:

1. /help/category/[slug] — list article theo category
   Layout:
   - Breadcrumb: Help > [Category]
   - Header: category icon + name + description
   - Article grid (2 cols): each card với icon + title + preview 2 dòng + read time
   - Pagination
   - Sidebar (right): các category khác + search

2. /help/search — search results
   Layout:
   - Search bar prominent top
   - Results list: article title + highlighted keyword + breadcrumb path + relevance score
   - Filter: category checkbox, sort (relevance/newest)
   - Empty state: "No results for [query]" + suggest related searches
   - "Ask support" CTA nếu không tìm thấy

3. /blog/tag/[tag] — blog posts theo tag
   Layout giống /blog nhưng filter:
   - Header: "#[tag]" + description + follow count
   - List posts (large cards): cover image + title + author + date + preview 3 lines + read time
   - Related tags (horizontal scroll)

Mock: 10 categories, 50 articles, 20 blog posts per tag
```

---

## 4.5. `/become-tutor/apply` — Tutor application

**Path**: `version2/app/(public)/become-tutor/apply/page.tsx`

**v0 prompt:**

```
Tạo trang `/become-tutor/apply` — form đăng ký làm tutor (multi-step wizard).

Wizard 5 steps, progress stepper top:

Step 1: "Giới thiệu"
- Full name, email, phone, country
- Native language(s)
- Teaching languages (multi-select)
- Bio short (300 chars)

Step 2: "Kinh nghiệm & Chứng chỉ"
- Years of teaching experience (slider 0-30)
- Highest degree (dropdown)
- University/institution
- Certifications upload (TESOL, CELTA, DELTA, etc.) — drop zone multiple files
- Languages proficiency: cho mỗi teaching language, chọn level (Native/C2/C1/B2)

Step 3: "Video giới thiệu"
- Upload video (max 3 min, MP4)
- Preview player
- Tips box: "Nên có: giới thiệu bản thân, phương pháp dạy, tại sao phù hợp"

Step 4: "Lịch & Giá"
- Hourly rate input (slider + USD input)
- Availability grid (7 ngày × 24h, click drag chọn timeslot available)
- Timezone dropdown
- Min booking notice (dropdown: 1h/4h/12h/24h)

Step 5: "Xem lại & Gửi"
- Full summary (all info input)
- Terms & conditions checkbox
- Tutor agreement checkbox
- Nút "Gửi đơn"
- Estimated review time: "Đơn sẽ được xem xét trong 3-5 ngày"

Sau submit: success modal + email sẽ gửi update + nút "Về trang chủ"

Mock UX, không upload thực
```

---

## 4.6. System pages

**Path**:
- `version2/app/not-found.tsx`
- `version2/app/error.tsx`
- `version2/app/(public)/maintenance/page.tsx`
- `version2/app/(app)/search/page.tsx`

**v0 prompt:**

```
Tạo 4 trang system:

1. /404 (not-found.tsx) — 404 page
   Layout center:
   - Large illustration (svg mock) của character confused
   - "404" text to
   - "Trang này không tồn tại" + subtext
   - Nút "Về trang chủ" + "Quay lại"
   - Popular links list

2. /error (error.tsx) — error boundary
   Layout center:
   - Icon exclamation
   - "Đã có lỗi xảy ra"
   - Error code display (mock)
   - Nút "Thử lại" + "Contact support"

3. /maintenance — maintenance mode
   Layout center:
   - Illustration tools
   - "Đang bảo trì"
   - ETA countdown (mock 2 hours)
   - Subscribe for update form
   - Status page link
   - Social media links

4. /search — global search
   Layout:
   - Search bar prominent top
   - Tabs: All / Lessons / Words / Grammar / Posts / Articles / Users
   - Results list (depends on type):
     - Lessons: card với title + level + skill
     - Words: lemma + IPA + meaning + save button
     - Grammar: rule + example
     - Posts: title + author + snippet
     - Users: avatar + name + level
   - Filter sidebar
   - Recent searches + Trending

Mock: 50+ items cross-type
```

---

# DANH SÁCH TRANG TỔNG CẦN TẠO (QUICK REFERENCE)

**Wave 1 — MVP blocker (10 prompts)**:
1. /practice/vocabulary/decks/[id]
2. /practice/vocabulary/decks/[id]/learn
3. /practice/vocabulary/decks/[id]/review
4. /practice/vocabulary/decks/[id]/add-card
5. /practice/vocabulary/decks/new (thay /vocabulary/new)
6. /checkout/success
7. /checkout/cancel
8. /checkout/3ds-callback
9. /auth/callback/[provider]
10. /messages/[conversationId]

**Wave 2 — practice & engagement (10 prompts)**:
11. /practice/listening (rebuild)
12. /practice/speaking (rebuild)
13. /practice/reading/[id]
14. /practice/writing (rebuild)
15. /practice/grammar/[id]
16. /practice/pronunciation (rebuild)
17. /ai-tutor/[conversationId] + /ai-tutor/history
18. /progress/[skill]
19. /profile/edit
20. /achievements/[id]

**Wave 3 — social/tutor/live (6 prompts)**:
21. /community/new + /community/tag/[tag]
22. /tutors/[id]/review + /tutors/bookings
23. /live/[id] + /live/[id]/room
24. /challenges + /language-exchange
25. /billing/gift + /billing/referral
26. /shop/[id] + /shop/cart

**Wave 4 — settings/test-prep/help (6 prompts)**:
27. Settings sub-pages (10 trang, 1 prompt gộp)
28. Test-prep dashboards (8 exams, 1 prompt gộp)
29. Test-prep diagnostic/mock-test/study-plan (3 prompt gộp)
30. Help category/search + blog tag
31. /become-tutor/apply
32. System pages (404/error/maintenance/search)

**Tổng: 32 prompt v0 → sau khi chạy tất cả sẽ có ~60 trang mới** bổ sung vào `version2/`.

---

# SAU KHI CHẠY v0

1. Download zip mỗi page → giải nén vào đúng path trong `version2/`
2. Review & chỉnh sửa UI nếu cần (v0 thường OK ~80%)
3. **Chưa tích hợp backend** ở bước này — giữ tất cả mock data
4. Khi done all pages → move `version2/app/*` vào `apps/web/app/*` theo route group đúng
5. Tích hợp backend theo thứ tự Wave trong [missing-pages-2026-04-19.md](missing-pages-2026-04-19.md):
   - Thêm query/mutation vào BFF schema
   - Sync types frontend
   - Convert "use client" → RSC + client split theo [FRONTEND-BACKEND-STANDARDS.md](../FRONTEND-BACKEND-STANDARDS.md) §3.3
   - Update middleware.ts PROTECTED_PATHS
