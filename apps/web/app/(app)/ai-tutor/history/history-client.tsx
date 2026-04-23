"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { deleteConversationAction, renameConversationAction } from "@/lib/api/actions"
import {
  Search,
  MessageSquare,
  Plane,
  Briefcase,
  BookOpen,
  Languages,
  Mic2,
  Star,
  Archive,
  Trash2,
  Download,
  Pencil,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Bot,
  Plus,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

type Conversation = {
  id: string
  title: string
  preview: string
  topic: "travel" | "interview" | "grammar" | "translation" | "roleplay" | "vocab"
  language: string
  flag: string
  messages: number
  date: string
  starred: boolean
  archived: boolean
  group: "today" | "week" | "month" | "older"
}

const topicMeta: Record<
  Conversation["topic"],
  { icon: typeof MessageSquare; label: string; gradient: string }
> = {
  travel: { icon: Plane, label: "Du lịch", gradient: "from-[#5352a5] to-[#a19ff9]" },
  interview: { icon: Briefcase, label: "Phỏng vấn", gradient: "from-[#702ae1] to-[#983772]" },
  grammar: { icon: BookOpen, label: "Ngữ pháp", gradient: "from-[#983772] to-[#a19ff9]" },
  translation: { icon: Languages, label: "Dịch", gradient: "from-[#a19ff9] to-[#5352a5]" },
  roleplay: { icon: Mic2, label: "Roleplay", gradient: "from-[#5352a5] to-[#702ae1]" },
  vocab: { icon: Sparkles, label: "Từ vựng", gradient: "from-[#702ae1] to-[#a19ff9]" },
}

const conversations: Conversation[] = [
  { id: "c001", title: "Hỏi đường ở Tokyo", preview: "Excuse me, could you tell me how to get to Shibuya station from here? I&apos;m a bit lost...", topic: "travel", language: "EN", flag: "🇬🇧", messages: 24, date: "2 giờ trước", starred: true, archived: false, group: "today" },
  { id: "c002", title: "Phỏng vấn Software Engineer", preview: "Tell me about a challenging project you worked on recently. What was your role and the outcome?", topic: "interview", language: "EN", flag: "🇬🇧", messages: 42, date: "5 giờ trước", starred: false, archived: false, group: "today" },
  { id: "c003", title: "Giải thích present perfect", preview: "Can you explain when to use present perfect vs simple past with more examples please", topic: "grammar", language: "EN", flag: "🇬🇧", messages: 18, date: "Hôm qua", starred: true, archived: false, group: "today" },
  { id: "c004", title: "Dịch email formal", preview: "Please translate this email to Japanese formal style, keeping business tone appropriate...", topic: "translation", language: "JA", flag: "🇯🇵", messages: 12, date: "2 ngày", starred: false, archived: false, group: "week" },
  { id: "c005", title: "Đóng vai khách hàng phàn nàn", preview: "I&apos;d like to complain about the service I received at your restaurant last night...", topic: "roleplay", language: "EN", flag: "🇬🇧", messages: 35, date: "3 ngày", starred: false, archived: false, group: "week" },
  { id: "c006", title: "Từ vựng IELTS — Technology", preview: "Quiz me on 20 advanced tech vocabulary words with collocations and natural examples", topic: "vocab", language: "EN", flag: "🇬🇧", messages: 28, date: "4 ngày", starred: true, archived: false, group: "week" },
  { id: "c007", title: "Keigo Business Japanese", preview: "お疲れ様です。来週の会議について確認させていただきたいのですが...", topic: "grammar", language: "JA", flag: "🇯🇵", messages: 16, date: "5 ngày", starred: false, archived: false, group: "week" },
  { id: "c008", title: "Ordering French pastries", preview: "Bonjour! Je voudrais essayer quelques pâtisseries traditionnelles, que recommandez-vous?", topic: "roleplay", language: "FR", flag: "🇫🇷", messages: 22, date: "7 ngày", starred: false, archived: false, group: "week" },
  { id: "c009", title: "Chinese HSK 4 grammar", preview: "请帮我解释「把」字句的用法，给一些常见的例子", topic: "grammar", language: "ZH", flag: "🇨🇳", messages: 31, date: "10 ngày", starred: false, archived: false, group: "month" },
  { id: "c010", title: "Korean TOPIK phrases", preview: "안녕하세요! 한국어 회화 연습을 도와주세요. 카페에서 주문하는 상황이에요", topic: "roleplay", language: "KO", flag: "🇰🇷", messages: 19, date: "2 tuần", starred: false, archived: false, group: "month" },
  { id: "c011", title: "Academic essay feedback", preview: "Could you review this essay about climate change and suggest improvements to structure?", topic: "grammar", language: "EN", flag: "🇬🇧", messages: 47, date: "3 tuần", starred: true, archived: false, group: "month" },
  { id: "c012", title: "Daily routine conversation", preview: "Let&apos;s talk about what you usually do in the morning and practice daily expressions", topic: "roleplay", language: "EN", flag: "🇬🇧", messages: 15, date: "4 tuần", starred: false, archived: false, group: "month" },
  { id: "c013", title: "Spanish subjunctive mood", preview: "Puedes explicarme el subjuntivo y cuándo usarlo con ejemplos reales por favor", topic: "grammar", language: "ES", flag: "🇪🇸", messages: 22, date: "5 tuần", starred: false, archived: true, group: "older" },
  { id: "c014", title: "Translate cover letter", preview: "I need help translating my cover letter to Japanese for a software engineering position", topic: "translation", language: "JA", flag: "🇯🇵", messages: 26, date: "6 tuần", starred: false, archived: true, group: "older" },
  { id: "c015", title: "Travel phrases for Paris", preview: "What are the most essential French phrases I should know for my upcoming trip to Paris?", topic: "travel", language: "FR", flag: "🇫🇷", messages: 33, date: "2 tháng", starred: true, archived: false, group: "older" },
]

const filterChips = [
  { id: "all", label: "Tất cả", icon: MessageSquare },
  { id: "week", label: "Tuần này", icon: null },
  { id: "month", label: "Tháng này", icon: null },
  { id: "starred", label: "Đã lưu", icon: Star },
  { id: "archived", label: "Lưu trữ", icon: Archive },
]

export default function AITutorHistoryClient({
  initialConversations,
}: {
  initialConversations?: Array<{ id: string; lastMessage: string; messageCount: number }>
}) {
  const [, startTransition] = useTransition()
  // Merge BFF data into mock data: update preview/messages from BFF where id matches, or prepend new BFF-only convs
  const base: Conversation[] = initialConversations && initialConversations.length > 0
    ? [
        ...initialConversations.map((bff) => ({
          id: bff.id,
          title: `Cuộc hội thoại #${bff.id.slice(0, 8)}`,
          preview: bff.lastMessage || "Tiếp tục cuộc trò chuyện...",
          topic: "roleplay" as Conversation["topic"],
          language: "EN",
          flag: "🇬🇧",
          messages: bff.messageCount,
          date: "Gần đây",
          starred: false,
          archived: false,
          group: "today" as const,
        })),
      ]
    : conversations

  const [list, setList] = useState<Conversation[]>(base)

  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("newest")

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((c) => c.id !== id))
    startTransition(() => { deleteConversationAction(id) })
  }

  const handleRename = (id: string, title: string) => {
    setList((prev) => prev.map((c) => c.id === id ? { ...c, title } : c))
    startTransition(() => { renameConversationAction(id, title) })
  }

  const merged = list
  const filtered = merged.filter((c) => {
    if (filter === "week" && c.group !== "today" && c.group !== "week") return false
    if (filter === "month" && c.group !== "month") return false
    if (filter === "starred" && !c.starred) return false
    if (filter === "archived" && !c.archived) return false
    if (filter === "all" && c.archived) return false
    if (
      query &&
      !c.title.toLowerCase().includes(query.toLowerCase()) &&
      !c.preview.toLowerCase().includes(query.toLowerCase())
    )
      return false
    return true
  })

  const grouped = {
    today: filtered.filter((c) => c.group === "today"),
    week: filtered.filter((c) => c.group === "week"),
    month: filtered.filter((c) => c.group === "month"),
    older: filtered.filter((c) => c.group === "older"),
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Hero */}
      <section
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-7 text-primary-foreground shadow-hover sm:p-9"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Link href="/ai-tutor" className="hover:text-white">
                AI Tutor
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-white">Lịch sử trò chuyện</span>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Bot className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Lịch sử <span className="text-[#dcc9ff]">trò chuyện</span>
                </h1>
                <p className="mt-1 max-w-md text-sm text-white/80 sm:text-base">
                  {merged.length} cuộc hội thoại · Quay lại bất cứ chủ đề nào bạn đã học cùng Lumi.
                </p>
              </div>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-primary shadow-ambient hover:bg-white/90"
          >
            <Link href="/ai-tutor">
              <Plus className="mr-2 h-4 w-4" /> Cuộc hội thoại mới
            </Link>
          </Button>
        </div>
      </section>

      {/* Search + filters */}
      <section
        data-aos="fade-up"
        className="rounded-3xl bg-surface-lowest p-4 shadow-ambient sm:p-5"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm trong tiêu đề, nội dung..."
              className="h-11 rounded-full border-0 bg-surface-low pl-11"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-11 w-[180px] rounded-full border-0 bg-surface-low">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="messages">Nhiều tin nhắn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {filterChips.map((chip) => {
            const Icon = chip.icon
            return (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === chip.id
                    ? "bg-gradient-primary text-primary-foreground shadow-ambient"
                    : "bg-surface-low text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {chip.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* List */}
      {filtered.length === 0 ? (
        <div
          data-aos="fade-up"
          className="rounded-3xl bg-surface-lowest p-16 text-center shadow-ambient"
        >
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-primary text-white shadow-hover">
            <MessageSquare className="h-8 w-8" />
          </span>
          <h3 className="mt-4 text-xl font-extrabold">Chưa có cuộc hội thoại nào</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Bắt đầu chat với Lumi để luyện bất kỳ kỹ năng nào.
          </p>
          <Button
            asChild
            className="mt-5 rounded-full bg-gradient-primary text-primary-foreground shadow-hover"
          >
            <Link href="/ai-tutor">
              <Plus className="mr-2 h-4 w-4" /> Bắt đầu chat
            </Link>
          </Button>
        </div>
      ) : (
        <section className="space-y-6">
          {(["today", "week", "month", "older"] as const).map((g) =>
            grouped[g].length > 0 ? (
              <div key={g} data-aos="fade-up" className="space-y-3">
                <h3 className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-widest text-accent">
                  {g === "today"
                    ? "Hôm nay"
                    : g === "week"
                      ? "Tuần này"
                      : g === "month"
                        ? "Tháng này"
                        : "Cũ hơn"}
                  <span className="rounded-full bg-surface-low px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {grouped[g].length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {grouped[g].map((c, i) => (
                    <ConversationRow
                      key={c.id}
                      conversation={c}
                      index={i}
                      onDelete={() => handleDelete(c.id)}
                      onRename={(title) => handleRename(c.id, title)}
                    />
                  ))}
                </div>
              </div>
            ) : null,
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between rounded-3xl bg-surface-lowest p-4 shadow-ambient">
            <p className="text-sm text-muted-foreground">
              Hiển thị <span className="font-bold text-foreground">{filtered.length}</span> /{" "}
              {merged.length} cuộc hội thoại
            </p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="rounded-full bg-surface-low"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-gradient-primary px-4 text-primary-foreground shadow-ambient hover:opacity-95"
              >
                1
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-surface-low">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function ConversationRow({
  conversation,
  index,
  onDelete,
  onRename,
}: {
  conversation: Conversation
  index: number
  onDelete: () => void
  onRename: (title: string) => void
}) {
  const topic = topicMeta[conversation.topic]
  const TopicIcon = topic.icon

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={index * 30}
      className="group flex items-start gap-4 rounded-3xl bg-surface-lowest p-5 shadow-ambient transition-all hover:-translate-y-0.5 hover:shadow-hover"
    >
      <Link
        href={`/ai-tutor/${conversation.id}`}
        className="flex flex-1 items-start gap-4 min-w-0"
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-ambient ${topic.gradient}`}
        >
          <TopicIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-bold group-hover:text-primary">
              {conversation.title}
            </h4>
            {conversation.starred && (
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
            )}
            {conversation.archived && (
              <Archive className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            {conversation.preview}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-low px-2 py-0.5 font-medium">
              <span>{conversation.flag}</span>
              {conversation.language}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-low px-2 py-0.5 font-medium text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {conversation.messages}
            </span>
            <span className="rounded-full bg-accent-container px-2 py-0.5 font-bold text-on-accent-container">
              {topic.label}
            </span>
            <span className="text-muted-foreground">· {conversation.date}</span>
          </div>
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-2xl">
          <DropdownMenuItem onClick={() => {
            const t = window.prompt("Tên mới:", conversation.title)
            if (t && t.trim()) onRename(t.trim())
          }}>
            <Pencil className="mr-2 h-3.5 w-3.5" /> Đổi tên
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Star className="mr-2 h-3.5 w-3.5" />
            {conversation.starred ? "Bỏ đánh dấu" : "Đánh dấu sao"}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Archive className="mr-2 h-3.5 w-3.5" />
            {conversation.archived ? "Bỏ lưu trữ" : "Lưu trữ"}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="mr-2 h-3.5 w-3.5" /> Xuất file
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Xoá
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
