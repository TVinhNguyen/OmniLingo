"use client"

import { motion } from "motion/react"
import { Trophy, Medal, Crown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ServerEntry = {
  rank: number
  userId: string
  displayName: string
  avatarUrl: string | null
  xp: number
  isCurrentUser: boolean
}

type ServerLeaderboard = {
  league: string
  myRank: number
  myXp: number
  entries: ServerEntry[]
}

type ViewEntry = {
  key: string
  rank: number
  name: string
  avatarUrl: string | null
  xp: number
  you: boolean
}

const MOCK_LEADERBOARD: ServerLeaderboard = {
  league: "Ruby",
  myRank: 7,
  myXp: 7980,
  entries: [
    { rank: 1, userId: "u-1", displayName: "Aya Suzuki",   avatarUrl: null, xp: 12450, isCurrentUser: false },
    { rank: 2, userId: "u-2", displayName: "Marco Rossi",  avatarUrl: null, xp: 11280, isCurrentUser: false },
    { rank: 3, userId: "u-3", displayName: "Linh Nguyen",  avatarUrl: null, xp: 10920, isCurrentUser: false },
    { rank: 4, userId: "u-4", displayName: "Chen Li",      avatarUrl: null, xp: 9840,  isCurrentUser: false },
    { rank: 5, userId: "u-5", displayName: "Sarah Kim",    avatarUrl: null, xp: 8720,  isCurrentUser: false },
    { rank: 6, userId: "u-6", displayName: "Luis García",  avatarUrl: null, xp: 8100,  isCurrentUser: false },
    { rank: 7, userId: "u-7", displayName: "You",          avatarUrl: null, xp: 7980,  isCurrentUser: true  },
    { rank: 8, userId: "u-8", displayName: "Jean Dupont",  avatarUrl: null, xp: 7540,  isCurrentUser: false },
    { rank: 9, userId: "u-9", displayName: "Emma Schmidt", avatarUrl: null, xp: 6890,  isCurrentUser: false },
    { rank: 10, userId: "u-10", displayName: "Raj Patel",  avatarUrl: null, xp: 6320,  isCurrentUser: false },
  ],
}

function toView(e: ServerEntry): ViewEntry {
  return {
    key: e.userId || `r-${e.rank}`,
    rank: e.rank,
    name: e.displayName,
    avatarUrl: e.avatarUrl,
    xp: e.xp,
    you: e.isCurrentUser,
  }
}

export default function LeaderboardClient({
  serverLeaderboard,
}: {
  serverLeaderboard?: ServerLeaderboard
}) {
  const data: ServerLeaderboard =
    serverLeaderboard && serverLeaderboard.entries?.length > 0
      ? serverLeaderboard
      : MOCK_LEADERBOARD

  const sorted = [...data.entries].sort((a, b) => a.rank - b.rank).map(toView)
  const top100 = sorted.slice(0, 100)
  const podium = top100.slice(0, 3)
  const rest = top100.slice(3)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-2 rounded-full">
          <Trophy className="mr-1 size-3" />
          Leaderboard
        </Badge>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          {data.league} League
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hạng của bạn: <span className="font-semibold">#{data.myRank}</span> ·{" "}
          <span className="font-semibold">{data.myXp.toLocaleString()} XP</span>
        </p>
      </div>

      <Tabs defaultValue="league">
        <TabsList className="mx-auto">
          <TabsTrigger value="league">Your league</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
        </TabsList>

        <TabsContent value="league" className="mt-8">
          {podium.length === 3 && (
            <div className="mb-8 flex items-end justify-center gap-4">
              <Podium user={podium[1]} height="h-32" color="from-muted-foreground/20 to-transparent" crownColor="text-muted-foreground" />
              <Podium user={podium[0]} height="h-40" color="from-warning/30 to-transparent" crownColor="text-warning" large />
              <Podium user={podium[2]} height="h-28" color="from-destructive/20 to-transparent" crownColor="text-destructive/70" />
            </div>
          )}

          <Card className="border-border/60 bg-card/80 p-4">
            {rest.map((u, i) => (
              <motion.div
                key={u.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={cn(
                  "flex items-center gap-4 rounded-xl p-3 transition",
                  u.you && "bg-primary/10 ring-1 ring-primary/30",
                )}
              >
                <span className="w-8 text-center font-serif text-lg font-bold text-muted-foreground">
                  {u.rank}
                </span>
                <Avatar className="size-10">
                  {u.avatarUrl && <AvatarImage src={u.avatarUrl} alt={u.name} />}
                  <AvatarFallback className="bg-accent">{u.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    {u.name}
                    {u.you && (
                      <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px]">
                        Bạn
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="font-serif text-lg font-semibold text-primary">
                  {u.xp.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </Card>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 p-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Promotion zone </span>
              <span className="font-semibold">Top 10</span>
              <span className="text-muted-foreground"> moves up to next league</span>
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
  height,
  color,
  crownColor,
  large,
}: {
  user: ViewEntry
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
      {user.rank === 1 && <Crown className={`mb-2 size-6 ${crownColor}`} />}
      <Avatar className={cn("mb-2 ring-4 ring-card", large ? "size-20" : "size-16")}>
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
        <AvatarFallback className="bg-primary/15 font-serif text-xl text-primary">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-sm font-semibold">
          {user.name}
          {user.you && (
            <Badge variant="secondary" className="h-4 rounded-full px-1.5 text-[9px]">
              Bạn
            </Badge>
          )}
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
        <span className="font-serif">{user.rank}</span>
      </div>
    </motion.div>
  )
}
