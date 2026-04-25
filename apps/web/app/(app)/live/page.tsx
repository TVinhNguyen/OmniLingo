"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Radio, Calendar, Users, Clock, Globe, Play, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

const LIVE = [
  {
    id: 1,
    status: "live",
    title: "IELTS Speaking Part 2: Describe a place",
    tutor: "Emma Thompson",
    avatar: "/tutor-emma.jpg",
    lang: "Tiếng Anh",
    viewers: 87,
    time: "Đang diễn ra",
  },
  {
    id: 2,
    status: "live",
    title: "Kanji cơ bản: 100 chữ thường dùng",
    tutor: "Kenji Tanaka",
    avatar: "/tutor-kenji.jpg",
    lang: "Tiếng Nhật",
    viewers: 42,
    time: "Đang diễn ra",
  },
]

const UPCOMING = [
  {
    id: 3,
    title: "Business English: Meeting negotiations",
    tutor: "Emma Thompson",
    avatar: "/tutor-emma.jpg",
    lang: "Tiếng Anh",
    date: "Mai, 19:00",
    duration: 60,
    registered: 156,
    tags: ["Business", "B2"],
  },
  {
    id: 4,
    title: "Le subjonctif: Giải thích đơn giản",
    tutor: "Sophie Laurent",
    avatar: "/tutor-sophie.jpg",
    lang: "Tiếng Pháp",
    date: "Thứ 4, 20:00",
    duration: 45,
    registered: 89,
    tags: ["Grammar", "B1"],
  },
  {
    id: 5,
    title: "Conversational Spanish for beginners",
    tutor: "Carlos Ruiz",
    avatar: "/tutor-carlos.jpg",
    lang: "Tiếng Tây Ban Nha",
    date: "Thứ 5, 19:30",
    duration: 60,
    registered: 203,
    tags: ["Speaking", "A2"],
  },
  {
    id: 6,
    title: "HSK 4 Reading practice",
    tutor: "Ming Li",
    avatar: "/tutor-ming.jpg",
    lang: "Tiếng Trung",
    date: "Thứ 6, 20:00",
    duration: 90,
    registered: 67,
    tags: ["HSK", "B1"],
  },
]

export default function LivePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-danger" />
            <span className="text-sm font-semibold uppercase tracking-wide text-danger">
              Live classes
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">Lớp trực tiếp</h1>
          <p className="mt-2 text-muted-foreground">
            Tham gia lớp học trực tiếp miễn phí cùng giáo viên từ khắp thế giới
          </p>
        </div>
        <Button variant="outline">
          <Bell className="mr-2 h-4 w-4" />
          Nhận thông báo
        </Button>
      </div>

      {/* Live now */}
      {LIVE.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
            </span>
            <h2 className="font-serif text-xl font-semibold">Đang phát ({LIVE.length})</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {LIVE.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-surface-lowest shadow-ambient"
              >
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-surface-low">
                  <Badge className="absolute left-4 top-4 gap-1.5 bg-danger text-danger-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    LIVE
                  </Badge>
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    <Users className="h-3 w-3" />
                    {item.viewers}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="h-16 w-16 rounded-full opacity-0 transition group-hover:opacity-100"
                    >
                      <Play className="ml-1 h-7 w-7" />
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <Badge variant="outline" className="mb-2">
                    {item.lang}
                  </Badge>
                  <h3 className="font-serif text-lg font-semibold text-pretty">{item.title}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={item.avatar || "/placeholder.svg"} alt="" />
                        <AvatarFallback>{item.tutor[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{item.tutor}</span>
                    </div>
                    <Button size="sm">Tham gia</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold">Sắp diễn ra</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm lớp..." className="w-64 pl-9" />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="en">Tiếng Anh</TabsTrigger>
            <TabsTrigger value="jp">Tiếng Nhật</TabsTrigger>
            <TabsTrigger value="fr">Tiếng Pháp</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {UPCOMING.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-4 rounded-3xl border border-border bg-surface-lowest p-5 shadow-ambient transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.tags.map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="mt-1.5 line-clamp-1 font-serif text-base font-semibold">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={item.avatar || "/placeholder.svg"} alt="" />
                        <AvatarFallback>{item.tutor[0]}</AvatarFallback>
                      </Avatar>
                      <span>{item.tutor}</span>
                      <span>·</span>
                      <Globe className="h-3 w-3" />
                      <span>{item.lang}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.date}
                        </span>
                        <span>{item.duration} phút</span>
                        <span>{item.registered} đăng ký</span>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/live/${item.id}`}>Đăng ký</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
