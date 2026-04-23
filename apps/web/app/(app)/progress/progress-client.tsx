"use client"

import { motion } from "motion/react"
import { Flame, Trophy, Clock, TrendingUp, Award, Calendar, BookOpen, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"
import { SkillRadar } from "@/components/app/skill-radar"
import type { ProgressSummary, WeeklyProgress } from "@/lib/api/types"

export function ProgressClient({
  progress,
  weekly,
}: {
  progress: ProgressSummary
  weekly: WeeklyProgress[]
}) {
  // Map weekly data: ensure 'day' key used by chart
  const chartData = weekly.map((w) => ({ ...w, day: w.date }))
  const totalWeekXp = weekly.reduce((s, w) => s + w.xp, 0)

  const stats = [
    { icon: Flame, label: "Current streak", value: `${progress.streak}`, sub: "days", color: "text-destructive" },
    { icon: Trophy, label: "Total XP", value: progress.totalXp.toLocaleString("vi-VN"), sub: "all time", color: "text-warning" },
    { icon: Clock, label: "Time learning", value: `${progress.minutesLearned}m`, sub: "total", color: "text-primary" },
    { icon: BookOpen, label: "Words mastered", value: `${progress.wordsMastered}`, sub: "mastered", color: "text-success" },
  ]
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 rounded-full">
          <TrendingUp className="mr-1 size-3" />
          Your progress
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          How you&apos;re growing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track XP, streaks, skills and time spent across your languages.
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/60 bg-card/80 p-5">
              <s.icon className={`mb-3 size-5 ${s.color}`} />
              <div className="font-serif text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly XP chart */}
      <div className="mb-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/60 bg-card/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">Weekly XP</h2>
              <p className="text-sm text-muted-foreground">
                Tổng <span className="font-semibold text-foreground">{totalWeekXp.toLocaleString("vi-VN")} XP</span> tuần này
              </p>
            </div>
            <Target className="size-5 text-primary" />
          </div>
          <ChartContainer
            config={{ xp: { label: "XP", color: "hsl(var(--primary))" } }}
            className="h-[240px] w-full"
          >
            <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#xpGrad)"
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="border-border/60 bg-card/80 p-6">
          <div className="mb-4">
            <h2 className="font-serif text-xl font-semibold">Skill balance</h2>
            <p className="text-sm text-muted-foreground">Your strengths across 6 core skills.</p>
          </div>
          <SkillRadar />
        </Card>
      </div>

      {/* Minutes per day + achievements */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">Study minutes</h2>
              <p className="text-sm text-muted-foreground">Daily time spent learning this week.</p>
            </div>
            <Clock className="size-5 text-primary" />
          </div>
          <ChartContainer
            config={{ minutes: { label: "Minutes", color: "hsl(var(--primary))" } }}
            className="h-[220px] w-full"
          >
            <BarChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>

        <Card className="border-border/60 bg-card/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Recent milestones</h2>
            <Award className="size-5 text-warning" />
          </div>
          <div className="space-y-3">
            {[
              { title: "100-day streak", date: "Jan 28, 2026", icon: Flame, color: "bg-destructive/10 text-destructive" },
              { title: "Reached B1 in Spanish", date: "Jan 15, 2026", icon: Trophy, color: "bg-warning/10 text-warning" },
              { title: "500 words mastered", date: "Jan 03, 2026", icon: BookOpen, color: "bg-primary/10 text-primary" },
              { title: "First IELTS mock 7.0+", date: "Dec 22, 2025", icon: Target, color: "bg-success/10 text-success" },
            ].map((m) => (
              <div key={m.title} className="flex items-center gap-4 rounded-xl border border-border/60 p-3">
                <div className={`flex size-10 items-center justify-center rounded-xl ${m.color}`}>
                  <m.icon className="size-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.date}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Year heatmap */}
      <Card className="border-border/60 bg-card/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold">Study heatmap</h2>
            <p className="text-sm text-muted-foreground">Every square is a day — darker means more XP.</p>
          </div>
          <Calendar className="size-5 text-primary" />
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 365 }).map((_, i) => {
            // Deterministic seeded intensity to avoid hydration mismatch
            const seed = ((i * 9301 + 49297) % 233280) / 233280
            const intensity = Math.min(4, Math.floor(seed * 5))
            const colors = [
              "bg-surface-low",
              "bg-primary/25",
              "bg-primary/50",
              "bg-primary/75",
              "bg-primary",
            ]
            return (
              <div
                key={i}
                className={`size-3 rounded-sm ${colors[intensity]}`}
                title={`Day ${i + 1}`}
              />
            )
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          Less
          <div className="flex gap-1">
            {["bg-accent", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"].map((c) => (
              <div key={c} className={`size-3 rounded-sm ${c}`} />
            ))}
          </div>
          More
        </div>
      </Card>
    </div>
  )
}
