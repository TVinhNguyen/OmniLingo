"use client"

import { motion } from "motion/react"
import { Trophy, Lock, Flame, Star, Target, BookOpen, Zap, Clock, Globe2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type Achievement = {
  icon: any
  name: string
  description: string
  progress: number
  total: number
  unlocked: boolean
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
}

const achievements: Achievement[] = [
  { icon: Flame, name: "Hot streak", description: "Maintain a 30-day streak", progress: 30, total: 30, unlocked: true, rarity: "Rare" },
  { icon: Flame, name: "Unstoppable", description: "Maintain a 100-day streak", progress: 100, total: 100, unlocked: true, rarity: "Epic" },
  { icon: Flame, name: "Marathon runner", description: "Maintain a 365-day streak", progress: 127, total: 365, unlocked: false, rarity: "Legendary" },
  { icon: BookOpen, name: "Word collector", description: "Learn 500 new words", progress: 500, total: 500, unlocked: true, rarity: "Rare" },
  { icon: BookOpen, name: "Dictionary runner", description: "Learn 2,500 new words", progress: 1280, total: 2500, unlocked: false, rarity: "Epic" },
  { icon: Star, name: "Perfect week", description: "Complete all daily goals for 7 days", progress: 7, total: 7, unlocked: true, rarity: "Rare" },
  { icon: Target, name: "Sharp shooter", description: "Get 20 answers correct in a row", progress: 14, total: 20, unlocked: false, rarity: "Rare" },
  { icon: Globe2, name: "OmniLingo", description: "Study 3 languages simultaneously", progress: 3, total: 3, unlocked: true, rarity: "Epic" },
  { icon: Zap, name: "Speed demon", description: "Complete 10 lessons in one day", progress: 6, total: 10, unlocked: false, rarity: "Rare" },
  { icon: Clock, name: "Night owl", description: "Study after 11 pm for 5 days", progress: 5, total: 5, unlocked: true, rarity: "Common" },
  { icon: Trophy, name: "Podium finish", description: "Finish top 3 in the weekly leaderboard", progress: 0, total: 1, unlocked: false, rarity: "Epic" },
  { icon: Star, name: "Socialite", description: "Get 100 likes on community posts", progress: 54, total: 100, unlocked: false, rarity: "Rare" },
]

const rarityStyle: Record<string, string> = {
  Common: "bg-muted text-muted-foreground",
  Rare: "bg-primary/15 text-primary",
  Epic: "bg-warning/15 text-warning",
  Legendary: "bg-destructive/15 text-destructive",
}

export default function AchievementsPage() {
  const unlocked = achievements.filter((a) => a.unlocked).length

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2 rounded-full">
          <Trophy className="mr-1 size-3" />
          Achievements
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Hall of fame</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ve unlocked {unlocked} of {achievements.length} achievements. Keep going!
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="locked">In progress</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Grid items={achievements} />
        </TabsContent>
        <TabsContent value="unlocked" className="mt-6">
          <Grid items={achievements.filter((a) => a.unlocked)} />
        </TabsContent>
        <TabsContent value="locked" className="mt-6">
          <Grid items={achievements.filter((a) => !a.unlocked)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Grid({ items }: { items: Achievement[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a, i) => (
        <motion.div
          key={a.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <Card
            className={cn(
              "relative overflow-hidden border-border/60 bg-card/80 p-5 transition hover:-translate-y-1 hover:shadow-soft",
              !a.unlocked && "opacity-90",
            )}
          >
            <div className="mb-3 flex items-start justify-between">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-2xl",
                  a.unlocked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {a.unlocked ? <a.icon className="size-5" /> : <Lock className="size-5" />}
              </div>
              <Badge className={cn("rounded-full text-xs", rarityStyle[a.rarity])} variant="outline">
                {a.rarity}
              </Badge>
            </div>

            <h3 className="font-serif text-lg font-semibold">{a.name}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{a.description}</p>

            {a.unlocked ? (
              <div className="text-xs font-semibold uppercase tracking-wide text-success">
                Unlocked
              </div>
            ) : (
              <div>
                <Progress value={(a.progress / a.total) * 100} className="mb-1.5 h-1.5" />
                <div className="text-xs text-muted-foreground">
                  {a.progress} / {a.total}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
