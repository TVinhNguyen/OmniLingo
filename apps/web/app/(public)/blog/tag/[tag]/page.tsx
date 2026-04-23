"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Tag as TagIcon,
  Clock,
  Eye,
  Sparkles,
  BookOpen,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const TAG_META: Record<string, { name: string; description: string; color: string }> = {
  ielts: {
    name: "IELTS",
    description:
      "Mẹo thi IELTS, chiến lược từng kỹ năng, từ vựng Academic và kinh nghiệm từ các học viên đạt band 7.0+",
    color: "from-[#702ae1] to-[#b48bff]",
  },
  toeic: {
    name: "TOEIC",
    description:
      "Hướng dẫn luyện TOEIC hiệu quả, phân tích đề thi thật và lộ trình đạt 900+",
    color: "from-[#5352a5] to-[#a19ff9]",
  },
  grammar: {
    name: "Ngữ pháp",
    description: "Quy tắc ngữ pháp, bài tập chữa đề và cách nhớ lâu",
    color: "from-[#2e9e6a] to-[#5cc29a]",
  },
  vocabulary: {
    name: "Từ vựng",
    description: "Kỹ thuật học từ, flashcards, mnemonic và collocation thông dụng",
    color: "from-[#983772] to-[#d56ba6]",
  },
  speaking: {
    name: "Speaking",
    description: "Phát âm, shadowing, role-play và cách tự tin giao tiếp",
    color: "from-accent to-accent/70",
  },
  japanese: {
    name: "Tiếng Nhật",
    description: "Học kanji, từ vựng N5-N1, ngữ pháp và văn hóa Nhật",
    color: "from-primary to-primary/70",
  },
}

const POSTS = [
  {
    id: 1,
    title: "7 chiến lược luyện IELTS Writing đạt band 7.0+",
    excerpt:
      "Phân tích 7 chiến lược đã giúp hơn 1000 học viên đạt band 7.0+ Writing, từ cấu trúc bài đến vocab cao cấp.",
    tags: ["ielts", "writing"],
    author: "Mai Anh",
    readTime: 12,
    views: "3.2k",
    date: "15 Jan 2025",
    featured: true,
  },
  {
    id: 2,
    title: "Cách phân biệt 'will' và 'going to' trong tiếng Anh",
    excerpt: "Hai thì tương lai dễ nhầm lẫn được giải thích qua 20 ví dụ thực tế.",
    tags: ["grammar", "english"],
    author: "Lan Vy",
    readTime: 5,
    views: "1.8k",
    date: "12 Jan 2025",
  },
  {
    id: 3,
    title: "Kỹ thuật Shadowing - bí quyết nói tự nhiên như người bản xứ",
    excerpt: "Hướng dẫn 5 bước Shadowing từ cơ bản đến nâng cao với podcasts.",
    tags: ["speaking", "pronunciation"],
    author: "Quang Huy",
    readTime: 8,
    views: "2.1k",
    date: "10 Jan 2025",
  },
  {
    id: 4,
    title: "500 Academic Words cho IELTS bạn nhất định phải biết",
    excerpt: "Tuyển chọn 500 từ vựng Academic xuất hiện nhiều nhất trong đề IELTS.",
    tags: ["ielts", "vocabulary"],
    author: "Thu Hà",
    readTime: 15,
    views: "5.4k",
    date: "08 Jan 2025",
  },
  {
    id: 5,
    title: "Học 100 Kanji N5 trong 30 ngày",
    excerpt: "Phương pháp học Kanji bằng radical và mnemonic hiệu quả.",
    tags: ["japanese", "vocabulary"],
    author: "Minh Tuấn",
    readTime: 10,
    views: "1.5k",
    date: "05 Jan 2025",
  },
  {
    id: 6,
    title: "Cách làm Part 7 TOEIC nhanh và chính xác",
    excerpt: "3 kỹ thuật quét đọc giúp bạn hoàn thành Part 7 đúng giờ.",
    tags: ["toeic", "reading"],
    author: "Thanh Thảo",
    readTime: 7,
    views: "1.2k",
    date: "02 Jan 2025",
  },
]

export default function BlogTagPage() {
  const params = useParams()
  const tagKey = (params?.tag as string) ?? "ielts"
  const meta = TAG_META[tagKey] ?? {
    name: tagKey,
    description: `Bài viết liên quan đến ${tagKey}`,
    color: "from-primary to-primary/70",
  }

  const postsWithTag = POSTS.filter((p) => p.tags.includes(tagKey))
  const otherTags = Object.entries(TAG_META).filter(([key]) => key !== tagKey)
  const relatedPosts = POSTS.filter((p) => !p.tags.includes(tagKey)).slice(0, 3)

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4">
        <Button
          variant="ghost"
          asChild
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
            Tất cả bài viết
          </Link>
        </Button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${meta.color} p-12 text-white shadow-hover`}
        >
          <div className="absolute -right-10 -top-10 opacity-10">
            <TagIcon className="h-48 w-48" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/70">
              <TagIcon className="h-4 w-4" />
              Chủ đề
            </div>
            <h1 className="mt-2 text-5xl font-bold">#{meta.name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
              {meta.description}
            </p>
            <div className="mt-5 flex items-center gap-3 text-sm">
              <Badge className="rounded-full bg-white/20 text-white hover:bg-white/25">
                <BookOpen className="mr-1 h-3 w-3" />
                {postsWithTag.length} bài viết
              </Badge>
              <Badge className="rounded-full bg-white/20 text-white hover:bg-white/25">
                <TrendingUp className="mr-1 h-3 w-3" />
                Trending
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Posts */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Bài viết mới nhất</h2>

            {postsWithTag.length === 0 ? (
              <div className="rounded-3xl bg-surface-lowest p-12 text-center shadow-ambient">
                <TagIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-semibold">Chưa có bài viết</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hãy quay lại sau hoặc khám phá chủ đề khác
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {postsWithTag.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Link
                      href={`/blog/${post.id}`}
                      className="group block overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
                    >
                      {post.featured && (
                        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                          <Sparkles className="mr-1 inline h-3 w-3" />
                          Bài viết nổi bật
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-2">
                          {post.tags.map((t) => (
                            <Badge
                              key={t}
                              variant={t === tagKey ? "default" : "outline"}
                              className="rounded-full"
                            >
                              #{t}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="mt-3 text-2xl font-bold leading-snug transition-colors group-hover:text-primary">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gradient-primary text-xs text-white">
                                {post.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>{post.author}</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readTime} phút đọc
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {post.views}
                          </span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-max">
            <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
              <h3 className="font-bold">Chủ đề khác</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {otherTags.map(([key, tag]) => (
                  <Link
                    key={key}
                    href={`/blog/tag/${key}`}
                    className="rounded-full bg-surface-low px-3 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
              <h3 className="font-bold">Có thể bạn quan tâm</h3>
              <div className="mt-4 space-y-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group block"
                  >
                    <h4 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
                      {post.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime} phút</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-primary p-6 text-white shadow-hover">
              <h3 className="font-bold">Nhận bài viết mới</h3>
              <p className="mt-2 text-sm text-white/85">
                Đăng ký newsletter để nhận bài viết hay mỗi tuần
              </p>
              <Button
                asChild
                variant="secondary"
                className="mt-4 w-full rounded-xl bg-white text-primary hover:bg-white/90"
              >
                <Link href="#newsletter">Đăng ký ngay</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
