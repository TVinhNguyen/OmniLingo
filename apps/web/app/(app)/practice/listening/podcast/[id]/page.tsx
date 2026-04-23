"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Plus,
  Volume2,
  ArrowLeft,
  Radio,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const TRANSCRIPT = [
  {
    speaker: "Host",
    line: "Today we&apos;re diving into how coffee quietly reshaped the modern world.",
    words: [
      { w: "Today", d: null },
      { w: "we&apos;re", d: null },
      {
        w: "diving",
        d: {
          ipa: "/ˈdaɪvɪŋ/",
          pos: "v.",
          meaning: "tìm hiểu sâu",
          example: "She&apos;s diving into history.",
        },
      },
      { w: "into", d: null },
      { w: "how", d: null },
      {
        w: "coffee",
        d: { ipa: "/ˈkɒfi/", pos: "n.", meaning: "cà phê", example: "I need coffee." },
      },
      { w: "quietly", d: null },
      {
        w: "reshaped",
        d: {
          ipa: "/riːˈʃeɪpt/",
          pos: "v.",
          meaning: "định hình lại",
          example: "It reshaped the industry.",
        },
      },
      { w: "the", d: null },
      {
        w: "modern",
        d: { ipa: "/ˈmɒdən/", pos: "adj.", meaning: "hiện đại", example: "Modern life." },
      },
      { w: "world.", d: null },
    ],
  },
  {
    speaker: "Guest",
    line: "Absolutely, coffee houses were the first social networks of the 17th century.",
    words: [
      { w: "Absolutely,", d: null },
      { w: "coffee", d: null },
      { w: "houses", d: null },
      { w: "were", d: null },
      { w: "the", d: null },
      { w: "first", d: null },
      {
        w: "social",
        d: { ipa: "/ˈsəʊʃəl/", pos: "adj.", meaning: "xã hội", example: "Social media." },
      },
      { w: "networks", d: null },
      { w: "of", d: null },
      { w: "the", d: null },
      {
        w: "17th",
        d: null,
      },
      { w: "century.", d: null },
    ],
  },
]

const QUESTIONS = [
  {
    q: "What is the main topic of this episode?",
    options: ["Tea history", "Coffee&apos;s social impact", "Modern farming", "Espresso recipes"],
    correct: 1,
  },
  {
    q: "Coffee houses were described as...",
    options: ["schools", "banks", "first social networks", "government offices"],
    correct: 2,
  },
  {
    q: "Which century is mentioned?",
    options: ["15th", "16th", "17th", "18th"],
    correct: 2,
  },
]

export default function PodcastDetailPage() {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = Object.entries(answers).filter(
    ([i, a]) => QUESTIONS[Number(i)].correct === a,
  ).length

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b bg-surface-lowest">
        <div className="container max-w-5xl py-6">
          <Link
            href="/practice/listening"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="size-4" /> Về trang Nghe
          </Link>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="shrink-0 size-48 rounded-2xl bg-gradient-to-br from-primary via-accent to-warning grid place-items-center">
              <Radio className="size-20 text-surface-lowest/90" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                Podcast · B2
              </Badge>
              <h1 className="font-serif text-4xl mt-3">How coffee changed the world</h1>
              <p className="text-muted-foreground mt-2">
                The Curious Mind · 12:45 · 3,245 người nghe
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setPlaying((p) => !p)}
                  className="rounded-full px-6"
                >
                  {playing ? (
                    <>
                      <Pause className="size-5 mr-2" /> Tạm dừng
                    </>
                  ) : (
                    <>
                      <Play className="size-5 mr-2" /> Nghe ngay
                    </>
                  )}
                </Button>
                <Button variant="outline" className="gap-2">
                  <RotateCcw className="size-4" /> -3s
                </Button>
                <Select value={speed.toString()} onValueChange={(v) => setSpeed(Number(v))}>
                  <SelectTrigger className="w-24">
                    <Gauge className="size-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5×</SelectItem>
                    <SelectItem value="0.75">0.75×</SelectItem>
                    <SelectItem value="1">1×</SelectItem>
                    <SelectItem value="1.25">1.25×</SelectItem>
                    <SelectItem value="1.5">1.5×</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl py-8 space-y-8">
        <Card className="p-8">
          <h2 className="font-semibold text-lg mb-4">Transcript</h2>
          <div className="space-y-5">
            {TRANSCRIPT.map((para, pi) => (
              <div key={pi}>
                <Badge variant="outline" className="mb-2">
                  {para.speaker}
                </Badge>
                <p className="font-serif text-lg leading-loose">
                  {para.words.map((word, wi) =>
                    word.d ? (
                      <Popover key={wi}>
                        <PopoverTrigger asChild>
                          <span className="cursor-pointer hover:bg-primary/15 rounded px-0.5 transition-colors">
                            {word.w}{" "}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-72">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-serif text-lg font-semibold">{word.w}</p>
                              <p className="text-sm text-muted-foreground">{word.d.ipa}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="size-8">
                              <Volume2 className="size-4" />
                            </Button>
                          </div>
                          <Badge variant="outline" className="mb-2">
                            {word.d.pos}
                          </Badge>
                          <p className="mb-2">{word.d.meaning}</p>
                          <p className="text-sm italic text-muted-foreground mb-3">
                            {word.d.example}
                          </p>
                          <Button
                            size="sm"
                            className="w-full gap-1"
                            onClick={() => toast.success(`Đã thêm "${word.w}" vào SRS`)}
                          >
                            <Plus className="size-3.5" /> Thêm vào SRS
                          </Button>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span key={wi}>{word.w} </span>
                    ),
                  )}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="font-semibold text-lg mb-4">Comprehension check</h2>
          <div className="space-y-6">
            {QUESTIONS.map((q, qi) => (
              <div key={qi}>
                <p className="font-medium mb-3">
                  {qi + 1}. {q.q}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const picked = answers[qi] === oi
                    const correct = q.correct === oi
                    const showResult = submitted
                    return (
                      <button
                        key={oi}
                        disabled={submitted}
                        onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          showResult && correct
                            ? "border-success bg-success/10"
                            : showResult && picked && !correct
                              ? "border-destructive bg-destructive/10"
                              : picked
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="size-6 rounded-full bg-surface-low grid place-items-center text-xs font-semibold">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span>{opt}</span>
                          {showResult && correct && (
                            <Check className="size-4 ml-auto text-success" />
                          )}
                          {showResult && picked && !correct && (
                            <X className="size-4 ml-auto text-destructive" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            {!submitted ? (
              <Button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length < QUESTIONS.length}
              >
                Nộp bài
              </Button>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3"
              >
                <Badge className="bg-success/15 text-success text-base px-3 py-1">
                  Điểm: {score}/{QUESTIONS.length}
                </Badge>
                <Button variant="outline" onClick={() => { setAnswers({}); setSubmitted(false) }}>
                  Làm lại
                </Button>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
