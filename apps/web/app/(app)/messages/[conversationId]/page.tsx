"use client"

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  CheckCheck,
  Info,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Send,
  Smile,
  Square,
  Video,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  from: "me" | "partner" | "system"
  text?: string
  voiceDuration?: number
  timestamp: string
  read?: boolean
  delivered?: boolean
  corrections?: Array<{ original: string; suggestion: string; from: "me" | "partner" }>
}

const conversations = [
  { id: "yuki", name: "Yuki Tanaka", avatar: "/tutor-kenji.jpg", fallback: "YT", role: "Language partner", online: true, lastMessage: "おつかれさまでした!", time: "1 phút", unread: 0 },
  { id: "emma", name: "Emma Harrison", avatar: "/tutor-emma.jpg", fallback: "EH", role: "Giáo viên IELTS", online: true, lastMessage: "Sẵn sàng cho buổi học sáng mai không?", time: "34 phút", unread: 2 },
  { id: "kenji", name: "Kenji Tanaka", avatar: "/tutor-kenji.jpg", fallback: "KT", role: "Giáo viên tiếng Nhật", online: true, lastMessage: "Bài tập hôm qua rất tốt!", time: "3 giờ", unread: 0 },
  { id: "sophie", name: "Sophie Martin", avatar: "/tutor-sophie.jpg", fallback: "SM", role: "Giáo viên tiếng Pháp", online: false, lastMessage: "Đừng quên ôn từ vựng chương 4 nhé.", time: "1 ngày", unread: 0 },
]

const initialMessages: Message[] = [
  { id: "m0", from: "system", text: "Yuki đã tham gia cuộc trò chuyện", timestamp: "11:00" },
  { id: "m1", from: "partner", text: "はじめまして! Rất vui được làm quen với bạn. Bạn đang học tiếng Nhật à?", timestamp: "11:02" },
  { id: "m2", from: "me", text: "Hi Yuki! はい、日本語を勉強しています。I'm at around N4 level now.", timestamp: "11:03", read: true, delivered: true },
  { id: "m3", from: "me", text: "Would you like to practice together sometime? 一緒に練習しましょう!", timestamp: "11:03", read: true, delivered: true },
  { id: "m4", from: "partner", text: "もちろん! Chắc chắn rồi. Bạn ở múi giờ nào?", timestamp: "11:05" },
  { id: "m5", from: "partner", text: "Mình ở Tokyo (UTC+9). Tối mình rảnh sau 20:00.", timestamp: "11:05" },
  { id: "m6", from: "me", text: "Vietnam, UTC+7. Tối mình cũng rảnh sau 19:30. 完璧です!", timestamp: "11:07", read: true, delivered: true },
  { id: "m7", from: "partner", text: "Tuyệt! 今夜、話しましょうか?", timestamp: "11:08" },
  { id: "m8", from: "me", voiceDuration: 8, timestamp: "11:10", read: true, delivered: true },
  { id: "m9", from: "partner", text: "おつかれさまでした!", timestamp: "11:12" },
]

export default function MessageThreadPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = use(params)
  const partner = conversations.find((c) => c.id === conversationId) ?? conversations[0]

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(true)
  const [recording, setRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  // Typing simulation
  useEffect(() => {
    const t = setTimeout(() => setTyping(false), 3200)
    return () => clearTimeout(t)
  }, [])

  // Record timer
  useEffect(() => {
    if (!recording) {
      setRecordTime(0)
      return
    }
    const t = setInterval(() => setRecordTime((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [recording])

  const send = useCallback(() => {
    if (!input.trim()) return
    setMessages((m) => [
      ...m,
      {
        id: `m-${Date.now()}`,
        from: "me",
        text: input.trim(),
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        delivered: true,
        read: false,
      },
    ])
    setInput("")
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }
  }, [input])

  const sendVoice = () => {
    setMessages((m) => [
      ...m,
      {
        id: `v-${Date.now()}`,
        from: "me",
        voiceDuration: recordTime,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        delivered: true,
      },
    ])
    setRecording(false)
  }

  const grouped = useMemo(() => {
    // Group consecutive messages from same sender
    const out: Array<{ key: string; msgs: Message[] }> = []
    messages.forEach((m, i) => {
      const prev = messages[i - 1]
      if (prev && prev.from === m.from && m.from !== "system") {
        out[out.length - 1].msgs.push(m)
      } else {
        out.push({ key: `g${i}`, msgs: [m] })
      }
    })
    return out
  }, [messages])

  return (
    <div className="fixed inset-0 flex bg-background md:relative md:h-[calc(100vh-4rem)] md:rounded-3xl md:shadow-ambient md:overflow-hidden">
      {/* Left: conversation list (desktop only) */}
      <aside className="hidden w-80 shrink-0 border-r border-border md:flex md:flex-col">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-lg font-semibold">Tin nhắn</h2>
          <Input placeholder="Tìm hội thoại..." className="mt-3 rounded-xl bg-surface-lowest" />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className={cn(
                "flex gap-3 border-b border-border/40 p-3 transition hover:bg-surface-low",
                c.id === conversationId && "bg-primary/5 border-l-4 border-l-primary",
              )}
            >
              <div className="relative">
                <Avatar className="size-11">
                  <AvatarImage src={c.avatar} alt={c.name} />
                  <AvatarFallback>{c.fallback}</AvatarFallback>
                </Avatar>
                {c.online && <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium truncate text-sm">{c.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex size-5 items-center justify-center self-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {c.unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      </aside>

      {/* Right: thread */}
      <main className="flex flex-1 flex-col bg-surface-lowest">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
          <Button variant="ghost" size="icon" className="size-9 md:hidden" asChild>
            <Link href="/messages">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src={partner.avatar} alt={partner.name} />
              <AvatarFallback>{partner.fallback}</AvatarFallback>
            </Avatar>
            {partner.online && <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success ring-2 ring-card" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{partner.name}</p>
            <p className="text-xs text-muted-foreground">
              {partner.online ? "Đang hoạt động" : "Ngoại tuyến"} · {partner.role}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <Phone className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <Video className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <Info className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <MoreHorizontal className="size-4" />
          </Button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-3">
            {grouped.map(({ key, msgs }) => {
              if (msgs[0].from === "system") {
                return (
                  <div key={key} className="flex justify-center py-2">
                    <span className="rounded-full bg-surface-low px-3 py-1 text-xs text-muted-foreground">
                      {msgs[0].text}
                    </span>
                  </div>
                )
              }
              const isMe = msgs[0].from === "me"
              return (
                <div key={key} className={cn("flex gap-2", isMe ? "justify-end" : "justify-start")}>
                  {!isMe && (
                    <Avatar className="size-8 self-end">
                      <AvatarImage src={partner.avatar} alt={partner.name} />
                      <AvatarFallback>{partner.fallback}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("flex max-w-[75%] flex-col gap-1", isMe ? "items-end" : "items-start")}>
                    {msgs.map((m) => (
                      <MessageBubble key={m.id} msg={m} isMe={isMe} />
                    ))}
                  </div>
                </div>
              )
            })}

            {typing && (
              <div className="flex gap-2">
                <Avatar className="size-8 self-end">
                  <AvatarImage src={partner.avatar} alt={partner.name} />
                  <AvatarFallback>{partner.fallback}</AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
                        className="size-1.5 rounded-full bg-muted-foreground"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <footer className="border-t border-border bg-card px-3 py-3 md:px-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            {!recording ? (
              <>
                <Button variant="ghost" size="icon" className="size-10 rounded-full shrink-0">
                  <Paperclip className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-10 rounded-full shrink-0">
                  <Smile className="size-4" />
                </Button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    e.target.style.height = "auto"
                    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px"
                  }}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                      e.preventDefault()
                      send()
                    }
                    if (e.key === "Escape") setInput("")
                  }}
                  rows={1}
                  placeholder="Nhập tin nhắn... (Ctrl+Enter để gửi)"
                  className="flex-1 resize-none rounded-2xl border border-border bg-surface-lowest px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {input.trim() ? (
                  <Button size="icon" onClick={send} className="size-10 rounded-full bg-gradient-primary shrink-0">
                    <Send className="size-4" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setRecording(true)}
                    className="size-10 rounded-full shrink-0"
                  >
                    <Mic className="size-4" />
                  </Button>
                )}
              </>
            ) : (
              <div className="flex w-full items-center gap-3 rounded-2xl bg-destructive/10 px-4 py-2">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="size-3 rounded-full bg-destructive"
                />
                <div className="flex-1 flex items-center gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, Math.random() * 16 + 4, 4] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.03 }}
                      className="w-0.5 rounded-full bg-destructive"
                    />
                  ))}
                </div>
                <span className="font-mono text-sm text-destructive font-bold">
                  {String(Math.floor(recordTime / 60)).padStart(2, "0")}:{String(recordTime % 60).padStart(2, "0")}
                </span>
                <Button size="icon" variant="ghost" onClick={() => setRecording(false)} className="size-9">
                  <X className="size-4" />
                </Button>
                <Button size="icon" onClick={sendVoice} className="size-9 rounded-full bg-gradient-primary">
                  <Send className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        </footer>
      </main>
    </div>
  )
}

function MessageBubble({ msg, isMe }: { msg: Message; isMe: boolean }) {
  const [showCorrect, setShowCorrect] = useState(false)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative"
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isMe
              ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm",
          )}
        >
          {msg.voiceDuration != null ? (
            <div className="flex items-center gap-2.5 min-w-32">
              <button className={cn(
                "flex size-8 items-center justify-center rounded-full",
                isMe ? "bg-white/20" : "bg-primary/10 text-primary"
              )}>
                <Square className="size-3 fill-current" />
              </button>
              <div className="flex-1 flex items-center gap-0.5">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-0.5 rounded-full",
                      isMe ? "bg-white/70" : "bg-primary/70",
                    )}
                    style={{ height: 4 + (i % 5) * 3 }}
                  />
                ))}
              </div>
              <span className={cn("text-xs font-mono", isMe ? "text-white/80" : "text-muted-foreground")}>
                0:{String(msg.voiceDuration).padStart(2, "0")}
              </span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-pretty leading-relaxed">{msg.text}</p>
          )}
        </div>

        <div
          className={cn(
            "mt-0.5 flex items-center gap-1 px-1 text-[10px] text-muted-foreground",
            isMe ? "justify-end" : "justify-start",
          )}
        >
          <span>{msg.timestamp}</span>
          {isMe && msg.delivered && (
            <CheckCheck className={cn("size-3", msg.read ? "text-primary" : "text-muted-foreground")} />
          )}
        </div>

        {/* Correction tool (only for partner messages with text) */}
        {!isMe && msg.text && (
          <button
            onClick={() => setShowCorrect((s) => !s)}
            className="absolute -top-3 right-0 translate-x-full opacity-0 group-hover:opacity-100 transition"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground shadow-ambient">
              <Plus className="size-2.5" /> Gợi ý sửa
            </span>
          </button>
        )}

        {showCorrect && !isMe && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 rounded-xl border border-accent/30 bg-accent/5 p-3"
          >
            <p className="text-xs font-semibold text-accent mb-1">Gợi ý sửa</p>
            <Input placeholder="Viết phiên bản đúng..." className="text-sm rounded-lg bg-card" />
            <div className="mt-2 flex gap-1 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setShowCorrect(false)}>Huỷ</Button>
              <Button size="sm" className="bg-accent">Gửi sửa</Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
