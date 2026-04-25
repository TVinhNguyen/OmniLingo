"use client"

import type { ComponentType } from "react"
import { motion } from "motion/react"
import {
  Trophy,
  Lock,
  Flame,
  Star,
  Target,
  BookOpen,
  Zap,
  Clock,
  Globe2,
  Award,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ServerAchievement = {
  id?: string
  code: string
  title: string
  description: string
  icon: string
  rarity: string
  earnedAt: string | null
  xpReward: number
}

type ViewAchievement = {
  key: string
  Icon: ComponentType<{ className?: string }>
  name: string
  description: string
  unlocked: boolean
  earnedAt: string | null
  xpReward: number | null
  rarityKey: "Common" | "Rare" | "Epic" | "Legendary"
}

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  flame: Flame,
  star: Star,
  target: Target,
  book: BookOpen,
  bookopen: BookOpen,
  zap: Zap,
  clock: Clock,
  globe: Globe2,
  globe2: Globe2,
  trophy: Trophy,
  award: Award,
}

function pickIcon(name: string): ComponentType<{ className?: string }> {
  const k = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  return ICON_MAP[k] ?? Award
}

function normalizeRarity(r: string): ViewAchievement["rarityKey"] {
  const k = (r || "").toLowerCase()
  if (k.startsWith("leg")) return "Legendary"
  if (k.startsWith("epi")) return "Epic"
  if (k.startsWith("rar")) return "Rare"
  return "Common"
}

const MOCK: ViewAchievement[] = [
  { key: "m-hot",     Icon: Flame,    name: "Hot streak",       description: "Maintain a 30-day streak",         unlocked: true,  earnedAt: null, xpReward: null, rarityKey: "Rare" },
  { key: "m-uns",     Icon: Flame,    name: "Unstoppable",      description: "Maintain a 100-day streak",        unlocked: true,  earnedAt: null, xpReward: null, rarityKey: "Epic" },
  { key: "m-mar",     Icon: Flame,    name: "Marathon runner",  description: "Maintain a 365-day streak",        unlocked: false, earnedAt: null, xpReward: null, rarityKey: "Legendary" },
  { key: "m-word",    Icon: BookOpen, name: "Word collector",   description: "Learn 500 new words",              unlocked: true,  earnedAt: null, xpReward: null, rarityKey: "Rare" },
  { key: "m-dict",    Icon: BookOpen, name: "Dictionary runner",description: "Learn 2,500 new words",            unlocked: false, earnedAt: null, xpReward: null, rarityKey: "Epic" },
  { key: "m-perf",    Icon: Star,     name: "Perfect week",     description: "Complete all daily goals for 7 days", unlocked: true, earnedAt: null, xpReward: null, rarityKey: "Rare" },
  { key: "m-sharp",   Icon: Target,   name: "Sharp shooter",    description: "Get 20 answers correct in a row",  unlocked: false, earnedAt: null, xpReward: null, rarityKey: "Rare" },
  { key: "m-poly",    Icon: Globe2,   name: "Polyglot",         description: "Study 3 languages simultaneously", unlocked: true,  earnedAt: null, xpReward: null, rarityKey: "Epic" },
  { key: "m-speed",   Icon: Zap,      name: "Speed demon",      description: "Complete 10 lessons in one day",   unlocked: false, earnedAt: null, xpReward: null, rarityKey: "Rare" },
  { key: "m-night",   Icon: Clock,    name: "Night owl",        description: "Study after 11 pm for 5 days",     unlocked: true,  earnedAt: null, xpReward: null, rarityKey: "Common" },
  { key: "m-podium",  Icon: Trophy,   name: "Podium finish",    description: "Finish top 3 in the weekly leaderboard", unlocked: false, earnedAt: null, xpReward: null, rarityKey: "Epic" },
]

const rarityStyle: Record<ViewAchievement["rarityKey"], string> = {
  Common: "bg-muted text-muted-foreground",
  Rare: "bg-primary/15 text-primary",
  Epic: "bg-warning/15 text-warning",
  Legendary: "bg-destructive/15 text-destructive",
}

function fmtDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function AchievementsClient({
  serverAchievements,
}: {
  serverAchievements?: ServerAchievement[]
}) {
  const items: ViewAchievement[] =
    serverAchievements && serverAchievements.length > 0
      ? serverAchievements.map((a) => ({
          key: a.id ?? a.code,
          Icon: pickIcon(a.icon),
          name: a.title,
          description: a.description,
          unlocked: a.earnedAt != null,
          earnedAt: a.earnedAt,
          xpReward: a.xpReward,
          rarityKey: normalizeRarity(a.rarity),
        }))
      : MOCK

  const unlockedItems = items.filter((a) => a.unlocked)
  const lockedItems = items.filter((a) => !a.unlocked)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 rounded-full">
          <Trophy className="mr-1 size-3" />
          Achievements
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Hall of fame</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ve unlocked {unlockedItems.length} of {items.length} achievements. Keep going!
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="locked">In progress</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-8">
          {unlockedItems.length > 0 && (
            <div>
              <h2 className="mb-3 font-serif text-lg font-semibold tracking-tight">Đã mở khoá</h2>
              <Grid items={unlockedItems} />
            </div>
          )}
          {lockedItems.length > 0 && (
            <div>
              <h2 className="mb-3 font-serif text-lg font-semibold tracking-tight">Đang theo đuổi</h2>
              <Grid items={lockedItems} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="unlocked" className="mt-6">
          <Grid items={unlockedItems} />
        </TabsContent>
        <TabsContent value="locked" className="mt-6">
          <Grid items={lockedItems} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Grid({ items }: { items: ViewAchievement[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a, i) => (
        <motion.div
          key={a.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <Card
            className={cn(
              "relative overflow-hidden border-border/60 bg-card/80 p-5 transition hover:-translate-y-1 hover:shadow-soft",
              !a.unlocked && "opacity-90 grayscale",
            )}
          >
            <div className="mb-3 flex items-start justify-between">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-2xl",
                  a.unlocked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {a.unlocked ? <a.Icon className="size-5" /> : <Lock className="size-5" />}
              </div>
              <Badge className={cn("rounded-full text-xs", rarityStyle[a.rarityKey])} variant="outline">
                {a.rarityKey}
              </Badge>
            </div>

            <h3 className="font-serif text-lg font-semibold">{a.name}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{a.description}</p>

            {a.unlocked ? (
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wide text-success">
                  Unlocked{fmtDate(a.earnedAt) ? ` · ${fmtDate(a.earnedAt)}` : ""}
                </span>
                {a.xpReward != null && a.xpReward > 0 && (
                  <span className="font-semibold text-primary">+{a.xpReward} XP</span>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Đang theo đuổi…</div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
