"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  CheckCircle2,
  XCircle,
  Headphones,
  Gauge,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const exercises = [
  {
    id: 1,
    title: "Ordering coffee at a café",
    level: "A2",
    duration: "1:24",
    difficulty: "Easy",
    transcript: [
      { time: 0, speaker: "Barista", text: "Good morning! What can I get for you today?" },
      { time: 3.5, speaker: "Customer", text: "Hi! Could I have a large cappuccino, please?" },
      { time: 6.8, speaker: "Barista", text: "Of course. Would you like whole milk or oat milk?" },
      { time: 10.2, speaker: "Customer", text: "Oat milk would be great, thanks." },
      { time: 13.5, speaker: "Barista", text: "That'll be four dollars and fifty cents." },
    ],
    questions: [
      {
        q: "What size cappuccino did the customer order?",
        options: ["Small", "Medium", "Large", "Extra large"],
        correct: 2,
      },
      {
        q: "Which type of milk did they request?",
        options: ["Whole milk", "Oat milk", "Soy milk", "Almond milk"],
        correct: 1,
      },
    ],
  },
]

export default function ListeningPage() {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(32)
  const [speed, setSpeed] = useState(1)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const ex = exercises[0]

  const score = Object.entries(answers).filter(
    ([i, a]) => ex.questions[Number.parseInt(i)].correct === a,
  ).length

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/practice"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to practice
      </Link>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              <Headphones className="mr-1 size-3" />
              Listening
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {ex.level}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {ex.difficulty}
            </Badge>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">{ex.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Listen carefully and answer the comprehension questions below.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-accent/60 px-4 py-2 text-sm md:flex">
          <Clock className="size-4 text-muted-foreground" />
          <span className="font-medium">{ex.duration}</span>
        </div>
      </div>

      {/* Audio player */}
      <Card className="mb-8 overflow-hidden border-border/60 bg-card/80 p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-4">
          <button
            onClick={() => setPlaying(!playing)}
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:scale-105"
          >
            {playing ? <Pause className="size-6" /> : <Play className="ml-0.5 size-6" />}
          </button>

          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>0:27</span>
              <span>{ex.duration}</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-accent">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {/* Waveform visual */}
            <div className="mt-3 flex h-10 items-end gap-0.5">
              {Array.from({ length: 60 }).map((_, i) => {
                const active = (i / 60) * 100 < progress
                const h = 20 + Math.abs(Math.sin(i * 0.6)) * 80
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-full rounded-sm transition",
                      active ? "bg-primary" : "bg-border",
                    )}
                    style={{ height: `${h}%` }}
                  />
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setProgress(0)}>
              <RotateCcw className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Volume2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Gauge className="size-3.5" />
                Playback speed
              </span>
              <span className="font-medium text-foreground">{speed.toFixed(2)}x</span>
            </div>
            <Slider
              value={[speed * 100]}
              min={50}
              max={150}
              step={25}
              onValueChange={(v) => setSpeed(v[0] / 100)}
            />
          </div>
          <div className="flex gap-2">
            {[0.75, 1, 1.25].map((s) => (
              <Button
                key={s}
                variant={speed === s ? "default" : "outline"}
                size="sm"
                onClick={() => setSpeed(s)}
                className="flex-1 rounded-full"
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Transcript + Questions */}
      <Tabs defaultValue="questions">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6 space-y-6">
          {ex.questions.map((q, qi) => (
            <Card key={qi} className="border-border/60 bg-card/80 p-6">
              <div className="mb-4 flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {qi + 1}
                </span>
                <p className="pt-0.5 font-medium text-foreground">{q.q}</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === oi
                  const correct = submitted && oi === q.correct
                  const wrong = submitted && selected && oi !== q.correct
                  return (
                    <button
                      key={oi}
                      onClick={() => !submitted && setAnswers({ ...answers, [qi]: oi })}
                      className={cn(
                        "group flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition",
                        !submitted && selected && "border-primary bg-primary/5 text-primary",
                        !submitted && !selected && "border-border hover:border-primary/50 hover:bg-accent",
                        correct && "border-success bg-success/10 text-success",
                        wrong && "border-destructive bg-destructive/10 text-destructive",
                        submitted && !selected && !correct && "border-border opacity-60",
                      )}
                    >
                      <span>{opt}</span>
                      {correct && <CheckCircle2 className="size-5" />}
                      {wrong && <XCircle className="size-5" />}
                    </button>
                  )
                })}
              </div>
            </Card>
          ))}

          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 p-4">
            <div className="text-sm text-muted-foreground">
              {submitted
                ? `You scored ${score} / ${ex.questions.length}`
                : `${Object.keys(answers).length} of ${ex.questions.length} answered`}
            </div>
            {submitted ? (
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setAnswers({})
                }}
                variant="outline"
                className="rounded-full"
              >
                <RotateCcw className="mr-2 size-4" />
                Try again
              </Button>
            ) : (
              <Button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length < ex.questions.length}
                className="rounded-full"
              >
                Submit answers
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="mt-6">
          <Card className="border-border/60 bg-card/80 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Full transcript</h3>
              <Badge variant="outline" className="rounded-full">
                English
              </Badge>
            </div>
            <div className="space-y-4">
              {ex.transcript.map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                    {Math.floor(line.time / 60)}:{String(Math.floor(line.time % 60)).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {line.speaker}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{line.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
