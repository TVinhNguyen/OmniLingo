"use client"

import Link from "next/link"
import { ArrowLeft, Headphones, BookOpen, PenLine, Mic2, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

const sections = [
  {
    id: "listening",
    icon: Headphones,
    name: "Listening",
    band: 7.5,
    exercises: 24,
    nextBand: 8.0,
    weak: "Section 3 — multiple speakers",
  },
  {
    id: "reading",
    icon: BookOpen,
    name: "Reading",
    band: 7.0,
    exercises: 18,
    nextBand: 7.5,
    weak: "Matching headings",
  },
  {
    id: "writing",
    icon: PenLine,
    name: "Writing",
    band: 6.5,
    exercises: 12,
    nextBand: 7.0,
    weak: "Task 2 — coherence",
  },
  {
    id: "speaking",
    icon: Mic2,
    name: "Speaking",
    band: 7.5,
    exercises: 32,
    nextBand: 8.0,
    weak: "Part 3 — abstract topics",
  },
]

const history = [
  { date: "Week 1", band: 6.5 },
  { date: "Week 2", band: 6.8 },
  { date: "Week 3", band: 7.0 },
  { date: "Week 4", band: 7.1 },
  { date: "Week 5", band: 7.3 },
  { date: "Week 6", band: 7.4 },
  { date: "Week 7", band: 7.5 },
]

export default function IELTSPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/test-prep"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to test prep
      </Link>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2 rounded-full">
            IELTS Academic
          </Badge>
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Your IELTS roadmap
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Test date: Feb 14, 2026 · 28 days remaining
          </p>
        </div>
        <Card className="hidden border-border/60 bg-card/80 p-4 text-center md:block">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Predicted band</div>
          <div className="font-serif text-4xl font-bold text-primary">7.5</div>
          <div className="text-xs text-muted-foreground">Target: 8.0</div>
        </Card>
      </div>

      {/* Sections */}
      <div className="mb-10 grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.id} className="border-border/60 bg-card/80 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">{s.exercises} exercises completed</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif text-2xl font-bold text-foreground">{s.band}</div>
                <div className="text-xs text-muted-foreground">→ {s.nextBand}</div>
              </div>
            </div>
            <Progress value={(s.band / 9) * 100} className="mb-3 h-2" />
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Focus area:</span>
              <span className="font-medium text-foreground">{s.weak}</span>
            </div>
            <Button variant="outline" className="w-full rounded-full bg-transparent">
              Practice {s.name}
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </Card>
        ))}
      </div>

      {/* Progress chart */}
      <Card className="border-border/60 bg-card/80 p-6">
        <div className="mb-4">
          <h2 className="font-serif text-xl font-semibold">Band score progression</h2>
          <p className="text-sm text-muted-foreground">
            Your estimated band across the last 7 weeks of practice.
          </p>
        </div>
        <ChartContainer
          config={{ band: { label: "Band", color: "hsl(var(--primary))" } }}
          className="h-[280px] w-full"
        >
          <LineChart data={history} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[5, 9]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="band"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  )
}
