"use client"

import { use, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Check, Volume2, X, Sparkles, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { getDeckById, getCards } from "@/lib/vocab-data"

type Stage = "familiar" | "recognize" | "recall"

export default function LearnModePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const deck = getDeckById(id)
  const cards = getCards(id).slice(0, 7)

  const stages: Stage[] = ["familiar", "recognize", "recall"]
  const steps = useMemo(() => {
    // 21 steps: 7 cards × 3 stages (interleaved: [card0-s0, card1-s0, ..., card0-s1, ...])
    const arr: Array<{ card: (typeof cards)[0]; stage: Stage; index: number }> = []
    stages.forEach((stage) => {
      cards.forEach((card, i) => arr.push({ card, stage, index: i }))
    })
    return arr
  }, [cards])

  const [current, setCurrent] = useState(0)
  const [confirmExit, setConfirmExit] = useState(false)
  const [completed, setCompleted] = useState(false)

  const step = steps[current]
  const progress = ((current + 1) / steps.length) * 100

  const next = useCallback(() => {
    if (current < steps.length - 1) {
      setCurrent((c) => c + 1)
    } else {
      setCompleted(true)
    }
  }, [current, steps.length])

  if (completed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-soft p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full rounded-3xl bg-card p-8 text-center shadow-hover"
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-gradient-primary text-white"
          >
            <PartyPopper className="size-10" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold mb-2">Xong session!</h1>
          <p className="text-muted-foreground mb-6">
            Bạn đã học <span className="font-bold text-primary">{cards.length}</span> thẻ mới. Tuyệt vời!
          </p>
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full bg-gradient-primary" onClick={() => router.push(`/practice/vocabulary/decks/${id}/review`)}>
              Ôn tập ngay
            </Button>
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href={`/practice/vocabulary/decks/${id}`}>Về deck</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gradient-soft">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-border bg-surface-lowest/80 px-4 py-3 backdrop-blur">
        <Button variant="ghost" size="icon" className="size-9" onClick={() => setConfirmExit(true)}>
          <X className="size-5" />
        </Button>
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {deck.emoji} {deck.name}
            </span>
            <span className="font-mono font-semibold">
              {current + 1} / {steps.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-high">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-primary"
            />
          </div>
        </div>
        <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
          <kbd className="rounded bg-surface-low px-2 py-0.5 font-mono">Space</kbd>
          <span>Tiếp</span>
        </div>
      </header>

      {/* Card area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {step.stage === "familiar" && <FamiliarStage card={step.card} onNext={next} />}
              {step.stage === "recognize" && <RecognizeStage card={step.card} cards={cards} onNext={next} />}
              {step.stage === "recall" && <RecallStage card={step.card} onNext={next} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Exit confirm */}
      <Dialog open={confirmExit} onOpenChange={setConfirmExit}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Thoát session?</DialogTitle>
            <DialogDescription>Tiến độ sẽ được lưu lại. Bạn có thể quay lại sau.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmExit(false)}>Tiếp tục học</Button>
            <Button variant="destructive" asChild>
              <Link href={`/practice/vocabulary/decks/${id}`}>Thoát</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------------------- Stage 1: Familiar ---------------------- */
function FamiliarStage({
  card,
  onNext,
}: {
  card: ReturnType<typeof getCards>[0]
  onNext: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onNext])

  return (
    <div className="space-y-6">
      <div className="text-center text-sm font-medium uppercase tracking-wider text-primary">
        Bước 1: Làm quen
      </div>
      <div className="rounded-3xl bg-card p-8 shadow-raise">
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl text-gradient-primary">
            {card.lemma}
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3">
            <p className="font-mono text-lg text-muted-foreground">{card.ipa}</p>
            <Button size="icon" variant="outline" className="size-9 rounded-full">
              <Volume2 className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-surface-low p-5 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Nghĩa</p>
          <p className="text-xl font-semibold">{card.meaning}</p>
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-surface-lowest p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Ví dụ</p>
          <p className="italic text-base">&ldquo;{card.example}&rdquo;</p>
          <p className="mt-2 text-sm text-muted-foreground">{card.exampleTranslation}</p>
        </div>
      </div>
      <Button size="lg" onClick={onNext} className="h-14 w-full bg-gradient-primary text-base">
        Tiếp <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  )
}

/* ---------------------- Stage 2: Recognize (MCQ) ---------------------- */
function RecognizeStage({
  card,
  cards,
  onNext,
}: {
  card: ReturnType<typeof getCards>[0]
  cards: ReturnType<typeof getCards>
  onNext: () => void
}) {
  const options = useMemo(() => {
    const others = cards.filter((c) => c.id !== card.id).slice(0, 3)
    const all = [card, ...others].sort(() => (card.id.charCodeAt(0) % 2 === 0 ? -1 : 1))
    return all
  }, [card, cards])

  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === card.id

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= 4 && !selected) {
        setSelected(options[num - 1]?.id ?? null)
      }
      if ((e.code === "Space" || e.key === "Enter") && selected) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [options, selected, onNext])

  return (
    <div className="space-y-6">
      <div className="text-center text-sm font-medium uppercase tracking-wider text-accent">
        Bước 2: Nhận diện
      </div>
      <div className="rounded-3xl bg-card p-8 shadow-raise text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Từ</p>
        <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-primary">{card.lemma}</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">{card.ipa}</p>
        <p className="mt-4 text-sm text-muted-foreground">Chọn nghĩa đúng</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt, i) => {
          const state = !selected ? "idle" : opt.id === card.id ? "correct" : opt.id === selected ? "wrong" : "idle"
          return (
            <button
              key={opt.id}
              disabled={!!selected}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl border-2 bg-card p-5 text-left shadow-ambient transition",
                state === "idle" && "border-border hover:border-primary hover:shadow-hover",
                state === "correct" && "border-success bg-success/10",
                state === "wrong" && "border-destructive bg-destructive/10",
                selected && opt.id !== card.id && opt.id !== selected && "opacity-40",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-low font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <span className="flex-1 font-medium">{opt.meaning}</span>
              {state === "correct" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex size-7 items-center justify-center rounded-full bg-success text-white"
                >
                  <Check className="size-4" />
                </motion.div>
              )}
              {state === "wrong" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex size-7 items-center justify-center rounded-full bg-destructive text-white"
                >
                  <X className="size-4" />
                </motion.div>
              )}
            </button>
          )
        })}
      </div>
      {selected && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className={cn(
              "rounded-2xl p-4 text-sm",
              isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {isCorrect ? "Chính xác! Làm tốt lắm." : `Đáp án đúng: "${card.meaning}"`}
          </div>
          <Button size="lg" onClick={onNext} className="mt-3 h-14 w-full bg-gradient-primary text-base">
            Tiếp <ArrowRight className="ml-2 size-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}

/* ---------------------- Stage 3: Recall (type) ---------------------- */
function RecallStage({
  card,
  onNext,
}: {
  card: ReturnType<typeof getCards>[0]
  onNext: () => void
}) {
  const [value, setValue] = useState("")
  const [checked, setChecked] = useState(false)
  const isCorrect = value.trim().toLowerCase() === card.lemma.toLowerCase()

  const handleCheck = useCallback(() => {
    if (!value.trim()) return
    setChecked(true)
  }, [value])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        if (!checked) {
          e.preventDefault()
          handleCheck()
        } else {
          e.preventDefault()
          onNext()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [checked, onNext, handleCheck])

  return (
    <div className="space-y-6">
      <div className="text-center text-sm font-medium uppercase tracking-wider text-tertiary">
        Bước 3: Ghi nhớ
      </div>
      <div className="rounded-3xl bg-card p-8 shadow-raise text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Gõ từ có nghĩa</p>
        <h2 className="font-display text-3xl font-bold">{card.meaning}</h2>
        <p className="mt-2 font-mono text-sm text-muted-foreground">{card.ipa}</p>
      </div>
      <motion.div animate={checked && !isCorrect ? { x: [0, -10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
        <Input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (checked) setChecked(false)
          }}
          placeholder="Gõ từ ở đây…"
          className={cn(
            "h-16 rounded-2xl border-2 bg-card text-center font-display text-2xl font-semibold",
            checked && isCorrect && "border-success",
            checked && !isCorrect && "border-destructive",
          )}
        />
      </motion.div>
      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-2xl p-4 text-center text-sm",
            isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          {isCorrect ? (
            <span className="inline-flex items-center gap-2 font-medium">
              <Sparkles className="size-4" /> Chính xác!
            </span>
          ) : (
            <>
              Đáp án đúng: <span className="font-bold">{card.lemma}</span>
            </>
          )}
        </motion.div>
      )}
      <div className="flex gap-2">
        {!checked ? (
          <Button size="lg" onClick={handleCheck} className="h-14 w-full bg-gradient-primary text-base">
            Kiểm tra
          </Button>
        ) : (
          <Button size="lg" onClick={onNext} className="h-14 w-full bg-gradient-primary text-base">
            Tiếp <ArrowRight className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
