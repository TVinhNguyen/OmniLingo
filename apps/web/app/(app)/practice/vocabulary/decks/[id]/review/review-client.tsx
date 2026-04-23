"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Eye,
  Flag,
  Maximize2,
  Minimize2,
  Pencil,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { reviewCardAction } from "../actions"
import type { DeckCard } from "@/lib/api/types"

type Rating = "again" | "hard" | "good" | "easy"

// FSRS rating map
const RATING_NUM: Record<Rating, 1 | 2 | 3 | 4> = {
  again: 1,
  hard:  2,
  good:  3,
  easy:  4,
}

const ratings: Array<{
  key: Rating
  label: string
  interval: string
  color: string
  border: string
  shortcut: string
}> = [
  { key: "again", label: "Lại",  interval: "<1m", color: "text-destructive", border: "border-destructive/40 hover:border-destructive", shortcut: "1" },
  { key: "hard",  label: "Khó",  interval: "6m",  color: "text-warning",     border: "border-warning/40 hover:border-warning",         shortcut: "2" },
  { key: "good",  label: "Tốt",  interval: "10m", color: "text-primary",     border: "border-primary/40 hover:border-primary",          shortcut: "3" },
  { key: "easy",  label: "Dễ",   interval: "4d",  color: "text-success",     border: "border-success/40 hover:border-success",          shortcut: "4" },
]

interface ReviewClientProps {
  /** Deck ID for navigation */
  deckId: string
  /** Deck display name */
  deckName?: string
  /** Cards to review (BFF DeckCard[]) — item_id used as SRS item_id */
  cards: DeckCard[]
}

export default function ReviewClient({ deckId, deckName = "Ôn tập", cards }: ReviewClientProps) {
  // Limit session to 20 cards max (SRS will gate to truly due ones)
  const sessionCards = useMemo(() => cards.slice(0, 20), [cards])

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [focusMode, setFocusMode] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [ratingCount, setRatingCount] = useState<Record<Rating, number>>({
    again: 0, hard: 0, good: 0, easy: 0,
  })
  const [, startTransition] = useTransition()

  const card = sessionCards[index]

  // Timer
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const flip = useCallback(() => setFlipped(true), [])

  const handleRating = useCallback(
    (rating: Rating) => {
      setRatingCount((c) => ({ ...c, [rating]: c[rating] + 1 }))

      // Fire-and-forget SRS schedule (non-blocking)
      if (card?.id) {
        startTransition(async () => {
          await reviewCardAction(card.id, RATING_NUM[rating])
        })
      }

      if (index < sessionCards.length - 1) {
        setIndex((i) => i + 1)
        setFlipped(false)
      } else {
        setCompleted(true)
      }
    },
    [card, index, sessionCards.length],
  )

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (completed) return
      if (e.code === "Space") {
        e.preventDefault()
        if (!flipped) flip()
      }
      if (flipped) {
        if (e.key === "1") handleRating("again")
        if (e.key === "2") handleRating("hard")
        if (e.key === "3") handleRating("good")
        if (e.key === "4") handleRating("easy")
      }
      if (e.key === "Escape") setConfirmExit(true)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [completed, flipped, flip, handleRating])

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")
  const progress = ((index + (flipped ? 0.5 : 0)) / Math.max(sessionCards.length, 1)) * 100
  const xpEarned = ratingCount.again * 2 + ratingCount.hard * 5 + ratingCount.good * 10 + ratingCount.easy * 12

  // Empty state (no due cards from BFF)
  if (sessionCards.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-soft p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full rounded-3xl bg-card p-8 text-center shadow-hover"
        >
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-primary text-white">
            <Sparkles className="size-10" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Không có thẻ cần ôn!</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Bạn đã hoàn thành tất cả thẻ cần ôn hôm nay. Hãy quay lại sau.
          </p>
          <Button asChild className="w-full bg-gradient-primary">
            <Link href={`/practice/vocabulary/decks/${deckId}`}>Về deck</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-soft p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full rounded-3xl bg-card p-8 text-center shadow-hover"
        >
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-fluency text-white">
            <Trophy className="size-10" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-1">Hoàn thành!</h1>
          <p className="text-muted-foreground mb-6">
            Bạn đã ôn <span className="font-bold text-primary">{sessionCards.length}</span> thẻ trong {mm}:{ss}
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-2xl bg-primary/10 p-4">
              <div className="text-2xl font-bold text-primary">+{xpEarned}</div>
              <div className="text-xs text-muted-foreground">XP nhận được</div>
            </div>
            <div className="rounded-2xl bg-warning/10 p-4">
              <div className="text-2xl font-bold text-warning">🔥 —</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-4 gap-2 text-xs">
            {ratings.map((r) => (
              <div key={r.key} className="rounded-lg bg-surface-low p-2">
                <div className={cn("font-bold", r.color)}>{ratingCount[r.key]}</div>
                <div className="text-muted-foreground">{r.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full bg-gradient-primary" onClick={() => window.location.reload()}>
              Xem lại
            </Button>
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href={`/practice/vocabulary/decks/${deckId}`}>Kết thúc</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const meaning = card.meaning ?? "—"
  const ipa     = card.ipa    ?? ""
  const lemma   = card.lemma  ?? ""

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gradient-soft">
      {/* Minimal top bar */}
      <header className="flex items-center gap-3 border-b border-border bg-surface-lowest/70 px-4 py-3 backdrop-blur">
        <Button variant="ghost" size="icon" className="size-9" onClick={() => setConfirmExit(true)}>
          <X className="size-5" />
        </Button>
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">📚 {deckName}</span>
            <span className="font-mono font-semibold">
              {index + 1} / {sessionCards.length} · {mm}:{ss}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-high">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-gradient-primary"
            />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="size-9" onClick={() => setFocusMode((f) => !f)} aria-label="Focus">
          {focusMode ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </header>

      {/* Card area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* 3D flip card */}
              <div className="relative w-full [perspective:1400px]">
                <motion.div
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.15 }}
                  className="relative min-h-[420px] w-full [transform-style:preserve-3d]"
                >
                  {/* Front */}
                  <button
                    type="button"
                    onClick={flip}
                    className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-card p-10 shadow-hover [backface-visibility:hidden]",
                      "cursor-pointer transition hover:shadow-hover",
                    )}
                  >
                    <div className="absolute right-4 top-4 flex gap-1">
                      <span className="inline-flex size-9 items-center justify-center rounded-full bg-surface-low text-muted-foreground">
                        <Pencil className="size-4" />
                      </span>
                      <span className="inline-flex size-9 items-center justify-center rounded-full bg-surface-low text-muted-foreground">
                        <Flag className="size-4" />
                      </span>
                    </div>
                    <h1 className="text-center font-display text-5xl font-bold tracking-tight sm:text-7xl">
                      {lemma || "—"}
                    </h1>
                    <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
                      <Eye className="size-3" /> Bấm Space hoặc click để lật
                    </p>
                  </button>

                  {/* Back */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-primary p-8 text-white shadow-hover [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  >
                    <div className="absolute right-4 top-4 flex gap-1 z-10">
                      <button className="inline-flex size-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
                        <Pencil className="size-4" />
                      </button>
                      <button className="inline-flex size-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
                        <Flag className="size-4" />
                      </button>
                    </div>
                    <div className="text-sm opacity-80">{lemma}</div>
                    {ipa && (
                      <div className="mt-2 flex items-center gap-2 font-mono text-sm opacity-90">
                        {ipa}
                        <button className="inline-flex size-8 items-center justify-center rounded-full bg-white/20">
                          <Volume2 className="size-4" />
                        </button>
                      </div>
                    )}
                    <h2 className="mt-4 text-center font-display text-3xl font-bold sm:text-4xl">
                      {meaning}
                    </h2>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Rating buttons */}
          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid w-full grid-cols-2 gap-3 md:grid-cols-4"
              >
                {ratings.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => handleRating(r.key)}
                    className={cn(
                      "group relative flex h-16 flex-col items-center justify-center rounded-2xl border-2 bg-card shadow-ambient transition hover:shadow-hover",
                      r.border,
                    )}
                  >
                    <span className={cn("font-semibold", r.color)}>{r.label}</span>
                    <span className="text-xs text-muted-foreground">{r.interval}</span>
                    <span className="absolute right-2 top-2 rounded bg-surface-low px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {r.shortcut}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Exit confirm */}
      <Dialog open={confirmExit} onOpenChange={setConfirmExit}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Thoát session?</DialogTitle>
            <DialogDescription>
              Đã ôn {index}/{sessionCards.length} thẻ. Tiến độ đã được ghi nhận.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmExit(false)}>Tiếp tục</Button>
            <Button variant="destructive" asChild>
              <Link href={`/practice/vocabulary/decks/${deckId}`}>Thoát</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
