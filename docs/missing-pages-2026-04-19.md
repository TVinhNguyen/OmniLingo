---
title: Danh sách đầy đủ route frontend & nghiệp vụ chuẩn
date: 2026-04-19
updated: 2026-04-19 (rewrite theo spec đầy đủ)
scope: Đối chiếu giữa `apps/web/app/` + `version2/app/` với toàn bộ spec `.md`
---

# TL;DR

- Tổng cộng **~110 route** cần có theo spec (01-product-overview, 02-features, 10-subscription, 11-learning-paths…).
- **Đã có ở `apps/web/`**: 41 route (UI cũ, nghiệp vụ lõi chưa đủ).
- **Đã có ở `version2/`** (v0.dev mới): 16 route bổ sung.
- **Chưa có**: **~55 route** (trong đó có nhiều route blocker MVP).
- **Trang cần quan tâm nhất**: `/practice/vocabulary/decks/[id]` **KHÔNG có trong `version2/`**, chỉ còn bản cũ ở `apps/web/` với nghiệp vụ tối giản (chỉ "thêm từ bằng lemma") — cần rebuild gấp.

**Ghi chú quy ước bảng:**
- ✅ = đã có & nghiệp vụ đủ / tạm đủ
- ⚠️ = đã có nhưng thiếu nghiệp vụ cốt lõi
- 🔴 = đã có bản mock UI, **không** có tích hợp backend
- ❌ = chưa tạo

---

# 1. PUBLIC / MARKETING

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/` | ✅ `apps/web/` + `version2/` | Hero + CTA (`Start Free`/`Sign In`), dropdown chọn ngôn ngữ → `/sign-up?language=XX`, features grid (6 items), logos cert, testimonials, pricing preview, FAQ, footer |
| `/pricing` | ✅ | 5 cột Free/Plus/Pro/Ultimate/Family, toggle Monthly/Annual, feature comparison table, `Choose Plan` → `/sign-up?plan=XX` hoặc `/checkout?plan=XX` nếu đã login |
| `/about` | ✅ | Mission, team, press kit, link contact |
| `/contact` | ✅ | Form: name, email, subject, message, attachment → `notification-service submitContactForm` |
| `/blog` | ✅ | List posts + filter/search |
| `/blog/[slug]` | ✅ `version2/` | Nội dung bài, author, date, related posts, share button |
| `/blog/tag/[tag]` | ❌ | List posts theo tag |
| `/help` | ✅ | Search box, FAQ categories, nút `Contact Support` |
| `/help/[slug]` | ✅ `version2/` | Article content, breadcrumb, related |
| `/help/category/[slug]` | ❌ | List articles theo category |
| `/help/search` | ❌ | Search result page |
| `/courses` | ✅ | List courses public |
| `/courses/[slug]` | ✅ `version2/` | Chi tiết khoá học, CTA enroll |
| `/become-tutor` | ✅ | Intro + nút `Apply` → `/become-tutor/apply` |
| `/become-tutor/apply` | ❌ | Multi-step: intro video, certs, experience, hourly rate → `tutor-service submitApplication` |
| `/terms` | ✅ | Markdown, last-updated |
| `/privacy` | ✅ | Markdown |
| `/cookies` | ✅ | Cookie disclosure |

---

# 2. AUTHENTICATION

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/sign-up` | ✅ | Email, password (≥8 ký tự), displayName, OAuth (Google/Apple/Facebook), Terms checkbox → `identity-service POST /auth/register` |
| `/sign-in` | ✅ | Email, password, OAuth, `Forgot password`, support `?next=URL` redirect-back → `POST /auth/login` |
| `/forgot-password` | ✅ | Input email → gửi reset link via email |
| `/reset-password?token=` | ✅ `version2/` | New password + confirm → `POST /auth/reset-password` |
| `/verify-email?token=` | ✅ `version2/` | Auto-verify on mount → `POST /auth/verify-email` → redirect `/dashboard` |
| `/auth/callback/google` | ❌ | Nhận OAuth callback Google → `POST /auth/oauth/google/callback` |
| `/auth/callback/facebook` | ❌ | Tương tự Google |
| `/auth/callback/apple` | ❌ | Tương tự Google |

---

# 3. ONBOARDING

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/onboarding` (multi-step) | ⚠️ | 8 bước: (1) chọn ngôn ngữ học multi-select, (2) ngôn ngữ mẹ đẻ, (3) mục tiêu (travel/work/study/cert/hobby), (4) cert & target score nếu chọn, (5) level hiện tại, (6) mini placement test optional, (7) daily goal (5/10/15/20 phút), (8) reminder time + push toggle. Progress bar + Back/Next. → `learning-service POST /goals` + `identity-service PATCH /users/me` |
| `/placement-test` | ✅ `version2/` | Full placement: 30–45 câu đa kỹ năng (listening/reading/grammar), timer, auto-score A1–C2, generate learning path |

---

# 4. DASHBOARD & LEARN

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/dashboard` | ⚠️ | Today's Mission (Continue Learning), SRS Due card (`Review N cards`), Streak heatmap + `Freeze streak` (tiêu gems), AI Tutor quick actions (Chat/Voice), Test Prep widget (countdown + predicted score), Skill radar chart (6 trục), Recommended carousel, Friends activity feed. Query: `DASHBOARD_QUERY` |
| `/learn` | ⚠️ | Track selector (tabs nếu nhiều track), skill tree view — node = Unit (icon + crown + progress), click node → modal `Start`/`Review` (infinite scroll). Query: `MY_TRACKS_QUERY` |

---

# 5. LESSON PLAYER

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/lesson/[id]` | ⚠️ | Full-screen, ẩn nav. Top bar: Exit, progress, hearts ❤️, gems. Adaptive activity: multiple-choice / typing / matching / listening (play+speed) / speaking (mic+waveform+phoneme feedback) / fill-blank / sentence-order. Feedback banner (xanh/đỏ) + giải thích. End screen: XP + crown + streak + `Claim`. Mutation: `START_LESSON_MUTATION` |

---

# 6. PRACTICE — VOCABULARY (trọng tâm)

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/practice/vocabulary` | ⚠️ | Tabs `My decks`/`Community decks`. Card deck: name, language, #cards, stats chart (New/Due/Mastered). Nút `+ New Deck` + `Import`. Query: `MY_DECKS_QUERY` |
| `/practice/vocabulary/decks/new` | ⚠️ `apps/web/` | Form: **name, description, source+target language, template (Top 1000/Business/IELTS…), cover emoji/image, visibility (private/public/shared), tags, level A1–C2, SRS algorithm (FSRS v5/SM-2), import CSV/TSV/Anki/Quizlet/URL**. Mutation: `CREATE_DECK_MUTATION` |
| `/practice/vocabulary/new` | 🔴 `version2/` | v0 tạo route mới — **TRÙNG chức năng** với `/decks/new`. Cần gộp lại 1 convention |
| **`/practice/vocabulary/decks/[id]`** | ⚠️ `apps/web/` (hiện chỉ có "thêm từ bằng lemma") | Heading deck name, Stats card (#New/#Learning/#Due/#Mastered), heatmap review history, filter sidebar + card list preview. **1 nút chính "Bắt đầu học"** (auto chọn Learn nếu còn New, Review nếu còn Due, message "Hết phần hôm nay" nếu không). Secondary: `🎮 Game (Match/Blast)`, `📊 Stats`, `⚙️ Settings` (visibility), `Share` (copy link), `Edit` (nếu owner), `Export` (CSV/Anki). **⚠️ KHÔNG CÓ trong `version2/` — phải rebuild** |
| `/practice/vocabulary/decks/[id]/learn` | ❌ | Learn Mode 3 giai đoạn xoay vòng 7 card/session: (1) **Làm quen** — show từ+nghĩa+audio, nút `Next`; (2) **Nhận diện** — từ → 4 lựa chọn nghĩa card; (3) **Ghi nhớ** — nghĩa → gõ từ, rung nếu sai. Auto chuyển Review khi xong. Mutation: `submitReview(deckId, cardId, step, rating)` |
| `/practice/vocabulary/decks/[id]/review` | ❌ | **Focus Mode** (auto-hide nav + sidebar, toggle). Mặt trước: Từ (font to). Space/click → flip. Mặt sau: Nghĩa + IPA + audio auto-play + ví dụ câu. **4 nút rating + phím tắt**: `[1] Lại (<1m)` / `[2] Khó (6m)` / `[3] Tốt (10m)` / `[4] Dễ (4d)`. Quick action: `✏️ Quick Edit`, `🚩 Flag/Suspend`. Progress N/Total. Mutation: `submitReview` → srs-service |
| `/practice/vocabulary/decks/[id]/add-card` | ❌ | Form: lemma, IPA, meaning, POS, example, audio upload, image upload, tags → `createCard` |
| `/practice/vocabulary/decks/[id]/edit` | ❌ | Form chỉnh sửa deck (name, language, visibility, tags) |
| `/practice/vocabulary/game` | ❌ (Phase 1.5+) | Match pairs / Word Blast + weekly leaderboard |

---

# 7. PRACTICE — OTHER SKILLS

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/practice` (hub) | ✅ | Grid 7 module (Vocab/Grammar/Listening/Speaking/Reading/Writing/Pronunciation) |
| `/practice/grammar` | 🔴 | List bài theo level, mỗi bài: title + level badge + progress. Click → `/grammar/[id]`. Kết nối `grammar-service` |
| `/practice/grammar/[id]` | ❌ | Explanation prose + sơ đồ, examples list, drills (MCQ/chia động từ/sắp xếp/dịch/điền khuyết), `Mark as known`, `Add to review`, sidebar grammar reference |
| `/practice/listening` | 🔴 | **Tabs**: Dictation / Listen&choose / Gap fill / Shadowing / Podcast. Mỗi tab nghiệp vụ riêng (xem §2.3 spec). Player: play/replay/speed 0.5×–1.5× |
| `/practice/listening/[id]` | ✅ `version2/` | Chi tiết 1 bài cụ thể (audio + câu hỏi + transcript toggle) |
| `/practice/speaking` | 🔴 | Tabs: Pronunciation / Shadowing / Sentence-construction / AI Roleplay / Daily challenge / Mock speaking. Mic record → speech-ai → score phoneme + waveform + pitch curve |
| `/practice/reading` | 🔴 | Tabs: Graded reader / Real-world / My library. Filter level/topic |
| `/practice/reading/[id]` | ❌ | Reader view: text + tap từ → popup (IPA, meaning, `Add to SRS`, `Translate sentence`). Toolbar font/furigana/dark mode. Cuối bài: comprehension questions |
| `/practice/writing` | 🔴 | Tabs: Guided prompts / Journal / Sentence builder / Handwriting. Editor + word count + timer. Submit → AI grading rubric + highlight inline |
| `/writing-center` | ✅ `version2/` | Editor chi tiết + AI feedback (mới v0) |
| `/practice/pronunciation` | 🔴 | Phoneme workshop: IPA chart interactive, `Listen` (native audio), `Drill` (record → speech-ai score), minimal pair drills, tongue twisters |

---

# 8. AI TUTOR

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/ai-tutor` | ⚠️ | Chat UI: message list + input + send + attach image. Sidebar history + `+ New conversation`. Quick actions (Explain/Translate/Give exercise/Create flashcard). Hover từ → popup dictionary. Message counter quota + upsell banner nếu hết. Mutation: `tutorChat` |
| `/ai-tutor/[conversationId]` | ❌ | Mở lại conversation cũ, tiếp tục chat |
| `/ai-tutor/history` | ❌ | List past conversations (timestamp, preview, delete button) |
| `/ai-tutor/voice` | ❌ (Phase 1.5+) | Voice picker (US/UK/AU/Tokyo/Osaka), `Start Call` → waveform + transcript realtime. Sau cuộc: full transcript + rating (fluency/grammar/vocab/pronunciation) + suggested words để add SRS |

---

# 9. TEST PREP

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/test-prep` | ✅ | Entitlement check (Free → upsell). Grid chọn cert (IELTS/TOEIC/TOEFL/HSK/JLPT/TOPIK/DELF/Goethe) |
| `/test-prep/ielts` | ✅ | Score gauge + countdown + breakdown 4 skill + `Take diagnostic` + `Start study plan` + weekly schedule |
| `/test-prep/toefl` | ❌ | Tương tự IELTS |
| `/test-prep/toeic` | ❌ | Tương tự |
| `/test-prep/cefr` | ❌ | Tương tự |
| `/test-prep/hsk` | ❌ | Tương tự (Trung) |
| `/test-prep/jlpt` | ❌ | Tương tự (Nhật) |
| `/test-prep/topik` | ❌ | Tương tự (Hàn) |
| `/test-prep/delf` | ❌ | Tương tự (Pháp) |
| `/test-prep/goethe` | ❌ | Tương tự (Đức) |
| `/test-prep/[exam]/diagnostic` | ❌ | 30–45 phút, submit → level estimate + weak areas |
| `/test-prep/[exam]/question-bank` | ❌ | Filter skill/difficulty/type/topic, timed drill |
| `/test-prep/[exam]/mock-test/[id]` | ❌ | Full mock: tabs section, timer countdown, `Flag for review`, `Submit` → result (tổng + breakdown + transcript + giải thích) |
| `/test-prep/[exam]/proctored-mock` | ❌ (Phase 2+) | Webcam + mic + fullscreen check, realtime cheat detection, trust-score report |
| `/test-prep/[exam]/study-plan` | ❌ | 60-day plan calendar, milestone day-15 diagnostic / day-30 mock / day-55 final |
| `/test-prep/[exam]/ai-grading` | ❌ | Upload essay / record speaking → per-rubric score + rewrite suggestion |

---

# 10. TUTORS & MARKETPLACE

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/tutors` | ✅ | Filter (language/price/availability/cert/rating). Card tutor (avatar, video intro, rating, $/h, `Book`) |
| `/tutors/[id]` | ✅ | Video intro, bio, certs, reviews, calendar week-view, `Book 25/50-min` |
| `/tutors/[id]/book` | ✅ `version2/` | Select slot, review details, payment (Pay now / Use credit), `Confirm & Pay` → booking-service |
| `/tutors/[id]/review` | ❌ | Rating 1–5 stars + text review (sau buổi học) |
| `/tutors/bookings` | ❌ | Tabs Upcoming/Past/Cancelled. Card booking: tutor, time, `Join`/`Reschedule`/`Cancel`/`Review` |
| `/tutor-dashboard` | ✅ `version2/` | My students, upcoming sessions calendar, earnings, settings (availability/rate) |
| `/tutor-dashboard/sessions` | ❌ | Chi tiết từng session (learner info, agenda, note) |
| `/tutor-dashboard/earnings` | ❌ | Breakdown thu nhập theo tháng, withdraw request |

---

# 11. LIVE CLASSES

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/live` | ✅ `version2/` | Catalog: filter language/level/topic/date. Card class: title, instructor, time, capacity, `Enroll` |
| `/live/[id]` | ❌ | Chi tiết class: info, roster, `Enroll`/`Unenroll`/`Join` |
| `/live/[id]/room` | ❌ | Multi-user video tiles, toolbar (mic/cam/share/whiteboard/chat/record), materials panel, breakout, raise hand, realtime quiz |

---

# 12. COMMUNITY & SOCIAL

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/community` | ⚠️ | Tabs Forums/Feed/Groups/Challenges |
| `/community/new` | ❌ | Form: title + markdown content + language tag → `Post` |
| `/community/post/[id]` | ✅ `version2/` | Post + threaded replies + like + reply input + `Suggest correction` |
| `/community/tag/[tag]` | ❌ | List posts theo tag |
| `/language-exchange` | ❌ (Phase 2+) | Filter cặp ngôn ngữ, list partners, nút `Message` |
| `/leaderboard` | ✅ | Tabs Friends/League/Global, list XP tuần, zone thăng/giáng, League info |
| `/challenges` | ❌ | List active challenges + detail page: rules, leaderboard, `Join` |

---

# 13. PROFILE & PROGRESS

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/progress` | ⚠️ | Overview cards (streak/XP/minutes/words), skill radar 6-trục, heatmap 365 ngày, line chart XP/day + accuracy/week, vocab mastery, per-cert predicted score, `Export report` + `Share` |
| `/progress/[skill]` | ❌ | Focus 1 skill (listening/reading/speaking/writing/vocab/grammar): time-series chart, recent exercises, weakness atoms, `Practice weak areas` |
| `/profile` | ✅ | Avatar, username, bio, flags, level, achievements grid, streak, followers/following, tabs Overview/Badges/Activity, `Edit profile`, `Share` |
| `/profile/edit` | ❌ | Form: avatar upload, username, bio, country, interests, privacy (public/friends/private) |
| `/u/[username]` | ✅ `version2/` | Public profile người khác, `Follow`/`Unfollow`, `Message`, activity feed (nếu privacy allows) |
| `/achievements` | ✅ | Grid 200+ badges, filter rarity/category, earned status + condition hover |
| `/achievements/[id]` | ❌ | Badge info: name, description, rarity, criteria, friends also earned |

---

# 14. BILLING & SHOP

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/checkout` | ✅ `version2/` | Summary (plan/price/tax), dropdown payment provider (Stripe/VNPay/MoMo/ZaloPay/Apple IAP/Google Play/Alipay/WeChat), coupon input + `Apply`, `Pay now` → `payment-service initiatePayment` |
| `/checkout/success` | ❌ | Congrats + subscription details (plan/duration/start) + `Go to dashboard` + `Download receipt`. Query `?session_id=` |
| `/checkout/cancel` | ❌ | Message cancelled + `Try again`/`Back to pricing` |
| `/checkout/3ds-callback` | ❌ | Redirect từ provider 3DS, auto-process, redirect success/cancel |
| `/settings/billing` | ✅ `version2/` | Current plan, invoice history (date/plan/amount/status/download), `Upgrade`/`Downgrade`/`Cancel` (với retention flow: ask lý do → offer discount 30%/pause 3m → confirm) |
| `/settings/subscription` | ✅ `version2/` | Alias hoặc trang con của billing |
| `/billing/gift` | ❌ | Form: select plan, duration (1/3/6/12 tháng), recipient email, message → `sendGiftSubscription` |
| `/billing/referral` | ❌ | Referral link + copy button, stats (#invited/#converted/rewards), referral history table |
| `/shop` | ✅ | Gem packs (100/500/1200/5000 + bonus %), power-ups (streak freeze/heart refill/XP 2×/revive), cosmetics. `Buy` per item |
| `/shop/[id]` | ❌ | Chi tiết vật phẩm + confirm mua |
| `/shop/cart` | ❌ | List items + total + `Checkout` |

---

# 15. MESSAGES & NOTIFICATIONS

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/messages` | ⚠️ | List conversations (partner, last message, unread count). Nút `New message` |
| `/messages/[conversationId]` | ❌ | Thread chi tiết: message list + input (text/file/voice note) + typing indicator + read receipt |
| `/notifications` | ⚠️ | Tabs All/Learning/Social/Billing/System. Mark-read per item + `Mark all read`. Click → navigate (e.g., SRS due → `/practice/vocabulary/review`) |

---

# 16. SETTINGS

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/settings` | ⚠️ (1 trang dài) | Hub: sidebar Account/Learning/Languages/Notifications/Privacy/Accessibility/Security/Devices/Support |
| `/settings/account` | ❌ | Email (đổi), password change form, `Delete account` |
| `/settings/learning` | ❌ | Daily goal radio (5/10/15/20), reminder time picker, reminder days (Mon–Sun), motion/sound effects |
| `/settings/languages` | ❌ | List ngôn ngữ đang học (add/remove), ngôn ngữ UI, ngôn ngữ mẹ đẻ |
| `/settings/notifications` | ❌ | Toggle push/email/in-app, frequency (realtime/daily digest/off), per-category (SRS/streak/social/promo/system) |
| `/settings/privacy` | ❌ | Profile visibility (public/friends/private), block list, `Download my data` (GDPR), `Delete my data` |
| `/settings/accessibility` | ❌ | Font size slider, dyslexia font (OpenDyslexic), theme (dark/light/system), captions default |
| `/settings/security` | ❌ | Password change, 2FA toggle, active sessions (device/location/last-active + `Log out` per device) |
| `/settings/security/2fa` | ❌ | QR code (Authenticator/Authy), manual code, backup codes (show once + download + copy), `Confirm enabled` |
| `/settings/connected-accounts` | ❌ | List OAuth (Google/Apple/Facebook) + `Connect`/`Disconnect` per provider |
| `/settings/data-export` | ❌ | `Export my data` (CSV/JSON), download prepared files (async email link) |

---

# 17. ADMIN / B2B (Phase 2+)

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/admin` | ❌ | Dashboard metrics (MAU, paid users, churn, revenue) |
| `/admin/users` | ❌ | Table (email/tier/created/last-login), filter, bulk invite (CSV), assign learning path, suspend |
| `/admin/classes` | ❌ | List classes, `Create class`, edit form, archive |
| `/admin/assignments` | ❌ | Create assignment (lesson/deadline/target), list submissions |
| `/admin/reports` | ❌ | Filter user/class/date, export CSV/Excel/PDF, engagement heatmap, LMS integration (SCORM/LTI 1.3) |
| `/admin/billing` | ❌ | Seat management, invoice history, MSA/DPA download |
| `/admin/content` | ❌ | Lesson WYSIWYG + preview, publish workflow (draft → review → published), versioning & rollback, bulk importer |
| `/parental-dashboard` | ❌ | List children + per-child progress + skill radar + screen time limits + content filter + download report |

---

# 18. UTILITY & SYSTEM

| Route | Hiện trạng | Nghiệp vụ bắt buộc |
|---|---|---|
| `/search` | ❌ | Global search box, results theo type (lesson/word/grammar/post/article), filter + pagination |
| `/404` | ⚠️ | Friendly 404 + `Go home`/`Go back` (có thể dùng Next.js convention `not-found.tsx`) |
| `/500` | ❌ | Apologize + `Try again`/`Contact support` (convention `error.tsx`) |
| `/maintenance` | ❌ | Message + ETA + status page link |

---

# 19. ƯU TIÊN TRIỂN KHAI

## Wave 1 — **CHẶN MVP 1 launch** (13 route)

Phải có để người dùng đăng ký, thanh toán, và học vocabulary đầy đủ.

1. `/practice/vocabulary/decks/[id]` — **rebuild hoàn chỉnh** (stats + Start button auto route)
2. `/practice/vocabulary/decks/[id]/learn` — Learn Mode 3 giai đoạn
3. `/practice/vocabulary/decks/[id]/review` — Review Session + Focus Mode phím tắt `1/2/3/4`
4. `/practice/vocabulary/decks/[id]/add-card` — thêm card thủ công đủ field
5. `/practice/vocabulary/decks/new` — bổ sung import CSV/Anki/Quizlet + template
6. `/checkout/success` + `/checkout/cancel` + `/checkout/3ds-callback`
7. `/auth/callback/{google,facebook,apple}`
8. `/messages/[conversationId]` — detail thread

## Wave 2 — **Trải nghiệm học & engagement** (18 route)

9. `/practice/listening` — tabs Dictation/Gap-fill/Shadowing/Podcast + API thực
10. `/practice/speaking` — record + AI score + Roleplay
11. `/practice/reading/[id]` — reader view + tap từ
12. `/practice/writing` — AI feedback rubric
13. `/practice/grammar/[id]` — lesson detail + drills
14. `/practice/pronunciation` — IPA chart + drill AI score
15. `/ai-tutor/[conversationId]` + `/ai-tutor/history` — lịch sử
16. `/progress/[skill]` — drill-down per skill
17. `/profile/edit` — chỉnh sửa profile
18. `/achievements/[id]` — badge detail

## Wave 3 — **Social, Tutor, Live Class** (14 route)

19. `/community/new` + `/community/tag/[tag]`
20. `/tutors/[id]/review` + `/tutors/bookings`
21. `/live/[id]` + `/live/[id]/room`
22. `/challenges` + `/language-exchange`
23. `/billing/gift` + `/billing/referral`
24. `/shop/[id]` + `/shop/cart`

## Wave 4 — **Settings, Test Prep khác, Help** (20+ route)

25. Toàn bộ `/settings/*` sub-pages (10 route)
26. `/test-prep/{toefl,toeic,cefr,hsk,jlpt,topik,delf,goethe}` + `/diagnostic` + `/mock-test/[id]` + `/study-plan`
27. `/help/category/[slug]` + `/help/search` + `/blog/tag/[tag]`
28. `/become-tutor/apply`
29. `/search`, `/500`, `/maintenance`

## Wave 5 — **Admin / B2B / Advanced** (Phase 2+)

30. `/admin/*`, `/parental-dashboard`
31. `/ai-tutor/voice`
32. `/test-prep/[exam]/proctored-mock`
33. `/tutor-dashboard/sessions` + `/earnings`

---

# 20. GHI CHÚ QUAN TRỌNG KHI IMPLEMENT

1. **Merge `version2/` vào `apps/web/`**: các file v0.dev hiện ở thư mục riêng `version2/app/*`, cần di chuyển vào đúng route group của `apps/web/app/` theo quy ước trong [FRONTEND-BACKEND-STANDARDS.md](FRONTEND-BACKEND-STANDARDS.md).

2. **Giải quyết xung đột route vocab**:
   - `version2/` có `/practice/vocabulary/new` (không có `/decks/`)
   - `apps/web/` có `/practice/vocabulary/decks/new` + `/decks/[id]`
   - **Chốt**: giữ `/decks/new` + `/decks/[id]` + `/decks/[id]/{learn,review,add-card}` (v0 tạo trang sai convention, nên bỏ `/vocabulary/new`).

3. **Pattern RSC + Client Component** (bắt buộc theo §3.3 FRONTEND-BACKEND-STANDARDS):
   - `page.tsx` — RSC fetch data
   - `*-client.tsx` — `"use client"` interactive
   - `actions.ts` — `"use server"` mutations

4. **Mỗi trang mới cần**:
   - Route prefix trong `middleware.ts` PROTECTED_PATHS nếu cần auth
   - Query/Mutation mới trong `schema.ts` (BFF) + `types.ts`/`queries.ts`/`mutations.ts` (FE) đồng bộ
   - Mock fallback khi BFF offline
   - Link reference trong sidebar / dashboard

5. **Tổng ước lượng effort** (nếu 1 dev full-time, mỗi trang ~0.5–1 ngày UI + 0.5 ngày integrate):
   - Wave 1: ~15 ngày
   - Wave 2: ~18 ngày
   - Wave 3: ~14 ngày
   - Wave 4: ~20 ngày
   - Wave 5: Phase 2+
