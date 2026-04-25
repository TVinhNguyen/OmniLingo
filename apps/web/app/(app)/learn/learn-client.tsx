"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { BookOpen, ChevronDown, Lock, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Course, Lesson, LearningTrack, UnitDTO } from "@/lib/api/types"

interface LearnClientProps {
  tracks?: LearningTrack[]
  /** First course of the active track (BE: courses(trackId)[0]). */
  activeCourse?: Course | null
  /** Units of the active course (BE: units(courseId)). */
  activeUnits?: UnitDTO[]
  /** Lessons keyed by unit ID (BE: lessons(unitId) per unit). */
  lessonsMap?: Record<string, Lesson[]>
}

const UNIT_GRADIENTS = [
  "from-[#5352a5] to-[#a19ff9]",
  "from-[#702ae1] to-[#983772]",
  "from-[#983772] to-[#702ae1]",
  "from-[#a19ff9] to-[#5352a5]",
]

export function LearnClient({ tracks, activeCourse, activeUnits, lessonsMap }: LearnClientProps) {
  const activeTrack = tracks?.[0]
  const langLabel = activeTrack
    ? `${activeTrack.language.toUpperCase()} · ${activeTrack.level}`
    : "Japanese · N5"
  const progressLabel = activeTrack
    ? `Tiến độ: ${Math.round(activeTrack.progressPct)}%`
    : "Bạn còn 2 bài để hoàn thành unit"

  // First lesson of first non-empty unit → "Tiếp tục" CTA. BE chưa expose
  // lesson completion; brief: derive client-side hoặc BE — hiện chọn lesson
  // đầu tiên có sẵn.
  const continueHref = useMemo(() => {
    const firstUnit = activeUnits?.find((u) => u.lessonIds.length > 0)
    return firstUnit ? `/lesson/${firstUnit.lessonIds[0]}` : "/lesson/1-1"
  }, [activeUnits])

  const hasBeUnits = (activeUnits?.length ?? 0) > 0

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      {/* Header */}
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
        <Link
          href={continueHref}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-ambient hover:opacity-90"
        >
          <Play className="h-4 w-4 fill-current" strokeWidth={0} /> Tiếp tục
        </Link>
      </div>

      {/* Track chips — display-only. BE fan-out hiện chỉ fetch tracks[0]; multi-track
          switching sẽ là Phase 2 (per-track route hoặc client-side fetch). */}
      <div className="flex flex-wrap gap-2">
        {tracks?.map((t) => {
          const isActive = t.id === activeTrack?.id
          return (
            <span
              key={t.id}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold shadow-ambient",
                isActive
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-surface-lowest text-muted-foreground",
              )}
            >
              📚 {t.language.toUpperCase()} · {t.level}
            </span>
          )
        })}
      </div>

      {/* Active course + units */}
      {hasBeUnits && activeCourse ? (
        <CourseAccordion course={activeCourse} units={activeUnits!} lessonsMap={lessonsMap} />
      ) : (
        <EmptyUnitsState />
      )}
    </div>
  )
}

function CourseAccordion({ course, units, lessonsMap }: { course: Course; units: UnitDTO[]; lessonsMap?: Record<string, Lesson[]> }) {
  const sortedUnits = [...units].sort((a, b) => a.order - b.order)

  return (
    <div className="rounded-3xl bg-surface-lowest p-5 shadow-ambient">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
          <BookOpen className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold">{course.title}</h2>
          {course.description ? (
            <p className="text-sm text-muted-foreground">{course.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{sortedUnits.length} unit</p>
          )}
        </div>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {sortedUnits.map((unit, i) => (
          <UnitRow key={unit.id} unit={unit} lessons={lessonsMap?.[unit.id]} colorClass={UNIT_GRADIENTS[i % UNIT_GRADIENTS.length]} index={i + 1} />
        ))}
      </Accordion>
    </div>
  )
}

function UnitRow({ unit, lessons, colorClass, index }: { unit: UnitDTO; lessons?: Lesson[]; colorClass: string; index: number }) {
  const lessonById = useMemo(() => {
    const map = new Map<string, Lesson>()
    lessons?.forEach((l) => map.set(l.id, l))
    return map
  }, [lessons])
  const total = unit.lessonIds.length
  // Lesson completion data is not in BE schema yet; brief: "tạm 0%".
  const completed = 0
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <AccordionItem value={unit.id} className="overflow-hidden rounded-2xl border-0 bg-surface-low">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex flex-1 items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-ambient",
              colorClass,
            )}
          >
            <span className="text-sm font-bold">{index}</span>
          </span>
          <div className="flex-1 text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Unit {unit.order}
            </p>
            <p className="font-bold">{unit.title}</p>
          </div>
          <div className="hidden min-w-[120px] flex-col items-end gap-1 sm:flex">
            <span className="text-xs text-muted-foreground">
              {completed}/{total} bài
            </span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-high">
              <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <AnimatePresence>
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-1.5"
          >
            {unit.lessonIds.length === 0 ? (
              <li className="rounded-xl bg-surface-lowest px-3 py-2 text-sm text-muted-foreground">
                Chưa có bài học
              </li>
            ) : (
              unit.lessonIds.map((lessonId, i) => {
                const lesson = lessonById.get(lessonId)
                return (
                  <li key={lessonId}>
                    <Link
                      href={`/lesson/${lessonId}`}
                      className="group flex items-center gap-3 rounded-xl bg-surface-lowest px-3 py-2 transition hover:bg-primary/5"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                        <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                      </span>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Bài {i + 1}</p>
                        <p className="text-sm font-semibold">{lesson?.title ?? `Lesson ${lessonId.slice(0, 8)}`}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                )
              })
            )}
          </motion.ul>
        </AnimatePresence>
      </AccordionContent>
    </AccordionItem>
  )
}

function EmptyUnitsState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl bg-surface-lowest p-10 text-center shadow-ambient">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-low text-muted-foreground">
        <Lock className="h-7 w-7" />
      </span>
      <p className="font-display text-lg font-bold">Track này chưa có nội dung</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Khoá học sẽ được mở dần. Bạn có thể quay lại sau hoặc thêm track khác.
      </p>
    </div>
  )
}
