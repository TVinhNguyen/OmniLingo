"use client"

import { motion } from "motion/react"

const testimonials = [
  {
    quote:
      "Đạt IELTS 7.5 sau 4 tháng ôn thi với OmniLingo. AI grader cho feedback chi tiết hơn cả giáo viên tôi từng học.",
    author: "Minh Anh",
    role: "Du học sinh Canada",
    score: "IELTS 7.5",
    avatar: "#a19ff9",
  },
  {
    quote:
      "JLPT N3 trong 6 tháng từ zero. Flashcard SRS + AI Tutor voice giúp tôi quen phát âm rất nhanh.",
    author: "Tuấn Đạt",
    role: "Kỹ sư phần mềm",
    score: "JLPT N3",
    avatar: "#983772",
  },
  {
    quote:
      "Giáo viên bản xứ rất tuyệt. Giá hợp lý, dễ book, bài học có giáo trình rõ ràng.",
    author: "Hà Linh",
    role: "Marketing Manager",
    score: "HSK 5",
    avatar: "#702ae1",
  },
  {
    quote:
      "Con tôi học tiếng Anh đều đặn nhờ gamification. Streak 180 ngày rồi, tôi còn được parental dashboard.",
    author: "Chị Phương",
    role: "Phụ huynh",
    score: "Family Plan",
    avatar: "#5352a5",
  },
  {
    quote:
      "Đi làm bận rộn nhưng chỉ cần 15 phút/ngày trên đường. Podcast có transcript tap-to-translate là tuyệt vời.",
    author: "Quang Huy",
    role: "Doanh nhân",
    score: "TOEIC 920",
    avatar: "#a19ff9",
  },
  {
    quote:
      "Voice tutor như nói chuyện với người thật. Phát âm cải thiện rõ rệt chỉ sau 2 tuần.",
    author: "Nguyễn Hằng",
    role: "Sinh viên",
    score: "TOPIK 4",
    avatar: "#983772",
  },
]

export function Testimonials() {
  return (
    <section className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Câu chuyện thành công
          </p>
          <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">
            3.2 triệu học viên,{" "}
            <span className="text-gradient-primary">vô số thành tựu</span>
          </h2>
        </div>
      </div>

      <div className="mt-14 relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent"
        />

        <motion.div
          className="flex gap-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <article
              key={i}
              className="w-[360px] flex-shrink-0 rounded-3xl bg-surface-lowest p-6 shadow-ambient"
            >
              <div className="mb-4 flex items-center gap-1 text-amber-500">
                {"★★★★★".split("").map((s, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>
              <p className="text-base leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-ambient"
                  style={{ background: t.avatar }}
                >
                  {t.author.charAt(0)}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <span className="rounded-full bg-accent-container px-3 py-1 text-xs font-bold text-on-accent-container">
                  {t.score}
                </span>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
