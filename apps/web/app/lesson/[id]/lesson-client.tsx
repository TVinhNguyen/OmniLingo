"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { X, Heart, Check, Volume2, Mic, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { completeLessonAction, submitAnswerAction } from "./actions"
import type { Exercise, LessonContent } from "@/lib/api/types"

type Activity =
  | {
      kind: "mcq"
      prompt: string
      audio?: boolean
      options: string[]
      answer: number
      reading?: string
    }
  | {
      kind: "typing"
      prompt: string
      hint: string
      answer: string
    }
  | {
      kind: "order"
      prompt: string
      words: string[]
      answer: string[]
    }
  | {
      kind: "listen"
      prompt: string
      audio: string
      answer: string
    }
  | {
      kind: "speak"
      prompt: string
      target: string
      reading: string
    }

const mockActivities: Activity[] = [
  {
    kind: "mcq",
    prompt: "Dịch câu sau sang tiếng Anh",
    reading: "Sumimasen, menyuu wo kudasai.",
    options: [
      "Excuse me, can I have the menu?",
      "Where is the bathroom?",
      "The weather is nice today.",
      "I want to order food.",
    ],
    answer: 0,
  },
  {
    kind: "typing",
    prompt: "Viết bằng tiếng Nhật:",
    hint: "Thank you very much.",
    answer: "ありがとうございます",
  },
  {
    kind: "order",
    prompt: "Sắp xếp thành câu hoàn chỉnh",
    words: ["コーヒー", "を", "ください", "アイス"],
    answer: ["アイス", "コーヒー", "を", "ください"],
  },
  {
    kind: "listen",
    prompt: "Gõ lại những gì bạn nghe",
    audio: "konnichiwa",
    answer: "こんにちは",
  },
  {
    kind: "speak",
    prompt: "Đọc to câu sau",
    target: "いらっしゃいませ！",
    reading: "Irasshaimase!",
  },
]

/**
 * Map a BFF Exercise to the local Activity shape. Returns null for kinds the
 * player cannot render (matching is not supported by any sub-component yet).
 */
function exerciseToActivity(e: Exercise): Activity | null {
  switch (e.kind) {
    case "multiple_choice": {
      if (!e.choices || e.choices.length === 0) return null
      const answerIdx = Number(e.correctAnswer ?? 0)
      return {
        kind: "mcq",
        prompt: e.prompt,
        options: e.choices,
        answer: Number.isFinite(answerIdx) ? answerIdx : 0,
      }
    }
    case "fill_in_blank":
    case "translation":
      return {
        kind: "typing",
        prompt: e.prompt,
        hint: e.prompt,
        answer: String(e.correctAnswer ?? ""),
      }
    case "sentence_arrange": {
      const answer = Array.isArray(e.correctAnswer) ? (e.correctAnswer as string[]) : []
      if (answer.length === 0) return null
      return {
        kind: "order",
        prompt: e.prompt,
        words: [...answer].sort(() => Math.random() - 0.5),
        answer,
      }
    }
    case "dictation":
      return {
        kind: "listen",
        prompt: e.prompt,
        audio: e.audioRef ?? "",
        answer: String(e.correctAnswer ?? ""),
      }
    case "speaking_prompt":
      return {
        kind: "speak",
        prompt: "Đọc to câu sau",
        target: String(e.correctAnswer ?? e.prompt),
        reading: e.prompt,
      }
    default:
      return null
  }
}

export default function LessonClient({
  sessionId,
  lessonId,
  content,
}: {
  sessionId: string
  lessonId:  string
  content?:  LessonContent | null
}) {
  void sessionId
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [xp, setXp] = useState(0)
  const [result, setResult] = useState<"idle" | "correct" | "wrong">("idle")
  const [, startTransition] = useTransition()

  /**
   * When real lesson content is available, map each exercise to an Activity
   * and keep a parallel Exercise[] for server-side grading dispatch. Falls
   * back to hardcoded mock activities when content is unavailable.
   */
  const { activities, realExercises } = useMemo(() => {
    if (content && content.exercises.length > 0) {
      const pairs = content.exercises
        .map((e) => {
          const a = exerciseToActivity(e)
          return a ? { activity: a, exercise: e } : null
        })
        .filter((p): p is { activity: Activity; exercise: Exercise } => p !== null)
      if (pairs.length > 0) {
        return {
          activities: pairs.map((p) => p.activity),
          realExercises: pairs.map((p) => p.exercise),
        }
      }
    }
    return { activities: mockActivities, realExercises: null as Exercise[] | null }
  }, [content])

  if (step >= activities.length) {
    return <LessonComplete xp={xp} />
  }

  const activity = activities[step]
  const progress = (step / activities.length) * 100

  const handleCheck = (isCorrect: boolean, userAnswer?: unknown) => {
    setResult(isCorrect ? "correct" : "wrong")
    if (isCorrect) setXp((x) => x + 12)
    else setHearts((h) => Math.max(0, h - 1))

    const ex = realExercises?.[step]
    if (ex && userAnswer !== undefined) {
      // Fire-and-forget: record attempt in assessment-service
      startTransition(async () => {
        await submitAnswerAction({
          lessonId,
          exerciseId:    ex.id,
          exerciseKind:  ex.kind,
          answer:        userAnswer,
          correctAnswer: ex.correctAnswer,
          maxScore:      ex.maxScore,
          skillTag:      ex.skill ?? "general",
          language:      ex.language,
        })
      })
    }
  }

  const handleContinue = () => {
    setResult("idle")
    const nextStep = step + 1
    if (nextStep >= activities.length) {
      // Fire-and-forget: record lesson completion in backend
      startTransition(async () => {
        await completeLessonAction(lessonId, xp + (result === "correct" ? 12 : 0))
      })
    }
    setStep(nextStep)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
          <button
            onClick={() => router.push("/learn")}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-low text-muted-foreground transition-colors hover:bg-surface-high hover:text-foreground"
            aria-label="Thoát"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-low">
            <motion.div
              className="h-full bg-gradient-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-destructive">
            <Heart className="h-5 w-5 fill-current" />
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* Activity */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Bài {step + 1} / {activities.length}
            </p>
            <h1 className="mt-2 font-sans text-2xl font-extrabold tracking-tight sm:text-3xl">
              {activity.prompt}
            </h1>

            {activity.kind === "mcq" && (
              <MCQActivity activity={activity} onCheck={handleCheck} />
            )}
            {activity.kind === "typing" && (
              <TypingActivity activity={activity} onCheck={handleCheck} />
            )}
            {activity.kind === "order" && (
              <OrderActivity activity={activity} onCheck={handleCheck} />
            )}
            {activity.kind === "listen" && (
              <ListenActivity activity={activity} onCheck={handleCheck} />
            )}
            {activity.kind === "speak" && (
              <SpeakActivity activity={activity} onCheck={handleCheck} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Feedback bar */}
      <AnimatePresence>
        {result !== "idle" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-30 border-t-2",
              result === "correct"
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            )}
          >
            <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-5">
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-white",
                  result === "correct" ? "bg-green-500" : "bg-red-500"
                )}
              >
                {result === "correct" ? (
                  <Check className="h-6 w-6" strokeWidth={3} />
                ) : (
                  <X className="h-6 w-6" strokeWidth={3} />
                )}
              </span>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-lg font-extrabold",
                    result === "correct" ? "text-green-800" : "text-red-800"
                  )}
                >
                  {result === "correct" ? "Tuyệt vời!" : "Không đúng"}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    result === "correct" ? "text-green-700" : "text-red-700"
                  )}
                >
                  {result === "correct"
                    ? `+${12} XP`
                    : "Đáp án đúng sẽ hiện ở bước sau"}
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleContinue}
                className={cn(
                  "rounded-full text-white shadow-hover",
                  result === "correct"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                )}
              >
                Tiếp
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MCQActivity({
  activity,
  onCheck,
}: {
  activity: Extract<Activity, { kind: "mcq" }>
  onCheck: (correct: boolean, userAnswer: unknown) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div>
      <div className="mt-8 flex items-center gap-4 rounded-3xl bg-surface-lowest p-6 shadow-ambient">
        <button className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-primary text-white shadow-ambient">
          <Volume2 className="h-5 w-5" />
        </button>
        <div>
          <p className="font-sans text-2xl font-bold tracking-tight">
            すみません、メニューを ください。
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activity.reading}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {activity.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-5 py-4 text-left transition-all",
              selected === i
                ? "bg-accent-container shadow-hover ring-2 ring-accent"
                : "bg-surface-lowest shadow-ambient hover:-translate-y-0.5"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                selected === i
                  ? "bg-accent text-white"
                  : "bg-surface-low text-muted-foreground"
              )}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="font-medium">{opt}</span>
          </button>
        ))}
      </div>

      <Button
        size="lg"
        disabled={selected === null}
        onClick={() => onCheck(selected === activity.answer, selected)}
        className="mt-8 w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient disabled:opacity-40"
      >
        Kiểm tra
      </Button>
    </div>
  )
}

function TypingActivity({
  activity,
  onCheck,
}: {
  activity: Extract<Activity, { kind: "typing" }>
  onCheck: (correct: boolean, userAnswer: unknown) => void
}) {
  const [value, setValue] = useState("")

  return (
    <div>
      <p className="mt-6 text-2xl font-bold">&ldquo;{activity.hint}&rdquo;</p>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Viết câu trả lời..."
        className="mt-8 h-16 rounded-2xl bg-surface-lowest px-6 text-xl shadow-ambient"
      />
      <Button
        size="lg"
        disabled={!value}
        onClick={() => onCheck(value.trim() === activity.answer, value.trim())}
        className="mt-8 w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
      >
        Kiểm tra
      </Button>
    </div>
  )
}

function OrderActivity({
  activity,
  onCheck,
}: {
  activity: Extract<Activity, { kind: "order" }>
  onCheck: (correct: boolean, userAnswer: unknown) => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  const remaining = activity.words.filter(
    (w) => !selected.includes(w) || selected.filter((s) => s === w).length < 1
  )

  return (
    <div>
      <div className="mt-6 min-h-24 rounded-3xl bg-surface-lowest p-5 shadow-ambient">
        <div className="flex flex-wrap gap-2">
          {selected.map((word, i) => (
            <button
              key={i}
              onClick={() => setSelected((s) => s.filter((_, idx) => idx !== i))}
              className="rounded-xl bg-accent-container px-4 py-2 font-semibold text-on-accent-container shadow-ambient"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {remaining.map((word, i) => (
          <button
            key={i}
            onClick={() => setSelected((s) => [...s, word])}
            className="rounded-xl bg-surface-lowest px-4 py-2 font-semibold shadow-ambient transition-all hover:-translate-y-0.5"
          >
            {word}
          </button>
        ))}
      </div>
      <Button
        size="lg"
        disabled={selected.length !== activity.answer.length}
        onClick={() =>
          onCheck(selected.join("") === activity.answer.join(""), selected)
        }
        className="mt-8 w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
      >
        Kiểm tra
      </Button>
    </div>
  )
}

function ListenActivity({
  activity,
  onCheck,
}: {
  activity: Extract<Activity, { kind: "listen" }>
  onCheck: (correct: boolean, userAnswer: unknown) => void
}) {
  const [value, setValue] = useState("")

  return (
    <div>
      <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-hover">
        <button className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-primary shadow-ambient">
          <span className="absolute inset-0 animate-pulse-ring rounded-full" />
          <Volume2 className="h-9 w-9" />
        </button>
        <p className="text-sm opacity-85">Nhấn để phát · 1.0x</p>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            ⏪ 0.75x
          </button>
          <button className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            🐢 0.5x
          </button>
        </div>
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Viết những gì bạn nghe..."
        className="mt-6 h-16 rounded-2xl bg-surface-lowest px-6 text-xl shadow-ambient"
      />
      <Button
        size="lg"
        disabled={!value}
        onClick={() => onCheck(value.trim() === activity.answer, value.trim())}
        className="mt-6 w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
      >
        Kiểm tra
      </Button>
    </div>
  )
}

function SpeakActivity({
  activity,
  onCheck,
}: {
  activity: Extract<Activity, { kind: "speak" }>
  onCheck: (correct: boolean, userAnswer: unknown) => void
}) {
  const [recording, setRecording] = useState(false)

  return (
    <div>
      <div className="mt-8 rounded-3xl bg-surface-lowest p-6 shadow-ambient">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Đọc to câu này
        </p>
        <p className="mt-3 font-sans text-3xl font-extrabold leading-tight">
          {activity.target}
        </p>
        <p className="mt-2 text-muted-foreground">{activity.reading}</p>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <button
          onMouseDown={() => setRecording(true)}
          onMouseUp={() => {
            setRecording(false)
            setTimeout(() => onCheck(true, activity.target), 600)
          }}
          className={cn(
            "relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-hover transition-all",
            recording
              ? "bg-destructive scale-110"
              : "bg-gradient-fluency hover:scale-105"
          )}
        >
          {recording && (
            <span className="absolute inset-0 animate-pulse-ring rounded-full" />
          )}
          <Mic className="h-10 w-10" strokeWidth={2.2} />
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          {recording ? "Đang thu âm..." : "Giữ để nói"}
        </p>
      </div>
    </div>
  )
}

function LessonComplete({ xp }: { xp: number }) {
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-primary px-4 text-primary-foreground">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-[2rem] bg-white/10 p-10 text-center backdrop-blur-xl"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 1, repeat: 2, delay: 0.4 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-6xl"
        >
          🎉
        </motion.div>
        <h1 className="mt-6 text-4xl font-extrabold">Hoàn thành!</h1>
        <p className="mt-2 text-white/85">
          Bạn đã làm tốt. Tiếp tục duy trì streak!
        </p>
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/15 p-4">
            <p className="text-3xl font-extrabold">{xp}</p>
            <p className="text-xs uppercase tracking-widest text-white/70">XP</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4">
            <p className="text-3xl font-extrabold">5:32</p>
            <p className="text-xs uppercase tracking-widest text-white/70">
              Thời gian
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4">
            <p className="text-3xl font-extrabold">95%</p>
            <p className="text-xs uppercase tracking-widest text-white/70">
              Chính xác
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <Button
            size="lg"
            onClick={() => router.push("/learn")}
            className="w-full rounded-full bg-white text-primary hover:bg-white/90"
          >
            Nhận thưởng & tiếp bài
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-full text-white hover:bg-white/10"
          >
            Về Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
