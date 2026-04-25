"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Clock,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  CheckCircle2,
  Play,
  Lock,
  Trophy,
  TrendingUp,
  AlertCircle,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const SECTIONS = [
  {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    duration: 30,
    questions: 40,
    color: "from-[#702ae1] to-[#b48bff]",
    status: "completed" as const,
    score: 7.5,
  },
  {
    id: "reading",
    name: "Reading",
    icon: BookOpen,
    duration: 60,
    questions: 40,
    color: "from-[#5352a5] to-[#a19ff9]",
    status: "completed" as const,
    score: 7.0,
  },
  {
    id: "writing",
    name: "Writing",
    icon: PenLine,
    duration: 60,
    questions: 2,
    color: "from-[#983772] to-[#d56ba6]",
    status: "in_progress" as const,
    score: null,
  },
  {
    id: "speaking",
    name: "Speaking",
    icon: Mic,
    duration: 14,
    questions: 3,
    color: "from-[#2e9e6a] to-[#5cc29a]",
    status: "locked" as const,
    score: null,
  },
]

export default function MockTestPage() {
  const params = useParams()
  const examType = (params?.examType as string) ?? "ielts"
  const mockId = (params?.id as string) ?? "m1"

  const [activeSection, setActiveSection] = useState<string | null>(null)

  const completed = SECTIONS.filter((s) => s.status === "completed").length
  const avgScore =
    SECTIONS.filter((s) => s.score !== null).reduce(
      (sum, s) => sum + (s.score ?? 0),
      0,
    ) / (completed || 1)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Button
          variant="ghost"
          asChild
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/test-prep/${examType}`}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại {examType.toUpperCase()}
          </Link>
        </Button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white shadow-hover"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/70">
                <FileText className="h-4 w-4" />
                Mock Test {mockId.toUpperCase()}
              </div>
              <h1 className="mt-2 text-4xl font-bold">
                {examType.toUpperCase()} Full Mock Test
              </h1>
              <p className="mt-3 max-w-2xl text-white/85">
                Mô phỏng bài thi thật với đầy đủ 4 kỹ năng. Hoàn thành từng phần theo thứ tự để
                nhận band điểm tổng.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <Badge className="rounded-full bg-white/20 text-white hover:bg-white/25">
                  <Clock className="mr-1 h-3 w-3" />
                  Tổng 2h 45m
                </Badge>
                <Badge className="rounded-full bg-white/20 text-white hover:bg-white/25">
                  85 câu hỏi
                </Badge>
                <Badge className="rounded-full bg-white/20 text-white hover:bg-white/25">
                  Academic
                </Badge>
              </div>
            </div>

            <div className="rounded-3xl bg-white/15 px-6 py-5 backdrop-blur">
              <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                Tiến độ hiện tại
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-bold">{completed}</span>
                <span className="text-lg text-white/70">/ 4 phần</span>
              </div>
              {completed > 0 && (
                <div className="mt-3 border-t border-white/20 pt-3">
                  <div className="text-xs text-white/70">Điểm trung bình</div>
                  <div className="text-2xl font-bold">{avgScore.toFixed(1)}</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Sections */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Các phần thi</h2>

            {SECTIONS.map((section, idx) => {
              const isActive = activeSection === section.id
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient transition-shadow ${
                    section.status === "locked" ? "opacity-60" : "hover:shadow-hover"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${section.color} text-white shadow-hover`}
                      >
                        <section.icon className="h-7 w-7" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{section.name}</h3>
                          {section.status === "completed" && (
                            <Badge className="rounded-full bg-success/15 text-success hover:bg-success/20">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Hoàn thành
                            </Badge>
                          )}
                          {section.status === "in_progress" && (
                            <Badge className="rounded-full bg-accent/20 text-accent-foreground hover:bg-accent/30">
                              Đang làm
                            </Badge>
                          )}
                          {section.status === "locked" && (
                            <Badge variant="outline" className="rounded-full">
                              <Lock className="mr-1 h-3 w-3" />
                              Khóa
                            </Badge>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {section.duration} phút
                          </span>
                          <span>{section.questions} câu hỏi</span>
                        </div>

                        {section.score !== null && (
                          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-surface-low p-3">
                            <Trophy className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground">
                                Band điểm
                              </div>
                              <div className="text-xl font-bold">{section.score}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setActiveSection(isActive ? null : section.id)
                              }
                            >
                              {isActive ? "Ẩn" : "Chi tiết"}
                            </Button>
                          </div>
                        )}
                      </div>

                      <Button
                        disabled={section.status === "locked"}
                        className={
                          section.status === "completed"
                            ? "h-11 gap-2 rounded-2xl"
                            : "h-11 gap-2 rounded-2xl bg-gradient-primary shadow-hover"
                        }
                        variant={section.status === "completed" ? "outline" : "default"}
                      >
                        {section.status === "completed" ? "Xem lại" : section.status === "in_progress" ? "Tiếp tục" : "Làm bài"}
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>

                    {isActive && section.status === "completed" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mt-4 border-t pt-4"
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-surface-low p-3">
                            <div className="text-xs text-muted-foreground">Đúng</div>
                            <div className="text-xl font-bold text-success">
                              {Math.round((section.score ?? 0) * 4)}/40
                            </div>
                          </div>
                          <div className="rounded-2xl bg-surface-low p-3">
                            <div className="text-xs text-muted-foreground">
                              Thời gian
                            </div>
                            <div className="text-xl font-bold">
                              {section.duration - 5} phút
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-max">
            <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <AlertCircle className="h-5 w-5 text-accent" />
                Lưu ý quan trọng
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                  Hoàn thành tuần tự từng phần
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                  Không được dừng giữa chừng một phần
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                  Kết quả tự động lưu sau mỗi phần
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 p-6 shadow-ambient">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" />
                So với lần trước
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold text-success">+0.5</div>
                <div className="text-xs text-muted-foreground">band điểm</div>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Target</span>
                    <span className="font-semibold">7.5</span>
                  </div>
                  <Progress value={((avgScore || 0) / 7.5) * 100} className="mt-1 h-2" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
