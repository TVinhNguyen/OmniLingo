import {
  Brain,
  MessageSquareText,
  GraduationCap,
  Users,
  Radio,
  Trophy,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "SRS Flashcard",
    desc: "Thuật toán lặp lại ngắt quãng giúp ghi nhớ 10x nhanh hơn. Nhập từ Anki/Quizlet/CSV.",
    accent: "from-[#5352a5] to-[#a19ff9]",
  },
  {
    icon: MessageSquareText,
    title: "AI Tutor",
    desc: "Trò chuyện văn bản hoặc gọi thoại 24/7. Phản hồi phát âm, ngữ pháp tức thì.",
    accent: "from-[#702ae1] to-[#983772]",
  },
  {
    icon: GraduationCap,
    title: "Luyện thi chứng chỉ",
    desc: "IELTS, TOEIC, TOEFL, HSK, JLPT, TOPIK, DELF, Goethe với đề thật và đề thi mô phỏng.",
    accent: "from-[#5352a5] to-[#702ae1]",
  },
  {
    icon: Users,
    title: "Giáo viên 1-1",
    desc: "Marketplace giáo viên bản xứ đã xác thực. Đặt lớp 25 hoặc 50 phút dễ dàng.",
    accent: "from-[#983772] to-[#702ae1]",
  },
  {
    icon: Radio,
    title: "Lớp trực tiếp nhóm",
    desc: "Lớp theo chủ đề, breakout room, quiz thời gian thực, record xem lại.",
    accent: "from-[#a19ff9] to-[#702ae1]",
  },
  {
    icon: Trophy,
    title: "Gamification",
    desc: "Streak, league (Bronze→Diamond), leaderboard bạn bè, huy hiệu 200+ điểm cột mốc.",
    accent: "from-[#983772] to-[#a19ff9]",
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className="mx-auto max-w-2xl text-center"
          data-aos="fade-up"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Tất cả trong một nền tảng
          </p>
          <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">
            Mọi công cụ bạn cần để{" "}
            <span className="text-gradient-primary">fluency</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Từ thẻ ghi nhớ đến luyện thi chứng chỉ, từ AI tutor đến giáo viên
            người bản xứ — tất cả trong một gói thuê bao.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className="group relative overflow-hidden rounded-3xl bg-surface-lowest p-7 shadow-ambient transition-all duration-500 hover:shadow-hover hover:-translate-y-1"
            >
              <div
                aria-hidden
                className={`absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30 bg-gradient-to-br ${f.accent}`}
              />
              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-white shadow-ambient`}
              >
                <f.icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="relative mt-5 text-xl font-bold">{f.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
