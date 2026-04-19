# OmniLingo — Tóm tắt các trang web 

Nền tảng học ngoại ngữ đa ngôn ngữ (Anh, Nhật, Trung, Hàn, Pháp, Đức, TBN, Việt cho người nước ngoài) với vocab/grammar/listening/speaking/reading/writing, luyện thi chứng chỉ (IELTS/TOEIC/TOEFL/HSK/JLPT/TOPIK…), AI tutor, marketplace giáo viên 1-1.

Tài liệu này chỉ liệt kê **các trang, chức năng, nút bấm, layout**. Không định nghĩa màu sắc / typography — bạn tự design.

---

## 0. Layout chung

**Top navbar (sau khi login):**
- Logo OmniLingo
- Bộ chọn ngôn ngữ đang học (dropdown cờ)
- Streak 🔥 (số ngày liên tục) + XP tuần + Gems 💎
- Nút Notifications (chuông)
- Avatar user (dropdown: Profile, Settings, Subscription, Logout)

**Sidebar trái (sau login):**
- Home / Dashboard
- Learn (lộ trình)
- Practice (Vocab, Grammar, Listening, Speaking, Reading, Writing)
- Test Prep
- AI Tutor
- Tutors 1-1
- Live Classes
- Community
- Progress
- Shop (gems)

**Footer (public):** About, Pricing, Blog, Contact, Terms, Privacy.

---

## 1. Landing Page (public)

Dành cho khách chưa đăng nhập.

- Hero: headline "Học mọi ngôn ngữ, đạt mọi chứng chỉ", CTA `Start Free`, `Sign In`
- Thả dropdown chọn "Tôi muốn học" (Anh/Nhật/Trung/Hàn…) → đi thẳng vào onboarding
- Section các tính năng: SRS, AI Tutor, Test Prep, 1-1 Tutor, Live Class (grid 6 card)
- Section chứng chỉ hỗ trợ (logos: IELTS, TOEIC, TOEFL, HSK, JLPT, TOPIK, DELF, Goethe)
- Testimonials / success stories (carousel)
- Pricing preview (3 gói) → `See all plans`
- FAQ (accordion)
- Footer

---

## 2. Auth

### 2.1 Sign Up
- Input: Email, Password, (hoặc) các nút OAuth: Google, Apple, Facebook
- Checkbox: Terms + Privacy
- Nút `Create account`
- Link `Already have account? Sign in`

### 2.2 Sign In
- Email + Password
- `Forgot password?`
- OAuth buttons
- Nút `Sign in`

### 2.3 Forgot / Reset Password
- Nhập email → gửi link
- Màn hình nhập mật khẩu mới

---

## 3. Onboarding (bắt buộc sau sign-up)

Flow đa bước, có progress bar phía trên, nút `Back` / `Next`.

1. **Chọn ngôn ngữ muốn học** (grid cờ, đa chọn)
2. **Chọn ngôn ngữ mẹ đẻ** (để AI dùng giải thích)
3. **Mục tiêu** (radio): Du lịch / Công việc / Du học / Chứng chỉ / Sở thích
4. **Nếu chọn chứng chỉ**: chọn loại (IELTS/TOEIC/…) + target score + deadline (date picker)
5. **Level hiện tại** (radio): Beginner / Intermediate / Advanced / `Không biết — làm test`
6. **Mini placement test** (tuỳ chọn, 10–15 câu) — nghe + đọc + chọn đáp án
7. **Daily goal** (radio): 5 / 10 / 15 / 20 phút/ngày
8. **Reminder time** (time picker + toggle push notification)
9. Kết thúc → đi vào Dashboard

---

## 4. Dashboard (Home)

Trang chính sau login.

- Greeting: "Chào [Tên], hôm nay học gì?"
- **Today's Mission** card: bài tiếp theo trong lộ trình, progress bar daily goal, nút `Continue Learning`
- **SRS Due** card: số thẻ tới hạn ôn, nút `Review N cards`
- **Streak** card: calendar heatmap tuần này, freeze streak button (tiêu gems)
- **AI Tutor** card quick access: `Chat` / `Voice Call`
- **Test Prep widget** (nếu có mục tiêu chứng chỉ): điểm dự đoán hiện tại, countdown tới ngày thi, nút `Practice`
- **Skill radar chart** (6 trục: L/R/S/W/Vocab/Grammar)
- **Recommended for you** (carousel bài đọc/video/podcast)
- **Friends activity** feed (mini)

---

## 5. Learning Path (Curriculum)

### 5.1 Track Selector
- Nếu user có nhiều track (General + Test Prep), hiển thị tab hoặc dropdown để chuyển.

### 5.2 Skill Tree / Path View
- Dạng cây kỹ năng (giống Duolingo) hoặc roadmap dọc
- Mỗi node = 1 Unit, icon + tên + số crown/star + progress %
- Node đã xong: tick xanh. Node hiện tại: highlight. Node chưa mở: khóa.
- Click node → modal: tên unit, số lesson, nút `Start` / `Review`
- Scroll vô tận theo Unit → Lesson

### 5.3 Unit Detail
- Tên unit, mô tả ngắn
- Danh sách lesson (ordered list), mỗi lesson: tiêu đề, thời lượng, các skill touch (icon), status
- Nút `Start Lesson`

---

## 6. Lesson Player

Trang làm bài, toàn màn hình, tối giản.

- Top bar: nút `Exit (X)`, progress bar (số activity / tổng), icon hearts ❤️ (cho beginner), gems
- Khu vực hoạt động đổi theo loại activity:
  - **Multiple choice**: câu hỏi + 4 lựa chọn (card), nút `Check`
  - **Typing**: input box, nút `Check`
  - **Matching**: 2 cột, kéo thả hoặc click cặp
  - **Listening**: nút `Play Audio` (có thể play 2x / slow), input gõ
  - **Speaking**: nút `Hold to Speak` (mic), waveform, feedback phoneme sau đó
  - **Fill the blank**: câu có chỗ trống + list từ bấm chọn
  - **Sentence order**: các mảnh từ kéo thả để tạo câu
- Sau `Check`: banner xanh (đúng) hoặc đỏ (sai) + giải thích ngắn + nút `Continue`
- Kết thúc lesson: màn hình congrats — XP kiếm được, crown mới, streak update, nút `Claim rewards` + `Next lesson`

---

## 7. Practice modules

### 7.1 Vocabulary (Flashcards / SRS)

**Deck list page:**
- Danh sách deck: tên, số card, biểu đồ trạng thái (New / Due / Mastered).
- Nút `+ New Deck`, `Import` (Anki/Quizlet/CSV).
- Tab `My decks` / `Community decks`.

**Deck detail:**
- Thống kê chi tiết thẻ: số thẻ New, Learning, Due.
- Lọc và preview danh sách thẻ.
- **1 nút entry point thông minh** `Bắt đầu học` — system tự quyết định flow:
  - Có thẻ New chưa học → vào **Learn Mode** trước.
  - Có thẻ Due → vào **Review Session**.
  - Không còn gì hôm nay → thông báo "Hết phần hôm nay 🎉".
- Nút phụ: `🎮 Chơi Game (Match/Blast)` (Secondary — chế độ giải trí, tách khỏi study flow).
- Nút phụ trợ: `Edit deck`, `Share`, `Settings`.

**Chế độ "Học từ mới" (Learn Mode):**

Dành cho việc nạp từ vựng mới, chống nhàm chán qua chuỗi micro-drills xoay vòng:

1. **Làm quen**: Hiện 2 mặt thẻ (Từ + Nghĩa + Audio).
2. **Nhận diện**: Hiện Từ → Trắc nghiệm chọn 1 trong 4 Nghĩa (Card UI).
3. **Ghi nhớ**: Hiện Nghĩa → Input gõ lại Từ (hiệu ứng rung/đỏ nếu sai).

Mỗi session tối đa 7 thẻ mới. Kết thúc Learn Mode → tự động chuyển sang Review nếu có Due.

**Chế độ "Ôn tập SRS" (Review Session):**

Dành cho ghi nhớ dài hạn, tối ưu hoá tốc độ thao tác.

- **Focus Mode**: Tự động ẩn Sidebar và Top Navbar — màn hình chỉ có nội dung thẻ và thanh Progress.
- **Mặt trước thẻ**: Từ / chữ Hán / câu (chữ siêu lớn, căn giữa).
- Nút `Lật thẻ (Show Answer)` — phím tắt: **Space**.
- **Mặt sau**: Nghĩa, IPA, audio tự động play (nếu chưa mute trong Settings), câu ví dụ.
- **4 nút rating** (Ghost style — nền mờ 10% để không chói mắt), hiển thị phím tắt trực tiếp trên nút:
  - `Lại` (<1m) — phím **[1]**
  - `Khó` (6m) — phím **[2]**
  - `Tốt` (10m) — phím **[3]**
  - `Dễ` (4d) — phím **[4]**
- Quick Actions góc phải thẻ: `✏️ Quick Edit`, `🚩 Flag/Suspend`.

**Add / Edit card:**
- Form: front, back, example, audio upload, image upload, tags, deck.

**Đặc thù JP/ZH/KR:**
- Kanji/Hán tự: canvas vẽ chữ, kiểm tra stroke order, nút `Clear`, `Check`.
- Pinyin tone drill: nghe phát âm → chọn thanh điệu (1/2/3/4).

### 7.2 Grammar
- Danh sách bài ngữ pháp theo level (A1→C2 / N5→N1 / HSK 1→9)
- Mỗi bài: explanation → examples → drills
- Grammar reference (searchable sidebar)
- Drill types giống Lesson Player
- Nút `Mark as known`, `Add to review`

### 7.3 Listening
- Tab: Dictation / Listen & choose / Gap fill / Shadowing / Podcast
- Player: ▶️ play, ⏪ replay, speed slider (0.5×–1.5×), toggle transcript
- Dictation: audio + input box, nút `Check`, gợi ý chữ cái đầu sau 3 lần sai
- Podcast/video: transcript bấm được (click từ → popup dictionary + nút `Add to SRS`)

### 7.4 Speaking
- Tab: Pronunciation drill / Shadowing / Sentence construction / AI Roleplay / Daily challenge / Mock speaking
- Pronunciation: hiển thị câu, nút `Hold mic`, sau đó hiển thị điểm tổng + highlight phoneme sai (màu), nút `Try again`, `Next`
- Roleplay: chọn scenario (card grid: Khách sạn, Phỏng vấn, Taxi, Debate…), vào giao diện chat voice
- Mock speaking: flow 3 parts IELTS, timer, ghi âm, feedback cuối

### 7.5 Reading
- Tab: Graded reader / Real-world / My library
- Catalog: filter theo level, topic, length; cover + title + level badge
- Reader view:
  - Text chính, tap từ → popup (phát âm, nghĩa, nút `Add to SRS`, `Translate sentence`)
  - Sidebar: saved words
  - Toolbar: font size, toggle furigana/pinyin, dark mode, `Finish`
- Cuối bài: câu hỏi comprehension (multiple choice)

### 7.6 Writing
- Tab: Guided prompts / Journal / Sentence builder / Handwriting
- Prompt page: đề bài, word count, timer (tuỳ chọn), editor
- Nút `Submit for AI grading`
- Kết quả: điểm theo rubric (card cho từng tiêu chí), highlight lỗi inline (hover để xem giải thích), nút `See corrected version`, `Link to grammar lesson`
- Journal: dòng thời gian các entry, nút `+ New entry`
- Handwriting (JP/ZH): canvas vẽ, nút `Recognize`, feedback stroke order

---

## 8. AI Tutor

### 8.1 Chat Tutor
- Giao diện chat: message list, input + send, attach image
- Các quick actions: `Explain this`, `Translate`, `Give me exercise`, `Create flashcard`
- Từ/câu highlight trong reply có popup dictionary
- Sidebar: lịch sử hội thoại, tạo conversation mới

### 8.2 Voice Tutor
- Chọn voice (dropdown giọng: US/UK/AU cho Anh; Tokyo/Osaka cho Nhật…)
- Nút `Start Call` (mic icon to)
- Trong cuộc gọi: waveform, transcript realtime, timer, nút `End`
- Sau cuộc gọi: transcript đầy đủ + đánh giá fluency/grammar/vocab/pronunciation + các từ mới đề xuất thêm SRS

### 8.3 Explain Anything (global)
- Nút "Explain" xuất hiện khi hover/select bất cứ text nào trong app → modal giải thích bằng tiếng mẹ đẻ.

---

## 9. Test Prep

### 9.1 Test Prep Hub
- Chọn chứng chỉ (card grid: IELTS, TOEIC, TOEFL, HSK, JLPT, TOPIK…)
- Sau khi chọn: dashboard của chứng chỉ đó

### 9.2 Certification Dashboard (ví dụ IELTS)
- Điểm dự đoán hiện tại (gauge 0–9)
- Countdown tới ngày thi
- Breakdown 4 skill: Listening / Reading / Writing / Speaking (progress bar + điểm dự đoán)
- Nút `Take diagnostic test`, `Start study plan`
- Lộ trình tuần (list bài hằng ngày)

### 9.3 Question Bank
- Filter: skill, difficulty, question type, topic
- List câu hỏi với nút `Practice`
- Có thể làm theo timed drill (toggle timer)

### 9.4 Mock Test
- Trang tổng quan: danh sách đề (card: "Cambridge 17 Test 1"), nút `Start`
- Khi làm: UI mô phỏng đúng giấy thi — tab per section, timer đếm ngược lớn, nút `Flag for review`, `Next`, `Submit`
- Nộp bài → trang kết quả: tổng điểm + breakdown + transcript đáp án đúng/sai + giải thích từng câu

### 9.5 Proctored Mock Test (Ultimate)
- Pre-check: cho phép webcam + mic + full screen
- Cảnh báo realtime nếu phát hiện hành vi lạ
- Báo cáo "trust score" sau khi nộp

### 9.6 AI Writing / Speaking Grader
- Upload bài viết hoặc ghi âm
- Kết quả chi tiết theo rubric: điểm từng tiêu chí + feedback text + rewrite suggestion

---

## 10. Tutor Marketplace (1-1)

### 10.1 Browse Tutors
- Filter: ngôn ngữ, giá, availability, chứng chỉ, đánh giá
- Card tutor: avatar, video intro (play icon), tên, rating ⭐, giá/giờ, ngôn ngữ, nút `Book`

### 10.2 Tutor Profile
- Video intro embed
- Bio, chứng chỉ, kinh nghiệm, ngôn ngữ dạy
- Reviews (list), rating breakdown
- Calendar chọn slot (tuần view)
- Nút `Book 25-min` / `Book 50-min`, giá

### 10.3 Booking Confirmation
- Chi tiết buổi học: thời gian, tutor, giá, credit còn lại (gói Ultimate)
- Nút `Confirm & Pay` hoặc `Use 1 credit`
- Chọn phương thức thanh toán

### 10.4 Video Call Room
- Video tiles (self + tutor), toolbar: mic, camera, share screen, whiteboard, chat, record toggle, `End call`
- Lesson materials panel (tutor đã gán bài)

### 10.5 My Bookings
- Tabs: Upcoming / Past / Cancelled
- Card per booking + nút `Join`, `Reschedule`, `Cancel`, `Review` (sau buổi học)

### 10.6 Become a Tutor (public)
- Form apply: intro video upload, chứng chỉ, experience, hourly rate
- Nút `Submit application`

---

## 11. Live Classes (Group)

- Catalog: filter theo ngôn ngữ, level, topic, ngày
- Class card: tiêu đề, giáo viên, thời gian, số chỗ còn, nút `Enroll`
- My Classes: upcoming / recordings
- Classroom UI: giống tutor video call nhưng multi-user, có breakout room switch, realtime quiz panel, raise hand

---

## 12. Community

### 12.1 Forums
- List forum theo ngôn ngữ/chứng chỉ
- Mỗi forum: list topic, nút `+ New topic`
- Topic detail: post gốc, replies (threaded), like, reply input

### 12.2 Study Groups
- Browse groups (filter public/private), nút `Create group`, `Join`
- Group page: thành viên, leaderboard nội bộ, shared goals, chat

### 12.3 Language Exchange
- Matchmaking: filter cặp ngôn ngữ (tôi học X, tôi là người bản xứ Y)
- Danh sách partner đề xuất, nút `Message`
- Chat 1-1 (có AI moderation warning)

### 12.4 Feed
- Post ngắn bằng ngôn ngữ đang học (≤200 từ)
- Nút `+ Post`, mỗi post có nút `Suggest correction`, like, comment

### 12.5 Challenges
- List challenges (30-day, weekly), nút `Join challenge`
- Trang chi tiết challenge: progress, leaderboard, rewards

### 12.6 Leaderboard
- Tabs: Friends / League (Bronze→Diamond) / Global
- List top users + XP tuần + zone thăng/giáng hạng

---

## 13. Progress & Analytics

- Overview: streak, total XP, minutes learned, words mastered (các card to)
- Skill radar chart (6 trục)
- Heatmap calendar (365 ngày)
- Chart dạng line: XP/ngày, minutes/ngày, accuracy/tuần
- Vocab mastery: total cards, mature cards, retention rate
- Per-certification predicted score (nếu có)
- Nút `Export report`, `Share progress`

---

## 14. Profile

### 14.1 My Profile (public)
- Avatar, username, bio, ngôn ngữ đang học (flag), level hiện tại, achievements (grid badge), streak, followers/following
- Nút `Edit profile`, `Share`

### 14.2 Edit Profile
- Avatar upload, username, bio, country, interests, privacy settings (public / friends / private)
- Nút `Save`

### 14.3 Achievements / Badges
- Grid 200+ badge, trạng thái earned / locked, hover để xem điều kiện

### 14.4 Friends
- Tab Friends / Requests / Find
- Search user, gửi request, accept/decline

---

## 15. Subscription & Billing

### 15.1 Pricing Page (public + upsell)
- 5 cột: Free / Plus / Pro / Ultimate / Family
- Toggle Monthly / Annual (hiển thị % discount)
- Feature comparison table đầy đủ (tick/cross từng dòng)
- Nút `Choose Plan` mỗi cột
- FAQ pricing

### 15.2 Checkout
- Summary gói đã chọn + giá + thuế
- Nhập payment: dropdown provider (Stripe / VNPay / MoMo / ZaloPay / Apple IAP / Google Play / Alipay …)
- Mã giảm giá: input + `Apply`
- Nút `Pay now`

### 15.3 Manage Subscription
- Gói hiện tại, ngày gia hạn, lịch sử invoice
- Nút `Upgrade`, `Downgrade`, `Cancel subscription`
- Cancel flow: 3 click tối đa, hỏi lý do (optional), offer giữ chân (discount), `Confirm cancel`

### 15.4 Billing History
- Table: date, plan, amount, status, download invoice

### 15.5 Gift Subscription
- Form: chọn gói, thời hạn, email người nhận, lời chúc, nút `Send gift`

### 15.6 Referral
- Link referral user, copy button, số user đã mời, reward đạt được

---

## 16. Shop (Gems / Cosmetics)

- Gem packs (card: 100 / 500 / 1200 gems, giá, `Buy`)
- Power-ups: Streak freeze, Heart refill, XP boost 2×, Revive (mua bằng gems)
- Cosmetics: avatar frame, pet, theme (nếu có)

---

## 17. Notifications

- List notifications: SRS due, streak warning, friend activity, achievement, promo, class reminder
- Filter tabs: All / Learning / Social / Billing
- Nút `Mark all read`, per-item: click để đi đến trang liên quan

---

## 18. Settings

Sidebar trong settings:

- **Account**: email, đổi mật khẩu, delete account
- **Learning**: daily goal, reminder time, reminder days (checkbox), motion/sound effects toggle
- **Languages**: thêm/xóa ngôn ngữ học, ngôn ngữ UI (dropdown), ngôn ngữ mẹ đẻ
- **Notifications**: toggle loại (push/email/in-app), tần suất
- **Privacy**: profile visibility, block list, data download, delete data (GDPR)
- **Accessibility**: font size, dyslexia font toggle, dark/light/system, captions default on
- **Subscription** (link tới trang 15.3)
- **Devices / Sessions**: list active sessions, nút `Log out` per device
- **Support**: contact, report bug, help center link

---

## 19. Dashboard (B2B / Schools / Enterprise) — optional cho MVP

- Admin console riêng: /admin/...
- **Users**: danh sách học viên, invite bulk (CSV), assign lộ trình
- **Classes**: tạo lớp, gán teacher, roster
- **Assignments**: tạo bài tập, deadline, xem submission
- **Reports**: filter user/class/period, export CSV/Excel, LMS integration (SCORM/LTI)
- **Billing**: seat management, invoice

### Parental Dashboard (gói Family)
- Danh sách con em, tiến độ mỗi người, set screen time limit, content filter

---

## 20. Help / Support

- Help center (searchable)
- FAQ categories
- Nút `Contact support` → form (subject, message, attach file)
- Chat support widget (bottom right, cho gói Ultimate)

---

## 21. Các trang phụ

- **404 / Error**
- **Maintenance**
- **Terms of Service**
- **Privacy Policy**
- **Cookie Policy**
- **About / Team**
- **Blog** (list + detail)

---

## Ghi chú triển khai cho 

- Tất cả trang sau login có sidebar + topbar cố định.
- Responsive: desktop + tablet + mobile.
- Dark mode toggle.
- Các trang tương tác cao (Lesson Player, AI Voice Tutor, Mock Test, Video Call) cần layout toàn màn hình, ẩn sidebar.
- Có thể dùng mock data cho toàn bộ; backend không bắt buộc cho prototype.
- Component tái sử dụng: Card, Button (primary/secondary/ghost), Input, Modal, Toast, ProgressBar, Tabs, Badge, Avatar, FlagIcon, Timer, AudioPlayer, RecordingButton.
