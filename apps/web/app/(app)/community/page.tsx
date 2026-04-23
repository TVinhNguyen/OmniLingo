"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Users2, Trophy, Calendar, MessageCircle, Heart, Share2, Plus, TrendingUp, Flame, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FlagIcon } from "@/components/flag-icon"

const posts = [
  {
    author: "Linh Nguyen",
    handle: "@linh_learns",
    flag: "vn",
    time: "2h",
    content:
      "Just hit 365-day streak! 🔥 Never thought I'd stick with learning Spanish for a full year. Consistency really is the key.",
    likes: 142,
    comments: 28,
    tag: "Streak milestone",
  },
  {
    author: "Marco Rossi",
    handle: "@marco_it",
    flag: "it",
    time: "5h",
    content:
      "Does anyone have tips for the IELTS Writing Task 2? I keep getting stuck on the conclusion paragraph. Feeling frustrated after my last mock test.",
    likes: 34,
    comments: 17,
    tag: "Ask the community",
  },
  {
    author: "Aya Suzuki",
    handle: "@aya_japan",
    flag: "jp",
    time: "1d",
    content:
      "Sharing my notebook for JLPT N3 grammar — 50 patterns with example sentences. Feel free to remix and share back!",
    likes: 256,
    comments: 41,
    tag: "Shared resource",
  },
]

const events = [
  {
    title: "English conversation circle",
    time: "Fri · 7pm GMT",
    attendees: 42,
    language: "English",
    type: "Live",
  },
  {
    title: "Japanese anime night",
    time: "Sat · 9pm JST",
    attendees: 68,
    language: "Japanese",
    type: "Watch party",
  },
  {
    title: "Spanish music trivia",
    time: "Sun · 3pm CET",
    attendees: 31,
    language: "Spanish",
    type: "Quiz",
  },
]

const leaderboard = [
  { name: "Linh N.", xp: 12450, flag: "vn", streak: 365 },
  { name: "Marco R.", xp: 11280, flag: "it", streak: 187 },
  { name: "Aya S.", xp: 10920, flag: "jp", streak: 212 },
  { name: "Chen L.", xp: 9840, flag: "cn", streak: 99 },
  { name: "You", xp: 8320, flag: "vn", streak: 127, you: true },
]

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Badge variant="secondary" className="mb-2 rounded-full">
            <Users2 className="mr-1 size-3" />
            Community
          </Badge>
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Meet your language tribe
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share progress, ask questions, and practice with learners around the world.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="rounded-full bg-transparent">
            <Link href="/challenges">
              <Flame className="mr-1.5 size-4" />
              Thử thách
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full bg-transparent">
            <Link href="/language-exchange">
              <Globe className="mr-1.5 size-4" />
              Trao đổi
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/community/new">
              <Plus className="mr-1.5 size-4" />
              Tạo bài viết
            </Link>
          </Button>
        </div>
      </div>

      {/* Trending tags quick row */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["JLPT2026", "IELTSwriting", "SpanishSlang", "FrenchMusic", "pronunciation", "streak"].map((t) => (
          <Link
            key={t}
            href={`/community/tag/${t}`}
            className="rounded-full bg-surface-lowest px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-ambient transition-colors hover:bg-primary/10 hover:text-primary"
          >
            #{t}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Feed */}
        <div>
          <Tabs defaultValue="for-you">
            <TabsList>
              <TabsTrigger value="for-you">For you</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            <TabsContent value="for-you" className="mt-6 space-y-4">
              {posts.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-border/60 bg-card/80 p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-primary/15 text-primary">
                            {p.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{p.author}</span>
                            <FlagIcon code={p.flag} className="size-3.5" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {p.handle} · {p.time}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {p.tag}
                      </Badge>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-foreground">{p.content}</p>
                    <div className="flex items-center gap-5 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1.5 hover:text-destructive">
                        <Heart className="size-4" />
                        {p.likes}
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-primary">
                        <MessageCircle className="size-4" />
                        {p.comments}
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-foreground">
                        <Share2 className="size-4" />
                        Share
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="following" className="mt-6">
              <Card className="border-border/60 bg-card/80 p-12 text-center">
                <p className="text-muted-foreground">
                  You aren&apos;t following anyone yet. Browse the feed to find kindred spirits!
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="trending" className="mt-6 space-y-4">
              <Card className="border-border/60 bg-card/80 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  <span className="text-sm font-semibold">Trending this week</span>
                </div>
                <div className="space-y-2">
                  {["#JLPT2026", "#IELTSwriting", "#SpanishSlang", "#FrenchMusic"].map((t) => (
                    <button
                      key={t}
                      className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-accent"
                    >
                      <span className="font-medium">{t}</span>
                      <span className="text-xs text-muted-foreground">2.1k posts</span>
                    </button>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Leaderboard */}
          <Card className="border-border/60 bg-card/80 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <Trophy className="size-4 text-warning" />
                Weekly leaderboard
              </h3>
              <Badge variant="outline" className="rounded-full text-xs">
                XP
              </Badge>
            </div>
            <div className="space-y-2">
              {leaderboard.map((u, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl p-2 ${
                    u.you ? "bg-primary/10 ring-1 ring-primary/30" : ""
                  }`}
                >
                  <span className="w-5 text-center font-serif text-sm font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-accent text-xs">{u.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      {u.name}
                      <FlagIcon code={u.flag} className="size-3" />
                    </div>
                    <div className="text-xs text-muted-foreground">{u.streak}-day streak</div>
                  </div>
                  <span className="font-serif text-sm font-semibold text-primary">
                    {u.xp.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Events */}
          <Card className="border-border/60 bg-card/80 p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Calendar className="size-4 text-primary" />
              Upcoming events
            </h3>
            <div className="space-y-3">
              {events.map((e) => (
                <div
                  key={e.title}
                  className="rounded-xl border border-border/60 p-3 transition hover:border-primary"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <Badge variant="outline" className="rounded-full text-xs">
                      {e.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{e.attendees} joined</span>
                  </div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.time} · {e.language}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-3 w-full rounded-full bg-transparent">
              View all events
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  )
}
