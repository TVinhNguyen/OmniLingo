"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookA,
  Languages as LanguagesIcon,
  Headphones,
  Mic,
  BookOpen,
  Pencil,
  Flame,
  Clock,
  Target,
  Trophy,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  RotateCw,
  ExternalLink,
  Users,
  Crosshair,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
} from "recharts"

type SkillKey =
  | "vocabulary"
  | "grammar"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"

const SKILL_META: Record<
  SkillKey,
  {
    label: string
    icon: LucideIcon
    gradient: string
    currentLevel: string
    nextLevel: string
    progressToNext: number
    description: string
  }
> = {
  vocabulary: {
    label: "Từ vựng",
    icon: BookA,
    gradient: "from-[#5352a5] to-[#a19ff9]",
    currentLevel: "B2",
    nextLevel: "C1",
    progressToNext: 64,
    description:
      "SRS deck, reading vocab, chunk patterns — 6,842 từ đã học, 87% retention rate.",
  },
  grammar: {
    label: "Ngữ pháp",
    icon: LanguagesIcon,
    gradient: "from-[#702ae1] to-[#983772]",
    currentLevel: "B1",
    nextLevel: "B2",
    progressToNext: 78,
    description:
      "23 topic đã thạo, 8 topic đang luyện. Accuracy tăng 12% trong 30 ngày qua.",
  },
  listening: {
    label: "Nghe",
    icon: Headphones,
    gradient: "from-[#983772] to-[#a19ff9]",
    currentLevel: "B2",
    nextLevel: "C1",
    progressToNext: 48,
    description:
      "Đã nghe 42h, 78 bài hoàn thành. Podcast B2 đạt 87% comprehension.",
  },
  speaking: {
    label: "Nói",
    icon: Mic,
    gradient: "from-[#a19ff9] to-[#702ae1]",
    currentLevel: "B1",
    nextLevel: "B2",
    progressToNext: 55,
    description:
      "Đã nói 9.5h, AI chấm pronunciation 82. Cần cải thiện /θ/, /ð/ và stress pattern.",
  },
  reading: {
    label: "Đọc",
    icon: BookOpen,
    gradient: "from-[#5352a5] to-[#702ae1]",
    currentLevel: "B2",
    nextLevel: "C1",
    progressToNext: 72,
    description:
      "12 short stories, 8 articles. Tốc độ 185 WPM — trên trung bình B2.",
  },
  writing: {
    label: "Viết",
    icon: Pencil,
    gradient: "from-[#983772] to-[#702ae1]",
    currentLevel: "B1",
    nextLevel: "B2",
    progressToNext: 42,
    description:
      "32 bài đã viết, AI band trung bình 6.5. Task achievement 7.0, grammar 6.0.",
  },
}

const trendData = [
  { day: "T2", score: 62, time: 24 },
  { day: "T3", score: 65, time: 32 },
  { day: "T4", score: 60, time: 18 },
  { day: "T5", score: 68, time: 41 },
  { day: "T6", score: 72, time: 28 },
  { day: "T7", score: 75, time: 55 },
  { day: "CN", score: 78, time: 48 },
  { day: "T2", score: 74, time: 30 },
  { day: "T3", score: 80, time: 42 },
  { day: "T4", score: 78, time: 36 },
  { day: "T5", score: 82, time: 48 },
  { day: "T6", score: 85, time: 52 },
  { day: "T7", score: 83, time: 44 },
  { day: "CN", score: 87, time: 60 },
]

const subSkillData = [
  { name: "Dictation", score: 82, target: 90 },
  { name: "Podcast", score: 87, target: 90 },
  { name: "Shadowing", score: 68, target: 85 },
  { name: "Gap-fill", score: 79, target: 85 },
  { name: "Conversation", score: 74, target: 85 },
]

const percentileData = [
  { label: "Bạn", score: 78, color: "var(--primary)" },
  { label: "Top 10%", score: 92, color: "var(--accent)" },
  { label: "Median", score: 58, color: "var(--tertiary)" },
  { label: "Bottom 25%", score: 40, color: "var(--chart-4)" },
]

const weaknesses = [
  {
    id: "w1",
    name: "Phân biệt /θ/ và /s/",
    mistakes: 18,
    category: "Pronunciation",
    gradient: "from-[#983772] to-[#a19ff9]",
    href: "/practice/pronunciation",
  },
  {
    id: "w2",
    name: "Past perfect vs simple past",
    mistakes: 14,
    category: "Grammar",
    gradient: "from-[#5352a5] to-[#702ae1]",
    href: "/practice/grammar",
  },
  {
    id: "w3",
    name: "Collocations with 'make/do'",
    mistakes: 11,
    category: "Vocab",
    gradient: "from-[#702ae1] to-[#a19ff9]",
    href: "/practice/vocabulary",
  },
  {
    id: "w4",
    name: "Stress pattern in compound words",
    mistakes: 9,
    category: "Pronunciation",
    gradient: "from-[#a19ff9] to-[#5352a5]",
    href: "/practice/pronunciation",
  },
  {
    id: "w5",
    name: "Prepositions of time",
    mistakes: 7,
    category: "Grammar",
    gradient: "from-[#702ae1] to-[#983772]",
    href: "/practice/grammar",
  },
]

const recentExercises = [
  { id: "r1", date: "Hôm nay", name: "BBC news brief", type: "Dictation", score: 92, duration: "8 phút" },
  { id: "r2", date: "Hôm nay", name: "NHK Easy News #48", type: "Podcast", score: 88, duration: "15 phút" },
  { id: "r3", date: "Hôm qua", name: "Interview: startup founder", type: "Dictation", score: 75, duration: "12 phút" },
  { id: "r4", date: "Hôm qua", name: "Sherlock monologue", type: "Shadowing", score: 68, duration: "5 phút" },
  { id: "r5", date: "2 ngày", name: "TED talk excerpt", type: "Gap-fill", score: 82, duration: "10 phút" },
  { id: "r6", date: "3 ngày", name: "Airport announcement", type: "Dictation", score: 95, duration: "4 phút" },
]

export default function SkillDeepDivePage({
  params,
}: {
  params: Promise<{ skill: string }>
}) {
  const { skill } = use(params)
  const meta = SKILL_META[skill as SkillKey] ?? SKILL_META.listening
  const Icon = meta.icon
  const [tab, setTab] = useState<"trend" | "detail" | "compare">("trend")

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero */}
      <section
        data-aos="fade-up"
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-7 text-primary-foreground shadow-hover sm:p-9 ${meta.gradient}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Link href="/progress" className="hover:text-white">
              Tiến độ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-white">{meta.label}</span>
          </div>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
                <Icon className="h-8 w-8" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    CEFR · {meta.currentLevel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <TrendingUp className="h-3 w-3" /> Top 18%
                  </span>
                </div>
                <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Tiến độ kỹ năng{" "}
                  <span className="text-[#dcc9ff]">{meta.label}</span>
                </h1>
                <p className="mt-1.5 max-w-xl text-sm text-white/85 sm:text-base">
                  {meta.description}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                {meta.currentLevel} → {meta.nextLevel}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold leading-none">
                  {meta.progressToNext}
                </span>
                <span className="text-sm text-white/70">%</span>
              </div>
              <div className="mt-3 h-2 w-44 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white to-[#dcc9ff]"
                  style={{ width: `${meta.progressToNext}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-white/70">
                Còn {100 - meta.progressToNext}% để lên {meta.nextLevel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top stats */}
      <section
        data-aos="fade-up"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          icon={Trophy}
          label="Level hiện tại"
          value={meta.currentLevel}
          sub={`Tới ${meta.nextLevel} · ${meta.progressToNext}%`}
          gradient="from-[#5352a5] to-[#a19ff9]"
        />
        <StatCard
          icon={Clock}
          label="Tổng thời gian"
          value="42h"
          sub="Tăng 18% tháng này"
          gradient="from-[#702ae1] to-[#983772]"
        />
        <StatCard
          icon={Target}
          label="Bài tập xong"
          value="78"
          sub="54 bài tuần này"
          gradient="from-[#983772] to-[#a19ff9]"
        />
        <StatCard
          icon={Crosshair}
          label="Accuracy 7 ngày"
          value="87%"
          sub="+4% so tuần trước"
          gradient="from-[#a19ff9] to-[#5352a5]"
        />
      </section>

      {/* Charts */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Phân tích hiệu suất
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
              Biểu đồ tiến bộ
            </h2>
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="rounded-full bg-surface-low p-1">
              <TabsTrigger
                value="trend"
                className="rounded-full data-[state=active]:bg-surface-lowest data-[state=active]:shadow-ambient"
              >
                Xu hướng
              </TabsTrigger>
              <TabsTrigger
                value="detail"
                className="rounded-full data-[state=active]:bg-surface-lowest data-[state=active]:shadow-ambient"
              >
                Chi tiết
              </TabsTrigger>
              <TabsTrigger
                value="compare"
                className="rounded-full data-[state=active]:bg-surface-lowest data-[state=active]:shadow-ambient"
              >
                So sánh
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-6 h-80">
          {tab === "trend" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[40, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-lowest)",
                    border: "none",
                    borderRadius: 12,
                    boxShadow: "var(--shadow-ambient)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ fill: "var(--primary)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {tab === "detail" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subSkillData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} domain={[0, 100]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-lowest)",
                    border: "none",
                    borderRadius: 12,
                    boxShadow: "var(--shadow-ambient)",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="score" fill="var(--primary)" name="Điểm của bạn" radius={[0, 8, 8, 0]} />
                <Bar dataKey="target" fill="var(--accent-container)" name="Mục tiêu" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {tab === "compare" && (
            <div className="flex h-full flex-col justify-center gap-4 px-4">
              {percentileData.map((p) => (
                <div key={p.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold">{p.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {p.score}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-low">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${p.score}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-2 inline-flex items-center gap-2 self-start rounded-full bg-accent-container px-4 py-2 text-sm font-semibold text-on-accent-container">
                <Users className="h-3.5 w-3.5" />
                Bạn ở top 18% trong 120,000 người học {meta.label}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Weakness section */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Điểm yếu cần luyện
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight">
              5 chủ đề cần chú ý nhất
            </h2>
          </div>
          <Button
            size="sm"
            className="rounded-full bg-gradient-fluency text-primary-foreground shadow-ambient hover:opacity-95"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Tạo session luyện điểm yếu
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {weaknesses.map((w, i) => (
            <Link
              key={w.id}
              href={w.href}
              data-aos="fade-up"
              data-aos-delay={i * 40}
              className="group flex items-center gap-3 rounded-2xl bg-surface-low p-4 transition-all hover:-translate-y-0.5 hover:bg-accent-container"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-ambient ${w.gradient}`}
              >
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{w.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {w.category} · {w.mistakes} lần sai gần đây
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent exercises */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Hoạt động gần đây
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight">
              Bài tập đã làm
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full bg-surface-low">
            Xem tất cả <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[80px_1fr_110px_80px_80px_auto]">
            <span className="hidden sm:inline">Ngày</span>
            <span>Bài</span>
            <span className="hidden sm:inline">Loại</span>
            <span className="text-right">Điểm</span>
            <span className="hidden sm:inline text-right">Thời gian</span>
            <span className="w-20" />
          </div>

          {recentExercises.map((r, i) => (
            <div
              key={r.id}
              data-aos="fade-up"
              data-aos-delay={i * 20}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-border px-4 py-3 text-sm transition hover:bg-surface-low sm:grid-cols-[80px_1fr_110px_80px_80px_auto]"
            >
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {r.date}
              </span>
              <span className="truncate font-semibold">{r.name}</span>
              <span className="hidden rounded-full bg-surface-low px-2.5 py-1 text-center text-[11px] font-semibold sm:inline-flex sm:w-fit">
                {r.type}
              </span>
              <span
                className={`text-right font-bold tabular-nums ${r.score >= 85 ? "text-success" : r.score >= 70 ? "text-warning" : "text-destructive"}`}
              >
                {r.score}
              </span>
              <span className="hidden text-right text-xs text-muted-foreground sm:inline">
                {r.duration}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-[11px]"
              >
                <RotateCw className="mr-1 h-3 w-3" /> Làm lại
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-gradient-fluency p-7 text-primary-foreground shadow-hover"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-extrabold leading-tight">
              Sẵn sàng chinh phục {meta.nextLevel}?
            </h3>
            <p className="mt-1 text-sm text-white/85">
              AI sẽ tạo session cá nhân hoá tập trung vào 5 điểm yếu của bạn trong kỹ năng {meta.label}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="lg"
              className="rounded-full bg-white text-accent shadow-ambient hover:bg-white/90"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Tạo session luyện
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <Target className="mr-2 h-4 w-4" /> Đặt mục tiêu
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: LucideIcon
  label: string
  value: string
  sub: string
  gradient: string
}) {
  return (
    <div
      data-aos="fade-up"
      className="rounded-3xl bg-surface-lowest p-5 shadow-ambient"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-ambient ${gradient}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}
