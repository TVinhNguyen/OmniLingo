"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Gamepad2,
  Globe,
  Pencil,
  Plus,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Trophy,
  Volume2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { DeckDetail, DeckCard } from "@/lib/api/types"

type CardStatus = "new" | "learning" | "mastered" | "all"

export default function DeckClient({
  deck,
  cards,
}: {
  deck: DeckDetail
  cards: DeckCard[]
}) {
  const router = useRouter()
  const id = deck.id

  const [filter, setFilter] = useState<CardStatus | "all">("all")
  const [page, setPage] = useState(1)
  const perPage = 20

  // Derive stats from BFF card data
  const newCount      = cards.filter((c) => c.status === "new" || !c.status).length
  const learningCount = cards.filter((c) => c.status === "learning").length
  const masteredCount = cards.filter((c) => c.status === "mastered").length
  const dueCount      = deck.dueCount

  const filteredCards = useMemo(
    () => filter === "all" ? cards : cards.filter((c) => (c.status ?? "new") === filter),
    [cards, filter],
  )
  const pagedCards   = filteredCards.slice((page - 1) * perPage, page * perPage)
  const totalPages   = Math.max(1, Math.ceil(filteredCards.length / perPage))

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return
      if (e.key.toLowerCase() === "l") router.push(`/practice/vocabulary/decks/${id}/learn`)
      if (e.key.toLowerCase() === "r") router.push(`/practice/vocabulary/decks/${id}/review`)
      if (e.key.toLowerCase() === "n") router.push(`/practice/vocabulary/decks/${id}/add-card`)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [id, router])

  const primaryAction = newCount > 0
    ? { href: `/practice/vocabulary/decks/${id}/learn`, label: "Bắt đầu học" }
    : dueCount > 0
      ? { href: `/practice/vocabulary/decks/${id}/review`, label: "Ôn tập ngay" }
      : { href: "#", label: "Hết phần hôm nay 🎉" }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/practice" className="hover:text-foreground">Practice</Link>
        <ChevronRight className="size-3" />
        <Link href="/practice/vocabulary" className="hover:text-foreground">Vocabulary</Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium">{deck.name}</span>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-8 text-white shadow-hover"
      >
        <div className="flex items-start gap-6">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-5xl backdrop-blur-sm">
            📚
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm opacity-90 mb-2">
              <span>{deck.cardCount} thẻ</span>
              <span>·</span>
              <span>{dueCount} đến hạn</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              {deck.name}
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 -mx-4 px-4 py-2 sm:mx-0 sm:px-0">
        <div className="glass rounded-2xl border border-border p-3 shadow-ambient">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="lg"
              asChild
              className="h-12 w-full bg-gradient-primary text-base font-semibold shadow-hover sm:w-64"
            >
              <Link href={primaryAction.href}>
                <Sparkles className="mr-2 size-5" />
                {primaryAction.label}
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 rounded-xl" asChild>
              <Link href={`/practice/vocabulary/match?deck=${id}`}>
                <Gamepad2 className="mr-2 size-4" /> Game
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 rounded-xl hidden md:inline-flex">
              <Trophy className="mr-2 size-4" /> Stats
            </Button>
            <Button variant="outline" size="lg" className="h-12 rounded-xl hidden md:inline-flex">
              <Settings className="mr-2 size-4" /> Cài đặt
            </Button>
            <Button variant="outline" size="lg" className="h-12 rounded-xl hidden sm:inline-flex">
              <Share2 className="mr-2 size-4" /> Chia sẻ
            </Button>
            <Button variant="outline" size="lg" className="h-12 rounded-xl hidden sm:inline-flex">
              <Pencil className="mr-2 size-4" /> Chỉnh sửa
            </Button>
            <div className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground md:flex">
              <kbd className="rounded bg-surface-low px-2 py-0.5 font-mono">L</kbd> Học
              <kbd className="rounded bg-surface-low px-2 py-0.5 font-mono">R</kbd> Ôn
              <kbd className="rounded bg-surface-low px-2 py-0.5 font-mono">N</kbd> Thêm
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Mới", value: newCount, color: "text-primary", bg: "bg-primary/10" },
          { label: "Đang học", value: learningCount, color: "text-warning", bg: "bg-warning/10" },
          { label: "Đến hạn", value: dueCount, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Đã thuộc", value: masteredCount, color: "text-success", bg: "bg-success/10" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/60 shadow-ambient">
              <CardContent className="p-4">
                <div className={cn("inline-flex rounded-lg px-2 py-1 text-xs font-medium mb-3", s.bg, s.color)}>
                  {s.label}
                </div>
                <div className={cn("font-display text-3xl font-bold", s.color)}>{s.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Heatmap — placeholder until activityHeatmap resolver (P2) */}
      <Card className="border-border/60 shadow-ambient">
        <CardContent className="p-5">
          <div className="mb-1 font-semibold">Hoạt động 90 ngày qua</div>
          <p className="text-xs text-muted-foreground mb-4">Số thẻ bạn ôn tập mỗi ngày</p>
          <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto">
            {Array.from({ length: 90 }, (_, i) => (
              <div key={i} className="size-3 rounded bg-surface-low" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card table */}
      <Card className="border-border/60 shadow-ambient">
        <CardContent className="p-5">
          <Tabs value={filter} onValueChange={(v) => { setFilter(v as CardStatus | "all"); setPage(1) }}>
            <TabsList className="mb-4 bg-surface-low">
              <TabsTrigger value="all">Tất cả ({cards.length})</TabsTrigger>
              <TabsTrigger value="new">Mới ({newCount})</TabsTrigger>
              <TabsTrigger value="learning">Đang học ({learningCount})</TabsTrigger>
              <TabsTrigger value="mastered">Đã thuộc ({masteredCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-3 py-2 text-left font-medium">Lemma</th>
                  <th className="px-3 py-2 text-left font-medium">IPA</th>
                  <th className="px-3 py-2 text-left font-medium">Nghĩa</th>
                  <th className="px-3 py-2 text-left font-medium">POS</th>
                  <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
                  <th className="px-3 py-2 text-right font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pagedCards.map((c) => (
                  <tr key={c.id} className="border-b border-border/40 hover:bg-surface-low/60 transition">
                    <td className="px-3 py-3 font-semibold">{c.lemma}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{c.ipa}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.meaning}</td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className="text-xs">{c.pos}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="size-8">
                          <Volume2 className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8">
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Trang {page} / {totalPages} · {filteredCards.length} thẻ
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ArrowLeft className="size-3 mr-1" /> Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau <ChevronRight className="size-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating add */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button
          asChild
          size="lg"
          className="h-14 rounded-full bg-gradient-primary px-6 shadow-hover hover:shadow-hover"
        >
          <Link href={`/practice/vocabulary/decks/${id}/add-card`}>
            <Plus className="mr-2 size-5" />
            Thêm thẻ
          </Link>
        </Button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status?: string }) {
  const s = status ?? "new"
  const config: Record<string, { label: string; className: string }> = {
    new:      { label: "Mới",     className: "bg-primary/10 text-primary border-primary/20" },
    learning: { label: "Đang học", className: "bg-warning/10 text-warning border-warning/20" },
    mastered: { label: "Đã thuộc", className: "bg-success/10 text-success border-success/20" },
  }
  const c = config[s] ?? config.new
  return (
    <Badge variant="outline" className={cn("text-xs font-medium border", c.className)}>
      {c.label}
    </Badge>
  )
}
