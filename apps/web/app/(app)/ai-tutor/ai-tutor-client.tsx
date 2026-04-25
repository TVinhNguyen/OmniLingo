"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Sparkles,
  Send,
  Mic,
  Image as ImageIcon,
  Volume2,
  BookOpen,
  MessageSquare,
  Languages,
  Lightbulb,
  Copy,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { FeatureSummary } from "@/lib/api/types"
import { chatAction } from "./actions"

const suggestions = [
  { icon: MessageSquare, label: "Roleplay: ordering food at a café" },
  { icon: BookOpen, label: "Explain past perfect with examples" },
  { icon: Languages, label: "Translate: 'Tôi muốn đặt bàn cho hai người'" },
  { icon: Lightbulb, label: "Quiz me on 10 travel words" },
]

type Message = {
  id: number
  role: "user" | "ai"
  content: string
  translation?: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    content:
      "Hi! I'm Lumi, your personal AI tutor. We can chat in English or any language you're learning. What would you like to practice today?",
    translation: "Xin chào! Tôi là Lumi, trợ giảng AI của bạn. Bạn muốn luyện gì hôm nay?",
  },
]

export function AiTutorClient({ feature }: { feature: FeatureSummary }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  const send = async (text: string) => {
    if (!text.trim()) return
    setError(null)
    const userMsg: Message = { id: Date.now(), role: "user", content: text }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setTyping(true)

    if (feature.allowed) {
      const result = await chatAction(conversationId, text, "ja")
      setTyping(false)
      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        if (result.data.conversationId) setConversationId(result.data.conversationId)
        const reply: Message = { id: Date.now() + 1, role: "ai", content: result.data.message.content }
        setMessages((m) => [...m, reply])
      }
    } else {
      setTimeout(() => {
        const reply: Message = {
          id: Date.now() + 1,
          role: "ai",
          content: "Nâng cấp Premium để dùng AI Tutor không giới hạn 🎓",
        }
        setMessages((m) => [...m, reply])
        setTyping(false)
      }, 800)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-5xl flex-col">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              <Sparkles className="mr-1 size-3" />
              AI Tutor
            </Badge>
            <Badge variant="outline" className="rounded-full text-xs">
              {feature.quota} lượt còn lại
            </Badge>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Lumi</h1>
          <p className="text-sm text-muted-foreground">
            Your 24/7 conversation partner and grammar coach
          </p>
        </div>
        <Button variant="outline" className="rounded-full bg-transparent">
          New conversation
        </Button>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden border-border/60 bg-card/80 shadow-soft">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
                >
                  <Avatar className="size-9 shrink-0">
                    {m.role === "ai" ? (
                      <AvatarFallback className="bg-primary/15 text-primary">
                        <Sparkles className="size-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-accent text-foreground">You</AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "ai"
                        ? "rounded-tl-sm bg-accent/60 text-foreground"
                        : "rounded-tr-sm bg-primary text-primary-foreground",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.translation && (
                      <p className="mt-2 border-t border-border/50 pt-2 text-xs italic text-muted-foreground">
                        {m.translation}
                      </p>
                    )}
                    {m.role === "ai" && (
                      <div className="mt-3 flex gap-1">
                        <button className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                          <Volume2 className="size-3" />
                          Listen
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                          <Languages className="size-3" />
                          Translate
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                          <Copy className="size-3" />
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/15 text-primary">
                    <Sparkles className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-accent/60 px-4 py-3">
                  <motion.span
                    className="size-2 rounded-full bg-primary/60"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                  />
                  <motion.span
                    className="size-2 rounded-full bg-primary/60"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.15 }}
                  />
                  <motion.span
                    className="size-2 rounded-full bg-primary/60"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="border-t border-border/60 px-6 py-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Try asking
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => send(s.label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  <s.icon className="size-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="border-t border-border/60 bg-card/60 p-4">
          <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-background p-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ImageIcon className="size-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              rows={1}
              placeholder="Ask anything about your target language..."
              className="min-h-9 resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mic className="size-4" />
            </Button>
            <Button
              onClick={() => send(input)}
              disabled={!input.trim()}
              size="icon"
              className="rounded-full"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Lumi can make mistakes. Verify important information.
          </p>
        </div>
      </Card>
    </div>
  )
}
