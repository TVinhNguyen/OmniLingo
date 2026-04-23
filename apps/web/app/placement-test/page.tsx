"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Brain,
  Sparkles,
  Clock,
  Target,
  ChevronLeft,
  Volume2,
  CheckCircle2,
  XCircle,
  Trophy,
  BookOpen,
  Headphones,
  MessageSquare,
  PenTool,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Question = {
  id: number
  level: "A1" | "A2" | "B1" | "B2" | "C1"
  skill: "grammar" | "vocab" | "reading" | "listening"
  prompt: string
  context?: string
  options: string[]
  correct: number
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    level: "A1",
    skill: "grammar",
    prompt: "She ___ to school every day.",
    options: ["go", "goes", "going", "gone"],
    correct: 1,
  },
  {
    id: 2,
    level: "A2",
    skill: "vocab",
    prompt: "Choose the word that means 'to begin'.",
    options: ["finish", "start", "stop", "wait"],
    correct: 1,
  },
  {
    id: 3,
    level: "A2",
    skill: "listening",
    prompt: "Listen to the audio. What is the speaker ordering?",
    context: "audio_order",
    options: ["A coffee", "A tea", "A juice", "A water"],
    correct: 0,
  },
  {
    id: 4,
    level: "B1",
    skill: "reading",
    prompt: "Based on the passage, what is the main idea?",
    context:
      "Climate change is affecting polar ecosystems at an unprecedented rate. Ice caps are melting faster than predicted, forcing species to adapt or migrate.",
    options: [
      "Polar bears are endangered",
      "Climate change is rapidly impacting polar regions",
      "Scientists are studying ice caps",
      "Species are migrating south",
    ],
    correct: 1,
  },
  {
    id: 5,
    level: "B1",
    skill: "grammar",
    prompt: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "will be"],
    correct: 2,
  },
  {
    id: 6,
    level: "B2",
    skill: "vocab",
    prompt: "The choose the best word: 'Her arguments were _____ and difficult to refute.'",
    options: ["weak", "compelling", "boring", "simple"],
    correct: 1,
  },
  {
    id: 7,
    level: "B2",
    skill: "grammar",
    prompt: "By the time we arrived, the meeting ___.",
    options: ["already started", "has already started", "had already started", "was already starting"],
    correct: 2,
  },
  {
    id: 8,
    level: "C1",
    skill: "reading",
    prompt: "The author's tone in the passage can best be described as:",
    context:
      "While proponents tout the merits of this policy, a cursory examination reveals its fundamental flaws. The premise itself rests on shaky empirical ground.",
    options: ["Enthusiastic", "Skeptical", "Neutral", "Apologetic"],
    correct: 1,
  },
]

type Phase = "intro" | "test" | "result"

export default function PlacementTestPage() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const current = QUESTIONS[index]
  const progress = ((index + (showFeedback ? 1 : 0)) / QUESTIONS.length) * 100

  const { level, score, breakdown } = useMemo(() => {
    if (phase !== "result") return { level: "A1" as const, score: 0, breakdown: {} as Record<string, number> }
    const correct = answers.filter((a, i) => a === QUESTIONS[i].correct).length
    const pct = Math.round((correct / QUESTIONS.length) * 100)
    let lvl: "A1" | "A2" | "B1" | "B2" | "C1" = "A1"
    if (pct >= 90) lvl = "C1"
    else if (pct >= 75) lvl = "B2"
    else if (pct >= 55) lvl = "B1"
    else if (pct >= 35) lvl = "A2"
    const bd: Record<string, number> = {}
    const totals: Record<string, number> = {}
    QUESTIONS.forEach((q, i) => {
      totals[q.skill] = (totals[q.skill] || 0) + 1
      if (answers[i] === q.correct) bd[q.skill] = (bd[q.skill] || 0) + 1
    })
    const normalized: Record<string, number> = {}
    Object.keys(totals).forEach((k) => {
      normalized[k] = Math.round(((bd[k] || 0) / totals[k]) * 100)
    })
    return { level: lvl, score: pct, breakdown: normalized }
  }, [phase, answers])

  const handleAnswer = () => {
    if (selected === null) return
    setShowFeedback(true)
    setTimeout(() => {
      const newAnswers = [...answers, selected]
      setAnswers(newAnswers)
      if (index < QUESTIONS.length - 1) {
        setIndex(index + 1)
        setSelected(null)
        setShowFeedback(false)
      } else {
        setPhase("result")
      }
    }, 1400)
  }

  if (phase === "intro") {
    return (
      <div className="min-h-dvh bg-surface-low">
        <header className="flex items-center justify-between border-b border-border bg-surface-lowest/80 px-4 py-3 backdrop-blur sm:px-6">
          <Link href="/onboarding" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-semibold">OmniLingo</span>
          </div>
          <div className="w-16" />
        </header>

        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-surface-lowest p-8 shadow-ambient sm:p-12"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mt-6 text-center font-serif text-3xl font-semibold text-pretty sm:text-4xl">
              Bài kiểm tra xếp lớp
            </h1>
            <p className="mt-3 text-center text-muted-foreground text-pretty">
              Chúng tôi sẽ đánh giá trình độ của bạn qua 8 câu hỏi thích ứng. Kết quả giúp OmniLingo
              thiết kế lộ trình học phù hợp nhất với bạn.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Clock, label: "Thời gian", value: "~8 phút" },
                { icon: Target, label: "Câu hỏi", value: "8 câu" },
                { icon: Trophy, label: "Kết quả", value: "Ngay lập tức" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-surface-low p-4 text-center"
                >
                  <item.icon className="mx-auto h-5 w-5 text-primary" />
                  <div className="mt-2 text-xs text-muted-foreground">{item.label}</div>
                  <div className="font-semibold">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-surface-low p-5">
              <div className="font-semibold">Bài kiểm tra đánh giá:</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { icon: BookOpen, label: "Ngữ pháp" },
                  { icon: MessageSquare, label: "Từ vựng" },
                  { icon: PenTool, label: "Đọc hiểu" },
                  { icon: Headphones, label: "Nghe hiểu" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-sm">
                    <s.icon className="h-4 w-4 text-primary" />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="mt-8 h-12 w-full rounded-xl text-base"
              onClick={() => setPhase("test")}
            >
              Bắt đầu kiểm tra
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Bạn có thể bỏ qua và làm bài test sau trong Cài đặt.
            </p>
          </motion.div>
        </main>
      </div>
    )
  }

  if (phase === "test") {
    return (
      <div className="min-h-dvh bg-surface-low">
        <header className="sticky top-0 z-10 border-b border-border bg-surface-lowest/80 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
            <Button variant="ghost" size="icon" onClick={() => setPhase("intro")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Progress value={progress} className="h-2 flex-1" />
            <div className="text-sm tabular-nums text-muted-foreground">
              {index + 1}/{QUESTIONS.length}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="uppercase">
                  {current.level}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {current.skill}
                </Badge>
              </div>

              {current.context && current.context !== "audio_order" && (
                <div className="mt-5 rounded-2xl border border-border bg-surface-lowest p-5 text-sm leading-relaxed text-foreground">
                  {current.context}
                </div>
              )}

              {current.context === "audio_order" && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-surface-lowest p-5">
                  <Button size="icon" className="h-12 w-12 rounded-full">
                    <Volume2 className="h-5 w-5" />
                  </Button>
                  <div className="text-sm text-muted-foreground">Nhấn để phát audio</div>
                </div>
              )}

              <h2 className="mt-6 font-serif text-2xl font-semibold text-pretty sm:text-3xl">
                {current.prompt}
              </h2>

              <div className="mt-8 grid gap-3">
                {current.options.map((opt, i) => {
                  const isSelected = selected === i
                  const isCorrect = showFeedback && i === current.correct
                  const isWrong = showFeedback && isSelected && i !== current.correct
                  return (
                    <button
                      key={i}
                      disabled={showFeedback}
                      onClick={() => setSelected(i)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition",
                        "border-border bg-surface-lowest hover:border-primary/40",
                        isSelected && !showFeedback && "border-primary bg-primary/5",
                        isCorrect && "border-success bg-success/10",
                        isWrong && "border-danger bg-danger/10",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-border bg-surface-low font-mono text-sm font-semibold",
                          isSelected && !showFeedback && "border-primary bg-primary text-primary-foreground",
                          isCorrect && "border-success bg-success text-success-foreground",
                          isWrong && "border-danger bg-danger text-danger-foreground",
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="flex-1 font-medium">{opt}</div>
                      {isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                      {isWrong && <XCircle className="h-5 w-5 text-danger" />}
                    </button>
                  )
                })}
              </div>

              <Button
                size="lg"
                className="mt-8 h-12 w-full rounded-xl"
                disabled={selected === null || showFeedback}
                onClick={handleAnswer}
              >
                {showFeedback ? "Đang chuyển..." : index === QUESTIONS.length - 1 ? "Hoàn thành" : "Tiếp theo"}
                {!showFeedback && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    )
  }

  // Result phase
  const LEVEL_META: Record<string, { title: string; desc: string; color: string }> = {
    A1: { title: "Sơ cấp", desc: "Bắt đầu hành trình từ nền tảng", color: "bg-accent" },
    A2: { title: "Cơ bản", desc: "Giao tiếp đơn giản hằng ngày", color: "bg-info" },
    B1: { title: "Trung cấp", desc: "Tự tin trong tình huống quen thuộc", color: "bg-success" },
    B2: { title: "Trung cao cấp", desc: "Giao tiếp trôi chảy, nhiều chủ đề", color: "bg-primary" },
    C1: { title: "Cao cấp", desc: "Thành thạo gần như người bản xứ", color: "bg-primary-strong" },
  }
  const meta = LEVEL_META[level]

  return (
    <div className="min-h-dvh bg-surface-low">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-surface-lowest p-8 shadow-ambient sm:p-12"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10"
            >
              <Trophy className="h-12 w-12 text-primary" />
            </motion.div>

            <div className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Trình độ của bạn
            </div>
            <div className="mt-2 flex items-baseline justify-center gap-3">
              <span className="font-serif text-6xl font-semibold text-primary sm:text-7xl">{level}</span>
              <span className="font-serif text-2xl text-muted-foreground">{meta.title}</span>
            </div>
            <p className="mt-2 text-muted-foreground">{meta.desc}</p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface-low px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Điểm: {score}/100</span>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <div className="font-semibold">Phân tích chi tiết</div>
            {Object.entries(breakdown).map(([skill, pct]) => (
              <div key={skill}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="capitalize">{skill}</span>
                  <span className="tabular-nums text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-low">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-surface-low p-5">
            <div className="font-semibold">Chúng tôi đã chuẩn bị cho bạn:</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Lộ trình cá nhân hoá từ trình độ {level}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Bài luyện tập phù hợp với điểm yếu
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Đề xuất giáo viên và tài liệu phù hợp
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 flex-1 rounded-xl">
              <Link href="/dashboard">
                Đi tới Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-xl">
              <Link href="/learn">Xem lộ trình</Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
