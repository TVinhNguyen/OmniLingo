"use client"

import Link from "next/link"
import { ArrowLeft, Volume2, Mic } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const sounds = [
  { symbol: "/θ/", example: "think, three, bath", contrast: "/s/ (sink)", level: "A2" },
  { symbol: "/ð/", example: "this, they, weather", contrast: "/d/ (dis)", level: "A2" },
  { symbol: "/æ/", example: "cat, bat, hand", contrast: "/e/ (bet)", level: "A1" },
  { symbol: "/r/", example: "red, car, around", contrast: "/l/ (led)", level: "A2" },
  { symbol: "/v/", example: "very, love, over", contrast: "/b/ (berry)", level: "A1" },
  { symbol: "/ʃ/", example: "shoe, wish, station", contrast: "/s/ (sea)", level: "A2" },
  { symbol: "/ŋ/", example: "sing, ring, long", contrast: "/n/ (sin)", level: "B1" },
  { symbol: "/ʒ/", example: "measure, vision", contrast: "/z/ (zoo)", level: "B1" },
]

export default function PronunciationPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/practice"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to practice
      </Link>

      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 rounded-full">
          Pronunciation
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Phoneme workshop
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Practice the sounds that are hardest for learners. Tap a card to drill each phoneme.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sounds.map((s, i) => (
          <Card
            key={s.symbol}
            data-aos="fade-up"
            data-aos-delay={i * 40}
            className="group relative overflow-hidden border-border/60 bg-card/80 p-6 transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="absolute right-4 top-4 flex items-center gap-1">
              <Badge variant="outline" className="rounded-full text-xs">
                {s.level}
              </Badge>
            </div>
            <div className="mb-2 font-serif text-5xl font-bold text-primary">{s.symbol}</div>
            <p className="mb-3 text-sm text-foreground">{s.example}</p>
            <div className="mb-4 text-xs text-muted-foreground">
              vs <span className="font-mono">{s.contrast}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-full bg-transparent">
                <Volume2 className="mr-1.5 size-3.5" />
                Listen
              </Button>
              <Button size="sm" className="flex-1 rounded-full">
                <Mic className="mr-1.5 size-3.5" />
                Drill
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
