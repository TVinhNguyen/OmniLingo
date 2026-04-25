"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Search, Send, Paperclip, Phone, Video, MoreHorizontal, Smile, Image as ImageIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Conversation = {
  id: string
  name: string
  role: string
  avatar: string
  fallback: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
}

const conversations: Conversation[] = [
  {
    id: "emma",
    name: "Emma Harrison",
    role: "Giáo viên IELTS",
    avatar: "/tutor-emma.jpg",
    fallback: "EH",
    lastMessage: "Sẵn sàng cho buổi học sáng mai không?",
    time: "34 phút",
    unread: 2,
    online: true,
  },
  {
    id: "kenji",
    name: "Kenji Tanaka",
    role: "Giáo viên tiếng Nhật",
    avatar: "/tutor-kenji.jpg",
    fallback: "KT",
    lastMessage: "Bài tập hôm qua rất tốt!",
    time: "3 giờ",
    unread: 0,
    online: true,
  },
  {
    id: "sophie",
    name: "Sophie Martin",
    role: "Giáo viên tiếng Pháp",
    avatar: "/tutor-sophie.jpg",
    fallback: "SM",
    lastMessage: "Đừng quên ôn từ vựng chương 4 nhé.",
    time: "1 ngày",
    unread: 0,
    online: false,
  },
  {
    id: "study-group",
    name: "Nhóm JLPT N3 2026",
    role: "Cộng đồng · 124 thành viên",
    avatar: "",
    fallback: "JP",
    lastMessage: "Linh: Có ai luyện đọc tối nay không?",
    time: "2 ngày",
    unread: 12,
    online: false,
  },
  {
    id: "carlos",
    name: "Carlos Vega",
    role: "Giáo viên tiếng Tây Ban Nha",
    avatar: "/tutor-carlos.jpg",
    fallback: "CV",
    lastMessage: "Hẹn gặp bạn thứ 6 nhé!",
    time: "3 ngày",
    unread: 0,
    online: false,
  },
]

type ChatMessage = { id: number; from: "me" | "them"; text: string; time: string }

const defaultMessages: ChatMessage[] = [
  {
    id: 1,
    from: "them",
    text: "Xin chào Minh Anh! Hôm qua em làm bài Writing Task 2 rất tốt. Điểm mạnh là ý tưởng rõ ràng!",
    time: "09:22",
  },
  {
    id: 2,
    from: "them",
    text: "Chỗ em cần cải thiện là dùng linking words tự nhiên hơn. Anh gửi em bộ 50 linking words thường dùng nhé.",
    time: "09:23",
  },
  { id: 3, from: "me", text: "Cảm ơn thầy! Em rất muốn cải thiện chỗ đó.", time: "09:45" },
  { id: 4, from: "me", text: "Sáng mai buổi học của mình lúc 8:00 phải không ạ?", time: "09:45" },
  { id: 5, from: "them", text: "Đúng rồi. Em chuẩn bị sẵn 3 topic định luyện trước nhé.", time: "09:46" },
  { id: 6, from: "them", text: "Sẵn sàng cho buổi học sáng mai không?", time: "10:12" },
]

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0].id)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages)
  const active = conversations.find((c) => c.id === activeId)!

  function send() {
    if (!input.trim()) return
    setMessages((m) => [
      ...m,
      {
        id: m.length + 1,
        from: "me",
        text: input.trim(),
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      },
    ])
    setInput("")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <h1 className="sr-only">Tin nhắn</h1>
      <Card className="grid h-[calc(100vh-7rem)] overflow-hidden rounded-3xl border border-border bg-surface-lowest shadow-ambient md:grid-cols-[320px_1fr]">
        {/* Conversations list */}
        <aside className="flex flex-col border-r border-border">
          <div className="border-b border-border p-4">
            <h2 className="text-lg font-bold tracking-tight">Tin nhắn</h2>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm cuộc trò chuyện..."
                className="rounded-full bg-surface-low pl-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border/60 p-4 text-left transition-colors hover:bg-surface-low",
                  activeId === c.id && "bg-surface-low"
                )}
              >
                <div className="relative">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={c.avatar} alt={c.name} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
                      {c.fallback}
                    </AvatarFallback>
                  </Avatar>
                  {c.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-lowest bg-success" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-bold">{c.name}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="flex-1 truncate text-sm text-muted-foreground">{c.lastMessage}</p>
                    {c.unread > 0 && (
                      <Badge className="shrink-0 rounded-full bg-primary text-[10px] text-primary-foreground">
                        {c.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat panel */}
        <section className="flex flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={active.avatar} alt={active.name} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
                  {active.fallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{active.name}</p>
                <p className="text-xs text-muted-foreground">
                  {active.online ? "Đang hoạt động" : active.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-surface-low/30 p-5 scrollbar-thin">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-ambient",
                    m.from === "me"
                      ? "rounded-br-sm bg-gradient-primary text-primary-foreground"
                      : "rounded-bl-sm bg-surface-lowest"
                  )}
                >
                  <p className="text-pretty leading-relaxed">{m.text}</p>
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {m.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <footer className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-full bg-surface-low p-1.5">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button variant="ghost" size="icon" className="rounded-full">
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                onClick={send}
                size="icon"
                className="rounded-full bg-gradient-primary text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </footer>
        </section>
      </Card>
    </div>
  )
}
