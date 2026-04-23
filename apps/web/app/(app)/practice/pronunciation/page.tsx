"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  Volume2,
  Mic,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Waves,
  Target,
  TrendingUp,
  BookOpen,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PracticeHeader } from "@/components/app/practice-header"

/* ───────────────────────────── DATA ───────────────────────────── */
const ipaVowels = [
  { symbol: "iː", example: "see" },
  { symbol: "ɪ", example: "sit" },
  { symbol: "e", example: "bed" },
  { symbol: "æ", example: "cat" },
  { symbol: "ɑː", example: "father" },
  { symbol: "ɒ", example: "hot" },
  { symbol: "ɔː", example: "saw" },
  { symbol: "ʊ", example: "put" },
  { symbol: "uː", example: "too" },
  { symbol: "ʌ", example: "cup" },
  { symbol: "ɜː", example: "bird" },
  { symbol: "ə", example: "about" },
]

const ipaConsonants = [
  { symbol: "p", example: "pen", voiced: false },
  { symbol: "b", example: "bed", voiced: true },
  { symbol: "t", example: "ten", voiced: false },
  { symbol: "d", example: "day", voiced: true },
  { symbol: "k", example: "key", voiced: false },
  { symbol: "g", example: "go", voiced: true },
  { symbol: "f", example: "fan", voiced: false },
  { symbol: "v", example: "van", voiced: true },
  { symbol: "θ", example: "think", voiced: false },
  { symbol: "ð", example: "this", voiced: true },
  { symbol: "s", example: "see", voiced: false },
  { symbol: "z", example: "zoo", voiced: true },
  { symbol: "ʃ", example: "she", voiced: false },
  { symbol: "ʒ", example: "measure", voiced: true },
  { symbol: "h", example: "hat", voiced: false },
  { symbol: "m", example: "map", voiced: true },
  { symbol: "n", example: "no", voiced: true },
  { symbol: "ŋ", example: "sing", voiced: true },
  { symbol: "l", example: "leg", voiced: true },
  { symbol: "r", example: "red", voiced: true },
]

const minimalPairs = [
  { pair: ["ship", "sheep"], ipa: ["/ʃɪp/", "/ʃiːp/"], focus: "ɪ vs iː", level: "A2" },
  { pair: ["bat", "bet"], ipa: ["/bæt/", "/bet/"], focus: "æ vs e", level: "A1" },
  { pair: ["think", "sink"], ipa: ["/θɪŋk/", "/sɪŋk/"], focus: "θ vs s", level: "A2" },
  { pair: ["light", "right"], ipa: ["/laɪt/", "/raɪt/"], focus: "l vs r", level: "B1" },
  { pair: ["van", "ban"], ipa: ["/væn/", "/bæn/"], focus: "v vs b", level: "A1" },
  { pair: ["cut", "caught"], ipa: ["/kʌt/", "/kɔːt/"], focus: "ʌ vs ɔː", level: "B1" },
]

const tongueTwisters = [
  { text: "She sells seashells by the seashore.", focus: "/ʃ/ vs /s/", level: "A2" },
  { text: "Peter Piper picked a peck of pickled peppers.", focus: "/p/", level: "B1" },
  { text: "How much wood would a woodchuck chuck.", focus: "/w/ + /ʊ/", level: "B2" },
  { text: "Red lorry, yellow lorry.", focus: "/r/ vs /l/", level: "A2" },
  { text: "Thirty-three thirsty thieves thrilled the throne.", focus: "/θ/", level: "B2" },
  { text: "Fresh fish fried in five fat frying pans.", focus: "/f/", level: "B1" },
]

const shadowingSentences = [
  { text: "The weather today is absolutely beautiful.", duration: "3s", level: "A2" },
  { text: "I would like to make a reservation for two.", duration: "4s", level: "B1" },
  { text: "Could you please repeat that more slowly?", duration: "3s", level: "A2" },
  { text: "The presentation was incredibly informative.", duration: "4s", level: "B1" },
]

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-50 text-emerald-700",
  A2: "bg-emerald-50 text-emerald-700",
  B1: "bg-sky-50 text-sky-700",
  B2: "bg-sky-50 text-sky-700",
  C1: "bg-accent-container text-on-accent-container",
  C2: "bg-amber-50 text-amber-700",
}

/* ───────────────────────────── COMPONENTS ───────────────────────────── */

function IPAChart() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Vowels */}
      <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5352a5] to-[#a19ff9] text-white shadow-ambient">
            <span className="text-lg font-bold">V</span>
          </span>
          <div>
            <h3 className="text-lg font-bold">Nguyên âm · 12 âm</h3>
            <p className="text-xs text-muted-foreground">
              Click vào symbol để nghe mẫu · Hover để xem ví dụ
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {ipaVowels.map((v) => (
            <motion.button
              key={v.symbol}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(v.symbol)}
              className={`group flex aspect-square flex-col items-center justify-center rounded-2xl p-2 transition-all ${
                selected === v.symbol
                  ? "bg-gradient-primary text-white shadow-hover"
                  : "bg-surface-low hover:shadow-ambient"
              }`}
            >
              <span className="font-mono text-xl font-bold">{v.symbol}</span>
              <span
                className={`mt-0.5 text-[10px] ${selected === v.symbol ? "text-white/80" : "text-muted-foreground"}`}
              >
                {v.example}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Consonants */}
      <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-fluency text-white shadow-ambient">
            <span className="text-lg font-bold">C</span>
          </span>
          <div>
            <h3 className="text-lg font-bold">Phụ âm · 20 âm</h3>
            <p className="text-xs text-muted-foreground">
              Âm hữu thanh có vòng đậm · Vô thanh viền mờ
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-10">
          {ipaConsonants.map((c) => (
            <motion.button
              key={c.symbol}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(c.symbol)}
              className={`group flex aspect-square flex-col items-center justify-center rounded-2xl p-2 transition-all ${
                selected === c.symbol
                  ? "bg-gradient-fluency text-white shadow-hover"
                  : c.voiced
                    ? "bg-surface-low hover:shadow-ambient ring-2 ring-accent/30"
                    : "bg-surface-low hover:shadow-ambient"
              }`}
            >
              <span className="font-mono text-xl font-bold">{c.symbol}</span>
              <span
                className={`mt-0.5 text-[10px] ${selected === c.symbol ? "text-white/80" : "text-muted-foreground"}`}
              >
                {c.example}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MinimalPairsPanel() {
  const [active, setActive] = useState(0)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const pair = minimalPairs[active]

  const answer = (correct: boolean) => {
    setFeedback(correct ? "correct" : "wrong")
    setTimeout(() => {
      setFeedback(null)
      setActive((i) => (i + 1) % minimalPairs.length)
    }, 900)
  }

  return (
    <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#702ae1] to-[#b48bff] text-white shadow-ambient">
            <Target className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold">Minimal Pairs</h3>
            <p className="text-xs text-muted-foreground">
              Nghe và chọn đúng từ bạn vừa nghe
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LEVEL_COLORS[pair.level]}`}
        >
          {pair.level}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="rounded-full bg-surface-low px-3 py-1 font-mono text-xs">
          {pair.focus}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          size="lg"
          className="rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
        >
          <Play className="mr-2 h-4 w-4 fill-current" />
          Nghe ngẫu nhiên 1 từ
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {pair.pair.map((word, i) => (
          <motion.button
            key={word}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => answer(i === 0)}
            className={`rounded-2xl p-5 text-center transition-all ${
              feedback && i === 0
                ? feedback === "correct"
                  ? "bg-success text-white shadow-hover"
                  : "bg-destructive text-white shadow-hover"
                : "bg-surface-low hover:shadow-ambient"
            }`}
          >
            <p className="text-2xl font-extrabold">{word}</p>
            <p className="mt-1 font-mono text-sm opacity-70">{pair.ipa[i]}</p>
          </motion.button>
        ))}
      </div>

      {feedback && (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold">
          {feedback === "correct" ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-success">Chính xác! +5 XP</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive">Chưa đúng, nghe lại nhé</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}

function TongueTwistersPanel() {
  const [recording, setRecording] = useState(false)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tongueTwisters.map((t, i) => (
        <div
          key={i}
          className="rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#983772] to-[#d56ba6] text-white shadow-ambient">
              <Waves className="h-5 w-5" />
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LEVEL_COLORS[t.level]}`}
            >
              {t.level}
            </span>
          </div>
          <p className="mt-4 font-semibold leading-snug">{t.text}</p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-surface-low px-2.5 py-1 font-mono">
              {t.focus}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 rounded-full bg-surface-low hover:bg-surface-high"
            >
              <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
              Nghe mẫu
            </Button>
            <Button
              size="sm"
              onClick={() => setRecording(!recording)}
              className="flex-1 rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
            >
              <Mic className="mr-1.5 h-3.5 w-3.5" />
              {recording ? "Dừng" : "Thu âm"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ShadowingPanel() {
  const [current, setCurrent] = useState(0)
  const s = shadowingSentences[current]

  return (
    <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2e9e6a] to-[#5cc29a] text-white shadow-ambient">
          <Mic className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-bold">Shadowing — 3 bước</h3>
          <p className="text-xs text-muted-foreground">
            Câu {current + 1}/{shadowingSentences.length} · {s.duration} · {s.level}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setCurrent((i) => (i + 1) % shadowingSentences.length)}
          className="rounded-full hover:bg-surface-low"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Câu khác
        </Button>
      </div>

      <div className="mt-5 rounded-2xl bg-gradient-soft p-6 text-center">
        <p className="text-xl font-semibold leading-snug sm:text-2xl">
          {s.text}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { step: 1, label: "Nghe kỹ", icon: Volume2, color: "from-[#5352a5] to-[#a19ff9]" },
          { step: 2, label: "Đọc cùng", icon: BookOpen, color: "from-[#702ae1] to-[#b48bff]" },
          { step: 3, label: "Tự nói lại", icon: Mic, color: "from-[#983772] to-[#d56ba6]" },
        ].map((step) => (
          <div
            key={step.step}
            className="rounded-2xl border border-border bg-surface-low p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-ambient`}
              >
                <step.icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                Bước {step.step}
              </span>
            </div>
            <p className="mt-2 font-semibold">{step.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          size="lg"
          className="flex-1 rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
        >
          <Play className="mr-2 h-4 w-4 fill-current" />
          Phát mẫu
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className="flex-1 rounded-full bg-accent-container text-on-accent-container hover:bg-accent-container/80"
        >
          <Mic className="mr-2 h-4 w-4" />
          Thu âm
        </Button>
      </div>
    </div>
  )
}

function PitchGraphPanel() {
  return (
    <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d9912a] to-[#efc170] text-white shadow-ambient">
          <TrendingUp className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold">Pitch Graph Analyzer</h3>
          <p className="text-xs text-muted-foreground">
            So sánh tần số giọng bạn với giọng bản xứ
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-gradient-soft p-6">
        <p className="text-center text-lg font-semibold">
          "I can't believe it's already Friday!"
        </p>
        <div className="relative mt-6 h-36 overflow-hidden rounded-xl bg-white/60">
          <svg
            viewBox="0 0 400 120"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            {/* Native speaker - purple */}
            <path
              d="M 0 70 Q 60 40 120 55 T 240 30 T 360 60 L 400 45"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Your attempt - primary */}
            <path
              d="M 0 75 Q 60 60 120 65 T 240 45 T 360 70 L 400 55"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="mt-3 flex items-center justify-center gap-5 text-xs">
          <span className="flex items-center gap-2">
            <span className="h-1 w-4 rounded-full bg-accent" />
            Bản xứ
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-4 rounded-full bg-primary" />
            Bạn
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          size="lg"
          className="flex-1 rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
        >
          <Mic className="mr-2 h-4 w-4" />
          Thu lại
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className="flex-1 rounded-full bg-surface-low hover:bg-surface-high"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Phân tích AI
        </Button>
      </div>
    </div>
  )
}

/* ───────────────────────────── PAGE ───────────────────────────── */
export default function PronunciationPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PracticeHeader
        icon={Volume2}
        breadcrumb="Luyện tập"
        title="Phát Âm"
        highlight="IPA-chuẩn"
        description="Làm chủ 44 âm IPA, luyện minimal pairs, tongue twisters và pitch analysis — từ nhận diện đến phát âm chính xác."
        gradient="purple-pink"
        badge="44 âm IPA · Pitch analyzer"
        stats={[
          { label: "Âm đã luyện", value: "28/44" },
          { label: "Độ chính xác", value: "82%" },
          { label: "Minimal pairs", value: "36" },
          { label: "Streak", value: "9" },
        ]}
      />

      <Tabs defaultValue="ipa" className="space-y-5">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-full bg-surface-lowest p-1 shadow-ambient sm:grid-cols-5">
          <TabsTrigger
            value="ipa"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            IPA Chart
          </TabsTrigger>
          <TabsTrigger
            value="pairs"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            Minimal Pairs
          </TabsTrigger>
          <TabsTrigger
            value="twister"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            Tongue Twisters
          </TabsTrigger>
          <TabsTrigger
            value="shadow"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            Shadowing
          </TabsTrigger>
          <TabsTrigger
            value="pitch"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            Pitch Graph
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ipa">
          <IPAChart />
        </TabsContent>
        <TabsContent value="pairs">
          <MinimalPairsPanel />
        </TabsContent>
        <TabsContent value="twister">
          <TongueTwistersPanel />
        </TabsContent>
        <TabsContent value="shadow">
          <ShadowingPanel />
        </TabsContent>
        <TabsContent value="pitch">
          <PitchGraphPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
