"use client"

import { useState, useRef, useEffect, use } from "react"
import Link from "next/link"
import {
  Bot,
  Send,
  Mic,
  Image as ImageIcon,
  Volume2,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Archive,
  Trash2,
  History,
  Copy,
  Sparkles,
  Plane,
  Languages,
  Star,
  Lightbulb,
  RotateCw,
  ArrowLeft,
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

type Message = {
  id: number
  role: "user" | "ai"
  content: string
  translation?: string
  corrections?: { original: string; corrected: string; note: string }[]
  vocab?: { word: string; meaning: string }[]
}

const conversationMeta = {
  title: "Hỏi đường ở Tokyo",
  topic: "Du lịch",
  topicGradient: "from-[#5352a5] to-[#a19ff9]",
  created: "Hôm nay · 14:20",
  language: "English",
  flag: "🇬🇧",
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    content:
      "Hi there! Let's practice some travel conversation. Imagine you just arrived in Tokyo and need to get to Shibuya station. Try asking a local for directions — I'll play the local resident. Ready?",
    translation:
      "Xin chào! Hãy luyện hội thoại du lịch. Tưởng tượng bạn vừa tới Tokyo và cần đến ga Shibuya. Hỏi người dân địa phương đường đi — tôi sẽ đóng vai người dân. Sẵn sàng chưa?",
  },
  {
    id: 2,
    role: "user",
    content: "Excuse me, could you tell me how to go Shibuya station please?",
    corrections: [
      {
        original: "how to go Shibuya station",
        corrected: "how to get to Shibuya station",
        note: "Dùng 'get to' thay vì 'go' khi hỏi đường",
      },
    ],
  },
  {
    id: 3,
    role: "ai",
    content:
      "Of course! Shibuya station is just two stops away on the Yamanote Line. You can take the train from platform 3 here. It's about 5 minutes. Would you like me to show you the ticket machine?",
    translation:
      "Tất nhiên! Ga Shibuya chỉ cách đây hai ga trên tuyến Yamanote. Bạn có thể đi tàu từ sân số 3. Khoảng 5 phút. Bạn có muốn tôi chỉ máy bán vé không?",
    vocab: [
      { word: "platform", meaning: "sân ga" },
      { word: "Yamanote Line", meaning: "tuyến JR chạy vòng Tokyo" },
    ],
  },
  {
    id: 4,
    role: "user",
    content: "Yes please, that would be very helpful. How much is the ticket?",
  },
  {
    id: 5,
    role: "ai",
    content:
      "The ticket to Shibuya costs 170 yen. The machine accepts coins and bills. You can also use an IC card like Suica or Pasmo if you have one — it's faster and you don't need to buy a ticket every time!",
    translation:
      "Vé đến Shibuya giá 170 yên. Máy chấp nhận xu và tiền giấy. Bạn cũng có thể dùng thẻ IC như Suica hoặc Pasmo — nhanh hơn và không cần mua vé mỗi lần!",
    vocab: [
      { word: "IC card", meaning: "thẻ giao thông điện tử" },
      { word: "Suica / Pasmo", meaning: "hai loại thẻ phổ biến nhất" },
    ],
  },
  {
    id: 6,
    role: "user",
    content: "Great! I don't have IC card. I will buy paper ticket. Thank you so much!",
    corrections: [
      {
        original: "I don't have IC card",
        corrected: "I don't have an IC card",
        note: "Thêm mạo từ 'an' trước danh từ đếm được số ít",
      },
      {
        original: "I will buy paper ticket",
        corrected: "I'll buy a paper ticket",
        note: "Thêm 'a' và dùng contraction 'I'll' tự nhiên hơn",
      },
    ],
  },
  {
    id: 7,
    role: "ai",
    content:
      "You're very welcome! Safe travels and enjoy Shibuya — don't miss the famous scramble crossing! 🚦\n\nGreat practice! Your English is already conversational. Want to try a more complex scenario next?",
    translation:
      "Không có gì! Chúc bạn đi đường bình an và thích Shibuya — đừng bỏ qua ngã tư scramble nổi tiếng nhé! Luyện tốt lắm! Tiếng Anh của bạn đã rất tự nhiên. Muốn thử tình huống phức tạp hơn không?",
  },
]

const quickReplies = [
  { icon: Languages, label: "Dịch câu này" },
  { icon: Volume2, label: "Phát âm câu" },
  { icon: Lightbulb, label: "Giải thích ngữ pháp" },
  { icon: Sparkles, label: "Gợi ý phản hồi" },
]

export default function AITutorConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = use(params)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [showTranslation, setShowTranslation] = useState<Record<number, boolean>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, typing])

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now(), role: "user", content: text }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        role: "ai",
        content:
          "Nice! Let me continue the scenario. You arrive at the ticket machine. There are many buttons. What would you ask next?",
        translation:
          "Tốt! Tôi tiếp tục kịch bản. Bạn tới máy bán vé, có nhiều nút. Bạn sẽ hỏi gì tiếp theo?",
      }
      setMessages((m) => [...m, reply])
      setTyping(false)
    }, 1200)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-4xl flex-col space-y-4">
      {/* Breadcrumb + actions */}
      <div
        data-aos="fade-up"
        className="flex items-center justify-between rounded-3xl bg-surface-lowest p-4 shadow-ambient"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full bg-surface-low"
          >
            <Link href="/ai-tutor/history">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-ambient ${conversationMeta.topicGradient}`}
          >
            <Plane className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Link href="/ai-tutor" className="hover:text-foreground">
                AI Tutor
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="truncate">{conversationMeta.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-extrabold">
                {conversationMeta.title}
              </h1>
              <span className="rounded-full bg-accent-container px-2 py-0.5 text-[10px] font-bold text-on-accent-container">
                {conversationMeta.topic}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {conversationMeta.created} · {conversationMeta.flag}{" "}
              {conversationMeta.language} · ID {conversationId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden rounded-full bg-surface-low sm:inline-flex"
          >
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
              <DropdownMenuItem>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Đổi tên
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="mr-2 h-3.5 w-3.5" /> Đánh dấu sao
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-3.5 w-3.5" /> Lưu trữ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
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
        <div className="space-y-5">
          {messages.map((m, idx) => (
            <MessageBubble
              key={m.id}
              message={m}
              showTranslation={!!showTranslation[m.id]}
              onToggleTranslation={() =>
                setShowTranslation((p) => ({ ...p, [m.id]: !p[m.id] }))
              }
              index={idx}
            />
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
      </div>

      {/* Composer */}
      <div
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-4 shadow-ambient"
      >
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
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full bg-surface-low"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full bg-surface-low"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => send(input)}
            disabled={!input.trim()}
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

function MessageBubble({
  message,
  showTranslation,
  onToggleTranslation,
  index,
}: {
  message: Message
  showTranslation: boolean
  onToggleTranslation: () => void
  index: number
}) {
  const isUser = message.role === "user"

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
          isUser
            ? "bg-gradient-to-br from-[#702ae1] to-[#983772]"
            : "bg-gradient-fluency",
        )}
      >
        {isUser ? (
          <span className="text-xs font-bold">You</span>
        ) : (
          <Bot className="h-4 w-4" />
        )}
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

        {/* AI translation toggle */}
        {!isUser && message.translation && (
          <div>
            <button
              onClick={onToggleTranslation}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
            >
              <Languages className="h-3 w-3" />
              {showTranslation ? "Ẩn dịch" : "Hiện dịch"}
            </button>
            <AnimatePresence>
              {showTranslation && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 rounded-xl bg-accent-container px-3 py-2 text-[12px] leading-relaxed text-on-accent-container"
                >
                  {message.translation}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Corrections for user */}
        {isUser && message.corrections && message.corrections.length > 0 && (
          <div className="rounded-2xl bg-amber-50 px-3 py-2.5 text-[12px]">
            <p className="flex items-center gap-1 font-bold text-amber-700">
              <Lightbulb className="h-3 w-3" /> Gợi ý chỉnh sửa
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {message.corrections.map((c, i) => (
                <li key={i}>
                  <p className="leading-relaxed">
                    <span className="rounded bg-destructive/10 px-1 text-destructive line-through decoration-destructive">
                      {c.original}
                    </span>{" "}
                    →{" "}
                    <span className="rounded bg-success/15 px-1 font-semibold text-success">
                      {c.corrected}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {c.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vocab extract for AI */}
        {!isUser && message.vocab && message.vocab.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.vocab.map((v) => (
              <span
                key={v.word}
                className="inline-flex items-center gap-1 rounded-full bg-surface-lowest px-2.5 py-1 text-[11px] font-medium shadow-ambient"
              >
                <Sparkles className="h-2.5 w-2.5 text-accent" />
                <span className="font-bold">{v.word}</span>
                <span className="text-muted-foreground">· {v.meaning}</span>
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div
          className={cn(
            "flex gap-2 text-[11px] text-muted-foreground",
            isUser && "justify-end",
          )}
        >
          {!isUser && (
            <>
              <button className="inline-flex items-center gap-1 hover:text-foreground">
                <Volume2 className="h-3 w-3" /> Nghe
              </button>
              <button className="inline-flex items-center gap-1 hover:text-foreground">
                <Copy className="h-3 w-3" /> Copy
              </button>
              <button className="inline-flex items-center gap-1 hover:text-foreground">
                <RotateCw className="h-3 w-3" /> Tạo lại
              </button>
            </>
          )}
          {isUser && (
            <button className="inline-flex items-center gap-1 hover:text-foreground">
              <Pencil className="h-3 w-3" /> Sửa
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
