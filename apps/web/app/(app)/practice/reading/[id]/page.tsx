"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, BookOpen, Clock, Type, CheckCircle2, XCircle, Volume2, BookmarkPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const articles: Record<string, any> = {
  "urban-gardens": {
    title: "The rise of urban gardens in Tokyo",
    level: "B1",
    words: 312,
    minutes: 3,
    body: [
      "In recent years, Tokyo has witnessed a quiet revolution on its rooftops, balconies, and vacant lots. Urban gardens are flourishing across the city, transforming concrete into green pockets of life.",
      "For many residents, growing vegetables and herbs at home has become more than a hobby — it's a way to reconnect with seasonal rhythms that city life often erases. Community gardens, in particular, have become gathering places where neighbors swap seeds, recipes, and stories.",
      "Local governments have started to support these initiatives by offering small grants and free seedlings. Meanwhile, schools are introducing gardening into their curriculum, teaching children where food really comes from.",
      "The trend also carries environmental benefits: green roofs reduce the urban heat island effect, and edible gardens cut down on food miles. In a megacity built on efficiency, these small green plots remind us that slowing down can be its own kind of progress.",
    ],
    glossary: {
      revolution: "a dramatic and wide-reaching change",
      flourishing: "growing or developing successfully",
      seedlings: "young plants grown from seeds",
      "urban heat island": "the phenomenon where cities are warmer than rural areas",
    },
    questions: [
      {
        q: "According to the article, what is one benefit of urban gardens?",
        options: ["They replace all traditional farms", "They reduce the urban heat island effect", "They increase food prices", "They require no maintenance"],
        correct: 1,
      },
      {
        q: "What role do schools play in the trend?",
        options: ["They forbid gardening", "They sell seeds to students", "They include gardening in their curriculum", "They build rooftop gardens for profit"],
        correct: 2,
      },
    ],
  },
  "coffee-history": {
    title: "A brief history of coffee",
    level: "B2",
    words: 487,
    minutes: 5,
    body: [
      "For centuries, coffee has transformed the way people live, work, and connect. What began as a simple beverage in the Ethiopian highlands evolved into a global commodity that fueled revolutions, inspired art, and reshaped economies.",
      "Legend says a goat herder named Kaldi discovered coffee after noticing his goats became energetic eating the red cherries. By the 15th century, coffee had reached Yemen, where Sufi monasteries used it to stay awake during long nights of prayer. From there, the beans traveled across the Ottoman Empire, reaching Istanbul, Cairo, and eventually Venice.",
      "In seventeenth-century England, coffee houses gathered together merchants, scholars, and artists in a setting where anyone with a penny could sit, read newspapers, and join the debate. These bustling spaces earned the nickname 'penny universities' because of the lively discussions and intellectual exchange that happened there.",
      "The reputation of coffee spread so rapidly that European colonies soon began cultivating the crop in the Americas and Southeast Asia. Dutch merchants smuggled seeds out of Yemen; French colonists planted them in the Caribbean; Brazilian plantations eventually turned coffee into a revolutionary export.",
    ],
    glossary: {
      transformed: "biến đổi hoàn toàn",
      commodity: "hàng hóa",
      discovered: "khám phá",
      monasteries: "tu viện",
      merchants: "thương nhân",
      colonies: "thuộc địa",
    },
    questions: [
      {
        q: "Where did coffee originate?",
        options: ["Yemen", "Ethiopian highlands", "Istanbul", "Brazil"],
        correct: 1,
      },
      {
        q: "What were coffee houses called in 17th century England?",
        options: ["Penny schools", "Penny universities", "Coffee academies", "Knowledge centers"],
        correct: 1,
      },
    ],
  },
}

interface RouteParams {
  params: { id: string }
}

export default function ReadingDetailPage({ params }: RouteParams) {
  const article = articles[params.id] || articles["urban-gardens"]
  const [fontSize, setFontSize] = useState(18)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const renderParagraph = (text: string) => {
    const glossaryKeys = Object.keys(article.glossary)
    const parts: (string | { word: string })[] = [text]

    glossaryKeys.forEach((k) => {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        if (typeof p !== "string") continue
        const regex = new RegExp(`\\b(${k})\\b`, "i")
        const m = p.match(regex)
        if (m && m.index !== undefined) {
          const before = p.slice(0, m.index)
          const after = p.slice(m.index + m[0].length)
          parts.splice(i, 1, before, { word: m[0] }, after)
          i += 2
        }
      }
    })

    return parts.map((p, i) =>
      typeof p === "string" ? (
        <span key={i}>{p}</span>
      ) : (
        <Popover key={i}>
          <PopoverTrigger asChild>
            <button className="border-b-2 border-dashed border-primary/60 font-medium text-primary hover:bg-primary/10">
              {p.word}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Definition</div>
            <div className="mt-1 font-medium">{p.word.toLowerCase()}</div>
            <p className="mt-1 text-sm text-muted-foreground">{article.glossary[p.word.toLowerCase()] || article.glossary[p.word]}</p>
            <Button size="sm" variant="outline" className="mt-3 w-full rounded-full bg-transparent">
              Add to vocabulary
            </Button>
          </PopoverContent>
        </Popover>
      ),
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/practice/reading" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to articles
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              <BookOpen className="mr-1 size-3" />
              Reading
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {article.level}
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{article.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {article.minutes} min read
            </span>
            <span>{article.words} words</span>
          </div>
        </div>

        <div className="hidden gap-1 rounded-full border border-border/70 bg-card p-1 md:flex">
          {[16, 18, 21].map((size) => (
            <Button key={size} variant={fontSize === size ? "secondary" : "ghost"} size="icon" onClick={() => setFontSize(size)} className="size-9 rounded-full">
              <Type className={`${size === 16 ? "size-3.5" : size === 18 ? "size-4" : "size-5"}`} />
            </Button>
          ))}
        </div>
      </div>

      <Card className="mb-8 border-border/60 bg-card/80 p-8 shadow-soft md:p-12">
        <article className="prose-reading space-y-5 leading-relaxed text-foreground" style={{ fontSize: `${fontSize}px` }}>
          {article.body.map((p: string, i: number) => (
            <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              {renderParagraph(p)}
            </motion.p>
          ))}
        </article>
        <p className="mt-6 text-xs text-muted-foreground">Tip: click on underlined words to see their meaning.</p>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Comprehension check</h2>
        {article.questions.map((q: any, qi: number) => (
          <Card key={qi} className="border-border/60 bg-card/80 p-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{qi + 1}</span>
              <p className="pt-0.5 font-medium">{q.q}</p>
            </div>
            <div className="grid gap-2">
              {q.options.map((opt: string, oi: number) => {
                const selected = answers[qi] === oi
                const correct = submitted && oi === q.correct
                const wrong = submitted && selected && oi !== q.correct
                return (
                  <button
                    key={oi}
                    onClick={() => !submitted && setAnswers({ ...answers, [qi]: oi })}
                    className={cn(
                      "flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition",
                      !submitted && selected && "border-primary bg-primary/5 text-primary",
                      !submitted && !selected && "border-border hover:border-primary/50 hover:bg-accent",
                      correct && "border-success bg-success/10 text-success",
                      wrong && "border-destructive bg-destructive/10 text-destructive",
                      submitted && !selected && !correct && "opacity-60",
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

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/practice/reading">Browse more</Link>
          </Button>
          {submitted ? (
            <Button variant="outline" onClick={() => { setAnswers({}); setSubmitted(false) }} className="rounded-full">
              Reset
            </Button>
          ) : (
            <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < article.questions.length} className="rounded-full">
              Check answers
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
