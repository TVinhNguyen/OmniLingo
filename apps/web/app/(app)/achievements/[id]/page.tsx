"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Flame,
  Trophy,
  Share2,
  Twitter,
  Facebook,
  Copy,
  Download,
  ChevronRight,
  Sparkles,
  Users,
  Calendar,
  Lock,
  Medal,
  Target,
  TrendingUp,
  Star,
  Zap,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const achievementData: Record<
  string,
  {
    name: string
    description: string
    story: string
    unlockedAt: string
    rarity: "Common" | "Rare" | "Epic" | "Legendary"
    category: string
    xpReward: number
    icon: string
    gradient: string
    progress?: { current: number; total: number }
    unlocked: boolean
    stats: { label: string; value: string }[]
    howTo: string[]
    related: {
      id: string
      name: string
      gradient: string
      icon: string
      unlocked: boolean
    }[]
    globalStats: {
      earned: number
      total: number
      rank: string
    }
    yourJourney: { date: string; milestone: string }[]
  }
> = {
  "hot-streak": {
    name: "Hot Streak",
    description: "Duy trì 30 ngày học liên tiếp",
    story:
      "Thói quen tạo nên bậc thầy. Bạn đã chứng minh rằng sự kiên trì là chìa khoá — 30 ngày không bỏ cuộc, không excuse. Đây mới chỉ là khởi đầu hành trình polyglot của bạn.",
    unlockedAt: "23 Tháng 1, 2026",
    rarity: "Rare",
    category: "Streak",
    xpReward: 500,
    icon: "🔥",
    gradient: "from-[#ef8a5b] to-[#f0ba65]",
    unlocked: true,
    stats: [
      { label: "Ngày streak", value: "30" },
      { label: "XP earned", value: "8,420" },
      { label: "Bài đã làm", value: "86" },
      { label: "Giờ học", value: "24h" },
    ],
    howTo: [
      "Hoàn thành ít nhất 1 bài tập mỗi ngày",
      "Dùng streak freeze nếu bỏ lỡ (miễn phí 2 lần/tháng)",
      "Đặt reminder 20:00 để không quên",
    ],
    related: [
      { id: "unstoppable", name: "Unstoppable · 100 ngày", gradient: "from-[#702ae1] to-[#983772]", icon: "⚡", unlocked: true },
      { id: "marathon", name: "Marathon · 365 ngày", gradient: "from-[#983772] to-[#a19ff9]", icon: "🏆", unlocked: false },
      { id: "legendary", name: "Legendary · 1000 ngày", gradient: "from-[#5352a5] to-[#702ae1]", icon: "👑", unlocked: false },
    ],
    globalStats: {
      earned: 184320,
      total: 2400000,
      rank: "Top 7.7%",
    },
    yourJourney: [
      { date: "24 Dec 2025", milestone: "Bắt đầu streak" },
      { date: "30 Dec 2025", milestone: "Đạt 7 ngày — week warrior" },
      { date: "06 Jan 2026", milestone: "Đạt 14 ngày — dedicated" },
      { date: "15 Jan 2026", milestone: "Đạt 21 ngày — habit formed" },
      { date: "23 Jan 2026", milestone: "🔥 30 ngày — Hot Streak unlocked!" },
    ],
  },
}

const rarityStyles = {
  Common: { bg: "bg-muted/40", text: "text-muted-foreground", glow: "" },
  Rare: {
    bg: "bg-primary/10",
    text: "text-primary",
    glow: "shadow-[0_0_40px_rgba(112,42,225,0.35)]",
  },
  Epic: {
    bg: "bg-accent/15",
    text: "text-accent",
    glow: "shadow-[0_0_50px_rgba(152,55,114,0.4)]",
  },
  Legendary: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    glow: "shadow-[0_0_60px_rgba(239,138,91,0.5)]",
  },
}

export default function AchievementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const a = achievementData[id] ?? achievementData["hot-streak"]
  const rarity = rarityStyles[a.rarity]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Breadcrumb */}
      <div
        data-aos="fade-up"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full bg-surface-lowest shadow-ambient"
        >
          <Link href="/achievements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Link href="/achievements" className="hover:text-foreground">
          Thành tích
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-foreground">{a.name}</span>
      </div>

      {/* Hero */}
      <section
        data-aos="fade-up"
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${a.gradient} p-7 text-primary-foreground shadow-hover sm:p-10`}
      >
        {/* Background ornaments */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />

        {/* Confetti dots */}
        {[...Array(18)].map((_, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute h-1.5 w-1.5 rounded-full bg-white/60"
            initial={{
              x: `${(i * 47) % 100}%`,
              y: `${(i * 31) % 100}%`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: `${((i * 31) % 100) - 15}%`,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}

        <div className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
          {/* Medal */}
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 14, stiffness: 180 }}
            className="relative mx-auto lg:mx-0"
          >
            <div
              className={cn(
                "flex h-40 w-40 items-center justify-center rounded-full bg-white/20 backdrop-blur-md sm:h-48 sm:w-48",
                rarity.glow,
              )}
            >
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-white/90 to-white/50 shadow-hover sm:h-36 sm:w-36">
                <span className="text-6xl drop-shadow-md sm:text-7xl">
                  {a.icon}
                </span>
              </div>
            </div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -right-2 -bottom-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-600 shadow-ambient"
            >
              +{a.xpReward.toLocaleString()} XP
            </motion.span>
          </motion.div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Medal className="h-3 w-3" />
                {a.rarity}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                {a.category}
              </span>
              {a.unlocked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700">
                  <Sparkles className="h-3 w-3" />
                  Đã mở khoá
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Lock className="h-3 w-3" />
                  Chưa mở
                </span>
              )}
            </div>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {a.name}
            </h1>
            <p className="mt-2 max-w-xl text-base text-white/90 sm:text-lg">
              {a.description}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/75">
              <Calendar className="h-3 w-3" />
              Mở khoá ngày {a.unlockedAt}
            </p>
          </div>
        </div>
      </section>

      {/* Story + Stats */}
      <section
        data-aos="fade-up"
        className="grid gap-6 lg:grid-cols-[1.3fr_1fr]"
      >
        <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Câu chuyện phía sau
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
            Tại sao bạn xứng đáng
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            {a.story}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {a.stats.map((s, i) => (
              <div
                key={s.label}
                data-aos="fade-up"
                data-aos-delay={i * 40}
                className="rounded-2xl bg-surface-low p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Share card */}
        <div className="rounded-3xl bg-gradient-fluency p-6 text-primary-foreground shadow-hover sm:p-8">
          <Share2 className="h-6 w-6" />
          <h3 className="mt-4 text-xl font-extrabold leading-tight">
            Chia sẻ thành tích với bạn bè
          </h3>
          <p className="mt-1 text-sm text-white/85">
            Khoe thành tích của bạn — tạo động lực cho cả đội.
          </p>

          <div className="mt-5 rounded-2xl bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
                {a.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  Linh vừa mở khoá &quot;{a.name}&quot;
                </p>
                <p className="truncate text-[11px] text-white/80">
                  {a.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <Button className="w-full rounded-full bg-white text-accent shadow-ambient hover:bg-white/90">
              <Twitter className="mr-2 h-4 w-4" /> Chia sẻ Twitter
            </Button>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="ghost"
                className="rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-6 shadow-ambient sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Hành trình của bạn
        </p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
          Dấu mốc dẫn tới thành tích này
        </h2>

        <div className="mt-6 space-y-0">
          {a.yourJourney.map((j, i) => {
            const isLast = i === a.yourJourney.length - 1
            return (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="relative flex gap-5 pb-6 last:pb-0"
              >
                {/* Line */}
                {!isLast && (
                  <div className="absolute top-10 left-5 h-[calc(100%-2.5rem)] w-0.5 bg-gradient-to-b from-primary to-accent/50" />
                )}
                {/* Dot */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      isLast
                        ? "bg-gradient-primary text-primary-foreground shadow-hover"
                        : "bg-surface-low",
                    )}
                  >
                    {isLast ? (
                      <Trophy className="h-5 w-5" />
                    ) : (
                      <Flame
                        className={cn(
                          "h-4 w-4",
                          i === 0 ? "text-amber-500" : "text-muted-foreground",
                        )}
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 pt-1.5">
                  <p
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-wider",
                      isLast ? "text-accent" : "text-muted-foreground",
                    )}
                  >
                    {j.date}
                  </p>
                  <p className="mt-0.5 font-bold">{j.milestone}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How-to + Global */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div
          data-aos="fade-up"
          className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
        >
          <Target className="h-6 w-6 text-accent" />
          <h3 className="mt-3 text-xl font-extrabold">Làm sao để đạt được</h3>
          <ul className="mt-4 space-y-2.5">
            {a.howTo.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl bg-surface-low p-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-extrabold text-primary-foreground shadow-ambient">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm">{h}</p>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-aos="fade-up"
          className="rounded-3xl bg-surface-lowest p-6 shadow-ambient"
        >
          <Users className="h-6 w-6 text-accent" />
          <h3 className="mt-3 text-xl font-extrabold">Thống kê toàn cầu</h3>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-end justify-between">
                <p className="text-sm text-muted-foreground">
                  Số người đã mở khoá
                </p>
                <p className="text-2xl font-extrabold">
                  {a.globalStats.earned.toLocaleString()}
                  <span className="text-sm font-medium text-muted-foreground">
                    {" "}
                    / {a.globalStats.total.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-low">
                <motion.div
                  className="h-full rounded-full bg-gradient-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(a.globalStats.earned / a.globalStats.total) * 100}%`,
                  }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-gradient-primary p-4 text-primary-foreground shadow-ambient">
              <TrendingUp className="h-5 w-5" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                  Rank của bạn
                </p>
                <p className="text-xl font-extrabold">{a.globalStats.rank}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-surface-low p-3">
                <Zap className="h-4 w-4 text-accent" />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  XP thưởng
                </p>
                <p className="text-lg font-extrabold">
                  +{a.xpReward.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl bg-surface-low p-3">
                <Clock className="h-4 w-4 text-accent" />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  TG trung bình
                </p>
                <p className="text-lg font-extrabold">45 ngày</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related achievements */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-6 shadow-ambient sm:p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Thành tích liên quan
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
              Tiếp tục chuỗi này
            </h2>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full bg-surface-low"
          >
            <Link href="/achievements">
              Xem tất cả <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {a.related.map((r, i) => (
            <Link
              key={r.id}
              href={`/achievements/${r.id}`}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className={cn(
                "group relative overflow-hidden rounded-3xl p-6 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover",
                r.unlocked
                  ? `bg-gradient-to-br ${r.gradient} text-primary-foreground`
                  : "bg-surface-low",
              )}
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-ambient",
                  r.unlocked
                    ? "bg-white/20 backdrop-blur"
                    : "bg-surface-lowest grayscale",
                )}
              >
                {r.unlocked ? (
                  r.icon
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <p
                className={cn(
                  "mt-4 font-bold leading-tight",
                  !r.unlocked && "text-muted-foreground",
                )}
              >
                {r.name}
              </p>
              {r.unlocked ? (
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-white/80">
                  <Star className="h-3 w-3 fill-current" />
                  Đã mở khoá
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">Chưa mở</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
