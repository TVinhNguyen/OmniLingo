"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  FileText,
  Pencil,
  Send,
  Clock,
  Star,
  ChevronRight,
  StickyNote,
  Paperclip,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const sessionData = {
  tutor: {
    name: "Ms. Emma Wilson",
    initials: "EW",
    specialty: "IELTS Speaking · Band 8.5",
  },
  student: {
    name: "Nguyễn Văn An",
    initials: "NA",
  },
  goal: "Luyện Part 2 cue card: 'Describe a memorable journey'",
  startedAt: Date.now() - 18 * 60 * 1000,
  duration: 60,
  messages: [
    { id: "m1", from: "tutor", text: "Hi An! Sẵn sàng bắt đầu chưa nào?", time: "10:00" },
    { id: "m2", from: "student", text: "Dạ em sẵn sàng ạ!", time: "10:01" },
    { id: "m3", from: "tutor", text: "Mình bắt đầu với cue card nhé: describe a memorable journey.", time: "10:02" },
    { id: "m4", from: "student", text: "Ok em đang chuẩn bị trong 1 phút.", time: "10:03" },
  ],
  materials: [
    { id: "f1", name: "Cue card list Part 2.pdf", size: "420 KB" },
    { id: "f2", name: "Band 7 vocabulary.docx", size: "130 KB" },
    { id: "f3", name: "Buổi trước (transcript).txt", size: "24 KB" },
  ],
}

export default function TutorSessionPage() {
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [notes, setNotes] = useState(
    "- Present perfect vs past simple\n- Thêm connectors: however, furthermore\n- Tập phát âm /θ/ trong 'think', 'three'",
  )
  const [chatInput, setChatInput] = useState("")
  const [endOpen, setEndOpen] = useState(false)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionData.startedAt) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = sessionData.duration * 60 - elapsed
  const mins = Math.max(0, Math.floor(remaining / 60))
  const secs = Math.max(0, remaining % 60)

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Header */}
      <section
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl bg-gradient-fluency p-6 text-primary-foreground shadow-hover"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <Link
              href="/tutors"
              className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                1:1 Session
              </span>
              <h1 className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
                {sessionData.tutor.name}
              </h1>
              <p className="mt-1 text-sm text-white/85">
                {sessionData.tutor.specialty} · {sessionData.goal}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-center backdrop-blur">
              <p className="text-xs text-white/70">Còn lại</p>
              <p className="font-mono text-lg font-extrabold">
                {String(mins).padStart(2, "0")}:
                {String(secs).padStart(2, "0")}
              </p>
            </div>
            <Button
              onClick={() => setEndOpen(true)}
              size="lg"
              className="rounded-full bg-destructive px-4 text-white hover:bg-destructive/90 shadow-ambient"
            >
              <PhoneOff className="mr-2 h-4 w-4" />
              Kết thúc
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Video + whiteboard */}
        <div className="space-y-3">
          {showWhiteboard ? (
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-white shadow-ambient">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(158,174,199,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(158,174,199,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute top-4 left-4 rounded-full bg-surface-low px-3 py-1 text-xs font-semibold">
                <Pencil className="mr-1.5 inline h-3 w-3" />
                Whiteboard
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Whiteboard share đang hoạt động
                  </p>
                  <p className="mt-1 font-serif text-2xl text-foreground">
                    "I've been to Japan three times"
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-1 rounded-full bg-surface-lowest p-1 shadow-ambient">
                {["#5352a5", "#702ae1", "#d0406e", "#2e9e6a"].map((c) => (
                  <button
                    key={c}
                    className="h-7 w-7 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Tutor */}
              <div className="relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2036] to-[#0e1220] shadow-ambient ring-2 ring-accent">
                <div className="h-full w-full bg-gradient-to-br from-accent/30 to-tertiary/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Tutor
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {sessionData.tutor.name}
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/90 text-white">
                    <Mic className="h-3 w-3" />
                  </span>
                </div>
              </div>

              {/* Student */}
              <div className="relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2036] to-[#0e1220] shadow-ambient">
                {videoOn ? (
                  <div className="h-full w-full bg-gradient-to-br from-primary/40 to-primary-container/40" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary text-2xl font-extrabold text-white">
                      {sessionData.student.initials}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-surface-low px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    Bạn
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {sessionData.student.name}
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${micOn ? "bg-success/90" : "bg-destructive/90"} text-white`}
                  >
                    {micOn ? (
                      <Mic className="h-3 w-3" />
                    ) : (
                      <MicOff className="h-3 w-3" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

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
              onClick={() => setShowWhiteboard(!showWhiteboard)}
              size="lg"
              variant="ghost"
              className={`rounded-full ${showWhiteboard ? "bg-accent-container text-on-accent-container" : "bg-surface-low hover:bg-surface-high"}`}
            >
              <Pencil className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Side panel */}
        <aside className="rounded-3xl bg-surface-lowest p-4 shadow-ambient">
          <Tabs defaultValue="chat" className="flex flex-col">
            <TabsList className="grid w-full grid-cols-3 gap-1 rounded-full bg-surface-low p-1">
              <TabsTrigger
                value="chat"
                className="rounded-full gap-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-full gap-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
              >
                <StickyNote className="h-3.5 w-3.5" />
                Note
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="rounded-full gap-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
              >
                <Paperclip className="h-3.5 w-3.5" />
                Files
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4">
              <ul className="scrollbar-thin max-h-[400px] space-y-3 overflow-y-auto pr-1">
                {sessionData.messages.map((m) => (
                  <li
                    key={m.id}
                    className={`flex gap-2 ${m.from === "student" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.from === "tutor" ? "bg-gradient-fluency text-white" : "bg-gradient-primary text-white"}`}
                    >
                      {m.from === "tutor"
                        ? sessionData.tutor.initials
                        : sessionData.student.initials}
                    </span>
                    <div
                      className={`max-w-[240px] rounded-2xl px-3 py-2 text-sm ${m.from === "tutor" ? "bg-surface-low" : "bg-accent-container text-on-accent-container"}`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      <p className="mt-1 text-[10px] opacity-60">{m.time}</p>
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

            <TabsContent value="notes" className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                <p className="text-sm font-bold">Ghi chú buổi học</p>
              </div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={10}
                className="rounded-2xl border-0 bg-surface-low text-sm"
              />
              <Button
                size="sm"
                className="w-full rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95"
              >
                Lưu note vào hồ sơ
              </Button>
            </TabsContent>

            <TabsContent value="files" className="mt-4 space-y-2">
              {sessionData.materials.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-2xl bg-surface-low p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-lowest">
                    <FileText className="h-4 w-4 text-primary" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.size}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      {/* End session dialog */}
      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold">
              Kết thúc buổi học?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Đánh giá buổi học với {sessionData.tutor.name}:
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star
                    className={`h-8 w-8 transition-colors ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Bạn thấy buổi học như thế nào?"
              rows={3}
              className="rounded-2xl border-0 bg-surface-low text-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setEndOpen(false)}
                className="flex-1 rounded-full bg-surface-low hover:bg-surface-high"
              >
                Hủy
              </Button>
              <Button className="flex-1 rounded-full bg-gradient-primary text-white shadow-ambient hover:opacity-95">
                Xác nhận kết thúc
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
