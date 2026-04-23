"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Calendar,
  Clock,
  Video,
  Star,
  MessageSquare,
  XCircle,
  RefreshCw,
  Grid3x3,
  List,
  ChevronRight,
  AlertCircle,
  CalendarDays,
} from "lucide-react"
import { FlagIcon } from "@/components/flag-icon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Booking = {
  id: number
  tutor: { name: string; avatar: string }
  language: string
  date: string
  month: string
  day: number
  time: string
  duration: string
  price: number
  status: "upcoming" | "live" | "past" | "cancelled"
  reviewed?: boolean
  minutesToStart?: number
}

const bookings: Booking[] = [
  {
    id: 1,
    tutor: { name: "Emma Wilson", avatar: "EW" },
    language: "en",
    date: "Thứ 2, 21/10",
    month: "Tháng 10",
    day: 21,
    time: "14:00 - 15:00",
    duration: "60 phút",
    price: 28,
    status: "live",
    minutesToStart: 5,
  },
  {
    id: 2,
    tutor: { name: "Kenji Tanaka", avatar: "KT" },
    language: "ja",
    date: "Thứ 3, 22/10",
    month: "Tháng 10",
    day: 22,
    time: "19:00 - 20:00",
    duration: "60 phút",
    price: 32,
    status: "upcoming",
    minutesToStart: 1440,
  },
  {
    id: 3,
    tutor: { name: "Sophie Dubois", avatar: "SD" },
    language: "fr",
    date: "Thứ 5, 24/10",
    month: "Tháng 10",
    day: 24,
    time: "20:30 - 21:30",
    duration: "60 phút",
    price: 30,
    status: "upcoming",
  },
  {
    id: 4,
    tutor: { name: "Carlos Mendez", avatar: "CM" },
    language: "es",
    date: "Thứ 7, 12/10",
    month: "Tháng 10",
    day: 12,
    time: "18:00 - 19:00",
    duration: "60 phút",
    price: 26,
    status: "past",
    reviewed: false,
  },
  {
    id: 5,
    tutor: { name: "Ming Li", avatar: "ML" },
    language: "zh",
    date: "CN, 06/10",
    month: "Tháng 10",
    day: 6,
    time: "15:00 - 15:30",
    duration: "30 phút",
    price: 14,
    status: "past",
    reviewed: true,
  },
  {
    id: 6,
    tutor: { name: "Anna Schmidt", avatar: "AS" },
    language: "de",
    date: "Thứ 4, 02/10",
    month: "Tháng 10",
    day: 2,
    time: "17:00 - 18:30",
    duration: "90 phút",
    price: 45,
    status: "cancelled",
  },
]

const tabs = [
  { id: "upcoming", label: "Sắp tới", filter: (b: Booking) => b.status === "upcoming" || b.status === "live" },
  { id: "past", label: "Đã qua", filter: (b: Booking) => b.status === "past" },
  { id: "cancelled", label: "Đã hủy", filter: (b: Booking) => b.status === "cancelled" },
]

function BookingCard({ b }: { b: Booking }) {
  const isJoinable = b.status === "live" && (b.minutesToStart ?? 999) < 10
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group grid gap-4 rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover md:grid-cols-[140px_1fr_auto]"
    >
      {/* Date block */}
      <div className="flex items-center gap-3 md:flex-col md:items-start md:justify-center md:gap-1 md:rounded-2xl md:bg-gradient-to-br md:from-primary/10 md:to-accent/5 md:p-4 md:text-center">
        <div className="text-xs font-medium uppercase text-primary md:w-full">{b.month}</div>
        <div className="text-3xl font-bold md:w-full md:text-5xl">{b.day}</div>
        <div className="text-xs text-muted-foreground md:w-full">{b.time}</div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-sm font-bold text-white">
            {b.tutor.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="truncate font-semibold">{b.tutor.name}</div>
              <FlagIcon code={b.language} className="h-3.5 w-5 shrink-0" />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{b.duration}</span>
              <span>•</span>
              <span className="font-medium text-foreground">${b.price}</span>
              {b.status === "live" && (
                <Badge className="bg-destructive text-destructive-foreground">LIVE</Badge>
              )}
              {b.status === "cancelled" && (
                <Badge variant="secondary">Đã hủy</Badge>
              )}
              {b.reviewed && (
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Đã review
                </Badge>
              )}
            </div>
          </div>
        </div>
        {isJoinable && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-warning/10 px-3 py-2 text-xs text-warning">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Buổi học bắt đầu trong {b.minutesToStart} phút
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
        {(b.status === "upcoming" || b.status === "live") && (
          <>
            <Button
              asChild
              size={isJoinable ? "lg" : "default"}
              className={`rounded-xl ${
                isJoinable ? "bg-success shadow-hover animate-pulse" : "bg-primary shadow-ambient"
              }`}
            >
              <Link href={`/session/${b.id}`}>
                <Video className="mr-2 h-4 w-4" />
                {isJoinable ? "Vào học ngay" : "Chi tiết"}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Đổi giờ
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground">
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Hủy
            </Button>
          </>
        )}
        {b.status === "past" && (
          <>
            {!b.reviewed && (
              <Button asChild className="rounded-xl bg-primary shadow-ambient">
                <Link href={`/tutors/${b.id}/review`}>
                  <Star className="mr-2 h-4 w-4" />
                  Viết review
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
              Đặt lại
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground">
              Báo lỗi
            </Button>
          </>
        )}
        {b.status === "cancelled" && (
          <Button className="rounded-xl bg-primary shadow-ambient">Đặt lại</Button>
        )}
      </div>
    </motion.div>
  )
}

function EmptyState({ tab }: { tab: string }) {
  const messages: Record<string, { title: string; desc: string; cta: string }> = {
    upcoming: {
      title: "Chưa có buổi học sắp tới",
      desc: "Tìm tutor và đặt lịch để bắt đầu hành trình học ngôn ngữ",
      cta: "Tìm tutor",
    },
    past: {
      title: "Chưa có buổi học nào",
      desc: "Các buổi học đã hoàn thành sẽ xuất hiện ở đây",
      cta: "Đặt buổi đầu tiên",
    },
    cancelled: {
      title: "Không có buổi học bị hủy",
      desc: "Các buổi học bị hủy sẽ hiển thị ở đây",
      cta: "Về trang chính",
    },
  }
  const m = messages[tab] || messages.upcoming
  return (
    <div className="rounded-3xl bg-surface-lowest p-12 text-center shadow-ambient">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5">
        <CalendarDays className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">{m.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
      <Button asChild className="mt-6 rounded-xl bg-primary shadow-ambient">
        <Link href="/tutors">{m.cta}</Link>
      </Button>
    </div>
  )
}

export default function TutorsBookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [view, setView] = useState<"list" | "calendar">("list")

  const filtered = bookings.filter(tabs.find((t) => t.id === activeTab)!.filter)
  const counts = Object.fromEntries(
    tabs.map((t) => [t.id, bookings.filter(t.filter).length]),
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/tutors" className="hover:text-primary">
          Tutors
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Bookings</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-sans text-3xl font-bold text-balance lg:text-4xl">
            Lịch học của tôi
          </h1>
          <p className="mt-2 text-muted-foreground">Quản lý tất cả buổi học với tutor 1-1</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-surface-lowest p-1 shadow-ambient">
          <button
            onClick={() => setView("list")}
            className={`rounded-lg p-2 transition-colors ${
              view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`rounded-lg p-2 transition-colors ${
              view === "calendar"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

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
            <Badge variant="secondary" className="ml-2 h-5 rounded-full bg-white/20 px-1.5 text-xs">
              {counts[t.id]}
            </Badge>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {filtered.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : view === "list" ? (
            <div className="space-y-4">
              {filtered.map((b) => (
                <BookingCard key={b.id} b={b} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Tháng 10, 2024</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1
                  const hasBooking = filtered.some((b) => b.day === day)
                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded-xl border p-2 text-center transition-colors ${
                        hasBooking
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-transparent hover:bg-surface-low"
                      }`}
                    >
                      <div className="text-sm">{day}</div>
                      {hasBooking && (
                        <div className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
