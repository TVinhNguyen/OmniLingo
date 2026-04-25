"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { MapPin, Pencil, Flame, Trophy, Star, BookOpen, Globe2, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FlagIcon } from "@/components/flag-icon"
import { Progress } from "@/components/ui/progress"
import type { User, LearningTrack, UserStreak } from "@/lib/api/types"


const languages = [
  { name: "Spanish", flag: "es", level: "B1", progress: 62 },
  { name: "Japanese", flag: "jp", level: "A2", progress: 34 },
  { name: "French", flag: "fr", level: "A1", progress: 12 },
]

const badges = [
  { name: "100-day streak", rarity: "Epic", date: "Jan 2026" },
  { name: "First 1,000 XP", rarity: "Common", date: "Dec 2025" },
  { name: "Perfect week", rarity: "Rare", date: "Nov 2025" },
  { name: "Polyglot", rarity: "Epic", date: "Oct 2025" },
  { name: "Night owl", rarity: "Rare", date: "Sep 2025" },
  { name: "Early bird", rarity: "Rare", date: "Aug 2025" },
]

export function ProfileClient({
  user,
  tracks,
  streak,
}: {
  user: User
  tracks: LearningTrack[]
  streak?: UserStreak
}) {
  const initials = user.username?.slice(0, 2).toUpperCase() ?? "U"
  // Map BFF tracks → language display format
  const langMap: Record<string, { name: string; flag: string }> = {
    ja: { name: "Japanese", flag: "jp" },
    en: { name: "English", flag: "gb" },
    zh: { name: "Chinese", flag: "cn" },
    ko: { name: "Korean", flag: "kr" },
    fr: { name: "French", flag: "fr" },
    es: { name: "Spanish", flag: "es" },
    de: { name: "German", flag: "de" },
  }
  const realLanguages = tracks.length
    ? tracks.map((t) => ({
        name: langMap[t.language]?.name ?? t.language.toUpperCase(),
        flag: langMap[t.language]?.flag ?? t.language,
        level: t.level,
        progress: Math.round(t.progressPct),
      }))
    : languages

  return (
    <div className="mx-auto max-w-5xl">
      {/* Profile header */}
      <Card className="mb-6 overflow-hidden border-border/60 bg-card/80">
        <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/10 to-accent" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="size-24 ring-4 ring-card">
                <AvatarFallback className="bg-primary text-2xl font-serif text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <h1 className="font-serif text-2xl font-semibold tracking-tight">{user.username}</h1>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  Hanoi, Vietnam
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    <Flame className="mr-1 size-3 text-destructive" />
                    {streak?.current ?? 0}-day streak
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    Premium member
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" className="rounded-full bg-transparent">
              <Pencil className="mr-2 size-4" />
              Edit profile
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/writing-center">
                <PenLine className="mr-2 size-4" />
                Writing Center
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground">
            {user.bio ?? "OmniLingo learner — nền tảng học ngoại ngữ tốt nhất."}
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Trophy} label="Total XP" value={streak ? streak.totalXp.toLocaleString() : "—"} color="text-warning" />
        <StatCard icon={Flame} label="Longest streak" value={streak ? `${streak.longest} days` : "—"} color="text-destructive" />
        <StatCard icon={Star} label="Level" value={streak ? `Lv.${streak.level}` : "—"} color="text-primary" />
        <StatCard icon={BookOpen} label="Lessons" value="—" color="text-success" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="languages">
        <TabsList>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="languages" className="mt-6 space-y-3">
          {realLanguages.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/60 bg-card/80 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-accent">
                      <FlagIcon code={l.flag} className="size-6" />
                    </div>
                    <div>
                      <div className="font-serif text-lg font-semibold">{l.name}</div>
                      <div className="text-xs text-muted-foreground">CEFR level: {l.level}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {l.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={l.progress} className="h-2 flex-1" />
                  <span className="text-sm text-muted-foreground">{l.progress}%</span>
                </div>
              </Card>
            </motion.div>
          ))}
          <Card className="flex items-center justify-center border-2 border-dashed border-border bg-transparent p-6 text-center">
            <div>
              <Globe2 className="mx-auto mb-2 size-6 text-primary" />
              <p className="text-sm font-medium">Add another language</p>
              <p className="text-xs text-muted-foreground">Expand your polyglot journey</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {badges.map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border-border/60 bg-card/80 p-5 text-center transition hover:-translate-y-1 hover:shadow-soft">
                  <div
                    className={`mx-auto mb-3 flex size-16 items-center justify-center rounded-full ${
                      b.rarity === "Epic"
                        ? "bg-gradient-to-br from-primary/30 to-primary/10"
                        : b.rarity === "Rare"
                        ? "bg-gradient-to-br from-success/30 to-success/10"
                        : "bg-accent"
                    }`}
                  >
                    <Trophy className="size-7 text-primary" />
                  </div>
                  <div className="font-semibold">{b.name}</div>
                  <Badge variant="outline" className="mt-2 rounded-full text-xs">
                    {b.rarity}
                  </Badge>
                  <div className="mt-1 text-xs text-muted-foreground">{b.date}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card className="border-border/60 bg-card/80 p-6">
            <div className="space-y-5">
              {[
                { time: "2h ago", text: "Completed lesson: Past perfect in context (Spanish B1)" },
                { time: "Yesterday", text: "Earned the Night owl badge for studying after 11pm" },
                { time: "3 days ago", text: "Added 24 new vocabulary words to review" },
                { time: "1 week ago", text: "Booked a trial lesson with Carlos M." },
              ].map((a, i) => (
                <div key={i} className="flex gap-4 border-l-2 border-primary/40 pl-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {a.time}
                    </div>
                    <div className="text-sm text-foreground">{a.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: string
  color: string
}) {
  return (
    <Card className="border-border/60 bg-card/80 p-4">
      <Icon className={`mb-2 size-5 ${color}`} />
      <div className="font-serif text-xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  )
}
