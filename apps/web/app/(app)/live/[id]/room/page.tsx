"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MessageSquare,
  Users,
  Hand,
  Settings,
  PhoneOff,
  Send,
  Pin,
  Radio,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const classData = {
  title: "IELTS Speaking Part 2 & 3",
  topic: "Cue card practice · band 7.0 strategies",
  teacher: { name: "Ms. Emma Wilson", initials: "EW", role: "Host" },
  participants: [
    { id: "1", name: "Nguyễn An", initials: "NA", muted: false, video: true },
    { id: "2", name: "Trần Bình", initials: "TB", muted: true, video: true },
    { id: "3", name: "Lê Châu", initials: "LC", muted: true, video: false },
    { id: "4", name: "Phạm Dũng", initials: "PD", muted: false, video: true },
    { id: "5", name: "Hoàng Em", initials: "HE", muted: true, video: true },
  ],
  messages: [
    { id: "m1", author: "Ms. Emma", initials: "EW", text: "Chào mọi người! Hôm nay mình sẽ luyện cue card.", time: "09:00", teacher: true },
    { id: "m2", author: "Nguyễn An", initials: "NA", text: "Hi teacher! Em đã chuẩn bị sẵn rồi ạ.", time: "09:01" },
    { id: "m3", author: "Trần Bình", initials: "TB", text: "Có file slides không ạ?", time: "09:02" },
    { id: "m4", author: "Ms. Emma", initials: "EW", text: "Mình sẽ gửi sau buổi học nhé.", time: "09:03", teacher: true },
    { id: "m5", author: "Lê Châu", initials: "LC", text: "Thanks teacher!", time: "09:05" },
  ],
  startedAt: Date.now() - 24 * 60 * 1000,
}

function Tile({
  name,
  initials,
  video,
  muted,
  teacher,
  speaking,
  className = "",
}: {
  name: string
  initials: string
  video: boolean
  muted: boolean
  teacher?: boolean
  speaking?: boolean
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2036] to-[#0e1220] ${speaking ? "ring-2 ring-accent shadow-hover" : "shadow-ambient"} ${className}`}
    >
      {video ? (
        <div className="h-full w-full bg-gradient-to-br from-[#5352a5]/40 to-[#702ae1]/40" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary text-2xl font-extrabold text-white shadow-hover">
            {initials}
          </span>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        {teacher && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-ambient">
            Host
          </span>
        )}
        {speaking && (
          <span className="flex items-center gap-1 rounded-full bg-success/90 px-2 py-0.5 text-[10px] font-bold text-white">
            <Radio className="h-2.5 w-2.5 animate-pulse" />
            Đang nói
          </span>
        )}
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          {name}
        </span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${muted ? "bg-destructive/90" : "bg-success/90"} text-white backdrop-blur`}
        >
          {muted ? (
            <MicOff className="h-3 w-3" />
          ) : (
            <Mic className="h-3 w-3" />
          )}
        </span>
      </div>
    </div>
  )
}

export default function LiveClassPage() {
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [chatInput, setChatInput] = useState("")

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - classData.startedAt) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Header */}
      <section
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-hover"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <Link
              href="/live"
              className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                LIVE
              </span>
              <h1 className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
                {classData.title}
              </h1>
              <p className="mt-1 text-sm text-white/85">
                {classData.topic} · {classData.teacher.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-center backdrop-blur">
              <p className="text-xs text-white/70">Thời lượng</p>
              <p className="font-mono text-lg font-extrabold">
                {String(mins).padStart(2, "0")}:
                {String(secs).padStart(2, "0")}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-center backdrop-blur">
              <p className="text-xs text-white/70">Tham gia</p>
              <p className="text-lg font-extrabold">
                {classData.participants.length + 1}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Video grid */}
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Tile
              name={classData.teacher.name}
              initials={classData.teacher.initials}
              video={true}
              muted={false}
              teacher
              speaking
              className="sm:col-span-2 sm:row-span-2 aspect-video"
            />
            {classData.participants.map((p) => (
              <Tile
                key={p.id}
                name={p.name}
                initials={p.initials}
                video={p.video}
                muted={p.muted}
                className="aspect-video"
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-surface-lowest p-3 shadow-ambient">
            <Button
              onClick={() => setMicOn(!micOn)}
              size="lg"
              variant="ghost"
              className={`rounded-full ${micOn ? "bg-surface-low hover:bg-surface-high" : "bg-destructive text-white hover:bg-destructive/90"}`}
            >
              {micOn ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={() => setVideoOn(!videoOn)}
              size="lg"
              variant="ghost"
              className={`rounded-full ${videoOn ? "bg-surface-low hover:bg-surface-high" : "bg-destructive text-white hover:bg-destructive/90"}`}
            >
              {videoOn ? (
                <Video className="h-5 w-5" />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full bg-surface-low hover:bg-surface-high"
            >
              <Monitor className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setHandRaised(!handRaised)}
              size="lg"
              variant="ghost"
              className={`rounded-full ${handRaised ? "bg-amber-100 text-amber-700" : "bg-surface-low hover:bg-surface-high"}`}
            >
              <Hand className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full bg-surface-low hover:bg-surface-high"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <div className="h-6 w-px bg-border" />
            <Button
              size="lg"
              className="rounded-full bg-destructive px-6 text-white hover:bg-destructive/90 shadow-ambient"
            >
              <PhoneOff className="mr-2 h-4 w-4" />
              Thoát
            </Button>
          </div>
        </div>

        {/* Side panel */}
        <aside className="rounded-3xl bg-surface-lowest p-4 shadow-ambient">
          <Tabs defaultValue="chat" className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-2 gap-1 rounded-full bg-surface-low p-1">
              <TabsTrigger
                value="chat"
                className="rounded-full gap-1.5 data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="people"
                className="rounded-full gap-1.5 data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
              >
                <Users className="h-3.5 w-3.5" />
                {classData.participants.length + 1}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4 flex flex-col">
              <ul className="scrollbar-thin max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {classData.messages.map((m) => (
                  <li key={m.id} className="flex gap-2">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.teacher ? "bg-gradient-fluency text-white" : "bg-surface-low"}`}
                    >
                      {m.initials}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-sm font-semibold ${m.teacher ? "text-accent" : ""}`}
                        >
                          {m.author}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {m.time}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex gap-2 border-t border-border pt-3">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhập tin nhắn…"
                  className="flex-1 rounded-full border-0 bg-surface-low text-sm"
                />
                <Button
                  size="icon"
                  className="rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="people" className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-2xl bg-accent-container p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-fluency text-sm font-bold text-white">
                  {classData.teacher.initials}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                    {classData.teacher.name}
                    <Pin className="h-3 w-3 text-accent" />
                  </p>
                  <p className="text-xs text-on-accent-container/80">Host</p>
                </div>
              </div>

              {classData.participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-2xl bg-surface-low p-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-sm font-bold text-white">
                    {p.initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.video ? "Camera bật" : "Camera tắt"} ·{" "}
                      {p.muted ? "Mic tắt" : "Mic bật"}
                    </p>
                  </div>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${p.muted ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}
                  >
                    {p.muted ? (
                      <MicOff className="h-3 w-3" />
                    ) : (
                      <Mic className="h-3 w-3" />
                    )}
                  </span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}
