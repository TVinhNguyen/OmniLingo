"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Book,
  CreditCard,
  Users,
  Shield,
  Settings as SettingsIcon,
  Headphones,
  ChevronRight,
  Clock,
  ThumbsUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const CATEGORIES: Record<
  string,
  { name: string; icon: typeof Book; color: string; description: string }
> = {
  "getting-started": {
    name: "Bắt đầu",
    icon: Book,
    color: "from-[#702ae1] to-[#b48bff]",
    description: "Hướng dẫn đăng ký, đăng nhập và những bước đầu tiên với OmniLingo",
  },
  billing: {
    name: "Thanh toán",
    icon: CreditCard,
    color: "from-[#5352a5] to-[#a19ff9]",
    description: "Gói Premium, hoàn tiền, hóa đơn và các vấn đề thanh toán",
  },
  tutors: {
    name: "Giáo viên 1-1",
    icon: Users,
    color: "from-[#983772] to-[#d56ba6]",
    description: "Tìm giáo viên, đặt lịch, hủy và đánh giá buổi học",
  },
  privacy: {
    name: "Quyền riêng tư",
    icon: Shield,
    color: "from-[#2e9e6a] to-[#5cc29a]",
    description: "Bảo mật tài khoản, dữ liệu cá nhân và kiểm soát quyền riêng tư",
  },
  account: {
    name: "Tài khoản",
    icon: SettingsIcon,
    color: "from-primary to-primary/70",
    description: "Cài đặt, thay đổi mật khẩu, và xóa tài khoản",
  },
  technical: {
    name: "Kỹ thuật",
    icon: Headphones,
    color: "from-accent to-accent/70",
    description: "Lỗi ứng dụng, microphone, âm thanh và tương thích thiết bị",
  },
}

const ARTICLES = [
  {
    id: "a1",
    title: "Làm sao để thay đổi ngôn ngữ đang học?",
    category: "getting-started",
    helpful: 245,
    readTime: 3,
    preview: "Bạn có thể thay đổi ngôn ngữ mục tiêu bất cứ lúc nào trong phần Cài đặt...",
  },
  {
    id: "a2",
    title: "Hủy gói Premium và yêu cầu hoàn tiền",
    category: "billing",
    helpful: 189,
    readTime: 5,
    preview: "OmniLingo cho phép hoàn tiền trong vòng 7 ngày đầu tiên kể từ khi mua...",
  },
  {
    id: "a3",
    title: "Tìm giáo viên phù hợp với trình độ",
    category: "tutors",
    helpful: 178,
    readTime: 4,
    preview: "Sử dụng bộ lọc nâng cao để tìm giáo viên theo chuyên môn, giá tiền và thời gian...",
  },
  {
    id: "a4",
    title: "Microphone không hoạt động khi luyện Speaking",
    category: "technical",
    helpful: 234,
    readTime: 4,
    preview: "Đầu tiên hãy kiểm tra quyền truy cập microphone của trình duyệt...",
  },
  {
    id: "a5",
    title: "Xuất dữ liệu học tập và tiến độ",
    category: "privacy",
    helpful: 112,
    readTime: 3,
    preview: "Bạn có quyền xuất toàn bộ dữ liệu học tập của mình bất cứ lúc nào...",
  },
  {
    id: "a6",
    title: "Kích hoạt xác thực 2 bước",
    category: "account",
    helpful: 156,
    readTime: 5,
    preview: "Bảo vệ tài khoản tốt hơn với xác thực 2 bước qua ứng dụng Authenticator...",
  },
  {
    id: "a7",
    title: "Hủy đặt lịch giáo viên",
    category: "tutors",
    helpful: 98,
    readTime: 3,
    preview: "Bạn có thể hủy miễn phí trước 24 giờ so với thời điểm bắt đầu buổi học...",
  },
  {
    id: "a8",
    title: "Đăng ký tài khoản bằng Google",
    category: "getting-started",
    helpful: 203,
    readTime: 2,
    preview: "Đăng ký chỉ với 1 cú nhấp qua Google không cần nhớ mật khẩu...",
  },
  {
    id: "a9",
    title: "Thay đổi phương thức thanh toán",
    category: "billing",
    helpful: 87,
    readTime: 3,
    preview: "Cập nhật thẻ tín dụng hoặc chuyển sang ví điện tử...",
  },
]

export default function HelpCategoryPage() {
  const params = useParams()
  const categoryKey = (params?.category as string) ?? "getting-started"
  const category = CATEGORIES[categoryKey] ?? CATEGORIES["getting-started"]

  const [query, setQuery] = useState("")

  const articlesInCategory = ARTICLES.filter((a) => a.category === categoryKey)
  const filtered = query.trim()
    ? articlesInCategory.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.preview.toLowerCase().includes(query.toLowerCase()),
      )
    : articlesInCategory

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Button
          variant="ghost"
          asChild
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/help">
            <ArrowLeft className="h-4 w-4" />
            Trung tâm trợ giúp
          </Link>
        </Button>

        {/* Hero */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.color} p-10 text-white shadow-hover`}
        >
          <div className="absolute right-6 top-6 opacity-20">
            <category.icon className="h-32 w-32" />
          </div>
          <div className="relative">
            <div className="text-sm font-medium uppercase tracking-wider text-white/70">
              Danh mục
            </div>
            <h1 className="mt-2 text-4xl font-bold">{category.name}</h1>
            <p className="mt-3 max-w-xl text-white/85">{category.description}</p>
            <div className="mt-5">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Tìm kiếm trong ${category.name}...`}
                  className="h-12 rounded-2xl border-white/30 bg-white/15 pl-11 text-white placeholder:text-white/60 backdrop-blur"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sub-categories */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">Danh mục khác</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(CATEGORIES)
              .filter(([key]) => key !== categoryKey)
              .map(([key, cat]) => (
                <Link
                  key={key}
                  href={`/help/category/${key}`}
                  className="group flex items-center gap-3 rounded-2xl bg-surface-lowest p-4 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-white`}
                  >
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <span className="flex-1 font-semibold">{cat.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
          </div>
        </div>

        {/* Articles */}
        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-bold">Bài viết trong danh mục</h2>
            <span className="text-sm text-muted-foreground">
              {filtered.length} bài viết
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl bg-surface-lowest p-12 text-center shadow-ambient">
              <Search className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-semibold">Không tìm thấy bài viết</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((article) => (
                <Link
                  key={article.id}
                  href={`/help/${article.id}`}
                  className="group block rounded-3xl bg-surface-lowest p-6 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {article.preview}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="rounded-full">
                          <Clock className="mr-1 h-3 w-3" />
                          {article.readTime} phút đọc
                        </Badge>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {article.helpful} hữu ích
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-primary p-8 text-center text-white shadow-hover">
          <h3 className="text-2xl font-bold">Không tìm thấy câu trả lời?</h3>
          <p className="mt-2 text-white/85">
            Đội hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-5 h-12 rounded-2xl bg-white px-8 text-primary hover:bg-white/90"
          >
            <Link href="/contact">Liên hệ hỗ trợ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
