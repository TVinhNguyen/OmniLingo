"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Mic,
  Volume2,
  MessageCircle,
  Trophy,
  Target,
  Sparkles,
  Phone,
  Star,
  ChevronRight,
  Play,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PracticeHeader } from "@/components/app/practice-header"

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

const LEVEL_COLORS: Record<Level, string> = {
  A1: "bg-emerald-50 text-emerald-700",
  A2: "bg-emerald-50 text-emerald-700",
  B1: "bg-sky-50 text-sky-700",
  B2: "bg-sky-50 text-sky-700",
  C1: "bg-accent-container text-on-accent-container",
  C2: "bg-amber-50 text-amber-700",
}

const pronItems = [
  { id: "pr1", text: "Thirty-three thirsty thieves", level: "B1" as Level, focus: "/θ/" },
  { id: "pr2", text: "Red lorry, yellow lorry", level: "A2" as Level, focus: "/r/ /l/" },
  { id: "pr3", text: "Peter Piper picked a peck", level: "B2" as Level, focus: "/p/" },
  { id: "pr4", text: "She sells seashells", level: "A2" as Level, focus: "/ʃ/ /s/" },
  { id: "pr5", text: "How can a clam cram in a clean cream can", level: "C1" as Level, focus: "cluster" },
  { id: "pr6", text: "Fresh fish fried in five fat frying pans", level: "B2" as Level, focus: "/f/" },
]

const shadowItems = [
  { id: "sh1", title: "Morgan Freeman narration", level: "B2" as Level, duration: "1:20" },
  { id: "sh2", title: "BBC news anchor", level: "B1" as Level, duration: "0:45" },
  { id: "sh3", title: "Sherlock monologue", level: "C1" as Level, duration: "2:10" },
  { id: "sh4", title: "Everyday greetings", level: "A1" as Level, duration: "0:30" },
  { id: "sh5", title: "Stand-up comedy", level: "C1" as Level, duration: "1:45" },
  { id: "sh6", title: "TED talk intro", level: "B2" as Level, duration: "1:05" },
]

const buildItems = [
  { id: "b1", keywords: ["flight", "delayed", "weather"], level: "B1" as Level },
  { id: "b2", keywords: ["apologize", "meeting", "client"], level: "B2" as Level },
  { id: "b3", keywords: ["explain", "how", "works"], level: "A2" as Level },
  { id: "b4", keywords: ["recommend", "restaurant", "seafood"], level: "B1" as Level },
  { id: "b5", keywords: ["disagree", "politely", "opinion"], level: "B2" as Level },
  { id: "b6", keywords: ["congratulate", "promotion", "friend"], level: "A2" as Level },
]

const scenarios = [
  { id: "sc1", title: "Khách sạn", emoji: "🏨", desc: "Check-in, đổi phòng, yêu cầu dịch vụ", level: "A2" as Level },
  { id: "sc2", title: "Phỏng vấn việc làm", emoji: "💼", desc: "Giới thiệu, điểm mạnh, câu hỏi phỏng vấn", level: "B2" as Level },
  { id: "sc3", title: "Taxi", emoji: "🚕", desc: "Chỉ đường, thương lượng giá", level: "A2" as Level },
  { id: "sc4", title: "Debate", emoji: "🎭", desc: "Tranh luận chủ đề khoa học, xã hội", level: "C1" as Level },
  { id: "sc5", title: "Gọi món ăn", emoji: "🍽️", desc: "Order, yêu cầu, phàn nàn món ăn", level: "A2" as Level },
  { id: "sc6", title: "Khám bác sĩ", emoji: "🩺", desc: "Mô tả triệu chứng, hỏi thuốc", level: "B1" as Level },
]

const leaderboard = [
  { rank: 1, name: "Minh N.", score: 94, badge: "🥇" },
  { rank: 2, name: "Sarah K.", score: 91, badge: "🥈" },
  { rank: 3, name: "Kenji T.", score: 88, badge: "🥉" },
  { rank: 12, name: "Bạn", score: 82, me: true },
  { rank: 13, name: "Anna P.", score: 79 },
]

const mockParts = [
  {
    part: 1,
    title: "Introduction & Interview",
    time: "4 phút",
    desc: "Các câu hỏi cá nhân về hometown, hobbies, daily life",
  },
  {
    part: 2,
    title: "Long turn (cue card)",
    time: "2 phút",
    desc: "Nói 1-2 phút về chủ đề được giao, có 1 phút chuẩn bị",
  },
  {
    part: 3,
    title: "Discussion",
    time: "5 phút",
    desc: "Trao đổi sâu hơn về các chủ đề liên quan đến Part 2",
  },
]

function GradientIconCard({
  children,
  gradient,
  className = "",
}: {
  children: React.ReactNode
  gradient: string
  className?: string
}) {
  return (
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-ambient bg-gradient-to-br ${gradient} ${className}`}
    >
      {children}
    </span>
  )
}

export default function SpeakingPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PracticeHeader
        icon={Mic}
        breadcrumb="Luyện tập"
        title="Luyện Nói"
        highlight="tự-tin-mỗi-ngày"
        description="6 chế độ từ phát âm IPA đến AI Roleplay và Mock Speaking — với feedback cá nhân hoá trong vài giây."
        gradient="fluency"
        badge="Có chấm điểm AI"
        stats={[
          { label: "Phút nói", value: "47" },
          { label: "Accuracy", value: "86%" },
          { label: "Streak", value: "9" },
          { label: "Bài đã xong", value: "32" },
        ]}
      />

      {/* Today / Daily challenge */}
      <section
        data-aos="fade-up"
        className="grid gap-4 lg:grid-cols-3"
      >
        <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-ambient lg:col-span-2">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Trophy className="h-4 w-4" />
            Thử thách hôm nay · 1.247 người tham gia
          </div>
          <h3 className="mt-2 text-2xl font-extrabold leading-tight">
            Describe a memorable journey you took recently
          </h3>
          <p className="mt-1 text-sm text-white/85">
            60 giây · Nói tự do · Có chấm điểm pronunciation, fluency, vocab
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              size="lg"
              className="rounded-full bg-white text-primary hover:bg-white/90 shadow-ambient"
            >
              <Mic className="mr-2 h-4 w-4" />
              Thu âm 60s
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              Xem mẫu band 7.0
            </Button>
          </div>
        </div>

        <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-amber-500" />
            Bảng xếp hạng tuần
          </div>
          <ul className="mt-3 space-y-2">
            {leaderboard.map((r) => (
              <li
                key={r.rank}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${r.me ? "bg-accent-container font-semibold text-on-accent-container" : ""}`}
              >
                <span className="w-6 text-center text-xs font-bold text-muted-foreground">
                  {r.badge ?? r.rank}
                </span>
                <span className="flex-1">{r.name}</span>
                <span className="font-bold tabular-nums">{r.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mode tabs */}
      <Tabs defaultValue="pron" className="space-y-5">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-full bg-surface-lowest p-1 shadow-ambient sm:grid-cols-6">
          <TabsTrigger
            value="pron"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <Volume2 className="h-3.5 w-3.5" /> Phát âm
          </TabsTrigger>
          <TabsTrigger
            value="shadow"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <Mic className="h-3.5 w-3.5" /> Shadow
          </TabsTrigger>
          <TabsTrigger
            value="build"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <Target className="h-3.5 w-3.5" /> Ghép câu
          </TabsTrigger>
          <TabsTrigger
            value="role"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <Sparkles className="h-3.5 w-3.5" /> Roleplay
          </TabsTrigger>
          <TabsTrigger
            value="daily"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Chat
          </TabsTrigger>
          <TabsTrigger
            value="mock"
            className="gap-1.5 rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-ambient"
          >
            <Phone className="h-3.5 w-3.5" /> Mock
          </TabsTrigger>
        </TabsList>

        {/* Pronunciation */}
        <TabsContent value="pron" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pronItems.map((p) => (
              <Link
                key={p.id}
                href={`/practice/pronunciation?pair=${p.id}`}
                className="group rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
              >
                <div className="flex items-start justify-between">
                  <GradientIconCard gradient="from-[#5352a5] to-[#a19ff9]">
                    <Volume2 className="h-5 w-5" />
                  </GradientIconCard>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LEVEL_COLORS[p.level]}`}
                  >
                    {p.level}
                  </span>
                </div>
                <p className="mt-4 text-base font-semibold leading-snug">
                  {p.text}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-surface-low px-2.5 py-1 font-mono font-medium">
                    {p.focus}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Shadow */}
        <TabsContent value="shadow" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shadowItems.map((s) => (
              <Link
                key={s.id}
                href={`/practice/listening/shadow/${s.id}`}
                className="group rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
              >
                <div className="flex items-start justify-between">
                  <GradientIconCard gradient="from-[#702ae1] to-[#b48bff]">
                    <Mic className="h-5 w-5" />
                  </GradientIconCard>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LEVEL_COLORS[s.level]}`}
                  >
                    {s.level}
                  </span>
                </div>
                <h4 className="mt-4 font-bold leading-snug line-clamp-2">{s.title}</h4>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Play className="h-3 w-3 fill-current" />
                    {s.duration}
                  </span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Build sentences */}
        <TabsContent value="build" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buildItems.map((b) => (
              <div
                key={b.id}
                className="group rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
              >
                <div className="flex items-start justify-between">
                  <GradientIconCard gradient="from-[#983772] to-[#d56ba6]">
                    <Target className="h-5 w-5" />
                  </GradientIconCard>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LEVEL_COLORS[b.level]}`}
                  >
                    {b.level}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {b.keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-surface-low px-3 py-1 text-xs font-medium"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="mt-4 w-full rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
                >
                  <Mic className="mr-2 h-3.5 w-3.5" />
                  Thu 30s bằng các từ này
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Roleplay */}
        <TabsContent value="role" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((sc) => (
              <Link
                key={sc.id}
                href="/ai-tutor"
                className="group rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-1 hover:shadow-hover"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2e9e6a] to-[#5cc29a] text-3xl shadow-ambient">
                    {sc.emoji}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LEVEL_COLORS[sc.level]}`}
                  >
                    {sc.level}
                  </span>
                </div>
                <h4 className="mt-4 text-lg font-bold leading-snug">
                  {sc.title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {sc.desc}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  Bắt đầu roleplay
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Chat with AI */}
        <TabsContent value="daily" className="space-y-4">
          <div className="rounded-3xl bg-surface-lowest p-8 shadow-ambient">
            <div className="mx-auto max-w-md text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-fluency text-white shadow-hover">
                <MessageCircle className="h-8 w-8" />
              </span>
              <h3 className="mt-4 text-2xl font-extrabold">
                Trò chuyện AI mọi chủ đề
              </h3>
              <p className="mt-2 text-muted-foreground">
                Chat hoặc voice-call với AI Tutor 24/7. Bạn được sửa lỗi ngay trong lúc nói, gợi ý từ tự nhiên, và xem transcript sau buổi học.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
              >
                <Link href="/ai-tutor">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Mở AI Tutor
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Mock IELTS */}
        <TabsContent value="mock" className="space-y-4">
          <div className="rounded-3xl bg-surface-lowest p-6 shadow-ambient">
            <div className="flex items-center gap-3">
              <GradientIconCard gradient="from-[#d9912a] to-[#efc170]" className="h-12 w-12">
                <Trophy className="h-6 w-6" />
              </GradientIconCard>
              <div>
                <h3 className="text-xl font-bold">IELTS Speaking — Mock test</h3>
                <p className="text-sm text-muted-foreground">
                  Mô phỏng đầy đủ 3 parts · ~11 phút · Có chấm band theo 4 tiêu chí
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {mockParts.map((p) => (
                <div
                  key={p.part}
                  className="rounded-2xl border border-border bg-surface-low p-4"
                >
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    Part {p.part} · {p.time}
                  </span>
                  <h4 className="mt-2 font-bold">{p.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="mt-5 w-full rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Bắt đầu Mock test
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
