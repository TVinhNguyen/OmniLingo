"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  CreditCard,
  BookOpen,
  Users,
  Settings,
  Zap,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const topics = [
  {
    icon: BookOpen,
    title: "Bắt đầu học",
    desc: "Tạo tài khoản, chọn ngôn ngữ, làm bài test đầu vào",
    count: 12,
  },
  {
    icon: CreditCard,
    title: "Thanh toán & Gói Premium",
    desc: "Mua, huỷ, hoàn tiền, hóa đơn và phương thức thanh toán",
    count: 18,
  },
  {
    icon: Zap,
    title: "Bài học & Luyện tập",
    desc: "Chuỗi streak, tim, XP, SRS và chế độ luyện tập",
    count: 24,
  },
  {
    icon: Users,
    title: "Giáo viên 1-1",
    desc: "Tìm, đặt lịch, huỷ buổi học và đánh giá giáo viên",
    count: 15,
  },
  {
    icon: MessageSquare,
    title: "AI Tutor Lumi",
    desc: "Hội thoại, sửa lỗi, tạo flashcard tự động",
    count: 9,
  },
  {
    icon: Settings,
    title: "Tài khoản & Cài đặt",
    desc: "Mật khẩu, email, xóa tài khoản, ngôn ngữ giao diện",
    count: 14,
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật & Quyền riêng tư",
    desc: "Dữ liệu cá nhân, GDPR, báo cáo vi phạm",
    count: 7,
  },
]

const popular = [
  "Làm sao để đặt lại mật khẩu?",
  "Tôi muốn huỷ gói Premium, phải làm gì?",
  "Vì sao streak của tôi bị mất?",
  "Làm sao để nhận chứng chỉ hoàn thành khóa học?",
  "Có thể đổi ngôn ngữ đang học giữa chừng không?",
  "AI Tutor có giới hạn sử dụng không?",
]

export default function HelpPage() {
  const [q, setQ] = useState("")

  return (
    <div className="pt-32 pb-24">
      <section className="mx-auto max-w-4xl px-4 text-center">
        <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
          Trung tâm trợ giúp
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Chúng tôi có thể <span className="text-gradient-primary">giúp gì</span> cho bạn?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
          Tìm câu trả lời nhanh chóng hoặc liên hệ đội hỗ trợ 24/7 của chúng tôi.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-surface-lowest p-2 shadow-ambient">
          <Search className="ml-3 h-5 w-5 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Mô tả vấn đề của bạn..."
            className="h-11 flex-1 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          />
          <Button className="rounded-full bg-gradient-primary text-primary-foreground">
            Tìm kiếm
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <Card
              key={t.title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t.count} bài viết</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Câu hỏi phổ biến</h2>
        <Card className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface-lowest shadow-ambient">
          {popular.map((p) => (
            <Link
              key={p}
              href="#"
              className="flex items-center justify-between p-5 transition-colors hover:bg-surface-low"
            >
              <span className="text-sm font-medium">{p}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </Card>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <Card className="rounded-3xl border border-border bg-gradient-primary p-8 text-center text-primary-foreground shadow-raise md:p-12">
          <h2 className="text-balance text-3xl font-bold tracking-tight">
            Vẫn cần thêm trợ giúp?
          </h2>
          <p className="mt-3 text-pretty opacity-90">
            Đội hỗ trợ của OmniLingo sẵn sàng 24/7 qua chat và email.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-surface-lowest text-foreground hover:bg-surface-lowest/90"
            >
              <Link href="/contact">Liên hệ hỗ trợ</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/community">Cộng đồng</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
