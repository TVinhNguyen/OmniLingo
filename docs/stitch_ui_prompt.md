# OmniLingo — Stitch UI Design Master Prompt

> Copy từng section vào Stitch. Stitch hoạt động tốt nhất khi prompt ngắn gọn + tập trung 1 trang/1 component.
> Ở cuối file này là **cách dùng hiệu quả với Stitch**.

---

## 🎨 DESIGN SYSTEM (Prompt vào đầu mọi request)

```
Design system for OmniLingo — a premium language learning platform (Duolingo meets Notion).

Design tokens:
- Primary: Indigo #6366F1 (learning actions)
- Success: Emerald #10B981 (correct answers, streaks)  
- Warning: Amber #F59E0B (streak freeze, hearts warning)
- Danger: Rose #F43F5E (wrong answer, lost heart)
- XP/Gamification: Violet #8B5CF6
- Background: Slate-950 #0F172A (dark mode default)
- Surface: Slate-900 #1E293B
- Surface-2: Slate-800 #334155
- Text primary: Slate-50 #F8FAFC
- Text secondary: Slate-400 #94A3B8
- Border: Slate-700 #334155

Typography:
- Font: Inter (UI), "Noto Sans JP/SC/KR" (Asian language content)
- Headings: Semi-bold, tight tracking
- Body: 15px/1.6 line-height
- Code/IPA: JetBrains Mono

Corner radius: 12px (cards), 8px (inputs), 24px (buttons/pills)
Shadow: dark elevation with colored glow on interactive elements
Animation: spring physics, 200-300ms, ease-out
```

---

## 📱 PAGE LIST (22 trang / màn hình chính)

### AUTH & ONBOARDING (4 trang)
1. Landing Page (Web)
2. Onboarding — Chọn ngôn ngữ & mục tiêu
3. Placement Test (UI)
4. Login / Register

### CORE LEARNING (6 trang)
5. Home / Daily Dashboard
6. Skill Tree / Course Map
7. Lesson Player (Active Learning)
8. SRS Flashcard Session
9. AI Chat Tutor
10. AI Voice Tutor (gọi thoại)

### TEST PREP (2 trang)
11. Test Prep Hub
12. Mock Test — Active Session

### PRACTICE & IMMERSION (3 trang)
13. Reader (đọc bài + pop-up dictionary)
14. Vocabulary Lab (custom decks)
15. Explore / Content Discovery

### SOCIAL & GAMIFICATION (3 trang)
16. Community / Forums
17. League & Leaderboard
18. Profile & Achievements

### TUTOR MARKETPLACE (2 trang)
19. Tutor Marketplace (browse)
20. Live Session (video call UI)

### SETTINGS & BILLING (2 trang)
21. Settings & Notifications
22. Subscription / Pricing Page

---

## 🖥️ PAGE PROMPTS

### 1. Landing Page (Web)

```
Design a dark-mode landing page for OmniLingo, a language learning platform.

Hero section:
- Large headline: "Master Any Language. Deeply." (white, 64px, bold)
- Subheadline: "AI-powered SRS, test prep for IELTS/JLPT/HSK, 1-on-1 tutors — all in one app."
- CTA buttons: "Start for Free" (indigo, pill) + "See how it works" (ghost)
- Background: animated particle language symbols (hiragana, hanzi, hangul, latin) floating upward
- Preview: floating phone mockup showing the lesson player

Social proof bar:
- "500,000+ learners" | "96 languages" | "4.9★ App Store" | "Trusted by 800+ schools"

Features grid (3 columns):
- "Smart SRS" with flashcard icon
- "AI Conversation Tutor" with chat bubble
- "Test Prep (IELTS, JLPT, HSK)" with certificate icon
- "Phoneme Pronunciation AI" with waveform icon
- "Tutor Marketplace" with video call icon
- "Offline Mode" with download icon

Comparison section:
- "Why OmniLingo?" vs Duolingo, Anki, italki — showing OmniLingo ticks all boxes

Pricing preview section with 4 tiers: Free | Plus 99k | Pro 249k | Ultimate 599k

Footer: links, language switcher (VI/EN/JA/ZH/KO)
```

---

### 2. Onboarding — Chọn ngôn ngữ & mục tiêu

```
Design a multi-step onboarding flow, dark mode, step 1 of 5.

Step 1 — "What language do you want to learn?"
- Large headline at top
- Language grid (3 columns, 4 rows): 
  Each card: flag emoji (large) + language name (EN + native script) + number of learners
  Languages: Japanese 🇯🇵, Chinese 简体 🇨🇳, Korean 🇰🇷, English 🇬🇧, French 🇫🇷, German 🇩🇪, Spanish 🇪🇸, Vietnamese 🇻🇳, + "Request another"
  Selected state: indigo border glow + checkmark

Progress bar: 5 dots at top, step 1 filled

Step 2 (next screen): "What's your goal?"
- Option cards (icon + title + description):
  🎓 Pass a certificate (IELTS/TOEIC/JLPT...)
  💼 Professional communication  
  ✈️ Travel & survival phrases
  📺 Enjoy media in the original language
  💬 Find friends & culture

Step 3: "What's your current level?"
- 5 cards: Complete beginner / Learned some basics / Can handle everyday situations / Advanced / Let me take a placement test
```

---

### 3. Home / Daily Dashboard

```
Design the main home screen of OmniLingo language learning app, dark mode.

Top bar:
- Left: avatar + "Good morning, Minh 👋"
- Center: flame streak "🔥 42" + xp bar "1,240 XP today"  
- Right: gems "💎 380" + heart "❤️ 5/5" + notification bell

Daily Goal card:
- Circular progress ring (indigo) showing 2/5 lessons today
- "2 of 5 lessons complete" | "You're on your daily goal!"
- Continue button (large, indigo)

"Continue where you left off" section:
- Lesson card: Unit 3 · Lesson 7 "Ordering food at a restaurant"  
  Progress bar 60%, thumbnail, estimated 8 min, "Resume" button

"Due for review" section:
- SRS card stack: "47 cards due" | deck icon | language flag | "Review Now" button

Quick actions row (horizontal scroll):
- AI Chat | Voice Call | Read | Practice Speaking | Grammar Ref

"Recommended for you" section:
- 2-3 lesson cards based on weak skills (e.g., "Your Listening score is behind — try this")

Streak calendar: last 7 days shown as circles (filled green/empty gray)

Bottom navigation (5 tabs):
- 🏠 Home | 🌳 Learn | 👤 Profile | 🏆 Leagues | 💬 Community
```

---

### 4. Skill Tree / Course Map

```
Design the learning path / skill tree screen for a Japanese language course, dark mode.

Header:
- "Japanese · JLPT N5 → N1 Path" with progress "12% complete"
- Level badges: N5 🟢 Current | N4 🔒 | N3 🔒 | N2 🔒 | N1 🔒

Skill tree (vertical scroll, branching):
- Top: START HERE node (completed, gold checkmark)
- Section "Hiragana & Katakana" (Unit 1): 5 lesson nodes in a line, all green
- Section "Greetings & Basics" (Unit 2): 5 nodes, 3 green 1 current(glowing) 1 locked
- Current node: pulsing indigo glow, "CONTINUE" label
- Locked nodes: gray, lock icon
- Bonus branch off to side: "Kanji Challenge" (optional)
- Section "Numbers & Time" (Unit 3): all locked, shows "Unlock after Unit 2"

Node card (when tapped):
- Small popup: Lesson name | Estimated time | Skills practiced | "Start" button

Hexagon skill chart (floating bottom sheet):
- 6 axes: Listening, Reading, Speaking, Writing, Vocabulary, Grammar
- User's current radar chart filled in indigo

Track switcher at top: "General Japanese" | "JLPT Prep" | "Business Japanese" (pills)
```

---

### 5. Lesson Player — Active Learning

```
Design the active lesson player screen for OmniLingo, dark mode.

This shows a multiple-choice vocabulary exercise.

Top bar:
- "✕" close | progress bar (filled 40%) | ❤️❤️❤️❤️❤️ hearts
- Lesson title "Unit 2 · Greetings" small subtitle

Content area (center):
- Question: Large text "What does おはようございます mean?" 
  Below question: audio play button 🔊
  
- Answer choices (4 cards, vertical stack):
  Each: rounded card with 1 letter label (A/B/C/D) + answer text
  States: default (slate-800), selected (indigo border), correct (emerald bg + ✓), wrong (rose bg + ✗)
  
- Selected "Good morning" card: indigo glow border
- "Check" button at bottom (indigo, disabled until selection)

After answering — Result state:
- Bottom sheet slides up:
  ✅ Correct! (emerald) or ❌ Incorrect (rose)
  Explanation text: "おはよう is informal, ございます makes it formal. Used before ~10am"
  "Tap anywhere to continue" or "Continue" button

Exercise type indicator (small pills at top):
- 📚 Vocabulary | Shows which activity: 3/8
```

---

### 6. SRS Flashcard Session

```
Design the SRS flashcard review session, dark mode.

Header: "47 cards to review · SRS Session" | progress "5/47 done" | X to pause

Card (centered, large, 3D flip effect):
Front face:
- Japanese text large "食べる" (Taberu)
- Small: "JPᵧₙ" tag (N5 vocabulary)
- Tap hint: "Tap to reveal"

Back face (after flip):
- Reading: "たべる" (in smaller text)
- Meaning: "to eat" (large, white)
- Example sentence: "毎日ご飯を食べる" 
  Translation: "I eat rice every day"
- Audio button 🔊
- Mnemonic note (user's own): "tabe = table, eating at table"
- Etymology/radical breakdown (for kanji)

Rating buttons (4 buttons, below card):
❌ Again | 😓 Hard | ✓ Good | ⭐ Easy
Subtext: "Again: 10min | Hard: 1d | Good: 4d | Easy: 12d"

Bottom stats: Today's session: 42 reviewed · 5 new · Accuracy 78%
```

---

### 7. AI Chat Tutor

```
Design the AI chat tutor screen, dark mode, conversational UI.

Header:
- Avatar: AI character (friendly anime-style robot/owl mascot) + name "Haru — Japanese Tutor"
- "Online · N3 mode" status indicator
- "Voice call" button top right

Chat area (scrollable):
User bubble (right, indigo): "How do I use は vs が particle? I keep getting confused"

AI bubble (left, slate-800):
- Avatar thumbnail
- Formatted response with:
  - Plain text explanation
  - Japanese example: は is used for topic, が for subject
  - Code-style block: 「私は学生です」vs「私が学生です」
  - "📌 Save to Grammar Notes" button below

AI bubble #2:
- "Want me to quiz you on this?" 
- Two quick reply buttons: [Yes, quiz me!] [Show more examples]

Input bar (bottom):
- Text field "Type in Japanese or English..."
- 🎤 voice input | 📸 photo (explain this) | ⌨️ language keyboard switcher
- Send button

Contextual AI buttons (above input):
- "Explain" | "Translate" | "Correct my Japanese" | "Roleplay"

Session info floating chip: "Pro plan · Unlimited messages"
```

---

### 8. Test Prep Hub

```
Design the Test Prep section home screen, dark mode.

Header: "Test Prep" | "IELTS Academic · Target 7.0 · Exam in 42 days"

Target score progress card:
- IELTS Estimated score band: 6.0 (large, indigo)
- "Need 1.0 more band to reach target"
- 4 sub-scores: L:6.5 | R:6.0 | W:5.5* (underperforming, rose) | S:6.0
- Asterisk: "Writing needs most work"

Today's study plan (AI-generated):
- Task 1: "IELTS Listening Section 3 — Matching (15 min)" [Start]
- Task 2: "Writing Task 2 — Opinion Essay Practice (30 min)" [Start]  
- Task 3: "Grammar: Conditional sentences review (10 min)" [Start]
- Progress: 0/3 tasks done

Quick practice grid (2x2):
- 🎧 Listening Drill | 📖 Reading Strategy
- ✍️ Writing (AI grader) | 🎤 Speaking Mock

Full mock test card:
- "IELTS Full Mock Test" | 2h 45min | "Simulate real exam conditions"
- "Last attempt: Band 6.0 · 14 days ago"
- [Start Proctored Mock] (Ultimate) | [Start Regular Mock]

Question bank banner:
- "8,500 IELTS questions · 23 topic areas · Filtered by weak areas"
- [Browse Questions]
```

---

### 9. Reader (đọc bài + dictionary)

```
Design the interactive reader screen for language learning, dark mode.

Header: article title "東京の春：桜と日本文化" | "NHK Easy · N4 Level · 4 min read"
Progress bar showing reading position

Settings bar: 
- Furigana toggle (ON) | Font size slider | 
- Reading speed estimate | Bookmark | Share

Article content area:
- Japanese text with furigana above each kanji (small ruby text)
- Text is tappable — when word tapped:

Pop-up card (bottom sheet, slides up):
- Word: "桜" (Sakura)
- Reading: "さくら"  
- Part of speech: Noun
- Meaning: "Cherry blossom; cherry tree"
- JLPT level: N4
- Example sentence with audio
- [+ Add to SRS deck] button (indigo)
- [Mark as known] (ghost button)

Comprehension progress:
- Small floating chip: "43 new words seen · 12 added to SRS"

"Words in this article" drawer (slides from right):
- Color coded: green (known) / yellow (learning) / gray (new)
- Count: 34 known, 8 learning, 56 new

Bottom sticky bar after finishing:
- Comprehension quiz: 3 questions
- "Share to feed" | "Next article →"
```

---

### 10. Vocabulary Lab (custom decks)

```
Design the vocabulary/flashcard deck management screen, dark mode.

Header: "Vocabulary Lab" | Search bar

My Decks section:
- Deck cards (list, swipeable):
  - "JLPT N3 Core 1000 words" — 247/1000 learned · Due: 23 cards · Progress bar green
  - "Anime Vocabulary" (custom) — 150 cards · Due: 5 · Progress bar blue
  - "Business Japanese" — 89 cards · Due: 0 (all caught up! ✨)
  - [+ Create new deck] card with dashed border

Top section: Stats strip
- Total words: 1,287 | Learning: 421 | Mastered: 398 | Overdue: 28

Import options modal (when + tapped):
- Import from Anki (.apkg)
- Import from Quizlet
- Import from CSV
- Browse Community Decks
- Create from scratch

Community Decks browser:
- Filter pills: Language | Level | Topic | Rating
- Deck card: "WaniKani N5 Vocab Pack" | ⭐4.8 | 12k users | [Preview] [Add]

Active deck detail (when deck tapped):
- Deck name + card count + mastery %
- [Review due (23)] | [Learn new words] | [Browse all cards]
- Card list with mastery indicator bars
```

---

### 11. League & Leaderboard

```
Design the gamification league screen, dark mode.

My League card (top, prominent):
- League name: "Gold League 🥇"  
- This week: "Ends in 3 days 14h"
- Progress bar: "You're #4 — top 3 advance to Platinum! Push!"
- Row above: #3 user at 2,840 XP (close!)

Leaderboard (vertical list, top 10):
- Rank | Avatar | Username | XP this week | Flag of language learning
- #1: 🏆 Nguyen Van A — 4,280 XP
- #2: Tanaka M — 3,910 XP  
- #3: Park S — 3,420 XP
- #4: [YOUR NAME] ← highlighted row (indigo bg) — 3,280 XP
- ...
- Top 3: gold/silver/bronze ring on avatar

Bottom zones:
- Green zone: "Advance to Platinum" (top 3)
- Gray zone: Stay in Gold (4-7)
- Red zone: "Demote to Silver" (bottom 3, pulsing warning)

My stats this week:
- 3,280 XP | 6-day streak | 42 lessons | 287 words reviewed

Tab switcher: [Weekly League] | [Friends] | [All Time]

Weekly XP chart: 7-day bar chart showing daily XP earned
```

---

### 12. Profile & Achievements

```
Design the user profile screen, dark mode.

Profile header:
- Large avatar (customizable, shows chosen pet: a cute panda 🐼)
- Display name: "Minh Nguyen" | Username "@minh.learns.jp"
- Title/badge: "Kanji Warrior 🗡️" (earned achievement badge)
- Edit profile button

Stats grid (2x3):
- 🔥 Streak: 42 days
- ⚡ Total XP: 48,230
- 📚 Words mastered: 1,247  
- ✅ Lessons complete: 384
- 🏆 Leagues won: 7
- 📅 Days learning: 156

Languages section:
- Japanese flag | Hexagon chart (6 axes) | N4 level | "since 8 months"
- "Add another language" card

Achievements grid (unlock badges):
- Badge cards: 
  "🔥 Streak Legend" (365-day streak, locked gray)
  "📖 Bookworm" (read 100 articles, unlocked gold)
  "🎌 Hiragana Master" (unlocked)
  "🏔️ N3 Summit" (locked, progress 67%)
  "👥 Community Helper" (unlocked)  
  "⚡ XP Machine" (70,000 XP, progress 69%)

Avatar shop section:
- Current outfit/pet | "Change Avatar" → opens cosmetics store
- Show gems balance: 💎 380 gems

Activity heatmap: GitHub-style calendar showing learning activity last 3 months
```

---

### 13. Tutor Marketplace

```
Design the tutor marketplace browsing screen, dark mode.

Header: "Find a Tutor" | Search bar (search teacher name/language/topic)

Filter row (horizontal scroll pills):
Japanese | English | Chinese | Korean | IELTS | JLPT N3 | Conversation | Business | ★ 4.5+ | ¥/hour | Available now

Featured tutor card (large, top):
- Photo | Name: "Tanaka Yuki" | Native Japanese 🇯🇵
- Specialties: JLPT N5-N2, Anime Japanese, Conversation
- Rating: ⭐ 4.98 (312 reviews)
- Price: 450k/50min (Ultimate members: 60 credits/session)
- "Next available: Today 19:00" | [Book Trial (25 min — free)]

Tutor list (cards):
Each card:
- Photo (circle) | Name | Flag | Level tags
- Intro snippet: "10 years teaching, certified JLPT tutor..."
- ⭐ rating | # reviews | price/50min
- Availability dots (this week: Mon✓ Wed✓ Fri✓)
- [View Profile] | [Book Now]

Tutor profile modal/page (when tapped):
- Video intro (auto-play muted)
- Full bio, certificates badges  
- Specialties grid
- Review section (students' comments + ratings)
- Calendar picker: week view with available slots
- Select duration: 25 min (intro) | 50 min | 80 min
```

---

### 14. Subscription / Pricing Page

```
Design the subscription/pricing screen, mobile-friendly, dark mode.

Header: "Upgrade to unlock everything 🚀" 
Subtext: "4 million learners chose Premium — here's why"

Subscription toggle: [Monthly] [Annual ← 33% OFF]

Plan cards (horizontal scroll or vertical):

Free card (current plan, greyed):
- 0đ/tháng
- ✓ 5 lessons/day | ✓ Basic SRS | ✓ 10 AI messages/day
- ✗ Unlimited | ✗ Offline | ✗ AI Tutor
- [Current plan]

Plus card: 
- 99k/tháng (or 899k/năm)
- ✓ Unlimited lessons | ✓ Unlimited SRS | ✓ No ads | ✓ Offline
- ✗ AI Tutor (limited) | ✗ Mock tests
- [Upgrade to Plus]

Pro card (MOST POPULAR badge, indigo glow):
- 249k/tháng (1,999k/năm)
- Everything in Plus PLUS:
- ✓ Unlimited AI Tutor (Claude) | ✓ Unlimited mock tests
- ✓ AI Writing grader (unlimited) | ✓ 2 live classes/month
- ✓ Advanced analytics
- [Upgrade to Pro] (large indigo button)

Ultimate card (premium gold):
- 599k/tháng (4,999k/năm)
- Everything in Pro PLUS:
- ✓ 4 tutor hours/month (60 credits)
- ✓ Unlimited live classes | ✓ Proctored mock tests
- ✓ Priority support (chat 4h response)
- [Go Ultimate]

Payment methods: VNPay | MoMo | ZaloPay | Visa | Mastercard

Trust signals: 🔒 Cancel anytime | 14-day money back | Secure payment
```

---

## 📦 COMPONENT PROMPTS (dùng riêng lẻ)

### Component A: Exercise Cards (6 types)

```
Design 6 exercise card types for a language learning app, show all in one screen, dark mode:

1. Multiple Choice: Question text + 4 answer cards (A/B/C/D)
2. Typing Input: Prompt + text field + on-screen keyboard (with language special chars)
3. Audio → Type: 🔊 play button + text input field (dictation)
4. Tap the Word: Sentence with highlighted blanks, word bank chips below to tap
5. Matching Pairs: Two columns, connect with lines (vocabulary matching)
6. Speaking Prompt: Microphone animation + "Say this:" prompt text + waveform

All cards should have:
- Progress bar top (40% complete)
- Hearts indicator ❤️❤️❤️❤️❤️
- Consistent dark theme with indigo accent
- Check/Continue button at bottom
```

---

### Component B: Navigation Bar

```
Design a bottom navigation bar for OmniLingo app, dark mode:
- 5 tabs: Home 🏠 | Learn 🌳 | Practice 💬 | Leagues 🏆 | Profile 👤
- Active tab: indigo with label + slight glow
- Inactive: slate-400
- Show notification badge (red dot) on Leagues tab
- Height: 80px including safe area
- Background: slate-900 with blur/frosted glass effect
- Center "Learn" tab slightly raised (prominent CTA)
```

---

### Component C: XP / Reward Celebration

```
Design a lesson completion celebration screen, dark mode:

Full screen overlay celebration when user completes a lesson:
- Large animated ⭐ or trophy in center
- "+120 XP" in large violet text with burst particles
- Streak indicator: "🔥 42 day streak!" 
- New words learned: "12 new words • 3 grammar points"
- Performance: "Perfect score! 💎" or "Good job! Keep going"
- Gems earned: "+5 💎"
- Two buttons: "Continue" (indigo, large) | "Review mistakes" (ghost)
- Confetti animation (green and indigo particles)
```

---

### Component D: Flashcard Component

```
Design a single SRS flashcard component, dark mode, showing front and back:

Front state:
- Language tag (JP N4)
- Main word: "食べる" (large, 48px white)
- Small romanization: "taberu"
- "Tap to reveal" ghost text at bottom

Back state (flipped, 3D transform):
- Reading: "たべる" 
- Meaning: "to eat; to have a meal" (large)
- Example: Japanese sentence with translation
- Audio play button
- Etymology/mnemonic note area
- 4 rating buttons: Again | Hard | Good | Easy (with next review time shown)
```

---

### Component E: Skill Hexagon Chart

```
Design a skill radar/hexagon chart component for language proficiency:
- 6 axes: Listening, Reading, Speaking, Writing, Vocabulary, Grammar
- User data filled in semi-transparent indigo
- Outer ring = max level (C2 / N1 / HSK9)
- Each axis has level labels (A1 → C2 or N5 → N1)
- Hover/tap on axis: shows exact score + progress bar + "Top weak skills to practice"
- Small legend below
- Size: fits in a card (320px × 300px)
- Theme: dark, glowing indigo fill
```

---

### Component F: Streak Calendar

```
Design a 7-day learning streak tracker component:
- 7 circles in a row (Mon → Sun)
- Filled green: days studied
- Empty gray: missed days
- Today: outlined with indigo glow
- Streak flame icon: 🔥 42 with number
- Small "Streak freeze used" indicator if applicable
- "You've studied 6 of the last 7 days" text below
- Freeze streak button with gem cost: [❄️ Freeze for 10💎]
```

---

## 🛠️ CÁCH DÙNG STITCH HIỆU QUẢ

### Workflow đề xuất:

1. **Bắt đầu bằng Design System prompt** → Generate màu, typography, component styles cơ bản

2. **Từng trang, copy prompt tương ứng** → Generate → Refine bằng follow-up prompts:
   - "Make the buttons larger and more prominent"
   - "Add a loading skeleton state for the lesson cards"
   - "Make the font larger for the Japanese text"
   - "Add spacing between the cards"

3. **Thứ tự design nên làm**:
   - Lesson Player → Home Dashboard → Skill Tree → SRS Session
   - (Core experience trước, peripheral sau)

4. **Refinement prompts hay dùng**:
   - "Add micro-animation hints (arrow keys, bounce)"
   - "Show the error/wrong answer state"
   - "Show the loading/skeleton placeholder"
   - "Design the empty state when no data"
   - "Make it responsive for tablet"
   - "Add dark overlay/modal version"

5. **Export notes**: Stitch outputs React components — đặt vào `apps/web/components/` khi tích hợp.

---

## 📐 LAYOUT SPECS

| Screen | Breakpoint | Notes |
|--------|-----------|-------|
| Mobile (default) | 390px | iOS/Android first |
| Tablet | 768px | iPad: 2-column cards |
| Web | 1280px+ | Desktop: sidebar nav replaces bottom tab |

**Navigation pattern**:
- Mobile: Bottom tab bar (5 tabs)
- Tablet/Desktop: Left sidebar (collapsed by default)

**Content max-width**: 640px (centered on web)

**Safe areas**: iOS: bottom 34px | Android: variable
