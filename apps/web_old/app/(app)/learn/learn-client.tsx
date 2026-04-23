"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, Lock, Play, Star, BookOpen, Languages } from "lucide-react";
import type { LearningTrack } from "@/lib/api/types";
import { cn } from "@/lib/utils";

// ─── Mock lessons per unit — real lesson data comes via lessons(unitId) query ──

type NodeStatus = "done" | "current" | "locked";

interface MockLesson {
  id: string;
  title: string;
  status: NodeStatus;
  stars: number;
}

function generateMockLessons(trackId: string, progressPct: number): MockLesson[] {
  const titles = [
    "Introduction", "Core vocabulary", "Simple phrases",
    "Listening practice", "Speaking basics", "Review",
  ];
  const total = titles.length;
  const done = Math.round((progressPct / 100) * total);
  return titles.map((title, i) => ({
    id: `${trackId}-${i + 1}`,
    title,
    status: i < done ? "done" : i === done ? "current" : "locked",
    stars: i < done ? Math.floor(Math.random() * 2) + 2 : 0,
  }));
}

const TRACK_COLORS: Record<string, string> = {
  ja: "from-[#5352a5] to-[#a19ff9]",
  en: "from-[#702ae1] to-[#983772]",
  ko: "from-[#983772] to-[#702ae1]",
  zh: "from-[#a19ff9] to-[#5352a5]",
  fr: "from-[#4f6fc2] to-[#9b72cf]",
  es: "from-[#c25050] to-[#c9a94f]",
};

const DEFAULT_COLOR = "from-[#5352a5] to-[#a19ff9]";

// ─── Component ─────────────────────────────────────────────────────────────────

interface LearnClientProps {
  initialTracks: LearningTrack[];
}

export default function LearnClient({ initialTracks }: LearnClientProps) {
  const activeTrack = initialTracks[0];

  if (!activeTrack) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Languages className="mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Chưa có track nào</h1>
        <p className="mt-2 text-muted-foreground">Hoàn tất onboarding để bắt đầu lộ trình học.</p>
        <Link
          href="/onboarding"
          className="mt-6 rounded-full bg-gradient-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-ambient"
        >
          Bắt đầu ngay
        </Link>
      </div>
    );
  }

  const color = TRACK_COLORS[activeTrack.language] ?? DEFAULT_COLOR;
  const lessons = generateMockLessons(activeTrack.id, activeTrack.progressPct);
  const doneLessons = lessons.filter((l) => l.status === "done").length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      {/* Track header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {activeTrack.language.toUpperCase()} · {activeTrack.level}
          </p>
          <h1 className="mt-1 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
            {activeTrack.title}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {doneLessons}/{lessons.length} bài hoàn thành · {Math.round(activeTrack.progressPct)}% tiến độ
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Track switcher pills */}
          {initialTracks.map((t) => (
            <span
              key={t.id}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold shadow-ambient",
                t.id === activeTrack.id
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-surface-lowest",
              )}
            >
              {t.language.toUpperCase()} {t.level}
            </span>
          ))}
        </div>
      </div>

      {/* Unit */}
      <div>
        {/* Unit card */}
        <div
          className={cn(
            "mx-auto max-w-xl rounded-3xl bg-gradient-to-br p-6 text-white shadow-hover",
            color,
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Unit 1</p>
              <h2 className="mt-1 text-2xl font-extrabold">{activeTrack.title}</h2>
              <p className="mt-1 text-sm opacity-85">
                {doneLessons === lessons.length ? "Hoàn thành" : "Đang học"}
              </p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <BookOpen className="h-7 w-7" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${activeTrack.progressPct}%` }}
              />
            </div>
            <span className="text-sm font-bold">
              {doneLessons}/{lessons.length}
            </span>
          </div>
        </div>

        {/* Lesson nodes — zigzag */}
        <div className="relative mt-8 flex flex-col items-center gap-6">
          {lessons.map((lesson, li) => {
            const offsetClasses = ["ml-0", "ml-16", "ml-24", "ml-16"];
            const marginClass = offsetClasses[li % 4];
            return (
              <motion.div
                key={lesson.id}
                whileHover={{ scale: 1.05 }}
                className={cn("flex items-center gap-4", marginClass)}
              >
                <LessonNode lesson={lesson} unitColor={color} />
                {lesson.status !== "locked" && <LessonCard lesson={lesson} />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LessonNode({
  lesson,
  unitColor,
}: {
  lesson: MockLesson;
  unitColor: string;
}) {
  if (lesson.status === "locked") {
    return (
      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-3xl bg-surface-low text-muted-foreground">
        <Lock className="h-6 w-6" />
      </div>
    );
  }
  if (lesson.status === "current") {
    return (
      <Link href={`/lesson/${lesson.id}`} className="group relative" aria-label={lesson.title}>
        <span className="absolute inset-0 animate-pulse-ring rounded-[2rem]" />
        <div
          className={cn(
            "relative flex h-20 w-20 flex-col items-center justify-center rounded-[1.75rem] bg-gradient-to-br shadow-hover transition-transform group-hover:scale-105",
            unitColor,
          )}
        >
          <Play className="h-8 w-8 fill-white text-white" strokeWidth={0} />
        </div>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-ambient">
          START
        </span>
      </Link>
    );
  }
  return (
    <Link href={`/lesson/${lesson.id}`} className="group relative" aria-label={lesson.title}>
      <div
        className={cn(
          "flex h-20 w-20 flex-col items-center justify-center rounded-[1.75rem] bg-gradient-to-br text-white shadow-hover transition-transform group-hover:scale-105",
          unitColor,
        )}
      >
        <Check className="h-8 w-8" strokeWidth={3} />
      </div>
      <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-surface-lowest px-2 py-0.5 shadow-ambient">
        {Array.from({ length: 3 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < lesson.stars ? "fill-amber-400 text-amber-400" : "fill-surface-low text-surface-low",
            )}
          />
        ))}
      </div>
    </Link>
  );
}

function LessonCard({ lesson }: { lesson: MockLesson }) {
  return (
    <div className="flex-1 rounded-2xl bg-surface-lowest px-4 py-3 shadow-ambient">
      <p className="text-xs text-muted-foreground">
        {lesson.status === "done" ? "Hoàn thành" : "Đang học"}
      </p>
      <p className="text-sm font-bold">{lesson.title}</p>
    </div>
  );
}
