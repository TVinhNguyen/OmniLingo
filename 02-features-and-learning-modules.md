# 02 — Features & Learning Modules

Tài liệu này liệt kê đầy đủ các tính năng người dùng sẽ thấy. Mỗi tính năng sẽ được map tới một hoặc nhiều microservice ở tài liệu 04.

## 1. Kiến trúc trải nghiệm học (Learning Experience)

Người học vào app sẽ thấy ba "trục" chính:

1. **Daily Learning** — học đều đặn theo lộ trình cá nhân hoá.
2. **Test Prep** — ôn luyện chứng chỉ có mục tiêu rõ ràng và deadline.
3. **Practice & Immersion** — tự chọn bài đọc, video, podcast, chat với AI, giáo viên 1-1.

Tuỳ mục tiêu người dùng khai báo khi onboarding, trục nào được ưu tiên hiển thị.

## 2. Module học cốt lõi (Core Learning Modules)

### 2.1. Vocabulary (Học từ vựng)

**Flashcards thông minh với SRS (Spaced Repetition System):**
- Thuật toán: FSRS (Free Spaced Repetition Scheduler) — version mới, chính xác hơn SM-2 của Anki — làm thuật toán mặc định. Tham số được tinh chỉnh trên dữ liệu thật của người dùng.
- Mỗi thẻ có nhiều mặt: nghĩa, phát âm (audio + phiên âm IPA), ví dụ câu, hình minh hoạ, cụm từ đi kèm (collocations), đồng nghĩa/trái nghĩa, gốc từ (etymology) với ngôn ngữ phù hợp.
- Dạng bài tập đa dạng xoay luân phiên: multiple choice, typing, audio → gõ, nhìn ảnh → gõ từ, ghép đôi, điền khuyết.
- **Context learning**: thẻ xuất hiện kèm một câu đọc/video short mà người học đã gặp trước đó.

**Đặc thù theo ngôn ngữ:**
- **Tiếng Nhật**: Kanji writing (vẽ bằng ngón tay / chuột, kiểm tra thứ tự nét), radical breakdown kiểu WaniKani, âm on/kun, từ vựng theo JLPT N5→N1.
- **Tiếng Trung**: Pinyin + thanh điệu (tone drill riêng), nhận diện Hán tự phồn/giản, viết chữ với stroke order, từ vựng theo HSK 1→9 (HSK 3.0).
- **Tiếng Hàn**: Hangul learning module riêng cho người mới (bắt đầu từ Hangul lesson), phân biệt âm khó (ㄹ vs 리), Chinese-origin vocab.
- **Tiếng Anh**: Word families (root + affix), academic word list, business English, phonics cho trình độ thấp.

**Import & customization:**
- Import deck từ Anki (.apkg), Quizlet, CSV.
- Mark từ trong reader/video để tự động thêm vào deck cá nhân.
- Chia sẻ deck công khai, có rating và bình luận.

### 2.2. Grammar (Học ngữ pháp)

- Bài học có cấu trúc: explanation (prose + sơ đồ) → examples → drills → production task.
- Drill có nhiều dạng: chia động từ, sắp xếp lại câu, chuyển câu, dịch câu ngắn, điền khuyết, chọn đúng/sai.
- **Grammar reference database** tra cứu nhanh (swipeable index theo level).
- Mapping với các level chuẩn: CEFR (A1–C2), JLPT (N5–N1), HSK (1–9), TOPIK (1–6).
- Detection tự động: phân tích bài viết/nói của người học và highlight lỗi ngữ pháp cụ thể có liên kết tới bài giảng tương ứng.

### 2.3. Listening (Luyện nghe)

**Các dạng bài:**
- **Dictation (chép chính tả)**: nghe một câu/đoạn ngắn → gõ lại chính xác. Có tốc độ điều chỉnh (0.5x → 1.5x), lặp vô hạn, hiển thị gợi ý chữ cái đầu sau N lần sai.
- **Listen & choose**: nghe → chọn đáp án (giả lập format TOEIC Part 1–4, IELTS Listening).
- **Gap fill**: nghe → điền từ còn thiếu trong transcript.
- **Shadowing**: lặp lại theo speaker, hệ thống chấm độ khớp về rhythm/intonation.
- **Interactive video / podcast**: transcript bấm được, click từ hiện nghĩa, đánh dấu từ mới vào deck SRS, có câu hỏi comprehension sau mỗi đoạn.

**Nguồn nội dung:**
- Bài nghe gốc do đội ngũ sản xuất (biên tập viên + voice actor native) cho lộ trình chính.
- Licensed content (podcast, news chậm như NHK Easy, VOA Learning English, HSK Online podcast).
- YouTube/video short có transcript do AI tự động tạo + biên tập viên kiểm duyệt trước khi xuất bản.

### 2.4. Speaking (Luyện nói)

- **Pronunciation drill**: đọc từ/câu → AI chấm theo phoneme (không chỉ word-level), highlight âm sai, so sánh waveform với native.
- **Shadowing** (đã nói ở trên).
- **Sentence construction**: hiển thị tình huống → nói thành câu → AI transcribe + chấm ngữ pháp.
- **AI Conversation Roleplay**: chọn scenario (đặt phòng khách sạn, phỏng vấn xin việc, gọi taxi, tranh luận chính trị…), chat voice với AI tutor theo level phù hợp.
- **Speaking challenge** hàng ngày: 1 câu hỏi, trả lời 30–60 giây, AI chấm và gợi ý cải thiện.
- **Mock IELTS/TOEFL Speaking**: format đầy đủ, AI chấm theo rubric chính thức.

### 2.5. Reading (Luyện đọc)

- **Graded reader**: truyện, bài báo được biên soạn theo level CEFR/JLPT/HSK. Tap từ → pop-up dictionary + thêm vào SRS. Câu hỏi comprehension cuối bài.
- **Real-world reader**: đọc bài báo gốc (BBC, NHK, 人民网, 朝鮮日報…) với từ điển tích hợp và độ khó được AI đánh giá tự động.
- **Progress tracking**: words read, unique words, reading speed (wpm).
- **Chinese/Japanese/Korean**: hiển thị furigana / pinyin tuỳ chọn (bật/tắt từng lớp).

### 2.6. Writing (Luyện viết)

- **Guided writing**: prompt → viết → AI chấm theo rubric (Task Response, Coherence, Lexical Resource, Grammar cho IELTS; tương tự cho TOEFL/HSK Writing).
- **Character/word-level correction**: AI highlight từng lỗi, đưa ra bản sửa, giải thích lý do và link tới bài grammar liên quan.
- **Sentence builder** cho beginner: kéo thả khối từ để tạo câu đúng.
- **Journal mode**: viết nhật ký hằng ngày, AI chữa nhẹ nhàng, theo dõi tiến bộ qua thời gian.
- **Handwriting recognition** (Nhật/Trung/Hàn): viết chữ trên màn hình cảm ứng, AI nhận diện và đánh giá thứ tự nét.

## 3. Test Prep — Luyện thi chứng chỉ

### 3.1. Chứng chỉ hỗ trợ (roadmap)

| Ngôn ngữ | Chứng chỉ | Phase |
|----------|-----------|-------|
| Anh | TOEIC L/R, TOEIC S/W, IELTS Academic, IELTS General, TOEFL iBT | Phase 1 |
| | Cambridge (KET, PET, FCE, CAE, CPE), PTE, Duolingo English Test | Phase 2 |
| | VSTEP (Việt Nam), Aptis | Phase 3 |
| Trung | HSK 1–9, HSKK (Speaking) | Phase 1 |
| | TOCFL | Phase 2 |
| Nhật | JLPT N5–N1 | Phase 1 |
| | J.TEST, BJT (Business) | Phase 2 |
| Hàn | TOPIK I (level 1–2), TOPIK II (level 3–6) | Phase 2 |
| Đức | Goethe A1–C2, TestDaF | Phase 3 |
| Pháp | DELF A1–B2, DALF C1–C2, TEF | Phase 3 |
| Tây Ban Nha | DELE | Phase 3 |

### 3.2. Tính năng Test Prep

- **Diagnostic test**: 30–45 phút khi bắt đầu, AI định level và weak areas.
- **Study plan generator**: cho deadline và target score, hệ thống sinh kế hoạch N tuần với bài hằng ngày.
- **Question bank**: 5,000+ câu cho mỗi chứng chỉ chính, gắn tag theo skill, difficulty, topic. Được biên soạn bởi expert team + licensed từ publisher chính thống khi có thể.
- **Timed drills**: luyện từng dạng với đồng hồ đếm ngược.
- **Full-length mock test**: mô phỏng đúng format + thời gian + giao diện chính thức.
- **AI Examiner**: chấm Writing/Speaking theo rubric đúng chuẩn, chấm điểm + feedback chi tiết từng tiêu chí.
- **Post-test analytics**: biểu đồ điểm theo skill, so sánh với mục tiêu, gợi ý bài tập khắc phục.
- **Proctored mock test** (gói Ultimate): webcam + mic + screen share được AI giám sát, phát hiện gian lận (nhìn ngang, mở tab khác, có người thứ hai) — báo cáo "điểm tin cậy".
- **Live mock test events**: tổ chức kỳ mock test chung mỗi tháng, có bảng xếp hạng, giải thưởng.

### 3.3. Chi tiết theo chứng chỉ (ví dụ IELTS)

IELTS có 4 kỹ năng: Listening (40 câu, 30 phút), Reading (40 câu, 60 phút), Writing (Task 1 + Task 2, 60 phút), Speaking (3 parts, 11–14 phút).

- **Listening**: 4 section theo đúng format, transcript bấm được sau khi làm bài, giải thích từng câu.
- **Reading**: 3 passage, 13 loại câu hỏi (T/F/NG, matching heading, summary completion…), mẹo làm từng loại.
- **Writing Task 1 (Academic)**: AI phân tích biểu đồ, chấm theo 4 tiêu chí của Cambridge; Task 2: essay argumentative, AI chấm + rewrite suggestions cho từng đoạn.
- **Speaking**: AI làm examiner hỏi theo flow 3 parts, chấm theo Fluency, Lexical, Grammar, Pronunciation.

## 4. AI Tutor & Conversational Features

### 4.1. Chat Tutor

- Chat text với AI tutor 24/7, AI hiểu level người học và điều chỉnh vocab/grammar.
- Giải đáp thắc mắc ngữ pháp, dịch câu, giải thích từ trong context.
- Tạo flashcard từ trong cuộc chat ngay lập tức.

### 4.2. Voice Tutor

- Gọi thoại với AI (WebRTC + Whisper + TTS realtime), latency < 800ms.
- Chọn voice (giọng Mỹ/Anh/Úc; Tokyo/Osaka; Bắc Kinh/Đài Loan…).
- Roleplay scenarios library (500+ scenarios).
- Sau mỗi cuộc, nhận bản transcript + đánh giá về fluency, grammar, vocab.

### 4.3. Explain Anything

Tại bất kỳ điểm nào trong app, người dùng có thể bấm "Explain" trên từ/câu/bài để AI giải thích bằng tiếng mẹ đẻ của họ.

## 5. Marketplace giáo viên (Tutoring)

- **Teacher profile**: bio, video intro, chứng chỉ (CELTA/TESOL/JLPT/HSK…), giờ dạy, giá (tự set trong khung min-max).
- **Booking**: xem lịch, đặt slot 25/50 phút.
- **Video call tích hợp**: WebRTC với SFU (Selective Forwarding Unit), session được ghi lại (opt-in).
- **Lesson materials**: teacher có thể gán bài tập từ content bank chung cho học viên.
- **Review system** hai chiều.
- **Payout** cho teacher: sau mỗi tuần, commission 15–25% tuỳ tier.

## 6. Live Classes (Group)

- Lớp 4–12 học viên, giáo viên dạy theo giáo trình có sẵn.
- Breakout rooms, whiteboard, realtime quiz, voice feedback.
- Recordings cho học viên xem lại trong 30 ngày.

## 7. Social & Community

- **Forums** theo ngôn ngữ và chứng chỉ.
- **Study groups** (private/public), shared goals, leaderboard nội bộ.
- **Language exchange**: matchmaking người học ngôn ngữ A muốn học B với người ngược lại; chat có AI moderation (chống spam, toxic, inappropriate content).
- **Feed**: bài đăng ngắn (200 từ bằng ngôn ngữ đang học), peer corrections, likes.
- **Challenge**: 30-day challenge, weekly challenge, có reward.

## 8. Gamification

- **XP & Levels**: mỗi hoạt động cho XP, người học lên level (tách biệt với level ngôn ngữ).
- **Streaks**: số ngày học liên tục. "Streak freeze" mua được bằng gems.
- **Gems/Coins**: thưởng khi hoàn thành bài, dùng để mua heart, freeze, revive, cosmetic.
- **Hearts** (cho beginners): sai nhiều mất heart, hết heart phải đợi hồi hoặc trả gems — cần cân nhắc, có tranh cãi về ethics (xem tài liệu 13).
- **Leagues**: 10 league từ Bronze → Diamond, thi tuần, lên/xuống hạng theo XP.
- **Achievements/Badges**: 200+ loại (học 100 từ Kanji, streak 365 ngày, hoàn thành HSK 4…).
- **Avatar & Profile customization**: cosmetic, pets (con chim/mèo/gấu trúc ảo nuôi theo tiến độ).

## 9. Content Discovery

- **Search**: tìm bài học, từ, chủ đề, đề thi.
- **Explore feed**: gợi ý bài đọc/video/podcast dựa vào level và interests.
- **Topics & Themes**: Travel, Business, Anime, K-pop, Cooking, Tech…

## 10. Personal Dashboard & Progress

- **Overview**: streak, XP tuần này, minutes learned, words mastered.
- **Skill radar chart**: 4 hoặc 6 trục (Listening/Reading/Writing/Speaking/Vocab/Grammar).
- **Journey map**: trực quan hoá lộ trình đã đi, đang ở đâu.
- **Predicted score** cho chứng chỉ mục tiêu (nếu đang ôn).
- **Weekly email report** với insight AI generated.

## 11. Parental & Institutional Dashboard

### Parental (gói Family):
- Xem tiến độ con, setting limit thời gian, content filter.

### School/Enterprise:
- Admin console: quản lý user, assign lộ trình, tạo lớp.
- Report xuất CSV/Excel, tích hợp LMS (SCORM, LTI 1.3), SSO (SAML, OIDC).
- White-label option (logo, màu sắc) cho enterprise lớn.

## 12. Accessibility & Localization

- UI đa ngôn ngữ (Việt, Anh, Trung, Nhật, Hàn, Pháp, Đức, Tây Ban Nha…).
- Hỗ trợ người khiếm thị: ARIA labels, screen reader testing.
- Hỗ trợ người khiếm thính: phụ đề cho mọi video, transcript cho mọi audio.
- Adjustable font size, dyslexia-friendly font option (OpenDyslexic).
- Dark mode / Light mode / System.

## 13. Offline Mode

- Download bài học, audio, video cho offline (mobile).
- SRS vẫn hoạt động offline, sync khi online.
- Limits theo gói (Free: không có; Plus: 3 bài; Pro+: không giới hạn).

## 14. Notifications

- Push notification lúc SRS due, streak sắp mất, goal hôm nay.
- Email: weekly report, các milestone, promo.
- In-app notification: achievement, league result, friend activity.
- Fully customizable frequency và loại.

## 15. Payment & Subscription Management

(Chi tiết ở tài liệu 10.)

- Tầng free vs paid, upgrade/downgrade mượt mà.
- Payment: Stripe (quốc tế), VNPay/MoMo/ZaloPay (VN), Alipay/WeChat Pay (TQ), mua in-app (Apple IAP, Google Play Billing).
- Gift subscription, referral program.

## Feature → Service Mapping (preview)

| Feature cluster | Services chính |
|-----------------|----------------|
| Vocabulary SRS | vocabulary-service, srs-service, content-service |
| Grammar drills | grammar-service, assessment-service |
| Listening/Dictation | media-service, assessment-service, content-service |
| Speaking/Pronunciation | speech-ai-service, assessment-service |
| Reading | content-service, dictionary-service |
| Writing | writing-ai-service, assessment-service |
| AI Tutor (chat/voice) | ai-tutor-service, speech-ai-service, llm-gateway |
| Test Prep | assessment-service, proctoring-service |
| Tutoring marketplace | tutor-service, booking-service, video-service, billing-service |
| Live classes | classroom-service, video-service |
| Social | social-service, moderation-service |
| Gamification | gamification-service, leaderboard-service |
| Progress / Analytics | progress-service, analytics-pipeline |
| Subscription | billing-service, payment-service, entitlement-service |
| Notifications | notification-service |

Chi tiết từng service xem [04-microservices-breakdown.md](./04-microservices-breakdown.md).
