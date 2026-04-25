"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Calendar,
  Clock,
  Users,
  Download,
  FileText,
  Video,
  Star,
  Share2,
  Heart,
  ChevronRight,
  CalendarPlus,
  Globe,
  CheckCircle2,
  Lock,
  Play,
} from "lucide-react"
import { FlagIcon } from "@/components/flag-icon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const classData = {
  title: "Business English B2 — Presentations",
  description:
    "Khóa học live chuyên sâu giúp bạn làm chủ kỹ năng thuyết trình bằng tiếng Anh trong môi trường doanh nghiệp. Học từ cách mở bài, sử dụng body language, tới cách xử lý câu hỏi khó từ audience.",
  instructor: { name: "Emma Wilson", avatar: "EW", rating: 4.9, reviews: 342 },
  language: "en",
  level: "B2",
  schedule: {
    date: "Thứ 5, 24 Tháng 10, 2024",
    time: "19:00 - 20:30",
    duration: "90 phút",
    timezone: "GMT+7 (Hồ Chí Minh)",
  },
  enrolled: 23,
  capacity: 30,
  price: 12,
  materials: [
    { name: "Slides bài giảng", size: "2.4 MB", type: "pdf", locked: false },
    { name: "Exercise handout", size: "520 KB", type: "pdf", locked: false },
    { name: "Recording (sau buổi học)", size: "—", type: "video", locked: true },
    { name: "Quizlet vocab set", size: "32 words", type: "link", locked: false },
  ],
  reviews: [
    {
      name: "Tomás Hernández",
      avatar: "TH",
      rating: 5,
      text: "Emma là tutor tuyệt vời. Lớp học có cấu trúc rõ ràng, nhiều bài tập thực hành.",
      date: "2 tuần trước",
    },
    {
      name: "Ming Zhou",
      avatar: "MZ",
      rating: 5,
      text: "Content cực kỳ thực tế, có thể áp dụng ngay tại công ty.",
      date: "1 tháng trước",
    },
    {
      name: "Anna Schmidt",
      avatar: "AS",
      rating: 4,
      text: "Rất bổ ích. Mong có thêm buổi về negotiation.",
      date: "1 tháng trước",
    },
  ],
  roster: ["JD", "SK", "MR", "AL", "EV", "CT", "KW", "LN"],
}

function Countdown() {
  const [time, setTime] = useState({ d: 3, h: 14, m: 23, s: 45 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime((p) => {
        const s = p.s - 1
        if (s >= 0) return { ...p, s }
        const m = p.m - 1
        if (m >= 0) return { ...p, m, s: 59 }
        const h = p.h - 1
        if (h >= 0) return { ...p, h, m: 59, s: 59 }
        return p
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { v: time.d, l: "Ngày" },
        { v: time.h, l: "Giờ" },
        { v: time.m, l: "Phút" },
        { v: time.s, l: "Giây" },
      ].map((x, i) => (
        <div key={i} className="rounded-xl bg-white/10 p-3 text-center backdrop-blur">
          <div className="text-2xl font-bold tabular-nums">{String(x.v).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase text-white/70">{x.l}</div>
        </div>
      ))}
    </div>
  )
}

export default function LiveClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [enrolled, setEnrolled] = useState(false)
  const spotsLeft = classData.capacity - classData.enrolled

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/live" className="hover:text-primary">
          Live classes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate">{classData.title}</span>
      </nav>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white shadow-hover"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="bg-white/20 backdrop-blur">
                <FlagIcon code={classData.language} className="mr-1.5 h-3 w-4" />
                Tiếng Anh
              </Badge>
              <Badge className="bg-white/20 backdrop-blur">{classData.level}</Badge>
              <Badge className="bg-success text-white">LIVE CLASS</Badge>
            </div>
            <h1 className="font-sans text-3xl font-bold text-balance lg:text-4xl">
              {classData.title}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20 font-bold backdrop-blur">
                {classData.instructor.avatar}
              </div>
              <div>
                <div className="font-medium">{classData.instructor.name}</div>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {classData.instructor.rating} · {classData.instructor.reviews} reviews
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur lg:min-w-[280px]">
            <div className="mb-3 text-xs uppercase tracking-wider text-white/80">
              Bắt đầu trong
            </div>
            <Countdown />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <h2 className="mb-4 text-lg font-semibold">Thông tin buổi học</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Calendar, label: "Ngày", value: classData.schedule.date },
                { icon: Clock, label: "Thời gian", value: classData.schedule.time },
                { icon: Video, label: "Thời lượng", value: classData.schedule.duration },
                { icon: Globe, label: "Múi giờ", value: classData.schedule.timezone },
              ].map((x, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-surface-low p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/10">
                    <x.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{x.label}</div>
                    <div className="truncate text-sm font-medium">{x.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <h2 className="mb-3 text-lg font-semibold">Mô tả</h2>
            <p className="leading-relaxed text-muted-foreground text-pretty">
              {classData.description}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                "Structure presentation chuyên nghiệp",
                "Body language & voice control",
                "Q&A handling techniques",
              ].map((x, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-2xl bg-surface-low p-3 text-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Roster */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Học viên đăng ký</h2>
              <Badge variant="secondary">
                {classData.enrolled}/{classData.capacity}
              </Badge>
            </div>
            <div className="flex -space-x-2">
              {classData.roster.map((r, i) => (
                <div
                  key={i}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-surface-lowest bg-gradient-primary text-xs font-bold text-white"
                >
                  {r}
                </div>
              ))}
              <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-surface-lowest bg-surface-low text-xs font-semibold">
                +{classData.enrolled - classData.roster.length}
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-low">
              <div
                className="h-full rounded-full bg-gradient-primary transition-all"
                style={{ width: `${(classData.enrolled / classData.capacity) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Còn <span className="font-semibold text-warning">{spotsLeft} suất</span> - đăng ký
              sớm để giữ chỗ
            </p>
          </motion.div>

          {/* Materials */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <h2 className="mb-4 text-lg font-semibold">Tài liệu lớp học</h2>
            <div className="space-y-2">
              {classData.materials.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-2xl p-3 transition-colors ${
                    enrolled && !m.locked
                      ? "bg-surface-low hover:bg-primary/5"
                      : "bg-surface-low opacity-60"
                  }`}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/10">
                    {m.locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.size}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!enrolled || m.locked}
                    className="rounded-lg"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {!enrolled && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Đăng ký để tải tài liệu
              </p>
            )}
          </motion.div>

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Đánh giá ({classData.instructor.reviews})
              </h2>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold">{classData.instructor.rating}</span>
              </div>
            </div>
            <div className="space-y-4">
              {classData.reviews.map((r, i) => (
                <div key={i} className="flex gap-3 border-b border-border pb-4 last:border-0">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                    {r.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.name}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s < r.rating ? "fill-warning text-warning" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                    <div className="mt-1 text-xs text-muted-foreground">{r.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="rounded-3xl bg-surface-lowest p-6 shadow-hover">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Học phí
                </div>
                <div className="mt-1 text-4xl font-bold text-primary">${classData.price}</div>
                <div className="mt-1 text-xs text-muted-foreground">/ buổi 90 phút</div>
              </div>

              {enrolled ? (
                <Button
                  asChild
                  className="mt-4 w-full rounded-xl bg-success shadow-hover"
                  size="lg"
                >
                  <Link href={`/live/${id}/room`}>
                    <Play className="mr-2 h-4 w-4" />
                    Vào lớp học
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => setEnrolled(true)}
                  className="mt-4 w-full rounded-xl bg-primary shadow-ambient"
                  size="lg"
                >
                  Đăng ký ngay
                </Button>
              )}

              <Button variant="outline" className="mt-2 w-full rounded-xl bg-transparent">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Thêm vào lịch
              </Button>

              <div className="mt-4 flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1 rounded-xl">
                  <Share2 className="mr-1.5 h-3.5 w-3.5" />
                  Chia sẻ
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 rounded-xl">
                  <Heart className="mr-1.5 h-3.5 w-3.5" />
                  Lưu
                </Button>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 p-5">
              <Users className="mb-2 h-5 w-5 text-primary" />
              <div className="text-sm font-semibold">Lớp nhỏ</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tối đa {classData.capacity} học viên để đảm bảo chất lượng tương tác
              </p>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
