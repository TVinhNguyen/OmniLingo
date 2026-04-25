"use client"

import { useState } from "react"
import Link from "next/link"
import {
  PenLine,
  Sparkles,
  ChevronRight,
  Mail,
  FileText,
  Clock,
  BookOpen,
  Plus,
  Brain,
  TrendingUp,
  Target,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PracticeHeader } from "@/components/app/practice-header"

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

const LEVEL_COLORS: Record<Level, string> = {
  A1: "bg-emerald-50 text-emerald-700",
  A2: "bg-emerald-50 text-emerald-700",
  B1: "bg-sky-50 text-sky-700",
  B2: "bg-sky-50 text-sky-700",
  C1: "bg-accent-container text-on-accent-container",
  C2: "bg-amber-50 text-amber-700",
}

const prompts = {
  journal: [
    { id: "j1", title: "Một ngày khó quên", desc: "Kể lại một ngày đặc biệt trong năm vừa qua", level: "B1" as Level, minWords: 120 },
    { id: "j2", title: "Món ăn yêu thích", desc: "Mô tả món ăn yêu thích và lý do", level: "A2" as Level, minWords: 80 },
    { id: "j3", title: "3 mục tiêu cuối năm", desc: "Viết 3 mục tiêu và kế hoạch thực hiện", level: "B1" as Level, minWords: 120 },
    { id: "j4", title: "Nếu được đi du lịch 1 tuần", desc: "Bạn sẽ chọn nơi nào, tại sao?", level: "B1" as Level, minWords: 120 },
  ],
  essay: [
    { id: "e1", title: "Học online vs học truyền thống", desc: "So sánh ưu/nhược điểm 2 hình thức", level: "B2" as Level, minWords: 250 },
    { id: "e2", title: "Mạng xã hội và giới trẻ", desc: "Phân tích tác động tích cực/tiêu cực", level: "B2" as Level, minWords: 250 },
    { id: "e3", title: "AI có thể thay thế giáo viên?", desc: "Nêu quan điểm, đưa lý lẽ", level: "C1" as Level, minWords: 280 },
    { id: "e4", title: "Đô thị hoá ở VN", desc: "Viết essay nguyên nhân-hệ quả", level: "B2" as Level, minWords: 250 },
  ],
  email: [
    { id: "m1", title: "Xin nghỉ phép 3 ngày", desc: "Viết email tới sếp xin nghỉ việc gia đình", level: "B1" as Level, minWords: 100 },
    { id: "m2", title: "Phàn nàn về dịch vụ", desc: "Viết email complaint formal", level: "B2" as Level, minWords: 150 },
    { id: "m3", title: "Mời bạn đi du lịch", desc: "Viết email thân mật mời bạn đi Đà Lạt", level: "A2" as Level, minWords: 80 },
    { id: "m4", title: "Xin học bổng", desc: "Viết cover letter xin học bổng", level: "C1" as Level, minWords: 200 },
  ],
  story: [
    { id: "s1", title: "Mở đầu: 'Đêm đó mưa rất to...'", desc: "Viết tiếp thành câu chuyện ngắn", level: "B2" as Level, minWords: 200 },
    { id: "s2", title: "Nhân vật chính: cô bé 10 tuổi", desc: "Sáng tác câu chuyện về một ngày kỳ lạ", level: "B1" as Level, minWords: 180 },
    { id: "s3", title: "Đoạn hội thoại 2 nhân vật", desc: "Viết short dialogue có cao trào", level: "B2" as Level, minWords: 150 },
  ],
}

const history = [
  { id: "h1", title: "Một ngày khó quên", type: "Nhật ký", score: 82, date: "Hôm qua", feedback: 3 },
  { id: "h2", title: "Mạng xã hội và giới trẻ", type: "Essay", score: 76, date: "3 ngày trước", feedback: 5 },
  { id: "h3", title: "Xin nghỉ phép", type: "Email", score: 91, date: "1 tuần trước", feedback: 1 },
]

const TYPE_META: Record<
  string,
  { label: string; icon: typeof PenLine; gradient: string }
> = {
  journal: {
    label: "Nhật ký",
    icon: BookOpen,
    gradient: "from-[#5352a5] to-[#a19ff9]",
  },
  essay: {
    label: "Essay",
    icon: FileText,
    gradient: "from-[#702ae1] to-[#b48bff]",
  },
  email: {
    label: "Email / Thư",
    icon: Mail,
    gradient: "from-[#983772] to-[#d56ba6]",
  },
  story: {
    label: "Truyện ngắn",
    icon: Sparkles,
    gradient: "from-[#2e9e6a] to-[#5cc29a]",
  },
}

function PromptCard({
  prompt,
  type,
}: {
  prompt: { id: string; title: string; desc: string; level: Level; minWords: number }
  type: string
}) {
  const meta = TYPE_META[type]
  return (
    <Link
      href={`/writing-center?prompt=${prompt.id}`}
      className="group rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-white shadow-ambient`}
        >
          <meta.icon className="h-5 w-5" />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LEVEL_COLORS[prompt.level]}`}
        >
          {prompt.level}
        </span>
      </div>
      <h4 className="mt-4 font-bold leading-snug">{prompt.title}</h4>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
        {prompt.desc}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <PenLine className="h-3 w-3" />
          ≥ {prompt.minWords} từ
        </span>
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
      </div>
    </Link>
  )
}

export default function WritingPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PracticeHeader
        icon={PenLine}
        breadcrumb="Luyện tập"
        title="Luyện Viết"
        highlight="có-AI-sửa-lỗi"
        description="Chọn chủ đề, viết tự do và nhận góp ý chi tiết ngay từ AI: ngữ pháp, từ vựng, cohesion, task achievement."
        gradient="purple-pink"
        badge="Band 4.0 → 9.0"
        stats={[
          { label: "Bài đã viết", value: "14" },
          { label: "Từ trung bình", value: "182" },
          { label: "Band AI", value: "6.5" },
          { label: "Tăng", value: "+0.5" },
        ]}
      />

      {/* Quick start + History */}
      <section className="grid gap-4 lg:grid-cols-3" data-aos="fade-up">
        <Link
          href="/writing-center"
          className="group rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
        >
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Sparkles className="h-4 w-4" />
            Writing Center
          </div>
          <h3 className="mt-2 text-2xl font-extrabold leading-tight">
            Editor rộng rãi + AI feedback
          </h3>
          <p className="mt-2 text-sm text-white/85">
            Bảng viết chuyên nghiệp: highlight lỗi inline, suggestion một chạm, đếm từ realtime.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
            Mở editor
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <h3 className="text-lg font-bold">Bài viết gần đây</h3>
            </div>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="rounded-full text-sm text-accent hover:bg-accent-container/60"
            >
              <Link href="/writing-center">
                Xem tất cả
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <ul className="mt-4 space-y-2">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex items-center gap-3 rounded-2xl bg-surface-low px-4 py-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-lowest text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-sm">{h.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.type} · {h.date} · {h.feedback} góp ý
                  </p>
                </div>
                <span className="rounded-full bg-accent-container px-2.5 py-1 text-xs font-bold text-on-accent-container">
                  {h.score}/100
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prompt library */}
      <Tabs defaultValue="journal" className="space-y-5">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-full bg-surface-lowest p-1 shadow-ambient sm:grid-cols-4">
          <TabsTrigger
            value="journal"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <BookOpen className="h-3.5 w-3.5" /> Nhật ký
          </TabsTrigger>
          <TabsTrigger
            value="essay"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <FileText className="h-3.5 w-3.5" /> Essay
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <Mail className="h-3.5 w-3.5" /> Email
          </TabsTrigger>
          <TabsTrigger
            value="story"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <Sparkles className="h-3.5 w-3.5" /> Truyện
          </TabsTrigger>
        </TabsList>

        {(["journal", "essay", "email", "story"] as const).map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {prompts[type].map((p) => (
                <PromptCard key={p.id} prompt={p} type={type} />
              ))}
              <div className="rounded-3xl border-2 border-dashed border-border bg-surface-lowest/50 p-5 flex flex-col items-center justify-center text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-low">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </span>
                <p className="mt-3 font-semibold">Tự chọn chủ đề riêng</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Viết về bất kỳ chủ đề nào bạn thích
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="mt-3 rounded-full text-accent hover:bg-accent-container/60"
                >
                  <Link href="/writing-center">Mở editor</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* AI feedback highlight */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-fluency text-white shadow-ambient">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold">AI chấm điểm theo 4 tiêu chí</h3>
            <p className="text-sm text-muted-foreground">
              Công thức giống IELTS/TOEFL — bạn biết chính xác mình đang ở đâu.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Task achievement",
              desc: "Trả lời đúng yêu cầu, đủ luận điểm",
              icon: Target,
            },
            {
              label: "Coherence & cohesion",
              desc: "Mạch lạc, liên kết câu/đoạn tốt",
              icon: TrendingUp,
            },
            {
              label: "Vocabulary",
              desc: "Đa dạng, chính xác, collocation",
              icon: BookOpen,
            },
            {
              label: "Grammar",
              desc: "Cấu trúc đa dạng, ít lỗi",
              icon: PenLine,
            },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-border bg-surface-low p-4"
            >
              <c.icon className="h-4 w-4 text-accent" />
              <p className="mt-2 text-sm font-bold">{c.label}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
