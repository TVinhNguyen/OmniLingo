"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Search, MessageCircle, User, Users2, ArrowRight } from "lucide-react"
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
  type: "1-1" | "group"
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
    type: "1-1",
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
    type: "1-1",
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
    type: "1-1",
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
    type: "group",
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
    type: "1-1",
  },
]

export default function MessagesHubPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Tin nhắn</h1>
        <p className="mt-1 text-muted-foreground">Quản lý các cuộc trò chuyện của bạn</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm cuộc trò chuyện hoặc tin nhắn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 rounded-full bg-surface-lowest"
          />
        </div>
      </div>

      {/* Conversations grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-3 md:gap-4">
          {filtered.map((conv, i) => (
            <motion.div key={conv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/messages/${conv.id}`}>
                <Card className="group cursor-pointer overflow-hidden rounded-2xl border-border/60 bg-surface-lowest p-4 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover md:p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-3 min-w-0">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conv.avatar} alt={conv.name} />
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
                            {conv.fallback}
                          </AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-lowest bg-success" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 justify-between flex-wrap">
                          <p className="font-semibold group-hover:text-primary transition-colors">{conv.name}</p>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {conv.type === "group" && <Users2 className="h-3 w-3 text-muted-foreground" />}
                          {conv.type === "1-1" && <MessageCircle className="h-3 w-3 text-muted-foreground" />}
                          <p className="text-xs text-muted-foreground">{conv.role}</p>
                        </div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      {conv.unread > 0 && (
                        <Badge className="shrink-0 rounded-full bg-primary text-[10px] text-primary-foreground">
                          {conv.unread}
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">Không tìm thấy cuộc trò chuyện nào</p>
        </div>
      )}
    </div>
  )
}
