import Link from "next/link"
import {
  BookA,
  Languages as LanguagesIcon,
  Headphones,
  Mic,
  BookOpen,
  Pencil,
  ArrowRight,
} from "lucide-react"

const modules = [
  {
    href: "/practice/vocabulary",
    icon: BookA,
    title: "Từ vựng · SRS",
    desc: "Flashcard với thuật toán lặp lại ngắt quãng.",
    stats: "48 due",
    gradient: "from-[#5352a5] to-[#a19ff9]",
  },
  {
    href: "/practice/grammar",
    icon: LanguagesIcon,
    title: "Ngữ pháp",
    desc: "Từ A1 đến C2 · JLPT N5-N1 · HSK 1-9.",
    stats: "23 bài mới",
    gradient: "from-[#702ae1] to-[#983772]",
  },
  {
    href: "/practice/listening",
    icon: Headphones,
    title: "Nghe",
    desc: "Dictation, podcast, shadowing, gap-fill.",
    stats: "12 podcast",
    gradient: "from-[#983772] to-[#a19ff9]",
  },
  {
    href: "/practice/speaking",
    icon: Mic,
    title: "Nói",
    desc: "Phát âm, roleplay, mock speaking IELTS.",
    stats: "8 scenarios",
    gradient: "from-[#a19ff9] to-[#702ae1]",
  },
  {
    href: "/practice/reading",
    icon: BookOpen,
    title: "Đọc",
    desc: "Graded readers, bài đọc đời thường.",
    stats: "45 stories",
    gradient: "from-[#5352a5] to-[#702ae1]",
  },
  {
    href: "/practice/writing",
    icon: Pencil,
    title: "Viết",
    desc: "AI grading, journal, sentence builder.",
    stats: "AI grader",
    gradient: "from-[#983772] to-[#702ae1]",
  },
]

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Luyện tập
        </p>
        <h1 className="mt-1 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
          Chọn kỹ năng muốn rèn
        </h1>
        <p className="mt-1 text-muted-foreground">
          6 mô-đun luyện tập với AI feedback.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m, i) => (
          <Link
            key={m.href}
            href={m.href}
            data-aos="fade-up"
            data-aos-delay={i * 60}
            className="group relative overflow-hidden rounded-3xl bg-surface-lowest p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
          >
            <div
              className={`absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10 blur-2xl group-hover:opacity-25 transition-opacity bg-gradient-to-br ${m.gradient}`}
            />
            <div className="relative flex items-start justify-between">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-ambient ${m.gradient}`}
              >
                <m.icon className="h-7 w-7" />
              </span>
              <span className="rounded-full bg-surface-low px-3 py-1 text-xs font-semibold">
                {m.stats}
              </span>
            </div>
            <h3 className="relative mt-5 text-xl font-bold">{m.title}</h3>
            <p className="relative mt-1 text-sm text-muted-foreground">
              {m.desc}
            </p>
            <div className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Bắt đầu
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
