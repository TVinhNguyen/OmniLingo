"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Trophy,
  Flame,
  Users,
  Gem,
  Award,
  Target,
  Clock,
  ArrowRight,
  X,
  CheckCircle2,
  Sparkles,
  Crown,
  Medal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Challenge = {
  id: number
  title: string
  description: string
  duration: string
  participants: number
  joined: boolean
  progress: number
  days: number
  daysTotal: number
  rewards: { xp: number; gems: number; badge: string }
  status: "active" | "upcoming" | "completed" | "my"
  color: string
  icon: typeof Flame
  featured?: boolean
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "30-Day Streak Challenge",
    description: "Học liên tục 30 ngày không bỏ ngày nào để nhận badge Hall of Fame",
    duration: "30 ngày",
    participants: 12547,
    joined: true,
    progress: 40,
    days: 12,
    daysTotal: 30,
    rewards: { xp: 3000, gems: 500, badge: "Hall of Fame" },
    status: "active",
    color: "from-primary to-accent",
    icon: Flame,
    featured: true,
  },
  {
    id: 2,
    title: "Vocab Master",
    description: "Học 200 từ mới trong 14 ngày",
    duration: "14 ngày",
    participants: 4320,
    joined: false,
    progress: 0,
    days: 0,
    daysTotal: 14,
    rewards: { xp: 1500, gems: 250, badge: "Vocab Wizard" },
    status: "active",
    color: "from-accent to-primary",
    icon: Target,
  },
  {
    id: 3,
    title: "Speaking Confidence",
    description: "Hoàn thành 20 bài speaking trong 10 ngày",
    duration: "10 ngày",
    participants: 2180,
    joined: true,
    progress: 65,
    days: 13,
    daysTotal: 20,
    rewards: { xp: 2000, gems: 300, badge: "Eloquent" },
    status: "active",
    color: "from-success to-primary",
    icon: Sparkles,
  },
  {
    id: 4,
    title: "Grammar Guru",
    description: "Pass 50 grammar quizzes với độ chính xác 90%",
    duration: "21 ngày",
    participants: 3876,
    joined: false,
    progress: 0,
    days: 0,
    daysTotal: 21,
    rewards: { xp: 2500, gems: 400, badge: "Grammar Master" },
    status: "active",
    color: "from-warning to-accent",
    icon: Award,
  },
  {
    id: 5,
    title: "Polyglot Starter",
    description: "Học 3 ngôn ngữ cùng lúc trong 1 tuần",
    duration: "7 ngày",
    participants: 890,
    joined: false,
    progress: 0,
    days: 0,
    daysTotal: 7,
    rewards: { xp: 1200, gems: 200, badge: "Polyglot" },
    status: "upcoming",
    color: "from-primary to-success",
    icon: Crown,
  },
  {
    id: 6,
    title: "Listening Marathon",
    description: "Nghe 10 giờ audio trong 15 ngày",
    duration: "15 ngày",
    participants: 1540,
    joined: false,
    progress: 0,
    days: 0,
    daysTotal: 15,
    rewards: { xp: 1800, gems: 300, badge: "Sharp Ear" },
    status: "upcoming",
    color: "from-accent to-warning",
    icon: Medal,
  },
  {
    id: 7,
    title: "Quick Learner",
    description: "Hoàn thành 100 lessons trong 30 ngày - Đã hoàn thành!",
    duration: "30 ngày",
    participants: 5670,
    joined: true,
    progress: 100,
    days: 30,
    daysTotal: 30,
    rewards: { xp: 3500, gems: 600, badge: "Speed Demon" },
    status: "completed",
    color: "from-success to-accent",
    icon: Trophy,
  },
]

const tabs = [
  { id: "active", label: "Đang diễn ra" },
  { id: "upcoming", label: "Sắp tới" },
  { id: "completed", label: "Đã hoàn thành" },
  { id: "my", label: "Của tôi" },
]

const leaderboard = [
  { rank: 1, name: "Emma Wilson", avatar: "EW", score: 2840 },
  { rank: 2, name: "Kenji Tanaka", avatar: "KT", score: 2650 },
  { rank: 3, name: "You", avatar: "YO", score: 2410, isYou: true },
  { rank: 4, name: "Sophie Dubois", avatar: "SD", score: 2390 },
  { rank: 5, name: "Carlos Mendez", avatar: "CM", score: 2210 },
]

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const filtered = challenges.filter((c) => {
    if (activeTab === "my") return c.joined
    return c.status === activeTab
  })

  const featured = challenges.find((c) => c.featured)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5">
            <Trophy className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="font-sans text-3xl font-bold text-balance lg:text-4xl">
              Thử thách cộng đồng
            </h1>
            <p className="mt-1 text-muted-foreground">
              Tham gia challenges, học cùng hàng ngàn người, nhận thưởng đặc biệt
            </p>
          </div>
        </div>
      </motion.div>

      {/* Featured challenge */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br ${featured.color} p-8 text-white shadow-hover`}
        >
          <div className="absolute -top-16 -right-16 opacity-20">
            <featured.icon className="h-56 w-56" />
          </div>
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge className="bg-white/20 backdrop-blur">FEATURED</Badge>
                <Badge className="bg-white/20 backdrop-blur">
                  <Clock className="mr-1 h-3 w-3" />
                  {featured.duration}
                </Badge>
              </div>
              <h2 className="font-sans text-3xl font-bold lg:text-4xl">{featured.title}</h2>
              <p className="mt-2 max-w-xl text-white/90">{featured.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {featured.participants.toLocaleString()} người tham gia
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  {featured.rewards.xp} XP + {featured.rewards.gems} gems
                </div>
              </div>
              {featured.joined && (
                <div className="mt-5 max-w-md">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>
                      Ngày {featured.days}/{featured.daysTotal}
                    </span>
                    <span>{featured.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${featured.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
            <Button
              size="lg"
              onClick={() => setSelectedChallenge(featured)}
              className="rounded-xl bg-white font-semibold text-primary hover:bg-white/90"
            >
              {featured.joined ? "Tiếp tục" : "Tham gia ngay"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-surface-lowest p-1.5 shadow-ambient">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === t.id
                ? "bg-primary text-primary-foreground shadow-ambient"
                : "text-muted-foreground hover:bg-surface-low"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedChallenge(c)}
            className="group cursor-pointer overflow-hidden rounded-3xl bg-surface-lowest shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
          >
            <div
              className={`relative h-32 bg-gradient-to-br ${c.color} p-5 text-white`}
            >
              <div className="absolute -top-4 -right-4 opacity-20">
                <c.icon className="h-24 w-24" />
              </div>
              <Badge className="bg-white/20 backdrop-blur">
                <Clock className="mr-1 h-3 w-3" />
                {c.duration}
              </Badge>
              {c.status === "completed" && (
                <Badge className="absolute top-5 right-5 bg-white text-success">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Hoàn thành
                </Badge>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold text-pretty leading-snug">{c.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {c.participants.toLocaleString()}
                </span>
              </div>
              {c.joined && c.status !== "completed" && (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="font-semibold text-primary">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-low">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-primary">
                    <Sparkles className="h-3 w-3" />+{c.rewards.xp}
                  </span>
                  <span className="flex items-center gap-1 text-accent">
                    <Gem className="h-3 w-3" />+{c.rewards.gems}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-lg text-primary hover:bg-primary/10"
                >
                  {c.joined ? (c.status === "completed" ? "Xem" : "Tiếp tục") : "Tham gia"}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedChallenge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedChallenge(null)}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-surface-lowest shadow-hover"
            >
              <div
                className={`sticky top-0 bg-gradient-to-br ${selectedChallenge.color} p-6 text-white`}
              >
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-lg bg-white/20 backdrop-blur"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="bg-white/20 backdrop-blur">{selectedChallenge.duration}</Badge>
                </div>
                <h2 className="text-2xl font-bold">{selectedChallenge.title}</h2>
                <p className="mt-2 text-white/90">{selectedChallenge.description}</p>
              </div>
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Quy tắc
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Hoàn thành ít nhất 1 lesson mỗi ngày",
                      "Không bỏ ngày nào (trừ Streak Freeze)",
                      "Hoàn thành ít nhất 50 XP mỗi ngày",
                      "Tất cả tiến độ được tính từ 00:00 giờ địa phương",
                    ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Leaderboard Top 5
                  </h3>
                  <div className="space-y-2">
                    {leaderboard.map((p) => (
                      <div
                        key={p.rank}
                        className={`flex items-center gap-3 rounded-xl p-3 ${
                          p.isYou ? "bg-primary/10" : "bg-surface-low"
                        }`}
                      >
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-lg font-bold text-sm ${
                            p.rank === 1
                              ? "bg-warning text-white"
                              : p.rank === 2
                                ? "bg-muted-foreground text-white"
                                : p.rank === 3
                                  ? "bg-accent text-white"
                                  : "bg-surface-lowest"
                          }`}
                        >
                          {p.rank}
                        </div>
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                          {p.avatar}
                        </div>
                        <span className={`flex-1 text-sm ${p.isYou ? "font-semibold" : ""}`}>
                          {p.name}
                        </span>
                        <span className="text-sm font-medium tabular-nums">{p.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Phần thưởng
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-primary/5 p-4 text-center">
                      <Sparkles className="mx-auto h-6 w-6 text-primary" />
                      <div className="mt-2 text-xl font-bold">
                        +{selectedChallenge.rewards.xp}
                      </div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                    <div className="rounded-2xl bg-accent/5 p-4 text-center">
                      <Gem className="mx-auto h-6 w-6 text-accent" />
                      <div className="mt-2 text-xl font-bold">
                        +{selectedChallenge.rewards.gems}
                      </div>
                      <div className="text-xs text-muted-foreground">Gems</div>
                    </div>
                    <div className="rounded-2xl bg-warning/5 p-4 text-center">
                      <Award className="mx-auto h-6 w-6 text-warning" />
                      <div className="mt-2 text-sm font-semibold">
                        {selectedChallenge.rewards.badge}
                      </div>
                      <div className="text-xs text-muted-foreground">Badge</div>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full rounded-xl bg-primary shadow-hover"
                >
                  {selectedChallenge.joined ? "Tiếp tục challenge" : "Tham gia challenge"}
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
