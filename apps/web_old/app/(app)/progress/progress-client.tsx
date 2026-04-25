"use client";

import { motion } from "motion/react";
import { Flame, Trophy, Clock, TrendingUp, Award, Calendar, BookOpen, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { SkillRadar } from "@/components/app/skill-radar";
import type { ProgressSummary } from "@/lib/api/types";

// Deterministic weekly mock (BFF doesn't expose time-series yet — Phase 1.5)
const WEEKLY_MOCK = [
  { day: "T2", xp: 220, minutes: 24 },
  { day: "T3", xp: 380, minutes: 36 },
  { day: "T4", xp: 120, minutes: 12 },
  { day: "T5", xp: 440, minutes: 42 },
  { day: "T6", xp: 310, minutes: 28 },
  { day: "T7", xp: 560, minutes: 55 },
  { day: "CN", xp: 490, minutes: 44 },
];

interface ProgressClientProps {
  progress: ProgressSummary;
}

export default function ProgressClient({ progress }: ProgressClientProps) {
  const stats = [
    {
      icon: Flame,
      label: "Chuỗi hiện tại",
      value: `${progress.streak}`,
      sub: "ngày",
      color: "text-destructive",
    },
    {
      icon: Trophy,
      label: "Tổng XP",
      value: progress.totalXp.toLocaleString(),
      sub: "tất cả thời gian",
      color: "text-warning",
    },
    {
      icon: Clock,
      label: "Thời gian học",
      value: `${progress.minutesLearned < 60 ? `${progress.minutesLearned}p` : `${Math.round(progress.minutesLearned / 60)}h`}`,
      sub: "tổng cộng",
      color: "text-primary",
    },
    {
      icon: BookOpen,
      label: "Từ đã thuộc",
      value: progress.wordsMastered.toLocaleString(),
      sub: "từ vựng",
      color: "text-success",
    },
  ];

  const weeklyXp = WEEKLY_MOCK.reduce((s, d) => s + d.xp, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 rounded-full">
          <TrendingUp className="mr-1 size-3" />
          Tiến độ của bạn
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Bạn đang tiến bộ như thế nào
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          XP, chuỗi ngày, kỹ năng và thời gian học theo từng ngôn ngữ.
        </p>
      </div>

      {/* Stats row — real data */}
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

      {/* Weekly charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/60 bg-card/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">XP tuần này</h2>
              <p className="text-sm text-muted-foreground">
                Bạn đạt được{" "}
                <span className="font-semibold text-foreground">
                  {weeklyXp.toLocaleString()} XP
                </span>{" "}
                tuần này
              </p>
            </div>
            <Target className="size-5 text-primary" />
          </div>
          <ChartContainer
            config={{ xp: { label: "XP", color: "hsl(var(--primary))" } }}
            className="h-[240px] w-full"
          >
            <AreaChart data={WEEKLY_MOCK} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
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
            <h2 className="font-serif text-xl font-semibold">Cân bằng kỹ năng</h2>
            <p className="text-sm text-muted-foreground">Điểm mạnh theo 6 kỹ năng cốt lõi.</p>
          </div>
          <SkillRadar />
        </Card>
      </div>

      {/* Minutes + milestones */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">Phút học mỗi ngày</h2>
              <p className="text-sm text-muted-foreground">Thời gian học trong tuần này.</p>
            </div>
            <Clock className="size-5 text-primary" />
          </div>
          <ChartContainer
            config={{ minutes: { label: "Phút", color: "hsl(var(--primary))" } }}
            className="h-[220px] w-full"
          >
            <BarChart data={WEEKLY_MOCK} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
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
            <h2 className="font-serif text-xl font-semibold">Cột mốc gần đây</h2>
            <Award className="size-5 text-warning" />
          </div>
          <div className="space-y-3">
            {[
              { title: `${progress.streak} ngày liên tiếp`, label: Flame, color: "bg-destructive/10 text-destructive" },
              { title: `${progress.totalXp.toLocaleString()} XP tổng`, label: Trophy, color: "bg-warning/10 text-warning" },
              { title: `${progress.wordsMastered} từ đã thuộc`, label: BookOpen, color: "bg-primary/10 text-primary" },
              { title: `${progress.minutesLearned} phút đã học`, label: Clock, color: "bg-success/10 text-success" },
            ].map((m) => (
              <div key={m.title} className="flex items-center gap-4 rounded-xl border border-border/60 p-3">
                <div className={`flex size-10 items-center justify-center rounded-xl ${m.color}`}>
                  <m.label className="size-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{m.title}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Heatmap */}
      <Card className="border-border/60 bg-card/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold">Bản đồ học tập</h2>
            <p className="text-sm text-muted-foreground">Mỗi ô là một ngày — càng đậm càng nhiều XP.</p>
          </div>
          <Calendar className="size-5 text-primary" />
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 365 }).map((_, i) => {
            const seed = ((i * 9301 + 49297) % 233280) / 233280;
            const intensity = Math.min(4, Math.floor(seed * 5));
            const colors = ["bg-surface-low", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"];
            return (
              <div
                key={i}
                className={`size-3 rounded-sm ${colors[intensity]}`}
                title={`Ngày ${i + 1}`}
              />
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          Ít
          <div className="flex gap-1">
            {["bg-accent", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"].map((c) => (
              <div key={c} className={`size-3 rounded-sm ${c}`} />
            ))}
          </div>
          Nhiều
        </div>
      </Card>
    </div>
  );
}
