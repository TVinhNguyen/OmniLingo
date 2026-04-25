"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Headphones,
  Play,
  Pause,
  SkipBack,
  Volume2,
  Search,
  X,
  Radio,
  Mic,
  Puzzle,
  Type,
  Clock,
  Flame,
  TrendingUp,
  CheckCircle2,
  AudioLines,
  Film,
} from "lucide-react"
import { PracticeHeader } from "@/components/app/practice-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { motion, AnimatePresence } from "motion/react"

/* ----------------------------- Mock data ----------------------------- */

type ListeningItem = {
  id: string
  title: string
  sub: string
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  duration: string
  difficulty: 1 | 2 | 3 | 4 | 5
  gradient: string
  emoji: string
  category: string
}

const dictationItems: ListeningItem[] = [
  { id: "d1", title: "Morning routine", sub: "Everyday conversation", level: "A1", duration: "2:15", difficulty: 1, gradient: "from-[#5352a5] to-[#a19ff9]", emoji: "☀️", category: "conversation" },
  { id: "d2", title: "News headlines", sub: "BBC World Service", level: "B1", duration: "3:40", difficulty: 3, gradient: "from-[#702ae1] to-[#983772]", emoji: "📰", category: "news" },
  { id: "d3", title: "Coffee shop order", sub: "Ordering small talk", level: "A2", duration: "1:55", difficulty: 2, gradient: "from-[#983772] to-[#a19ff9]", emoji: "☕", category: "conversation" },
  { id: "d4", title: "Climate change", sub: "Academic lecture", level: "C1", duration: "5:20", difficulty: 5, gradient: "from-[#a19ff9] to-[#5352a5]", emoji: "🌍", category: "academic" },
  { id: "d5", title: "Job interview", sub: "Formal dialogue", level: "B2", duration: "4:10", difficulty: 4, gradient: "from-[#5352a5] to-[#702ae1]", emoji: "💼", category: "interview" },
  { id: "d6", title: "Travel tips Tokyo", sub: "Podcast excerpt", level: "B1", duration: "3:05", difficulty: 3, gradient: "from-[#702ae1] to-[#a19ff9]", emoji: "🗼", category: "podcast" },
]

const chooseItems: ListeningItem[] = [
  { id: "c1", title: "Directions downtown", sub: "Ask for directions", level: "A2", duration: "1:30", difficulty: 2, gradient: "from-[#702ae1] to-[#a19ff9]", emoji: "🧭", category: "conversation" },
  { id: "c2", title: "Weather forecast", sub: "Daily bulletin", level: "A2", duration: "1:20", difficulty: 2, gradient: "from-[#5352a5] to-[#a19ff9]", emoji: "🌤️", category: "news" },
  { id: "c3", title: "Sports news", sub: "Quick update", level: "B1", duration: "2:40", difficulty: 3, gradient: "from-[#983772] to-[#5352a5]", emoji: "⚽", category: "news" },
  { id: "c4", title: "Tech interview", sub: "Product talk", level: "B2", duration: "3:50", difficulty: 4, gradient: "from-[#a19ff9] to-[#702ae1]", emoji: "💻", category: "interview" },
  { id: "c5", title: "Restaurant review", sub: "Food critic", level: "B1", duration: "2:25", difficulty: 3, gradient: "from-[#702ae1] to-[#983772]", emoji: "🍽️", category: "conversation" },
  { id: "c6", title: "History lecture", sub: "Middle Ages", level: "C1", duration: "6:00", difficulty: 5, gradient: "from-[#5352a5] to-[#702ae1]", emoji: "🏰", category: "academic" },
]

const gapFillItems: ListeningItem[] = [
  { id: "g1", title: "Song lyrics · Imagine", sub: "John Lennon", level: "B1", duration: "3:00", difficulty: 3, gradient: "from-[#983772] to-[#a19ff9]", emoji: "🎵", category: "conversation" },
  { id: "g2", title: "Airport announcement", sub: "Boarding", level: "A2", duration: "0:45", difficulty: 2, gradient: "from-[#5352a5] to-[#a19ff9]", emoji: "✈️", category: "conversation" },
  { id: "g3", title: "Hotel check-in", sub: "Reception desk", level: "A2", duration: "1:50", difficulty: 2, gradient: "from-[#702ae1] to-[#5352a5]", emoji: "🏨", category: "conversation" },
  { id: "g4", title: "Business meeting", sub: "Quarterly review", level: "B2", duration: "4:30", difficulty: 4, gradient: "from-[#a19ff9] to-[#983772]", emoji: "📊", category: "interview" },
  { id: "g5", title: "Radio advertising", sub: "Commercial break", level: "B1", duration: "1:10", difficulty: 3, gradient: "from-[#702ae1] to-[#a19ff9]", emoji: "📻", category: "news" },
  { id: "g6", title: "Cooking show", sub: "Italian pasta", level: "A2", duration: "3:15", difficulty: 2, gradient: "from-[#983772] to-[#702ae1]", emoji: "🍝", category: "conversation" },
]

const shadowingItems: ListeningItem[] = [
  { id: "s1", title: "TED Talk opener", sub: "Public speaking sample", level: "B2", duration: "1:40", difficulty: 4, gradient: "from-[#5352a5] to-[#702ae1]", emoji: "🎤", category: "academic" },
  { id: "s2", title: "Casual greeting", sub: "How are you today?", level: "A1", duration: "0:30", difficulty: 1, gradient: "from-[#a19ff9] to-[#5352a5]", emoji: "👋", category: "conversation" },
  { id: "s3", title: "News anchor", sub: "Evening broadcast", level: "C1", duration: "2:00", difficulty: 5, gradient: "from-[#702ae1] to-[#983772]", emoji: "📺", category: "news" },
  { id: "s4", title: "Movie dialogue", sub: "Classic scene", level: "B1", duration: "1:20", difficulty: 3, gradient: "from-[#983772] to-[#a19ff9]", emoji: "🎬", category: "conversation" },
  { id: "s5", title: "Celebrity interview", sub: "Late night show", level: "B2", duration: "2:50", difficulty: 4, gradient: "from-[#5352a5] to-[#a19ff9]", emoji: "🌟", category: "interview" },
  { id: "s6", title: "Podcast snippet", sub: "Daily stoic", level: "B1", duration: "1:15", difficulty: 3, gradient: "from-[#702ae1] to-[#a19ff9]", emoji: "🎧", category: "podcast" },
]

const podcastItems: ListeningItem[] = [
  { id: "p1", title: "The Daily — NYT", sub: "Today's top story", level: "B2", duration: "22:15", difficulty: 4, gradient: "from-[#5352a5] to-[#702ae1]", emoji: "🗞️", category: "news" },
  { id: "p2", title: "99% Invisible", sub: "Design & hidden world", level: "C1", duration: "35:40", difficulty: 5, gradient: "from-[#702ae1] to-[#a19ff9]", emoji: "🎨", category: "podcast" },
  { id: "p3", title: "NHK Easy News", sub: "Simplified Japanese", level: "A2", duration: "5:20", difficulty: 2, gradient: "from-[#983772] to-[#5352a5]", emoji: "🇯🇵", category: "news" },
  { id: "p4", title: "Stuff You Should Know", sub: "Curious facts", level: "B1", duration: "45:00", difficulty: 3, gradient: "from-[#a19ff9] to-[#702ae1]", emoji: "🧠", category: "podcast" },
  { id: "p5", title: "Lingo Mastered", sub: "Language learning tips", level: "B1", duration: "18:30", difficulty: 3, gradient: "from-[#702ae1] to-[#983772]", emoji: "🗣️", category: "podcast" },
  { id: "p6", title: "BBC Global News", sub: "Around the world", level: "B2", duration: "28:40", difficulty: 4, gradient: "from-[#5352a5] to-[#a19ff9]", emoji: "🌐", category: "news" },
]

const LEVELS = ["Tất cả", "A1", "A2", "B1", "B2", "C1", "C2"]
const CATEGORIES = ["Tất cả", "news", "podcast", "academic", "conversation", "interview"]
const DURATIONS = ["Tất cả", "<3p", "3-10p", ">10p"]

type Tab = "dictation" | "choose" | "gapfill" | "shadowing" | "podcast"

const tabMeta: Record<Tab, { icon: typeof Type; label: string; desc: string; data: ListeningItem[] }> = {
  dictation: { icon: Type, label: "Chép chính tả", desc: "Gõ lại câu bạn nghe, AI tự chấm chính xác đến từng từ", data: dictationItems },
  choose: { icon: Puzzle, label: "Nghe & Chọn", desc: "Nghe hội thoại rồi chọn đáp án đúng nhất", data: chooseItems },
  gapfill: { icon: Film, label: "Điền khuyết", desc: "Điền từ thiếu trong transcript, luyện reflex", data: gapFillItems },
  shadowing: { icon: Mic, label: "Shadowing", desc: "Nhại theo người bản xứ, AI chấm rhythm & pitch", data: shadowingItems },
  podcast: { icon: Radio, label: "Podcast", desc: "Podcast gốc có transcript thông minh, tap-to-save vocab", data: podcastItems },
}

/* ----------------------------- Sub-components ----------------------------- */

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i <= level ? "bg-accent" : "bg-border"}`}
        />
      ))}
    </div>
  )
}

function LevelBadge({ level }: { level: string }) {
  const color =
    level === "A1" || level === "A2"
      ? "bg-white/90 text-emerald-700"
      : level === "B1" || level === "B2"
        ? "bg-white/90 text-amber-700"
        : "bg-white/90 text-destructive"
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-ambient ${color}`}>
      {level}
    </span>
  )
}

function ItemCard({
  item,
  onClick,
  index,
}: {
  item: ListeningItem
  onClick: () => void
  index: number
}) {
  return (
    <button
      onClick={onClick}
      data-aos="fade-up"
      data-aos-delay={index * 40}
      className="group relative w-full overflow-hidden rounded-3xl bg-surface-lowest text-left shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
    >
      <div
        className={`relative aspect-[5/3] bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}
      >
        <span className="text-5xl drop-shadow-lg transition-transform group-hover:scale-110">
          {item.emoji}
        </span>
        <span className="absolute top-3 left-3">
          <LevelBadge level={item.level} />
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" /> {item.duration}
        </span>
        <span className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-hover opacity-0 transition-all group-hover:opacity-100 group-hover:scale-110">
          <Play className="h-4 w-4 fill-current" />
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-bold leading-tight group-hover:text-primary">
          {item.title}
        </h4>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {item.sub}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <DifficultyDots level={item.difficulty} />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {item.category}
          </span>
        </div>
      </div>
    </button>
  )
}

/* ----------------------------- Drawer ----------------------------- */

function ListeningDrawer({
  item,
  onClose,
  mode,
}: {
  item: ListeningItem | null
  onClose: () => void
  mode: Tab
}) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [input, setInput] = useState("")
  const [checked, setChecked] = useState(false)

  if (!item) return null

  const isDictation = mode === "dictation"
  const isChoose = mode === "choose"
  const isGapFill = mode === "gapfill"
  const isShadowing = mode === "shadowing"
  const isPodcast = mode === "podcast"

  const transcript =
    "Good morning everyone. Today we're going to talk about the importance of language learning in the 21st century."

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.aside
        key="drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-background shadow-hover sm:w-[560px]"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-border bg-surface-lowest p-5">
          <div className="flex items-start gap-3">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-ambient ${item.gradient}`}
            >
              {item.emoji}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <LevelBadge level={item.level} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {tabMeta[mode].label}
                </span>
              </div>
              <h2 className="mt-1 text-lg font-extrabold leading-tight">
                {item.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {item.sub} · {item.duration}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Audio player */}
          <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPlaying((p) => !p)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-hover transition-transform hover:scale-105"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </button>
              <div className="flex-1">
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: "20%" }}
                    animate={{ width: playing ? "65%" : "20%" }}
                    transition={{ duration: 2 }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-white/80">
                  <span>0:48</span>
                  <span>{item.duration}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <SkipBack className="mr-1 h-3.5 w-3.5" /> Lặp 3s
              </Button>
              <div className="flex items-center gap-0.5 rounded-full bg-white/15 p-1 text-xs">
                {[0.5, 0.75, 1, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`rounded-full px-2.5 py-1 font-semibold transition ${speed === s ? "bg-white text-primary" : "text-white/80 hover:bg-white/10"}`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Mode-specific */}
          {isDictation && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Gõ lại câu bạn vừa nghe
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Bắt đầu gõ..."
                className="mt-3 w-full rounded-2xl border-0 bg-surface-lowest p-4 text-sm shadow-ambient focus:ring-2 focus:ring-ring focus:outline-none"
                rows={5}
              />
              {checked && (
                <div className="mt-3 rounded-2xl bg-success/10 p-4">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="text-sm font-semibold">
                      Accuracy 92% · 48 WPM
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">
                    Good morning everyone. Today we're going to talk about the{" "}
                    <span className="rounded-md bg-destructive/15 px-1.5 py-0.5 text-destructive underline decoration-destructive decoration-wavy">
                      impotance
                    </span>{" "}
                    of language learning in the 21st century.
                  </p>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => setChecked(true)}
                  className="flex-1 rounded-full bg-gradient-primary text-primary-foreground shadow-hover hover:opacity-95"
                >
                  Kiểm tra
                </Button>
                <Button variant="ghost" className="rounded-full bg-surface-low">
                  Xem đáp án
                </Button>
              </div>
            </div>
          )}

          {isChoose && (
            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Nghe và chọn đáp án
              </p>
              <h3 className="text-base font-bold">
                Người nói muốn tới đâu?
              </h3>
              {[
                "The library downtown",
                "The post office",
                "The nearest coffee shop",
                "The train station",
              ].map((opt, i) => (
                <button
                  key={i}
                  className="group flex w-full items-center gap-3 rounded-2xl border-2 border-border bg-surface-lowest p-4 text-left transition hover:border-primary hover:bg-primary/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-low text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-sm font-medium">{opt}</span>
                </button>
              ))}
            </div>
          )}

          {isGapFill && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Điền vào chỗ trống
              </p>
              <div className="mt-3 rounded-2xl bg-surface-lowest p-5 text-sm leading-loose shadow-ambient">
                Good morning everyone. Today we're going to talk about the{" "}
                <input className="mx-1 inline-block w-24 rounded-md border-b-2 border-primary bg-transparent px-2 text-center font-semibold focus:outline-none" />{" "}
                of language learning in the{" "}
                <input className="mx-1 inline-block w-20 rounded-md border-b-2 border-primary bg-transparent px-2 text-center font-semibold focus:outline-none" />{" "}
                century.
              </div>
              <Button className="mt-4 w-full rounded-full bg-gradient-primary text-primary-foreground shadow-hover hover:opacity-95">
                Kiểm tra đáp án
              </Button>
            </div>
          )}

          {isShadowing && (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-surface-lowest p-5 shadow-ambient">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Native
                </p>
                <svg viewBox="0 0 200 40" className="mt-2 h-8 w-full">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <rect
                      key={i}
                      x={i * 5}
                      y={20 - Math.abs(Math.sin(i * 0.4) * 15)}
                      width="3"
                      height={Math.abs(Math.sin(i * 0.4) * 30) + 2}
                      rx="1.5"
                      fill="var(--primary)"
                    />
                  ))}
                </svg>
              </div>
              <div className="rounded-2xl bg-surface-lowest p-5 shadow-ambient">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Giọng của bạn
                </p>
                <div className="mt-2 flex h-8 items-center justify-center text-xs text-muted-foreground">
                  Nhấn giữ nút mic để thu âm
                </div>
              </div>
              <button className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-fluency py-4 font-bold text-white shadow-hover transition-transform active:scale-95">
                <Mic className="h-5 w-5" /> Nhấn giữ để thu
              </button>
            </div>
          )}

          {isPodcast && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Transcript thông minh
              </p>
              <div className="mt-3 rounded-2xl bg-surface-lowest p-5 text-sm leading-loose shadow-ambient">
                {transcript.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className="cursor-pointer rounded px-0.5 transition hover:bg-accent-container hover:text-on-accent-container"
                  >
                    {word}{" "}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Nhấn vào từ bất kỳ để xem nghĩa và thêm vào SRS
              </p>
              <Link
                href={`/practice/listening/podcast/${item.id}`}
                className="mt-4 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-hover hover:opacity-95"
              >
                Mở trang podcast đầy đủ
              </Link>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

/* ----------------------------- Filter chip group ----------------------------- */

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-surface-low p-1">
      <span className="pl-3 pr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            value === opt
              ? "bg-surface-lowest text-foreground shadow-ambient"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

/* ----------------------------- Main page ----------------------------- */

export default function ListeningPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dictation")
  const [level, setLevel] = useState<string>("Tất cả")
  const [category, setCategory] = useState<string>("Tất cả")
  const [duration, setDuration] = useState<string>("Tất cả")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<ListeningItem | null>(null)

  const baseItems = tabMeta[activeTab].data
  const filtered = baseItems.filter((item) => {
    if (level !== "Tất cả" && item.level !== level) return false
    if (category !== "Tất cả" && item.category !== category) return false
    if (duration !== "Tất cả") {
      const [min, sec] = item.duration.split(":").map(Number)
      const totalSec = min * 60 + sec
      if (duration === "<3p" && totalSec >= 180) return false
      if (duration === "3-10p" && (totalSec < 180 || totalSec > 600)) return false
      if (duration === ">10p" && totalSec <= 600) return false
    }
    if (query && !item.title.toLowerCase().includes(query.toLowerCase()))
      return false
    return true
  })

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PracticeHeader
        icon={Headphones}
        breadcrumb="Luyện tập"
        title="Kỹ năng"
        highlight="Nghe"
        description="Nghe hiểu từ cơ bản đến học thuật với podcast, dictation, shadowing và nhiều dạng tương tác."
        gradient="primary"
        badge="5 dạng luyện · 30 bài mới tuần này"
        stats={[
          { label: "Giờ đã nghe", value: "42h" },
          { label: "Độ chính xác", value: "87%" },
          { label: "Streak", value: "12" },
          { label: "Level TB", value: "B2" },
        ]}
      />

      {/* Filters */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-4 shadow-ambient sm:p-5"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm bài nghe..."
              className="h-11 rounded-full border-0 bg-surface-low pl-11"
            />
          </div>

          <FilterGroup label="Level" options={LEVELS} value={level} onChange={setLevel} />
          <FilterGroup label="Chủ đề" options={CATEGORIES} value={category} onChange={setCategory} />
          <FilterGroup label="Thời lượng" options={DURATIONS} value={duration} onChange={setDuration} />
        </div>
      </section>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
        <div className="overflow-x-auto no-scrollbar">
          <TabsList className="h-auto gap-1 rounded-full bg-surface-low p-1.5">
            {(Object.keys(tabMeta) as Tab[]).map((t) => {
              const Icon = tabMeta[t].icon
              return (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-surface-lowest data-[state=active]:shadow-ambient"
                >
                  <Icon className="mr-1.5 h-3.5 w-3.5" />
                  {tabMeta[t].label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {(Object.keys(tabMeta) as Tab[]).map((t) => (
          <TabsContent key={t} value={t} className="mt-6 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {tabMeta[t].label}
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
                  {tabMeta[t].desc}
                </h2>
              </div>
              <p className="hidden text-sm text-muted-foreground sm:block">
                {filtered.length} bài phù hợp
              </p>
            </div>

            {filtered.length === 0 ? (
              <div
                data-aos="fade-up"
                className="rounded-3xl bg-surface-lowest p-16 text-center shadow-ambient"
              >
                <AudioLines className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Không có bài nào khớp bộ lọc. Thử mở rộng điều kiện nhé.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item, i) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    onClick={() => setSelected(item)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Recent activity */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
              <h3 className="text-lg font-bold">Hoạt động gần đây</h3>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Đã nghe 4 bài trong 3 ngày qua
            </p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full bg-surface-low">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" /> Xem tiến độ
          </Button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {podcastItems.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl bg-surface-low p-3"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${p.gradient}`}
              >
                {p.emoji}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <ListeningDrawer
          item={selected}
          onClose={() => setSelected(null)}
          mode={activeTab}
        />
      )}
    </div>
  )
}
