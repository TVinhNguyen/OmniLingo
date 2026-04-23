"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Check, Crown, Lock, Play, Star, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LearningTrack } from "@/lib/api/types"

type NodeStatus = "done" | "current" | "locked" | "unlocked"

const units = [
  {
    id: 1,
    title: "Greetings & Basics",
    color: "from-[#5352a5] to-[#a19ff9]",
    lessons: [
      { id: "1-1", title: "Hello!", status: "done" as NodeStatus, stars: 3 },
      { id: "1-2", title: "My Name Is", status: "done" as NodeStatus, stars: 3 },
      { id: "1-3", title: "How Are You?", status: "done" as NodeStatus, stars: 2 },
      { id: "1-4", title: "Goodbye", status: "done" as NodeStatus, stars: 3 },
    ],
    crown: "Finished",
  },
  {
    id: 2,
    title: "Family & People",
    color: "from-[#702ae1] to-[#983772]",
    lessons: [
      { id: "2-1", title: "Family Members", status: "done" as NodeStatus, stars: 3 },
      { id: "2-2", title: "Describing People", status: "done" as NodeStatus, stars: 2 },
      { id: "2-3", title: "Age & Numbers", status: "done" as NodeStatus, stars: 3 },
      { id: "2-4", title: "Review Unit 2", status: "done" as NodeStatus, stars: 3 },
    ],
    crown: "Finished",
  },
  {
    id: 3,
    title: "Food & Ordering",
    color: "from-[#983772] to-[#702ae1]",
    lessons: [
      { id: "3-1", title: "Common Foods", status: "done" as NodeStatus, stars: 3 },
      { id: "3-2", title: "At the Restaurant", status: "done" as NodeStatus, stars: 2 },
      { id: "3-3", title: "Ordering Drinks", status: "done" as NodeStatus, stars: 3 },
      { id: "3-4", title: "Ordering Food", status: "current" as NodeStatus, stars: 0 },
      { id: "3-5", title: "Review Unit 3", status: "locked" as NodeStatus, stars: 0 },
    ],
    crown: "In progress",
  },
  {
    id: 4,
    title: "Travel & Directions",
    color: "from-[#a19ff9] to-[#5352a5]",
    lessons: [
      { id: "4-1", title: "Asking Directions", status: "locked" as NodeStatus, stars: 0 },
      { id: "4-2", title: "Transportation", status: "locked" as NodeStatus, stars: 0 },
      { id: "4-3", title: "At the Hotel", status: "locked" as NodeStatus, stars: 0 },
      { id: "4-4", title: "Sightseeing", status: "locked" as NodeStatus, stars: 0 },
      { id: "4-5", title: "Checkpoint", status: "locked" as NodeStatus, stars: 0 },
    ],
    crown: "Locked",
  },
]

export function LearnClient({ tracks }: { tracks?: LearningTrack[] }) {
  const activeTrack = tracks?.[0]
  const langLabel = activeTrack ? `${activeTrack.language.toUpperCase()} · ${activeTrack.level}` : "Japanese · N5"
  const progressLabel = activeTrack ? `Tiến độ: ${Math.round(activeTrack.progressPct)}%` : "Unit 3 · Lesson 4 · Bạn còn 2 bài để hoàn thành unit"

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {langLabel}
          </p>
          <h1 className="mt-1 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
            {activeTrack?.title ?? "Lộ trình của bạn"}
          </h1>
          <p className="mt-1 text-muted-foreground">{progressLabel}</p>
        </div>
        <div className="flex gap-2">
          {tracks?.map((t) => (
            <button key={t.id} className="rounded-full bg-surface-lowest px-4 py-2 text-sm font-semibold shadow-ambient">
              📚 {t.level}
            </button>
          )) ?? (
            <button className="rounded-full bg-surface-lowest px-4 py-2 text-sm font-semibold shadow-ambient">
              📚 JLPT N5
            </button>
          )}
          <button className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-ambient">
            + Thêm track
          </button>
        </div>
      </div>

      {/* Units */}
      <div className="space-y-12">
        {units.map((unit, ui) => (
          <div key={unit.id}>
            {/* Unit header */}
            <div
              data-aos="fade-up"
              className={cn(
                "mx-auto max-w-xl rounded-3xl bg-gradient-to-br p-6 text-white shadow-hover",
                unit.color
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
                    Unit {unit.id}
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold">{unit.title}</h2>
                  <p className="mt-1 text-sm opacity-85">{unit.crown}</p>
                </div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                  <BookOpen className="h-7 w-7" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${
                        (unit.lessons.filter((l) => l.status === "done").length /
                          unit.lessons.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold">
                  {unit.lessons.filter((l) => l.status === "done").length}/
                  {unit.lessons.length}
                </span>
              </div>
            </div>

            {/* Lesson nodes — zigzag path */}
            <div className="relative mt-8 flex flex-col items-center gap-6">
              {unit.lessons.map((lesson, li) => {
                const offset = li % 4
                const marginClasses = [
                  "ml-0",
                  "ml-16",
                  "ml-24",
                  "ml-16",
                ][offset]
                return (
                  <motion.div
                    key={lesson.id}
                    data-aos="zoom-in"
                    data-aos-delay={li * 50}
                    whileHover={{ scale: 1.05 }}
                    className={cn("flex items-center gap-4", marginClasses)}
                  >
                    <LessonNode lesson={lesson} unitColor={unit.color} />
                    {lesson.status !== "locked" && (
                      <LessonCard lesson={lesson} />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LessonNode({
  lesson,
  unitColor,
}: {
  lesson: { id: string; title: string; status: NodeStatus; stars: number }
  unitColor: string
}) {
  const { status } = lesson
  if (status === "locked") {
    return (
      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-3xl bg-surface-low text-muted-foreground">
        <Lock className="h-6 w-6" />
      </div>
    )
  }
  if (status === "current") {
    return (
      <Link
        href={`/lesson/${lesson.id}`}
        className="group relative"
        aria-label={lesson.title}
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-[2rem]" />
        <div
          className={cn(
            "relative flex h-20 w-20 flex-col items-center justify-center rounded-[1.75rem] bg-gradient-to-br shadow-hover transition-transform group-hover:scale-105",
            unitColor
          )}
        >
          <Play className="h-8 w-8 fill-white text-white" strokeWidth={0} />
        </div>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-ambient">
          START
        </span>
      </Link>
    )
  }
  // done
  return (
    <Link
      href={`/lesson/${lesson.id}`}
      className="group relative"
      aria-label={lesson.title}
    >
      <div
        className={cn(
          "flex h-20 w-20 flex-col items-center justify-center rounded-[1.75rem] bg-gradient-to-br text-white shadow-hover transition-transform group-hover:scale-105",
          unitColor
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
              i < lesson.stars
                ? "fill-amber-400 text-amber-400"
                : "fill-surface-low text-surface-low"
            )}
          />
        ))}
      </div>
    </Link>
  )
}

function LessonCard({
  lesson,
}: {
  lesson: { title: string; status: NodeStatus }
}) {
  return (
    <div className="flex-1 rounded-2xl bg-surface-lowest px-4 py-3 shadow-ambient">
      <p className="text-xs text-muted-foreground">
        {lesson.status === "done" ? "Hoàn thành" : "Đang học"}
      </p>
      <p className="text-sm font-bold">{lesson.title}</p>
    </div>
  )
}
