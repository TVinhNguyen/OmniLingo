"use client"

import { useMemo } from "react"
import type { ActivityDay } from "@/lib/api/types"

/**
 * 365-day activity heatmap (53 weeks × 7 days).
 * Cell color level 0-4 derived from `minutes`:
 *   0 = 0min, 1 = 1-15, 2 = 16-30, 3 = 31-60, 4 = >60.
 * Hover tooltip shows date / minutes / xp / lessonsCompleted.
 */

const WEEKS = 53
const DAYS = 7

const LEVEL_BG: Record<number, string> = {
  0: "bg-muted/40",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/65",
  4: "bg-primary",
}

function levelOf(minutes: number): number {
  if (minutes <= 0) return 0
  if (minutes <= 15) return 1
  if (minutes <= 30) return 2
  if (minutes <= 60) return 3
  return 4
}

function formatDate(iso: string): string {
  // BE returns YYYY-MM-DD. Render with vi-VN locale for tooltip.
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

export function ActivityHeatmap({ days }: { days: ActivityDay[] }) {
  // Sort ascending by date so the rightmost column is "today".
  const sorted = useMemo(
    () => [...days].sort((a, b) => a.date.localeCompare(b.date)),
    [days],
  )

  // Pad to 53 * 7 cells; oldest at top-left of leftmost column.
  const total = WEEKS * DAYS
  const padding = Math.max(0, total - sorted.length)
  const cells: (ActivityDay | null)[] = [
    ...Array(padding).fill(null),
    ...sorted.slice(-total),
  ]

  // Layout: weeks as columns, days as rows. cells[i] -> col = floor(i / 7), row = i % 7.
  const totalMinutes = sorted.reduce((s, d) => s + d.minutes, 0)
  const totalXp = sorted.reduce((s, d) => s + d.xp, 0)
  const activeDays = sorted.filter((d) => d.minutes > 0).length

  return (
    <section className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-semibold tracking-tight">Hoạt động 365 ngày</h3>
          <p className="text-sm text-muted-foreground">
            {activeDays} ngày học · {totalMinutes} phút · {totalXp.toLocaleString()} XP
          </p>
        </div>
        <Legend />
      </header>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`Heatmap hoạt động ${sorted.length} ngày`}
      >
        {Array.from({ length: WEEKS }).map((_, col) => (
          <div key={col} className="grid grid-rows-7 gap-1">
            {Array.from({ length: DAYS }).map((_, row) => {
              const idx = col * DAYS + row
              const cell = cells[idx]
              if (!cell) {
                return (
                  <div
                    key={row}
                    className="h-3 w-full rounded-sm bg-transparent"
                    aria-hidden
                  />
                )
              }
              const level = levelOf(cell.minutes)
              const tooltip = `${formatDate(cell.date)}: ${cell.minutes}p, ${cell.xp}XP, ${cell.lessonsCompleted} bài`
              return (
                <div
                  key={row}
                  title={tooltip}
                  aria-label={tooltip}
                  className={`h-3 w-full rounded-sm transition-colors ${LEVEL_BG[level]}`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}

function Legend() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Ít</span>
      {[0, 1, 2, 3, 4].map((l) => (
        <span
          key={l}
          className={`h-3 w-3 rounded-sm ${LEVEL_BG[l]}`}
          aria-hidden
        />
      ))}
      <span>Nhiều</span>
    </div>
  )
}
