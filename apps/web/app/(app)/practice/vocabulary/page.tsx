"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Plus,
  Volume2,
  Play,
  Download,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Settings,
  Share2,
  Pencil,
  Flag,
  Gamepad2,
  Sparkles,
  X,
  Check,
  Brain,
  Flame,
  Keyboard,
  Shuffle,
  ArrowRight,
  MoreHorizontal,
  BookOpen,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/* ------------------------------- Mock data ------------------------------- */

type DeckStatus = { new: number; learning: number; due: number; mastered: number }
type Deck = {
  id: string
  name: string
  emoji: string
  language: string
  total: number
  status: DeckStatus
  color: string
  description: string
}

type Card = {
  id: string
  front: string
  reading: string
  back: string
  ipa?: string
  example: string
  exampleTranslation: string
  state: "new" | "learning" | "due" | "mastered"
  tags: string[]
}

const decks: Deck[] = [
  {
    id: "jlpt-n5",
    name: "JLPT N5 Core 800",
    emoji: "🇯🇵",
    language: "Tiếng Nhật",
    total: 800,
    status: { new: 24, learning: 36, due: 48, mastered: 540 },
    color: "from-[#5352a5] to-[#a19ff9]",
    description: "Bộ từ vựng cốt lõi cho kỳ thi JLPT N5, bao phủ 95% đề.",
  },
  {
    id: "restaurant",
    name: "Restaurant & Food",
    emoji: "🍣",
    language: "Tiếng Nhật",
    total: 120,
    status: { new: 12, learning: 8, due: 12, mastered: 54 },
    color: "from-[#702ae1] to-[#983772]",
    description: "Từ vựng đi ăn nhà hàng, order món, mô tả hương vị.",
  },
  {
    id: "business",
    name: "Business Japanese",
    emoji: "💼",
    language: "Tiếng Nhật",
    total: 250,
    status: { new: 0, learning: 0, due: 0, mastered: 250 },
    color: "from-[#983772] to-[#a19ff9]",
    description: "Keigo, email, họp hành — chuẩn môi trường công ty.",
  },
  {
    id: "travel",
    name: "Travel Phrases",
    emoji: "✈️",
    language: "Tiếng Nhật",
    total: 75,
    status: { new: 3, learning: 2, due: 5, mastered: 62 },
    color: "from-[#a19ff9] to-[#5352a5]",
    description: "Câu du lịch: khách sạn, sân bay, hỏi đường.",
  },
]

const communityDecks: Deck[] = [
  {
    id: "onomatopoeia",
    name: "Onomatopoeia Masters",
    emoji: "🌸",
    language: "Tiếng Nhật",
    total: 180,
    status: { new: 180, learning: 0, due: 0, mastered: 0 },
    color: "from-[#702ae1] to-[#a19ff9]",
    description: "Các từ tượng thanh/tượng hình Nhật Bản hay gặp trong anime.",
  },
  {
    id: "kanji-radicals",
    name: "Kanji Radicals 214",
    emoji: "🈶",
    language: "Tiếng Nhật",
    total: 214,
    status: { new: 214, learning: 0, due: 0, mastered: 0 },
    color: "from-[#5352a5] to-[#702ae1]",
    description: "Bộ thủ Kanji — nền tảng để đọc mọi chữ Hán.",
  },
  {
    id: "anime-phrases",
    name: "Daily Anime Phrases",
    emoji: "🎌",
    language: "Tiếng Nhật",
    total: 150,
    status: { new: 150, learning: 0, due: 0, mastered: 0 },
    color: "from-[#983772] to-[#5352a5]",
    description: "Câu cửa miệng trong anime/drama cực hữu ích.",
  },
]

const sampleCards: Card[] = [
  {
    id: "1",
    front: "店員",
    reading: "てんいん / ten-in",
    back: "nhân viên cửa hàng",
    ipa: "teɲ̞.iɴ",
    example: "店員さんに聞いてみましょう。",
    exampleTranslation: "Hỏi nhân viên nhé.",
    state: "due",
    tags: ["N5", "job"],
  },
  {
    id: "2",
    front: "注文",
    reading: "ちゅうもん / chuumon",
    back: "gọi món, đặt hàng",
    ipa: "t͡ɕuːmõɴ",
    example: "注文を確認させていただきます。",
    exampleTranslation: "Cho phép tôi xác nhận đơn hàng.",
    state: "new",
    tags: ["N5", "restaurant"],
  },
  {
    id: "3",
    front: "割引",
    reading: "わりびき / waribiki",
    back: "giảm giá",
    ipa: "ɰaɾibʲikʲi",
    example: "この商品は20%割引です。",
    exampleTranslation: "Sản phẩm này giảm 20%.",
    state: "new",
    tags: ["N5", "shopping"],
  },
  {
    id: "4",
    front: "予約",
    reading: "よやく / yoyaku",
    back: "đặt trước, reservation",
    ipa: "jojaku",
    example: "レストランを予約しました。",
    exampleTranslation: "Tôi đã đặt trước nhà hàng.",
    state: "due",
    tags: ["N5", "travel"],
  },
  {
    id: "5",
    front: "美味しい",
    reading: "おいしい / oishii",
    back: "ngon",
    ipa: "oiɕiː",
    example: "このラーメンは本当に美味しいです。",
    exampleTranslation: "Ramen này thật sự rất ngon.",
    state: "learning",
    tags: ["N5", "food"],
  },
]

/* --------------------------------- Router -------------------------------- */

type View =
  | { name: "list" }
  | { name: "detail"; deckId: string }
  | { name: "learn"; deckId: string }
  | { name: "review"; deckId: string }
  | { name: "game"; deckId: string }

export default function VocabularyPage() {
  const [view, setView] = useState<View>({ name: "list" })
  const goList = useCallback(() => setView({ name: "list" }), [])
  const goDeck = useCallback((id: string) => setView({ name: "detail", deckId: id }), [])

  if (view.name === "learn") {
    return <LearnMode deckId={view.deckId} onExit={() => setView({ name: "detail", deckId: view.deckId })} />
  }

  if (view.name === "review") {
    return <ReviewSession deckId={view.deckId} onExit={() => setView({ name: "detail", deckId: view.deckId })} />
  }

  if (view.name === "game") {
    return <MatchGame deckId={view.deckId} onExit={() => setView({ name: "detail", deckId: view.deckId })} />
  }

  if (view.name === "detail") {
    const deck = [...decks, ...communityDecks].find((d) => d.id === view.deckId) ?? decks[0]
    return (
      <DeckDetail
        deck={deck}
        onBack={goList}
        onLearn={() => setView({ name: "learn", deckId: deck.id })}
        onReview={() => setView({ name: "review", deckId: deck.id })}
        onGame={() => setView({ name: "game", deckId: deck.id })}
      />
    )
  }

  return <DeckList onOpen={goDeck} />
}

/* ------------------------------- Deck list ------------------------------- */

function DeckList({ onOpen }: { onOpen: (id: string) => void }) {
  const totalDue = decks.reduce((s, d) => s + d.status.due, 0)
  const totalNew = decks.reduce((s, d) => s + d.status.new, 0)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Từ vựng</p>
          <h1 className="mt-1 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
            Flashcard Decks
          </h1>
          <p className="mt-1 text-muted-foreground">
            Thuật toán SRS giúp ghi nhớ 10× nhanh hơn.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="rounded-full bg-surface-lowest shadow-ambient">
            <Download className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient">
            <Plus className="mr-2 h-4 w-4" />
            Deck mới
          </Button>
        </div>
      </div>

      {/* Today banner */}
      <div
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover"
      >
        <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm opacity-85">
              <Flame className="h-4 w-4" />
              Hôm nay
            </p>
            <p className="mt-1 text-3xl font-extrabold">
              {totalDue} thẻ tới hạn · {totalNew} thẻ mới
            </p>
            <p className="mt-1 text-sm opacity-85">Ước tính ~12 phút học tập trung.</p>
          </div>
          <Button
            size="lg"
            onClick={() => onOpen("jlpt-n5")}
            className="rounded-full bg-white text-primary shadow-hover hover:bg-white/90"
          >
            <Play className="mr-2 h-4 w-4 fill-current" />
            Bắt đầu học thông minh
          </Button>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 right-1/3 h-40 w-40 rounded-full bg-accent/30 blur-2xl" />
      </div>

      <Tabs defaultValue="my">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-surface-low">
            <TabsTrigger value="my" className="rounded-full">
              Deck của tôi
            </TabsTrigger>
            <TabsTrigger value="community" className="rounded-full">
              Cộng đồng
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm deck..."
              className="w-full rounded-full bg-surface-lowest pl-11 shadow-ambient sm:w-64"
            />
          </div>
        </div>

        <TabsContent value="my" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((d, i) => (
              <DeckCard key={d.id} deck={d} index={i} onOpen={() => onOpen(d.id)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communityDecks.map((d, i) => (
              <DeckCard key={d.id} deck={d} index={i} onOpen={() => onOpen(d.id)} community />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DeckCard({
  deck,
  index,
  onOpen,
  community = false,
}: {
  deck: Deck
  index: number
  onOpen: () => void
  community?: boolean
}) {
  const { status } = deck
  const learned = status.mastered + status.learning
  const progress = Math.round((learned / deck.total) * 100)
  const segments = [
    { label: "Mới", value: status.new, color: "bg-accent" },
    { label: "Đang học", value: status.learning, color: "bg-warning" },
    { label: "Tới hạn", value: status.due, color: "bg-destructive" },
    { label: "Thuộc", value: status.mastered, color: "bg-success" },
  ]

  return (
    <button
      type="button"
      onClick={onOpen}
      data-aos="fade-up"
      data-aos-delay={index * 50}
      className="group relative overflow-hidden rounded-3xl bg-surface-lowest p-6 text-left shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${deck.color} text-3xl shadow-ambient`}
        >
          {deck.emoji}
        </span>
        <div className="flex flex-col items-end gap-1 text-right">
          {status.due > 0 && !community && (
            <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
              {status.due} due
            </span>
          )}
          {community && (
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
              Cộng đồng
            </span>
          )}
          <span className="text-xs text-muted-foreground">{deck.total} thẻ</span>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-bold leading-snug">{deck.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{deck.description}</p>

      {/* Stacked status bar */}
      <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-surface-low">
        {segments.map((s) => (
          <div
            key={s.label}
            className={s.color}
            style={{ width: `${(s.value / deck.total) * 100}%` }}
            title={`${s.label}: ${s.value}`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <Legend color="bg-accent" label={`${status.new} Mới`} />
        <Legend color="bg-warning" label={`${status.learning} Học`} />
        <Legend color="bg-destructive" label={`${status.due} Due`} />
        <Legend color="bg-success" label={`${status.mastered} Thuộc`} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          {progress}% thuộc
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Mở deck
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  )
}

/* ------------------------------ Deck detail ------------------------------ */

function DeckDetail({
  deck,
  onBack,
  onLearn,
  onReview,
  onGame,
}: {
  deck: Deck
  onBack: () => void
  onLearn: () => void
  onReview: () => void
  onGame: () => void
}) {
  const [filter, setFilter] = useState<"all" | Card["state"]>("all")
  const filtered = filter === "all" ? sampleCards : sampleCards.filter((c) => c.state === filter)

  const hasNew = deck.status.new > 0
  const hasDue = deck.status.due > 0
  const entry = hasNew ? "learn" : hasDue ? "review" : "done"

  const smartStart = () => {
    if (entry === "learn") onLearn()
    else if (entry === "review") onReview()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-full bg-surface-lowest px-4 py-2 text-sm font-semibold text-muted-foreground shadow-ambient transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Tất cả deck
      </button>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Header card */}
        <div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-3xl bg-surface-lowest p-8 shadow-ambient"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${deck.color} text-5xl shadow-hover`}
            >
              {deck.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                {deck.language}
              </p>
              <h1 className="mt-1 font-sans text-3xl font-extrabold tracking-tight">{deck.name}</h1>
              <p className="mt-2 text-muted-foreground">{deck.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <IconButton icon={Pencil} label="Sửa deck" />
                <IconButton icon={Share2} label="Chia sẻ" />
                <IconButton icon={Settings} label="Thiết lập" />
                <IconButton icon={MoreHorizontal} label="Thêm" hideLabel />
              </div>
            </div>
          </div>

          {/* Smart CTA */}
          <div className="mt-6 grid gap-3 rounded-2xl bg-surface-low p-4 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Đề xuất phiên học
              </p>
              <p className="mt-1 text-lg font-bold">
                {entry === "learn" &&
                  `Học ${Math.min(7, deck.status.new)} thẻ mới, sau đó ôn ${deck.status.due} thẻ due`}
                {entry === "review" && `Ôn tập ${deck.status.due} thẻ tới hạn`}
                {entry === "done" && "Hết phần hôm nay — Nghỉ ngơi nào!"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Hệ thống tự quyết định flow theo thuật toán SRS.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                onClick={smartStart}
                disabled={entry === "done"}
                className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient disabled:opacity-60"
              >
                {entry === "done" ? (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Đã xong hôm nay
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Bắt đầu học
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={onGame}
                className="rounded-full bg-surface-lowest text-foreground shadow-ambient hover:bg-surface-high"
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Chơi Game
              </Button>
            </div>
          </div>
        </div>

        {/* Stats donut */}
        <StatsPanel deck={deck} />
      </div>

      {/* Card list */}
      <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Thẻ trong deck</h2>
            <p className="text-sm text-muted-foreground">
              Preview và quản lý từng thẻ cụ thể.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "new", "learning", "due", "mastered"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === f
                    ? "bg-gradient-primary text-primary-foreground shadow-ambient"
                    : "bg-surface-low text-muted-foreground hover:bg-surface-high"
                )}
              >
                {{ all: "Tất cả", new: "Mới", learning: "Đang học", due: "Tới hạn", mastered: "Thuộc" }[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 divide-y divide-border">
          {filtered.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-4 py-4">
              <StateDot state={c.state} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="font-sans text-2xl font-extrabold">{c.front}</p>
                  <p className="text-sm text-muted-foreground">{c.reading}</p>
                </div>
                <p className="mt-0.5 text-sm">{c.back}</p>
              </div>
              <div className="hidden flex-wrap gap-1.5 md:flex">
                {c.tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-low px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Nghe"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-low text-muted-foreground transition-colors hover:bg-surface-high hover:text-foreground"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  aria-label="Sửa"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-low text-muted-foreground transition-colors hover:bg-surface-high hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Không có thẻ nào ở trạng thái này.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function IconButton({
  icon: Icon,
  label,
  hideLabel = false,
}: {
  icon: typeof Pencil
  label: string
  hideLabel?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full bg-surface-low px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface-high hover:text-foreground"
    >
      <Icon className="h-3.5 w-3.5" />
      {!hideLabel && label}
    </button>
  )
}

function StatsPanel({ deck }: { deck: Deck }) {
  const { new: n, learning, due, mastered } = deck.status
  const total = n + learning + due + mastered || 1
  const segments = [
    { label: "Mới", value: n, color: "var(--accent)" },
    { label: "Đang học", value: learning, color: "var(--warning)" },
    { label: "Tới hạn", value: due, color: "var(--destructive)" },
    { label: "Thuộc", value: mastered, color: "var(--success)" },
  ]
  const size = 160
  const stroke = 18
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div data-aos="fade-up" data-aos-delay="100" className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
      <h2 className="text-xl font-bold">Trạng thái thẻ</h2>
      <div className="mt-4 flex items-center gap-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--surface-low)"
              strokeWidth={stroke}
            />
            {segments.map((s) => {
              const len = (s.value / total) * circumference
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${len} ${circumference - len}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              )
              offset += len
              return el
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold">{mastered}</span>
            <span className="text-xs text-muted-foreground">/ {deck.total} thuộc</span>
          </div>
        </div>
        <ul className="flex-1 space-y-2 text-sm">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="font-bold">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StateDot({ state }: { state: Card["state"] }) {
  const map = {
    new: { color: "bg-accent", label: "Mới" },
    learning: { color: "bg-warning", label: "Học" },
    due: { color: "bg-destructive", label: "Due" },
    mastered: { color: "bg-success", label: "Thuộc" },
  }[state]
  return (
    <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white", map.color)}>
      {map.label}
    </span>
  )
}

/* ------------------------------ Focus shell ------------------------------ */

function FocusShell({
  title,
  current,
  total,
  onExit,
  children,
  sub,
}: {
  title: string
  current: number
  total: number
  onExit: () => void
  children: React.ReactNode
  sub?: React.ReactNode
}) {
  const pct = Math.min(100, ((current + 1) / total) * 100)
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-soft">
      <header className="flex items-center gap-3 border-b border-border bg-surface-lowest/80 px-4 py-3 backdrop-blur-xl sm:px-8">
        <button
          onClick={onExit}
          aria-label="Thoát"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-low text-muted-foreground transition-colors hover:bg-surface-high hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">{title}</p>
            <span className="text-xs font-bold text-muted-foreground">
              {Math.min(current + 1, total)}/{total}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-low">
            <motion.div
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
              className="h-full bg-gradient-primary"
            />
          </div>
        </div>
        {sub}
      </header>
      <main className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  )
}

/* -------------------------------- Learn Mode ------------------------------ */
/* 3 micro-drills per card: Làm quen -> Nhận diện -> Ghi nhớ                  */

type DrillStep = "intro" | "recognize" | "recall"

function LearnMode({ deckId, onExit }: { deckId: string; onExit: () => void }) {
  void deckId
  const deck = useMemo(() => sampleCards.slice(0, 5), [])
  const total = deck.length
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState<DrillStep>("intro")
  const [done, setDone] = useState(false)
  const current = deck[index]

  const goNext = useCallback(() => {
    if (step === "intro") setStep("recognize")
    else if (step === "recognize") setStep("recall")
    else {
      if (index + 1 >= total) setDone(true)
      else {
        setIndex((i) => i + 1)
        setStep("intro")
      }
    }
  }, [step, index, total])

  if (done) {
    return <SessionDone title="Hoàn thành Learn Mode!" subtitle={`Đã nạp ${total} thẻ mới vào bộ nhớ.`} onExit={onExit} />
  }

  const progress = index + (step === "intro" ? 0 : step === "recognize" ? 0.33 : 0.66)

  return (
    <FocusShell
      title="Học từ mới"
      current={Math.floor(progress)}
      total={total}
      onExit={onExit}
      sub={
        <div className="hidden items-center gap-1 rounded-full bg-surface-low px-3 py-1 text-xs font-bold text-muted-foreground sm:inline-flex">
          <Brain className="h-3.5 w-3.5" />
          Bước {step === "intro" ? "1/3" : step === "recognize" ? "2/3" : "3/3"}
        </div>
      }
    >
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key={`intro-${current.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <StepHeader kicker="Bước 1 · Làm quen" title="Đọc và nghe cả hai mặt" />
            <div className="mt-6 overflow-hidden rounded-[2rem] bg-surface-lowest shadow-hover">
              <div className="flex flex-col items-center gap-2 bg-gradient-primary p-10 text-primary-foreground">
                <p className="text-xs uppercase tracking-widest opacity-80">Từ</p>
                <p className="font-sans text-6xl font-extrabold tracking-tight sm:text-7xl">{current.front}</p>
                <p className="text-sm opacity-90">{current.reading}</p>
                <button
                  aria-label="Phát âm"
                  className="mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 p-6">
                <InfoRow label="Nghĩa" value={current.back} />
                {current.ipa && <InfoRow label="IPA" value={`/${current.ipa}/`} mono />}
                <InfoRow label="Ví dụ" value={current.example} sub={current.exampleTranslation} />
              </div>
            </div>
            <FooterAction onClick={goNext} label="Đã hiểu, tiếp tục" />
          </motion.div>
        )}

        {step === "recognize" && (
          <RecognizeStep key={`rec-${current.id}`} card={current} onDone={goNext} />
        )}

        {step === "recall" && (
          <RecallStep key={`rcl-${current.id}`} card={current} onDone={goNext} />
        )}
      </AnimatePresence>
    </FocusShell>
  )
}

function StepHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{kicker}</p>
      <h2 className="mt-1 font-sans text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  )
}

function InfoRow({
  label,
  value,
  sub,
  mono = false,
}: {
  label: string
  value: string
  sub?: string
  mono?: boolean
}) {
  return (
    <div className="rounded-2xl bg-surface-low p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">{label}</p>
      <p className={cn("mt-1 font-bold", mono ? "font-mono text-lg" : "text-lg")}>{value}</p>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  )
}

function FooterAction({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className="mt-6 w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
    >
      {label}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
}

function RecognizeStep({ card, onDone }: { card: Card; onDone: () => void }) {
  const choices = useMemo(() => {
    const wrong = sampleCards.filter((c) => c.id !== card.id).slice(0, 3).map((c) => c.back)
    const all = [...wrong, card.back]
    // deterministic order based on card.id
    return all
      .map((v, i) => ({ v, k: (card.id.charCodeAt(0) + i) % 7 }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.v)
  }, [card])

  const [picked, setPicked] = useState<string | null>(null)
  const correct = picked === card.back

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <StepHeader kicker="Bước 2 · Nhận diện" title="Chọn nghĩa đúng của từ" />
      <div className="mt-6 rounded-[2rem] bg-surface-lowest p-8 text-center shadow-hover">
        <p className="font-sans text-6xl font-extrabold tracking-tight sm:text-7xl">{card.front}</p>
        <p className="mt-2 text-sm text-muted-foreground">{card.reading}</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {choices.map((c) => {
          const isPicked = picked === c
          const isRight = picked && c === card.back
          return (
            <button
              key={c}
              onClick={() => setPicked(c)}
              disabled={!!picked}
              className={cn(
                "group relative flex items-center justify-between gap-3 rounded-2xl border-2 bg-surface-lowest p-4 text-left text-base font-semibold shadow-ambient transition-all hover:-translate-y-0.5",
                !picked && "border-transparent hover:border-primary/30",
                picked && !isPicked && !isRight && "opacity-50",
                isPicked && (correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10"),
                !isPicked && isRight && "border-success bg-success/10"
              )}
            >
              <span>{c}</span>
              {isPicked && (correct ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-destructive" />)}
              {!isPicked && isRight && <Check className="h-5 w-5 text-success" />}
            </button>
          )
        })}
      </div>
      <FooterAction onClick={onDone} label={picked ? (correct ? "Tuyệt vời! Tiếp tục" : "Xem lại, tiếp tục") : "Bỏ qua"} />
    </motion.div>
  )
}

function RecallStep({ card, onDone }: { card: Card; onDone: () => void }) {
  const [value, setValue] = useState("")
  const [state, setState] = useState<"idle" | "wrong" | "right">("idle")
  const target = card.front.trim()

  const submit = () => {
    if (!value.trim()) return
    if (value.trim() === target || value.trim().toLowerCase() === card.reading.split(" / ")[1]?.toLowerCase()) {
      setState("right")
    } else {
      setState("wrong")
      setTimeout(() => setState("idle"), 600)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <StepHeader kicker="Bước 3 · Ghi nhớ" title="Gõ lại từ theo nghĩa dưới đây" />
      <div className="mt-6 rounded-[2rem] bg-surface-lowest p-8 text-center shadow-hover">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Nghĩa</p>
        <p className="mt-2 text-3xl font-extrabold">{card.back}</p>
        <p className="mt-2 text-sm text-muted-foreground">{card.example}</p>
      </div>
      <motion.div
        animate={state === "wrong" ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "mt-4 flex items-center gap-2 rounded-2xl border-2 bg-surface-lowest p-2 shadow-ambient",
          state === "wrong" && "border-destructive",
          state === "right" && "border-success",
          state === "idle" && "border-transparent"
        )}
      >
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (state !== "idle") setState("idle")
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (state === "right") onDone()
              else submit()
            }
          }}
          placeholder="Gõ chữ Nhật hoặc Romaji..."
          className="h-12 border-0 bg-transparent text-lg shadow-none focus-visible:ring-0"
          autoFocus
        />
        <Button
          onClick={() => (state === "right" ? onDone() : submit())}
          className="rounded-full bg-gradient-primary px-6 text-primary-foreground"
        >
          {state === "right" ? "Tiếp tục" : "Kiểm tra"}
        </Button>
      </motion.div>
      {state === "right" && (
        <p className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-success">
          <Check className="h-4 w-4" />
          Chính xác! Nhấn Enter để tiếp tục
        </p>
      )}
      {state === "wrong" && (
        <p className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-destructive">
          <X className="h-4 w-4" />
          Chưa đúng, thử lại nào
        </p>
      )}
      <button onClick={onDone} className="mx-auto mt-4 block text-sm font-semibold text-muted-foreground hover:text-foreground">
        Bỏ qua bước này
      </button>
    </motion.div>
  )
}

/* ----------------------------- Review Session ---------------------------- */

type Rating = "again" | "hard" | "good" | "easy"

function ReviewSession({ deckId, onExit }: { deckId: string; onExit: () => void }) {
  void deckId
  const queue = useMemo(() => sampleCards.slice(0, 5), [])
  const total = queue.length
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)

  const card = queue[index]

  const advance = useCallback(
    (_rating: Rating) => {
      setFlipped(false)
      if (index + 1 >= total) setDone(true)
      else setIndex((i) => i + 1)
    },
    [index, total]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return
      if (e.code === "Space") {
        e.preventDefault()
        if (!flipped) setFlipped(true)
        return
      }
      if (flipped) {
        if (e.key === "1") advance("again")
        if (e.key === "2") advance("hard")
        if (e.key === "3") advance("good")
        if (e.key === "4") advance("easy")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [flipped, advance, done])

  if (done) {
    return <SessionDone title="Hoàn thành ôn tập!" subtitle={`Đã ôn ${total} thẻ — streak +1.`} onExit={onExit} />
  }

  return (
    <FocusShell
      title="Ôn tập SRS"
      current={index}
      total={total}
      onExit={onExit}
      sub={
        <div className="hidden items-center gap-1 rounded-full bg-surface-low px-3 py-1 text-xs font-bold text-muted-foreground sm:inline-flex">
          <Keyboard className="h-3.5 w-3.5" />
          Space · 1–4
        </div>
      }
    >
      <div className="relative">
        {/* Quick actions */}
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          <QuickAction icon={Pencil} label="Sửa nhanh" />
          <QuickAction icon={Flag} label="Gắn cờ / Hoãn" />
        </div>

        <div className="min-h-[420px] [perspective:1600px]">
          <motion.div
            className="relative min-h-[420px] w-full rounded-[2rem] bg-surface-lowest shadow-hover [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Front */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[2rem] p-10 text-center [backface-visibility:hidden]">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Mặt trước</p>
              <p className="font-sans text-6xl font-extrabold tracking-tight sm:text-8xl">{card.front}</p>
              <p className="text-sm text-muted-foreground">Bấm Space để lật thẻ</p>
            </div>
            {/* Back */}
            <div className="absolute inset-0 flex flex-col gap-4 rounded-[2rem] p-10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex items-center justify-center gap-3">
                <p className="font-sans text-5xl font-extrabold">{card.front}</p>
                <button
                  aria-label="Nghe"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary text-white shadow-ambient"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {card.reading}
                {card.ipa && <span className="ml-2 font-mono">/{card.ipa}/</span>}
              </p>
              <div className="rounded-2xl bg-surface-low p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">Nghĩa</p>
                <p className="mt-1 text-2xl font-extrabold">{card.back}</p>
              </div>
              <div className="rounded-2xl bg-surface-low p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">Ví dụ</p>
                <p className="mt-1 text-base font-semibold">{card.example}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.exampleTranslation}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div key="flip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Button
                size="lg"
                onClick={() => setFlipped(true)}
                className="mt-6 w-full rounded-full bg-gradient-primary text-primary-foreground shadow-ambient"
              >
                Lật thẻ
                <span className="ml-3 rounded bg-white/20 px-2 py-0.5 text-[11px] font-mono">Space</span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="rate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              <RatingButton onClick={() => advance("again")} label="Lại" sub="< 1m" shortcut="1" color="text-destructive" ring="ring-destructive/30" />
              <RatingButton onClick={() => advance("hard")} label="Khó" sub="6m" shortcut="2" color="text-warning" ring="ring-warning/30" />
              <RatingButton onClick={() => advance("good")} label="Tốt" sub="10m" shortcut="3" color="text-success" ring="ring-success/30" />
              <RatingButton onClick={() => advance("easy")} label="Dễ" sub="4d" shortcut="4" color="text-primary" ring="ring-primary/30" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FocusShell>
  )
}

function QuickAction({ icon: Icon, label }: { icon: typeof Pencil; label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-low text-muted-foreground transition-colors hover:bg-surface-high hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function RatingButton({
  onClick,
  label,
  sub,
  shortcut,
  color,
  ring,
}: {
  onClick: () => void
  label: string
  sub: string
  shortcut: string
  color: string
  ring: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-1 rounded-2xl bg-surface-lowest/80 py-4 text-foreground shadow-ambient ring-1 ring-border transition-all hover:-translate-y-0.5 hover:bg-surface-lowest hover:ring-2",
        ring
      )}
    >
      <span className={cn("text-lg font-bold", color)}>{label}</span>
      <span className="text-xs text-muted-foreground">{sub}</span>
      <span className="absolute right-2 top-2 rounded bg-surface-low px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
        {shortcut}
      </span>
    </button>
  )
}

function SessionDone({ title, subtitle, onExit }: { title: string; subtitle: string; onExit: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-soft px-4 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
        className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-primary text-5xl shadow-hover"
      >
        <Sparkles className="h-12 w-12 text-white" />
      </motion.div>
      <h1 className="mt-6 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{subtitle}</p>
      <div className="mt-6 flex gap-2">
        <Button onClick={onExit} className="rounded-full bg-gradient-primary text-primary-foreground shadow-ambient">
          Quay lại deck
        </Button>
      </div>
    </div>
  )
}

/* --------------------------------- Game ---------------------------------- */

function MatchGame({ deckId, onExit }: { deckId: string; onExit: () => void }) {
  void deckId
  const pairs = useMemo(() => sampleCards.slice(0, 4), [])
  // Two columns: fronts + backs shuffled deterministically
  const fronts = pairs.map((p) => ({ key: `f-${p.id}`, id: p.id, text: p.front, isFront: true }))
  const backs = [...pairs]
    .map((p, i) => ({ p, k: (p.id.charCodeAt(0) + i * 3) % 9 }))
    .sort((a, b) => a.k - b.k)
    .map(({ p }) => ({ key: `b-${p.id}`, id: p.id, text: p.back, isFront: false }))

  const [selected, setSelected] = useState<{ id: string; side: "front" | "back" } | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [wrongPair, setWrongPair] = useState<string[]>([])

  const pick = (id: string, side: "front" | "back") => {
    if (matched.includes(id)) return
    if (!selected) {
      setSelected({ id, side })
      return
    }
    if (selected.side === side) {
      setSelected({ id, side })
      return
    }
    if (selected.id === id) {
      setMatched((m) => [...m, id])
      setSelected(null)
    } else {
      setWrongPair([selected.id, id])
      setTimeout(() => {
        setWrongPair([])
        setSelected(null)
      }, 450)
    }
  }

  const allDone = matched.length === pairs.length

  return (
    <FocusShell
      title="Match Game"
      current={matched.length}
      total={pairs.length}
      onExit={onExit}
      sub={
        <div className="hidden items-center gap-1 rounded-full bg-surface-low px-3 py-1 text-xs font-bold text-muted-foreground sm:inline-flex">
          <Shuffle className="h-3.5 w-3.5" />
          Ghép cặp
        </div>
      }
    >
      <div className="text-center">
        <StepHeader kicker="Mini game" title="Ghép từ với nghĩa thật nhanh" />
        <p className="mt-2 text-sm text-muted-foreground">Chọn 1 ô bên trái và 1 ô bên phải để ghép.</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="space-y-3">
          {fronts.map((f) => (
            <MatchTile
              key={f.key}
              text={f.text}
              big
              selected={selected?.id === f.id && selected.side === "front"}
              matched={matched.includes(f.id)}
              wrong={wrongPair.includes(f.id) && selected?.id === f.id && selected?.side === "front"}
              onClick={() => pick(f.id, "front")}
            />
          ))}
        </div>
        <div className="space-y-3">
          {backs.map((b) => (
            <MatchTile
              key={b.key}
              text={b.text}
              selected={selected?.id === b.id && selected.side === "back"}
              matched={matched.includes(b.id)}
              wrong={wrongPair.includes(b.id) && selected?.id === b.id && selected?.side === "back"}
              onClick={() => pick(b.id, "back")}
            />
          ))}
        </div>
      </div>

      {allDone && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-gradient-primary p-5 text-center text-primary-foreground shadow-hover">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-bold">Hoàn thành toàn bộ cặp!</span>
          </div>
          <Button onClick={onExit} className="mt-3 rounded-full bg-white text-primary hover:bg-white/90">
            Quay lại deck
          </Button>
        </motion.div>
      )}
    </FocusShell>
  )
}

function MatchTile({
  text,
  big = false,
  selected,
  matched,
  wrong,
  onClick,
}: {
  text: string
  big?: boolean
  selected: boolean
  matched: boolean
  wrong?: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={matched}
      animate={wrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "flex w-full items-center justify-center rounded-2xl border-2 bg-surface-lowest text-center font-semibold shadow-ambient transition-all",
        big ? "min-h-[72px] text-2xl" : "min-h-[72px] text-base",
        matched && "border-success bg-success/10 text-success line-through opacity-60",
        selected && !matched && "border-primary bg-primary/5 ring-2 ring-primary/30",
        !matched && !selected && "border-transparent hover:-translate-y-0.5 hover:border-primary/30"
      )}
    >
      <span className={cn(big && "font-sans")}>{text}</span>
    </motion.button>
  )
}
