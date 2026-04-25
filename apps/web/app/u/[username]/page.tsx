import { use } from "react"
import Link from "next/link"
import {
  Flame,
  Trophy,
  BookOpen,
  Globe,
  Calendar,
  UserPlus,
  MessageCircle,
  Share2,
  MapPin,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PublicNavbar } from "@/components/public/public-navbar"
import { PublicFooter } from "@/components/public/public-footer"
import { FlagIcon } from "@/components/flag-icon"

export default function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)

  const stats = [
    { icon: Flame, label: "Streak", value: "142" },
    { icon: Trophy, label: "XP", value: "24,580" },
    { icon: BookOpen, label: "Lessons", value: "847" },
    { icon: Calendar, label: "Thành viên", value: "1 năm" },
  ]

  const achievements = [
    { title: "100-day streak", icon: Flame, color: "text-accent" },
    { title: "10,000 XP", icon: Trophy, color: "text-primary" },
    { title: "Vocabulary master", icon: BookOpen, color: "text-success" },
    { title: "Top 1% weekly", icon: Award, color: "text-info" },
  ]

  return (
    <>
      <PublicNavbar />
      <main className="min-h-dvh bg-surface-low pt-16">
        <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-surface-low" />

        <div className="mx-auto -mt-20 max-w-5xl px-4 pb-16 sm:px-6">
          <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-5">
                <Avatar className="h-28 w-28 border-4 border-surface-lowest shadow-ambient sm:h-32 sm:w-32">
                  <AvatarImage src="/tutor-emma.jpg" alt={username} />
                  <AvatarFallback className="text-3xl">{username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-serif text-3xl font-semibold">Nguyễn Minh Anh</h1>
                  <div className="mt-1 text-muted-foreground">@{username}</div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Hà Nội, Việt Nam
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      Tiếng Việt (mẹ đẻ)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Theo dõi
                </Button>
                <Button variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Nhắn tin
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-pretty text-muted-foreground">
              Đang học tiếng Anh hướng tới IELTS 7.5 và tiếng Nhật N3. Thích đọc sách, du lịch và
              kết bạn quốc tế. Hãy trao đổi ngôn ngữ cùng mình!
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface-low px-3 py-1.5 text-sm">
                <span className="text-muted-foreground">Đang học:</span>
                <FlagIcon code="us" size={16} />
                <span className="font-semibold">B2</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface-low px-3 py-1.5 text-sm">
                <span className="text-muted-foreground">Đang học:</span>
                <FlagIcon code="jp" size={16} />
                <span className="font-semibold">N4</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-surface-lowest p-5 shadow-ambient"
              >
                <s.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 font-serif text-2xl font-semibold tabular-nums">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
              <h2 className="font-serif text-xl font-semibold">Hoạt động gần đây</h2>
              <div className="mt-4 space-y-4">
                {[
                  { action: "Hoàn thành", target: "Lesson 12 - Past simple", time: "2 giờ" },
                  { action: "Đạt thành tích", target: "100-day streak", time: "1 ngày" },
                  { action: "Bình luận bài của", target: "Emma Thompson", time: "2 ngày" },
                  { action: "Tham gia lớp", target: "IELTS Speaking Workshop", time: "3 ngày" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-b border-border pb-4 last:border-none last:pb-0"
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1 text-sm">
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-semibold">{a.target}</span>
                      <div className="mt-0.5 text-xs text-muted-foreground">{a.time} trước</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
                <h3 className="mb-4 font-semibold">Thành tích</h3>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((a) => (
                    <div
                      key={a.title}
                      className="rounded-xl border border-border bg-surface-low p-3 text-center"
                    >
                      <a.icon className={`mx-auto h-6 w-6 ${a.color}`} />
                      <div className="mt-2 text-xs font-medium leading-tight">{a.title}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full" size="sm">
                  Xem tất cả
                </Button>
              </div>

              <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
                <h3 className="mb-3 font-semibold">Friends</h3>
                <div className="flex -space-x-2">
                  {["/tutor-emma.jpg", "/tutor-kenji.jpg", "/tutor-sophie.jpg", "/tutor-carlos.jpg", "/tutor-ming.jpg"].map(
                    (src) => (
                      <Avatar key={src} className="h-9 w-9 border-2 border-surface-lowest">
                        <AvatarImage src={src || "/placeholder.svg"} alt="" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    ),
                  )}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface-lowest bg-surface-low text-xs font-semibold">
                    +23
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  )
}
