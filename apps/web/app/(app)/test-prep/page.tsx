"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  GraduationCap,
  Trophy,
  TrendingUp,
  Clock,
  ArrowRight,
  Calendar,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const tests = [
  {
    name: "IELTS Academic",
    provider: "British Council / IDP",
    band: "7.5",
    target: "8.0",
    nextTest: "Feb 14, 2026",
    progress: 72,
    sections: ["Listening", "Reading", "Writing", "Speaking"],
    color: "from-primary/20 to-primary/5",
  },
  {
    name: "TOEIC",
    provider: "ETS",
    band: "780",
    target: "900",
    nextTest: "Mar 02, 2026",
    progress: 56,
    sections: ["Listening", "Reading"],
    color: "from-success/20 to-success/5",
  },
  {
    name: "TOEFL iBT",
    provider: "ETS",
    band: "92",
    target: "105",
    nextTest: "Not scheduled",
    progress: 34,
    sections: ["Reading", "Listening", "Speaking", "Writing"],
    color: "from-warning/20 to-warning/5",
  },
]

const weeklyDrills = [
  { title: "IELTS Listening Section 3", type: "Listening", time: 15, band: "7.0+" },
  { title: "IELTS Writing Task 2 — essay feedback", type: "Writing", time: 40, band: "7.5+" },
  { title: "TOEIC Part 5 — incomplete sentences", type: "Grammar", time: 12, band: "850+" },
  { title: "Speaking Part 2 — cue card practice", type: "Speaking", time: 10, band: "7.5+" },
]

export default function TestPrepPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 rounded-full">
          <GraduationCap className="mr-1 size-3" />
          Test Prep
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Ace your exam
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Focused preparation for IELTS, TOEIC, TOEFL and more — built around your test date.
        </p>
      </div>

      {/* Active test programs */}
      <div className="mb-10 grid gap-5 md:grid-cols-3">
        {tests.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${t.color} p-6`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.provider}</p>
                </div>
                <Trophy className="size-5 text-primary" />
              </div>

              <div className="mb-4 flex items-baseline gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Current</div>
                  <div className="font-serif text-3xl font-bold text-foreground">{t.band}</div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Target</div>
                  <div className="font-serif text-3xl font-bold text-primary">{t.target}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Readiness</span>
                  <span className="font-semibold">{t.progress}%</span>
                </div>
                <Progress value={t.progress} className="h-2" />
              </div>

              <div className="mb-4 flex flex-wrap gap-1">
                {t.sections.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-full text-xs">
                    {s}
                  </Badge>
                ))}
              </div>

              <div className="mb-4 flex items-center gap-2 text-xs">
                <Calendar className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Test date:</span>
                <span className="font-medium">{t.nextTest}</span>
              </div>

              <Button className="w-full rounded-full" asChild>
                <Link href="/test-prep/ielts">
                  Continue prep
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly drills */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold">This week&apos;s drills</h2>
            <p className="text-sm text-muted-foreground">
              Personalized practice based on your weakest areas.
            </p>
          </div>
          <Target className="size-5 text-primary" />
        </div>

        <div className="grid gap-3">
          {weeklyDrills.map((d, i) => (
            <Card
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className="flex flex-col items-start justify-between gap-4 border-border/60 bg-card/80 p-5 transition hover:-translate-y-0.5 hover:shadow-soft md:flex-row md:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{d.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="rounded-full">
                      {d.type}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {d.time} min
                    </span>
                    <span>Targets: {d.band}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full bg-transparent md:w-auto">
                Start drill
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Mock tests */}
      <section>
        <h2 className="mb-4 font-serif text-2xl font-semibold">Full mock tests</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="border-border/60 bg-card/80 p-6">
            <Badge variant="secondary" className="mb-3 rounded-full">
              IELTS Academic
            </Badge>
            <h3 className="mb-1 font-serif text-xl font-semibold">Full Mock Test #12</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              2h 45m — Listening, Reading, Writing and Speaking. Timed and automatically graded.
            </p>
            <Button className="rounded-full">
              Start mock test
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </Card>
          <Card className="border-border/60 bg-card/80 p-6">
            <Badge variant="secondary" className="mb-3 rounded-full">
              TOEIC
            </Badge>
            <h3 className="mb-1 font-serif text-xl font-semibold">Reading Section Only</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              75 minutes, 100 questions. Great for building test-day stamina.
            </p>
            <Button variant="outline" className="rounded-full bg-transparent">
              Start section
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  )
}
