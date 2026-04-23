"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowUp,
  MessageSquare,
  Eye,
  Clock,
  Flame,
  TrendingUp,
  Sparkles,
  Users,
  Hash,
  ChevronRight,
} from "lucide-react"
import { FlagIcon } from "@/components/flag-icon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tagMeta: Record<string, { desc: string; followers: number; color: string }> = {
  grammar: {
    desc: "Thảo luận về ngữ pháp, cấu trúc câu, thì động từ",
    followers: 12300,
    color: "from-primary to-accent",
  },
  ielts: {
    desc: "Chuẩn bị thi IELTS - tips, bài mẫu, chấm điểm",
    followers: 18700,
    color: "from-accent to-primary",
  },
  japanese: {
    desc: "Học tiếng Nhật - kanji, ngữ pháp N5-N1",
    followers: 8900,
    color: "from-success to-primary",
  },
  vocab: {
    desc: "Từ vựng, idioms, collocations",
    followers: 15400,
    color: "from-warning to-accent",
  },
  pronunciation: {
    desc: "Phát âm, ngữ điệu, IPA",
    followers: 7200,
    color: "from-primary to-success",
  },
}

const relatedTags = ["writing", "speaking", "listening", "reading", "tefl", "toeic"]

const topContributors = [
  { name: "Emma Wilson", posts: 142, avatar: "EW" },
  { name: "Kenji Tanaka", posts: 98, avatar: "KT" },
  { name: "Sophie Dubois", posts: 76, avatar: "SD" },
  { name: "Carlos Mendez", posts: 54, avatar: "CM" },
]

function generatePosts(tag: string) {
  const authors = ["Emma", "Kenji", "Sophie", "Carlos", "Ming", "Anna", "Tomás", "Yuki"]
  const titles = [
    `Cách dùng ${tag} hiệu quả`,
    `Tips luyện ${tag} trong 30 ngày`,
    `Mistake phổ biến khi học ${tag}`,
    `Review khóa học ${tag} tốt nhất 2024`,
    `Xin feedback bài ${tag} của mình`,
    `Phân biệt 2 cấu trúc ${tag}`,
  ]
  return Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    title: titles[i % titles.length] + ` - Part ${Math.floor(i / titles.length) + 1}`,
    author: authors[i % authors.length],
    language: ["en", "ja", "ko", "zh"][i % 4],
    level: ["A2", "B1", "B2", "C1"][i % 4],
    preview: "Mình đang học và gặp một số vấn đề, mong mọi người giúp đỡ để hiểu rõ hơn...",
    upvotes: 50 - i * 2 + (i % 3) * 10,
    comments: 12 + (i % 5) * 3,
    views: 234 + i * 47,
    time: `${i + 1}h trước`,
  }))
}

const sortOptions = [
  { id: "hot", label: "Hot", icon: Flame },
  { id: "new", label: "Mới", icon: Sparkles },
  { id: "top", label: "Top", icon: TrendingUp },
]

const timeOptions = ["Hôm nay", "Tuần này", "Tháng này", "Tất cả"]

export default function CommunityTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params)
  const [sort, setSort] = useState("hot")
  const [time, setTime] = useState("Tuần này")
  const [followed, setFollowed] = useState(false)

  const meta = tagMeta[tag] || {
    desc: `Thảo luận về #${tag}`,
    followers: 3400,
    color: "from-primary to-accent",
  }
  const posts = generatePosts(tag)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/community" className="hover:text-primary">
          Cộng đồng
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">#{tag}</span>
      </nav>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br ${meta.color} p-8 text-white shadow-hover`}
      >
        <div className="absolute -top-12 -right-12 opacity-20">
          <Hash className="h-48 w-48" />
        </div>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
              <Users className="h-3 w-3" />
              {meta.followers.toLocaleString()} người theo dõi
            </div>
            <h1 className="font-sans text-4xl font-bold text-balance lg:text-5xl">#{tag}</h1>
            <p className="mt-2 max-w-2xl text-white/90">{meta.desc}</p>
          </div>
          <Button
            onClick={() => setFollowed(!followed)}
            className={`h-11 rounded-xl font-semibold ${
              followed
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-white text-primary hover:bg-white/90"
            }`}
          >
            {followed ? "Đang theo dõi" : "Theo dõi tag"}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main */}
        <div>
          {/* Filter bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-lowest p-3 shadow-ambient">
            <div className="flex gap-1">
              {sortOptions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSort(id)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    sort === id
                      ? "bg-primary text-primary-foreground shadow-ambient"
                      : "text-muted-foreground hover:bg-surface-low"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    time === t ? "bg-surface-low text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Posts list */}
          <div className="space-y-4">
            {posts.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="group flex gap-4 rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover"
              >
                {/* Upvote col */}
                <div className="flex flex-col items-center gap-1">
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold">{p.upvotes}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <FlagIcon code={p.language} className="h-3 w-5" />
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {p.level}
                    </Badge>
                    <span>•</span>
                    <span>bởi {p.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {p.time}
                    </span>
                  </div>
                  <Link href={`/community/post/${p.id}`}>
                    <h3 className="text-base font-semibold leading-snug text-pretty group-hover:text-primary">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.preview}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {p.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {p.views}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
            <h3 className="mb-4 font-semibold">Tags liên quan</h3>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((t) => (
                <Link
                  key={t}
                  href={`/community/tag/${t}`}
                  className="rounded-full bg-surface-low px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
            <h3 className="mb-4 font-semibold">Top contributors</h3>
            <div className="space-y-3">
              {topContributors.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                    {c.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.posts} posts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
