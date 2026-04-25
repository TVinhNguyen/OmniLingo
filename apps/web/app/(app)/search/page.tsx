"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { motion } from "motion/react"
import {
  Search,
  BookOpen,
  Sparkles,
  FileText,
  Users,
  Headphones,
  Star,
  TrendingUp,
  Clock,
  X,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type ResultType = "lesson" | "word" | "grammar" | "post" | "article" | "user"

type Result = {
  id: string
  type: ResultType
  title: string
  subtitle?: string
  meta?: string
  href: string
  emoji?: string
}

const allResults: Result[] = [
  // Lessons
  { id: "l1", type: "lesson", title: "Present Perfect cho du lịch", subtitle: "Listening · B1 · 12 min", meta: "Lesson", href: "/lesson/l1" },
  { id: "l2", type: "lesson", title: "Ordering coffee at a café", subtitle: "Speaking · A2 · 8 min", meta: "Lesson", href: "/lesson/l2" },
  { id: "l3", type: "lesson", title: "Job interview vocabulary", subtitle: "Vocabulary · B2 · 15 min", meta: "Lesson", href: "/lesson/l3" },
  // Words
  { id: "w1", type: "word", title: "serendipity", subtitle: "/ˌserənˈdɪpəti/ · n.", meta: "Word", href: "/practice/vocabulary?word=serendipity" },
  { id: "w2", type: "word", title: "adapt", subtitle: "/əˈdæpt/ · v.", meta: "Word", href: "/practice/vocabulary?word=adapt" },
  { id: "w3", type: "word", title: "persevere", subtitle: "/ˌpɜːsəˈvɪə/ · v.", meta: "Word", href: "/practice/vocabulary?word=persevere" },
  // Grammar
  { id: "g1", type: "grammar", title: "Mệnh đề quan hệ (Relative Clauses)", subtitle: "Who, which, that · B1", meta: "Grammar", href: "/practice/grammar/relative" },
  { id: "g2", type: "grammar", title: "Câu điều kiện loại 2", subtitle: "Hypothetical · B2", meta: "Grammar", href: "/practice/grammar/cond2" },
  // Posts
  { id: "p1", type: "post", title: "Tips học IELTS Speaking 7.0+", subtitle: "by Linh Chi · 124 upvotes", meta: "Community", href: "/community/post/p1" },
  { id: "p2", type: "post", title: "Chia sẻ kinh nghiệm vượt 600 TOEIC", subtitle: "by Minh · 89 upvotes", meta: "Community", href: "/community/post/p2" },
  // Articles
  { id: "a1", type: "article", title: "5 mẹo duy trì streak học hàng ngày", subtitle: "Blog · 5 min read", meta: "Article", href: "/blog/streak-tips" },
  { id: "a2", type: "article", title: "Cách dùng Spaced Repetition hiệu quả", subtitle: "Blog · 8 min read", meta: "Article", href: "/blog/srs-guide" },
  // Users
  { id: "u1", type: "user", title: "Hoàng Minh", subtitle: "Level 12 · 245 followers", meta: "User", href: "/u/hoangminh" },
  { id: "u2", type: "user", title: "Linh Chi", subtitle: "Level 28 · 1.2k followers", meta: "User", href: "/u/linhchi" },
]

const tabs = [
  { id: "all", label: "Tất cả", icon: Search },
  { id: "lesson", label: "Bài học", icon: BookOpen },
  { id: "word", label: "Từ vựng", icon: Sparkles },
  { id: "grammar", label: "Ngữ pháp", icon: FileText },
  { id: "post", label: "Cộng đồng", icon: Headphones },
  { id: "article", label: "Bài viết", icon: Star },
  { id: "user", label: "Người dùng", icon: Users },
] as const

const iconMap: Record<ResultType, typeof Search> = {
  lesson: BookOpen,
  word: Sparkles,
  grammar: FileText,
  post: Headphones,
  article: Star,
  user: Users,
}

const colorMap: Record<ResultType, string> = {
  lesson: "from-[#702ae1] to-[#b48bff]",
  word: "from-[#2e9e6a] to-[#5cc29a]",
  grammar: "from-[#5352a5] to-[#a19ff9]",
  post: "from-[#983772] to-[#d56ba6]",
  article: "from-[#e59831] to-[#f5be72]",
  user: "from-[#5ebbcf] to-[#8dd6e5]",
}

export default function GlobalSearchPage() {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<string>("all")
  const [recent] = useState(["IELTS Speaking", "Present Perfect", "job interview"])
  const [trending] = useState(["phrasal verbs", "TOEIC 700+", "tongue twister", "business English"])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return allResults.filter((r) => {
      const matchTab = tab === "all" || r.type === tab
      const matchQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.subtitle?.toLowerCase().includes(q) ?? false)
      return matchTab && matchQuery
    })
  }, [query, tab])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="relative rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover sm:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Tìm kiếm</h1>
          <p className="mt-1 text-sm text-white/80">
            Bài học, từ vựng, ngữ pháp, cộng đồng, bài viết, người dùng
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/95 p-1 pl-5 shadow-ambient">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm bất cứ thứ gì trên OmniLingo..."
              className="flex-1 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 rounded-xl p-0 text-muted-foreground"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mt-6 overflow-x-auto scrollbar-thin">
        <div className="flex gap-2 pb-2">
          {tabs.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? "bg-primary text-primary-foreground shadow-ambient"
                    : "bg-surface-lowest text-muted-foreground shadow-ambient hover:bg-surface-low"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Results */}
        <div>
          {!query ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-surface-lowest p-5 shadow-ambient">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" />
                  Tìm kiếm gần đây
                </div>
                <div className="space-y-1">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface-low"
                    >
                      <span>{r}</span>
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-surface-lowest p-5 shadow-ambient">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  Đang thịnh hành
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-surface-lowest p-12 text-center shadow-ambient">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Không tìm thấy kết quả</h3>
              <p className="text-sm text-muted-foreground">
                Thử từ khoá khác hoặc xem gợi ý bên cạnh.
              </p>
              <Button asChild variant="outline" className="mt-2 rounded-xl">
                <Link href="/help">Liên hệ hỗ trợ</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {filtered.length} kết quả cho &ldquo;{query}&rdquo;
              </div>
              {filtered.map((r, i) => {
                const Icon = iconMap[r.type]
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={r.href}
                      className="group flex items-center gap-4 rounded-3xl bg-surface-lowest p-4 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover"
                    >
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorMap[r.type]} text-white shadow-ambient`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">
                            {highlight(r.title, query)}
                          </span>
                          {r.meta && (
                            <span className="rounded-full bg-surface-low px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {r.meta}
                            </span>
                          )}
                        </div>
                        {r.subtitle && (
                          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                            {highlight(r.subtitle, query)}
                          </p>
                        )}
                      </div>
                      {r.type === "word" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar suggestions */}
        <aside className="space-y-4">
          <div className="rounded-3xl bg-surface-lowest p-5 shadow-ambient">
            <div className="mb-3 text-sm font-semibold">Lối tắt</div>
            <div className="space-y-1">
              <Link
                href="/practice/vocabulary"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-low"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Luyện từ vựng
              </Link>
              <Link
                href="/learn"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-low"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                Lộ trình học
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-low"
              >
                <Users className="h-4 w-4 text-primary" />
                Cộng đồng
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-low"
              >
                <FileText className="h-4 w-4 text-primary" />
                Trung tâm hỗ trợ
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"))
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary font-semibold rounded px-0.5"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  )
}
