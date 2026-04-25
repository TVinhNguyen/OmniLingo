"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { motion } from "motion/react"
import {
  Search,
  ChevronRight,
  MessageCircleQuestion,
  BookOpen,
  CreditCard,
  Shield,
  Settings,
  Users,
  Zap,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const categories = [
  { id: "getting-started", label: "Bắt đầu", icon: Zap, count: 12 },
  { id: "learning", label: "Học tập", icon: BookOpen, count: 24 },
  { id: "account", label: "Tài khoản", icon: Settings, count: 18 },
  { id: "billing", label: "Thanh toán", icon: CreditCard, count: 15 },
  { id: "privacy", label: "Quyền riêng tư", icon: Shield, count: 9 },
  { id: "community", label: "Cộng đồng", icon: Users, count: 11 },
]

type Article = {
  id: string
  title: string
  snippet: string
  category: string
  path: string
  score: number
  href: string
}

const articles: Article[] = [
  {
    id: "a1",
    title: "Làm thế nào để duy trì streak học hàng ngày?",
    snippet: "Streak là chuỗi ngày học liên tiếp. Để duy trì streak, bạn cần hoàn thành ít nhất một bài học mỗi ngày...",
    category: "learning",
    path: "Hỗ trợ > Học tập",
    score: 98,
    href: "/help/streak-system",
  },
  {
    id: "a2",
    title: "Huỷ gói Premium và hoàn tiền",
    snippet: "Bạn có thể huỷ Premium bất cứ lúc nào trong Cài đặt > Gói đăng ký. Sau khi huỷ, bạn vẫn dùng được đến hết chu kỳ...",
    category: "billing",
    path: "Hỗ trợ > Thanh toán",
    score: 92,
    href: "/help/cancel-premium",
  },
  {
    id: "a3",
    title: "Cách bật xác thực 2 lớp (2FA)",
    snippet: "2FA là lớp bảo mật bổ sung. Vào Cài đặt > Bảo mật > 2FA, quét QR bằng Google Authenticator hoặc Authy...",
    category: "account",
    path: "Hỗ trợ > Tài khoản",
    score: 88,
    href: "/help/enable-2fa",
  },
  {
    id: "a4",
    title: "Tìm giáo viên 1-1 phù hợp",
    snippet: "OmniLingo có hơn 2,000 giáo viên. Dùng bộ lọc Ngôn ngữ + Giá + Đánh giá + Múi giờ để tìm người phù hợp...",
    category: "learning",
    path: "Hỗ trợ > Học tập",
    score: 85,
    href: "/help/find-tutor",
  },
  {
    id: "a5",
    title: "Spaced Repetition hoạt động như thế nào?",
    snippet: "SRS là hệ thống ôn tập thông minh. Thẻ bạn trả đúng sẽ xuất hiện ít hơn, trả sai sẽ xuất hiện nhiều hơn...",
    category: "learning",
    path: "Hỗ trợ > Học tập",
    score: 82,
    href: "/help/srs",
  },
  {
    id: "a6",
    title: "Đổi mật khẩu",
    snippet: "Vào Cài đặt > Bảo mật > Đổi mật khẩu. Nhập mật khẩu cũ, mật khẩu mới (tối thiểu 12 ký tự)...",
    category: "account",
    path: "Hỗ trợ > Tài khoản",
    score: 78,
    href: "/help/change-password",
  },
  {
    id: "a7",
    title: "Đánh dấu bài viết trong cộng đồng",
    snippet: "Nhấn vào biểu tượng bookmark ở cuối mỗi bài đăng. Xem lại các bài đã lưu trong Hồ sơ > Bài đã lưu...",
    category: "community",
    path: "Hỗ trợ > Cộng đồng",
    score: 72,
    href: "/help/bookmark-posts",
  },
  {
    id: "a8",
    title: "Xoá dữ liệu học tập theo GDPR",
    snippet: "Theo GDPR, bạn có quyền yêu cầu xoá toàn bộ dữ liệu. Vào Cài đặt > Xuất dữ liệu để tải bản sao trước...",
    category: "privacy",
    path: "Hỗ trợ > Quyền riêng tư",
    score: 68,
    href: "/help/gdpr-deletion",
  },
]

export default function HelpSearchPage() {
  const [query, setQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sort, setSort] = useState<"relevance" | "newest">("relevance")

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    let list = articles.filter((a) => {
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.snippet.toLowerCase().includes(q)
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(a.category)
      return matchQuery && matchCategory
    })
    if (sort === "relevance") list = [...list].sort((a, b) => b.score - a.score)
    return list
  }, [query, selectedCategories, sort])

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/help" className="hover:text-primary">
          Hỗ trợ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Tìm kiếm</span>
      </nav>

      {/* Search header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-hover"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Tìm câu trả lời
        </h1>
        <p className="mt-2 text-white/80">
          Hơn 90+ bài hướng dẫn chi tiết cho mọi tình huống
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white/95 p-1 pl-5 shadow-ambient">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: đổi mật khẩu, huỷ Premium, 2FA..."
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
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {query ? (
                <span>
                  {filtered.length} kết quả cho &ldquo;{query}&rdquo;
                </span>
              ) : (
                <span>Hiển thị {filtered.length} bài phổ biến</span>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-xl bg-surface-lowest px-3 py-1.5 text-sm shadow-ambient outline-none"
            >
              <option value="relevance">Liên quan nhất</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-surface-lowest p-12 text-center shadow-ambient">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageCircleQuestion className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">
                Không tìm thấy bài viết cho &ldquo;{query}&rdquo;
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Thử từ khoá khác hoặc liên hệ đội ngũ hỗ trợ để được giúp đỡ trực
                tiếp.
              </p>
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/help">Về trang hỗ trợ</Link>
                </Button>
                <Button asChild className="rounded-xl">
                  <Link href="/contact">Liên hệ hỗ trợ</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={a.href}
                    className="group block rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">{a.path}</div>
                        <h3 className="mt-0.5 font-semibold text-lg group-hover:text-primary">
                          {highlight(a.title, query)}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {highlight(a.snippet, query)}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <div className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {a.score}% liên quan
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: filters */}
        <aside className="space-y-4">
          <div className="rounded-3xl bg-surface-lowest p-5 shadow-ambient lg:sticky lg:top-24">
            <div className="mb-3 text-sm font-semibold">Lọc theo danh mục</div>
            <div className="space-y-1">
              {categories.map((c) => {
                const checked = selectedCategories.includes(c.id)
                return (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-low"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleCategory(c.id)}
                    />
                    <c.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{c.label}</span>
                    <span className="text-xs text-muted-foreground">{c.count}</span>
                  </label>
                )
              })}
            </div>
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full rounded-xl"
                onClick={() => setSelectedCategories([])}
              >
                Xoá bộ lọc
              </Button>
            )}
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-5">
            <MessageCircleQuestion className="mb-2 h-8 w-8 text-primary" />
            <h4 className="font-semibold">Vẫn chưa tìm được?</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Đội hỗ trợ sẵn sàng trả lời trong vòng 24h.
            </p>
            <Button asChild size="sm" className="mt-3 rounded-xl">
              <Link href="/contact">Liên hệ hỗ trợ</Link>
            </Button>
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
