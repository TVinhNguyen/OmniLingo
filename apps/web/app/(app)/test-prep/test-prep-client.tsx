"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  GraduationCap, Trophy, TrendingUp, Clock, ArrowRight, Calendar, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const MOCK_TESTS = [
  {
    name: "IELTS Academic",
    provider: "British Council / IDP",
    band: "—",
    target: "7.0",
    nextTest: "Chưa đặt lịch",
    progress: 0,
    sections: ["Listening", "Reading", "Writing", "Speaking"],
    color: "from-primary/20 to-primary/5",
  },
  {
    name: "TOEIC",
    provider: "ETS",
    band: "—",
    target: "800",
    nextTest: "Chưa đặt lịch",
    progress: 0,
    sections: ["Listening", "Reading"],
    color: "from-success/20 to-success/5",
  },
];

const WEEKLY_DRILLS = [
  { title: "IELTS Listening Section 3", type: "Listening", time: 15, band: "7.0+" },
  { title: "IELTS Writing Task 2 — essay feedback", type: "Writing", time: 40, band: "7.5+" },
  { title: "TOEIC Part 5 — câu chưa hoàn chỉnh", type: "Grammar", time: 12, band: "850+" },
  { title: "Speaking Part 2 — cue card practice", type: "Speaking", time: 10, band: "7.5+" },
];

interface TestPrepClientProps {
  /** Mock count from thi quota (e.g. 1 for free, 3 for Plus, unlimited for Pro) */
  quota: number;
}

export default function TestPrepClient({ quota }: TestPrepClientProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 rounded-full">
          <GraduationCap className="mr-1 size-3" />
          Luyện thi
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Chinh phục kỳ thi của bạn
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Luyện tập tập trung cho IELTS, TOEIC, TOEFL — theo ngày thi của bạn.{" "}
          <span className="font-medium text-primary">{quota} mock test còn lại tháng này.</span>
        </p>
      </div>

      {/* Test programs */}
      <div className="mb-10 grid gap-5 md:grid-cols-3">
        {MOCK_TESTS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${t.color} p-6`}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.provider}</p>
                </div>
                <Trophy className="size-5 text-primary" />
              </div>

              <div className="mb-4 flex items-baseline gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Hiện tại</div>
                  <div className="font-serif text-3xl font-bold text-foreground">{t.band}</div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Mục tiêu</div>
                  <div className="font-serif text-3xl font-bold text-primary">{t.target}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Mức độ sẵn sàng</span>
                  <span className="font-semibold">{t.progress}%</span>
                </div>
                <Progress value={t.progress} className="h-2" />
              </div>

              <div className="mb-4 flex flex-wrap gap-1">
                {t.sections.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-full text-xs">{s}</Badge>
                ))}
              </div>

              <div className="mb-4 flex items-center gap-2 text-xs">
                <Calendar className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Ngày thi:</span>
                <span className="font-medium">{t.nextTest}</span>
              </div>

              <Button className="w-full rounded-full" asChild>
                <Link href="/test-prep/ielts">
                  Bắt đầu luyện
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
            <h2 className="font-serif text-2xl font-semibold">Bài tập tuần này</h2>
            <p className="text-sm text-muted-foreground">
              Luyện tập cá nhân hóa theo điểm yếu của bạn.
            </p>
          </div>
          <Target className="size-5 text-primary" />
        </div>

        <div className="grid gap-3">
          {WEEKLY_DRILLS.map((d, i) => (
            <Card
              key={i}
              className="flex flex-col items-start justify-between gap-4 border-border/60 bg-card/80 p-5 transition hover:-translate-y-0.5 hover:shadow-soft md:flex-row md:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{d.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="rounded-full">{d.type}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {d.time} phút
                    </span>
                    <span>Mục tiêu: {d.band}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full bg-transparent md:w-auto">
                Bắt đầu
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Mock tests */}
      <section>
        <h2 className="mb-4 font-serif text-2xl font-semibold">Đề thi thử đầy đủ</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="border-border/60 bg-card/80 p-6">
            <Badge variant="secondary" className="mb-3 rounded-full">IELTS Academic</Badge>
            <h3 className="mb-1 font-serif text-xl font-semibold">Đề mock #1</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              2h 45p — Listening, Reading, Writing và Speaking. Tính giờ và chấm tự động.
            </p>
            <Button className="rounded-full">
              Bắt đầu <ArrowRight className="ml-1 size-4" />
            </Button>
          </Card>
          <Card className="border-border/60 bg-card/80 p-6">
            <Badge variant="secondary" className="mb-3 rounded-full">TOEIC</Badge>
            <h3 className="mb-1 font-serif text-xl font-semibold">Phần Reading</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              75 phút, 100 câu. Rèn luyện sức bền thi.
            </p>
            <Button variant="outline" className="rounded-full bg-transparent">
              Bắt đầu <ArrowRight className="ml-1 size-4" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
