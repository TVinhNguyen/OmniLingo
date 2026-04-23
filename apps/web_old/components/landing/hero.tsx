"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Play, Flame, Trophy, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlagIcon, flagMap, type LangCode } from "@/components/flag-icon"

const languages: LangCode[] = ["en", "ja", "zh", "ko", "fr", "de", "es", "vi"]

export function Hero() {
  const [selected, setSelected] = useState<LangCode>("en")

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Decorative blurred orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #a19ff9 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, #983772 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-lowest px-4 py-2 text-xs font-semibold shadow-ambient"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>AI Tutor mới — trò chuyện tự nhiên 24/7</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-sans text-5xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Học mọi <span className="text-gradient-primary">ngôn ngữ</span>,{" "}
            <br className="hidden sm:block" />
            đạt mọi <span className="text-gradient-fluency">chứng chỉ</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            Anh, Nhật, Trung, Hàn, Pháp, Đức, Tây Ban Nha và hơn thế. Lộ trình
            cá nhân hoá, SRS flashcard khoa học, luyện thi IELTS/TOEIC/JLPT/HSK,
            và giáo viên bản xứ 1-1.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 rounded-3xl bg-surface-lowest p-5 shadow-ambient"
          >
            <p className="mb-3 text-sm font-semibold">Tôi muốn học</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {languages.map((code) => (
                <button
                  key={code}
                  onClick={() => setSelected(code)}
                  className={`group flex flex-col items-center gap-1 rounded-2xl p-3 transition-all ${
                    selected === code
                      ? "bg-gradient-primary text-primary-foreground shadow-hover scale-[1.05]"
                      : "bg-surface-low hover:bg-surface-high"
                  }`}
                  aria-pressed={selected === code}
                >
                  <FlagIcon code={code} size={28} />
                  <span className="text-[11px] font-medium">
                    {flagMap[code].native.length > 6
                      ? flagMap[code].name
                      : flagMap[code].native}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="flex-1 rounded-full bg-gradient-primary text-primary-foreground shadow-ambient hover:shadow-hover transition-shadow"
              >
                <Link href={`/onboarding?lang=${selected}`}>
                  Bắt đầu với {flagMap[selected].native}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full bg-surface-low hover:bg-surface-high"
              >
                <Link href="/sign-in">Đã có tài khoản</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["#a19ff9", "#983772", "#702ae1", "#d2e4ff"].map((c, i) => (
                  <span
                    key={i}
                    className="h-7 w-7 rounded-full ring-2 ring-background"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span className="font-medium">3.2M+ học viên</span>
            </div>
            <div className="flex items-center gap-1.5">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-amber-500">
                  ★
                </span>
              ))}
              <span className="ml-1 font-medium">4.9/5 App Store</span>
            </div>
          </motion.div>
        </div>

        {/* Right visual */}
        <HeroVisual />
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-[4/5] w-full max-w-md"
    >
      {/* Main lesson card */}
      <div className="relative h-full w-full rounded-[2rem] bg-gradient-primary p-1 shadow-hover">
        <div className="flex h-full w-full flex-col rounded-[calc(2rem-4px)] bg-surface-lowest p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-low text-xl">
                🇯🇵
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Unit 3 · Lesson 4</p>
                <p className="text-sm font-semibold">Ordering Food</p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              <Flame className="h-3.5 w-3.5" />
              <span>12 streak</span>
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-surface-low">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "66%" }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="h-full bg-gradient-primary"
            />
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dịch câu này
            </p>
            <p className="mt-2 text-2xl font-bold leading-tight">
              すみません、メニューを ください。
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sumimasen, menyuu wo kudasai.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            {[
              "Excuse me, can I have the menu?",
              "Where is the bathroom?",
              "The weather is nice today.",
            ].map((text, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                  i === 0
                    ? "bg-accent-container text-on-accent-container ring-2 ring-accent"
                    : "bg-surface-low hover:bg-surface-high"
                }`}
              >
                {text}
              </motion.button>
            ))}
          </div>

          <Button
            size="lg"
            className="mt-auto w-full rounded-full bg-gradient-primary shadow-ambient"
          >
            Kiểm tra
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Floating XP badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute -top-6 -left-6 flex items-center gap-2 rounded-2xl bg-surface-lowest px-4 py-3 shadow-hover"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-fluency text-lg">
          ⚡
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Hôm nay</p>
          <p className="text-lg font-extrabold leading-none">+240 XP</p>
        </div>
      </motion.div>

      {/* Floating trophy */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 6 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute -right-4 top-1/3 flex items-center gap-2 rounded-2xl bg-surface-lowest px-4 py-3 shadow-hover"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-container">
          <Trophy className="h-5 w-5 text-accent" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Thành tích</p>
          <p className="text-sm font-bold leading-none">JLPT N4 sẵn sàng</p>
        </div>
      </motion.div>

      {/* Floating voice AI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute -bottom-6 -right-2 flex items-center gap-3 rounded-2xl bg-surface-lowest px-4 py-3 shadow-hover"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-fluency">
          <Play className="h-4 w-4 fill-current text-white" />
          <span className="absolute inset-0 rounded-full animate-pulse-ring" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">AI Tutor</p>
          <p className="text-sm font-bold leading-none">Đang lắng nghe...</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
