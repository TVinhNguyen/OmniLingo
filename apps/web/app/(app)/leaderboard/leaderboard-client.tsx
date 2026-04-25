"use client"

import { motion } from "motion/react"
import { Trophy, Medal, Flame, Crown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FlagIcon } from "@/components/flag-icon"
import { cn } from "@/lib/utils"

const users = [
  { name: "Aya Suzuki", xp: 12450, flag: "jp", streak: 365 },
  { name: "Marco Rossi", xp: 11280, flag: "it", streak: 187 },
  { name: "Linh Nguyen", xp: 10920, flag: "vn", streak: 127 },
  { name: "Chen Li", xp: 9840, flag: "cn", streak: 99 },
  { name: "Sarah Kim", xp: 8720, flag: "kr", streak: 64 },
  { name: "Luis García", xp: 8100, flag: "mx", streak: 42 },
  { name: "You", xp: 7980, flag: "vn", streak: 127, you: true },
  { name: "Jean Dupont", xp: 7540, flag: "fr", streak: 51 },
  { name: "Emma Schmidt", xp: 6890, flag: "de", streak: 38 },
  { name: "Raj Patel", xp: 6320, flag: "in", streak: 71 },
]

export default function LeaderboardClient({
  serverLeaderboard,
}: {
  serverLeaderboard?: { league: string; myRank: number; myXp: number; entries: Array<{ rank: number; userId: string; displayName: string; avatarUrl: string | null; xp: number; isCurrentUser: boolean }> }
}) {
  const podium = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-2 rounded-full">
          <Trophy className="mr-1 size-3" />
          Leaderboard
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Ruby League
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Top 10 move up · Bottom 5 move down · Resets Sunday 11:59 pm
        </p>
      </div>

      <Tabs defaultValue="league">
        <TabsList className="mx-auto">
          <TabsTrigger value="league">Your league</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
        </TabsList>

        <TabsContent value="league" className="mt-8">
          {/* Podium */}
          <div className="mb-8 flex items-end justify-center gap-4">
            {/* Silver */}
            <Podium user={podium[1]} rank={2} height="h-32" color="from-muted-foreground/20 to-transparent" crownColor="text-muted-foreground" />
            {/* Gold */}
            <Podium user={podium[0]} rank={1} height="h-40" color="from-warning/30 to-transparent" crownColor="text-warning" large />
            {/* Bronze */}
            <Podium user={podium[2]} rank={3} height="h-28" color="from-destructive/20 to-transparent" crownColor="text-destructive/70" />
          </div>

          {/* Remaining ranks */}
          <Card className="border-border/60 bg-card/80 p-4">
            {rest.map((u, i) => {
              const rank = i + 4
              return (
                <motion.div
                  key={u.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "flex items-center gap-4 rounded-xl p-3 transition",
                    u.you && "bg-primary/10 ring-1 ring-primary/30",
                  )}
                >
                  <span className="w-8 text-center font-serif text-lg font-bold text-muted-foreground">
                    {rank}
                  </span>
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-accent">{u.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      {u.name}
                      <FlagIcon code={u.flag} className="size-3.5" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="size-3 text-destructive" />
                      {u.streak}-day streak
                    </div>
                  </div>
                  <span className="font-serif text-lg font-semibold text-primary">
                    {u.xp.toLocaleString()}
                  </span>
                </motion.div>
              )
            })}
          </Card>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 p-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Promotion zone </span>
              <span className="font-semibold">Top 10</span>
              <span className="text-muted-foreground"> moves up to Diamond League</span>
            </div>
            <Medal className="size-5 text-warning" />
          </div>
        </TabsContent>

        <TabsContent value="friends" className="mt-8">
          <Card className="border-border/60 bg-card/80 p-12 text-center">
            <p className="text-muted-foreground">Add friends to compete privately.</p>
          </Card>
        </TabsContent>

        <TabsContent value="country" className="mt-8">
          <Card className="border-border/60 bg-card/80 p-12 text-center">
            <p className="text-muted-foreground">Coming soon — rank against learners from your country.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Podium({
  user,
  rank,
  height,
  color,
  crownColor,
  large,
}: {
  user: { name: string; xp: number; flag: string; streak: number }
  rank: number
  height: string
  color: string
  crownColor: string
  large?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      {rank === 1 && <Crown className={`mb-2 size-6 ${crownColor}`} />}
      <Avatar className={cn("mb-2 ring-4 ring-card", large ? "size-20" : "size-16")}>
        <AvatarFallback className="bg-primary/15 font-serif text-xl text-primary">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-sm font-semibold">
          {user.name}
          <FlagIcon code={user.flag} className="size-3" />
        </div>
        <div className="font-serif text-lg font-bold text-primary">{user.xp.toLocaleString()}</div>
      </div>
      <div
        className={cn(
          "mt-3 flex w-24 items-start justify-center rounded-t-2xl bg-gradient-to-t pt-3 text-2xl font-bold",
          color,
          height,
        )}
      >
        <span className="font-serif">{rank}</span>
      </div>
    </motion.div>
  )
}
