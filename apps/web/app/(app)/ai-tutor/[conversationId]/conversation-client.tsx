"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import Link from "next/link"
import {
  Bot,
  Send,
  Mic,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  History,
  Copy,
  Sparkles,
  Languages,
  Lightbulb,
  RotateCw,
  ArrowLeft,
  Volume2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "motion/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { tutorChatAction, renameConversationAction, deleteConversationAction } from "../actions"
import type { ChatHistoryMessage } from "@/lib/api/types"

interface ConversationClientProps {
  conversationId: string
  initialMessages: ChatHistoryMessage[]
}

const quickReplies = [
  { icon: Languages, label: "Dịch câu này" },
  { icon: Volume2, label: "Phát âm câu" },
  { icon: Lightbulb, label: "Giải thích ngữ pháp" },
  { icon: Sparkles, label: "Gợi ý phản hồi" },
]

export default function ConversationClient({
  conversationId,
  initialMessages,
}: ConversationClientProps) {
  const [messages, setMessages] = useState<ChatHistoryMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [, startTransition] = useTransition()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatHistoryMessage = { role: "user", content: text }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setTyping(true)

    startTransition(async () => {
      const result = await tutorChatAction(conversationId, text)
      setTyping(false)
      if (result?.reply) {
        setMessages((m) => [...m, { role: "assistant", content: result.reply }])
      }
    })
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-4xl flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-3xl bg-surface-lowest p-4 shadow-ambient">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="rounded-full bg-surface-low">
            <Link href="/ai-tutor/history">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Link href="/ai-tutor" className="hover:text-foreground">AI Tutor</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="truncate">Cuộc hội thoại</span>
            </div>
            <p className="text-[11px] text-muted-foreground">ID {conversationId}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="sm" className="hidden rounded-full bg-surface-low sm:inline-flex">
            <Link href="/ai-tutor/history">
              <History className="mr-1.5 h-3.5 w-3.5" />
              Lịch sử
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl">
              <DropdownMenuItem onClick={() => {
                const title = prompt("Tên mới:")
                if (title) renameConversationAction(conversationId, title)
              }}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Đổi tên
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteConversationAction(conversationId)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Xoá cuộc hội thoại
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-3xl bg-surface-lowest p-4 shadow-ambient sm:p-6"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có tin nhắn nào. Bắt đầu cuộc hội thoại!
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m, idx) => (
              <MessageBubble key={idx} message={m} index={idx} />
            ))}
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-fluency text-white shadow-ambient">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-surface-low px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 0.15, 0.3].map((d) => (
                      <motion.span
                        key={d}
                        className="h-2 w-2 rounded-full bg-accent"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: d }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="rounded-3xl bg-surface-lowest p-4 shadow-ambient">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {quickReplies.map((q) => {
            const Icon = q.icon
            return (
              <button
                key={q.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-low px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent-container hover:text-on-accent-container"
              >
                <Icon className="h-3 w-3" />
                {q.label}
              </button>
            )
          })}
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            placeholder="Nhắn tin cho Lumi... (Enter để gửi, Shift+Enter để xuống dòng)"
            className="min-h-[48px] resize-none rounded-2xl border-0 bg-surface-low focus-visible:ring-2 focus-visible:ring-ring"
            rows={1}
          />
          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full bg-surface-low">
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="h-11 rounded-full bg-gradient-primary px-5 text-primary-foreground shadow-hover hover:opacity-95 disabled:opacity-50"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Gửi
          </Button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message, index }: { message: ChatHistoryMessage; index: number }) {
  const isUser = message.role === "user"
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4) }}
      className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-white shadow-ambient",
          isUser ? "bg-gradient-to-br from-[#702ae1] to-[#983772]" : "bg-gradient-fluency",
        )}
      >
        {isUser ? <span className="text-xs font-bold">You</span> : <Bot className="h-4 w-4" />}
      </span>

      <div className={cn("max-w-[78%] space-y-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-gradient-primary text-primary-foreground shadow-ambient"
              : "rounded-tl-sm bg-surface-low",
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={cn("flex gap-2 text-[11px] text-muted-foreground", isUser && "justify-end")}>
          <button onClick={copy} className="inline-flex items-center gap-1 hover:text-foreground">
            <Copy className="h-3 w-3" />
            {copied ? "Đã copy" : "Copy"}
          </button>
          {!isUser && (
            <button className="inline-flex items-center gap-1 hover:text-foreground">
              <RotateCw className="h-3 w-3" /> Tạo lại
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
