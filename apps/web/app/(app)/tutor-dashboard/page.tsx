"use client"

import Link from "next/link"
import {
  DollarSign,
  Users,
  Calendar,
  Star,
  Clock,
  TrendingUp,
  Video,
  MessageSquare,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"

const EARNINGS = [
  { day: "T2", value: 120 },
  { day: "T3", value: 180 },
  { day: "T4", value: 150 },
  { day: "T5", value: 220 },
  { day: "T6", value: 280 },
  { day: "T7", value: 340 },
  { day: "CN", value: 250 },
]

export default function TutorDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary">Tutor Mode</Badge>
        <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
          Chào Emma, tuần này tuyệt vời!
        </h1>
        <p className="mt-1 text-muted-foreground">Tổng quan hoạt động giảng dạy của bạn</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: DollarSign,
            label: "Thu nhập tháng",
            value: "$2,485",
            sub: "+18% so với tháng trước",
            color: "text-success",
          },
          {
            icon: Users,
            label: "Học viên",
            value: "47",
            sub: "5 mới trong tuần",
            color: "text-primary",
          },
          {
            icon: Star,
            label: "Đánh giá",
            value: "4.92",
            sub: "Từ 234 review",
            color: "text-accent",
          },
          {
            icon: Clock,
            label: "Giờ dạy tuần",
            value: "28h",
            sub: "Mục tiêu: 30h",
            color: "text-info",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-surface-lowest p-5 shadow-ambient"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-surface-low ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-serif text-3xl font-semibold tabular-nums">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">Thu nhập tuần</h2>
              <p className="text-sm text-muted-foreground">$1,540 · 7 ngày qua</p>
            </div>
            <Button variant="outline" size="sm">
              Xem chi tiết
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EARNINGS}>
                <defs>
                  <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.08 210)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.55 0.08 210)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.99 0.005 85)",
                    border: "1px solid oklch(0.9 0.01 85)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.55 0.08 210)"
                  strokeWidth={2}
                  fill="url(#earn)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-surface-lowest p-6 shadow-ambient">
            <div className="text-sm font-semibold text-muted-foreground">Mục tiêu tháng</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-semibold">$2,485</span>
              <span className="text-sm text-muted-foreground">/ $3,000</span>
            </div>
            <Progress value={82.8} className="mt-4 h-2" />
            <div className="mt-2 text-xs text-muted-foreground">
              Còn $515 để đạt mục tiêu
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-success" />
              Xu hướng
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Booking rate</span>
                <span className="font-semibold text-success">+24%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Retention</span>
                <span className="font-semibold text-success">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Response time</span>
                <span className="font-semibold">12 phút</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Buổi học hôm nay</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tutor-dashboard/schedule">
                Lịch đầy đủ
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { time: "14:00", student: "Minh Anh", topic: "IELTS Speaking", avatar: "/tutor-sophie.jpg", status: "upcoming" },
              { time: "16:00", student: "Đức Hùng", topic: "Business English", avatar: "/tutor-kenji.jpg", status: "upcoming" },
              { time: "19:00", student: "Mai Linh", topic: "Pronunciation", avatar: "/tutor-ming.jpg", status: "upcoming" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface-low p-4"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-center">
                  <span className="font-mono text-sm font-bold text-primary">{s.time}</span>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={s.avatar || "/placeholder.svg"} alt="" />
                  <AvatarFallback>{s.student[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{s.student}</div>
                  <div className="text-xs text-muted-foreground">{s.topic}</div>
                </div>
                <Button size="sm">
                  <Video className="mr-1.5 h-3.5 w-3.5" />
                  Join
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface-lowest p-6 shadow-ambient">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Tin nhắn mới</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/messages">
                <MessageSquare className="mr-1 h-3 w-3" />
                Tất cả
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { name: "Thảo My", msg: "Cô ơi, bài tập Writing em cần...", time: "5 phút", avatar: "/tutor-emma.jpg" },
              { name: "Quang Minh", msg: "Em muốn đổi lịch tuần sau...", time: "1 giờ", avatar: "/tutor-kenji.jpg" },
              { name: "Ngọc Hà", msg: "Cảm ơn cô về buổi học hôm qua!", time: "3 giờ", avatar: "/tutor-sophie.jpg" },
            ].map((m, i) => (
              <Link
                key={i}
                href="/messages"
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface-low p-4 transition hover:border-primary/40"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={m.avatar || "/placeholder.svg"} alt="" />
                  <AvatarFallback>{m.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.time}</span>
                  </div>
                  <div className="truncate text-sm text-muted-foreground">{m.msg}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
