"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  Clock,
  Check,
  X,
  Brain,
  Target,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const QUESTIONS = [
  {
    id: 1,
    skill: "Listening",
    type: "MCQ",
    prompt: "What is the speaker's main concern?",
    options: [
      "The deadline is too short",
      "The budget was cut",
      "Team members are unavailable",
      "The client changed requirements",
    ],
    correct: 0,
    difficulty: "medium",
  },
  {
    id: 2,
    skill: "Reading",
    type: "MCQ",
    prompt:
      "According to the passage, which of the following best describes the author's stance on remote work?",
    options: [
      "Strongly opposed under any circumstance",
      "Cautiously supportive with clear boundaries",
      "Completely indifferent to the outcome",
      "Only beneficial for small companies",
    ],
    correct: 1,
    difficulty: "hard",
  },
  {
    id: 3,
    skill: "Grammar",
    type: "FILL",
    prompt: "By the time we arrive, the meeting _____ already.",
    options: ["has started", "had started", "will have started", "started"],
    correct: 2,
    difficulty: "medium",
  },
  {
    id: 4,
    skill: "Vocabulary",
    type: "MCQ",
    prompt: "Choose the synonym of 'meticulous':",
    options: ["Careless", "Precise", "Brief", "Dull"],
    correct: 1,
    difficulty: "easy",
  },
  {
    id: 5,
    skill: "Writing",
    type: "MCQ",
    prompt: "Which sentence is most formal and appropriate for a business email?",
    options: [
      "Hey, can u send me the file asap?",
      "I would appreciate it if you could send the file at your earliest convenience.",
      "Gimme that file when u get a sec.",
      "Pls send file now. Thx.",
    ],
    correct: 1,
    difficulty: "medium",
  },
  {
    id: 6,
    skill: "Reading",
    type: "MCQ",
    prompt: "The word 'ubiquitous' in the passage most nearly means:",
    options: ["Rare", "Controversial", "Everywhere", "Outdated"],
    correct: 2,
    difficulty: "hard",
  },
  {
    id: 7,
    skill: "Grammar",
    type: "FILL",
    prompt: "If I _____ you, I would accept the offer.",
    options: ["am", "was", "were", "be"],
    correct: 2,
    difficulty: "easy",
  },
  {
    id: 8,
    skill: "Listening",
    type: "MCQ",
    prompt: "What tone does the speaker use in the final paragraph?",
    options: ["Sarcastic", "Enthusiastic", "Reflective", "Dismissive"],
    correct: 2,
    difficulty: "hard",
  },
]

export default function DiagnosticPage() {
  const params = useParams()
  const router = useRouter()
  const examType = (params?.examType as string) ?? "ielts"

  const [stage, setStage] = useState<"intro" | "test" | "result">("intro")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  )
  const [elapsed, setElapsed] = useState(0)

  const current = QUESTIONS[currentIdx]
  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100

  const result = useMemo(() => {
    const bySkill: Record<string, { correct: number; total: number }> = {}
    QUESTIONS.forEach((q, idx) => {
      const key = q.skill
      if (!bySkill[key]) bySkill[key] = { correct: 0, total: 0 }
      bySkill[key].total++
      if (answers[idx] === q.correct) bySkill[key].correct++
    })
    const totalCorrect = answers.filter((a, i) => a === QUESTIONS[i].correct).length
    const bandRaw = (totalCorrect / QUESTIONS.length) * 9
    return {
      bySkill,
      totalCorrect,
      band: bandRaw.toFixed(1),
      level: bandRaw >= 7 ? "Advanced" : bandRaw >= 5.5 ? "Intermediate" : "Elementary",
    }
  }, [answers])

  const selectAnswer = (optIdx: number) => {
    const newAnswers = [...answers]
    newAnswers[currentIdx] = optIdx
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setStage("result")
    }
  }

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-3xl px-4">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl bg-gradient-primary p-10 text-white shadow-hover"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <div className="text-sm font-medium uppercase tracking-wider text-white/70">
                  Diagnostic Test
                </div>
                <h1 className="text-3xl font-bold">Đánh giá trình độ ban đầu</h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/90">
              Bài kiểm tra nhanh 8 câu hỏi bao phủ Listening, Reading, Grammar, Vocabulary và Writing.
              Kết quả sẽ giúp AI điều chỉnh lộ trình học của bạn cho phù hợp.
            </p>
          </motion.div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Clock, label: "Thời gian", value: "15 phút" },
              { icon: Target, label: "Câu hỏi", value: `${QUESTIONS.length} câu` },
              { icon: Sparkles, label: "AI Analysis", value: "Tự động" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-surface-lowest p-4 shadow-ambient"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 text-sm text-muted-foreground">{item.label}</div>
                <div className="text-lg font-semibold">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-surface-lowest p-6 shadow-ambient">
            <h2 className="text-lg font-bold">Hướng dẫn</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                Chọn đáp án chính xác nhất theo cảm nhận của bạn
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                Không tra cứu hay nhờ người khác trợ giúp
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                Nếu không biết, hãy chọn đáp án hợp lý nhất thay vì bỏ trống
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                Kết quả chỉ mang tính tham khảo cho lộ trình ban đầu
              </li>
            </ul>
          </div>

          <Button
            size="lg"
            onClick={() => setStage("test")}
            className="mt-8 h-14 w-full rounded-2xl bg-gradient-primary text-base font-semibold shadow-hover"
          >
            Bắt đầu bài kiểm tra
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  if (stage === "result") {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-white shadow-hover"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur"
            >
              <Sparkles className="h-10 w-10" />
            </motion.div>
            <h1 className="mt-6 text-4xl font-bold">Kết quả đánh giá</h1>
            <div className="mt-8 inline-block rounded-3xl bg-white/15 px-12 py-6 backdrop-blur">
              <div className="text-sm font-medium uppercase tracking-wider text-white/80">
                Band ước lượng
              </div>
              <div className="mt-1 text-6xl font-bold">{result.band}</div>
              <div className="mt-1 text-sm text-white/80">{result.level}</div>
            </div>
          </motion.div>

          <div className="mt-8 rounded-3xl bg-surface-lowest p-6 shadow-ambient">
            <h2 className="text-xl font-bold">Phân tích theo kỹ năng</h2>
            <div className="mt-4 space-y-4">
              {Object.entries(result.bySkill).map(([skill, data]) => {
                const percent = (data.correct / data.total) * 100
                return (
                  <div key={skill}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{skill}</span>
                      <span className="text-muted-foreground">
                        {data.correct}/{data.total}
                      </span>
                    </div>
                    <Progress value={percent} className="mt-2 h-2" />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 p-6 shadow-ambient">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              Gợi ý lộ trình học
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                Tập trung củng cố <strong>Grammar</strong> trong 2 tuần đầu
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                Luyện <strong>Listening</strong> mỗi ngày 30 phút với podcast level B1-B2
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                Mở rộng <strong>Vocabulary</strong> với 20 từ mới/ngày qua flashcards
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 flex-1 rounded-2xl bg-gradient-primary font-semibold shadow-hover"
              onClick={() => router.push(`/test-prep/${examType}/plan`)}
            >
              Xem lộ trình chi tiết
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 flex-1 rounded-2xl"
              asChild
            >
              <Link href={`/test-prep/${examType}`}>Về trang môn thi</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Test stage
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b bg-surface-lowest/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="rounded-full">
              Câu {currentIdx + 1}/{QUESTIONS.length}
            </Badge>
            <Badge className="rounded-full bg-primary/10 text-primary">
              {current.skill}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-mono tabular-nums">
              {Math.floor(elapsed / 60)
                .toString()
                .padStart(2, "0")}
              :{(elapsed % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="h-1 bg-surface-low">
          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl bg-surface-lowest p-8 shadow-ambient"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
              {current.type}
            </div>
            <h2 className="mt-3 text-2xl font-bold leading-snug">{current.prompt}</h2>

            <div className="mt-8 space-y-3">
              {current.options.map((opt, idx) => {
                const selected = answers[currentIdx] === idx
                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(idx)}
                    className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/5 shadow-ambient"
                        : "border-border bg-surface-lowest hover:border-primary/40 hover:bg-surface-low"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-low text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {selected && <Check className="h-5 w-5 text-primary" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={answers[currentIdx] === null}
            className="h-12 gap-2 rounded-2xl bg-gradient-primary px-8 font-semibold shadow-hover disabled:opacity-50"
          >
            {currentIdx === QUESTIONS.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
