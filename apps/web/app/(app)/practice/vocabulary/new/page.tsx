"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, Plus, Trash2, Upload, Sparkles, Save, Globe, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { FlagIcon } from "@/components/flag-icon"

interface CardRow {
  id: string
  front: string
  back: string
  example: string
}

export default function NewDeckPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("en")
  const [level, setLevel] = useState("a2")
  const [visibility, setVisibility] = useState<"private" | "public" | "friends">("private")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [cards, setCards] = useState<CardRow[]>([
    { id: "1", front: "", back: "", example: "" },
  ])
  const [tab, setTab] = useState("manual")
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiCount, setAiCount] = useState("20")
  const [generating, setGenerating] = useState(false)

  const addCard = () =>
    setCards([...cards, { id: Date.now().toString(), front: "", back: "", example: "" }])
  const removeCard = (id: string) => setCards(cards.filter((c) => c.id !== id))
  const updateCard = (id: string, field: keyof CardRow, value: string) =>
    setCards(cards.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput("")
  }

  const filledCount = cards.filter((c) => c.front && c.back).length

  const simulateAI = () => {
    setGenerating(true)
    setTimeout(() => {
      const generated: CardRow[] = Array.from({ length: Number.parseInt(aiCount) || 20 }).map(
        (_, i) => ({
          id: `ai-${Date.now()}-${i}`,
          front: `word_${i + 1}`,
          back: `nghĩa ${i + 1}`,
          example: `This is example sentence ${i + 1}.`,
        }),
      )
      setCards(generated)
      setGenerating(false)
      setTab("manual")
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/practice/vocabulary">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Tạo bộ thẻ mới</h1>
          <p className="text-sm text-muted-foreground">
            Thiết kế deck học từ vựng theo cách riêng của bạn
          </p>
        </div>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
        <Button disabled={!name || filledCount === 0}>
          <Save className="mr-2 h-4 w-4" />
          Lưu deck ({filledCount} thẻ)
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main form */}
        <div className="space-y-6">
          {/* Meta */}
          <Card className="p-6 shadow-ambient">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="name">Tên deck</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: IELTS Speaking - Technology"
                  className="mt-1.5"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="desc">Mô tả</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mục tiêu, chủ đề, đối tượng..."
                  className="mt-1.5 min-h-[80px]"
                />
              </div>
              <div>
                <Label>Ngôn ngữ</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { code: "en", name: "English" },
                      { code: "ja", name: "日本語" },
                      { code: "ko", name: "한국어" },
                      { code: "zh", name: "中文" },
                      { code: "fr", name: "Français" },
                      { code: "es", name: "Español" },
                    ].map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        <div className="flex items-center gap-2">
                          <FlagIcon code={l.code} className="h-4 w-6" />
                          {l.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cấp độ CEFR</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["a1", "a2", "b1", "b2", "c1", "c2"].map((lv) => (
                      <SelectItem key={lv} value={lv}>
                        {lv.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Tags</Label>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 rounded-lg border bg-surface-lowest p-2">
                  {tags.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                    >
                      {t} &times;
                    </Badge>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Thêm tag, nhấn Enter..."
                    className="min-w-[160px] flex-1 bg-transparent px-2 py-1 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Cards builder */}
          <Card className="p-6 shadow-ambient">
            <Tabs value={tab} onValueChange={setTab}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="manual">Tạo thủ công</TabsTrigger>
                  <TabsTrigger value="ai">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    AI gợi ý
                  </TabsTrigger>
                </TabsList>
                {tab === "manual" && (
                  <span className="text-sm text-muted-foreground">
                    {filledCount} / {cards.length} thẻ đã điền
                  </span>
                )}
              </div>

              <TabsContent value="manual" className="space-y-3">
                <AnimatePresence initial={false}>
                  {cards.map((card, idx) => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-[auto_1fr_1fr_2fr_auto] items-start gap-3 rounded-xl border bg-surface-lowest p-3"
                    >
                      <span className="pt-2 text-xs font-medium text-muted-foreground tabular-nums">
                        #{idx + 1}
                      </span>
                      <Input
                        placeholder="Mặt trước (từ)"
                        value={card.front}
                        onChange={(e) => updateCard(card.id, "front", e.target.value)}
                      />
                      <Input
                        placeholder="Mặt sau (nghĩa)"
                        value={card.back}
                        onChange={(e) => updateCard(card.id, "back", e.target.value)}
                      />
                      <Input
                        placeholder="Ví dụ (tuỳ chọn)"
                        value={card.example}
                        onChange={(e) => updateCard(card.id, "example", e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCard(card.id)}
                        disabled={cards.length === 1}
                        aria-label="Xoá thẻ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button
                  variant="outline"
                  className="w-full border-dashed bg-transparent"
                  onClick={addCard}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm thẻ
                </Button>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <div className="rounded-xl border border-dashed bg-surface-low p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Tạo thẻ bằng AI</h3>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Mô tả chủ đề, cấp độ và số lượng. AI sẽ sinh danh sách từ + nghĩa + ví dụ.
                  </p>
                  <Textarea
                    placeholder="VD: 20 từ về chủ đề môi trường, cấp độ B2, có IPA và ví dụ..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="mb-3 min-h-[100px]"
                  />
                  <div className="flex items-center gap-3">
                    <Select value={aiCount} onValueChange={setAiCount}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 30, 50].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} thẻ
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={simulateAI} disabled={!aiPrompt || generating}>
                      {generating ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                          Đang sinh...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Sinh thẻ
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5 shadow-ambient">
            <h3 className="mb-3 text-sm font-semibold">Quyền riêng tư</h3>
            <div className="space-y-2">
              {[
                { v: "private", icon: Lock, label: "Riêng tư", desc: "Chỉ bạn xem được" },
                { v: "friends", icon: Users, label: "Bạn bè", desc: "Chia sẻ với bạn bè" },
                { v: "public", icon: Globe, label: "Công khai", desc: "Mọi người tìm thấy" },
              ].map((opt) => {
                const Icon = opt.icon
                const active = visibility === opt.v
                return (
                  <button
                    key={opt.v}
                    onClick={() => setVisibility(opt.v as typeof visibility)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "hover:bg-surface-low"
                    }`}
                  >
                    <Icon
                      className={`mt-0.5 h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-5 shadow-ambient">
            <h3 className="mb-3 text-sm font-semibold">Cấu hình học</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Tự động phát âm</div>
                  <div className="text-xs text-muted-foreground">
                    Phát audio khi lật thẻ
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Hiển thị IPA</div>
                  <div className="text-xs text-muted-foreground">Phiên âm quốc tế</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Đảo hướng</div>
                  <div className="text-xs text-muted-foreground">
                    Nghĩa → Từ thay vì Từ → Nghĩa
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="bg-primary/5 p-5 shadow-ambient">
            <h3 className="mb-1 text-sm font-semibold">Mẹo tạo deck hiệu quả</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• 15-30 thẻ/deck để tối ưu ghi nhớ</li>
              <li>• Ví dụ ngữ cảnh giúp nhớ lâu hơn 3x</li>
              <li>• Gom theo chủ đề/tình huống</li>
              <li>• Tag giúp tìm lại nhanh</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
