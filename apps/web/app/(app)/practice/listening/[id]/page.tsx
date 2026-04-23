"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { use } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Gauge,
  Subtitles,
  Repeat,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Bookmark,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const TRANSCRIPT = [
  { t: 0, text: "Welcome to our weekly podcast about technology and innovation." },
  { t: 5, text: "Today, we're talking about the rise of artificial intelligence in daily life." },
  { t: 11, text: "From smart assistants to self-driving cars, AI is reshaping everything around us." },
  { t: 18, text: "But is this rapid advancement purely beneficial, or should we be cautious?" },
  { t: 25, text: "Our guest today is Dr. Sarah Chen, an AI researcher from MIT." },
  { t: 31, text: "She'll share her thoughts on where we're heading in the next decade." },
  { t: 38, text: "Welcome to the show, Dr. Chen. Thanks for joining us today." },
  { t: 44, text: "Thank you for having me. It's a pleasure to be here." },
]

const QUESTIONS = [
  {
    id: 1,
    q: "What is the main topic of this podcast?",
    options: [
      "Climate change",
      "Artificial intelligence in daily life",
      "Self-driving cars only",
      "Space exploration",
    ],
    correct: 1,
  },
  {
    id: 2,
    q: "Where does Dr. Sarah Chen work?",
    options: ["Stanford", "Harvard", "MIT", "Berkeley"],
    correct: 2,
  },
  {
    id: 3,
    q: "What is Dr. Chen's field of expertise?",
    options: ["AI research", "Computer vision", "Robotics", "Data science"],
    correct: 0,
  },
]

export default function ListeningSession({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [showCaptions, setShowCaptions] = useState(true)
  const [phase, setPhase] = useState<"listen" | "questions" | "done">("listen")
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const duration = 52
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setTime((t) => {
          if (t >= duration) {
            setPlaying(false)
            return duration
          }
          return t + speed * 0.5
        })
      }, 500)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing, speed])

  const activeLine = TRANSCRIPT.findIndex((l, i) => {
    const next = TRANSCRIPT[i + 1]
    return time >= l.t && (!next || time < next.t)
  })

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const handleAnswer = () => {
    if (selected === null) return
    const correct = selected === QUESTIONS[qIndex].correct
    setFeedback(correct ? "correct" : "wrong")
    setTimeout(() => {
      const newAns = [...answers, selected]
      setAnswers(newAns)
      setSelected(null)
      setFeedback(null)
      if (qIndex < QUESTIONS.length - 1) {
        setQIndex(qIndex + 1)
      } else {
        setPhase("done")
      }
    }, 1200)
  }

  if (phase === "done") {
    const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-border bg-surface-lowest p-8 text-center shadow-ambient sm:p-12"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-semibold">Hoàn thành!</h1>
          <p className="mt-2 text-muted-foreground">
            Bạn đã nghe xong và trả lời {score}/{QUESTIONS.length} câu đúng
          </p>
          <div className="mt-6 text-5xl font-bold tabular-nums text-primary">
            {Math.round((score / QUESTIONS.length) * 100)}%
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 flex-1 rounded-xl">
              <Link href="/practice/listening">Bài tiếp theo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-xl">
              <Link href="/practice/listening">Quay lại</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/practice/listening">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Lesson {id}</Badge>
          <Badge variant="outline">Trung cấp</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Hero / Audio */}
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface-lowest to-surface-lowest p-8 shadow-ambient">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Podcast
                </div>
                <h1 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
                  AI in Our Daily Lives
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Episode 14 · Tech Talk Weekly · 5 min
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>

            {/* Waveform */}
            <div className="mt-8 flex h-16 items-end gap-1">
              {Array.from({ length: 64 }).map((_, i) => {
                const seed = ((i * 9301 + 49297) % 233280) / 233280
                const h = 20 + seed * 80
                const active = i / 64 < time / duration
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-sm transition-colors",
                      active ? "bg-primary" : "bg-surface-low",
                    )}
                    style={{ height: `${h}%` }}
                  />
                )
              })}
            </div>

            {/* Timeline */}
            <div className="mt-4 flex items-center gap-3 text-sm tabular-nums">
              <span>{fmt(time)}</span>
              <Progress value={(time / duration) * 100} className="h-1.5 flex-1" />
              <span className="text-muted-foreground">{fmt(duration)}</span>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setTime(Math.max(0, time - 5))}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setTime(Math.min(duration, time + 5))}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Utilities */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-full"
                onClick={() => setSpeed(speed === 1 ? 0.75 : speed === 0.75 ? 0.5 : speed === 0.5 ? 1.25 : 1)}
              >
                <Gauge className="h-3.5 w-3.5" />
                {speed}x
              </Button>
              <Button
                variant={showCaptions ? "default" : "outline"}
                size="sm"
                className="h-8 gap-1.5 rounded-full"
                onClick={() => setShowCaptions(!showCaptions)}
              >
                <Subtitles className="h-3.5 w-3.5" />
                Phụ đề
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full">
                <Repeat className="h-3.5 w-3.5" />
                Lặp lại
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full">
                <Volume2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Transcript / Questions */}
          <Tabs value={phase} onValueChange={(v) => setPhase(v as "listen" | "questions")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="listen">Transcript</TabsTrigger>
              <TabsTrigger value="questions">Câu hỏi ({QUESTIONS.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="listen" className="mt-4">
              <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
                <div className="space-y-3">
                  {TRANSCRIPT.map((line, i) => (
                    <button
                      key={i}
                      onClick={() => setTime(line.t)}
                      className={cn(
                        "w-full rounded-xl px-4 py-3 text-left transition",
                        i === activeLine
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-surface-low hover:text-foreground",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-10 shrink-0 font-mono text-xs tabular-nums">
                          {fmt(line.t)}
                        </span>
                        <span className="flex-1 leading-relaxed">{line.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-4">
              <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">
                    Câu {qIndex + 1}/{QUESTIONS.length}
                  </Badge>
                  <Progress value={((qIndex + 1) / QUESTIONS.length) * 100} className="h-1.5 w-24" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-xl font-semibold text-pretty">
                      {QUESTIONS[qIndex].q}
                    </h3>
                    <div className="mt-5 grid gap-2.5">
                      {QUESTIONS[qIndex].options.map((opt, i) => {
                        const isSelected = selected === i
                        const isCorrect = feedback && i === QUESTIONS[qIndex].correct
                        const isWrong = feedback === "wrong" && isSelected
                        return (
                          <button
                            key={i}
                            disabled={feedback !== null}
                            onClick={() => setSelected(i)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition",
                              "border-border hover:border-primary/40",
                              isSelected && !feedback && "border-primary bg-primary/5",
                              isCorrect && "border-success bg-success/10",
                              isWrong && "border-danger bg-danger/10",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-border bg-surface-low font-mono text-xs font-semibold",
                                isSelected && !feedback && "border-primary bg-primary text-primary-foreground",
                                isCorrect && "border-success bg-success text-success-foreground",
                                isWrong && "border-danger bg-danger text-danger-foreground",
                              )}
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className="flex-1 text-sm font-medium">{opt}</span>
                            {isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                            {isWrong && <XCircle className="h-4 w-4 text-danger" />}
                          </button>
                        )
                      })}
                    </div>

                    <Button
                      className="mt-6 h-11 w-full rounded-xl"
                      disabled={selected === null || feedback !== null}
                      onClick={handleAnswer}
                    >
                      {qIndex === QUESTIONS.length - 1 ? "Hoàn thành" : "Tiếp theo"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-lowest p-5 shadow-ambient">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Settings className="h-4 w-4" />
              Thông tin bài
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Thời lượng</dt>
                <dd className="font-medium">5:12</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Tốc độ nói</dt>
                <dd className="font-medium">Trung bình</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Giọng</dt>
                <dd className="font-medium">American</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Chủ đề</dt>
                <dd className="font-medium">Technology</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-surface-lowest p-5 shadow-ambient">
            <div className="mb-3 text-sm font-semibold">Từ khóa (8)</div>
            <div className="flex flex-wrap gap-1.5">
              {["podcast", "innovation", "artificial", "assistant", "advancement", "beneficial", "researcher", "decade"].map(
                (w) => (
                  <Badge key={w} variant="outline" className="font-normal">
                    {w}
                  </Badge>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-surface-lowest p-5 shadow-ambient">
            <div className="mb-2 text-sm font-semibold">Lộ trình</div>
            <div className="space-y-2">
              {["Nghe lần 1", "Nghe kèm phụ đề", "Trả lời câu hỏi", "Shadowing"].map((step, i) => (
                <div key={step} className="flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                      i < 2 ? "bg-primary text-primary-foreground" : "bg-surface-low text-muted-foreground",
                    )}
                  >
                    {i < 2 ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className={i < 2 ? "text-foreground" : "text-muted-foreground"}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
