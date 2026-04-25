"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Sparkles, PenLine, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

const prompt = {
  title: "Describe your favorite city and why you love it",
  level: "B1",
  minWords: 80,
  maxWords: 150,
  hints: [
    "Use the present simple for facts and routines",
    "Try linking words: however, in addition, because",
    "Include at least one sensory detail (sight, sound, smell)",
  ],
}

export default function WritingPage() {
  const [text, setText] = useState("")
  const [analyzed, setAnalyzed] = useState(false)

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const inRange = wordCount >= prompt.minWords && wordCount <= prompt.maxWords

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/practice"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to practice
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            <PenLine className="mr-1 size-3" />
            Writing
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {prompt.level}
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          {prompt.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write between {prompt.minWords} and {prompt.maxWords} words. AI will grade for grammar, vocabulary,
          structure and coherence.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <Card className="border-border/60 bg-card/80 p-6 shadow-soft">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing here..."
              className="min-h-[320px] resize-none border-0 bg-transparent p-0 font-serif text-lg leading-relaxed shadow-none focus-visible:ring-0"
            />
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <span className={inRange ? "text-success" : "text-muted-foreground"}>
                  {wordCount} / {prompt.maxWords} words
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{text.length} characters</span>
              </div>
              <Button
                onClick={() => setAnalyzed(true)}
                disabled={wordCount < prompt.minWords}
                className="rounded-full"
              >
                <Sparkles className="mr-2 size-4" />
                Grade with AI
              </Button>
            </div>
          </Card>

          {analyzed && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Card className="border-border/60 bg-card/80 p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-semibold">AI Evaluation</h3>
                  <div className="text-right">
                    <div className="font-serif text-3xl font-bold text-primary">7.5 / 9</div>
                    <div className="text-xs text-muted-foreground">Estimated IELTS band</div>
                  </div>
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Grammar", score: 8.0 },
                    { label: "Vocabulary", score: 7.5 },
                    { label: "Coherence", score: 7.0 },
                    { label: "Task response", score: 7.5 },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between rounded-xl border border-border/60 p-3"
                    >
                      <span className="text-sm font-medium">{s.label}</span>
                      <span className="font-serif text-lg font-semibold text-primary">{s.score}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                    <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-success">
                      <CheckCircle2 className="size-4" />
                      Strengths
                    </div>
                    <p className="text-sm text-foreground">
                      Strong use of descriptive adjectives and varied sentence openings. Good linking with
                      &quot;however&quot; and &quot;in addition&quot;.
                    </p>
                  </div>

                  <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                    <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-warning">
                      <AlertCircle className="size-4" />
                      Areas to improve
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-sm text-foreground">
                      <li>
                        Consider replacing &quot;very nice&quot; with a stronger word like &quot;charming&quot; or
                        &quot;breathtaking&quot;.
                      </li>
                      <li>Watch subject-verb agreement in your second paragraph.</li>
                      <li>Try starting one sentence with a gerund for variety.</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-border/60 bg-card/80 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="size-4 text-primary" />
              <h3 className="font-semibold">Writing hints</h3>
            </div>
            <ul className="space-y-2">
              {prompt.hints.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {h}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-border/60 bg-card/80 p-5">
            <h3 className="mb-3 font-semibold">Useful phrases</h3>
            <div className="space-y-2">
              {[
                "One of the main reasons…",
                "What I love most about… is…",
                "If I had to choose only one place…",
                "It is worth mentioning that…",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => setText((t) => (t ? t + " " + p : p))}
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-left text-sm text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
