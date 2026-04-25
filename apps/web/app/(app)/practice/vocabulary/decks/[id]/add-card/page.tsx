"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Music2,
  Sparkles,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getDeckById } from "@/lib/vocab-data"

// Mock dictionary suggestions
const dictMock: Record<string, { ipa: string; meaning: string }> = {
  ephemeral: { ipa: "/ɪˈfemərəl/", meaning: "tồn tại trong thời gian ngắn, chóng qua" },
  ubiquitous: { ipa: "/juːˈbɪkwɪtəs/", meaning: "ở khắp mọi nơi, phổ biến" },
  serendipity: { ipa: "/ˌserənˈdɪpəti/", meaning: "sự tình cờ may mắn" },
  quintessential: { ipa: "/ˌkwɪntɪˈsenʃəl/", meaning: "tinh túy, điển hình nhất" },
}

export default function AddCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const deck = getDeckById(id)

  const [lemma, setLemma] = useState("")
  const [ipa, setIpa] = useState("")
  const [meaning, setMeaning] = useState("")
  const [pos, setPos] = useState("noun")
  const [example, setExample] = useState("")
  const [exampleTrans, setExampleTrans] = useState("")
  const [collocations, setCollocations] = useState<string[]>([])
  const [collocInput, setCollocInput] = useState("")
  const [audioFile, setAudioFile] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [difficulty, setDifficulty] = useState([2])
  const [notes, setNotes] = useState("")
  const [mediaOpen, setMediaOpen] = useState(false)

  // Auto-suggest
  useEffect(() => {
    const key = lemma.trim().toLowerCase()
    if (dictMock[key]) {
      if (!ipa) setIpa(dictMock[key].ipa)
      if (!meaning) setMeaning(dictMock[key].meaning)
    }
  }, [lemma]) // eslint-disable-line react-hooks/exhaustive-deps

  const addColloc = () => {
    const v = collocInput.trim()
    if (v && !collocations.includes(v)) setCollocations([...collocations, v])
    setCollocInput("")
  }
  const addTag = () => {
    const v = tagInput.trim()
    if (v && !tags.includes(v)) setTags([...tags, v])
    setTagInput("")
  }
  const reset = () => {
    setLemma(""); setIpa(""); setMeaning(""); setExample(""); setExampleTrans("")
    setCollocations([]); setTags([]); setDifficulty([2]); setNotes("")
    setAudioFile(null); setImageFile(null)
  }

  const suggested = dictMock[lemma.trim().toLowerCase()]

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-32">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/practice/vocabulary" className="hover:text-foreground">Vocabulary</Link>
        <ChevronRight className="size-3" />
        <Link href={`/practice/vocabulary/decks/${id}`} className="hover:text-foreground">{deck.name}</Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium">Thêm thẻ</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight">Thêm thẻ mới</h1>
        <p className="text-muted-foreground mt-1">Điền thông tin chi tiết để thẻ dễ nhớ hơn.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Info column (3 cols) */}
        <div className="space-y-4 lg:col-span-3">
          {/* Section 1 */}
          <Card className="shadow-ambient">
            <CardHeader>
              <CardTitle className="text-base">Thông tin chính</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Lemma <span className="text-destructive">*</span></label>
                <Input
                  value={lemma}
                  onChange={(e) => setLemma(e.target.value)}
                  placeholder="VD: ephemeral"
                  className="mt-1.5 h-12 rounded-xl bg-surface-lowest text-lg font-semibold"
                  autoFocus
                />
                {suggested && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-xs text-accent inline-flex items-center gap-1"
                  >
                    <Sparkles className="size-3" /> Đã tự điền IPA & nghĩa từ từ điển
                  </motion.p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium inline-flex items-center gap-1.5">
                    IPA
                    <a
                      href="https://www.internationalphoneticassociation.org/content/ipa-chart"
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      title="Xem IPA chart"
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  </label>
                  <Input
                    value={ipa}
                    onChange={(e) => setIpa(e.target.value)}
                    placeholder="/ɪˈfemərəl/"
                    className="mt-1.5 rounded-xl bg-surface-lowest font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">POS</label>
                  <Select value={pos} onValueChange={setPos}>
                    <SelectTrigger className="mt-1.5 rounded-xl bg-surface-lowest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noun">Danh từ (noun)</SelectItem>
                      <SelectItem value="verb">Động từ (verb)</SelectItem>
                      <SelectItem value="adj">Tính từ (adj)</SelectItem>
                      <SelectItem value="adv">Trạng từ (adv)</SelectItem>
                      <SelectItem value="prep">Giới từ (prep)</SelectItem>
                      <SelectItem value="conj">Liên từ (conj)</SelectItem>
                      <SelectItem value="interj">Thán từ (interj)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Nghĩa</label>
                <Textarea
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="Nghĩa của từ"
                  rows={2}
                  className="mt-1.5 rounded-xl bg-surface-lowest"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="shadow-ambient">
            <CardHeader>
              <CardTitle className="text-base">Ví dụ & Ngữ cảnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Câu ví dụ</label>
                <Textarea
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="A classic example sentence..."
                  rows={2}
                  className="mt-1.5 rounded-xl bg-surface-lowest italic"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Dịch ví dụ</label>
                <Textarea
                  value={exampleTrans}
                  onChange={(e) => setExampleTrans(e.target.value)}
                  placeholder="Một câu ví dụ điển hình..."
                  rows={2}
                  className="mt-1.5 rounded-xl bg-surface-lowest"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Collocations</label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    value={collocInput}
                    onChange={(e) => setCollocInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColloc())}
                    placeholder="Nhập và bấm Enter"
                    className="rounded-xl bg-surface-lowest"
                  />
                  <Button variant="outline" onClick={addColloc}>Thêm</Button>
                </div>
                {collocations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {collocations.map((c) => (
                      <Badge key={c} variant="secondary" className="gap-1">
                        {c}
                        <button onClick={() => setCollocations(collocations.filter((x) => x !== c))}>
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Organize */}
          <Card className="shadow-ambient">
            <CardHeader>
              <CardTitle className="text-base">Tổ chức</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tags</label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="academic, B2, feeling..."
                    className="rounded-xl bg-surface-lowest"
                  />
                  <Button variant="outline" onClick={addTag}>Thêm</Button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Badge key={t} className="gap-1 bg-accent/20 text-accent border-accent/30">
                        {t}
                        <button onClick={() => setTags(tags.filter((x) => x !== t))}>
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Độ khó: <span className="text-primary">{difficulty[0]}/5</span></label>
                <Slider
                  value={difficulty}
                  onValueChange={setDifficulty}
                  min={1}
                  max={5}
                  step={1}
                  className="mt-4"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ghi chú</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mẹo ghi nhớ, từ đồng nghĩa, lưu ý..."
                  rows={3}
                  className="mt-1.5 rounded-xl bg-surface-lowest"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media column (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="shadow-ambient">
            <Collapsible open={mediaOpen} onOpenChange={setMediaOpen}>
              <CardHeader>
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center justify-between">
                    <CardTitle className="text-base">Media (tuỳ chọn)</CardTitle>
                    <ChevronRight className={cn("size-4 transition", mediaOpen && "rotate-90")} />
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium inline-flex items-center gap-1.5">
                      <Music2 className="size-3" /> Audio
                    </label>
                    <DropZone
                      accept="audio"
                      file={audioFile}
                      onFile={setAudioFile}
                      onClear={() => setAudioFile(null)}
                    />
                    <Input placeholder="Hoặc dán URL audio" className="mt-2 rounded-xl bg-surface-lowest" />
                  </div>
                  <div>
                    <label className="text-sm font-medium inline-flex items-center gap-1.5">
                      <ImagePlus className="size-3" /> Hình ảnh
                    </label>
                    <DropZone
                      accept="image"
                      file={imageFile}
                      onFile={setImageFile}
                      onClear={() => setImageFile(null)}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Live preview */}
          <Card className="shadow-ambient">
            <CardHeader>
              <CardTitle className="text-base">Xem trước</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl bg-gradient-primary p-6 text-center text-white">
                <h3 className="font-display text-3xl font-bold">{lemma || "Từ mới"}</h3>
                {ipa && <p className="mt-1 font-mono text-xs opacity-80">{ipa}</p>}
                <p className="mt-3 text-sm opacity-90">{meaning || "Nghĩa sẽ hiện ở đây"}</p>
                {example && (
                  <p className="mt-3 rounded-xl bg-white/10 p-2 text-xs italic">
                    &ldquo;{example}&rdquo;
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface-lowest/90 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
          <Button variant="ghost" asChild>
            <Link href={`/practice/vocabulary/decks/${id}`}>
              <ArrowLeft className="mr-2 size-4" /> Huỷ
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>Lưu & thêm thẻ mới</Button>
            <Button className="bg-gradient-primary" asChild>
              <Link href={`/practice/vocabulary/decks/${id}`}>Lưu</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DropZone({
  accept,
  file,
  onFile,
  onClear,
}: {
  accept: "audio" | "image"
  file: string | null
  onFile: (name: string) => void
  onClear: () => void
}) {
  const [over, setOver] = useState(false)
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        const f = e.dataTransfer.files[0]
        if (f) onFile(f.name)
      }}
      className={cn(
        "relative mt-1.5 flex min-h-24 items-center justify-center rounded-xl border-2 border-dashed bg-surface-lowest p-4 text-center transition",
        over ? "border-primary bg-primary/5" : "border-border",
      )}
    >
      {file ? (
        <div className="flex w-full items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {accept === "audio" ? <Music2 className="size-4" /> : <ImagePlus className="size-4" />}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="truncate text-sm font-medium">{file}</p>
            <p className="text-xs text-muted-foreground">Đã chọn</p>
          </div>
          <Button size="sm" variant="ghost" onClick={onClear}>
            <X className="size-3" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
          <Upload className="size-5" />
          <span>Kéo thả file hoặc click để chọn</span>
          <span className="text-xs">Tối đa 10MB</span>
        </div>
      )}
    </div>
  )
}
