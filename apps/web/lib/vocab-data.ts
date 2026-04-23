export type CardStatus = "new" | "learning" | "due" | "mastered"

export type VocabCard = {
  id: string
  lemma: string
  ipa: string
  meaning: string
  pos: "noun" | "verb" | "adj" | "adv" | "prep" | "conj" | "interj"
  example: string
  exampleTranslation: string
  status: CardStatus
  nextReview: string
  tags: string[]
  difficulty: number
  image?: string
  audio?: string
  collocations?: string[]
}

export type Deck = {
  id: string
  name: string
  emoji: string
  language: string
  languageCode: string
  level: string
  description: string
  visibility: "private" | "public" | "shared"
  cardCount: number
  createdAt: string
  updatedAt: string
  color: string
  author?: { name: string; avatar: string }
  tags: string[]
  stats: { new: number; learning: number; due: number; mastered: number }
  heatmap: number[] // 90 days, 0-4 intensity
}

export const decksData: Deck[] = [
  {
    id: "ielts-5000",
    name: "IELTS Vocabulary 5000",
    emoji: "🎓",
    language: "Tiếng Anh",
    languageCode: "en",
    level: "B2",
    description: "Bộ từ vựng IELTS 5000 từ phổ biến nhất, sắp xếp theo tần suất xuất hiện đề.",
    visibility: "private",
    cardCount: 487,
    createdAt: "2026-01-15",
    updatedAt: "2026-04-19",
    color: "from-[#5352a5] to-[#a19ff9]",
    tags: ["ielts", "academic", "english"],
    stats: { new: 47, learning: 68, due: 32, mastered: 340 },
    heatmap: Array.from({ length: 90 }, (_, i) => {
      const seed = (i * 9301 + 49297) % 233280
      return Math.floor((seed / 233280) * 5)
    }),
  },
  {
    id: "jlpt-n5",
    name: "JLPT N5 Core 800",
    emoji: "🇯🇵",
    language: "Tiếng Nhật",
    languageCode: "ja",
    level: "N5",
    description: "Từ vựng cốt lõi cho kỳ thi JLPT N5, bao phủ 95% đề thi.",
    visibility: "private",
    cardCount: 800,
    createdAt: "2026-02-01",
    updatedAt: "2026-04-19",
    color: "from-[#702ae1] to-[#d56ba6]",
    tags: ["jlpt", "japanese", "beginner"],
    stats: { new: 24, learning: 36, due: 48, mastered: 540 },
    heatmap: Array.from({ length: 90 }, (_, i) => {
      const seed = (i * 7121 + 31249) % 233280
      return Math.floor((seed / 233280) * 5)
    }),
  },
  {
    id: "business-english",
    name: "Business English Essentials",
    emoji: "💼",
    language: "Tiếng Anh",
    languageCode: "en",
    level: "B2",
    description: "Từ vựng chuyên nghiệp cho email, meeting, và presentation.",
    visibility: "public",
    cardCount: 240,
    createdAt: "2026-03-01",
    updatedAt: "2026-04-18",
    color: "from-[#983772] to-[#702ae1]",
    author: { name: "Emma Harrison", avatar: "/tutor-emma.jpg" },
    tags: ["business", "professional", "english"],
    stats: { new: 15, learning: 22, due: 8, mastered: 95 },
    heatmap: Array.from({ length: 90 }, (_, i) => {
      const seed = (i * 5743 + 18131) % 233280
      return Math.floor((seed / 233280) * 5)
    }),
  },
]

export function getDeckById(id: string): Deck {
  return decksData.find((d) => d.id === id) ?? decksData[0]
}

export const cardsData: Record<string, VocabCard[]> = {
  "ielts-5000": [
    {
      id: "c1",
      lemma: "afraid",
      ipa: "/əˈfreɪd/",
      meaning: "sợ hãi, lo sợ",
      pos: "adj",
      example: "She was afraid of making a mistake in the interview.",
      exampleTranslation: "Cô ấy sợ mắc lỗi trong buổi phỏng vấn.",
      status: "learning",
      nextReview: "2026-04-20",
      tags: ["feeling", "common"],
      difficulty: 2,
      collocations: ["afraid of", "afraid to do"],
    },
    {
      id: "c2",
      lemma: "terrified",
      ipa: "/ˈterəfaɪd/",
      meaning: "cực kỳ sợ hãi, khiếp đảm",
      pos: "adj",
      example: "The child was terrified by the loud thunder.",
      exampleTranslation: "Đứa bé hoảng sợ vì tiếng sấm lớn.",
      status: "new",
      nextReview: "2026-04-19",
      tags: ["feeling", "strong"],
      difficulty: 3,
      collocations: ["terrified of", "absolutely terrified"],
    },
    {
      id: "c3",
      lemma: "anxious",
      ipa: "/ˈæŋkʃəs/",
      meaning: "lo lắng, bồn chồn",
      pos: "adj",
      example: "Parents are anxious about their children's future.",
      exampleTranslation: "Cha mẹ lo lắng về tương lai con cái.",
      status: "learning",
      nextReview: "2026-04-20",
      tags: ["feeling"],
      difficulty: 3,
      collocations: ["anxious about", "feel anxious"],
    },
    {
      id: "c4",
      lemma: "nervous",
      ipa: "/ˈnɜːrvəs/",
      meaning: "hồi hộp, lo lắng",
      pos: "adj",
      example: "I get nervous before giving a speech.",
      exampleTranslation: "Tôi hồi hộp trước khi phát biểu.",
      status: "due",
      nextReview: "2026-04-19",
      tags: ["feeling", "common"],
      difficulty: 2,
      collocations: ["nervous about", "nervous breakdown"],
    },
    {
      id: "c5",
      lemma: "scared",
      ipa: "/skeəd/",
      meaning: "sợ, giật mình",
      pos: "adj",
      example: "Don't be scared, the dog is friendly.",
      exampleTranslation: "Đừng sợ, con chó này thân thiện.",
      status: "new",
      nextReview: "2026-04-19",
      tags: ["feeling", "common"],
      difficulty: 1,
      collocations: ["scared of", "scared to death"],
    },
    {
      id: "c6",
      lemma: "petrified",
      ipa: "/ˈpetrɪfaɪd/",
      meaning: "cứng đờ vì sợ, kinh hãi",
      pos: "adj",
      example: "She was petrified when she saw the snake.",
      exampleTranslation: "Cô ấy đứng cứng đờ khi nhìn thấy con rắn.",
      status: "new",
      nextReview: "2026-04-19",
      tags: ["feeling", "strong", "C1"],
      difficulty: 4,
      collocations: ["petrified of", "absolutely petrified"],
    },
    {
      id: "c7",
      lemma: "fearful",
      ipa: "/ˈfɪərfəl/",
      meaning: "lo sợ, e ngại",
      pos: "adj",
      example: "She cast a fearful glance at the shadow.",
      exampleTranslation: "Cô ấy liếc nhìn cái bóng với vẻ lo sợ.",
      status: "due",
      nextReview: "2026-04-19",
      tags: ["feeling", "formal"],
      difficulty: 3,
      collocations: ["fearful of", "fearful that"],
    },
    {
      id: "c8",
      lemma: "benevolent",
      ipa: "/bəˈnevələnt/",
      meaning: "nhân từ, tốt bụng",
      pos: "adj",
      example: "A benevolent smile appeared on her face.",
      exampleTranslation: "Một nụ cười nhân từ hiện trên khuôn mặt cô ấy.",
      status: "mastered",
      nextReview: "2026-05-19",
      tags: ["personality", "formal"],
      difficulty: 4,
    },
    {
      id: "c9",
      lemma: "meticulous",
      ipa: "/məˈtɪkjələs/",
      meaning: "tỉ mỉ, cẩn thận",
      pos: "adj",
      example: "He is meticulous about his work.",
      exampleTranslation: "Anh ấy rất tỉ mỉ trong công việc.",
      status: "mastered",
      nextReview: "2026-06-19",
      tags: ["personality", "academic"],
      difficulty: 4,
    },
    {
      id: "c10",
      lemma: "profound",
      ipa: "/prəˈfaʊnd/",
      meaning: "sâu sắc, thâm thuý",
      pos: "adj",
      example: "The book had a profound effect on me.",
      exampleTranslation: "Cuốn sách có ảnh hưởng sâu sắc đến tôi.",
      status: "mastered",
      nextReview: "2026-05-20",
      tags: ["academic", "C1"],
      difficulty: 4,
    },
  ],
}

export function getCards(deckId: string): VocabCard[] {
  return cardsData[deckId] ?? cardsData["ielts-5000"]
}

export const deckTemplates = [
  { id: "top-1000", emoji: "🏆", name: "Top 1000 Words", description: "Từ phổ biến nhất trong hội thoại", count: 1000, tag: "General" },
  { id: "business", emoji: "💼", name: "Business English", description: "Email, meeting, presentation", count: 240, tag: "Work" },
  { id: "ielts", emoji: "🎓", name: "IELTS Vocabulary", description: "Từ học thuật band 7+", count: 5000, tag: "Exam" },
  { id: "toeic", emoji: "📊", name: "TOEIC 600-800", description: "Từ vựng cho kỳ thi TOEIC", count: 1800, tag: "Exam" },
  { id: "daily", emoji: "☀️", name: "Daily Conversation", description: "Tiếng Anh giao tiếp hàng ngày", count: 500, tag: "General" },
  { id: "travel", emoji: "✈️", name: "Travel English", description: "Sân bay, khách sạn, nhà hàng", count: 320, tag: "Lifestyle" },
  { id: "academic", emoji: "📚", name: "Academic Writing", description: "Từ nối, cấu trúc học thuật", count: 450, tag: "Exam" },
  { id: "tech", emoji: "💻", name: "Tech & IT English", description: "Software, AI, engineering", count: 680, tag: "Work" },
]

export const templatePreview: Record<string, Array<{ lemma: string; meaning: string }>> = {
  "top-1000": [
    { lemma: "achieve", meaning: "đạt được" },
    { lemma: "consider", meaning: "xem xét" },
    { lemma: "ensure", meaning: "đảm bảo" },
    { lemma: "maintain", meaning: "duy trì" },
    { lemma: "obtain", meaning: "thu được" },
  ],
  business: [
    { lemma: "stakeholder", meaning: "bên liên quan" },
    { lemma: "leverage", meaning: "tận dụng" },
    { lemma: "streamline", meaning: "đơn giản hóa" },
    { lemma: "deliverable", meaning: "sản phẩm bàn giao" },
    { lemma: "quarterly", meaning: "hàng quý" },
  ],
  ielts: [
    { lemma: "substantial", meaning: "đáng kể" },
    { lemma: "diminish", meaning: "giảm bớt" },
    { lemma: "inherent", meaning: "vốn có" },
    { lemma: "prevalent", meaning: "phổ biến" },
    { lemma: "subsequent", meaning: "tiếp theo" },
  ],
  toeic: [
    { lemma: "revenue", meaning: "doanh thu" },
    { lemma: "vendor", meaning: "nhà cung cấp" },
    { lemma: "invoice", meaning: "hoá đơn" },
    { lemma: "merger", meaning: "sáp nhập" },
    { lemma: "warranty", meaning: "bảo hành" },
  ],
  daily: [
    { lemma: "hang out", meaning: "đi chơi" },
    { lemma: "show up", meaning: "xuất hiện" },
    { lemma: "figure out", meaning: "tìm ra" },
    { lemma: "run into", meaning: "tình cờ gặp" },
    { lemma: "take off", meaning: "khởi hành" },
  ],
  travel: [
    { lemma: "boarding pass", meaning: "thẻ lên máy bay" },
    { lemma: "customs", meaning: "hải quan" },
    { lemma: "check-in", meaning: "nhận phòng" },
    { lemma: "itinerary", meaning: "lịch trình" },
    { lemma: "departure", meaning: "khởi hành" },
  ],
  academic: [
    { lemma: "furthermore", meaning: "hơn nữa" },
    { lemma: "nevertheless", meaning: "tuy nhiên" },
    { lemma: "consequently", meaning: "do đó" },
    { lemma: "hypothesis", meaning: "giả thuyết" },
    { lemma: "methodology", meaning: "phương pháp" },
  ],
  tech: [
    { lemma: "deploy", meaning: "triển khai" },
    { lemma: "bandwidth", meaning: "băng thông" },
    { lemma: "latency", meaning: "độ trễ" },
    { lemma: "scalable", meaning: "mở rộng được" },
    { lemma: "refactor", meaning: "tái cấu trúc" },
  ],
}
