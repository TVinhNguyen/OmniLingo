"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, BookMarked, CheckCircle2, XCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const topics = [
  { id: "present-perfect", title: "Present Perfect vs Past Simple", level: "B1", progress: 65 },
  { id: "conditionals", title: "Conditionals (if-clauses)", level: "B2", progress: 30 },
  { id: "modals", title: "Modal verbs of possibility", level: "B1", progress: 80 },
  { id: "passive", title: "The passive voice", level: "B2", progress: 15 },
  { id: "articles", title: "Articles: a, an, the", level: "A2", progress: 100 },
]

const exercises = [
  {
    sentence: "I ___ lived in Paris for five years.",
    options: ["have", "had", "has", "am"],
    correct: 0,
    explain: "Use 'have' with 'I' for present perfect, indicating a duration that continues until now.",
  },
  {
    sentence: "She ___ the book yesterday.",
    options: ["finishes", "finished", "has finished", "was finished"],
    correct: 1,
    explain: "Past simple 'finished' is used with a specific time in the past ('yesterday').",
  },
  {
    sentence: "They ___ never been to Japan before.",
    options: ["have", "has", "had", "are"],
    correct: 0,
    explain: "'They' takes 'have'. The adverb 'never' is common in present perfect sentences.",
  },
]

export default function GrammarPage() {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const ex = exercises[idx]
  const parts = ex.sentence.split("___")

  const check = (i: number) => {
    setSelected(i)
    setRevealed(true)
  }

  const next = () => {
    setSelected(null)
    setRevealed(false)
    setIdx((i) => (i + 1) % exercises.length)
  }

  return (
    <div className="mx-auto max-w-6xl">
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
              <BookMarked className="mr-1 size-3" />
              Grammar
            </Badge>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Grammar workshop
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Master tricky rules with short, targeted exercises and clear explanations.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Topic sidebar */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your topics
          </h2>
          {topics.map((t) => (
            <Card
              key={t.id}
              className="cursor-pointer border-border/60 bg-card/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="font-medium text-foreground">{t.title}</div>
                <Badge variant="outline" className="rounded-full text-xs">
                  {t.level}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      t.progress === 100 ? "bg-success" : "bg-primary",
                    )}
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{t.progress}%</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Exercise */}
        <div>
          <Card className="border-border/60 bg-card/80 p-8 shadow-soft">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Question {idx + 1} of {exercises.length}
              </span>
              <span>Present perfect</span>
            </div>

            <div className="mb-8 min-h-[100px] font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
              {parts[0]}
              <span className="mx-2 inline-block min-w-[3ch] rounded-lg bg-primary/10 px-3 py-1 text-center text-primary">
                {revealed ? ex.options[ex.correct] : "___"}
              </span>
              {parts[1]}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ex.options.map((opt, i) => {
                const isCorrect = revealed && i === ex.correct
                const isWrong = revealed && i === selected && i !== ex.correct
                return (
                  <button
                    key={i}
                    disabled={revealed}
                    onClick={() => check(i)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border-2 px-5 py-4 font-medium transition",
                      !revealed && "border-border hover:border-primary/50 hover:bg-accent",
                      isCorrect && "border-success bg-success/10 text-success",
                      isWrong && "border-destructive bg-destructive/10 text-destructive",
                      revealed && !isCorrect && !isWrong && "opacity-50",
                    )}
                  >
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 className="size-5" />}
                    {isWrong && <XCircle className="size-5" />}
                  </button>
                )
              })}
            </div>

            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl bg-accent/60 p-4"
              >
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Explanation
                </div>
                <p className="text-sm text-foreground">{ex.explain}</p>
              </motion.div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={next} disabled={!revealed} className="rounded-full">
                Next question
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
